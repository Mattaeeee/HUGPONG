import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Animated, Dimensions, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { MOCK_TASKS } from '../data/mockData';
import AppHeader from '../components/AppHeader';

const { height } = Dimensions.get('window');
const DAYS = ['M', 'T', 'W', 'Th', 'F', 'S', 'S'];
const USER_ROLE = 'Lead Cabo'; // mock — replace with auth context
const CAN_CREATE = ['Lead Cabo', 'Hacienda Encargado', 'Supervisor'].includes(USER_ROLE);

const ACTIVITY_TYPES = [
  { key: 'fertilization', label: 'Fertilization', icon: 'leaf', color: '#4A7C2F' },
  { key: 'weeding', label: 'Weeding', icon: 'flower', color: '#6BA045' },
  { key: 'harvesting', label: 'Harvesting', icon: 'basket', color: '#F5A623' },
  { key: 'spraying', label: 'Spraying', icon: 'water', color: '#1A6B9A' },
  { key: 'planting', label: 'Planting', icon: 'git-branch', color: '#8F3A8F' },
  { key: 'other', label: 'Other', icon: 'ellipsis-horizontal', color: '#8A9B7A' },
];

const STATUS_CFG = {
  pending: { label: 'Pending', bg: '#FFF3DC', color: '#F5A623' },
  'in-progress': { label: 'In Progress', bg: '#E0F0FA', color: '#1A6B9A' },
  completed: { label: 'Completed', bg: '#E8F5E8', color: '#3A8F3A' },
};

