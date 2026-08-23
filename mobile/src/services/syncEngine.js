import { STORAGE_KEYS, getItem, saveItem } from './storageService';

let outboxQueue = [];
let isProcessing = false;
let syncListeners = [];

export function subscribeToSyncEngine(listener) {
  syncListeners.push(listener);
  return () => {
    syncListeners = syncListeners.filter(l => l !== listener);
  };
}

function notifySyncEngine() {
  syncListeners.forEach(listener => {
    try {
      listener([...outboxQueue]);
    } catch (e) {
      console.warn('[syncEngine] Listener error:', e);
    }
  });
}

/**
 * Generate a unique deterministic client ID for offline logs
 */
export function generateDeterministicLogId(fieldId) {
  const timestamp = Date.now();
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const cleanField = (fieldId || 'FLD').replace(/[^a-zA-Z0-9]/g, '');
  return `LOG-${cleanField}-${timestamp}-${rand}`;
}

/**
 * Initialize outbox queue from persistent disk storage
 */
export async function initSyncEngine() {
  try {
    const savedOutbox = await getItem(STORAGE_KEYS.OUTBOX, []);
    outboxQueue = Array.isArray(savedOutbox) ? savedOutbox : [];
    notifySyncEngine();
    return outboxQueue;
  } catch (error) {
    console.warn('[syncEngine] Error initializing outbox:', error);
    outboxQueue = [];
    return [];
  }
}

/**
 * Get current outbox items
 */
export function getOutboxQueue() {
  return [...outboxQueue];
}

/**
 * Get number of unsynced items in outbox
 */
export function getOutboxCount() {
  return outboxQueue.filter(item => item.status !== 'synced').length;
}

/**
 * Enqueue a new operation log or field action to the outbox queue
 */
export async function enqueueOutboxItem(type, payload) {
  const clientGeneratedId = payload.id || generateDeterministicLogId(payload.fieldId);
  const outboxItem = {
    outboxId: `OUTBOX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    id: clientGeneratedId,
    type: type || 'operation_log', // 'operation_log', 'assignment_request', 'stage_update', 'takeover_log'
    payload: {
      ...payload,
      id: clientGeneratedId,
      createdAt: payload.createdAt || new Date().toISOString(),
      offlineCaptured: true
    },
    status: 'queued', // 'queued', 'syncing', 'failed', 'synced'
    enqueuedAt: new Date().toISOString(),
    retryCount: 0,
    lastAttempt: null,
    lastError: null
  };

  outboxQueue.push(outboxItem);
  await saveItem(STORAGE_KEYS.OUTBOX, outboxQueue);
  notifySyncEngine();
  return outboxItem;
}

/**
 * Remove an item from the outbox after confirmed upload
 */
export async function removeOutboxItem(outboxId) {
  outboxQueue = outboxQueue.filter(item => item.outboxId !== outboxId && item.id !== outboxId);
  await saveItem(STORAGE_KEYS.OUTBOX, outboxQueue);
  notifySyncEngine();
}

/**
 * Mark an outbox item as failed
 */
export async function markOutboxItemFailed(outboxId, errorMessage) {
  const item = outboxQueue.find(i => i.outboxId === outboxId || i.id === outboxId);
  if (item) {
    item.status = 'failed';
    item.retryCount = (item.retryCount || 0) + 1;
    item.lastAttempt = new Date().toISOString();
    item.lastError = errorMessage;
    await saveItem(STORAGE_KEYS.OUTBOX, outboxQueue);
    notifySyncEngine();
  }
}

/**
 * Process all queued outbox items (FIFO) with remote upload handler
 * @param {Function} remoteUploadHandler - Async callback `async (item) => boolean`
 */
export async function processOutbox(remoteUploadHandler) {
  if (isProcessing) return { success: false, reason: 'Already processing' };
  if (outboxQueue.length === 0) return { success: true, processedCount: 0 };

  isProcessing = true;
  let processedCount = 0;
  let failedCount = 0;

  try {
    const itemsToProcess = [...outboxQueue];

    for (const item of itemsToProcess) {
      item.status = 'syncing';
      item.lastAttempt = new Date().toISOString();
      notifySyncEngine();

      try {
        let isSuccess = true;
        if (typeof remoteUploadHandler === 'function') {
          isSuccess = await remoteUploadHandler(item);
        }

        if (isSuccess) {
          item.status = 'synced';
          processedCount++;
          // Remove from outbox
          outboxQueue = outboxQueue.filter(q => q.outboxId !== item.outboxId);
        } else {
          item.status = 'failed';
          item.retryCount = (item.retryCount || 0) + 1;
          item.lastError = 'Remote rejected or network unavailable';
          failedCount++;
        }
      } catch (err) {
        item.status = 'failed';
        item.retryCount = (item.retryCount || 0) + 1;
        item.lastError = err.message || 'Sync connection timeout';
        failedCount++;
      }
    }

    await saveItem(STORAGE_KEYS.OUTBOX, outboxQueue);
    await saveItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    notifySyncEngine();

    return {
      success: failedCount === 0,
      processedCount,
      failedCount,
      remainingCount: outboxQueue.length
    };
  } finally {
    isProcessing = false;
  }
}

/**
 * Flush all outbox items directly to Cloud Firestore (hugpong-ff)
 */
export async function flushOutboxToFirestore() {
  try {
    const { db } = require('../firebase/config');
    const { doc, setDoc } = require('firebase/firestore');

    if (!db) {
      console.warn('[syncEngine] Firestore instance not initialized, skipping cloud flush.');
      return { success: false, reason: 'Firestore unavailable' };
    }

    return await processOutbox(async (item) => {
      const { type, payload } = item;

      if (type === 'operation_log' || type === 'takeover_log') {
        const docRef = doc(db, 'operation_logs', payload.id);
        await setDoc(docRef, {
          ...payload,
          synced: true,
          syncedAt: new Date().toISOString()
        }, { merge: true });

        // Update corresponding field plot stage
        if (payload.stage && payload.fieldId) {
          const fieldRef = doc(db, 'fields', payload.fieldId);
          await setDoc(fieldRef, {
            stage: payload.stage,
            lastSync: 'Just now',
            synced: true,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
        return true;
      } else if (type === 'ticket') {
        const docRef = doc(db, 'support_tickets', payload.id);
        await setDoc(docRef, { ...payload, synced: true, syncedAt: new Date().toISOString() }, { merge: true });
        return true;
      } else if (type === 'stage_update') {
        const fieldRef = doc(db, 'fields', payload.fieldId);
        await setDoc(fieldRef, {
          stage: payload.stage,
          lastSync: 'Just now',
          synced: true,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        return true;
      }
      return true;
    });
  } catch (err) {
    console.warn('[syncEngine] Error flushing to Firestore:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Clear the entire outbox queue (e.g. on cache wipe)
 */
export async function clearOutbox() {
  outboxQueue = [];
  await saveItem(STORAGE_KEYS.OUTBOX, []);
  notifySyncEngine();
  return true;
}
