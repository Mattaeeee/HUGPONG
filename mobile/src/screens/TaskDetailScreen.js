import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';

const ACTIVITY_TYPES = [
  { key: 'fertilization', label: 'Fertilization', icon: 'leaf', color: '#4A7C2F' },
  { key: 'weeding', label: 'Weeding', icon: 'flower', color: '#6BA045' },
  { key: 'harvesting', label: 'Harvesting', icon: 'basket', color: '#F5A623' },
  { key: 'spraying', label: 'Spraying', icon: 'water', color: '#1A6B9A' },
  { key: 'planting', label: 'Planting', icon: 'git-branch', color: '#8F3A8F' },
  { key: 'other', label: 'Other', icon: 'ellipsis-horizontal', color: '#8A9B7A' },
];

const STATUS_CFG = {
  pending: { label: 'Pending', bg: '#FFF3DC', color: '#F5A623', next: 'in-progress', nextLabel: 'Start Task' },
  'in-progress': { label: 'In Progress', bg: '#E0F0FA', color: '#1A6B9A', next: 'completed', nextLabel: 'Mark Complete' },
  completed: { label: 'Completed', bg: '#E8F5E8', color: '#3A8F3A', next: null, nextLabel: null },
};

const RESOURCE_TYPES = [
  { key: 'bags', label: 'Fertilizer Bags', unit: 'bags', icon: 'cube' },
  { key: 'liters', label: 'Chemical (L)', unit: 'L', icon: 'flask' },
  { key: 'labor_days', label: 'Labor Days', unit: 'days', icon: 'people' },
  { key: 'equipment', label: 'Equipment', unit: 'units', icon: 'construct' },
];

