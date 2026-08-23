import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Animated, Dimensions, TextInput, Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import AppHeader from '../components/AppHeader';
import { subscribe, getCurrentSession, setSynced, setSession, updateSessionFieldId, getIsSynced, MOCK_ASSIGNMENT_REQUESTS, resolveAssignmentRequest, requestFieldAssignment, MOCK_FIELDS, MOCK_LOGS, DRAFT_LOGS, notifyDataUpdate, SRA_PRICE_HISTORY, addSRAPrice, MOCK_MANAGERS, updateFieldCustomStages, getMemberSyncHealth, performMobileSync } from '../data/mockData';
import { enqueueOutboxItem } from '../services/syncEngine';
import { useTranslation } from '../services/i18n';

const { height, width } = Dimensions.get('window');


const MEMBER_FIELD = MOCK_FIELDS[0]; // The currently logged-in member's field

// SRA standard default template — used when a field has no custom stages
const CYCLE_TASKS = [
  { id: 'T1', phase: 'Land Prep', icon: 'construct', color: '#8F3A8F', month: 0, label: 'Land Preparation', done: true },
  { id: 'T2', phase: 'Planting', icon: 'leaf', color: '#4A7C2F', month: 1, label: 'Planting', done: true },
  { id: 'T3', phase: 'Pre-emergence', icon: 'water', color: '#1A6B9A', month: 1.25, label: 'Pre-emergence Spraying', done: true },
  { id: 'T4', phase: 'Fert Stage 1', icon: 'archive', color: '#1A6B9A', month: 2.5, label: 'Fertilization Stage 1 (18-46) & Ridge Busting', done: true },
  { id: 'T5', phase: 'Fert Stage 2', icon: 'flask', color: '#4A7C2F', month: 3.5, label: 'Weeding, Fertilization Stage 2 (Urea) & Off-barring', done: false, active: true },
  { id: 'T6', phase: 'Fert Stage 3', icon: 'flask', color: '#F5A623', month: 4.5, label: 'Weeding, Fertilization Stage 3 (Urea + Potash) & On-barring', done: false },
  { id: 'T7', phase: 'Off-barring', icon: 'git-branch', color: '#8A9B7A', month: 5.5, label: 'Final Off-barring', done: false },
  { id: 'T8', phase: 'Harvest', icon: 'basket', color: '#D9534F', month: 10.5, label: 'Harvesting & Milling', done: false },
];

// Preset colour palette for custom stages
const STAGE_COLORS = [
  '#8F3A8F', '#4A7C2F', '#1A6B9A', '#F5A623', '#D9534F',
  '#267326', '#C97A00', '#5B4DA7', '#8A9B7A', '#2A7F8F',
];

// Returns the active stage list for a field — custom if defined, else empty (member initializes)
const getFieldStages = (fieldId) => {
  const field = MOCK_FIELDS.find(f => f.id === fieldId);
  if (field?.customStages && field.customStages.length > 0) return field.customStages;
  return [];
};

const STATUS_COLORS = { approved: COLORS.success, pending: '#F5A623', flagged: '#D9534F' };

// Standard agricultural benchmarks aligned with Planner calculations
const STAGE_INPUT_BENCHMARKS = {
  'T1': { inputName: 'Tractor Plowing & Furrowing', inputQty: '1', inputUnit: 'ha', estimatedCost: '4500', people: '2' },
  'T2': { inputName: 'Cane Points (Patdan)', inputQty: '40000', inputUnit: 'pcs', estimatedCost: '14000', people: '10' },
  'T3': { inputName: 'Pre-emergence Herbicide', inputQty: '3', inputUnit: 'liters', estimatedCost: '3500', people: '4' },
  'T4': { inputName: '18-46 Fertilizer', inputQty: '3', inputUnit: 'bags', estimatedCost: '6600', people: '3' },
  'T5': { inputName: 'Urea (46-0-0) Fertilizer', inputQty: '4', inputUnit: 'bags', estimatedCost: '7400', people: '4' },
  'T6': { inputName: 'Urea + Potash (MOP)', inputQty: '5', inputUnit: 'bags', estimatedCost: '9050', people: '4' },
  'T7': { inputName: 'Final Off-barring (Tractor)', inputQty: '1', inputUnit: 'ha', estimatedCost: '2500', people: '2' },
  'T8': { inputName: 'Harvesting & Hauling', inputQty: '60', inputUnit: 'tons', estimatedCost: '21000', people: '12' },
};

