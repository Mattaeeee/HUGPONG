import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Animated, Dimensions, Alert, Switch, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import AppHeader from '../components/AppHeader';
import { subscribe, getIsSynced, getCurrentSession, setSynced, requestFieldAssignment, MOCK_FIELDS, MOCK_LOGS, DRAFT_LOGS } from '../data/mockData';

const { height } = Dimensions.get('window');


const LANGUAGES = [
  { key: 'en', label: 'English', native: 'English' },
  { key: 'tl', label: 'Tagalog', native: 'Filipino' },
  { key: 'hil', label: 'Hiligaynon', native: 'Ilonggo' },
];

export default function ProfileScreen({ navigation }) {
  const [session, setSessionState] = useState(getCurrentSession());
  const [synced, setSyncedState] = useState(getIsSynced());
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('Today, 8:05 AM');
  const [language, setLanguage] = useState('en');
  const [langExpanded, setLangExpanded] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const getCounts = (sess) => {
    const myFields = MOCK_FIELDS.filter(f => f.member === sess.name).map(f => f.id);
    const drafts = DRAFT_LOGS.filter(l => myFields.includes(l.fieldId));
    const unapproved = MOCK_LOGS.filter(l => myFields.includes(l.fieldId) && !l.approved);
    
    const pCount = drafts.length + unapproved.length;
    const sCount = MOCK_LOGS.filter(l => myFields.includes(l.fieldId) && l.approved).length;
    
    const pendingItems = [
      ...drafts.map(d => ({ id: d.id, type: 'Draft Log', desc: d.activity, time: 'Unsubmitted' })),
      ...unapproved.map(m => ({ id: m.id, type: 'Awaiting Approval', desc: m.activity, time: m.date }))
    ];

    return { pCount, sCount, pendingItems };
  };

  const initialCounts = getCounts(getCurrentSession());
  const [pendingCount, setPendingCount] = useState(initialCounts.pCount);
  const [syncedCount, setSyncedCount] = useState(initialCounts.sCount);
  const [pendingItems, setPendingItems] = useState(initialCounts.pendingItems);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      const sess = getCurrentSession();
      setSessionState({ ...sess });
      setSyncedState(getIsSynced());
      const { pCount, sCount, pendingItems: pItems } = getCounts(sess);
      setPendingCount(pCount);
      setSyncedCount(sCount);
      setPendingItems(pItems);
    });
    return unsubscribe;
  }, []);


  const doSync = () => {
    if (syncing) return;
    if (synced && pendingCount === 0) {
      Alert.alert(
        'Synced ✓',
        'Your sugarcane records are fully synchronized with the HUGPONG cloud.'
      );
      return;
    }
    setSyncing(true);
    setTimeout(() => {
      setSynced(true);
      setSyncing(false);
      setLastSync('Just now');
      Alert.alert(
        'Sync Complete ✓',
        'All local sugarcane operation logs have been successfully uploaded and compiled.'
      );
    }, 1500);
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
    if (session.pendingLogs > 0) {
      Alert.alert(
        'Sign Out?',
        `You have ${session.pendingLogs} pending unsynced records.\n\nSigning out without syncing may cause data loss. Please sync first or proceed anyway.`,
        [
          { text: 'Sync First', onPress: doSync },
          { text: 'Sign Out Anyway', style: 'destructive', onPress: () => navigation.replace('Login') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: () => navigation.replace('Login') },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Identity Card ── */}
        <View style={[s.card, s.identityCard]}>
          <View style={s.avatarWrap}>
            <Text style={s.avatarText}>
              {session.name ? session.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
            </Text>
          </View>
          <View style={s.identityInfo}>
            <Text style={s.identityName}>{session.name}</Text>
            <View style={s.roleBadge}>
              <Text style={s.roleText}>{session.role}</Text>
            </View>
            <Text style={s.identityId}>ID: {session.employeeId}</Text>
          </View>
        </View>

        {/* ── Field Assignment ── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Operational Assignment</Text>
          {[
            { icon: 'business', label: 'Farm', value: session.farm },
            { 
              icon: 'map', 
              label: 'Assigned Fields', 
              value: MOCK_FIELDS.filter(f => f.member === session.name).length > 0 
                ? MOCK_FIELDS.filter(f => f.member === session.name).map(f => f.id).join(', ') 
                : (session.fieldId || 'None assigned')
            },
            { icon: 'call', label: 'Mobile', value: session.mobile },
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
            <View style={[s.syncStatusDot, { backgroundColor: synced ? COLORS.success : '#C97A00' }]} />
          </View>

          {/* Stats Row */}
          <View style={s.syncStats}>
            <View style={s.syncStat}>
              <Text style={s.syncStatNum}>{pendingCount}</Text>
              <Text style={s.syncStatLabel}>Pending</Text>
            </View>
            <View style={s.syncStatDivider} />
            <View style={s.syncStat}>
              <Text style={s.syncStatNum}>{syncedCount}</Text>
              <Text style={s.syncStatLabel}>Synced</Text>
            </View>
            <View style={s.syncStatDivider} />
            <View style={s.syncStat}>
              <Text style={[s.syncStatNum, { color: synced ? COLORS.success : '#C97A00' }]}>
                {synced ? 'OK' : 'SYNC'}
              </Text>
              <Text style={s.syncStatLabel}>Status</Text>
            </View>
          </View>

          <Text style={s.lastSyncText}>Last synced: {lastSync}</Text>

          {/* Pending Logs */}
          <Text style={s.pendingTitle}>Pending Local Logs</Text>
          {pendingItems.length > 0 ? (
            pendingItems.map((p, i) => (
              <View key={p.id || i} style={s.pendingRow}>
                <View style={[s.pendingDot, { backgroundColor: '#C97A00' }]} />
                <View style={s.pendingBody}>
                  <Text style={s.pendingType}>{p.type}</Text>
                  <Text style={s.pendingDesc}>{p.desc}</Text>
                </View>
                <Text style={s.pendingTime}>{p.time}</Text>
              </View>
            ))
          ) : (
            <View style={s.emptySyncState}>
              <Ionicons name="cloud-done-outline" size={16} color="#267326" />
              <Text style={s.emptySyncText}>No pending logs to sync</Text>
            </View>
          )}

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

          {/* Offline Demo Toggle */}
          <View style={[s.toggleRow, { marginTop: 0, paddingTop: 12, borderTopWidth: 0 }]}>
            <Ionicons name="airplane-outline" size={16} color={COLORS.textSecondary} />
            <Text style={s.toggleLabel}>Demo: Offline POV</Text>
            <Switch
              value={!synced}
              onValueChange={(val) => {
                setSynced(!val);
                if (val) {
                  Alert.alert('Offline Mode Sim', 'Connection dropped. New operations will be cached locally until connection restores.');
                }
              }}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={!synced ? '#fff' : '#f4f3f4'}
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
            { icon: 'shield-outline', label: 'Security & Password', color: COLORS.primary, onPress: () => Alert.alert('Security', 'Security settings are locked in demo mode.') },
            { icon: 'cloud-upload-outline', label: 'Detailed Sync Monitor', color: COLORS.blue, onPress: () => navigation.navigate('SyncMonitor') },
            { icon: 'trash-outline', label: 'Clear Cache', color: COLORS.accent, onPress: clearCache },
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
  formInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm, paddingHorizontal: 12, fontSize: 14, color: COLORS.text, backgroundColor: '#FAFAFA' },

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
  emptySyncState: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, backgroundColor: '#F2FBF2', borderRadius: RADIUS.md, borderWidth: 1, borderColor: '#E8F5E8', marginTop: 4, marginBottom: SPACING.md },
  emptySyncText: { fontSize: 13, fontWeight: '600', color: '#267326' },
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

});
