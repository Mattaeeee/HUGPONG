import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Animated, Dimensions, TextInput, Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import AppHeader from '../components/AppHeader';
import { subscribe, getCurrentSession, setSynced, setSession, updateSessionFieldId } from '../data/mockData';

const { height, width } = Dimensions.get('window');

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_FIELDS = [
  { id: 'FLD-KTR-001', member: 'Juan dela Cruz', ha: '1.5', stage: 'Fertilization Stage 2', month: 3.2, synced: true, lastSync: '10 mins ago' },
  { id: 'FLD-KTR-003', member: 'Maria Santos', ha: '2.0', stage: 'Land Preparation', month: 0.3, synced: true, lastSync: '2 hrs ago' },
  { id: 'FLD-KTR-007', member: 'Pedro Reyes', ha: '1.0', stage: 'Harvesting', month: 10.5, synced: false, lastSync: '4 days ago' },
  { id: 'FLD-KTR-009', member: 'Ana Gomez', ha: '0.8', stage: 'Weeding', month: 5.1, synced: true, lastSync: '1 hr ago' },
];

const MEMBER_FIELD = MOCK_FIELDS[0]; // The currently logged-in member's field

const CYCLE_TASKS = [
  { id: 'T1', phase: 'Land Prep', icon: 'construct', color: '#8F3A8F', month: 0, label: 'Land Prep: Plowing (4h/ha), Dragging (2-3h), Hauling points before Subsoiler', done: true },
  { id: 'T2', phase: 'Planting', icon: 'leaf', color: '#4A7C2F', month: 1, label: 'Planting: Patdan (40,000 cane points/ha, 10-15 farmers for 1 day)', done: true },
  { id: 'T3', phase: 'Pre-emergence', icon: 'water', color: '#1A6B9A', month: 1.25, label: 'Pre-emergence Spraying (1 week post-planting)', done: true },
  { id: 'T4', phase: 'Fert Stage 1', icon: 'archive', color: '#1A6B9A', month: 2.5, label: 'Fertilization Stage 1 (18-46) & Ridge Busting (1.5–2 months post-planting)', done: true },
  { id: 'T5', phase: 'Fert Stage 2', icon: 'flask', color: '#4A7C2F', month: 3.5, label: 'Weeding, Fertilization Stage 2 (Urea) & Off-barring (1 month later)', done: false, active: true },
  { id: 'T6', phase: 'Fert Stage 3', icon: 'flask', color: '#F5A623', month: 4.5, label: 'Weeding, Fertilization Stage 3 (Urea + Potash) & On-barring (1 month later)', done: false },
  { id: 'T7', phase: 'Off-barring', icon: 'git-branch', color: '#8A9B7A', month: 5.5, label: 'Final Off-barring (1 month later)', done: false },
  { id: 'T8', phase: 'Harvest', icon: 'basket', color: '#D9534F', month: 10.5, label: 'Harvesting & Milling (5 months post-off-barring)', done: false },
];

const MOCK_LOGS = [
  { id: 'L1', fieldId: 'FLD-KTR-001', type: 'weekly', week: 'Week 1 – May', activity: 'Weeding labor', cost: 1200, date: 'May 7, 2026', approved: true },
  { id: 'L2', fieldId: 'FLD-KTR-001', type: 'monthly', month: 'May 2026', activity: 'Urea fertilizer (4 bags)', cost: 6400, date: 'May 1, 2026', approved: false },
  { id: 'L3', fieldId: 'FLD-KTR-003', type: 'weekly', week: 'Week 2 – May', activity: 'Land plowing (tractor)', cost: 5000, date: 'May 14, 2026', approved: true },
];

const STATUS_COLORS = { approved: COLORS.success, pending: '#F5A623', flagged: '#D9534F' };

