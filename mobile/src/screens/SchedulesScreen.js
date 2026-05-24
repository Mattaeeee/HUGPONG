import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Animated, Dimensions, TextInput, Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import AppHeader from '../components/AppHeader';
import { subscribe, getCurrentSession, setSynced, setSession, updateSessionFieldId, getIsSynced, MOCK_ASSIGNMENT_REQUESTS, resolveAssignmentRequest, requestFieldAssignment, MOCK_FIELDS, MOCK_LOGS, DRAFT_LOGS, notifyDataUpdate, SRA_PRICE_HISTORY, addSRAPrice, MOCK_MANAGERS } from '../data/mockData';

const { height, width } = Dimensions.get('window');


const MEMBER_FIELD = MOCK_FIELDS[0]; // The currently logged-in member's field

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

const STATUS_COLORS = { approved: COLORS.success, pending: '#F5A623', flagged: '#D9534F' };

export default function SchedulesScreen({ navigation }) {
  const [activeRole, setActiveRole] = useState(getCurrentSession().role);
  const [selectedFarm, setSelectedFarm] = useState('All Block Farms');
  const [selectedField, setSelectedField] = useState(MOCK_FIELDS[0]);
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [showLog, setShowLog] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [manualQR, setManualQR] = useState('');
  const [logForm, setLogForm] = useState({ type: 'weekly', fieldId: '', saveFieldId: true, activity: '', cost: '', period: '', hours: '', hectares: '', people: '', taskId: null });
  const [draftLogs, setDraftLogs] = useState([]);
  const [logTab, setLogTab] = useState('submitted');
  const [managerLogTab, setManagerLogTab] = useState('pending');
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
  const handleGenerateAudit = () => {
    if (!synced) {
      Alert.alert('Offline Mode', 'You are currently offline. Please connect to the internet to generate reports.');
      return;
    }

    const pendingApprovalLogs = logs.filter(l => !l.approved && !l.declined && !l.isOffline);
    const offlineLogs = logs.filter(l => !l.approved && !l.declined && l.isOffline);
    
    if (pendingApprovalLogs.length > 0 || offlineLogs.length > 0) {
      let warningMessage = '';
      if (pendingApprovalLogs.length > 0 && offlineLogs.length > 0) {
        warningMessage = `There are ${pendingApprovalLogs.length} logs waiting for approval, and ${offlineLogs.length} logs pending offline sync.`;
      } else if (pendingApprovalLogs.length > 0) {
        warningMessage = `There are ${pendingApprovalLogs.length} logs waiting for your approval. You should approve or decline them before generating the final report.`;
      } else {
        warningMessage = `There are ${offlineLogs.length} offline logs waiting to be synced by field members. You should ask them to sync before generating the final report.`;
      }

      Alert.alert(
        'Action Required Before Export',
        warningMessage,
        [
          { text: 'Cancel', style: 'cancel' },
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
      const fieldTasks = cycleTasksByField[field.id] || CYCLE_TASKS;
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
    [MOCK_FIELDS[0].id]: CYCLE_TASKS,
  });
  const slideAnim = useRef(new Animated.Value(height)).current;

  const toggleTaskStatus = (taskId, forceComplete = false) => {
    if (activeRole === 'SRA (Admin)') return;
    
    const fieldTasks = cycleTasksByField[selectedField.id] || CYCLE_TASKS.map(t => ({...t, done: false, active: false}));
    const taskIndex = fieldTasks.findIndex(t => t.id === taskId);
    const targetTask = fieldTasks[taskIndex];

    const applyToggle = () => {
      const currentTasks = cycleTasksByField[selectedField.id] || CYCLE_TASKS.map(t => ({...t, done: false, active: false}));
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
                 setCycleTasksByField(p => ({
                   ...p,
                   [selectedField.id]: CYCLE_TASKS.map((t, i) => ({...t, done: false, active: false}))
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
         'Mark as current stage?',
         [
           { text: 'Cancel', style: 'cancel' },
           { text: 'Yes', onPress: applyToggle, style: 'default' }
         ]
       );
       return;
    }

    if (targetTask.active && !forceComplete) {
      Alert.alert(
        `Stage: ${targetTask.phase}`,
        'What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Log (Draft)', onPress: () => {
              const stageDrafts = draftLogs.filter(d => d.taskId === targetTask.id && d.fieldId === selectedField.id);
              if (stageDrafts.length > 0) {
                 Alert.alert('Draft Exists', 'A draft log already exists for this stage. Tap it in the Draft Logs tab to edit.');
                 return;
              }
              setLogForm(p => ({...p, fieldId: selectedField.id, activity: targetTask.label, taskId: targetTask.id, isSubmit: false}));
              setShowLog(true);
              Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
          }},
          { text: 'Add Log & Submit', onPress: () => {
              const stageDrafts = draftLogs.filter(d => d.taskId === targetTask.id && d.fieldId === selectedField.id);
              if (stageDrafts.length > 0) {
                 Alert.alert('Draft Exists', 'A draft log already exists for this stage. Tap it in the Draft Logs tab to edit or submit.');
                 return;
              }
              setLogForm(p => ({...p, fieldId: selectedField.id, activity: targetTask.label, taskId: targetTask.id, isSubmit: true}));
              setShowLog(true);
              Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
          }}
        ]
      );
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
      if (found) setSelectedField(found);
    }
    const unsubscribe = subscribe(() => {
      const session = getCurrentSession();
      setActiveRole(session.role);
      if (session.fieldId) {
        const found = MOCK_FIELDS.find(f => f.id === session.fieldId);
        if (found) {
          setSelectedField(found);
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
    setLogForm(p => ({ ...p, fieldId: selectedField.id, saveFieldId: true }));
    setShowLog(true);
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  };
  const closeLog = () => {
    Animated.timing(slideAnim, { toValue: height, duration: 220, useNativeDriver: true }).start(() => setShowLog(false));
  };

  const submitLog = () => {
    if (!logForm.activity.trim() || !logForm.cost || !logForm.fieldId?.trim() || !logForm.period?.trim() || !logForm.hours || !logForm.hectares || !logForm.people) {
      Alert.alert('Required', 'Please fill in all fields including hours, hectares, and people.');
      return;
    }
    
    const costValue = parseFloat(logForm.cost);
    const hrs = parseFloat(logForm.hours);
    const ha = parseFloat(logForm.hectares);
    const ppl = parseInt(logForm.people);

    if (isNaN(costValue) || costValue < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive number for Operational Cost.');
      return;
    }
    if (isNaN(hrs) || hrs <= 0 || isNaN(ha) || ha <= 0 || isNaN(ppl) || ppl <= 0) {
      Alert.alert('Invalid Input', 'Hours, Hectares, and People must be positive numbers greater than 0.');
      return;
    }
    if (hrs > 24) { Alert.alert('Invalid Input', 'Hours cannot exceed 24 per log.'); return; }
    if (ha > 50) { Alert.alert('Invalid Input', 'Hectares cannot exceed 50 per log.'); return; }
    if (ppl > 100) { Alert.alert('Invalid Input', 'People count cannot exceed 100 per log.'); return; }

    const submittedFieldId = logForm.fieldId.trim().toUpperCase();
    const newLog = {
      id: `L${Date.now()}`,
      fieldId: submittedFieldId,
      type: logForm.type,
      week: logForm.type === 'weekly' ? logForm.period || 'This Week' : undefined,
      month: logForm.type === 'monthly' ? logForm.period || 'This Month' : undefined,
      activity: logForm.activity,
      cost: costValue,
      hours: logForm.hours,
      hectares: logForm.hectares,
      people: logForm.people,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      approved: false,
      taskId: logForm.taskId,
      isOffline: !synced,
    };

    if (!MOCK_FIELDS.find(f => f.id === submittedFieldId)) {
      MOCK_FIELDS.push({ id: submittedFieldId, member: getCurrentSession().name || 'Current User', ha: '0.0', stage: 'Newly Logged', month: 0, synced: false, lastSync: 'Just now' });
    }

    if (logForm.isSubmit) {
      MOCK_LOGS.unshift(newLog);
      setLogs([...MOCK_LOGS]);
      setLogTab('submitted');
      
      if (logForm.taskId !== 'Emergency') {
        Alert.alert(
          'Log Submitted',
          'Your log has been sent to the Farm Manager. You can mark this stage as complete once it is approved.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } else {
      if (logForm.id) {
        const idx = DRAFT_LOGS.findIndex(d => d.id === logForm.id);
        if (idx >= 0) DRAFT_LOGS[idx] = { ...newLog, id: logForm.id };
        setDraftLogs([...DRAFT_LOGS]);
      } else {
        DRAFT_LOGS.unshift(newLog);
        setDraftLogs([...DRAFT_LOGS]);
      }
      setLogTab('drafts');
    }
    
    notifyDataUpdate();

    if (logForm.saveFieldId && submittedFieldId !== selectedField.id) {
      updateSessionFieldId(submittedFieldId);
    }

    setLogForm({ type: 'weekly', fieldId: selectedField.id, saveFieldId: true, activity: '', cost: '', period: '', hours: '', hectares: '', people: '', taskId: null });
    closeLog();
  };

  const submitDraft = (log) => {
    const idx = DRAFT_LOGS.findIndex(d => d.id === log.id);
    if (idx >= 0) DRAFT_LOGS.splice(idx, 1);
    setDraftLogs([...DRAFT_LOGS]);
    MOCK_LOGS.unshift({ ...log, approved: false, isOffline: !synced, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
    setLogs([...MOCK_LOGS]);
    setLogTab('submitted');
  };

  const handleDraftAction = (log) => {
    Alert.alert(
      'Draft Options',
      'What would you like to do with this draft?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit Progress Log', onPress: () => {
            submitDraft(log);
            Alert.alert(
              'Log Submitted',
              'Your log has been sent to the Farm Manager. The stage will automatically be marked complete once it is approved.',
              [{ text: 'OK', style: 'default' }]
            );
        }},
        { text: 'Edit Log', onPress: () => {
            setLogForm({
              id: log.id,
              type: log.type, fieldId: log.fieldId, saveFieldId: true,
              activity: log.activity, cost: log.cost.toString(),
              period: log.type === 'weekly' ? log.week : log.month,
              hours: log.hours.toString(), hectares: log.hectares.toString(),
              people: log.people.toString(), taskId: log.taskId, isSubmit: false
            });
            setShowLog(true);
            Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
        }}
      ]
    );
  };

  const approveLog = (logId) => {
    if (!synced) {
      Alert.alert('Offline Mode', 'You are currently offline. Please connect to the internet to approve logs.');
      return;
    }
    const l = MOCK_LOGS.find(x => x.id === logId);
    if (l) {
      l.approved = true;

      // Automatically complete the stage when a log is approved
      const tasks = cycleTasksByField[l.fieldId] || CYCLE_TASKS.map(t => ({...t, done: false, active: false}));
      const taskIndex = tasks.findIndex(t => t.id === l.taskId);
      
      if (taskIndex > -1 && tasks[taskIndex].active && !tasks[taskIndex].done) {
        const updated = tasks.map(t => {
           if (t.id === l.taskId) return { ...t, done: true, active: false };
           if (t.active) return { ...t, active: false };
           return t;
        });
        
        setCycleTasksByField(p => ({ ...p, [l.fieldId]: updated }));
        
        const isFullyCompleted = updated.findIndex(t => !t.done) === -1;
        const newStageLabel = isFullyCompleted ? 'Harvesting & Milling (Completed)' : 'Waiting to Start Next Stage';
        
        if (l.fieldId === selectedField.id) {
          setSelectedField(prevF => ({ ...prevF, stage: newStageLabel }));
        }
        
        const mf = MOCK_FIELDS.find(f => f.id === l.fieldId);
        if (mf) mf.stage = newStageLabel;
      }
    }
    setLogs([...MOCK_LOGS]);
    notifyDataUpdate();
  };

  const rejectLog = (logId) => {
    if (!synced) {
      Alert.alert('Offline Mode', 'You are currently offline. Please connect to the internet to decline logs.');
      return;
    }
    const l = MOCK_LOGS.find(x => x.id === logId);
    if (l) l.declined = true;
    setLogs([...MOCK_LOGS]);
    notifyDataUpdate();
  };

  const visibleLogs = activeRole === 'Member' ? logs : logs.filter(l => !l.isOffline);
  const fieldLogs = visibleLogs.filter(l => l.fieldId === selectedField.id && !l.isPastCycle);
  const pastLogs = visibleLogs.filter(l => l.fieldId === selectedField.id && l.isPastCycle);

  const unsynced = MOCK_FIELDS.filter(f => !f.synced);

  // Dynamic calculations for month-level QR code compilation
  const activeCycleLogs = visibleLogs.filter(l => !l.isPastCycle);
  const uniqueFieldsCount = new Set(activeCycleLogs.map(l => l.fieldId)).size;
  const totalLogsCount = activeCycleLogs.length;
  const totalOperationalCost = activeCycleLogs.reduce((sum, l) => sum + l.cost, 0);

  const renderTimeline = () => {
    const tasks = cycleTasksByField[selectedField.id] || CYCLE_TASKS.map(t => ({...t, done: false, active: false}));
    const isFullyCompleted = tasks.every(t => t.done);
    return (
      <View style={{ marginBottom: SPACING.md }}>
        <View style={s.sectionRow}>
          <Text style={s.sectionLabel}>Crop Cycle Timeline</Text>
          <Text style={{fontSize: 10, color: COLORS.textMuted}}>Tap to update stage</Text>
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
                <Text style={[s.timelineLabel, task.active && { color: task.color, fontWeight: '800' }]}>{task.label}</Text>
                <Text style={s.timelineMonth}>{task.done ? 'Completed' : task.active ? 'In Progress' : 'Pending'}</Text>
                {task.active && (
                  <View style={[s.activeBadge, { backgroundColor: task.color }]}>
                    <Text style={s.activeBadgeText}>CURRENT STAGE</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
          {isFullyCompleted && (
            <TouchableOpacity style={{ marginTop: 16, backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: RADIUS.sm, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }} onPress={() => {
                 Alert.alert(
                   'Start New Crop Year',
                   'Are you sure you want to start a new crop cycle?',
                   [
                     { text: 'Cancel', style: 'cancel' },
                     { text: 'Yes, Start', style: 'default', onPress: () => {
                        setCycleTasksByField(p => ({
                          ...p,
                          [selectedField.id]: CYCLE_TASKS.map((t, i) => ({...t, done: false, active: false}))
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
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Start New Crop Year</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader right={
        <View style={{ flexDirection: 'row', gap: 4 }}>

          {/* Role Switcher (for demo) */}
          <TouchableOpacity style={s.roleBtn} onPress={() => {
            const roles = ['Member', 'Farm Manager', 'SRA (Admin)'];
            const idx = roles.indexOf(activeRole);
            const nextRole = roles[(idx + 1) % roles.length];
            setActiveRole(nextRole);
            setSession(nextRole); // Globally update the active demo account session
          }}>
            <Ionicons name="swap-horizontal-outline" size={16} color={COLORS.primary} />
            <Text style={s.roleBtnText}>{activeRole}</Text>
          </TouchableOpacity>
        </View>
      } />

      {/* Role Banner */}
      <View style={[s.roleBanner, activeRole === 'Member' && s.bannerMember, activeRole === 'Farm Manager' && s.bannerManager, activeRole === 'SRA (Admin)' && s.bannerSRA]}>
        <Ionicons
          name={activeRole === 'Member' ? 'person' : activeRole === 'Farm Manager' ? 'people' : 'shield-checkmark'}
          size={14}
          color='#fff'
        />
        <Text style={s.roleBannerText}>
          {activeRole === 'Member' && 'Member View — Log your field operations'}
          {activeRole === 'Farm Manager' && 'Farm Manager View — Review & compile SRA reports'}
          {activeRole === 'SRA (Admin)' && 'SRA Admin View — Scan QR & audit reports'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MEMBER VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'Member' && (
          <>
            {/* My Fields Selector */}
            <Text style={s.sectionLabel}>My Assigned Fields</Text>
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
              <TouchableOpacity
                style={[s.fieldChip, { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primaryLight, borderWidth: 1, borderStyle: 'dashed' }]}
                onPress={() => setShowAddField(!showAddField)}
              >
                <Ionicons name={showAddField ? 'close' : 'add'} size={14} color={COLORS.primary} />
                <Text style={[s.fieldChipText, { color: COLORS.primary, marginLeft: -2 }]}>{showAddField ? 'Cancel' : 'Add'}</Text>
              </TouchableOpacity>
            </ScrollView>

            {showAddField && (
              <View style={{ marginBottom: SPACING.md, padding: SPACING.md, backgroundColor: '#fff', borderRadius: RADIUS.md, ...SHADOW.card, borderWidth: 1, borderColor: COLORS.primaryLight }}>
                <Text style={[s.sectionLabel, { marginBottom: 8, marginTop: 0 }]}>Request Field Assignment</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput
                    style={[s.formInput, { flex: 2, paddingVertical: 8, height: 36, fontSize: 13, marginBottom: 0 }]}
                    value={reqFieldId}
                    onChangeText={setReqFieldId}
                    placeholder='e.g. FLD-999'
                    placeholderTextColor={COLORS.textMuted}
                  />
                  <TextInput
                    style={[s.formInput, { flex: 1, paddingVertical: 8, height: 36, fontSize: 13, marginBottom: 0 }]}
                    value={reqFieldHa}
                    onChangeText={setReqFieldHa}
                    placeholder='HA'
                    keyboardType='decimal-pad'
                    placeholderTextColor={COLORS.textMuted}
                  />
                  <TouchableOpacity style={[s.submitBtn, { marginTop: 0, paddingVertical: 8, paddingHorizontal: 16, height: 36, borderRadius: 6 }]} onPress={handleRequestField}>
                    <Text style={[s.submitBtnText, { fontSize: 13 }]}>Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={s.sectionLabel}>Selected Field Details</Text>
            <View style={s.fieldCard}>
              <View style={s.fieldCardTop}>
                <View style={s.fieldIdBadge}><Text style={s.fieldIdText}>{selectedField.id}</Text></View>
                <Text style={s.fieldHa}>{selectedField.ha} Ha</Text>
              </View>
              <Text style={s.fieldStage}>Current Stage: <Text style={s.fieldStageVal}>{selectedField.stage}</Text></Text>
              <Text style={s.fieldSync}>
                <Ionicons name={selectedField.synced ? 'cloud-done-outline' : 'cloud-offline-outline'} size={12} color={selectedField.synced ? '#267326' : '#C97A00'} />
                {' '}{selectedField.synced ? `Synced ${selectedField.lastSync}` : `Last synced ${selectedField.lastSync} — queued for upload`}
              </Text>
            </View>

            {/* Crop Cycle Timeline */}
            {renderTimeline()}

            {/* Log History Header & Unplanned */}
            <View style={s.sectionRow}>
              <Text style={s.sectionLabel}>Operation Logs</Text>
              <TouchableOpacity style={[s.addLogBtn, { backgroundColor: '#F5A623', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, flexDirection: 'row', gap: 4 }]} onPress={() => {
                setLogForm(p => ({...p, fieldId: selectedField.id, activity: '', taskId: 'Emergency', isSubmit: true}));
                setShowLog(true);
                Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
              }}>
                <Ionicons name="warning-outline" size={14} color="#fff" />
                <Text style={[s.addLogBtnText, { fontSize: 11 }]}>Unplanned Work</Text>
              </TouchableOpacity>
            </View>

            {/* Log Tabs */}
            <View style={s.logTabsRow}>
              <TouchableOpacity style={[s.logTabBtn, logTab === 'submitted' && s.logTabBtnActive]} onPress={() => setLogTab('submitted')}>
                <Text style={[s.logTabText, logTab === 'submitted' && s.logTabTextActive]}>Submitted Logs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.logTabBtn, logTab === 'drafts' && s.logTabBtnActive]} onPress={() => setLogTab('drafts')}>
                <Text style={[s.logTabText, logTab === 'drafts' && s.logTabTextActive]}>
                  Draft Logs {draftLogs.filter(l => l.fieldId === selectedField.id).length > 0 && `(${draftLogs.filter(l => l.fieldId === selectedField.id).length})`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.logTabBtn, logTab === 'past' && s.logTabBtnActive]} onPress={() => setLogTab('past')}>
                <Text style={[s.logTabText, logTab === 'past' && s.logTabTextActive]}>Past Cycles</Text>
              </TouchableOpacity>
            </View>

            {(logTab === 'submitted' || logTab === 'past') && (
              <>
                {(logTab === 'submitted' ? fieldLogs : pastLogs).length === 0 && (
                  <View style={s.emptyCard}>
                    <Ionicons name={logTab === 'past' ? "time-outline" : "document-outline"} size={32} color={COLORS.border} />
                    <Text style={s.emptyText}>No {logTab === 'past' ? 'logs from past cycles' : 'submitted logs'} yet.</Text>
                  </View>
                )}
                {(logTab === 'submitted' ? fieldLogs : pastLogs).map(log => (
                  <View key={log.id} style={s.receiptCard}>
                    <View style={s.receiptHeader}>
                      <Text style={[s.receiptTitle, log.taskId === 'Emergency' && { color: '#D9534F' }]}>
                        {log.taskId === 'Emergency' ? 'UNPLANNED WORK' : (log.type === 'weekly' ? 'Weekly Log' : 'Monthly Log')}
                      </Text>
                      <Text style={s.receiptId}>#{log.id}</Text>
                    </View>
                    <View style={s.receiptDivider} />
                    <View style={s.receiptBody}>
                      <View style={s.receiptRow}><Text style={s.receiptLabel}>Activity</Text><Text style={s.receiptValueBold}>{log.activity}</Text></View>
                      <View style={s.receiptRow}><Text style={s.receiptLabel}>Work Done</Text><Text style={s.receiptValue}>{log.hours} hrs · {log.hectares} ha · {log.people} people</Text></View>
                      <View style={s.receiptRow}><Text style={s.receiptLabel}>Total Cost</Text><Text style={s.receiptCostText}>Php {log.cost.toLocaleString()}</Text></View>
                      <View style={s.receiptRow}>
                        <Text style={s.receiptLabel}>Date</Text>
                        <Text style={s.receiptValue}>{log.type === 'weekly' ? log.week : log.month}</Text>
                      </View>
                      <View style={s.receiptRow}>
                        <Text style={s.receiptLabel}>Status</Text>
                        <View style={[s.receiptStatusBadge, { 
                          backgroundColor: log.declined ? '#FFEAEB' : (log.approved ? '#F2FBF2' : '#FFFBF0'), 
                          borderColor: log.declined ? '#FFD4D4' : (log.approved ? '#E8F5E8' : '#FEF0D0') 
                        }]}>
                          <Ionicons name={log.declined ? 'close-circle-outline' : (log.approved ? 'checkmark-circle-outline' : 'time-outline')} size={14} color={log.declined ? '#D9534F' : (log.approved ? '#267326' : '#C97A00')} />
                          <Text style={[s.receiptStatusText, { color: log.declined ? '#D9534F' : (log.approved ? '#267326' : '#C97A00') }]}>
                            {log.declined ? 'Declined by Manager' : (log.approved ? 'Approved by Manager' : (log.isOffline ? 'Pending Sync (Offline)' : 'Pending Manager Review'))}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            )}

            {logTab === 'drafts' && (
              <>
                {draftLogs.filter(l => l.fieldId === selectedField.id).length === 0 && (
                  <View style={s.emptyCard}>
                    <Ionicons name="document-outline" size={32} color={COLORS.border} />
                    <Text style={s.emptyText}>No draft logs.</Text>
                  </View>
                )}
                {draftLogs.filter(l => l.fieldId === selectedField.id).map(log => (
                  <View key={log.id} style={[s.receiptCard, { borderColor: '#F5A623', backgroundColor: '#FFFBF0' }]}>
                    <TouchableOpacity onPress={() => handleDraftAction(log)} activeOpacity={0.7}>
                      <View style={s.receiptHeader}>
                        <Text style={[s.receiptTitle, { color: log.taskId === 'Emergency' ? '#D9534F' : '#C97A00' }]}>
                          {log.taskId === 'Emergency' ? 'DRAFT UNPLANNED WORK' : (log.type === 'weekly' ? 'Draft Weekly Log' : 'Draft Monthly Log')}
                        </Text>
                        <Text style={s.receiptId}>#{log.id}</Text>
                      </View>
                      <View style={s.receiptDivider} />
                      <View style={s.receiptBody}>
                        <View style={s.receiptRow}><Text style={s.receiptLabel}>Activity</Text><Text style={s.receiptValueBold}>{log.activity}</Text></View>
                        <View style={s.receiptRow}><Text style={s.receiptLabel}>Work Done</Text><Text style={s.receiptValue}>{log.hours} hrs · {log.hectares} ha · {log.people} people</Text></View>
                        <View style={s.receiptRow}><Text style={s.receiptLabel}>Total Cost</Text><Text style={[s.receiptCostText, { color: '#C97A00' }]}>Php {log.cost.toLocaleString()}</Text></View>
                        <View style={s.receiptRow}>
                          <Text style={s.receiptLabel}>Status</Text>
                          <View style={[s.receiptStatusBadge, { backgroundColor: '#F5A62320', borderColor: '#F5A623' }]}>
                            <Ionicons name="create-outline" size={14} color="#C97A00" />
                            <Text style={[s.receiptStatusText, { color: '#C97A00' }]}>Draft</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
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
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 }}>GENERATE AUDIT LOGS</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{ backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border, paddingVertical: 12, borderRadius: RADIUS.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }} 
                onPress={() => setShowManagerAssignModal(true)}
              >
                <Ionicons name="person-add-outline" size={16} color={COLORS.text} />
                <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: '700' }}>Assign New Field</Text>
              </TouchableOpacity>
            </View>

            {/* Field Assignment Requests */}
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <View style={{ marginBottom: SPACING.md }}>
                <Text style={[s.sectionLabel, { color: '#D9534F' }]}>Pending Field Assignments ({requests.filter(r => r.status === 'pending').length})</Text>
                {requests.filter(r => r.status === 'pending').map(req => (
                  <View key={req.id} style={[s.receiptCard, { borderColor: COLORS.primary }]}>
                    <View style={s.receiptHeader}>
                      <Text style={s.receiptTitle}>Assignment Request</Text>
                      <Text style={s.receiptId}>#{req.id}</Text>
                    </View>
                    <View style={s.receiptDivider} />
                    <View style={s.receiptBody}>
                      <View style={s.receiptRow}><Text style={s.receiptLabel}>Member</Text><Text style={s.receiptValueBold}>{req.memberName}</Text></View>
                      <View style={s.receiptRow}><Text style={s.receiptLabel}>Requested Field</Text><Text style={s.receiptValueBold}>{req.fieldId} · {req.ha} Ha</Text></View>
                      <View style={s.receiptRow}><Text style={s.receiptLabel}>Date</Text><Text style={s.receiptValue}>{req.date}</Text></View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                      <TouchableOpacity style={[s.receiptApproveBtn, { flex: 1, backgroundColor: '#D9534F' }]} onPress={() => resolveAssignmentRequest(req.id, false)}>
                        <Text style={s.receiptApproveBtnText}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[s.receiptApproveBtn, { flex: 1, backgroundColor: COLORS.success }]} onPress={() => {
                        resolveAssignmentRequest(req.id, true);
                        if (!MOCK_FIELDS.find(f => f.id === req.fieldId)) {
                           MOCK_FIELDS.push({ id: req.fieldId, member: req.memberName, ha: req.ha, stage: 'Land Preparation', month: 0, synced: false, lastSync: 'Just now' });
                        } else {
                           MOCK_FIELDS.find(f => f.id === req.fieldId).member = req.memberName;
                           if(req.ha !== '0.0') MOCK_FIELDS.find(f => f.id === req.fieldId).ha = req.ha;
                        }
                        Alert.alert('Approved', `${req.fieldId} assigned to ${req.memberName}.`);
                      }}>
                        <Text style={s.receiptApproveBtnText}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
            {/* Sync Status Warning */}
            {unsynced.length > 0 && (
              <View style={s.syncWarning}>
                <Ionicons name="alert-circle" size={18} color='#C97A00' />
                <Text style={s.syncWarningText}>
                  {unsynced.length} field(s) not recently synced: {unsynced.map(f => f.id).join(', ')}
                </Text>
              </View>
            )}

            {/* Field Selector */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={[s.sectionLabel, { marginBottom: 0 }]}>All Block Farm Fields</Text>
              {MOCK_FIELDS.length > 3 && (
                <TouchableOpacity onPress={() => setShowFieldsModal(true)}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }}>Show More</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginBottom: SPACING.md }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 8, paddingBottom: 4 }}>
              {MOCK_FIELDS.slice(0, 3).map(field => (
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
              {MOCK_FIELDS.length > 3 && (
                <TouchableOpacity style={[s.fieldChip, { backgroundColor: COLORS.background }]} onPress={() => setShowFieldsModal(true)}>
                  <Text style={[s.fieldChipText, { color: COLORS.primary }]}>+ {MOCK_FIELDS.length - 3} More</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            {/* Selected Field Detail */}
            <View style={s.fieldCard}>
              <View style={s.fieldCardTop}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={s.fieldIdBadge}><Text style={s.fieldIdText}>{selectedField.id}</Text></View>
                  <Text style={s.fieldHa}>{selectedField.ha} Ha</Text>
                </View>
                {activeRole === 'Farm Manager' && (
                  <TouchableOpacity onPress={() => setIsTakeOver(!isTakeOver)} style={{ backgroundColor: isTakeOver ? '#D9534F' : COLORS.primaryBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: isTakeOver ? '#fff' : COLORS.primary }}>{isTakeOver ? 'Cancel Take Over' : 'Take Over Field'}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={s.fieldMember}>Member: {selectedField.member}</Text>
              <Text style={s.fieldStage}>Stage: <Text style={s.fieldStageVal}>{selectedField.stage}</Text></Text>
              <Text style={[s.fieldSync, { color: selectedField.synced ? COLORS.success : '#C97A00' }]}>
                <Ionicons name={selectedField.synced ? 'cloud-done-outline' : 'cloud-offline-outline'} size={12} color={selectedField.synced ? '#267326' : '#C97A00'} />
                {' '}{selectedField.synced ? `Synced ${selectedField.lastSync}` : `Not synced — last seen ${selectedField.lastSync}`}
              </Text>
            </View>

            {/* Crop Cycle Timeline */}
            {renderTimeline()}

            {/* Logs for selected field */}
            <Text style={s.sectionLabel}>Operation Logs — {selectedField.id}</Text>
            <View style={s.logTabsRow}>
              <TouchableOpacity style={[s.logTabBtn, managerLogTab === 'pending' && s.logTabBtnActive]} onPress={() => setManagerLogTab('pending')}>
                <Text style={[s.logTabText, managerLogTab === 'pending' && s.logTabTextActive]}>
                  Waiting Approval {fieldLogs.filter(l => !l.approved && !l.declined).length > 0 && `(${fieldLogs.filter(l => !l.approved && !l.declined).length})`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.logTabBtn, managerLogTab === 'approved' && s.logTabBtnActive]} onPress={() => setManagerLogTab('approved')}>
                <Text style={[s.logTabText, managerLogTab === 'approved' && s.logTabTextActive]}>
                  Approved
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.logTabBtn, managerLogTab === 'declined' && s.logTabBtnActive]} onPress={() => setManagerLogTab('declined')}>
                <Text style={[s.logTabText, managerLogTab === 'declined' && s.logTabTextActive]}>
                  Declined
                </Text>
              </TouchableOpacity>
            </View>
            
            {(() => {
              const displayLogs = managerLogTab === 'pending' 
                ? fieldLogs.filter(l => !l.approved && !l.declined) 
                : managerLogTab === 'approved' 
                  ? fieldLogs.filter(l => l.approved && !l.declined) 
                  : fieldLogs.filter(l => l.declined);
              return (
                <>
                  {displayLogs.length === 0 && (
                    <View style={s.emptyCard}>
                      <Ionicons name={managerLogTab === 'pending' ? "checkmark-circle-outline" : "document-outline"} size={32} color={managerLogTab === 'pending' ? COLORS.success : COLORS.border} />
                      <Text style={s.emptyText}>{managerLogTab === 'pending' ? 'All logs are approved.' : managerLogTab === 'declined' ? 'No declined logs.' : 'No approved logs yet.'}</Text>
                    </View>
                  )}
                  {displayLogs.map(log => (
                    <View key={log.id} style={s.receiptCard}>
                      <View style={s.receiptHeader}>
                        <Text style={s.receiptTitle}>{log.type === 'weekly' ? 'Weekly Operation Log' : 'Monthly Operation Log'}</Text>
                        <Text style={s.receiptId}>#{log.id}</Text>
                      </View>
                      <View style={s.receiptDivider} />
                      <View style={s.receiptBody}>
                        <View style={s.receiptRow}>
                          <Text style={s.receiptLabel}>Activity</Text>
                          <Text style={s.receiptValueBold}>{log.activity}</Text>
                        </View>
                        {log.hours && (
                          <View style={s.receiptRow}>
                            <Text style={s.receiptLabel}>Work Done</Text>
                            <Text style={s.receiptValue}>{log.hours} hrs · {log.hectares} ha · {log.people} people</Text>
                          </View>
                        )}
                        <View style={s.receiptRow}>
                          <Text style={s.receiptLabel}>Date Logged</Text>
                          <Text style={s.receiptValue}>{log.date}</Text>
                        </View>
                        <View style={s.receiptRow}>
                          <Text style={s.receiptLabel}>Total Cost</Text>
                          <Text style={s.receiptCostText}>Php {log.cost.toLocaleString()}</Text>
                        </View>
                        <View style={s.receiptRow}>
                          <Text style={s.receiptLabel}>Status</Text>
                          <View style={[s.receiptStatusBadge, { 
                            backgroundColor: log.declined ? '#FFEAEB' : (log.approved ? '#F2FBF2' : '#FFFBF0'), 
                            borderColor: log.declined ? '#FFD4D4' : (log.approved ? '#E8F5E8' : '#FEF0D0') 
                          }]}>
                            <Ionicons name={log.declined ? 'close-circle-outline' : (log.approved ? 'checkmark-circle-outline' : 'time-outline')} size={14} color={log.declined ? '#D9534F' : (log.approved ? '#267326' : '#C97A00')} />
                            <Text style={[s.receiptStatusText, { color: log.declined ? '#D9534F' : (log.approved ? '#267326' : '#C97A00') }]}>
                              {log.declined ? 'Declined by Manager' : (log.approved ? 'Approved' : (!synced ? 'Pending Sync (Offline)' : 'Awaiting Approval'))}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {!log.approved && !log.declined && (log.isOffline === false || log.isOffline === undefined) && (
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TouchableOpacity style={[s.receiptApproveBtn, { flex: 1, backgroundColor: '#D9534F' }]} onPress={() => rejectLog(log.id)}>
                            <Ionicons name="close-circle-outline" size={16} color="#fff" />
                            <Text style={s.receiptApproveBtnText}>Decline</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[s.receiptApproveBtn, { flex: 1 }]} onPress={() => approveLog(log.id)}>
                            <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                            <Text style={s.receiptApproveBtnText}>Approve</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      {!log.approved && log.isOffline === true && (
                        <View style={[s.receiptApproveBtn, { backgroundColor: '#E2E8F0' }]}>
                          <Ionicons name="cloud-offline-outline" size={16} color="#64748B" />
                          <Text style={[s.receiptApproveBtnText, { color: '#64748B' }]}>Pending Sync</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </>
              );
            })()}

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
                    'Silay Block Farm A': { ha: 18.5, members: 42, cost: 262700, pending: 8, logs: 840, declined: 14 },
                    'Silay Block Farm B': { ha: 20.0, members: 55, cost: 336000, pending: 12, logs: 915, declined: 22 },
                    'Silay Block Farm C': { ha: 28.0, members: 89, cost: 366800, pending: 5, logs: 1105, declined: 9 },
                    'Silay Block Farm D': { ha: 22.0, members: 63, cost: 253000, pending: 14, logs: 552, declined: 18 },
                  };

                  const displayHa = isAll ? 88.5 : (BLOCK_FARM_DATA[selectedFarm]?.ha || 0);
                  const displayMembers = isAll ? 249 : (BLOCK_FARM_DATA[selectedFarm]?.members || 0);
                  const displayCost = isAll ? 1218500 : (BLOCK_FARM_DATA[selectedFarm]?.cost || 0);
                  const displayPending = isAll ? 39 : (BLOCK_FARM_DATA[selectedFarm]?.pending || 0);
                  const displayLogs = isAll ? 3412 : (BLOCK_FARM_DATA[selectedFarm]?.logs || 0);
                  const displayDeclined = isAll ? 63 : (BLOCK_FARM_DATA[selectedFarm]?.declined || 0);
                  const fManagers = isAll ? MOCK_MANAGERS : MOCK_MANAGERS.filter(m => m.blockFarm === selectedFarm);

                  return [
                    {
                      label: 'Total Hectares',
                      value: `${displayHa.toFixed(1)} Ha`,
                      icon: 'map-outline',
                      color: COLORS.primary,
                    },
                    {
                      label: 'Active Members',
                      value: `${displayMembers} Members`,
                      icon: 'people-outline',
                      color: '#1A6B9A',
                    },
                    {
                      label: 'Farm Managers',
                      value: `${fManagers.length} Managers`,
                      icon: 'briefcase-outline',
                      color: '#8F3A8F',
                    },
                    {
                      label: 'Approved Logs',
                      value: `${displayLogs} Logs`,
                      icon: 'checkmark-circle-outline',
                      color: COLORS.success,
                    },
                    {
                      label: 'Total Op. Cost',
                      value: `₱${displayCost >= 1000000 ? (displayCost / 1000000).toFixed(2) + 'M' : (displayCost / 1000).toFixed(1) + 'k'}`,
                      icon: 'cash-outline',
                      color: '#F5A623',
                    },
                    {
                      label: 'Pending Logs',
                      value: `${displayPending} Pending`,
                      icon: 'time-outline',
                      color: '#C97A00',
                    },
                    {
                      label: 'Declined Logs',
                      value: `${displayDeclined} Declined`,
                      icon: 'close-circle-outline',
                      color: '#D9534F',
                    },
                  ].map(stat => (
                    <View key={stat.label} style={{ width: '47%', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.sm, gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name={stat.icon} size={14} color={stat.color} />
                        <Text style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 }}>{stat.label}</Text>
                      </View>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: stat.color }}>{stat.value}</Text>
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
              <Text style={s.scannerTitle}>Scan Manager QR Code</Text>
              <Text style={s.scannerSub}>Point camera at the Farm Manager's phone screen to import this month's compiled field report.</Text>
              <View style={s.scannerBtn}>
                <Ionicons name="camera-outline" size={18} color="#fff" />
                <Text style={s.scannerBtnText}>Open QR Scanner</Text>
              </View>
            </TouchableOpacity>

            {/* Manual QR Input Fallback */}
            <View style={{ backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, ...SHADOW.card }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8, letterSpacing: 1 }}>OR ENTER MANUALLY</Text>
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
                    'Report Loaded Successfully ✓',
                    `May 2026 Block Farm Report loaded.\n\n• ${uniqueFieldsCount} fields\n• ${totalLogsCount} operation logs\n• Total cost: Php ${totalOperationalCost.toLocaleString()}\n• Manager: Jose Reyes`,
                    [{ text: 'View Report', style: 'default' }]
                  );
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: manualQR.length > 0 ? '#fff' : COLORS.textMuted }}>Submit Manual ID</Text>
              </TouchableOpacity>
            </View>

            {/* Last Audit Summary */}
            <Text style={s.sectionLabel}>Last Scanned Report</Text>
            <View style={s.auditCard}>
              <View style={s.auditHeader}>
                <Ionicons name="document-text" size={18} color={COLORS.primary} />
                <Text style={s.auditTitle}>Block Farm — May 2026 Report</Text>
              </View>
              <View style={s.auditRow}><Text style={s.auditLabel}>Total Fields Reported</Text><Text style={s.auditVal}>{uniqueFieldsCount} fields</Text></View>
              <View style={s.auditRow}><Text style={s.auditLabel}>Total Operational Cost</Text><Text style={s.auditVal}>Php {totalOperationalCost.toLocaleString()}</Text></View>
              <View style={s.auditRow}><Text style={s.auditLabel}>Logs Approved by Manager</Text><Text style={s.auditVal}>{logs.filter(l => l.approved).length} / {totalLogsCount}</Text></View>
              <View style={s.auditRow}><Text style={s.auditLabel}>Report Generated</Text><Text style={s.auditVal}>May 21, 2026</Text></View>
              <TouchableOpacity 
                style={s.pdfBtn}
                onPress={() => {
                  Alert.alert(
                    'Exporting PDF',
                    `Generating District Operations Report for ${selectedFarm}...`,
                    [
                      { text: 'Cancel', style: 'cancel' },
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

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Add Log Bottom Sheet ── */}
      <Modal visible={showLog} transparent animationType="none">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closeLog} />
        <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={s.sheetHandle} />
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Add Operation Log</Text>
            <TouchableOpacity onPress={closeLog}><Ionicons name="close" size={22} color={COLORS.text} /></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={s.sheetBody} keyboardShouldPersistTaps="handled">
            {/* Log Type Toggle */}
            <Text style={s.formLabel}>Log Type</Text>
            <View style={s.typeToggle}>
              {['weekly', 'monthly'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[s.typeBtn, logForm.type === t && s.typeBtnActive]}
                  onPress={() => setLogForm(p => ({ ...p, type: t }))}
                >
                  <Text style={[s.typeBtnText, logForm.type === t && s.typeBtnTextActive]}>
                    {t === 'weekly' ? 'Weekly Log' : 'Monthly Log'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.formLabel}>Field ID *</Text>
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

            <Text style={s.formLabel}>Date *</Text>
            <TouchableOpacity onPress={() => setShowCalendar(true)}>
              <View pointerEvents="none">
                <TextInput
                  style={[s.formInput, { color: COLORS.text }]}
                  value={logForm.period}
                  editable={false}
                  placeholder='Tap to select date'
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </TouchableOpacity>

            <Text style={s.formLabel}>Activity / Operation *</Text>
            <TextInput
              style={[s.formInput, { backgroundColor: logForm.taskId === 'Emergency' ? '#fff' : '#f0f0f0', color: logForm.taskId === 'Emergency' ? COLORS.text : COLORS.textMuted }]}
              value={logForm.activity}
              onChangeText={v => setLogForm(p => ({ ...p, activity: v }))}
              editable={logForm.taskId === 'Emergency'}
              placeholder={logForm.taskId === 'Emergency' ? "Describe the unplanned work..." : ""}
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={s.formLabel}>Operational Cost (Php) *</Text>
            <TextInput
              style={[s.formInput, { marginBottom: SPACING.md }]}
              value={logForm.cost}
              onChangeText={v => setLogForm(p => ({ ...p, cost: v }))}
              keyboardType="decimal-pad"
              placeholder='e.g. 4500'
              placeholderTextColor={COLORS.textMuted}
            />

            {/* New Work Logs */}
            <Text style={s.formLabel}>Time Taken (Hours) *</Text>
            <TextInput
              style={s.formInput}
              value={logForm.hours}
              onChangeText={v => setLogForm(p => ({ ...p, hours: v }))}
              keyboardType="decimal-pad"
              placeholder='e.g. 8'
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={s.formLabel}>Hectares Covered *</Text>
            <TextInput
              style={s.formInput}
              value={logForm.hectares}
              onChangeText={v => setLogForm(p => ({ ...p, hectares: v }))}
              keyboardType="decimal-pad"
              placeholder='e.g. 1.5'
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={s.formLabel}>Number of People / Workers *</Text>
            <TextInput
              style={s.formInput}
              value={logForm.people}
              onChangeText={v => setLogForm(p => ({ ...p, people: v }))}
              keyboardType="number-pad"
              placeholder='e.g. 10'
              placeholderTextColor={COLORS.textMuted}
            />

            <View style={s.sheetFooter}>
              <TouchableOpacity style={s.cancelBtn} onPress={closeLog}>
                <Text style={s.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.submitBtn} onPress={submitLog}>
                <Ionicons name={logForm.isSubmit ? "paper-plane-outline" : "create-outline"} size={16} color="#fff" />
                <Text style={s.submitBtnText}>{logForm.isSubmit ? 'Submit Progress Log' : 'Save Draft'}</Text>
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
                  'QR Scanned Successfully ✓',
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
              <TouchableOpacity key={field.id} style={[s.receiptCard, selectedField.id === field.id && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg, marginBottom: 0 }, { marginBottom: 0 }]} onPress={() => {
                setSelectedField(field);
                updateSessionFieldId(field.id);
                setShowFieldsModal(false);
                setFieldSearch('');
              }}>
                <View style={s.receiptHeader}>
                  <Text style={[s.receiptTitle, { color: COLORS.text }]}>{field.id}</Text>
                  <Text style={s.receiptId}>{field.ha} Ha</Text>
                </View>
                <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Member: {field.member}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>Stage: <Text style={{ color: COLORS.text }}>{field.stage}</Text></Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <View style={[s.syncDot, { backgroundColor: field.synced ? COLORS.success : '#C97A00' }]} />
                  <Text style={{ fontSize: 10, color: field.synced ? COLORS.success : '#C97A00' }}>
                    {field.synced ? `Synced ${field.lastSync}` : `Not synced`}
                  </Text>
                </View>
              </TouchableOpacity>
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
            <Text style={s.sheetTitle}>Assign Field to Member</Text>
            <TouchableOpacity onPress={() => setShowManagerAssignModal(false)}>
              <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={s.sheetBody}>
            <View style={{ gap: 4 }}>
              <Text style={s.formLabel}>Member ID / Name</Text>
              <TextInput style={s.formInput} placeholder="e.g. Juan dela Cruz or MBR-2026" value={managerAssignForm.memberName} onChangeText={t => setManagerAssignForm({...managerAssignForm, memberName: t})} />
            </View>
            <View style={{ gap: 4 }}>
              <Text style={s.formLabel}>Field ID</Text>
              <TextInput style={s.formInput} placeholder="e.g. FLD-KTR-008" value={managerAssignForm.fieldId} onChangeText={t => setManagerAssignForm({...managerAssignForm, fieldId: t})} />
            </View>
            <View style={{ gap: 4 }}>
              <Text style={s.formLabel}>Hectares (Ha)</Text>
              <TextInput style={s.formInput} placeholder="e.g. 1.5" keyboardType="numeric" value={managerAssignForm.ha} onChangeText={t => setManagerAssignForm({...managerAssignForm, ha: t})} />
            </View>
            <View style={s.sheetFooter}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowManagerAssignModal(false)}><Text style={s.cancelBtnText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={s.submitBtn} onPress={() => {
                if(!managerAssignForm.memberName || !managerAssignForm.fieldId || !managerAssignForm.ha) {
                  Alert.alert('Error', 'Please fill in all fields.');
                  return;
                }
                const existing = MOCK_FIELDS.find(f => f.id === managerAssignForm.fieldId);
                if (existing) {
                  existing.member = managerAssignForm.memberName;
                  existing.ha = managerAssignForm.ha;
                } else {
                  MOCK_FIELDS.push({
                    id: managerAssignForm.fieldId,
                    member: managerAssignForm.memberName,
                    ha: managerAssignForm.ha,
                    stage: 'Land Preparation',
                    month: 0,
                    synced: false,
                    lastSync: 'Just now',
                    blockFarm: session.farm || 'Silay Block Farm'
                  });
                }
                Alert.alert('Success', `${managerAssignForm.fieldId} assigned to ${managerAssignForm.memberName}.`);
                setShowManagerAssignModal(false);
                setManagerAssignForm({ memberName: '', fieldId: '', ha: '' });
              }}>
                <Text style={s.submitBtnText}>Assign Field</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  roleBannerText: { fontSize: 12, fontWeight: '600', color: '#fff' },

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
});
