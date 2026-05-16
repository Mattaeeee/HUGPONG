import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import EmptyState from '../components/EmptyState';
import { confirmRetryUpload, confirmClearQueue, confirmConflictOverwriteLocal, confirmConflictKeepLocal } from '../utils/dialogs';

const STATUS_CFG = {
  pending: { label: 'Pending', icon: 'time-outline', color: '#F5A623', bg: '#FFF3DC' },
  uploading: { label: 'Uploading', icon: 'cloud-upload-outline', color: COLORS.blue, bg: '#E0F0FA' },
  failed: { label: 'Failed', icon: 'close-circle-outline', color: '#D9534F', bg: '#FFF0F0' },
  synced: { label: 'Synced', icon: 'checkmark-circle-outline', color: COLORS.success, bg: COLORS.successLight },
  conflict: { label: 'Conflict', icon: 'warning-outline', color: '#9B59B6', bg: '#F3E8FC' },
};

const MOCK_QUEUE = [
  { id: '1', type: 'Task Completion', desc: 'Fertilization – Plot 4', status: 'failed', time: '10:32 AM', size: '2.1 KB' },
  { id: '2', type: 'Resource Log', desc: '12 bags Urea applied – Sector B', status: 'pending', time: '10:45 AM', size: '1.4 KB' },
  { id: '3', type: 'Schedule Update', desc: 'Weeding – Plot 7 rescheduled', status: 'pending', time: '11:02 AM', size: '0.8 KB' },
  { id: '4', type: 'Price View Log', desc: 'HPCo Silay price viewed', status: 'synced', time: '8:15 AM', size: '0.3 KB' },
];

const MOCK_CONFLICTS = [
  { id: 'c1', record: 'Task: Harvesting – Plot 2', localTime: 'Today 9:44 AM', cloudTime: 'Today 10:01 AM', localUser: 'You', cloudUser: 'System Auto-Sync' },
  { id: 'c2', record: 'Resource Log: Pesticide – Sector A', localTime: 'Yesterday 4:10 PM', cloudTime: 'Yesterday 4:22 PM', localUser: 'You', cloudUser: 'Gabe (Sync)' },
];