export default function SchedulesScreen({ navigation }) {
  const [activeRole, setActiveRole] = useState(getCurrentSession().role);
  const [selectedField, setSelectedField] = useState(MOCK_FIELDS[0]);
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [showLog, setShowLog] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [logForm, setLogForm] = useState({ type: 'weekly', activity: '', cost: '', period: '' });
  const slideAnim = useRef(new Animated.Value(height)).current;

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
    });
    return unsubscribe;
  }, []);

  const openLog = () => {
    setShowLog(true);
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  };
  const closeLog = () => {
    Animated.timing(slideAnim, { toValue: height, duration: 220, useNativeDriver: true }).start(() => setShowLog(false));
  };

  const submitLog = () => {
    if (!logForm.activity.trim() || !logForm.cost) {
      Alert.alert('Required', 'Please fill in the activity and cost fields.');
      return;
    }
    const newLog = {
      id: `L${Date.now()}`,
      fieldId: selectedField.id,
      type: logForm.type,
      week: logForm.type === 'weekly' ? logForm.period || 'This Week' : undefined,
      month: logForm.type === 'monthly' ? logForm.period || 'This Month' : undefined,
      activity: logForm.activity,
      cost: parseFloat(logForm.cost) || 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      approved: false,
    };
    setLogs(prev => [newLog, ...prev]);
    setSynced(false); // Trigger unsynced state in AppHeader and ProfileScreen
    setLogForm({ type: 'weekly', activity: '', cost: '', period: '' });
    closeLog();
  };

  const approveLog = (id) => {
    setLogs(prev => prev.map(l => l.id === id ? { ...l, approved: true } : l));
  };

  const fieldLogs = logs.filter(l => l.fieldId === selectedField.id);

  const unsynced = MOCK_FIELDS.filter(f => !f.synced);

  // Dynamic calculations for month-level QR code compilation
  const uniqueFieldsCount = new Set(logs.map(l => l.fieldId)).size;
  const totalLogsCount = logs.length;
  const totalOperationalCost = logs.reduce((sum, l) => sum + l.cost, 0);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader right={
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {/* Role Switcher (for demo) */}
          <TouchableOpacity style={s.roleBtn} onPress={() => {
            const roles = ['Member', 'Farm Manager', 'SRA Checker'];
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
      <View style={[s.roleBanner, activeRole === 'Member' && s.bannerMember, activeRole === 'Farm Manager' && s.bannerManager, activeRole === 'SRA Checker' && s.bannerSRA]}>
        <Ionicons
          name={activeRole === 'Member' ? 'person' : activeRole === 'Farm Manager' ? 'people' : 'shield-checkmark'}
          size={14}
          color='#fff'
        />
        <Text style={s.roleBannerText}>
          {activeRole === 'Member' && 'Member View — Log your field operations'}
          {activeRole === 'Farm Manager' && 'Farm Manager View — Review & compile SRA reports'}
          {activeRole === 'SRA Checker' && 'SRA Checker View — Scan QR & audit reports'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MEMBER VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'Member' && (
          <>
            {/* Field Selector */}
            <Text style={s.sectionLabel}>Your Field</Text>
            <View style={s.fieldCard}>
              <View style={s.fieldCardTop}>
                <View style={s.fieldIdBadge}><Text style={s.fieldIdText}>{MEMBER_FIELD.id}</Text></View>
                <Text style={s.fieldHa}>{MEMBER_FIELD.ha} Ha</Text>
              </View>
              <Text style={s.fieldStage}>Current Stage: <Text style={s.fieldStageVal}>{MEMBER_FIELD.stage}</Text></Text>
              <Text style={s.fieldSync}>
                <Ionicons name={MEMBER_FIELD.synced ? 'cloud-done-outline' : 'cloud-offline-outline'} size={12} color={MEMBER_FIELD.synced ? '#267326' : '#C97A00'} />
                {' '}{MEMBER_FIELD.synced ? `Synced ${MEMBER_FIELD.lastSync}` : `Last synced ${MEMBER_FIELD.lastSync} — queued for upload`}
              </Text>
            </View>

            {/* Crop Cycle Timeline */}
            <Text style={s.sectionLabel}>Crop Cycle Timeline</Text>
            <View style={s.timelineCard}>
              {CYCLE_TASKS.map((task, i) => (
                <View key={task.id} style={s.timelineRow}>
                  <View style={s.timelineLeft}>
                    <View style={[s.timelineDot, { backgroundColor: task.done ? COLORS.success : task.active ? task.color : COLORS.border }]}>
                      {task.done && <Ionicons name="checkmark" size={10} color="#fff" />}
                      {task.active && !task.done && <View style={s.activePulse} />}
                    </View>
                    {i < CYCLE_TASKS.length - 1 && <View style={[s.timelineLine, { backgroundColor: task.done ? COLORS.success : COLORS.border }]} />}
                  </View>
                  <View style={[s.timelineContent, task.active && s.timelineContentActive]}>
                    <Text style={[s.timelineLabel, task.active && { color: task.color, fontWeight: '800' }]}>{task.label}</Text>
                    <Text style={s.timelineMonth}>Month {task.month}</Text>
                    {task.active && (
                      <View style={[s.activeBadge, { backgroundColor: task.color }]}>
                        <Text style={s.activeBadgeText}>CURRENT STAGE</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* Log History */}
            <View style={s.sectionRow}>
              <Text style={s.sectionLabel}>My Operation Logs</Text>
              <TouchableOpacity style={s.addLogBtn} onPress={openLog}>
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={s.addLogBtnText}>Add Log</Text>
              </TouchableOpacity>
            </View>
            {fieldLogs.length === 0 && (
              <View style={s.emptyCard}>
                <Ionicons name="document-outline" size={32} color={COLORS.border} />
                <Text style={s.emptyText}>No logs yet. Tap 'Add Log' to record an operation.</Text>
              </View>
            )}
            {fieldLogs.map(log => (
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
                    <View style={[s.receiptStatusBadge, { backgroundColor: log.approved ? '#F2FBF2' : '#FFFBF0', borderColor: log.approved ? '#E8F5E8' : '#FEF0D0' }]}>
                      <Ionicons name={log.approved ? 'checkmark-circle-outline' : 'time-outline'} size={14} color={log.approved ? '#267326' : '#C97A00'} />
                      <Text style={[s.receiptStatusText, { color: log.approved ? '#267326' : '#C97A00' }]}>
                        {log.approved ? 'Approved by Manager' : 'Pending Manager Review'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* FARM MANAGER VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'Farm Manager' && (
          <>
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
            <Text style={s.sectionLabel}>All Block Farm Fields</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 8, paddingBottom: 4 }}>
              {MOCK_FIELDS.map(field => (
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
            </ScrollView>

            {/* Selected Field Detail */}
            <View style={s.fieldCard}>
              <View style={s.fieldCardTop}>
                <View style={s.fieldIdBadge}><Text style={s.fieldIdText}>{selectedField.id}</Text></View>
                <Text style={s.fieldHa}>{selectedField.ha} Ha</Text>
              </View>
              <Text style={s.fieldMember}>Member: {selectedField.member}</Text>
              <Text style={s.fieldStage}>Stage: <Text style={s.fieldStageVal}>{selectedField.stage}</Text></Text>
              <Text style={[s.fieldSync, { color: selectedField.synced ? COLORS.success : '#C97A00' }]}>
                <Ionicons name={selectedField.synced ? 'cloud-done-outline' : 'cloud-offline-outline'} size={12} color={selectedField.synced ? '#267326' : '#C97A00'} />
                {' '}{selectedField.synced ? `Synced ${selectedField.lastSync}` : `Not synced — last seen ${selectedField.lastSync}`}
              </Text>
            </View>

            {/* Logs for selected field */}
            <Text style={s.sectionLabel}>Operation Logs — {selectedField.id}</Text>
            {fieldLogs.length === 0 && (
              <View style={s.emptyCard}>
                <Ionicons name="document-outline" size={32} color={COLORS.border} />
                <Text style={s.emptyText}>No logs from this field yet.</Text>
              </View>
            )}
            {fieldLogs.map(log => (
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
                    <View style={[s.receiptStatusBadge, { backgroundColor: log.approved ? '#F2FBF2' : '#FFFBF0', borderColor: log.approved ? '#E8F5E8' : '#FEF0D0' }]}>
                      <Ionicons name={log.approved ? 'checkmark-circle-outline' : 'time-outline'} size={14} color={log.approved ? '#267326' : '#C97A00'} />
                      <Text style={[s.receiptStatusText, { color: log.approved ? '#267326' : '#C97A00' }]}>
                        {log.approved ? 'Approved' : 'Awaiting Approval'}
                      </Text>
                    </View>
                  </View>
                </View>

                {!log.approved && (
                  <TouchableOpacity style={s.receiptApproveBtn} onPress={() => approveLog(log.id)}>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                    <Text style={s.receiptApproveBtnText}>Approve Log</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* SRA QR Generator */}
            <TouchableOpacity style={s.qrBtn} onPress={() => setShowQR(true)}>
              <Ionicons name="qr-code-outline" size={22} color="#fff" />
              <View style={{ flex: 1 }}>
                <Text style={s.qrBtnTitle}>Generate SRA Audit QR Code</Text>
                <Text style={s.qrBtnSub}>Compile all {uniqueFieldsCount} fields' monthly logs ({totalLogsCount} total) for SRA supervisor</Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SRA CHECKER VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'SRA Checker' && (
          <>
            <Text style={s.sectionLabel}>SRA Audit Center</Text>

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
              <TouchableOpacity style={s.pdfBtn}>
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
                    {t === 'weekly' ? '📅 Weekly Log' : '🗓️ Monthly Log'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.formLabel}>{logForm.type === 'weekly' ? 'Week' : 'Month'}</Text>
            <TextInput
              style={s.formInput}
              value={logForm.period}
              onChangeText={v => setLogForm(p => ({ ...p, period: v }))}
              placeholder={logForm.type === 'weekly' ? 'e.g. Week 3 – May' : 'e.g. May 2026'}
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={s.formLabel}>Activity / Operation *</Text>
            <TextInput
              style={s.formInput}
              value={logForm.activity}
              onChangeText={v => setLogForm(p => ({ ...p, activity: v }))}
              placeholder='e.g. Weeding labor, Urea fertilizer (4 bags)'
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={s.formLabel}>Operational Cost (Php) *</Text>
            <TextInput
              style={s.formInput}
              value={logForm.cost}
              onChangeText={v => setLogForm(p => ({ ...p, cost: v }))}
              keyboardType="decimal-pad"
              placeholder='e.g. 4500'
              placeholderTextColor={COLORS.textMuted}
            />

            <View style={s.sheetFooter}>
              <TouchableOpacity style={s.cancelBtn} onPress={closeLog}>
                <Text style={s.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.submitBtn} onPress={submitLog}>
                <Ionicons name="save-outline" size={16} color="#fff" />
                <Text style={s.submitBtnText}>Save Log (Offline)</Text>
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
  receiptCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: 16, borderWidth: 1.5, borderColor: '#DCE8CC', gap: 12, ...SHADOW.card, position: 'relative' },
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

  // Add Log Button
  addLogBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 7 },
  addLogBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // Log Cards
  logCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, gap: 8, ...SHADOW.card },
  logTypeBadge: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  logTypeText: { fontSize: 11, fontWeight: '700' },
  logActivity: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  logMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  logDate: { fontSize: 11, color: COLORS.textMuted },
  logCost: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  approvalBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  approvalText: { fontSize: 11, fontWeight: '600' },
  approveBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.success, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  approveBtnText: { fontSize: 11, fontWeight: '700', color: '#fff' },

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
