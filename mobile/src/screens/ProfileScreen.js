import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Animated, Dimensions, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import AppHeader from '../components/AppHeader';

const { height } = Dimensions.get('window');

const MOCK_USER = {
  name: 'Juan dela Cruz',
  role: 'Lead Cabo',
  employeeId: 'EMP-001',
  sector: 'Sector B',
  farm: 'Silay Block Farm',
  email: 'juan@hugpong.ph',
  mobile: '+63 917 123 4567',
};

const MOCK_PENDING = [
  { id: 1, type: 'Task Completion', desc: 'Fertilization – Plot 4', time: '10:32 AM' },
  { id: 2, type: 'Resource Log', desc: '12 bags Urea applied', time: '10:45 AM' },
  { id: 3, type: 'Schedule Update', desc: 'Weeding – Sector A rescheduled', time: 'Yesterday' },
];

const MOCK_AUDIT = [
  { id: 1, action: 'Login', device: 'Samsung A54', ip: '192.168.1.5', time: 'Today 8:01 AM' },
  { id: 2, action: 'Synced 3 records', device: 'Samsung A54', ip: '192.168.1.5', time: 'Today 8:05 AM' },
  { id: 3, action: 'Price viewed', device: 'Samsung A54', ip: '192.168.1.5', time: 'Today 9:12 AM' },
  { id: 4, action: 'Task marked complete', device: 'Samsung A54', ip: '192.168.1.5', time: 'Today 10:32 AM' },
  { id: 5, action: 'Login', device: 'Samsung A54', ip: '192.168.1.5', time: 'Yesterday 7:55 AM' },
];

const LANGUAGES = [
  { key: 'en', label: 'English', native: 'English' },
  { key: 'tl', label: 'Tagalog', native: 'Filipino' },
  { key: 'hil', label: 'Hiligaynon', native: 'Ilonggo' },
];

