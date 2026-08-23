import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { subscribe, getCurrentSession, MOCK_FIELDS, getMemberSyncHealth, performMobileSync, updateSessionFieldId } from '../data/mockData';
import { useTranslation } from '../services/i18n';

export default function SyncMonitorScreen({ navigation }) {
  const { t, formatSyncTime } = useTranslation();
  const [session, setSession] = useState(getCurrentSession());
  const [syncHealth, setSyncHealth] = useState(getMemberSyncHealth());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('attention'); // 'attention', 'all', 'active', 'warning', 'critical'

  React.useEffect(() => {
    const unsubscribe = subscribe(() => {
      setSession({ ...getCurrentSession() });
      setSyncHealth(getMemberSyncHealth());
    });
    return unsubscribe;
  }, []);

  const isFarmManager = session.role === 'Farm Manager';
  const isSRA = session.role === 'SRA (Admin)';

  // Member terminal telemetry mock list for Block Farm A
  const memberTelemetry = [
    {
      id: 'FLD-KTR-001',
      name: 'Mario Dimagiba',
      contact: '0917-123-4567',
      ha: '1.5',
      stage: 'Planting',
      lastSync: '3 hours ago',
      lagDays: 0,
      offlineLogsCount: 2,
      battery: 88,
      status: 'active',
      statusLabel: 'Active & Synced',
      device: 'Samsung Galaxy A14 (Android 13)'
    },
    {
      id: 'FLD-KTR-002',
      name: 'Jose Rizal',
      contact: '0917-222-3344',
      ha: '2.1',
      stage: 'Tillering',
      lastSync: '4 days ago',
      lagDays: 4,
      offlineLogsCount: 5,
      battery: 42,
      status: 'warning',
      statusLabel: 'Lagging (4 days)',
      device: 'Xiaomi Redmi 12 (Android 12)'
    },
    {
      id: 'FLD-KTR-005',
      name: 'Roberto Tan',
      contact: '0917-555-6677',
      ha: '1.8',
      stage: 'Land Preparation',
      lastSync: '8 days ago',
      lagDays: 8,
      offlineLogsCount: 7,
      battery: 19,
      status: 'critical',
      statusLabel: 'Inactive (8 days)',
      device: 'Infinix Hot 30i (Android 11)'
    },
    {
      id: 'FLD-KTR-006',
      name: 'Antonio Luna',
      contact: '0917-888-2233',
      ha: '1.2',
      stage: 'Cane Growth',
      lastSync: 'Yesterday',
      lagDays: 1,
      offlineLogsCount: 0,
      battery: 76,
      status: 'active',
      statusLabel: 'Active & Synced',
      device: 'Realme C55 (Android 13)'
    }
  ];

  const attentionCount = memberTelemetry.filter(m => m.status === 'warning' || m.status === 'critical').length;
  const activeCount = memberTelemetry.filter(m => m.status === 'active').length;
  const warningCount = memberTelemetry.filter(m => m.status === 'warning').length;
  const criticalCount = memberTelemetry.filter(m => m.status === 'critical').length;

  let filteredMembers = memberTelemetry;
  if (filterMode === 'attention') {
    filteredMembers = memberTelemetry.filter(m => m.status === 'warning' || m.status === 'critical');
  } else if (filterMode === 'active') {
    filteredMembers = memberTelemetry.filter(m => m.status === 'active');
  } else if (filterMode === 'warning') {
    filteredMembers = memberTelemetry.filter(m => m.status === 'warning');
  } else if (filterMode === 'critical') {
    filteredMembers = memberTelemetry.filter(m => m.status === 'critical');
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredMembers = filteredMembers.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.contact.toLowerCase().includes(q) ||
      m.stage.toLowerCase().includes(q)
    );
  }

  const handleContactMember = (member) => {
    const cleanPhone = (member.contact || '').replace(/[^0-9+]/g, '');
    const smsMessage = `Hi ${member.name.split(' ')[0]}, this is ${session.name} (Farm Manager). Please open HUGPONG and tap Sync to upload your field logs for ${member.id}.`;

    Alert.alert(
      `${t('action_send_sms', 'Contact')} ${member.name}`,
      `${t('profile_mobile_contact', 'Mobile')}: ${member.contact}\n${t('field_plot', 'Field Plot')}: ${member.id} (${member.ha || 1.5} Ha)\n${t('status', 'Sync Status')}: ${formatSyncTime(member.lastSync)}\n\n`,
      [
        { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('action_send_sms', 'Send SMS Notice'),
          onPress: async () => {
            const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(smsMessage)}`;
            try {
              const supported = await Linking.canOpenURL(smsUrl);
              if (supported) {
                await Linking.openURL(smsUrl);
              } else {
                Alert.alert(
                  'SMS Notice Ready',
                  `SMS recipient: ${member.contact}\nMessage: "${smsMessage}"`
                );
              }
            } catch (err) {
              Alert.alert('Error', 'Unable to open native SMS composer.');
            }
          }
        },
        {
          text: t('btn_call_manager', 'Call Member'),
          onPress: async () => {
            const telUrl = `tel:${cleanPhone}`;
            try {
              const supported = await Linking.canOpenURL(telUrl);
              if (supported) {
                await Linking.openURL(telUrl);
              } else {
                Alert.alert('Dialer Info', `Dialing ${member.contact} on device...`);
              }
            } catch (err) {
              Alert.alert('Error', 'Unable to launch native phone dialer.');
            }
          }
        }
      ]
    );
  };

  const handleTakeOver = (member) => {
    Alert.alert(
      t('btn_take_over', 'Take Over Field Plot'),
      `Take operational supervision of ${member.id} (${member.name})? You will be navigated to Field Ops to log activities directly on behalf of this member.`,
      [
        { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('btn_take_over', 'Proceed to Take Over'),
          onPress: () => {
            updateSessionFieldId(member.id);
            navigation.navigate('Field Ops', {
              screen: 'SchedMain',
              params: { takeOverFieldId: member.id, isTakeOver: true }
            });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={s.headerTitle}>{isFarmManager ? t('telemetry_title', 'Member Sync Monitor') : (isSRA ? 'SRA Terminal' : t('action_sync_hub', 'Sync Status'))}</Text>
          <Text style={s.headerSub}>{isFarmManager ? t('profile_supervising_farm', 'Block Farm A Supervision') : (isSRA ? 'Administrative Authority' : 'Mobile Terminal Connection')}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── FARM MANAGER VIEW ── */}
        {isFarmManager ? (
          <>
            {/* Telemetry Summary Stats */}
            <View style={s.statsBar}>
              <TouchableOpacity
                style={[s.statItem, filterMode === 'attention' && s.statItemActive]}
                onPress={() => setFilterMode(filterMode === 'attention' ? 'all' : 'attention')}
              >
                <Text style={[s.statNum, { color: attentionCount > 0 ? '#E02424' : COLORS.success }]}>{attentionCount}</Text>
                <Text style={s.statLabel}>{t('telemetry_needs_attention', 'Needs Attention')}</Text>
              </TouchableOpacity>
              <View style={s.statDiv} />
              <TouchableOpacity
                style={[s.statItem, filterMode === 'warning' && s.statItemActive]}
                onPress={() => setFilterMode(filterMode === 'warning' ? 'all' : 'warning')}
              >
                <Text style={[s.statNum, { color: '#C97A00' }]}>{warningCount}</Text>
                <Text style={s.statLabel}>{t('telemetry_lag_warning', 'Lag (3+ days)')}</Text>
              </TouchableOpacity>
              <View style={s.statDiv} />
              <TouchableOpacity
                style={[s.statItem, filterMode === 'critical' && s.statItemActive]}
                onPress={() => setFilterMode(filterMode === 'critical' ? 'all' : 'critical')}
              >
                <Text style={[s.statNum, { color: '#E02424' }]}>{criticalCount}</Text>
                <Text style={s.statLabel}>{t('telemetry_critical', 'Critical (7+ days)')}</Text>
              </TouchableOpacity>
            </View>

            {/* Overdue Warning Alert Banner */}
            {attentionCount > 0 && (
              <View style={[s.alertBanner, { backgroundColor: '#FDF2F2', borderColor: '#F8B4B4' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#FDE8E8', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="alert-circle" size={20} color="#E02424" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#E02424' }}>
                      {t('sync_critical_title', 'Sync Action Required')}: {attentionCount} Member(s) Offline
                    </Text>
                    <Text style={{ fontSize: 11, color: '#9B1C1C', marginTop: 1 }}>
                      Follow up with lagging members before monthly district report compile.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginBottom: 8 }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 6 }}>
              {[
                { key: 'attention', label: `${t('telemetry_needs_attention', 'Needs Attention')} (${attentionCount})` },
                { key: 'all', label: `${t('telemetry_all_members', 'All Members')} (${memberTelemetry.length})` },
                { key: 'warning', label: `${t('telemetry_lag_warning', 'Lag Warning')} (${warningCount})` },
                { key: 'critical', label: `${t('telemetry_critical', 'Critical Offline')} (${criticalCount})` },
                { key: 'active', label: `${t('profile_synced', 'Active Synced')} (${activeCount})` },
              ].map(chip => (
                <TouchableOpacity
                  key={chip.key}
                  style={[s.filterPill, filterMode === chip.key && s.filterPillActive]}
                  onPress={() => setFilterMode(chip.key)}
                >
                  <Text style={[s.filterPillText, filterMode === chip.key && s.filterPillTextActive]}>{chip.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Search Input */}
            <View style={s.searchContainer}>
              <Ionicons name="search-outline" size={16} color={COLORS.textMuted} />
              <TextInput
                style={s.searchInput}
                placeholder={t('search_members_placeholder', 'Search members or field ID...')}
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Member Telemetry Cards */}
            <Text style={s.sectionTitle}>
              {filterMode === 'attention' ? `Members Requiring Sync Attention (${filteredMembers.length})` : `Registered Block Farm Members (${filteredMembers.length})`}
            </Text>

            {filteredMembers.length === 0 ? (
              <View style={[s.emptyBox, { paddingVertical: 24, gap: 8, alignItems: 'center' }]}>
                <Ionicons name="checkmark-circle-outline" size={40} color={COLORS.success} />
                <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.text }}>All Block Farm Members Synced</Text>
                <Text style={[s.emptyText, { textAlign: 'center' }]}>No members have sync lag or offline buffer delays at this time.</Text>
                <TouchableOpacity
                  style={{ marginTop: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryBg }}
                  onPress={() => setFilterMode('all')}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary }}>View All Members ({memberTelemetry.length})</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredMembers.map(m => {
                const isCritical = m.status === 'critical';
                const isWarn = m.status === 'warning';
                const badgeBg = isCritical ? '#FDF2F2' : (isWarn ? '#FFFBF0' : '#F0F9F0');
                const badgeBorder = isCritical ? '#F8B4B4' : (isWarn ? '#FEF0D0' : '#D1F2D1');
                const badgeColor = isCritical ? '#E02424' : (isWarn ? '#C97A00' : COLORS.success);
                const badgeLabel = isCritical ? `${m.lagDays}d Offline (Critical)` : (isWarn ? `${m.lagDays}d Lag Warning` : 'Active / Synced');

                return (
                  <View key={m.id} style={[s.memberCard, { borderColor: isCritical ? '#F8B4B4' : '#E2E8DC' }]}>
                    <View style={s.memberTopRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={s.memberAvatar}>
                          <Text style={s.memberAvatarText}>{m.name.charAt(0)}</Text>
                        </View>
                        <View>
                          <Text style={s.memberName}>{m.name}</Text>
                          <Text style={s.memberFieldId}>{m.id} <Text style={{ color: COLORS.textMuted, fontWeight: '400' }}>({m.ha} Ha)</Text></Text>
                        </View>
                      </View>
                      <View style={[s.healthBadge, { backgroundColor: badgeBg, borderColor: badgeBorder }]}>
                        <View style={[s.healthDot, { backgroundColor: badgeColor }]} />
                        <Text style={[s.healthBadgeText, { color: badgeColor }]}>{badgeLabel}</Text>
                      </View>
                    </View>

                    <View style={s.memberDetailsRow}>
                      <View>
                        <Text style={s.detailLabel}>{t('stage', 'Current Stage')}</Text>
                        <Text style={s.detailValue}>{m.stage}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={s.detailLabel}>{t('sync_info', 'Latest Sync')}</Text>
                        <Text style={[s.detailValue, { color: badgeColor }]}>{formatSyncTime(m.lastSync)}</Text>
                      </View>
                    </View>

                    <View style={s.memberActionRow}>
                      <TouchableOpacity
                        style={s.contactBtn}
                        onPress={() => handleContactMember(m)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="call-outline" size={14} color={COLORS.text} />
                        <Text style={s.contactBtnText} numberOfLines={1}>{t('action_send_sms', 'Contact Member')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={s.takeOverBtn}
                        onPress={() => handleTakeOver(m)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="navigate-outline" size={14} color={COLORS.primary} />
                        <Text style={s.takeOverBtnText} numberOfLines={1}>{t('btn_take_over', 'Take Over Plot')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </>
        ) : isSRA ? (
          /* ── SRA ADMIN VIEW ── */
          <View style={s.memberTerminalCard}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0F0FA', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Ionicons name="business" size={26} color={COLORS.primary} />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.text, textAlign: 'center' }}>
              {t('role_sra', 'SRA Administrator')}
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginTop: 4, lineHeight: 18 }}>
              {t('profile_sra_status', 'Individual member sync health & telemetry is supervised directly by local Farm Managers. SRA Administrators supervise sugar price circulars, monthly compiled audit reports, and macro analytics.')}
            </Text>

            <View style={{ width: '100%', backgroundColor: '#F8FAF6', borderRadius: RADIUS.md, padding: 12, borderWidth: 1, borderColor: '#E2E8DC', marginVertical: 16, gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, color: COLORS.textMuted }}>{t('profile_supervised_scope', 'Administrative Scope')}:</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.text }}>{t('view_all_fields', 'All District Block Farms')}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, color: COLORS.textMuted }}>{t('profile_district_cert', 'Cloud Certification Status')}:</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.success }}>{t('profile_sra_certified', 'Online / Certified')}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, color: COLORS.textMuted }}>{t('price_card_title', 'Mill Price Feed')}:</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary }}>HPCo Silay (Live)</Text>
              </View>
            </View>

            <TouchableOpacity
              style={{ width: '100%', backgroundColor: COLORS.primary, paddingVertical: 10, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons name="arrow-back" size={16} color="#FFF" />
              <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '700' }}>{t('btn_close', 'Return to Overview')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── REGULAR MEMBER VIEW ── */
          <View style={s.memberTerminalCard}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Ionicons name="shield-checkmark" size={28} color={COLORS.success} />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.text, textAlign: 'center' }}>
              {t('sync_status_synced', 'Terminal Connected to')} {session.farm || 'Block Farm A'}
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginTop: 4, lineHeight: 18 }}>
              {t('sync_toast_synced', 'Your offline operation logs and resource entries are automatically synchronized when online connectivity is detected.')}
            </Text>

            <View style={{ width: '100%', backgroundColor: '#F8FAF6', borderRadius: RADIUS.md, padding: 12, borderWidth: 1, borderColor: '#E2E8DC', marginVertical: 16, gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, color: COLORS.textMuted }}>{t('my_field', 'My Field')}:</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.text }}>FLD-KTR-001 (1.5 Ha)</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, color: COLORS.textMuted }}>{t('profile_supervising_farm', 'Supervising Manager')}:</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.text }}>Jose Reyes ({session.farm || 'Block Farm A'})</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, color: COLORS.textMuted }}>{t('sync_info', 'Latest Sync')}:</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary }}>{formatSyncTime(syncHealth.lastSync)}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 6, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 }}
                onPress={() => {
                  performMobileSync();
                  Alert.alert(t('sync_status_synced', 'Sync Successful'), t('sync_toast_complete', 'Your local logs are now fully synchronized with Block Farm A.'));
                }}
              >
                <Ionicons name="sync" size={15} color="#FFF" />
                <Text style={{ color: '#FFF', fontSize: 11.5, fontWeight: '700', textAlign: 'center', flexShrink: 1 }} numberOfLines={1}>
                  {t('profile_sync_now', 'Sync Now')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8DC', paddingVertical: 12, paddingHorizontal: 6, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 }}
                onPress={() => {
                  Alert.alert(
                    t('btn_call_manager', 'Contact Farm Manager'),
                    'Jose Reyes (0918-987-6543)\nWould you like to place a call?',
                    [
                      { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
                      { text: t('btn_call_manager', 'Call Now'), onPress: () => Alert.alert('Dialing...', 'Calling 0918-987-6543') }
                    ]
                  );
                }}
              >
                <Ionicons name="call-outline" size={15} color={COLORS.text} />
                <Text style={{ color: COLORS.text, fontSize: 11.5, fontWeight: '700', textAlign: 'center', flexShrink: 1 }} numberOfLines={1}>
                  {t('btn_call_manager', 'Call Manager')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8DC',
    backgroundColor: '#FFF',
  },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F2EC' },
  headerTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  headerSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  scroll: { padding: SPACING.lg, gap: 12 },

  // Stats Bar
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8DC',
    alignItems: 'center',
    ...SHADOW.sm,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 4, borderRadius: RADIUS.md },
  statItemActive: { backgroundColor: '#F0F4EC' },
  statNum: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, fontWeight: '600' },
  statDiv: { width: 1, height: 26, backgroundColor: '#E2E8DC' },

  // Alert Banner
  alertBanner: {
    borderRadius: RADIUS.lg,
    padding: 12,
    borderWidth: 1,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8DC',
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 12, color: COLORS.text, padding: 0 },

  sectionTitle: { fontSize: 13, fontWeight: '800', color: COLORS.text, marginTop: 4 },

  emptyBox: {
    backgroundColor: '#FFF',
    borderRadius: RADIUS.lg,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8DC',
    gap: 6,
  },
  emptyText: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },

  // Member Telemetry Card
  memberCard: {
    backgroundColor: '#FFF',
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    gap: 10,
    ...SHADOW.sm,
  },
  memberTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  memberAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  memberAvatarText: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  memberName: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  memberFieldId: { fontSize: 11, fontWeight: '700', color: COLORS.primary },

  healthBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  healthDot: { width: 6, height: 6, borderRadius: 3 },
  healthBadgeText: { fontSize: 10, fontWeight: '700' },

  memberDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F2EC',
  },
  detailLabel: { fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', fontWeight: '700' },
  detailValue: { fontSize: 12, fontWeight: '600', color: COLORS.text, marginTop: 2 },

  memberActionRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
  contactBtn: {
    flex: 1,
    backgroundColor: '#F8FAF6',
    borderWidth: 1,
    borderColor: '#E2E8DC',
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  contactBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.text },
  takeOverBtn: {
    flex: 1,
    backgroundColor: COLORS.primaryBg,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  takeOverBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },

  // Filter Pills
  filterPill: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8DC', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  filterPillActive: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  filterPillText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  filterPillTextActive: { color: COLORS.primary, fontWeight: '800' },

  // Member Terminal View
  memberTerminalCard: {
    backgroundColor: '#FFF',
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8DC',
    ...SHADOW.sm,
  },
});