export default function SyncMonitorScreen({ navigation }) {
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [conflicts, setConflicts] = useState(MOCK_CONFLICTS);
  const [activeTab, setActiveTab] = useState('queue');

  const pending = queue.filter(q => q.status === 'pending').length;
  const failed = queue.filter(q => q.status === 'failed').length;
  const synced = queue.filter(q => q.status === 'synced').length;

  const retryItem = (item) => {
    confirmRetryUpload({
      recordName: item.desc,
      onRetry: () => {
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'uploading' } : q));
        setTimeout(() => {
          setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'synced' } : q));
        }, 2000);
      },
    });
  };

  const clearQueue = () => {
    confirmClearQueue({ onClear: () => setQueue(prev => prev.filter(q => q.status === 'synced')) });
  };

  const resolveConflict = (conflict, useCloud) => {
    const action = useCloud ? confirmConflictOverwriteLocal : confirmConflictKeepLocal;
    action({
      recordName: conflict.record,
      onConfirm: () => setConflicts(prev => prev.filter(c => c.id !== conflict.id)),
    });
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Sync Monitor</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Stats Bar */}
      <View style={s.statsBar}>
        <View style={s.statItem}>
          <Text style={[s.statNum, { color: '#F5A623' }]}>{pending}</Text>
          <Text style={s.statLabel}>Pending</Text>
        </View>
        <View style={s.statDiv} />
        <View style={s.statItem}>
          <Text style={[s.statNum, { color: '#D9534F' }]}>{failed}</Text>
          <Text style={s.statLabel}>Failed</Text>
        </View>
        <View style={s.statDiv} />
        <View style={s.statItem}>
          <Text style={[s.statNum, { color: '#9B59B6' }]}>{conflicts.length}</Text>
          <Text style={s.statLabel}>Conflicts</Text>
        </View>
        <View style={s.statDiv} />
        <View style={s.statItem}>
          <Text style={[s.statNum, { color: COLORS.success }]}>{synced}</Text>
          <Text style={s.statLabel}>Synced</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabBar}>
        {[['queue', 'Upload Queue'], ['conflicts', `Conflicts ${conflicts.length > 0 ? `(${conflicts.length})` : ''}`]].map(([k, l]) => (
          <TouchableOpacity key={k} style={[s.tab, activeTab === k && s.tabActive]} onPress={() => setActiveTab(k)}>
            <Text style={[s.tabText, activeTab === k && s.tabTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* ── QUEUE TAB ── */}
        {activeTab === 'queue' && <>
          {queue.length === 0 ? (
            <EmptyState icon="cloud-done-outline" title="Queue is empty" subtitle="All records have been synced successfully." iconColor={COLORS.success} />
          ) : (
            queue.map(item => {
              const cfg = STATUS_CFG[item.status];
              return (
                <View key={item.id} style={s.queueCard}>
                  <View style={[s.queueIcon, { backgroundColor: cfg.bg }]}>
                    <Ionicons name={cfg.icon} size={18} color={cfg.color} />
                  </View>
                  <View style={s.queueBody}>
                    <Text style={s.queueType}>{item.type}</Text>
                    <Text style={s.queueDesc}>{item.desc}</Text>
                    <Text style={s.queueMeta}>{item.time} · {item.size}</Text>
                  </View>
                  <View style={s.queueRight}>
                    <View style={[s.statusBadge, { backgroundColor: cfg.bg }]}>
                      <Text style={[s.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                    </View>
                    {item.status === 'failed' && (
                      <TouchableOpacity style={s.retryBtn} onPress={() => retryItem(item)}>
                        <Ionicons name="refresh" size={14} color={COLORS.primary} />
                        <Text style={s.retryBtnText}>Retry</Text>
                      </TouchableOpacity>
                    )}
                    {item.status === 'uploading' && (
                      <Text style={s.uploadingText}>Uploading...</Text>
                    )}
                  </View>
                </View>
              );
            })
          )}

          {queue.some(q => q.status !== 'synced') && (
            <TouchableOpacity style={s.clearBtn} onPress={clearQueue}>
              <Ionicons name="trash-outline" size={15} color="#D9534F" />
              <Text style={s.clearBtnText}>Clear Pending Queue</Text>
            </TouchableOpacity>
          )}
        </>}

        {/* ── CONFLICTS TAB ── */}
        {activeTab === 'conflicts' && <>
          {conflicts.length === 0 ? (
            <EmptyState icon="checkmark-done-circle-outline" title="No conflicts" subtitle="All sync conflicts have been resolved." iconColor={COLORS.success} />
          ) : (
            <>
              <View style={s.conflictNotice}>
                <Ionicons name="information-circle" size={16} color={COLORS.blue} />
                <Text style={s.conflictNoticeText}>
                  Conflicts occur when the same record was edited both offline and by another session. Choose which version to keep.
                </Text>
              </View>
              {conflicts.map(c => (
                <View key={c.id} style={s.conflictCard}>
                  <View style={s.conflictHeader}>
                    <Ionicons name="warning" size={16} color="#9B59B6" />
                    <Text style={s.conflictRecord}>{c.record}</Text>
                  </View>
                  <View style={s.conflictVersions}>
                    <View style={[s.versionBox, s.versionLocal]}>
                      <Text style={s.versionLabel}>📱  Your Version</Text>
                      <Text style={s.versionUser}>{c.localUser}</Text>
                      <Text style={s.versionTime}>{c.localTime}</Text>
                    </View>
                    <Text style={s.versionVs}>vs</Text>
                    <View style={[s.versionBox, s.versionCloud]}>
                      <Text style={s.versionLabel}>☁️  Cloud Version</Text>
                      <Text style={s.versionUser}>{c.cloudUser}</Text>
                      <Text style={s.versionTime}>{c.cloudTime}</Text>
                    </View>
                  </View>
                  <View style={s.conflictActions}>
                    <TouchableOpacity style={s.keepLocalBtn} onPress={() => resolveConflict(c, false)}>
                      <Text style={s.keepLocalText}>Keep Mine</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.useCloudBtn} onPress={() => resolveConflict(c, true)}>
                      <Text style={s.useCloudText}>Use Cloud</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}
        </>}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  statsBar: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: COLORS.textMuted },
  statDiv: { width: 1, backgroundColor: COLORS.border },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '500', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  scroll: { padding: SPACING.lg, gap: SPACING.sm },
  // Queue
  queueCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, gap: SPACING.md, alignItems: 'flex-start', ...SHADOW.card },
  queueIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  queueBody: { flex: 1, gap: 2 },
  queueType: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  queueDesc: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  queueMeta: { fontSize: 10, color: COLORS.textMuted },
  queueRight: { alignItems: 'flex-end', gap: 6 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '700' },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  retryBtnText: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },
  uploadingText: { fontSize: 10, color: COLORS.blue, fontWeight: '600' },
  clearBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: '#FCCAC8', borderRadius: RADIUS.md, paddingVertical: 12, backgroundColor: '#FFF0F0', marginTop: SPACING.sm },
  clearBtnText: { fontSize: 13, fontWeight: '700', color: '#D9534F' },
  // Conflicts
  conflictNotice: { flexDirection: 'row', gap: 8, backgroundColor: '#E0F0FA', borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'flex-start' },
  conflictNoticeText: { flex: 1, fontSize: 12, color: COLORS.blue, lineHeight: 18 },
  conflictCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, gap: SPACING.md, ...SHADOW.card, borderLeftWidth: 3, borderLeftColor: '#9B59B6' },
  conflictHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  conflictRecord: { fontSize: 14, fontWeight: '700', color: COLORS.text, flex: 1 },
  conflictVersions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  versionBox: { flex: 1, borderRadius: RADIUS.md, padding: SPACING.md, gap: 3 },
  versionLocal: { backgroundColor: '#F0FFF4' },
  versionCloud: { backgroundColor: '#F0F8FF' },
  versionLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary },
  versionUser: { fontSize: 12, fontWeight: '700', color: COLORS.text },
  versionTime: { fontSize: 10, color: COLORS.textMuted },
  versionVs: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, flexShrink: 0 },
  conflictActions: { flexDirection: 'row', gap: SPACING.sm },
  keepLocalBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 10, alignItems: 'center' },
  keepLocalText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  useCloudBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 10, alignItems: 'center' },
  useCloudText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});