export default function FieldOpsScreen({ navigation, route }) {
  const { t, formatSyncTime } = useTranslation();
  const [activeRole, setActiveRole] = useState(getCurrentSession().role);
  const [selectedFarm, setSelectedFarm] = useState('All Block Farms');
  const [selectedField, setSelectedField] = useState(MOCK_FIELDS[0]);

  useEffect(() => {
    const unsub = subscribe(() => {
      setActiveRole(getCurrentSession().role);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (route?.params?.takeOverFieldId) {
      const targetF = MOCK_FIELDS.find(f => f.id === route.params.takeOverFieldId);
      if (targetF) {
        setSelectedField(targetF);
        updateSessionFieldId(targetF.id);
        if (route.params.isTakeOver) {
          setIsTakeOver(true);
        }
      }
    }
  }, [route?.params]);
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [showLog, setShowLog] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [manualQR, setManualQR] = useState('');
  const [logForm, setLogForm] = useState({ id: null, fieldId: '', saveFieldId: true, activity: '', cost: '', period: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), hectares: '', people: '', inputQty: '', inputUnit: 'bags', inputName: '', taskId: null, isSubmit: true });
  const [draftLogs, setDraftLogs] = useState(DRAFT_LOGS);
  const [logTab, setLogTab] = useState('submitted');
  const [managerLogTab, setManagerLogTab] = useState('all');
  const [managerFieldFilter, setManagerFieldFilter] = useState('my');
  const [logSearch, setLogSearch] = useState('');
  const [logCategoryFilter, setLogCategoryFilter] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [logCurrentPage, setLogCurrentPage] = useState(1);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [synced, setSyncedState] = useState(getIsSynced());
  const [requests, setRequests] = useState(MOCK_ASSIGNMENT_REQUESTS);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calDate, setCalDate] = useState(new Date(2026, 4, 21));
  const [showAddField, setShowAddField] = useState(false);
  const [isTakeOver, setIsTakeOver] = useState(false);
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [fieldSearch, setFieldSearch] = useState('');
  const [showManagerAssignModal, setShowManagerAssignModal] = useState(false);
  const [managerAssignForm, setManagerAssignForm] = useState({ memberName: '', fieldId: '', ha: '' });

  const openAssignModal = (fieldToEdit = null) => {
    if (fieldToEdit) {
      setManagerAssignForm({
        userId: fieldToEdit.memberContact || fieldToEdit.userId || fieldToEdit.member || '',
        fieldId: fieldToEdit.id,
        ha: String(fieldToEdit.ha || '1.5'),
        isEditing: true
      });
    } else {
      const nextNum = MOCK_FIELDS.length + 1;
      const generatedId = `FLD-KTR-${String(nextNum).padStart(3, '0')}`;
      setManagerAssignForm({ userId: '', fieldId: generatedId, ha: '', isEditing: false });
    }
    setShowManagerAssignModal(true);
  };

  const [showStageEditor, setShowStageEditor] = useState(false);
  const [editingStages, setEditingStages] = useState([]);
  const [newStageLabel, setNewStageLabel] = useState('');
  const [newStageColor, setNewStageColor] = useState(STAGE_COLORS[0]);
  const handleGenerateAudit = () => {
    if (!synced) {
      Alert.alert('Offline Mode', 'You are currently offline. Please connect to the internet to generate reports.');
      return;
    }

    const offlineLogs = logs.filter(l => l.isOffline);
    
    if (offlineLogs.length > 0) {
      const warningMessage = `There are ${offlineLogs.length} offline logs waiting to be synced by field members. You should ask them to sync before generating the final report.`;

      Alert.alert(
        'Action Required Before Export',
        warningMessage,
        [
          { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
          { text: 'Generate Anyway', onPress: () => checkMissingFields(), style: 'destructive' }
        ]
      );
      return;
    }

    checkMissingFields();
  };

  const checkMissingFields = () => {
    const missingFields = [];
    MOCK_FIELDS.forEach(field => {
      const fieldTasks = cycleTasksByField[field.id] || [];
      const activeTask = fieldTasks.find(t => t.active);
      if (activeTask) {
        const hasLog = logs.some(l => l.fieldId === field.id && l.taskId === activeTask.id && !l.declined);
        if (!hasLog) {
          missingFields.push(field.id);
        }
      }
    });

    if (missingFields.length > 0) {
      Alert.alert(
        'Incomplete Logs Warning',
        `Operation logs are incomplete! The following fields are missing a log for their current active stage:\n\n${missingFields.join('\n')}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Generate Anyway', onPress: () => setShowQR(true), style: 'destructive' }
        ]
      );
    } else {
      setShowQR(true);
    }
  };
  const [reqFieldId, setReqFieldId] = useState('');
  const [reqFieldHa, setReqFieldHa] = useState('');
  const [sraPriceInput, setSraPriceInput] = useState('');
  const [cycleTasksByField, setCycleTasksByField] = useState({
    [MOCK_FIELDS[0].id]: getFieldStages(MOCK_FIELDS[0].id),
  });
  const slideAnim = useRef(new Animated.Value(height)).current;

  const toggleTaskStatus = (taskId, forceComplete = false) => {
    if (activeRole === 'SRA (Admin)') return;
    
    const session = getCurrentSession();
    const isMyField = selectedField.member === session.name;
    if (activeRole === 'Farm Manager' && !isMyField && !isTakeOver) {
      Alert.alert(
        'Supervisor Takeover Required',
        'This field is managed by ' + selectedField.member + '. To record stage work or make changes, please tap "Take Over Field" on the field card first.'
      );
      return;
    }

    const fieldTasks = cycleTasksByField[selectedField.id] || [];
    const taskIndex = fieldTasks.findIndex(t => t.id === taskId);
    const targetTask = fieldTasks[taskIndex];
    if (!targetTask) return;

    const applyToggle = () => {
      const currentTasks = cycleTasksByField[selectedField.id] || [];
      const updated = currentTasks.map(t => {
        if (t.id === taskId) {
          if (forceComplete) return { ...t, done: true, active: false };
          if (t.done) return { ...t, done: false, active: false };
          if (t.active) return { ...t, done: true, active: false };
          return { ...t, done: false, active: true };
        }
        if (!targetTask.active && !targetTask.done && t.active && !forceComplete) {
          return { ...t, active: false };
        }
        return t;
      });

      let isFullyCompleted = false;
      if (targetTask.active || forceComplete) {
        updated.forEach(t => t.active = false);
        const nextIndex = updated.findIndex(t => !t.done);
        if (nextIndex === -1) {
          isFullyCompleted = true;
        }
      }

      const activeTask = updated.find(t => t.active);
      const newStageLabel = activeTask ? activeTask.label : (isFullyCompleted ? 'Harvesting & Milling (Completed)' : 'Waiting to Start Next Stage');
      
      setSelectedField(prevF => ({ ...prevF, stage: newStageLabel }));
      const mf = MOCK_FIELDS.find(f => f.id === selectedField.id);
      if (mf) mf.stage = newStageLabel;

      setCycleTasksByField(prev => ({ ...prev, [selectedField.id]: updated }));

      if (isFullyCompleted) {
        setTimeout(() => {
          Alert.alert(
            'Crop Cycle Completed!',
            'All stages for this field are complete. Would you like to reset the timeline for a new crop cycle?',
            [
              { text: 'Not Now', style: 'cancel' },
              { text: 'Start New Cycle', style: 'default', onPress: () => {
                 const resetStages = (selectedField.customStages?.length > 0 ? selectedField.customStages : CYCLE_TASKS).map((t) => ({...t, done: false, active: false}));
                 setCycleTasksByField(p => ({
                   ...p,
                   [selectedField.id]: resetStages
                 }));
                 setSelectedField(prevF => ({ ...prevF, stage: 'Not Started' }));
                 const resetMf = MOCK_FIELDS.find(f => f.id === selectedField.id);
                 if (resetMf) resetMf.stage = 'Not Started';
                 
                 // Mark logs as past cycle instead of deleting
                 MOCK_LOGS.forEach(l => {
                   if (l.fieldId === selectedField.id) l.isPastCycle = true;
                 });
                 setLogs([...MOCK_LOGS]);
                 
                 // Drafts from previous cycle can be safely removed
                 setDraftLogs(prev => prev.filter(d => d.fieldId !== selectedField.id));
              }}
            ]
          );
        }, 500);
      }
    };

    const isProgressing = !targetTask.done;
    
    if (isProgressing && taskIndex > 0) {
      const hasPendingPrior = fieldTasks.slice(0, taskIndex).some(t => !t.done);
      if (hasPendingPrior) {
        if (activeRole === 'Member') {
          Alert.alert('Action Denied', 'You cannot skip ahead. Please submit logs and mark the previous stages as complete first.');
          return;
        }
        Alert.alert(
          'Skip Stage Warning',
          'Previous stages in the crop cycle are not yet completed. Are you sure you want to jump ahead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes, Skip Ahead', onPress: applyToggle, style: 'destructive' }
          ]
        );
        return;
      }
    } 

    if (!targetTask.active && !targetTask.done && !forceComplete) {
       Alert.alert(
         'Activate Stage',
         `Start working on "${targetTask.label}"?`,
         [
           { text: 'Cancel', style: 'cancel' },
           { text: 'Activate', onPress: applyToggle, style: 'default' }
         ]
       );
       return;
    }

    if (targetTask.active && !forceComplete) {
      const stageDrafts = draftLogs.filter(d => d.taskId === targetTask.id && d.fieldId === selectedField.id);
      if (stageDrafts.length > 0) {
        editDraft(stageDrafts[0]);
      } else {
        const benchmark = STAGE_INPUT_BENCHMARKS[targetTask.id];
        const haNum = parseFloat(selectedField.ha) || 1.0;
        setLogForm({
          id: null,
          fieldId: selectedField.id,
          saveFieldId: true,
          activity: targetTask.label,
          cost: benchmark ? Math.round(parseFloat(benchmark.estimatedCost) * haNum).toString() : '',
          period: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          hectares: selectedField.ha || '1.5',
          people: benchmark?.people || '4',
          inputQty: benchmark ? (parseFloat(benchmark.inputQty) * haNum).toString() : '',
          inputUnit: benchmark?.inputUnit || 'bags',
          inputName: benchmark?.inputName || '',
          taskId: targetTask.id,
          isSubmit: true
        });
        setShowLog(true);
        Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
      }
      return;
    } else if (!isProgressing) {
      if (activeRole === 'Member') {
        Alert.alert('Action Denied', 'Members cannot revert completed stages. Please contact your Farm Manager if you made a mistake.');
        return;
      }
      const hasSubmittedLogs = logs.some(l => l.fieldId === selectedField.id && l.taskId === taskId);
      if (hasSubmittedLogs) {
        Alert.alert('Cannot Revert', 'This stage already has submitted logs. Please delete or decline them first before reverting.');
        return;
      }
      Alert.alert(
        'Revert Stage',
        'Are you sure you want to revert this completed stage back to pending?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes, Revert', onPress: applyToggle, style: 'destructive' }
        ]
      );
      return;
    }

    applyToggle();
  };

  useEffect(() => {
    // Initial sync
    const initialSession = getCurrentSession();
    if (initialSession.fieldId) {
      const found = MOCK_FIELDS.find(f => f.id === initialSession.fieldId);
      if (found) {
        setSelectedField(found);
      } else {
        setSelectedField(MOCK_FIELDS[0]);
      }
    } else {
      setSelectedField(MOCK_FIELDS[0]);
    }
    const unsubscribe = subscribe(() => {
      const session = getCurrentSession();
      setActiveRole(session.role);
      if (session.fieldId) {
        const found = MOCK_FIELDS.find(f => f.id === session.fieldId);
        if (found) {
          setSelectedField(found);
        } else {
          setSelectedField(prev => prev || MOCK_FIELDS[0]);
        }
      }
      setSyncedState(getIsSynced());
      setRequests([...MOCK_ASSIGNMENT_REQUESTS]);
      setLogs([...MOCK_LOGS]);
      setDraftLogs([...DRAFT_LOGS]);
    });
    return unsubscribe;
  }, []);

  const handleRequestField = () => {
    if (!reqFieldId.trim() || !reqFieldHa.trim()) {
      Alert.alert('Required', 'Please enter a Field ID and Hectares (HA).');
      return;
    }
    const haValue = parseFloat(reqFieldHa);
    if (isNaN(haValue) || haValue <= 0 || haValue > 100) {
      Alert.alert('Invalid', 'Please enter a valid hectare size (between 0.1 and 100).');
      return;
    }
    requestFieldAssignment(reqFieldId.trim().toUpperCase(), getCurrentSession().name, haValue.toFixed(1));
    Alert.alert('Request Sent', `Assignment request for ${reqFieldId.toUpperCase()} (${haValue.toFixed(1)} Ha) has been sent to the Farm Manager for approval.`);
    setReqFieldId('');
    setReqFieldHa('');
    setShowAddField(false);
  };

  const openLog = () => {
    setLogForm(p => ({
      ...p,
      id: null,
      fieldId: selectedField.id,
      saveFieldId: true,
      activity: '',
      cost: '',
      hectares: selectedField.ha || '1.5',
      people: '',
      inputQty: '',
      inputUnit: 'bags',
      inputName: '',
      period: p.period || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isSubmit: true
    }));
    setShowLog(true);
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  };

  const closeLog = () => {
    Animated.timing(slideAnim, { toValue: height, duration: 220, useNativeDriver: true }).start(() => setShowLog(false));
  };

  const handleSaveLog = (asSubmit = true, forceCostConfirm = false, forceDuplicateConfirm = false) => {
    if (!logForm.activity.trim() || !logForm.cost || !logForm.fieldId?.trim() || !logForm.period?.trim() || !logForm.hectares || !logForm.people) {
      Alert.alert('Required', 'Please fill in Date, Activity, Operational Cost, Hectares, and Workers.');
      return;
    }
    
    const costValue = parseFloat(logForm.cost);
    const ha = parseFloat(logForm.hectares);
    const ppl = parseInt(logForm.people);

    if (isNaN(costValue) || costValue < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive number for Operational Cost.');
      return;
    }
    if (isNaN(ha) || ha <= 0 || isNaN(ppl) || ppl <= 0) {
      Alert.alert('Invalid Input', 'Hectares and Workers must be positive numbers greater than 0.');
      return;
    }
    if (ha > 50) { Alert.alert('Invalid Input', 'Hectares cannot exceed 50 per log.'); return; }
    if (ppl > 100) { Alert.alert('Invalid Input', 'Worker count cannot exceed 100 per log.'); return; }

    // FIX 4: Block future dates (back-dating up to 30 days is allowed)
    const parsedDate = new Date(logForm.period);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (!isNaN(parsedDate.getTime()) && parsedDate > today) {
      Alert.alert('Invalid Date', 'You cannot set a future date for completed work. Please select today or an earlier date.');
      return;
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (!isNaN(parsedDate.getTime()) && parsedDate < thirtyDaysAgo) {
      Alert.alert('Date Too Old', 'Logs cannot be back-dated more than 30 days. Contact your Farm Manager for corrections beyond this period.');
      return;
    }

    // FIX 2: Cost warning threshold for unusually high amounts
    const isCostConfirmed = forceCostConfirm || logForm._costConfirmed;
    if (costValue > 25000 && !isCostConfirmed) {
      Alert.alert(
        'Unusual Cost Amount',
        `You entered Php ${costValue.toLocaleString()}. This is higher than the typical per-operation cost. Are you sure this is correct?`,
        [
          { text: 'Go Back & Fix', style: 'cancel' },
          { text: 'Yes, Correct Amount', onPress: () => {
            setLogForm(prev => ({ ...prev, _costConfirmed: true }));
            handleSaveLog(asSubmit, true, forceDuplicateConfirm);
          }}
        ]
      );
      return;
    }

    const submittedFieldId = logForm.fieldId.trim().toUpperCase();

    // FIX 3: Duplicate detection (same field + activity + date + cost)
    const isDupConfirmed = forceDuplicateConfirm || logForm._duplicateConfirmed;
    if (asSubmit && !logForm.id) {
      const isDuplicate = MOCK_LOGS.some(l =>
        l.fieldId === submittedFieldId &&
        l.activity === logForm.activity.trim() &&
        l.date === (logForm.period || '') &&
        l.cost === costValue
      );
      if (isDuplicate && !isDupConfirmed) {
        Alert.alert(
          'Possible Duplicate',
          `A log with the same activity, cost, and date already exists for ${submittedFieldId}. Do you still want to submit?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Submit Anyway', style: 'destructive', onPress: () => {
              setLogForm(prev => ({ ...prev, _duplicateConfirmed: true }));
              handleSaveLog(asSubmit, isCostConfirmed, true);
            }}
          ]
        );
        return;
      }
    }

    const newLog = {
      id: logForm.id || `L${Date.now()}`,
      fieldId: submittedFieldId,
      activity: logForm.activity,
      cost: costValue,
      hectares: logForm.hectares,
      people: logForm.people,
      inputQty: logForm.inputQty || '',
      inputUnit: logForm.inputUnit || '',
      inputName: logForm.inputName || '',
      date: logForm.period || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      approved: true,
      taskId: logForm.taskId,
      isOffline: !synced,
      editHistory: [],
    };

    if (!MOCK_FIELDS.find(f => f.id === submittedFieldId)) {
      MOCK_FIELDS.push({ id: submittedFieldId, member: getCurrentSession().name || 'Current User', ha: logForm.hectares || '0.0', stage: 'Newly Logged', month: 0, synced: false, lastSync: 'Just now', customStages: [] });
    }

    if (asSubmit) {
      if (logForm.id) {
        // Check if updating an existing submitted log
        const logIdx = MOCK_LOGS.findIndex(l => l.id === logForm.id);
        if (logIdx >= 0) {
          // FIX 1: Audit trail — preserve original values before overwriting
          const originalLog = { ...MOCK_LOGS[logIdx] };
          const editRecord = {
            editedBy: getCurrentSession().name,
            editedRole: activeRole,
            editedAt: new Date().toLocaleString('en-PH'),
            previousValues: {
              activity: originalLog.activity,
              cost: originalLog.cost,
              hectares: originalLog.hectares,
              people: originalLog.people,
              inputQty: originalLog.inputQty,
              inputUnit: originalLog.inputUnit,
              inputName: originalLog.inputName,
              date: originalLog.date,
            }
          };
          const existingHistory = MOCK_LOGS[logIdx].editHistory || [];
          MOCK_LOGS[logIdx] = { ...newLog, id: logForm.id, editHistory: [...existingHistory, editRecord] };
          setLogs([...MOCK_LOGS]);
          setLogTab('submitted');
          notifyDataUpdate();
          Alert.alert('Log Updated', `Operation log "${newLog.activity}" has been updated.\n\nEdit recorded by: ${getCurrentSession().name} (${activeRole})`);
          setLogForm({ id: null, fieldId: selectedField.id, saveFieldId: true, activity: '', cost: '', period: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), hectares: '', people: '', inputQty: '', inputUnit: 'bags', inputName: '', taskId: null, isSubmit: true });
          closeLog();
          return;
        }

        // If submitting a draft, remove draft and add to MOCK_LOGS
        const draftIdx = DRAFT_LOGS.findIndex(d => d.id === logForm.id);
        if (draftIdx >= 0) DRAFT_LOGS.splice(draftIdx, 1);
        setDraftLogs([...DRAFT_LOGS]);
      }
      if (!synced) {
        enqueueOutboxItem('operation_log', newLog);
      }
      MOCK_LOGS.unshift(newLog);
      setLogs([...MOCK_LOGS]);
      setLogTab('submitted');
      
      // Automatically complete the stage for this log
      if (logForm.taskId && logForm.taskId !== 'Emergency') {
        const currentTasks = cycleTasksByField[submittedFieldId] || [];
        const taskIdx = currentTasks.findIndex(t => t.id === logForm.taskId);
        if (taskIdx > -1) {
          const updated = currentTasks.map(t => {
            if (t.id === logForm.taskId) return { ...t, done: true, active: false };
            return t;
          });
          setCycleTasksByField(p => ({ ...p, [submittedFieldId]: updated }));
          const isFullyCompleted = updated.every(t => t.done);
          const nextPending = updated.find(t => !t.done);
          const newStageLabel = isFullyCompleted 
            ? 'Harvesting & Milling (Completed)' 
            : (nextPending ? `Waiting: ${nextPending.label}` : 'Crop Cycle Complete');
          
          if (submittedFieldId === selectedField.id) {
            setSelectedField(prevF => ({ ...prevF, stage: newStageLabel }));
          }
          const mf = MOCK_FIELDS.find(f => f.id === submittedFieldId);
          if (mf) mf.stage = newStageLabel;
        }

        Alert.alert(
          'Operation Logged',
          `"${newLog.activity}" recorded to field history. Stage completed!`,
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert(
          'Unplanned Work Logged',
          `"${newLog.activity}" has been recorded to field history.`,
          [{ text: 'OK', style: 'default' }]
        );
      }
    } else {
      if (logForm.id) {
        const idx = DRAFT_LOGS.findIndex(d => d.id === logForm.id);
        if (idx >= 0) DRAFT_LOGS[idx] = { ...newLog, id: logForm.id };
        setDraftLogs([...DRAFT_LOGS]);
      } else {
        const draftObj = { ...newLog, id: `D${Date.now()}` };
        DRAFT_LOGS.unshift(draftObj);
        setDraftLogs([...DRAFT_LOGS]);
      }
      setLogTab('drafts');
      Alert.alert('Draft Saved', 'Your log has been saved as a draft.');
    }
    
    notifyDataUpdate();

    if (logForm.saveFieldId && submittedFieldId !== selectedField.id) {
      updateSessionFieldId(submittedFieldId);
    }

    setLogForm({ id: null, fieldId: selectedField.id, saveFieldId: true, activity: '', cost: '', period: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), hectares: '', people: '', inputQty: '', inputUnit: 'bags', inputName: '', taskId: null, isSubmit: true });
    closeLog();
  };

  const submitDraft = (log) => {
    const idx = DRAFT_LOGS.findIndex(d => d.id === log.id);
    if (idx >= 0) DRAFT_LOGS.splice(idx, 1);
    setDraftLogs([...DRAFT_LOGS]);
    const submittedLog = { ...log, approved: true, isOffline: !synced, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
    MOCK_LOGS.unshift(submittedLog);
    setLogs([...MOCK_LOGS]);
    setLogTab('submitted');

    if (log.taskId && log.taskId !== 'Emergency') {
      const currentTasks = cycleTasksByField[log.fieldId] || [];
      const taskIdx = currentTasks.findIndex(t => t.id === log.taskId);
      if (taskIdx > -1) {
        const updated = currentTasks.map(t => {
          if (t.id === log.taskId) return { ...t, done: true, active: false };
          return t;
        });
        setCycleTasksByField(p => ({ ...p, [log.fieldId]: updated }));
        const isFullyCompleted = updated.every(t => t.done);
        const nextPending = updated.find(t => !t.done);
        const newStageLabel = isFullyCompleted 
          ? 'Harvesting & Milling (Completed)' 
          : (nextPending ? `Waiting: ${nextPending.label}` : 'Crop Cycle Complete');
        
        if (log.fieldId === selectedField.id) {
          setSelectedField(prevF => ({ ...prevF, stage: newStageLabel }));
        }
        const mf = MOCK_FIELDS.find(f => f.id === log.fieldId);
        if (mf) mf.stage = newStageLabel;
      }
    }

    notifyDataUpdate();
    Alert.alert('Draft Submitted', `"${submittedLog.activity}" recorded to field history!`);
  };

  const editDraft = (draft) => {
    setLogForm({
      id: draft.id,
      fieldId: draft.fieldId,
      saveFieldId: true,
      activity: draft.activity,
      cost: draft.cost ? draft.cost.toString() : '',
      period: draft.date || draft.period || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      hectares: draft.hectares ? draft.hectares.toString() : '',
      people: draft.people ? draft.people.toString() : '',
      inputQty: draft.inputQty ? draft.inputQty.toString() : '',
      inputUnit: draft.inputUnit || 'bags',
      inputName: draft.inputName || '',
      taskId: draft.taskId,
      isSubmit: false,
    });
    setShowLog(true);
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  };

  const deleteDraft = (draftId) => {
    Alert.alert('Delete Draft', 'Are you sure you want to remove this draft?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        const idx = DRAFT_LOGS.findIndex(d => d.id === draftId);
        if (idx >= 0) DRAFT_LOGS.splice(idx, 1);
        setDraftLogs([...DRAFT_LOGS]);
        notifyDataUpdate();
      }}
    ]);
  };

  const editSubmittedLog = (log) => {
    const session = getCurrentSession();
    const isOwner = selectedField?.member === session.name || log?.authorName === session.name || activeRole === 'Member';

    if (activeRole === 'Farm Manager' && !isOwner && !isTakeOver) {
      Alert.alert(
        'Supervisor Takeover Required',
        'This operation log belongs to ' + (selectedField?.member || 'this member') + '. To edit or correct their records, please tap "Take Over Field" on the field card first.'
      );
      return;
    }

    setLogForm({
      id: log.id,
      fieldId: log.fieldId,
      saveFieldId: true,
      activity: log.activity || '',
      cost: log.cost ? log.cost.toString() : '',
      period: log.date || log.period || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      hectares: log.hectares ? log.hectares.toString() : (selectedField?.ha || '1.5'),
      people: log.people ? log.people.toString() : '',
      inputQty: log.inputQty ? log.inputQty.toString() : '',
      inputUnit: log.inputUnit || 'bags',
      inputName: log.inputName || '',
      taskId: log.taskId,
      isSubmit: true,
    });
    setShowLog(true);
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  };

  const deleteSubmittedLog = (log) => {
    const session = getCurrentSession();
    const isOwner = selectedField?.member === session.name || log?.authorName === session.name || activeRole === 'Member';

    if (activeRole === 'Farm Manager' && !isOwner) {
      Alert.alert(
        'Action Not Allowed',
        'Farm Managers cannot delete operation logs submitted by other field members. You can use "Edit / Correct" to adjust log details.'
      );
      return;
    }

    Alert.alert(
      'Delete Operation Log',
      `Delete "${log.activity}" (#${log.id})? If this was a stage log, the stage will revert to active so you can re-log it if needed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          const idx = MOCK_LOGS.findIndex(l => l.id === log.id);
          if (idx >= 0) MOCK_LOGS.splice(idx, 1);
          setLogs([...MOCK_LOGS]);

          // If this was the only log for this stage, revert the stage back to active so the member can re-log it
          if (log.taskId && log.taskId !== 'Emergency') {
            const hasOtherLogsForStage = MOCK_LOGS.some(l => l.fieldId === log.fieldId && l.taskId === log.taskId && !l.isPastCycle);
            if (!hasOtherLogsForStage) {
              const currentTasks = cycleTasksByField[log.fieldId] || [];
              const updated = currentTasks.map(t => {
                if (t.id === log.taskId) return { ...t, done: false, active: true };
                return t;
              });
              setCycleTasksByField(p => ({ ...p, [log.fieldId]: updated }));
              const activeTask = updated.find(t => t.active);
              if (log.fieldId === (selectedField?.id || MOCK_FIELDS[0]?.id)) {
                setSelectedField(prevF => ({ ...(prevF || MOCK_FIELDS[0]), stage: activeTask ? activeTask.label : 'In Progress' }));
              }
              const mf = MOCK_FIELDS.find(f => f.id === log.fieldId);
              if (mf) mf.stage = activeTask ? activeTask.label : 'In Progress';
            }
          }

          notifyDataUpdate();
          Alert.alert('Log Removed', 'The operation log has been removed.');
        }}
      ]
    );
  };

  const activeFieldId = selectedField?.id || MOCK_FIELDS[0]?.id || 'FLD-KTR-001';
  const visibleLogs = activeRole === 'Member' ? logs : logs.filter(l => !l.isOffline);
  const fieldLogs = visibleLogs.filter(l => l.fieldId === activeFieldId && !l.isPastCycle);
  const pastLogs = visibleLogs.filter(l => l.fieldId === activeFieldId && l.isPastCycle);

  const handleClearPastLogs = () => {
    if (pastLogs.length === 0) return;
    Alert.alert(
      t('btn_delete_past_cycles', 'Delete All Past Cycles'),
      t('confirm_delete_past_cycles', 'This will remove past cycle records for this field from local device history. Active cycle logs are not affected.'),
      [
        { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('btn_delete_all', 'Delete All'),
          style: 'destructive',
          onPress: () => {
            const updated = MOCK_LOGS.filter(l => !(l.fieldId === activeFieldId && l.isPastCycle));
            MOCK_LOGS.length = 0;
            MOCK_LOGS.push(...updated);
            setLogs([...MOCK_LOGS]);
            notifyDataUpdate();
            Alert.alert(t('saved_title', 'Saved'), t('past_cycles_deleted_msg', 'Past cycle history has been cleared from local history.'));
          }
        }
      ]
    );
  };

  const unsynced = MOCK_FIELDS.filter(f => !f.synced);

  // Dynamic calculations for month-level QR code compilation
  const activeCycleLogs = visibleLogs.filter(l => !l.isPastCycle);
  const uniqueFieldsCount = new Set(activeCycleLogs.map(l => l.fieldId)).size;
  const totalLogsCount = activeCycleLogs.length;
  const totalOperationalCost = activeCycleLogs.reduce((sum, l) => sum + l.cost, 0);

  const LOGS_PER_PAGE = 5;

  const renderCompactLogList = (baseList, isDraft = false, isManager = false) => {
    const filtered = baseList.filter(log => {
      if (!isDraft) {
        if (logCategoryFilter === 'stage' && log.taskId === 'Emergency') return false;
        if (logCategoryFilter === 'unplanned' && log.taskId !== 'Emergency') return false;
        if (logCategoryFilter === 'offline' && !log.isOffline) return false;
        if (logCategoryFilter === 'prep' && !(log.activity || '').toLowerCase().includes('prep') && !(log.activity || '').toLowerCase().includes('plow')) return false;
        if (logCategoryFilter === 'planting' && !(log.activity || '').toLowerCase().includes('plant') && !(log.activity || '').toLowerCase().includes('patdan')) return false;
        if (logCategoryFilter === 'weeding' && !(log.activity || '').toLowerCase().includes('weed') && !(log.activity || '').toLowerCase().includes('hilamon')) return false;
        if (logCategoryFilter === 'fertilizer' && !(log.activity || '').toLowerCase().includes('fert') && !(log.activity || '').toLowerCase().includes('urea')) return false;
        if (logCategoryFilter === 'harvest' && !(log.activity || '').toLowerCase().includes('harvest') && !(log.activity || '').toLowerCase().includes('tapas') && !(log.activity || '').toLowerCase().includes('truck')) return false;
      }

      if (logSearch.trim()) {
        const q = logSearch.trim().toLowerCase();
        const matchAct = (log.activity || '').toLowerCase().includes(q);
        const matchDate = (log.date || log.period || '').toLowerCase().includes(q);
        const matchCost = (log.cost || '').toString().includes(q);
        const matchId = (log.id || '').toLowerCase().includes(q);
        const matchMat = (log.inputName || '').toLowerCase().includes(q);
        return matchAct || matchDate || matchCost || matchId || matchMat;
      }
      return true;
    });

    const isFiltering = logSearch.trim().length > 0 || (!isDraft && logCategoryFilter !== 'all');
    const totalPages = Math.max(1, Math.ceil(filtered.length / LOGS_PER_PAGE));
    const currentPageClamped = Math.min(logCurrentPage, totalPages);
    const displayItems = filtered.slice((currentPageClamped - 1) * LOGS_PER_PAGE, currentPageClamped * LOGS_PER_PAGE);

    return (
      <View style={{ gap: 8 }}>
        {/* Search Bar */}
        <View style={s.logSearchBox}>
          <Ionicons name="search-outline" size={16} color={COLORS.textMuted} />
          <TextInput
            style={s.logSearchInput}
            placeholder={isDraft ? t('search_drafts_placeholder', "Search draft logs...") : t('search_logs_placeholder', "Search logs by activity, date, cost, materials...")}
            placeholderTextColor={COLORS.textMuted}
            value={logSearch}
            onChangeText={(t) => {
              setLogSearch(t);
              setLogCurrentPage(1);
            }}
          />
          {logSearch.length > 0 && (
            <TouchableOpacity onPress={() => { setLogSearch(''); setLogCurrentPage(1); }} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills (for non-drafts) */}
        {!isDraft && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginBottom: 4 }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 6 }}>
            {[
              { key: 'all', label: `${t('cat_all', 'All')} (${baseList.length})` },
              { key: 'prep', label: t('cat_prep', 'Land Prep') },
              { key: 'planting', label: t('cat_plant', 'Planting') },
              { key: 'weeding', label: t('cat_weed', 'Weeding & Care') },
              { key: 'fertilizer', label: t('cat_fert', 'Fertilization') },
              { key: 'harvest', label: t('cat_harvest', 'Harvesting') },
              { key: 'unplanned', label: `Unplanned (${baseList.filter(l => l.taskId === 'Emergency').length})` },
              { key: 'offline', label: `Offline (${baseList.filter(l => l.isOffline).length})` }
            ].map(f => (
              <TouchableOpacity
                key={f.key}
                style={[s.filterPill, logCategoryFilter === f.key && s.filterPillActive]}
                onPress={() => {
                  setLogCategoryFilter(f.key);
                  setLogCurrentPage(1);
                }}
              >
                <Text style={[s.filterPillText, logCategoryFilter === f.key && s.filterPillTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Results summary when filtering */}
        {isFiltering && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2, marginBottom: 2 }}>
            <Text style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: '600' }}>
              Showing {filtered.length} of {baseList.length} logs
            </Text>
            <TouchableOpacity onPress={() => { setLogSearch(''); setLogCategoryFilter('all'); setLogCurrentPage(1); }}>
              <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: '700' }}>{t('btn_reset', 'Reset Filter')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty state */}
        {displayItems.length === 0 && (
          <View style={s.emptyCard}>
            <Ionicons name="document-text-outline" size={28} color={COLORS.border} />
            <Text style={s.emptyText}>{isFiltering ? 'No logs match your search or filter.' : (isDraft ? 'No draft logs.' : t('empty_logs', 'No operational logs recorded yet.'))}</Text>
          </View>
        )}

        {/* Compact Expandable Item Rows */}
        {displayItems.map(log => {
          const isExpanded = expandedLogId === log.id;
          const isUnplanned = log.taskId === 'Emergency';

          return (
            <View key={log.id} style={[s.compactLogCard, isDraft && { borderColor: '#F5A623', backgroundColor: '#FFFBF0' }]}>
              <TouchableOpacity
                style={s.compactLogHeader}
                onPress={() => setExpandedLogId(isExpanded ? null : log.id)}
                activeOpacity={0.7}
              >
                <View style={[s.compactLogDot, { backgroundColor: isDraft ? '#C97A00' : (isUnplanned ? '#D9534F' : COLORS.primary) }]} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={s.compactLogTitle} numberOfLines={1}>{log.activity}</Text>
                  <Text style={s.compactLogSub}>
                    {log.date || log.period} · {log.hectares} Ha · {log.people} Workers{log.inputQty ? ` · ${log.inputQty} ${log.inputUnit}${log.inputName ? ` (${log.inputName})` : ''}` : ''}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                  <Text style={[s.compactLogCost, isDraft && { color: '#C97A00' }]}>₱{Number(log.cost || 0).toLocaleString()}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
                    {log.isOffline && <Ionicons name="cloud-offline-outline" size={12} color="#C97A00" />}
                    <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={14} color={COLORS.textMuted} />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Expandable Details Drawer */}
              {isExpanded && (
                <View style={s.compactLogDrawer}>
                  <View style={s.compactLogDivider} />
                  <View style={s.receiptRow}>
                    <Text style={s.receiptLabel}>{t('receipt_ref', 'Log Reference')}</Text>
                    <Text style={s.receiptValue}>#{log.id} {isUnplanned ? '· Unplanned Work' : ''}</Text>
                  </View>
                  <View style={s.receiptRow}>
                    <Text style={s.receiptLabel}>{t('receipt_coverage', 'Work Coverage')}</Text>
                    <Text style={s.receiptValue}>{log.hectares} Hectares · {log.people} Workers</Text>
                  </View>
                  {Boolean(log.inputQty) && (
                    <View style={s.receiptRow}>
                      <Text style={s.receiptLabel}>{t('planner_materials', 'Inputs / Materials')}</Text>
                      <Text style={s.receiptValue}>{log.inputQty} {log.inputUnit} {log.inputName ? `· ${log.inputName}` : ''}</Text>
                    </View>
                  )}
                  <View style={s.receiptRow}>
                    <Text style={s.receiptLabel}>{t('stat_total_cost', 'Total Cost')}</Text>
                    <Text style={[s.receiptCostText, isDraft && { color: '#C97A00' }]}>Php {Number(log.cost || 0).toLocaleString()}</Text>
                  </View>
                  <View style={s.receiptRow}>
                    <Text style={s.receiptLabel}>{t('form_date', 'Date Recorded')}</Text>
                    <Text style={s.receiptValue}>{log.date || log.period}</Text>
                  </View>
                  {!isDraft && (
                    <View style={s.receiptRow}>
                      <Text style={s.receiptLabel}>{t('status', 'Status')}</Text>
                      <View style={[s.receiptStatusBadge, { backgroundColor: log.isOffline ? '#FFFBF0' : '#F2FBF2', borderColor: log.isOffline ? '#FEF0D0' : '#E8F5E8' }]}>
                        <Ionicons name={log.isOffline ? 'cloud-offline-outline' : 'checkmark-circle-outline'} size={12} color={log.isOffline ? '#C97A00' : '#267326'} />
                        <Text style={[s.receiptStatusText, { fontSize: 10, color: log.isOffline ? '#C97A00' : '#267326' }]}>
                          {log.isOffline ? t('sync_status_pending', 'Saved Offline (Pending Sync)') : t('synced', 'Recorded')}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Actions inside drawer */}
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border }}>
                    {isDraft ? (
                      <>
                        <TouchableOpacity
                          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#fff', borderWidth: 1, borderColor: '#C97A00', borderRadius: RADIUS.sm, paddingVertical: 7 }}
                          onPress={() => editDraft(log)}
                        >
                          <Ionicons name="create-outline" size={14} color="#C97A00" />
                          <Text style={{ fontSize: 11, fontWeight: '700', color: '#C97A00' }}>{t('btn_edit_draft', 'Edit Draft')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flex: 1.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: COLORS.success, borderRadius: RADIUS.sm, paddingVertical: 7 }}
                          onPress={() => submitDraft(log)}
                        >
                          <Ionicons name="paper-plane-outline" size={14} color="#fff" />
                          <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{t('btn_submit_draft', 'Submit Draft')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ width: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFEAEB', borderRadius: RADIUS.sm, borderWidth: 1, borderColor: '#FFD4D4' }}
                          onPress={() => deleteDraft(log.id)}
                        >
                          <Ionicons name="trash-outline" size={15} color="#D9534F" />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#F8FAF5', borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm, paddingVertical: 7 }}
                          onPress={() => editSubmittedLog(log)}
                        >
                          <Ionicons name="create-outline" size={14} color={COLORS.primary} />
                          <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }}>
                            {t('btn_edit', 'Edit / Correct')}
                          </Text>
                        </TouchableOpacity>

                        {/* Allow deletion if user is a member OR the manager is on their own assigned field */}
                        {(!isManager || selectedField.member === getCurrentSession().name || log.authorName === getCurrentSession().name) && (
                          <TouchableOpacity
                            style={{ flex: 0.8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FFD4D4', borderRadius: RADIUS.sm, paddingVertical: 7 }}
                            onPress={() => deleteSubmittedLog(log)}
                          >
                            <Ionicons name="trash-outline" size={14} color="#D9534F" />
                            <Text style={{ fontSize: 11, fontWeight: '700', color: '#D9534F' }}>Delete</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {/* Simple Page-by-Page Pagination Controls (Prev / Page X of Y / Next) */}
        {filtered.length > 0 && totalPages > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border }}>
            <TouchableOpacity
              disabled={currentPageClamped <= 1}
              onPress={() => setLogCurrentPage(p => Math.max(1, p - 1))}
              style={[{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#fff' }, currentPageClamped <= 1 && { opacity: 0.4 }]}
            >
              <Ionicons name="chevron-back" size={14} color={COLORS.text} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.text }}>Prev</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textSecondary }}>
              Page {currentPageClamped} of {totalPages}
            </Text>

            <TouchableOpacity
              disabled={currentPageClamped >= totalPages}
              onPress={() => setLogCurrentPage(p => Math.min(totalPages, p + 1))}
              style={[{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#fff' }, currentPageClamped >= totalPages && { opacity: 0.4 }]}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.text }}>Next</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderDraftsBanner = () => {
    const currentFieldId = selectedField?.id || MOCK_FIELDS[0]?.id;
    const scopedDrafts = draftLogs.filter(d => d.fieldId === currentFieldId);
    if (scopedDrafts.length === 0) return null;
    return (
      <View style={{ backgroundColor: '#FFFDF5', borderColor: '#F5A623', borderWidth: 1.5, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.card }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FEF0D0', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="document-text" size={14} color="#C97A00" />
            </View>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#92400E' }}>{t('drafts_title', 'Saved Draft Logs')} ({scopedDrafts.length})</Text>
          </View>
          <View style={{ backgroundColor: '#FEF0D0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 }}>
            <Text style={{ fontSize: 10, color: '#92400E', fontWeight: '700' }}>For {currentFieldId}</Text>
          </View>
        </View>
        <View style={{ gap: 8 }}>
          {scopedDrafts.map(draft => (
            <View key={draft.id} style={{ backgroundColor: '#fff', borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#FDE68A', padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }} numberOfLines={1}>{draft.activity || 'Untitled Draft'}</Text>
                <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{draft.fieldId} · Php {Number(draft.cost || 0).toLocaleString()} · {draft.hectares || '1.5'} Ha</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity 
                  style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 7, borderRadius: RADIUS.sm }}
                  onPress={() => editDraft(draft)}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#92400E' }}>{t('btn_edit', 'Edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 7, borderRadius: RADIUS.sm }}
                  onPress={() => submitDraft(draft)}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{t('btn_submit', 'Submit')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const SRA_TASK_KEY_MAP = {
    T1: 'task_t1',
    T2: 'task_t2',
    T3: 'task_t3',
    T4: 'task_t4',
    T5: 'task_t5',
    T6: 'task_t6',
    T7: 'task_t7',
    T8: 'task_t8',
  };

  const getTaskLabel = (task) => {
    if (task.id && SRA_TASK_KEY_MAP[task.id]) {
      return t(SRA_TASK_KEY_MAP[task.id], task.label);
    }
    return task.label;
  };

  const renderTimeline = () => {
    const tasks = cycleTasksByField[selectedField.id] || [];
    
    if (tasks.length === 0) {
      return (
        <View style={{ marginBottom: SPACING.md }}>
          <View style={s.sectionRow}>
            <Text style={s.sectionLabel}>{t('timeline_title', 'Crop Cycle Timeline')}</Text>
          </View>
          <View style={[s.timelineCard, { padding: SPACING.lg, alignItems: 'center' }]}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryBg, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name="calendar-outline" size={22} color={COLORS.primary} />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.text, marginBottom: 4, textAlign: 'center' }}>{t('no_cycle_setup', 'No Crop Cycle Set Up Yet')}</Text>
            <Text style={{ fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 17, marginBottom: 16 }}>
              {t('no_cycle_sub', "Each field follows its own cycle. Set up your field's stages to start logging and tracking progress.")}
            </Text>

            <View style={{ width: '100%', gap: 10 }}>
              <TouchableOpacity
                style={{ backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: RADIUS.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, ...SHADOW.card }}
                onPress={() => {
                  const session = getCurrentSession();
                  const isMyField = selectedField.member === session.name;
                  if (activeRole === 'Farm Manager' && !isMyField && !isTakeOver) {
                    Alert.alert(
                      'Supervisor Takeover Required',
                      'Please enable "Take Over Field" mode to set up or modify the crop cycle for this offline member.'
                    );
                    return;
                  }
                  const defaultStages = CYCLE_TASKS.map((t, idx) => ({ ...t, done: idx === 0, active: idx === 1 }));
                  setEditingStages(defaultStages);
                  setNewStageLabel('');
                  setNewStageColor(STAGE_COLORS[0]);
                  setShowStageEditor(true);
                }}
              >
                <Ionicons name="copy-outline" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{t('btn_use_sra_standard', 'Use SRA Standard (8 Stages)')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.primary, paddingVertical: 11, borderRadius: RADIUS.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}
                onPress={() => {
                  const session = getCurrentSession();
                  const isMyField = selectedField.member === session.name;
                  if (activeRole === 'Farm Manager' && !isMyField && !isTakeOver) {
                    Alert.alert(
                      'Supervisor Takeover Required',
                      'Please enable "Take Over Field" mode to set up or modify the crop cycle for this offline member.'
                    );
                    return;
                  }
                  setEditingStages([]);
                  setNewStageLabel('');
                  setNewStageColor(STAGE_COLORS[0]);
                  setShowStageEditor(true);
                }}
              >
                <Ionicons name="add-circle-outline" size={16} color={COLORS.primary} />
                <Text style={{ color: COLORS.primary, fontSize: 13, fontWeight: '700' }}>{t('btn_build_custom_cycle', 'Build Custom Cycle')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    const isFullyCompleted = tasks.every(t => t.done);
    return (
      <View style={{ marginBottom: SPACING.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
          <Text style={{ fontSize: 11.5, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('timeline_title', 'Crop Cycle Timeline')}</Text>
          <Text style={{ fontSize: 10.5, color: COLORS.textMuted }}>{t('tap_active_stage', 'Tap active stage to log')}</Text>
        </View>
        <View style={s.timelineCard}>
          {tasks.map((task, i) => (
            <TouchableOpacity key={task.id} style={s.timelineRow} onPress={() => {
              if (activeRole === 'Farm Manager' && !isTakeOver) {
                Alert.alert('View Only', 'Please enable "Take Over Field" mode to update the timeline.');
                return;
              }
              toggleTaskStatus(task.id);
            }} activeOpacity={0.7}>
              <View style={s.timelineLeft}>
                <View style={[s.timelineDot, { backgroundColor: task.done ? COLORS.success : task.active ? task.color : COLORS.border }]}>
                  {task.done && <Ionicons name="checkmark" size={10} color="#fff" />}
                  {task.active && !task.done && <View style={s.activePulse} />}
                </View>
                {i < tasks.length - 1 && <View style={[s.timelineLine, { backgroundColor: task.done ? COLORS.success : COLORS.border }]} />}
              </View>
              <View style={[s.timelineContent, task.active && s.timelineContentActive]}>
                <Text style={[s.timelineLabel, task.active && { color: task.color, fontWeight: '800' }]}>{getTaskLabel(task)}</Text>
                <Text style={s.timelineMonth}>{task.done ? t('status_completed', 'Completed') : task.active ? t('status_in_progress', 'In Progress') : t('status_pending', 'Pending')}</Text>
                {task.active && (
                  <View style={[s.activeBadge, { backgroundColor: task.color }]}>
                    <Text style={s.activeBadgeText}>{t('current_stage_badge', 'CURRENT STAGE')}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
          {isFullyCompleted && (
            <TouchableOpacity style={{ marginTop: 16, backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: RADIUS.sm, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }} onPress={() => {
                 Alert.alert(
                   t('btn_start_new_cycle', 'Start New Crop Year'),
                   'Are you sure you want to start a new crop cycle?',
                   [
                     { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
                     { text: 'Yes, Start', style: 'default', onPress: () => {
                        const baseStages = (selectedField.customStages?.length > 0 ? selectedField.customStages : CYCLE_TASKS).map((t) => ({...t, done: false, active: false}));
                        setCycleTasksByField(p => ({
                          ...p,
                          [selectedField.id]: baseStages
                        }));
                        setSelectedField(prevF => ({ ...prevF, stage: 'Not Started' }));
                        const resetMf = MOCK_FIELDS.find(f => f.id === selectedField.id);
                        if (resetMf) resetMf.stage = 'Not Started';
                        
                        MOCK_LOGS.forEach(l => {
                          if (l.fieldId === selectedField.id) l.isPastCycle = true;
                        });
                        setLogs([...MOCK_LOGS]);
                        
                        setDraftLogs(prev => prev.filter(d => d.fieldId !== selectedField.id));
                     }}
                   ]
                 );
            }}>
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{t('btn_start_new_cycle', 'Start New Crop Year')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MEMBER VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'Member' && (
          <>
            {/* My Fields Selector — read only, assigned by Manager */}
            <Text style={s.sectionLabel}>{t('my_fields', 'My Fields')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginBottom: SPACING.md }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 8 }}>
              {MOCK_FIELDS.filter(f => f.member === getCurrentSession().name || f.id === selectedField.id).map(field => (
                <TouchableOpacity
                  key={field.id}
                  style={[s.fieldChip, selectedField.id === field.id && s.fieldChipActive]}
                  onPress={() => {
                    setSelectedField(field);
                    updateSessionFieldId(field.id);
                  }}
                >
                  <Text style={[s.fieldChipText, selectedField.id === field.id && s.fieldChipTextActive]}>{field.id}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.md, backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.md, padding: 10 }}>
              <Ionicons name="information-circle-outline" size={14} color={COLORS.primary} />
              <Text style={{ fontSize: 12, color: COLORS.primary, flex: 1 }}>{t('field_alloc_notice')}</Text>
            </View>

            <Text style={s.sectionLabel}>{t('field_plot', 'Selected Field Details')}</Text>
            <View style={s.fieldCard}>
              <View style={s.fieldCardTop}>
                <View style={s.fieldIdBadge}><Text style={s.fieldIdText}>{selectedField.id}</Text></View>
                <Text style={s.fieldHa}>{selectedField.ha} Ha</Text>
              </View>
              <Text style={s.fieldStage}>{t('stage', 'Stage')}: <Text style={s.fieldStageVal}>{selectedField.stage}</Text></Text>
              <Text style={s.fieldSync}>
                <Ionicons name={selectedField.synced ? 'cloud-done-outline' : 'cloud-offline-outline'} size={12} color={selectedField.synced ? '#267326' : '#C97A00'} />
                {' '}{selectedField.synced ? `${t('synced', 'Synced')} ${formatSyncTime(selectedField.lastSync)}` : `${t('not_synced', 'Not synced')} (${formatSyncTime(selectedField.lastSync)})`}
              </Text>
              <TouchableOpacity
                style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 6 }}
                onPress={() => {
                  const current = getFieldStages(selectedField.id);
                  setEditingStages(current.map(t => ({ ...t })));
                  setNewStageLabel('');
                  setNewStageColor(STAGE_COLORS[0]);
                  setShowStageEditor(true);
                }}
              >
                <Ionicons name="list-outline" size={14} color={COLORS.primary} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary }}>{t('btn_stage_editor', 'Edit Field Stages')}</Text>
              </TouchableOpacity>
            </View>

            {/* Crop Cycle Timeline */}
            {renderTimeline()}

            {/* Saved Drafts Quick Access Banner */}
            {renderDraftsBanner()}

            {/* Field Activity & History Card */}
            <View style={s.historySummaryCard}>
              <View style={s.historySummaryTop}>
                <View style={{ flex: 1 }}>
                  <Text style={s.historySummaryTitle}>{t('ops_title', 'Field Activity & Ledger')}</Text>
                  <Text style={s.historySummarySub}>
                    {fieldLogs.length} logged {fieldLogs.length === 1 ? 'activity' : 'activities'} · Php {fieldLogs.reduce((sum, l) => sum + Number(l.cost || 0), 0).toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={s.unplannedBtn}
                  onPress={() => {
                    setLogForm(p => ({...p, fieldId: selectedField.id, activity: '', taskId: 'Emergency', isSubmit: true}));
                    setShowLog(true);
                    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
                  }}
                >
                  <Ionicons name="add" size={13} color="#C97A00" />
                  <Text style={s.unplannedBtnText}>{t('btn_unplanned_work', '+ Unplanned Work')}</Text>
                </TouchableOpacity>
              </View>

              {/* Recent 2-3 activities preview */}
              {fieldLogs.length === 0 ? (
                <View style={s.emptyMiniCard}>
                  <Text style={s.emptyMiniText}>{t('empty_logs', 'No operations recorded for this field yet.')}</Text>
                </View>
              ) : (
                <View style={{ gap: 6, marginVertical: 6 }}>
                  {fieldLogs.slice(0, 3).map(log => (
                    <View key={log.id} style={s.miniLogRow}>
                      <View style={[s.compactLogDot, { backgroundColor: log.taskId === 'Emergency' ? '#D9534F' : COLORS.primary }]} />
                      <Text style={s.miniLogTitle} numberOfLines={1}>{log.activity}</Text>
                      <Text style={s.miniLogCost}>Php {Number(log.cost || 0).toLocaleString()}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Button to open Dedicated Full History Modal */}
              <TouchableOpacity
                style={s.openLedgerBtn}
                onPress={() => setShowHistoryModal(true)}
              >
                <Ionicons name="receipt-outline" size={15} color="#fff" />
                <Text style={s.openLedgerBtnText}>
                  {t('btn_view_history', 'View Full History & Ledger')} ({fieldLogs.length})
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* FARM MANAGER VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'Farm Manager' && (
          <>
            <Text style={[s.sectionLabel, { marginBottom: 8 }]}>Manager Actions</Text>
            <View style={{ gap: 10, marginBottom: SPACING.lg }}>
              <TouchableOpacity 
                style={{ backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, ...SHADOW.card }} 
                onPress={handleGenerateAudit}
              >
                <Ionicons name="qr-code-outline" size={20} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 }}>{t('btn_generate_audit', 'GENERATE AUDIT LOGS')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{ backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border, paddingVertical: 12, borderRadius: RADIUS.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }} 
                onPress={openAssignModal}
              >
                <Ionicons name="person-add-outline" size={16} color={COLORS.text} />
                <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: '700' }}>{t('btn_assign_field', 'Assign New Field')}</Text>
              </TouchableOpacity>
            </View>

            {/* Sync Status Warning */}
            {unsynced.length > 0 && (
              <View style={s.syncWarning}>
                <Ionicons name="alert-circle" size={18} color='#C97A00' />
                <View style={{ flex: 1 }}>
                  <Text style={[s.syncWarningText, { fontWeight: '700' }]}>
                    Member Device Sync Notice
                  </Text>
                  {unsynced.map(f => (
                    <Text key={f.id} style={[s.syncWarningText, { marginTop: 2 }]}>
                      • <Text style={{ fontWeight: '700' }}>{f.id}</Text> ({f.member}): {t('sync_info', 'last synced')} <Text style={{ fontWeight: '700', color: '#C97A00' }}>{formatSyncTime(f.lastSync || '4 days ago')}</Text>
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Field Scope Filter Switcher */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
              <TouchableOpacity
                style={[
                  { flex: 1, paddingVertical: 8, borderRadius: RADIUS.md, alignItems: 'center', borderWidth: 1 },
                  managerFieldFilter === 'my' 
                    ? { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                    : { backgroundColor: '#fff', borderColor: COLORS.border }
                ]}
                onPress={() => {
                  setManagerFieldFilter('my');
                  const myFields = MOCK_FIELDS.filter(f => f.member === getCurrentSession().name);
                  if (myFields.length > 0) {
                    setSelectedField(myFields[0]);
                    updateSessionFieldId(myFields[0].id);
                  }
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: managerFieldFilter === 'my' ? '#fff' : COLORS.text }}>
                  {t('my_fields', 'My Fields')} ({MOCK_FIELDS.filter(f => f.member === getCurrentSession().name).length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  { flex: 1, paddingVertical: 8, borderRadius: RADIUS.md, alignItems: 'center', borderWidth: 1 },
                  managerFieldFilter === 'all' 
                    ? { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                    : { backgroundColor: '#fff', borderColor: COLORS.border }
                ]}
                onPress={() => {
                  setManagerFieldFilter('all');
                  if (MOCK_FIELDS.length > 0) {
                    setSelectedField(MOCK_FIELDS[0]);
                    updateSessionFieldId(MOCK_FIELDS[0].id);
                  }
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: managerFieldFilter === 'all' ? '#fff' : COLORS.text }}>
                  {t('view_all_fields', 'All Block Farm Fields')} ({MOCK_FIELDS.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Field Selector */}
            {(() => {
              const displayedFields = managerFieldFilter === 'my'
                ? MOCK_FIELDS.filter(f => f.member === getCurrentSession().name)
                : MOCK_FIELDS;

              return (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={[s.sectionLabel, { marginBottom: 0 }]}>
                      {managerFieldFilter === 'my' ? t('my_fields', 'My Fields') : t('view_all_fields', 'All Block Farm Fields')}
                    </Text>
                    {displayedFields.length > 3 && (
                      <TouchableOpacity onPress={() => setShowFieldsModal(true)}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }}>{t('show_more', 'Show More')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginBottom: SPACING.md }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 8, paddingBottom: 4 }}>
                    {displayedFields.slice(0, 3).map(field => (
                      <TouchableOpacity
                        key={field.id}
                        style={[s.fieldChip, selectedField.id === field.id && s.fieldChipActive]}
                        onPress={() => {
                          setSelectedField(field);
                          updateSessionFieldId(field.id);
                        }}
                      >
                        <View style={[s.syncDot, { backgroundColor: field.synced ? COLORS.success : '#C97A00' }]} />
                        <Text style={[s.fieldChipText, selectedField.id === field.id && s.fieldChipTextActive]}>{field.id}</Text>
                      </TouchableOpacity>
                    ))}
                    {displayedFields.length > 3 && (
                      <TouchableOpacity style={[s.fieldChip, { backgroundColor: COLORS.background }]} onPress={() => setShowFieldsModal(true)}>
                        <Text style={[s.fieldChipText, { color: COLORS.primary }]}>+ {displayedFields.length - 3} More</Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                </>
              );
            })()}

            {/* Selected Field Detail */}
            <View style={s.fieldCard}>
              <View style={s.fieldCardTop}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={s.fieldIdBadge}><Text style={s.fieldIdText}>{selectedField.id}</Text></View>
                  <Text style={s.fieldHa}>{selectedField.ha} Ha</Text>
                </View>
                {activeRole === 'Farm Manager' && (
                  <TouchableOpacity onPress={() => setIsTakeOver(!isTakeOver)} style={{ backgroundColor: isTakeOver ? '#D9534F' : COLORS.primaryBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: isTakeOver ? '#fff' : COLORS.primary }}>{isTakeOver ? 'Cancel Take Over' : t('btn_take_over', 'Take Over Field')}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={s.fieldMember}>{t('member_label', 'Member')}: {selectedField.member}</Text>
              <Text style={s.fieldStage}>{t('stage', 'Stage')}: <Text style={s.fieldStageVal}>{selectedField.stage}</Text></Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, flexWrap: 'wrap', gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name={selectedField.synced ? 'cloud-done-outline' : 'cloud-offline-outline'} size={14} color={selectedField.synced ? COLORS.success : '#C97A00'} />
                  <Text style={[s.fieldSync, { color: selectedField.synced ? COLORS.success : '#C97A00', fontWeight: '600' }]}>
                    {selectedField.synced ? `${t('synced', 'Synced')} (${formatSyncTime(selectedField.lastSync)})` : `${t('not_synced', 'Pending Member Sync')} (${formatSyncTime(selectedField.lastSync)})`}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm }}
                  onPress={() => {
                    Alert.alert(
                      t('sync_info_alert_title', 'Offline Synchronization Info'),
                      `${t('my_field', 'Field')} ${selectedField.id} (${selectedField.member})\n\n` +
                      t('sync_info_alert_msg', 'When a member records operations offline in the field, logs are securely saved on the device. Records automatically upload once reconnected to internet or synced at the office.')
                    );
                  }}
                >
                  <Ionicons name="information-circle-outline" size={13} color={COLORS.textMuted} />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.textSecondary }}>{t('sync_info', 'Sync Info')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Crop Cycle Timeline */}
            {renderTimeline()}

            {/* Saved Drafts Quick Access Banner */}
            {renderDraftsBanner()}

            {/* Field Activity & History Card */}
            <View style={s.historySummaryCard}>
              <View style={s.historySummaryTop}>
                <View style={{ flex: 1 }}>
                  <Text style={s.historySummaryTitle}>Field Activity & Ledger</Text>
                  <Text style={s.historySummarySub}>
                    {fieldLogs.length} logged {fieldLogs.length === 1 ? 'activity' : 'activities'} · Php {fieldLogs.reduce((sum, l) => sum + Number(l.cost || 0), 0).toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={s.unplannedBtn}
                  onPress={() => {
                    const session = getCurrentSession();
                    const isMyField = selectedField.member === session.name;
                    if (!isMyField && !isTakeOver) {
                      Alert.alert(
                        'Supervisor Takeover Required',
                        'This field is managed by ' + selectedField.member + '. To add unplanned work or log operations, please tap "Take Over Field" on the field card first.'
                      );
                      return;
                    }

                    setLogForm(p => ({...p, fieldId: selectedField.id, activity: '', taskId: 'Emergency', isSubmit: true}));
                    setShowLog(true);
                    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
                  }}
                >
                  <Ionicons name="add" size={13} color="#C97A00" />
                  <Text style={s.unplannedBtnText}>{t('btn_unplanned_work', '+ Unplanned Work')}</Text>
                </TouchableOpacity>
              </View>

              {/* Recent 2-3 activities preview */}
              {fieldLogs.length === 0 ? (
                <View style={s.emptyMiniCard}>
                  <Text style={s.emptyMiniText}>{t('empty_logs', 'No operations recorded for this field yet.')}</Text>
                </View>
              ) : (
                <View style={{ gap: 6, marginVertical: 6 }}>
                  {fieldLogs.slice(0, 3).map(log => (
                    <View key={log.id} style={s.miniLogRow}>
                      <View style={[s.compactLogDot, { backgroundColor: log.taskId === 'Emergency' ? '#D9534F' : COLORS.primary }]} />
                      <Text style={s.miniLogTitle} numberOfLines={1}>{log.activity}</Text>
                      <Text style={s.miniLogCost}>Php {Number(log.cost || 0).toLocaleString()}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Button to open Dedicated Full History Modal */}
              <TouchableOpacity
                style={s.openLedgerBtn}
                onPress={() => setShowHistoryModal(true)}
              >
                <Ionicons name="receipt-outline" size={15} color="#fff" />
                <Text style={s.openLedgerBtnText}>
                  {t('btn_view_history', 'View Full History & Ledger')} ({fieldLogs.length})
                </Text>
              </TouchableOpacity>
            </View>

          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SRA (Admin) VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'SRA (Admin)' && (
          <>
            {/* ── Block Farm Summary ── */}
            <Text style={s.sectionLabel}>Block Farm Overview</Text>

            {/* Farm Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 10, marginBottom: SPACING.md }}>
              {['All Block Farms', 'Silay Block Farm A', 'Silay Block Farm B', 'Silay Block Farm C'].map(farm => (
                <TouchableOpacity 
                  key={farm}
                  style={{
                    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                    backgroundColor: selectedFarm === farm ? COLORS.primary : COLORS.background,
                    borderWidth: 1, borderColor: selectedFarm === farm ? COLORS.primary : COLORS.border
                  }}
                  onPress={() => setSelectedFarm(farm)}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: selectedFarm === farm ? '#fff' : COLORS.text }}>{farm}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={[s.receiptCard, { marginBottom: SPACING.md }]}>
              <View style={s.receiptHeader}>
                <Text style={s.receiptTitle}>Descriptive Summary</Text>
                <Text style={s.receiptId}>Live Data</Text>
              </View>
              <View style={s.receiptDivider} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: SPACING.sm }}>
                {(() => {
                  const isAll = selectedFarm === 'All Block Farms';
                  
                  // Keep the actual data synchronized with AnalyticsScreen logic
                  const BLOCK_FARM_DATA = {
                    'Silay Block Farm A': { ha: 18.5, members: 42, cost: 262700, logs: 840 },
                    'Silay Block Farm B': { ha: 20.0, members: 55, cost: 336000, logs: 915 },
                    'Silay Block Farm C': { ha: 28.0, members: 89, cost: 366800, logs: 1105 },
                    'Silay Block Farm D': { ha: 22.0, members: 63, cost: 253000, logs: 552 },
                  };

                  const displayHa = isAll ? 88.5 : (BLOCK_FARM_DATA[selectedFarm]?.ha || 0);
                  const displayMembers = isAll ? 249 : (BLOCK_FARM_DATA[selectedFarm]?.members || 0);
                  const displayCost = isAll ? 1218500 : (BLOCK_FARM_DATA[selectedFarm]?.cost || 0);
                  const displayLogs = isAll ? 3412 : (BLOCK_FARM_DATA[selectedFarm]?.logs || 0);
                  const fManagers = isAll ? MOCK_MANAGERS : MOCK_MANAGERS.filter(m => m.blockFarm === selectedFarm);
                  const displayFarms = isAll ? 4 : 1;

                  return [
                    {
                      label: t('stat_total_ha', 'Total Hectares'),
                      value: `${displayHa.toFixed(1)} Ha`,
                      icon: 'map-outline',
                      color: COLORS.primary,
                    },
                    {
                      label: t('stat_block_farms', 'Block Farms'),
                      value: `${displayFarms} ${t('farms_unit', 'Farms')}`,
                      icon: 'grid-outline',
                      color: '#4A7C2F',
                    },
                    {
                      label: t('stat_active_members', 'Active Members'),
                      value: `${displayMembers} ${t('members_unit', 'Members')}`,
                      icon: 'people-outline',
                      color: '#1A6B9A',
                    },
                    {
                      label: t('stat_farm_managers', 'Farm Managers'),
                      value: `${fManagers.length} ${t('managers_unit', 'Managers')}`,
                      icon: 'briefcase-outline',
                      color: '#8F3A8F',
                    },
                    {
                      label: t('stat_total_cost', 'Total Op. Cost'),
                      value: `₱${displayCost >= 1000000 ? (displayCost / 1000000).toFixed(2) + 'M' : (displayCost / 1000).toFixed(1) + 'k'}`,
                      icon: 'cash-outline',
                      color: '#F5A623',
                    },
                    {
                      label: t('stat_recorded_logs', 'Compiled Logs'),
                      value: `${displayLogs.toLocaleString()} ${t('logs_unit', 'Logs')}`,
                      icon: 'checkmark-circle-outline',
                      color: COLORS.success,
                    },
                  ].map(stat => (
                    <View key={stat.label} style={{ width: '48%', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.sm, gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name={stat.icon} size={14} color={stat.color} />
                        <Text style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 }} numberOfLines={1}>{stat.label}</Text>
                      </View>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: stat.color }} numberOfLines={1}>{stat.value}</Text>
                    </View>
                  ));
                })()}
              </View>
            </View>

            {/* Scanner Card */}
            <TouchableOpacity style={s.scannerCard} onPress={() => setShowScanner(true)}>
              <View style={s.scannerIcon}>
                <Ionicons name="qr-code" size={48} color={COLORS.primary} />
              </View>
              <Text style={s.scannerTitle}>{t('scanner_title', 'Scan Manager QR Code')}</Text>
              <Text style={s.scannerSub}>{t('scanner_sub', "Point camera at the Farm Manager's phone screen to import this month's compiled field report.")}</Text>
              <View style={s.scannerBtn}>
                <Ionicons name="camera-outline" size={18} color="#fff" />
                <Text style={s.scannerBtnText}>{t('open_scanner_btn', 'Open QR Scanner')}</Text>
              </View>
            </TouchableOpacity>

            {/* Manual QR Input Fallback */}
            <View style={{ backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, ...SHADOW.card }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8, letterSpacing: 1 }}>{t('or_enter_manually', 'OR ENTER MANUALLY')}</Text>
              <TextInput 
                style={{ backgroundColor: '#f2f4ef', borderRadius: 8, padding: 12, fontSize: 14, fontWeight: '700', letterSpacing: 2, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 }}
                placeholder="HUG-XXXXXX-XXXX"
                placeholderTextColor={COLORS.textMuted}
                value={manualQR}
                onChangeText={setManualQR}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={{ backgroundColor: manualQR.length > 0 ? COLORS.primary : COLORS.border, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                disabled={manualQR.length === 0}
                onPress={() => {
                  setManualQR('');
                  Alert.alert(
                    t('report_loaded_title', 'Report Loaded Successfully'),
                    `May 2026 Block Farm Report loaded.\n\n• ${uniqueFieldsCount} fields\n• ${totalLogsCount} operation logs\n• Total cost: Php ${totalOperationalCost.toLocaleString()}\n• Manager: Jose Reyes`,
                    [{ text: t('btn_view_report', 'View Report'), style: 'default' }]
                  );
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: manualQR.length > 0 ? '#fff' : COLORS.textMuted }}>{t('btn_submit_manual_id', 'Submit Manual ID')}</Text>
              </TouchableOpacity>
            </View>

            {/* Last Audit Summary */}
            <Text style={s.sectionLabel}>{t('last_scanned_report', 'Last Scanned Report')}</Text>
            <View style={s.auditCard}>
              <View style={s.auditHeader}>
                <Ionicons name="document-text" size={18} color={COLORS.primary} />
                <Text style={s.auditTitle}>Block Farm — May 2026 Report</Text>
              </View>
              <View style={s.auditRow}><Text style={s.auditLabel}>{t('report_fields_reported', 'Total Fields Reported')}</Text><Text style={s.auditVal}>{uniqueFieldsCount} fields</Text></View>
              <View style={s.auditRow}><Text style={s.auditLabel}>{t('report_total_cost', 'Total Operational Cost')}</Text><Text style={s.auditVal}>Php {totalOperationalCost.toLocaleString()}</Text></View>
              <View style={s.auditRow}><Text style={s.auditLabel}>{t('report_compiled_logs', 'Compiled Operation Logs')}</Text><Text style={s.auditVal}>{totalLogsCount} logs</Text></View>
              <View style={s.auditRow}><Text style={s.auditLabel}>{t('report_generated_date', 'Report Generated')}</Text><Text style={s.auditVal}>May 21, 2026</Text></View>
              <TouchableOpacity 
                style={s.pdfBtn}
                onPress={() => {
                  Alert.alert(
                    'Exporting PDF',
                    `Generating District Operations Report for ${selectedFarm}...`,
                    [
                      { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
                      { 
                        text: 'Download', 
                        onPress: () => Alert.alert('Success', 'HUGPONG_District_Ops_Report.pdf has been securely saved to your device Downloads folder.')
                      }
                    ]
                  );
                }}
              >
                <Ionicons name="download-outline" size={16} color={COLORS.primary} />
                <Text style={s.pdfBtnText}>Export PDF Report</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

      </ScrollView>

      {/* ── Add Log Bottom Sheet ── */}
      <Modal visible={showLog} transparent animationType="none">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closeLog} />
        <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={s.sheetHandle} />
          <View style={s.sheetHeader}>
            <View>
              <Text style={s.sheetTitle}>{logForm.id ? t('btn_edit', 'Edit Log') : t('btn_log_operation', 'Add Operation Log')}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>{logForm.taskId === 'Emergency' ? t('btn_unplanned_work', 'Unplanned field work') : t('action_log_ops_sub', 'Record field progress and labor')}</Text>
            </View>
            <TouchableOpacity onPress={closeLog}><Ionicons name="close" size={22} color={COLORS.text} /></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={s.sheetBody} keyboardShouldPersistTaps="handled">
            <Text style={s.formLabel}>{t('form_field_id', 'Field ID *')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginBottom: SPACING.md }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 8 }}>
              {MOCK_FIELDS.filter(f => f.member === getCurrentSession().name || f.id === selectedField.id).map(field => (
                <TouchableOpacity
                  key={field.id}
                  style={[s.fieldChip, logForm.fieldId === field.id && s.fieldChipActive]}
                  onPress={() => setLogForm(p => ({ ...p, fieldId: field.id }))}
                >
                  <Text style={[s.fieldChipText, logForm.fieldId === field.id && s.fieldChipTextActive]}>{field.id}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={s.formLabel}>{t('form_date', 'Date *')}</Text>
            <TouchableOpacity onPress={() => setShowCalendar(true)}>
              <View pointerEvents="none">
                <TextInput
                  style={[s.formInput, { color: COLORS.text }]}
                  value={logForm.period}
                  editable={false}
                  placeholder={t('form_tap_date', 'Tap to select date')}
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </TouchableOpacity>

            <Text style={s.formLabel}>{t('form_category', 'Category / Agronomic Stage *')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginBottom: SPACING.md }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 6 }}>
              {[
                { key: 'prep', label: t('cat_prep', 'Land Prep'), icon: 'construct', unit: 'ha' },
                { key: 'plant', label: t('cat_plant', 'Planting'), icon: 'leaf', unit: 'pcs' },
                { key: 'fert', label: t('cat_fert', 'Fertilization'), icon: 'flask', unit: 'bags' },
                { key: 'weed', label: t('cat_weed', 'Weeding & Care'), icon: 'water', unit: 'liters' },
                { key: 'harvest', label: t('cat_harvest', 'Harvesting'), icon: 'basket', unit: 'tons' },
              ].map(c => {
                const isSel = (logForm.category === c.key) || (
                  !logForm.category && (
                    (c.key === 'fert' && (logForm.activity || '').toLowerCase().includes('fert')) ||
                    (c.key === 'prep' && (logForm.activity || '').toLowerCase().includes('prep')) ||
                    (c.key === 'plant' && (logForm.activity || '').toLowerCase().includes('plant')) ||
                    (c.key === 'harvest' && (logForm.activity || '').toLowerCase().includes('harvest')) ||
                    (c.key === 'weed' && (logForm.activity || '').toLowerCase().includes('weed'))
                  )
                );
                return (
                  <TouchableOpacity
                    key={c.key}
                    style={[
                      { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff' },
                      isSel && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg }
                    ]}
                    onPress={() => {
                      setLogForm(p => ({
                        ...p,
                        category: c.key,
                        inputUnit: p.inputUnit || c.unit
                      }));
                    }}
                  >
                    <Ionicons name={c.icon} size={14} color={isSel ? COLORS.primary : COLORS.textMuted} />
                    <Text style={{ fontSize: 12, fontWeight: isSel ? '800' : '600', color: isSel ? COLORS.primary : COLORS.textSecondary }}>{c.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={s.formLabel}>{t('form_activity', 'Activity / Operation *')}</Text>
            <TextInput
              style={[s.formInput, { backgroundColor: '#fff', color: COLORS.text }]}
              value={logForm.activity}
              onChangeText={v => setLogForm(p => ({ ...p, activity: v }))}
              editable={true}
              placeholder={t('form_placeholder_activity', 'e.g. Fertilization Stage 2 (Urea application)')}
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={s.formLabel}>{t('form_cost', 'Operational Cost (Php) *')}</Text>
            <TextInput
              style={[s.formInput, { marginBottom: SPACING.md }]}
              value={logForm.cost}
              onChangeText={v => setLogForm(p => ({ ...p, cost: v }))}
              keyboardType="decimal-pad"
              placeholder={t('form_placeholder_cost', 'e.g. 4500')}
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={s.formLabel}>{t('form_hectares', 'Hectares Covered *')}</Text>
            <TextInput
              style={s.formInput}
              value={logForm.hectares}
              onChangeText={v => setLogForm(p => ({ ...p, hectares: v }))}
              keyboardType="decimal-pad"
              placeholder='e.g. 1.5'
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={s.formLabel}>{t('form_people_count', 'Number of People / Workers *')}</Text>
            <TextInput
              style={s.formInput}
              value={logForm.people}
              onChangeText={v => setLogForm(p => ({ ...p, people: v }))}
              keyboardType="number-pad"
              placeholder='e.g. 10'
              placeholderTextColor={COLORS.textMuted}
            />

            {/* Inputs & Materials Used Section */}
            <View style={{ backgroundColor: '#F8FAF5', borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, gap: 8, marginTop: 4 }}>
              <Text style={[s.formLabel, { color: COLORS.primary }]}>{t('form_materials_section', 'Materials & Inputs Used (Aligned with Planner)')}</Text>
              
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textSecondary }}>{t('form_input_name', 'Material / Input Name')}</Text>
              <TextInput
                style={[s.formInput, { backgroundColor: '#fff' }]}
                value={logForm.inputName}
                onChangeText={v => setLogForm(p => ({ ...p, inputName: v }))}
                placeholder='e.g. Urea (46-0-0) / Patdan / Herbicide / Disc Plow'
                placeholderTextColor={COLORS.textMuted}
              />

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 2 }}>{t('form_input_qty', 'Quantity')}</Text>
                  <TextInput
                    style={[s.formInput, { backgroundColor: '#fff' }]}
                    value={logForm.inputQty}
                    onChangeText={v => setLogForm(p => ({ ...p, inputQty: v }))}
                    keyboardType="decimal-pad"
                    placeholder='e.g. 4'
                    placeholderTextColor={COLORS.textMuted}
                  />
                </View>

                <View style={{ flex: 1.5 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 2 }}>{t('form_input_unit', 'Unit')}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -2 }} contentContainerStyle={{ gap: 4, paddingVertical: 2 }}>
                    {['bags', 'liters', 'pcs', 'ha', 'tons', 'truckload', 'days'].map(u => (
                      <TouchableOpacity
                        key={u}
                        style={[
                          { paddingHorizontal: 10, paddingVertical: 8, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
                          logForm.inputUnit === u && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg }
                        ]}
                        onPress={() => setLogForm(p => ({ ...p, inputUnit: u }))}
                      >
                        <Text style={{ fontSize: 11, fontWeight: '700', color: logForm.inputUnit === u ? COLORS.primary : COLORS.textSecondary }}>{u}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>

            {/* Photo / Receipt Attachment Section */}
            <View style={{ backgroundColor: '#F8FAF5', borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, gap: 8, marginTop: 4 }}>
              <Text style={[s.formLabel, { color: COLORS.primary }]}>{t('form_attach_photo', 'Attach Field Photo or Receipt (Optional)')}</Text>
              {logForm.photoUri ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: RADIUS.sm, padding: 10, borderWidth: 1, borderColor: COLORS.success }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <Ionicons name="image" size={20} color={COLORS.success} />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.success, flexShrink: 1 }}>{t('form_photo_added', 'Photo attached')}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setLogForm(p => ({ ...p, photoUri: null }))}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#D9534F' }}>{t('form_remove_photo', 'Remove Photo')}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.primary, borderStyle: 'dashed', borderRadius: RADIUS.md, paddingVertical: 14 }}
                  onPress={() => {
                    setLogForm(p => ({ ...p, photoUri: 'mock://field_photo_2026.jpg' }));
                    Alert.alert(t('form_photo_added', 'Photo attached'), 'Photo from device camera / gallery attached to field log.');
                  }}
                >
                  <Ionicons name="camera-outline" size={18} color={COLORS.primary} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary }}>{t('form_take_photo', 'Take Photo / Upload')}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Clean Dual Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: SPACING.md, paddingTop: SPACING.sm }}>
              <TouchableOpacity
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#FFFBF0', borderWidth: 1.5, borderColor: '#F5A623', borderRadius: RADIUS.md, paddingVertical: 13 }}
                onPress={() => handleSaveLog(false)}
              >
                <Ionicons name="document-text-outline" size={16} color="#C97A00" />
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#C97A00' }}>{t('btn_save_draft', 'Save as Draft')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{ flex: 1.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 13, ...SHADOW.card }}
                onPress={() => handleSaveLog(true)}
              >
                <Ionicons name={logForm.id ? "checkmark-circle-outline" : "paper-plane-outline"} size={16} color="#fff" />
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{logForm.id ? t('btn_edit', 'Save Changes') : t('btn_submit', 'Record Operation')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </Modal>

      {/* ── QR Code Display Modal ── */}
      <Modal visible={showQR} transparent animationType="fade">
        <View style={s.qrOverlay}>
          <View style={s.qrModal}>
            <Text style={s.qrModalTitle}>SRA Monthly Audit QR</Text>
            <Text style={s.qrModalSub}>May 2026 — Block Farm Kapitan Ramon, Silay</Text>
            {/* Simulated QR Code Box */}
            <View style={s.qrBox}>
              <View style={s.qrSimulated}>
                {Array.from({ length: 8 }).map((_, row) => (
                  <View key={row} style={{ flexDirection: 'row' }}>
                    {Array.from({ length: 8 }).map((_, col) => (
                      <View
                        key={col}
                        style={[
                          s.qrCell,
                          { backgroundColor: (row + col) % 3 === 0 || (row * col) % 5 === 0 ? '#000' : '#fff' },
                        ]}
                      />
                    ))}
                  </View>
                ))}
              </View>
              <Text style={s.qrCode}>HUG-202605-A3F9</Text>
            </View>
            <Text style={s.qrNote}>{uniqueFieldsCount} field{uniqueFieldsCount !== 1 ? 's' : ''} · {totalLogsCount} log{totalLogsCount !== 1 ? 's' : ''} · Total: Php {totalOperationalCost.toLocaleString()}</Text>
            <TouchableOpacity style={s.qrCloseBtn} onPress={() => setShowQR(false)}>
              <Text style={s.qrCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Custom Calendar Modal ── */}
      <Modal visible={showCalendar} transparent animationType="fade">
        <View style={s.qrOverlay}>
          <View style={[s.qrModal, { width: 320, padding: 0, overflow: 'hidden' }]}>
            
            {/* Calendar Header */}
            <View style={{ backgroundColor: COLORS.primary, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1))}>
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(calDate)}
              </Text>
              <TouchableOpacity onPress={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1))}>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Calendar Grid */}
            <View style={{ padding: 16, paddingBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <Text key={d} style={{ width: 32, textAlign: 'center', fontSize: 12, color: COLORS.textMuted, fontWeight: '700' }}>{d}</Text>
                ))}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 8, justifyContent: 'space-between' }}>
                {Array.from({ length: new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay() }).map((_, i) => <View key={`blank-${i}`} style={{ width: 32, height: 32 }} />)}
                
                {Array.from({ length: new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                  const day = i + 1;
                  const isToday = calDate.getFullYear() === 2026 && calDate.getMonth() === 4 && day === 21;
                  return (
                    <TouchableOpacity
                      key={day}
                      style={{ width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: isToday ? COLORS.primary : 'transparent' }}
                      onPress={() => {
                        const formattedMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(calDate);
                        setLogForm(p => ({...p, period: `${formattedMonth} ${day}, ${calDate.getFullYear()}`}));
                        setShowCalendar(false);
                      }}
                    >
                      <Text style={{ fontSize: 14, color: isToday ? '#fff' : COLORS.text, fontWeight: isToday ? '700' : '500' }}>{day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Time Selector */}
            <View style={{ borderTopWidth: 1, borderTopColor: COLORS.border, padding: 16 }}>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: '600', marginBottom: 8 }}>Select Time</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity 
                  style={{ flex: 1, paddingVertical: 10, backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.sm, alignItems: 'center' }}
                  onPress={() => setLogForm(p => ({...p, period: (p.period || 'May 21, 2026') + ' - 08:00 AM'}))}
                >
                  <Text style={{ color: COLORS.primary, fontWeight: '600' }}>08:00 AM</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ flex: 1, paddingVertical: 10, backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.sm, alignItems: 'center' }}
                  onPress={() => setLogForm(p => ({...p, period: (p.period || 'May 21, 2026') + ' - 01:00 PM'}))}
                >
                  <Text style={{ color: COLORS.primary, fontWeight: '600' }}>01:00 PM</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Actions */}
            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border }}>
              <TouchableOpacity style={{ flex: 1, paddingVertical: 14, alignItems: 'center' }} onPress={() => setShowCalendar(false)}>
                <Text style={{ color: COLORS.textMuted, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: COLORS.primary }} onPress={() => setShowCalendar(false)}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Confirm Date</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* ── QR Scanner Modal (SRA) ── */}
      <Modal visible={showScanner} transparent animationType="fade">
        <View style={s.scanOverlay}>
          <View style={s.scanModal}>
            <Text style={s.scanTitle}>QR Code Scanner</Text>
            <View style={s.scanViewfinder}>
              <View style={[s.scanCorner, s.scanTL]} />
              <View style={[s.scanCorner, s.scanTR]} />
              <View style={[s.scanCorner, s.scanBL]} />
              <View style={[s.scanCorner, s.scanBR]} />
              <Ionicons name="qr-code-outline" size={64} color="rgba(255,255,255,0.3)" />
              <Text style={s.scanHint}>Point camera at manager's phone screen</Text>
            </View>
            <TouchableOpacity
              style={s.scanSimBtn}
              onPress={() => {
                setShowScanner(false);
                Alert.alert(
                  'QR Scanned Successfully',
                  `May 2026 Block Farm Report loaded.\n\n• ${uniqueFieldsCount} fields\n• ${totalLogsCount} operation logs\n• Total cost: Php ${totalOperationalCost.toLocaleString()}\n• Manager: Jose Reyes`,
                  [{ text: 'View Report', style: 'default' }]
                );
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={s.scanSimBtnText}>Simulate Successful Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.scanCancelBtn} onPress={() => setShowScanner(false)}>
              <Text style={s.scanCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ── Fields Search Modal ── */}
      <Modal visible={showFieldsModal} transparent animationType="slide">
        <View style={s.overlay} />
        <View style={[s.sheet, { height: '85%' }]}>
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Block Farm Fields</Text>
            <TouchableOpacity onPress={() => { setShowFieldsModal(false); setFieldSearch(''); }}>
              <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={{ padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.background }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: RADIUS.md, paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.border }}>
              <Ionicons name="search" size={16} color={COLORS.textMuted} />
              <TextInput 
                placeholder="Search by Field ID or Member name..."
                style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 8, fontSize: 13 }}
                value={fieldSearch}
                onChangeText={setFieldSearch}
              />
              {fieldSearch.length > 0 && (
                <TouchableOpacity onPress={() => setFieldSearch('')}>
                  <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <ScrollView contentContainerStyle={{ padding: SPACING.lg, gap: 10 }}>
            {MOCK_FIELDS.filter(f => f.id.toLowerCase().includes(fieldSearch.toLowerCase()) || f.member.toLowerCase().includes(fieldSearch.toLowerCase())).length === 0 && (
               <Text style={s.emptyText}>No fields match your search.</Text>
            )}
            {MOCK_FIELDS.filter(f => f.id.toLowerCase().includes(fieldSearch.toLowerCase()) || f.member.toLowerCase().includes(fieldSearch.toLowerCase())).map(field => (
              <View key={field.id} style={[s.receiptCard, selectedField.id === field.id && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg, marginBottom: 0 }, { marginBottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md }]}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                  setSelectedField(field);
                  updateSessionFieldId(field.id);
                  setShowFieldsModal(false);
                  setFieldSearch('');
                }}>
                  <View style={s.receiptHeader}>
                    <Text style={[s.receiptTitle, { color: COLORS.text }]}>{field.id}</Text>
                    <Text style={s.receiptId}>{field.ha} Ha</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Member: <Text style={{ color: COLORS.text, fontWeight: '700' }}>{field.member}</Text></Text>
                  <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>Stage: <Text style={{ color: COLORS.text }}>{field.stage}</Text></Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                    <View style={[s.syncDot, { backgroundColor: field.synced ? COLORS.success : '#C97A00' }]} />
                    <Text style={{ fontSize: 10, color: field.synced ? COLORS.success : '#C97A00' }}>
                      {field.synced ? `Synced ${field.lastSync}` : `Not synced`}
                    </Text>
                  </View>
                </TouchableOpacity>
                {activeRole === 'Farm Manager' && (
                  <TouchableOpacity 
                    style={{ padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, marginLeft: 10, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => {
                      setShowFieldsModal(false);
                      openAssignModal(field);
                    }}
                    title="Edit Field Ownership"
                  >
                    <Ionicons name="pencil" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* ── Manager Assign Field Modal ── */}
      <Modal visible={showManagerAssignModal} transparent animationType="slide">
        <View style={s.overlay} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>{managerAssignForm.isEditing ? 'Edit Field Plot & Ownership' : 'Assign Field to Member'}</Text>
            <TouchableOpacity onPress={() => setShowManagerAssignModal(false)}>
              <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={s.sheetBody}>
            <View style={{ gap: 4 }}>
              <Text style={s.formLabel}>Field ID <Text style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: '400' }}>({managerAssignForm.isEditing ? 'Registered Plot ID' : 'Auto-generated'})</Text></Text>
              <View style={[s.formInput, { backgroundColor: '#F4F7F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                <Text style={{ fontSize: 14, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: COLORS.primary }}>
                  {managerAssignForm.fieldId}
                </Text>
                <View style={{ backgroundColor: COLORS.primaryBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.primary }}>{managerAssignForm.isEditing ? 'Plot ID' : 'Auto-assigned'}</Text>
                </View>
              </View>
            </View>
            <View style={{ gap: 4 }}>
              <Text style={s.formLabel}>Assigned Member User ID <Text style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: '400' }}>(Phone / Account ID)</Text></Text>
              <TextInput style={s.formInput} placeholder="e.g. 09176543210" value={managerAssignForm.userId} onChangeText={t => setManagerAssignForm({...managerAssignForm, userId: t})} keyboardType="phone-pad" />
            </View>
            <View style={{ gap: 4 }}>
              <Text style={s.formLabel}>Declared Area (Ha)</Text>
              <TextInput style={s.formInput} placeholder="e.g. 1.5" keyboardType="numeric" value={managerAssignForm.ha} onChangeText={t => setManagerAssignForm({...managerAssignForm, ha: t})} />
            </View>
            <View style={s.sheetFooter}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowManagerAssignModal(false)}><Text style={s.cancelBtnText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={s.submitBtn} onPress={() => {
                if(!managerAssignForm.userId || !managerAssignForm.fieldId || !managerAssignForm.ha) {
                  Alert.alert('Error', 'Please fill in all required fields.');
                  return;
                }
                const session = getCurrentSession();
                const existing = MOCK_FIELDS.find(f => f.id === managerAssignForm.fieldId);
                if (existing) {
                  existing.member = managerAssignForm.userId;
                  existing.userId = managerAssignForm.userId;
                  existing.memberContact = managerAssignForm.userId;
                  existing.ha = managerAssignForm.ha;
                  if (selectedField.id === existing.id) {
                    setSelectedField({ ...selectedField, member: managerAssignForm.userId, userId: managerAssignForm.userId, ha: managerAssignForm.ha });
                  }
                } else {
                  const newField = {
                    id: managerAssignForm.fieldId,
                    member: managerAssignForm.userId,
                    userId: managerAssignForm.userId,
                    memberContact: managerAssignForm.userId,
                    ha: managerAssignForm.ha,
                    stage: 'Land Preparation',
                    month: 0,
                    synced: false,
                    lastSync: 'Just now',
                    blockFarm: session.farm || 'Silay Block Farm'
                  };
                  MOCK_FIELDS.push(newField);
                  setSelectedField(newField);
                }
                Alert.alert('Success', `Field plot ${managerAssignForm.fieldId} assigned to User ID: ${managerAssignForm.userId}.`);
                setShowManagerAssignModal(false);
                setManagerAssignForm({ userId: '', fieldId: '', ha: '', isEditing: false });
              }}>
                <Text style={s.submitBtnText}>{managerAssignForm.isEditing ? 'Save Changes' : 'Assign Field'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Stage Editor Modal ── */}
      <Modal visible={showStageEditor} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, maxHeight: height * 0.88 }}>
            <View style={s.sheetHandle} />
            <View style={s.sheetHeader}>
              <View>
                <Text style={s.sheetTitle}>{t('btn_stage_editor', 'Field Stages')}</Text>
                <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>{selectedField.id} · {t('stage_reorder_hint', 'tap icons to reorder or remove')}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowStageEditor(false)}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: SPACING.lg, gap: 10, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">

              {/* Current stages list */}
              {editingStages.length === 0 && (
                <View style={[s.emptyCard, { marginBottom: 8 }]}>
                  <Ionicons name="list-outline" size={28} color={COLORS.border} />
                  <Text style={s.emptyText}>{t('no_stages_yet', 'No stages yet. Add your first stage below.')}</Text>
                </View>
              )}
              {editingStages.map((stage, idx) => {
                const hasLogs = logs.some(l => l.fieldId === selectedField.id && l.taskId === stage.id && !l.isPastCycle);
                return (
                  <View key={stage.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: RADIUS.md, padding: 12, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.card }}>
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: stage.color, flexShrink: 0 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }}>{getTaskLabel(stage)}</Text>
                      {stage.done && <Text style={{ fontSize: 10, color: COLORS.success, marginTop: 2 }}>{t('status_completed', 'Completed')}</Text>}
                      {stage.active && <Text style={{ fontSize: 10, color: stage.color, marginTop: 2 }}>{t('status_in_progress', 'In Progress')}</Text>}
                      {!stage.done && !stage.active && <Text style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{t('status_pending', 'Pending')}</Text>}
                      {hasLogs && <Text style={{ fontSize: 10, color: '#C97A00', marginTop: 2 }}>{t('stage_has_logs', 'Has submitted logs')}</Text>}
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <TouchableOpacity
                        disabled={idx === 0}
                        onPress={() => {
                          const updated = [...editingStages];
                          [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                          setEditingStages(updated);
                        }}
                        style={{ padding: 6, opacity: idx === 0 ? 0.3 : 1 }}
                      >
                        <Ionicons name="chevron-up" size={18} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={idx === editingStages.length - 1}
                        onPress={() => {
                          const updated = [...editingStages];
                          [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                          setEditingStages(updated);
                        }}
                        style={{ padding: 6, opacity: idx === editingStages.length - 1 ? 0.3 : 1 }}
                      >
                        <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          if (hasLogs) {
                            Alert.alert('Cannot Remove', `"${getTaskLabel(stage)}" ${t('cannot_remove_stage_with_logs', 'has submitted logs. You cannot remove it while logs exist for this stage.')}`);
                            return;
                          }
                          Alert.alert(t('remove_stage_confirm', 'Remove Stage'), `${t('remove_stage_confirm', 'Remove')} "${getTaskLabel(stage)}"?`, [
                            { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
                            { text: t('btn_delete', 'Remove'), style: 'destructive', onPress: () => setEditingStages(prev => prev.filter((_, i) => i !== idx)) }
                          ]);
                        }}
                        style={{ padding: 6 }}
                      >
                        <Ionicons name="trash-outline" size={18} color="#D9534F" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              {/* Add new stage */}
              <View style={{ marginTop: 8, backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: 14, gap: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }}>{t('add_new_stage', 'Add New Stage')}</Text>
                
                {/* Quick Sugarcane Stage Presets */}
                <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textSecondary }}>{t('suggested_presets', 'Suggested Stage Presets (Tap to fill)')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -14 }} contentContainerStyle={{ paddingHorizontal: 14, gap: 6 }}>
                  {[
                    t('task_t1', 'Land Preparation'),
                    t('task_t2', 'Planting'),
                    t('task_t3', 'Pre-emergence Spraying'),
                    t('task_t4', 'Fertilization Stage 1'),
                    t('task_t5', 'Fertilization Stage 2'),
                    t('task_t6', 'Fertilization Stage 3'),
                    t('task_t7', 'Final Off-barring'),
                    t('task_t8', 'Harvesting & Milling')
                  ].map(preset => (
                    <TouchableOpacity
                      key={preset}
                      style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 }}
                      onPress={() => setNewStageLabel(preset)}
                    >
                      <Text style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' }}>+ {preset}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TextInput
                  style={s.formInput}
                  placeholder={t('stage_name_placeholder', 'Stage name (e.g. Weeding – Hilamon)')}
                  placeholderTextColor={COLORS.textMuted}
                  value={newStageLabel}
                  onChangeText={setNewStageLabel}
                />
                <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textSecondary }}>{t('stage_color', 'Stage Color')}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {STAGE_COLORS.map(c => (
                    <TouchableOpacity key={c} onPress={() => setNewStageColor(c)}
                      style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c, borderWidth: newStageColor === c ? 3 : 0, borderColor: '#fff', ...SHADOW.card }}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  style={[s.submitBtn, { marginTop: 4, opacity: newStageLabel.trim() ? 1 : 0.45 }]}
                  disabled={!newStageLabel.trim()}
                  onPress={() => {
                    const stage = {
                      id: `CS${Date.now()}`,
                      label: newStageLabel.trim(),
                      phase: newStageLabel.trim(),
                      color: newStageColor,
                      done: false,
                      active: false, // Starts as Pending until explicitly activated
                    };
                    setEditingStages(prev => [...prev, stage]);
                    setNewStageLabel('');
                  }}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text style={s.submitBtnText}>{t('btn_add_stage', 'Add Stage')}</Text>
                </TouchableOpacity>
              </View>

              {/* Reset to SRA Default */}
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md }}
                onPress={() => {
                  Alert.alert(t('btn_reset', 'Reset to Default'), t('reset_sra_confirm_msg', 'Replace your custom stages with the SRA standard 8-stage template?'), [
                    { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
                    { text: t('btn_reset', 'Reset'), style: 'destructive', onPress: () => setEditingStages(CYCLE_TASKS.map((t) => ({ ...t, label: getTaskLabel(t), done: false, active: false }))) }
                  ]);
                }}
              >
                <Ionicons name="refresh-outline" size={14} color={COLORS.textMuted} />
                <Text style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: '600' }}>{t('btn_reset_sra_template', 'Reset to SRA Standard Template')}</Text>
              </TouchableOpacity>

              {/* Save */}
              <TouchableOpacity
                style={[s.submitBtn, { marginTop: 4 }]}
                onPress={() => {
                  const updatedStages = [...editingStages];
                  updateFieldCustomStages(selectedField.id, updatedStages);
                  setCycleTasksByField(p => ({ ...p, [selectedField.id]: updatedStages }));

                  const activeTask = updatedStages.find(t => t.active);
                  const currentLabel = activeTask 
                    ? getTaskLabel(activeTask) 
                    : (updatedStages.length > 0 
                        ? (updatedStages.every(t => t.done) ? `${t('task_t8', 'Harvesting & Milling')} (${t('status_completed', 'Completed')})` : (updatedStages.some(t => t.done) ? t('status_pending', 'Waiting to Start Next Stage') : t('status_pending', 'Not Started'))) 
                        : 'Not Started');

                  setSelectedField(prevF => ({ ...prevF, stage: currentLabel, customStages: updatedStages }));
                  const mf = MOCK_FIELDS.find(f => f.id === selectedField.id);
                  if (mf) {
                    mf.stage = currentLabel;
                    mf.customStages = updatedStages;
                  }
                  setShowStageEditor(false);
                  Alert.alert(t('saved_title', 'Saved'), t('stage_plan_saved_msg', 'Your field stages have been updated.'));
                }}
              >
                <Ionicons name="save-outline" size={16} color="#fff" />
                <Text style={s.submitBtnText}>{t('btn_save_stage_plan', 'Save Stage Plan')}</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Dedicated Full History & Ledger Modal ── */}
      <Modal visible={showHistoryModal} transparent animationType="slide">
        <View style={s.historyModalOverlay}>
          <SafeAreaView style={s.historyModalContainer}>
            {/* Modal Header */}
            <View style={s.historyModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.historyModalTitle}>{t('ledger_title', 'Field History & Ledger')}</Text>
                <Text style={s.historyModalSub}>{t('my_field', 'Field')} {selectedField.id} · {selectedField.member}</Text>
              </View>
              <TouchableOpacity 
                style={s.historyModalCloseBtn}
                onPress={() => setShowHistoryModal(false)}
              >
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Stat Summary Bar */}
            <View style={s.historyStatBar}>
              <View style={s.historyStatItem}>
                <Text style={s.historyStatLbl}>{t('stat_total_cost', 'Total Operational Cost')}</Text>
                <Text style={s.historyStatVal}>Php {fieldLogs.reduce((sum, l) => sum + Number(l.cost || 0), 0).toLocaleString()}</Text>
              </View>
              <View style={[s.historyStatItem, { borderLeftWidth: 1, borderLeftColor: COLORS.border, paddingLeft: 12 }]}>
                <Text style={s.historyStatLbl}>{t('stat_records', 'Total Records')}</Text>
                <Text style={s.historyStatVal}>{fieldLogs.length} {t('stat_records', 'entries')}</Text>
              </View>
            </View>

            {/* If Member: Sub-tabs for Submitted vs Drafts vs Past */}
            {activeRole === 'Member' && (
              <View style={[s.logTabsRow, { paddingHorizontal: SPACING.lg, marginBottom: 8 }]}>
                <TouchableOpacity style={[s.logTabBtn, logTab === 'submitted' && s.logTabBtnActive]} onPress={() => setLogTab('submitted')}>
                  <Text style={[s.logTabText, logTab === 'submitted' && s.logTabTextActive]}>{t('tab_submitted', 'Submitted')} ({fieldLogs.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.logTabBtn, logTab === 'drafts' && s.logTabBtnActive]} onPress={() => setLogTab('drafts')}>
                  <Text style={[s.logTabText, logTab === 'drafts' && s.logTabTextActive]}>
                    {t('tab_drafts', 'Drafts')} {draftLogs.filter(l => l.fieldId === selectedField.id).length > 0 && `(${draftLogs.filter(l => l.fieldId === selectedField.id).length})`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.logTabBtn, logTab === 'past' && s.logTabBtnActive]} onPress={() => setLogTab('past')}>
                  <Text style={[s.logTabText, logTab === 'past' && s.logTabTextActive]}>{t('tab_past', 'Past Cycles')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Scrollable Modal Body */}
            <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
              {activeRole === 'Member' ? (
                logTab === 'drafts' ? (
                  renderCompactLogList(draftLogs.filter(l => l.fieldId === selectedField.id), true, false)
                ) : logTab === 'past' ? (
                  <>
                    {pastLogs.length > 0 && (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          backgroundColor: '#FFF5F5',
                          borderWidth: 1,
                          borderColor: '#FED7D7',
                          borderRadius: RADIUS.md,
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          marginBottom: 12
                        }}
                        onPress={handleClearPastLogs}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="trash-outline" size={15} color="#E53E3E" />
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#E53E3E' }}>
                          {t('btn_delete_past_cycles', 'Delete All Past Cycles')} ({pastLogs.length})
                        </Text>
                      </TouchableOpacity>
                    )}
                    {renderCompactLogList(pastLogs, false, false)}
                  </>
                ) : (
                  renderCompactLogList(fieldLogs, false, false)
                )
              ) : (
                renderCompactLogList(fieldLogs, false, true)
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 32 },

  // Role switcher
  roleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  roleBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  roleBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: SPACING.lg, paddingVertical: 10 },
  bannerMember: { backgroundColor: '#4A7C2F' },
  bannerManager: { backgroundColor: '#1A6B9A' },
  bannerSRA: { backgroundColor: '#8F3A8F' },
  roleBannerText: { fontSize: 12, fontWeight: '600', color: '#fff', flex: 1, lineHeight: 17 },

  // Section
  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  // Field Card
  fieldCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, gap: 6, ...SHADOW.card, borderWidth: 1, borderColor: COLORS.border },
  fieldCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fieldIdBadge: { backgroundColor: COLORS.primaryBg, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  fieldIdText: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  fieldHa: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary },
  fieldMember: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  fieldStage: { fontSize: 12, color: COLORS.textMuted },
  fieldStageVal: { fontWeight: '700', color: COLORS.text },
  fieldSync: { fontSize: 11, color: COLORS.textMuted },

  // Field Chips (Manager)
  fieldChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#fff' },
  fieldChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg },
  fieldChipText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  fieldChipTextActive: { color: COLORS.primary, fontWeight: '800' },
  syncDot: { width: 7, height: 7, borderRadius: 4 },

  // Sync Warning
  syncWarning: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FFFBF0', borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: '#FEF0D0' },
  syncWarningText: { flex: 1, fontSize: 12, color: '#8B6A00', lineHeight: 18 },

  // Receipt Card Layout (Senior Accessible)
  receiptCard: { backgroundColor: '#fff', borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.card },
  // Search & Filter
  logSearchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 4 },
  logSearchInput: { flex: 1, fontSize: 13, color: COLORS.text, padding: 0 },
  filterPill: { backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 5 },
  filterPillActive: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  filterPillText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  filterPillTextActive: { color: COLORS.primary, fontWeight: '800' },

  // Compact Log Row
  compactLogCard: { backgroundColor: '#fff', borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 10, ...SHADOW.card },
  compactLogHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  compactLogDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  compactLogTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  compactLogSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  compactLogCost: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  compactLogDrawer: { marginTop: 8, gap: 6 },
  compactLogDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 4 },

  // Show More Button
  showMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primaryBg, borderWidth: 1, borderColor: COLORS.primary + '30', borderRadius: RADIUS.md, paddingVertical: 10, marginTop: 4 },
  showMoreBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

  receiptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  receiptTitle: { fontSize: 11, fontWeight: '800', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  receiptId: { fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: COLORS.textMuted, fontWeight: '600' },
  receiptDivider: { height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#DCE8CC', borderRadius: 1, marginVertical: 4 },
  receiptBody: { gap: 8 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 2 },
  receiptLabel: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },
  receiptValue: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  receiptValueBold: { fontSize: 14, color: COLORS.text, fontWeight: '800', flex: 1, textAlign: 'right', paddingLeft: 12 },
  receiptCostText: { fontSize: 16, color: COLORS.primary, fontWeight: '800' },
  receiptStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  receiptStatusText: { fontSize: 11, fontWeight: '700' },
  receiptApproveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.success, borderRadius: RADIUS.md, paddingVertical: 10, marginTop: 6 },
  receiptApproveBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Timeline
  timelineCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.card },
  timelineRow: { flexDirection: 'row', gap: 12, minHeight: 52 },
  timelineLeft: { width: 24, alignItems: 'center' },
  timelineDot: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  activePulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  timelineLine: { flex: 1, width: 2, marginTop: 2 },
  timelineContent: { flex: 1, paddingBottom: 16, gap: 3 },
  timelineContentActive: { backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.sm },
  timelineLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  timelineMonth: { fontSize: 10, color: COLORS.textMuted },
  activeBadge: { alignSelf: 'flex-start', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginTop: 2 },
  activeBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  // Log Tabs
  logTabsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  logTabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  logTabBtnActive: { borderBottomColor: COLORS.primary },
  logTabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  logTabTextActive: { color: COLORS.primary, fontWeight: '700' },

  // Add Log Button
  addLogBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 7 },
  addLogBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // QR & Scanner
  qrBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.card },
  qrBtnTitle: { fontSize: 14, fontWeight: '800', color: '#fff' },
  qrBtnSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },

  // SRA Scanner Card
  scannerCard: { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', gap: SPACING.md, ...SHADOW.card, borderWidth: 2, borderColor: COLORS.primary + '30' },
  scannerIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryBg, justifyContent: 'center', alignItems: 'center' },
  scannerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  scannerSub: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 19 },
  scannerBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 20, paddingVertical: 12 },
  scannerBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // Audit Card
  auditCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, gap: SPACING.sm, ...SHADOW.card },
  auditHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  auditTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, flex: 1 },
  auditRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  auditLabel: { fontSize: 13, color: COLORS.textSecondary },
  auditVal: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  pdfBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 12, marginTop: 4 },
  pdfBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  // Empty
  emptyCard: { alignItems: 'center', gap: 8, paddingVertical: 32, backgroundColor: '#fff', borderRadius: RADIUS.lg, ...SHADOW.card },
  emptyText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', paddingHorizontal: SPACING.lg },

  // Bottom Sheet
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, maxHeight: height * 0.88 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  sheetBody: { padding: SPACING.lg, gap: SPACING.sm, paddingBottom: 32 },
  typeToggle: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: 4, gap: 4 },
  typeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: RADIUS.sm },
  typeBtnActive: { backgroundColor: '#fff', ...SHADOW.card },
  typeBtnText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },
  typeBtnTextActive: { color: COLORS.primary, fontWeight: '700' },
  formLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  formInput: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: COLORS.text },
  sheetFooter: { flexDirection: 'row', gap: 10, marginTop: SPACING.md },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingVertical: 13, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  submitBtn: { flex: 2, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 13, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  submitBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // QR Modal
  qrOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  qrModal: { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', gap: SPACING.md, width: '100%' },
  qrModalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  qrModalSub: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },
  qrBox: { alignItems: 'center', gap: 10 },
  qrSimulated: { borderWidth: 2, borderColor: '#000', padding: 8, backgroundColor: '#fff' },
  qrCell: { width: 18, height: 18 },
  qrCode: { fontSize: 16, fontWeight: '800', color: COLORS.primary, letterSpacing: 2 },
  qrNote: { fontSize: 12, color: COLORS.textMuted },
  qrCloseBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 32, paddingVertical: 12, width: '100%', alignItems: 'center' },
  qrCloseBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // Scanner Modal
  scanOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  scanModal: { width: '100%', alignItems: 'center', gap: SPACING.lg },
  scanTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  scanViewfinder: { width: 240, height: 240, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', gap: 12 },
  scanCorner: { position: 'absolute', width: 28, height: 28, borderColor: COLORS.primary, borderWidth: 3 },
  scanTL: { top: 8, left: 8, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 4 },
  scanTR: { top: 8, right: 8, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 4 },
  scanBL: { bottom: 8, left: 8, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 4 },
  scanBR: { bottom: 8, right: 8, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 4 },
  scanHint: { fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  scanSimBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.success, borderRadius: RADIUS.md, paddingHorizontal: 24, paddingVertical: 14 },
  scanSimBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  scanCancelBtn: { paddingVertical: 10 },
  scanCancelText: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },

  // History Summary Card (Main Screen)
  historySummaryCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, gap: 4, ...SHADOW.card },
  historySummaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  historySummaryTitle: { fontSize: 13, fontWeight: '800', color: COLORS.text },
  historySummarySub: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  unplannedBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBF0', borderWidth: 1, borderColor: '#F5A623', borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 4 },
  unplannedBtnText: { fontSize: 11, fontWeight: '700', color: '#C97A00' },
  miniLogRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', gap: 8 },
  miniLogTitle: { fontSize: 12, fontWeight: '600', color: COLORS.text, flex: 1 },
  miniLogCost: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  emptyMiniCard: { paddingVertical: 12, alignItems: 'center' },
  emptyMiniText: { fontSize: 12, color: COLORS.textMuted },
  openLedgerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 10, marginTop: 6, ...SHADOW.card },
  openLedgerBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // Dedicated Full History Modal
  historyModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  historyModalContainer: { backgroundColor: '#fff', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, maxHeight: '92%', height: '92%' },
  historyModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  historyModalTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  historyModalSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  historyModalCloseBtn: { padding: 4 },
  historyStatBar: { flexDirection: 'row', backgroundColor: '#F8FAF5', paddingHorizontal: SPACING.lg, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 16 },
  historyStatItem: { flex: 1 },
  historyStatLbl: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  historyStatVal: { fontSize: 13, fontWeight: '800', color: COLORS.primary, marginTop: 1 },
});