const MOCK_ACTIVITY_LOG = [
  { time: '7:02 AM', user: 'Gabe', action: 'Task started' },
  { time: '9:45 AM', user: 'Gabe', action: 'Progress update: 1.2 Ha completed' },
];

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;
  const [status, setStatus] = useState(task.status);
  const [isEditing, setIsEditing] = useState(false);
  const [cabo, setCabo] = useState(task.cabo);
  const [targetNote, setTargetNote] = useState(task.target || '');
  const [resourceExpanded, setResourceExpanded] = useState(false);
  const [resources, setResources] = useState([{ key: 'bags', qty: '' }]);
  const [activityLog] = useState(MOCK_ACTIVITY_LOG);

  const cfg = STATUS_CFG[status];
  const type = ACTIVITY_TYPES.find(a => a.icon === task.icon) || ACTIVITY_TYPES[0];

  const advanceStatus = () => {
    if (!cfg.next) return;
    const nextCfg = STATUS_CFG[cfg.next];
    Alert.alert(
      cfg.nextLabel,
      `Set this task to "${nextCfg.label}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: cfg.nextLabel, onPress: () => setStatus(cfg.next) },
      ]
    );
  };

  const addResourceRow = () => setResources(r => [...r, { key: 'bags', qty: '' }]);
  const setResource = (i, field, val) => setResources(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle} numberOfLines={1}>Task Detail</Text>
        <TouchableOpacity style={s.editBtn} onPress={() => setIsEditing(e => !e)}>
          <Ionicons name={isEditing ? 'checkmark' : 'create-outline'} size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero Card */}
        <View style={s.heroCard}>
          <View style={s.heroTop}>
            <View style={[s.heroIconWrap, { backgroundColor: type.color + '18' }]}>
              <Ionicons name={task.icon} size={28} color={type.color} />
            </View>
            <View style={s.heroInfo}>
              <Text style={s.heroType}>{type.label}</Text>
              <Text style={s.heroName}>{task.name}</Text>
              <Text style={s.heroMeta}>{task.sector} · {task.plot}</Text>
            </View>
            <View style={[s.heroBadge, { backgroundColor: cfg.bg }]}>
              <Text style={[s.heroBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
          </View>
        </View>

        {/* Details Card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Task Details</Text>
          {[
            { icon: 'person', label: 'Cabo Assigned', value: cabo, editable: true, onEdit: setCabo },
            { icon: 'time', label: 'Scheduled Time', value: task.time },
            { icon: 'calendar', label: 'Date', value: new Date(task.date || Date.now()).toLocaleDateString('en-PH', { weekday: 'short', month: 'long', day: 'numeric' }) },
            { icon: 'flag', label: 'Target', value: targetNote, editable: true, onEdit: setTargetNote },
          ].map(row => (
            <View key={row.label} style={s.detailRow}>
              <View style={s.detailIcon}>
                <Ionicons name={row.icon} size={15} color={COLORS.textSecondary} />
              </View>
              <Text style={s.detailLabel}>{row.label}</Text>
              {isEditing && row.editable ? (
                <TextInput
                  style={s.detailInput}
                  value={row.value}
                  onChangeText={row.onEdit}
                  placeholderTextColor={COLORS.textMuted}
                />
              ) : (
                <Text style={s.detailValue}>{row.value || '—'}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Resource Allocation */}
        <TouchableOpacity style={s.expandHeader} onPress={() => setResourceExpanded(e => !e)}>
          <Ionicons name="cube-outline" size={16} color={COLORS.textSecondary} />
          <Text style={s.expandTitle}>Resource Allocation</Text>
          <Ionicons name={resourceExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        {resourceExpanded && (
          <View style={s.card}>
            {RESOURCE_TYPES.map(rt => (
              <View key={rt.key} style={s.resRow}>
                <Ionicons name={rt.icon} size={16} color={COLORS.primaryLight} style={{ width: 22 }} />
                <Text style={s.resLabel}>{rt.label}</Text>
                <TextInput
                  style={s.resInput}
                  placeholder="0"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="decimal-pad"
                />
                <Text style={s.resUnit}>{rt.unit}</Text>
              </View>
            ))}
            <View style={s.resTotalRow}>
              <Text style={s.resTotal}>Est. Resource Cost</Text>
              <Text style={s.resTotalVal}>Php 0.00</Text>
            </View>
          </View>
        )}

        {/* Personnel */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Personnel Assignment</Text>
          <View style={s.personnelRow}>
            {['Gabe', 'Jun', 'Mark', 'Ed'].map(name => (
              <View key={name} style={[s.personChip, name === cabo && s.personChipActive]}>
                <View style={s.personAvatar}><Text style={s.personAvatarText}>{name[0]}</Text></View>
                <Text style={[s.personName, name === cabo && { color: COLORS.primary }]}>{name}</Text>
                {name === cabo && <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />}
              </View>
            ))}
          </View>
        </View>

        {/* Activity Log */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Activity Log</Text>
          {activityLog.map((log, i) => (
            <View key={i} style={[s.logRow, i > 0 && s.logBorder]}>
              <Text style={s.logTime}>{log.time}</Text>
              <Text style={s.logUser}>{log.user}</Text>
              <Text style={s.logAction}>{log.action}</Text>
            </View>
          ))}
          {status === 'completed' && (
            <View style={[s.logRow, s.logBorder]}>
              <Text style={s.logTime}>Now</Text>
              <Text style={[s.logUser, { color: COLORS.success }]}>System</Text>
              <Text style={s.logAction}>Task marked completed ✓</Text>
            </View>
          )}
        </View>

        {/* Status Action Button */}
        {cfg.next && (
          <TouchableOpacity
            style={[s.actionBtn, status === 'pending' ? s.actionBtnStart : s.actionBtnComplete]}
            onPress={advanceStatus}
          >
            <Ionicons
              name={status === 'pending' ? 'play-circle' : 'checkmark-circle'}
              size={20}
              color="#fff"
            />
            <Text style={s.actionBtnText}>{cfg.nextLabel}</Text>
          </TouchableOpacity>
        )}

        {status === 'completed' && (
          <View style={s.completedBanner}>
            <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
            <Text style={s.completedText}>This task has been completed</Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, flex: 1, textAlign: 'center' },
  editBtn: { padding: 8 },
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 40 },
  heroCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.card },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
  heroIconWrap: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  heroInfo: { flex: 1, gap: 2 },
  heroType: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  heroName: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  heroMeta: { fontSize: 12, color: COLORS.textSecondary },
  heroBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  heroBadgeText: { fontSize: 11, fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.card },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  detailIcon: { width: 24, alignItems: 'center' },
  detailLabel: { fontSize: 12, color: COLORS.textMuted, width: 100 },
  detailValue: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.text, textAlign: 'right' },
  detailInput: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.text, textAlign: 'right', borderBottomWidth: 1, borderBottomColor: COLORS.primary, paddingBottom: 2 },
  expandHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md, ...SHADOW.card },
  expandTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  resRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  resLabel: { flex: 1, fontSize: 13, color: COLORS.text },
  resInput: { width: 60, textAlign: 'right', fontSize: 14, fontWeight: '700', color: COLORS.text, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 2 },
  resUnit: { fontSize: 11, color: COLORS.textMuted, width: 36 },
  resTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: SPACING.sm, marginTop: SPACING.sm, borderTopWidth: 1.5, borderTopColor: COLORS.primary },
  resTotal: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  resTotalVal: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  personnelRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  personChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: COLORS.background },
  personChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg },
  personAvatar: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  personAvatarText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  personName: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  logRow: { flexDirection: 'row', gap: SPACING.sm, paddingVertical: 8 },
  logBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  logTime: { fontSize: 10, color: COLORS.textMuted, width: 52 },
  logUser: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, width: 48 },
  logAction: { flex: 1, fontSize: 12, color: COLORS.text },
  actionBtn: { borderRadius: RADIUS.md, paddingVertical: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  actionBtnStart: { backgroundColor: COLORS.blue },
  actionBtnComplete: { backgroundColor: COLORS.success },
  actionBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  completedBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.successLight, borderRadius: RADIUS.md, padding: SPACING.md },
  completedText: { fontSize: 14, fontWeight: '600', color: COLORS.success },
});