export default function ProfileScreen({ navigation }) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('Today, 8:05 AM');
  const [autoSync, setAutoSync] = useState(true);
  const [showAudit, setShowAudit] = useState(false);
  const [language, setLanguage] = useState('en');
  const [langExpanded, setLangExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const openAudit = () => {
    setShowAudit(true);
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  };
  const closeAudit = () => {
    Animated.timing(slideAnim, { toValue: height, duration: 220, useNativeDriver: true }).start(() => setShowAudit(false));
  };

  const doSync = () => {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync('Just now');
    }, 2200);
  };

  const clearCache = () => {
    Alert.alert(
      'Clear Cache?',
      'This will remove all locally cached data. Unsynced records may be lost.\n\nThis action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear Cache', style: 'destructive', onPress: () => Alert.alert('Cache Cleared', 'Local cache has been cleared.') },
      ]
    );
  };

  const signOut = () => {
    Alert.alert(
      'Sign Out?',
      '⚠️  You have 3 pending unsynced records.\n\nSigning out without syncing may cause data loss. Sync first or proceed anyway.',
      [
        { text: 'Sync First', onPress: doSync },
        { text: 'Sign Out Anyway', style: 'destructive', onPress: () => navigation.replace('Login') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader right={
        <TouchableOpacity style={s.iconBtn} onPress={openAudit}>
          <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      } />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Identity Card ── */}
        <View style={[s.card, s.identityCard]}>
          <View style={s.avatarWrap}>
            <Text style={s.avatarText}>{MOCK_USER.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</Text>
          </View>
          <View style={s.identityInfo}>
            <Text style={s.identityName}>{MOCK_USER.name}</Text>
            <View style={s.roleBadge}>
              <Text style={s.roleText}>{MOCK_USER.role}</Text>
            </View>
            <Text style={s.identityId}>ID: {MOCK_USER.employeeId}</Text>
          </View>
        </View>

        {/* ── Sector Assignment ── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Operational Assignment</Text>
          {[
            { icon: 'business', label: 'Farm', value: MOCK_USER.farm },
            { icon: 'map', label: 'Sector', value: MOCK_USER.sector },
            { icon: 'mail', label: 'Email', value: MOCK_USER.email },
            { icon: 'call', label: 'Mobile', value: MOCK_USER.mobile },
          ].map(r => (
            <View key={r.label} style={s.infoRow}>
              <Ionicons name={r.icon} size={15} color={COLORS.primaryLight} style={{ width: 22 }} />
              <Text style={s.infoLabel}>{r.label}</Text>
              <Text style={s.infoValue}>{r.value}</Text>
            </View>
          ))}
        </View>

        {/* ── Sync Dashboard ── */}
        <View style={s.card}>
          <View style={s.syncHeader}>
            <Text style={s.cardTitle}>Sync Dashboard</Text>
            <View style={[s.syncStatusDot, { backgroundColor: autoSync ? COLORS.success : COLORS.textMuted }]} />
          </View>

          {/* Stats Row */}
          <View style={s.syncStats}>
            <View style={s.syncStat}>
              <Text style={s.syncStatNum}>{MOCK_PENDING.length}</Text>
              <Text style={s.syncStatLabel}>Pending</Text>
            </View>
            <View style={s.syncStatDivider} />
            <View style={s.syncStat}>
              <Text style={s.syncStatNum}>24</Text>
              <Text style={s.syncStatLabel}>Synced</Text>
            </View>
            <View style={s.syncStatDivider} />
            <View style={s.syncStat}>
              <Text style={[s.syncStatNum, { color: COLORS.success }]}>OK</Text>
              <Text style={s.syncStatLabel}>Status</Text>
            </View>
          </View>

          <Text style={s.lastSyncText}>Last synced: {lastSync}</Text>

          {/* Pending Logs */}
          <Text style={s.pendingTitle}>Pending Local Logs</Text>
          {MOCK_PENDING.map(p => (
            <View key={p.id} style={s.pendingRow}>
              <View style={s.pendingDot} />
              <View style={s.pendingBody}>
                <Text style={s.pendingType}>{p.type}</Text>
                <Text style={s.pendingDesc}>{p.desc}</Text>
              </View>
              <Text style={s.pendingTime}>{p.time}</Text>
            </View>
          ))}

          {/* Sync Button */}
          <TouchableOpacity style={[s.syncBtn, syncing && s.syncBtnDisabled]} onPress={doSync} disabled={syncing}>
            <Ionicons name={syncing ? 'cloud-upload' : 'cloud-upload-outline'} size={18} color="#fff" />
            <Text style={s.syncBtnText}>{syncing ? 'Syncing...' : 'Sync Now'}</Text>
          </TouchableOpacity>

          {/* Auto Sync Toggle */}
          <View style={s.toggleRow}>
            <Ionicons name="refresh-circle-outline" size={16} color={COLORS.textSecondary} />
            <Text style={s.toggleLabel}>Auto Sync</Text>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={autoSync ? COLORS.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* ── Language ── */}
        <TouchableOpacity style={[s.card, s.expandRow]} onPress={() => setLangExpanded(e => !e)}>
          <Ionicons name="language-outline" size={18} color={COLORS.textSecondary} />
          <Text style={s.expandLabel}>Language / Wika</Text>
          <Text style={s.expandCurrent}>{LANGUAGES.find(l => l.key === language)?.native}</Text>
          <Ionicons name={langExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        {langExpanded && (
          <View style={s.card}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity key={lang.key} style={s.langRow} onPress={() => { setLanguage(lang.key); setLangExpanded(false); }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.langLabel}>{lang.native}</Text>
                  <Text style={s.langSub}>{lang.label}</Text>
                </View>
                {language === lang.key && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Settings & Security ── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Settings</Text>
          {[
            { icon: 'shield-outline', label: 'Security & Password', color: COLORS.primary, onPress: () => navigation.navigate('Security') },
            { icon: 'cloud-upload-outline', label: 'Sync Monitor', color: COLORS.blue, onPress: () => navigation.navigate('SyncMonitor') },
            { icon: 'trash-outline', label: 'Clear Cache', color: COLORS.accent, onPress: clearCache },
            { icon: 'document-text-outline', label: 'Device Audit Log', color: COLORS.blue, onPress: openAudit },
          ].map(item => (
            <TouchableOpacity key={item.label} style={s.settingRow} onPress={item.onPress}>
              <View style={[s.settingIcon, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon} size={17} color={item.color} />
              </View>
              <Text style={s.settingLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Sign Out ── */}
        <TouchableOpacity style={s.signOutBtn} onPress={signOut}>
          <Ionicons name="log-out-outline" size={18} color="#D9534F" />
          <Text style={s.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={s.footerNote}>v1.0.0 · HUGPONG Agricultural Platform{'\n'}Data is encrypted and stored securely.</Text>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Audit Log Bottom Sheet ── */}
      <Modal visible={showAudit} transparent animationType="none">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closeAudit} />
        <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={s.sheetHandle} />
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Device Audit Log</Text>
            <TouchableOpacity onPress={closeAudit}><Ionicons name="close" size={22} color={COLORS.text} /></TouchableOpacity>
          </View>
          <Text style={s.auditSubtitle}>Recent activity on this device</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {MOCK_AUDIT.map(a => (
              <View key={a.id} style={s.auditRow}>
                <View style={s.auditIconWrap}>
                  <Ionicons name="shield-checkmark" size={15} color={COLORS.primary} />
                </View>
                <View style={s.auditBody}>
                  <Text style={s.auditAction}>{a.action}</Text>
                  <Text style={s.auditMeta}>{a.device} · {a.ip}</Text>
                </View>
                <Text style={s.auditTime}>{a.time}</Text>
              </View>
            ))}
            <View style={{ height: 32 }} />
          </ScrollView>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  iconBtn: { padding: 8 },
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.card },

  // Identity
  identityCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
  avatarWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#fff' },
  identityInfo: { flex: 1, gap: 4 },
  identityName: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  roleBadge: { backgroundColor: COLORS.primaryBg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  roleText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  identityId: { fontSize: 11, color: COLORS.textMuted },

  // Info rows
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 9, borderTopWidth: 1, borderTopColor: COLORS.border },
  infoLabel: { fontSize: 12, color: COLORS.textMuted, width: 56 },
  infoValue: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.text, textAlign: 'right' },

  // Sync
  syncHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  syncStatusDot: { width: 10, height: 10, borderRadius: 5 },
  syncStats: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  syncStat: { flex: 1, alignItems: 'center', gap: 2 },
  syncStatNum: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  syncStatLabel: { fontSize: 10, color: COLORS.textMuted },
  syncStatDivider: { width: 1, backgroundColor: COLORS.border },
  lastSyncText: { fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.md },
  pendingTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8 },
  pendingRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  pendingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.accent, marginTop: 4, flexShrink: 0 },
  pendingBody: { flex: 1, gap: 1 },
  pendingType: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  pendingDesc: { fontSize: 12, color: COLORS.text },
  pendingTime: { fontSize: 10, color: COLORS.textMuted },
  syncBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 13, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: SPACING.md },
  syncBtnDisabled: { opacity: 0.6 },
  syncBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: SPACING.sm },
  toggleLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },

  // Language
  expandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  expandLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text },
  expandCurrent: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  langRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderTopWidth: 1, borderTopColor: COLORS.border },
  langLabel: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  langSub: { fontSize: 11, color: COLORS.textMuted },

  // Settings
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: 11, borderTopWidth: 1, borderTopColor: COLORS.border },
  settingIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { flex: 1, fontSize: 14, color: COLORS.text, fontWeight: '500' },

  // Sign Out
  signOutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#FFF0F0', borderRadius: RADIUS.md, paddingVertical: 14, borderWidth: 1, borderColor: '#FCCAC8' },
  signOutText: { fontSize: 14, fontWeight: '700', color: '#D9534F' },
  footerNote: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', lineHeight: 16 },

  // Audit Sheet
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, maxHeight: height * 0.75, paddingBottom: 24 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  auditSubtitle: { fontSize: 12, color: COLORS.textMuted, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  auditRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  auditIconWrap: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.primaryBg, justifyContent: 'center', alignItems: 'center' },
  auditBody: { flex: 1, gap: 1 },
  auditAction: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  auditMeta: { fontSize: 10, color: COLORS.textMuted },
  auditTime: { fontSize: 10, color: COLORS.textMuted, textAlign: 'right' },
});