function getWeekDates(offset = 0) {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function SchedulesScreen({ navigation }) {
  const today = new Date();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'timeline'
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [showCreate, setShowCreate] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  // Create form state
  const [form, setForm] = useState({ name: '', type: 'fertilization', sector: '', plot: '', cabo: '', time: '07:00', target: '', date: today.toISOString().split('T')[0] });
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const weekDates = getWeekDates(weekOffset);
  const weekLabel = `${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const filtered = tasks.filter(t => filter === 'all' || t.status === filter);

  const openCreate = () => {
    setShowCreate(true);
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  };
  const closeCreate = () => {
    Animated.timing(slideAnim, { toValue: height, duration: 220, useNativeDriver: true }).start(() => setShowCreate(false));
  };

  const addTask = () => {
    if (!form.name.trim()) { Alert.alert('Required', 'Task name is required'); return; }
    const type = ACTIVITY_TYPES.find(a => a.key === form.type);
    setTasks(prev => [...prev, {
      id: String(Date.now()), name: form.name, sector: form.sector || 'Sector A',
      plot: form.plot || 'Plot 1', cabo: form.cabo || '—', time: form.time,
      target: form.target, status: 'pending', icon: type?.icon || 'leaf', date: new Date(),
    }]);
    setForm({ name: '', type: 'fertilization', sector: '', plot: '', cabo: '', time: '07:00', target: '', date: today.toISOString().split('T')[0] });
    closeCreate();
  };

  const completeTask = (id) => {
    Alert.alert('Mark Complete?', 'Confirm this task was completed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: 'default', onPress: () => setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t)) },
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader right={
        <View style={s.headerRight}>
          <TouchableOpacity style={s.viewToggle} onPress={() => setViewMode(v => v === 'list' ? 'timeline' : 'list')}>
            <Ionicons name={viewMode === 'list' ? 'list' : 'time'} size={18} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn}>
            <Ionicons name="refresh" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      } />

      {/* Calendar Strip */}
      <View style={s.calCard}>
        <View style={s.weekNav}>
          <TouchableOpacity onPress={() => setWeekOffset(w => w - 1)} style={s.weekNavBtn}>
            <Ionicons name="chevron-back" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={s.weekLabel}>{weekLabel}</Text>
          <TouchableOpacity onPress={() => setWeekOffset(w => w + 1)} style={s.weekNavBtn}>
            <Ionicons name="chevron-forward" size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={s.calDayHeaders}>
          {DAYS.map((d, i) => <Text key={i} style={s.calDayHeader}>{d}</Text>)}
        </View>
        <View style={s.calDates}>
          {weekDates.map((d, i) => {
            const isToday = d.toDateString() === today.toDateString();
            const isSelected = d.getDate() === selectedDate;
            const hasTasks = tasks.some(t => t.date && new Date(t.date).toDateString() === d.toDateString());
            return (
              <TouchableOpacity key={i} style={[s.calDate, isSelected && s.calDateSelected]} onPress={() => setSelectedDate(d.getDate())}>
                <Text style={[s.calDateText, isSelected && s.calDateTextSel, isToday && !isSelected && s.calDateTextToday]}>
                  {d.getDate()}
                </Text>
                {hasTasks && <View style={[s.calDot, isSelected && { backgroundColor: '#fff' }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={s.filterBar}>
        {[['all', 'All'], ['pending', 'Pending'], ['in-progress', 'In Progress'], ['completed', 'Done']].map(([k, l]) => (
          <TouchableOpacity key={k} style={[s.filterTab, filter === k && s.filterTabActive]} onPress={() => setFilter(k)}>
            <Text style={[s.filterTabText, filter === k && s.filterTabTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List / Timeline */}
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View style={s.empty}>
            <Ionicons name="calendar-outline" size={48} color={COLORS.border} />
            <Text style={s.emptyText}>No {filter !== 'all' ? filter : ''} tasks</Text>
          </View>
        )}

        {viewMode === 'list' && filtered.map(task => {
          const cfg = STATUS_CFG[task.status];
          const type = ACTIVITY_TYPES.find(a => a.icon === task.icon) || ACTIVITY_TYPES[0];
          return (
            <TouchableOpacity key={task.id} style={s.taskCard} activeOpacity={0.85}
              onPress={() => navigation.navigate('TaskDetail', { task })}>
              <View style={[s.taskTypeBar, { backgroundColor: type.color }]} />
              <View style={[s.taskIconWrap, { backgroundColor: type.color + '18' }]}>
                <Ionicons name={task.icon} size={20} color={type.color} />
              </View>
              <View style={s.taskBody}>
                <View style={s.taskTopRow}>
                  <Text style={s.taskSector}>{task.sector} · {task.plot}</Text>
                  <View style={[s.statusBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[s.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>
                <Text style={s.taskName}>{task.name}</Text>
                <Text style={s.taskMeta}>Cabo: {task.cabo}  ·  {task.time}</Text>
                {task.target ? <Text style={s.taskTarget}>Target: {task.target}</Text> : null}
              </View>
              {task.status !== 'completed' && (
                <TouchableOpacity style={s.completeBtn} onPress={() => completeTask(task.id)}>
                  <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.success} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}

        {viewMode === 'timeline' && (
          <View style={s.timeline}>
            {filtered.map((task, i) => {
              const cfg = STATUS_CFG[task.status];
              const type = ACTIVITY_TYPES.find(a => a.icon === task.icon) || ACTIVITY_TYPES[0];
              return (
                <TouchableOpacity key={task.id} style={s.timelineRow} onPress={() => navigation.navigate('TaskDetail', { task })}>
                  <View style={s.timelineLeft}>
                    <Text style={s.timelineTime}>{task.time}</Text>
                    {i < filtered.length - 1 && <View style={s.timelineLine} />}
                  </View>
                  <View style={[s.timelineDot, { backgroundColor: type.color }]} />
                  <View style={[s.timelineCard, { borderLeftColor: type.color }]}>
                    <View style={s.timelineCardTop}>
                      <Text style={s.timelineTaskName}>{task.name}</Text>
                      <View style={[s.statusBadge, { backgroundColor: cfg.bg }]}>
                        <Text style={[s.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                      </View>
                    </View>
                    <Text style={s.timelineMeta}>{task.sector} · {task.plot} · {task.cabo}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB — role-gated */}
      {CAN_CREATE && (
        <TouchableOpacity style={s.fab} onPress={openCreate}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Create Task Bottom Sheet */}
      <Modal visible={showCreate} transparent animationType="none">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closeCreate} />
        <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={s.sheetHandle} />
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>New Task</Text>
            <TouchableOpacity onPress={closeCreate}><Ionicons name="close" size={22} color={COLORS.text} /></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={s.sheetScroll} keyboardShouldPersistTaps="handled">
            {/* Activity Type */}
            <Text style={s.formLabel}>Activity Type</Text>
            <View style={s.typeGrid}>
              {ACTIVITY_TYPES.map(a => (
                <TouchableOpacity key={a.key} style={[s.typeChip, form.type === a.key && { borderColor: a.color, backgroundColor: a.color + '15' }]}
                  onPress={() => setF('type', a.key)}>
                  <Ionicons name={a.icon} size={16} color={form.type === a.key ? a.color : COLORS.textMuted} />
                  <Text style={[s.typeLabel, form.type === a.key && { color: a.color, fontWeight: '700' }]}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Task Name */}
            <Text style={s.formLabel}>Task Name *</Text>
            <TextInput style={s.formInput} value={form.name} onChangeText={v => setF('name', v)} placeholder={`e.g. ${ACTIVITY_TYPES.find(a => a.key === form.type)?.label} – Plot 4`} placeholderTextColor={COLORS.textMuted} />
            {/* Row: Sector / Plot */}
            <View style={s.formRow}>
              <View style={s.formHalf}>
                <Text style={s.formLabel}>Sector</Text>
                <TextInput style={s.formInput} value={form.sector} onChangeText={v => setF('sector', v)} placeholder="Sector B" placeholderTextColor={COLORS.textMuted} />
              </View>
              <View style={s.formHalf}>
                <Text style={s.formLabel}>Plot</Text>
                <TextInput style={s.formInput} value={form.plot} onChangeText={v => setF('plot', v)} placeholder="Plot 4" placeholderTextColor={COLORS.textMuted} />
              </View>
            </View>
            {/* Row: Cabo / Time */}
            <View style={s.formRow}>
              <View style={s.formHalf}>
                <Text style={s.formLabel}>Cabo Assigned</Text>
                <TextInput style={s.formInput} value={form.cabo} onChangeText={v => setF('cabo', v)} placeholder="Name" placeholderTextColor={COLORS.textMuted} />
              </View>
              <View style={s.formHalf}>
                <Text style={s.formLabel}>Time</Text>
                <TextInput style={s.formInput} value={form.time} onChangeText={v => setF('time', v)} placeholder="07:00 AM" placeholderTextColor={COLORS.textMuted} />
              </View>
            </View>
            {/* Target */}
            <Text style={s.formLabel}>Target / Resources</Text>
            <TextInput style={s.formInput} value={form.target} onChangeText={v => setF('target', v)} placeholder="e.g. 12 Bags Urea / 2.0 Ha" placeholderTextColor={COLORS.textMuted} />
            <View style={{ height: 20 }} />
          </ScrollView>
          <View style={s.sheetFooter}>
            <TouchableOpacity style={s.cancelBtn} onPress={closeCreate}>
              <Text style={s.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.createBtn} onPress={addTask}>
              <Ionicons name="add-circle-outline" size={18} color="#fff" />
              <Text style={s.createBtnText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  headerRight: { flexDirection: 'row', gap: 4 },
  viewToggle: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  iconBtn: { padding: 8 },
  calCard: { backgroundColor: '#fff', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  weekNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  weekNavBtn: { padding: 6 },
  weekLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  calDayHeaders: { flexDirection: 'row', marginBottom: 4 },
  calDayHeader: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600', color: COLORS.textMuted },
  calDates: { flexDirection: 'row' },
  calDate: { flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 20, gap: 3 },
  calDateSelected: { backgroundColor: COLORS.primary },
  calDateText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  calDateTextSel: { color: '#fff' },
  calDateTextToday: { color: COLORS.primary },
  calDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.primary },
  filterBar: { flexDirection: 'row', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, backgroundColor: '#fff', gap: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  filterTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterTabText: { fontSize: 12, fontWeight: '500', color: COLORS.textMuted },
  filterTabTextActive: { color: '#fff', fontWeight: '700' },
  scroll: { padding: SPACING.lg, gap: SPACING.sm },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: COLORS.textMuted, textTransform: 'capitalize' },
  taskCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.card, alignItems: 'center' },
  taskTypeBar: { width: 4, alignSelf: 'stretch' },
  taskIconWrap: { width: 46, height: 46, borderRadius: 23, margin: SPACING.md, justifyContent: 'center', alignItems: 'center' },
  taskBody: { flex: 1, paddingVertical: SPACING.md, paddingRight: 4, gap: 3 },
  taskTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  taskSector: { fontSize: 10, color: COLORS.textMuted, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '700' },
  taskName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  taskMeta: { fontSize: 11, color: COLORS.textSecondary },
  taskTarget: { fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic' },
  completeBtn: { padding: SPACING.md },
  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, minHeight: 70 },
  timelineLeft: { width: 54, alignItems: 'flex-end', paddingTop: 6 },
  timelineTime: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  timelineLine: { flex: 1, width: 1, backgroundColor: COLORS.border, marginTop: 4, alignSelf: 'center' },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 8, flexShrink: 0 },
  timelineCard: { flex: 1, backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md, borderLeftWidth: 3, ...SHADOW.card, marginBottom: 8 },
  timelineCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  timelineTaskName: { fontSize: 13, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: 6 },
  timelineMeta: { fontSize: 11, color: COLORS.textMuted },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', ...SHADOW.card },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, maxHeight: height * 0.88 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  sheetScroll: { padding: SPACING.lg, gap: SPACING.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.sm },
  typeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  typeLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  formLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  formInput: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: COLORS.text, marginBottom: SPACING.sm },
  formRow: { flexDirection: 'row', gap: 10 },
  formHalf: { flex: 1 },
  sheetFooter: { flexDirection: 'row', gap: 10, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingVertical: 13, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  createBtn: { flex: 2, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 13, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  createBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
