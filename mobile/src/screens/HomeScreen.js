import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, Modal, Dimensions, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';
import { MOCK_PRICE, MOCK_MOL, MOCK_WEEKLY_CHART, subscribe, getIsSynced, getCurrentSession, MOCK_FIELDS, getMemberSyncHealth, performMobileSync } from '../data/mockData';
import { useTranslation } from '../services/i18n';
import AppHeader from '../components/AppHeader';

const { width } = Dimensions.get('window');
const BAR_COLORS = ['#B8D4A0', '#8FBF6A', '#6BA045', '#4A7C2F', '#2D5016'];
const MAX_PRICE = 3000;
const MIN_PRICE = 1000;

const NOTIFICATIONS = [
  { id: 1, type: 'price', icon: 'trending-up', color: COLORS.success, title: 'Price Update', msg: 'HPCo price increased by Php 50/Lkg', time: '4:15 PM', unread: true },
  { id: 2, type: 'alert', icon: 'warning', color: COLORS.accent, title: 'Sync Reminder', msg: '5 offline records are pending sync', time: '2:30 PM', unread: true },
  { id: 3, type: 'info', icon: 'information-circle', color: COLORS.blue, title: 'Market Summary', msg: 'Monthly average is Php 2,750/Lkg — 2% upward trend', time: 'Yesterday', unread: false },
];

export default function HomeScreen({ navigation }) {
  const { t, formatSyncTime } = useTranslation();
  const price = MOCK_PRICE;
  const mol = MOCK_MOL;
  const chart = MOCK_WEEKLY_CHART;
  const [chartMode, setChartMode] = useState('weekly');
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [synced, setSyncedState] = useState(getIsSynced());
  const [session, setSessionState] = useState(getCurrentSession());
  const [syncHealth, setSyncHealth] = useState(getMemberSyncHealth());
  
  // Dynamic SRA Price States
  const [livePrice, setLivePrice] = useState(MOCK_PRICE.value);
  const [liveMol, setLiveMol] = useState(MOCK_MOL.value);
  const [liveDate, setLiveDate] = useState(MOCK_PRICE.lastUpdated || 'May 24, 2026');
  const [liveChange, setLiveChange] = useState(MOCK_PRICE.change || 0);
  const [liveMolChange, setLiveMolChange] = useState(MOCK_MOL.change || 0);
  const [liveWeek, setLiveWeek] = useState(MOCK_PRICE.week || 'Week 2 Jun');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [inputWeek, setInputWeek] = useState('Week 3 Jun');
  const [inputSource, setInputSource] = useState('SRA Order #108');
  const [inputBag, setInputBag] = useState('');
  const [inputMol, setInputMol] = useState('');

  const unreadCount = notifs.filter(n => n.unread).length;
  const slideAnim = useRef(new Animated.Value(-400)).current;

  React.useEffect(() => {
    const unsubscribe = subscribe(() => {
      setSyncedState(getIsSynced());
      setSessionState({ ...getCurrentSession() });
      setSyncHealth(getMemberSyncHealth());
      setLivePrice(MOCK_PRICE.value);
      setLiveMol(MOCK_MOL.value);
      setLiveDate(MOCK_PRICE.lastUpdated || 'Just now');
      setLiveChange(MOCK_PRICE.change || 0);
      setLiveMolChange(MOCK_MOL.change || 0);
      setLiveWeek(MOCK_PRICE.week || 'Current Circular');
    });
    setLivePrice(MOCK_PRICE.value);
    setLiveMol(MOCK_MOL.value);
    setLiveDate(MOCK_PRICE.lastUpdated || 'Just now');
    setLiveChange(MOCK_PRICE.change || 0);
    setLiveMolChange(MOCK_MOL.change || 0);
    setLiveWeek(MOCK_PRICE.week || 'Current Circular');
    return unsubscribe;
  }, []);

  const openNotifs = () => {
    setShowNotifs(true);
    Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }).start();
  };
  const closeNotifs = () => {
    Animated.timing(slideAnim, { toValue: -400, duration: 220, useNativeDriver: true }).start(() => setShowNotifs(false));
  };
  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, unread: false })));

  const handleManualSync = () => {
    performMobileSync();
    Alert.alert('Sync Complete', 'All offline records and field logs have been synchronized with Block Farm A.');
  };

  const handleCallManager = () => {
    Alert.alert(
      `Contact ${syncHealth.manager.name}`,
      `Role: ${syncHealth.manager.role} (${syncHealth.manager.blockFarm})\nMobile: ${syncHealth.manager.phone}\n\nWould you like to place a call?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => Alert.alert('Calling...', `Dialing ${syncHealth.manager.phone}`) }
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader right={
        <>
          <TouchableOpacity style={s.notifBtn} onPress={openNotifs}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
            {unreadCount > 0 && <View style={s.badge}><Text style={s.badgeText}>{unreadCount}</Text></View>}
          </TouchableOpacity>
        </>
      } />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Sync Health & Overdue Monitoring Banner ── */}
        {session.role === 'SRA (Admin)' ? (
          <View style={[s.card, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD', borderWidth: 1, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, flexShrink: 0 }} />
              <Text style={{ fontSize: 11.5, fontWeight: '600', color: COLORS.text, flexShrink: 1 }} numberOfLines={1}>
                SRA Cloud · <Text style={{ fontWeight: '400', color: COLORS.textMuted }}>District VII (Online)</Text>
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full, borderWidth: 1, borderColor: '#BAE6FD', flexShrink: 0 }}>
              <Ionicons name="shield-checkmark" size={12} color={COLORS.success} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.success }}>{t('profile_sra_certified', 'District VII Certified')}</Text>
            </View>
          </View>
        ) : syncHealth.status === 'critical' ? (
          <View style={[s.card, { backgroundColor: '#FDF2F2', borderColor: '#F8B4B4', borderWidth: 1, padding: 14, gap: 10 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#FDE8E8', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="alert-circle" size={22} color="#E02424" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#E02424' }}>
                  {t('sync_critical_title', 'Critical Sync Overdue')} ({syncHealth.days} {t('time_months', 'days')})
                </Text>
                <Text style={{ fontSize: 11, color: '#9B1C1C', marginTop: 2, lineHeight: 15 }}>
                  Your Farm Manager ({syncHealth.manager.name}) has an active follow-up notice. Please sync now to prevent audit delays.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#E02424', paddingVertical: 8, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
                onPress={handleManualSync}
              >
                <Ionicons name="sync" size={14} color="#FFF" />
                <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>{t('btn_sync_now', 'Sync Records Now')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#FFF', borderColor: '#F8B4B4', borderWidth: 1, paddingVertical: 8, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
                onPress={handleCallManager}
              >
                <Ionicons name="call" size={14} color="#E02424" />
                <Text style={{ color: '#E02424', fontSize: 11, fontWeight: '700' }}>{t('btn_call_manager', 'Call Manager')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : syncHealth.status === 'warning' ? (
          <View style={[s.card, { backgroundColor: '#FFFBF0', borderColor: '#FEF0D0', borderWidth: 1, padding: 14, gap: 10 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#FEF0D0', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="warning" size={20} color="#C97A00" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#C97A00' }}>
                  {t('sync_warning_title', 'Sync Warning')} ({syncHealth.days} {t('time_months', 'days')})
                </Text>
                <Text style={{ fontSize: 11, color: '#A06000', marginTop: 2, lineHeight: 15 }}>
                  You have offline logs waiting to be synchronized with Block Farm A. Tap below to upload your field progress.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#C97A00', paddingVertical: 8, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
                onPress={handleManualSync}
              >
                <Ionicons name="cloud-upload" size={14} color="#FFF" />
                <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>{t('btn_sync_now', 'Sync Records Now')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#FFF', borderColor: '#FEF0D0', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' }}
                onPress={handleCallManager}
              >
                <Ionicons name="call-outline" size={14} color="#C97A00" />
              </TouchableOpacity>
            </View>
          </View>
        ) : session.role === 'Farm Manager' ? (
          <TouchableOpacity 
            style={[s.card, {
              backgroundColor: '#FFFFFF',
              borderColor: COLORS.border,
              borderWidth: 1,
              padding: SPACING.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              ...SHADOW.card,
            }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SyncMonitor')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
              <View style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: COLORS.primaryBg,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: COLORS.primaryBorder,
                flexShrink: 0,
              }}>
                <Ionicons name="pulse" size={19} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.text }} numberOfLines={1}>
                  {t('profile_sync_monitor', 'Member Sync Telemetry')}
                </Text>
                <Text style={{ fontSize: 11, color: COLORS.textSecondary, marginTop: 2 }} numberOfLines={1}>
                  {syncHealth.needsAttention > 0 ? (
                    <Text style={{ color: '#C97A00', fontWeight: '700' }}>{syncHealth.needsAttention} {t('telemetry_lag_warning', 'Lagging')}</Text>
                  ) : (
                    <Text style={{ color: COLORS.success, fontWeight: '600' }}>{t('sync_status_synced', 'All Synced')}</Text>
                  )} · {session.farm || 'Block Farm A'}
                </Text>
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: COLORS.primaryBg,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: RADIUS.md,
              borderWidth: 1,
              borderColor: COLORS.primaryBorder,
              flexShrink: 0,
            }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }}>{t('telemetry_open_hub', 'Open Hub')}</Text>
              <Ionicons name="chevron-forward" size={12} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[s.card, { backgroundColor: '#F8FAF6', borderColor: '#E2E8DC', borderWidth: 1, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success, flexShrink: 0 }} />
              <Text style={{ fontSize: 11.5, fontWeight: '600', color: COLORS.text, flexShrink: 1 }} numberOfLines={1}>
                {t('synced', 'Synced')} · {session.farm || 'Block Farm A'} · <Text style={{ fontWeight: '400', color: COLORS.textMuted }}>{formatSyncTime(syncHealth.lastSync)}</Text>
              </Text>
            </View>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1, borderColor: '#E2E8DC', flexShrink: 0 }}
              onPress={handleManualSync}
            >
              <Ionicons name="sync-outline" size={12} color={COLORS.primary} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }}>{t('profile_sync_now', 'Sync')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── HPCo Silay Price Card ── */}
        <TouchableOpacity 
          style={[s.card, s.priceCard]} 
          activeOpacity={session.role === 'SRA (Admin)' ? 0.7 : 1}
          onPress={() => {
            if (session.role === 'SRA (Admin)') {
              setInputBag(livePrice.toString());
              setInputMol(liveMol.toString());
              setInputWeek(liveWeek ? liveWeek.replace(/(\d+)/, (m) => (parseInt(m) + 1).toString()) : 'Week 3 Jun');
              setInputSource('SRA Order #108');
              setShowPriceModal(true);
            }
          }}
        >
          <View style={s.priceCardHeader}>
            <View style={s.priceSourceRow}>
              <View style={[s.sourceDot, !synced && { backgroundColor: COLORS.accent }]} />
              <Text style={s.priceSource}>HPCo · Silay ({liveWeek})</Text>
            </View>
            <Text style={[s.priceUpdated, !synced && { color: COLORS.accent, fontWeight: '600' }]}>
              {synced ? liveDate : t('price_offline_warning', 'Offline: Price may be outdated')}
            </Text>
          </View>

          <View style={s.pricePairRow}>
            {/* B — Sugarcane/LKg */}
            <View style={s.pricePairItem}>
              <Text style={s.pricePairTag}>B</Text>
              <Text style={s.pricePairValue}>
                {livePrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </Text>
              <View style={s.priceChangeRow}>
                <Ionicons name={liveChange >= 0 ? "caret-up" : "caret-down"} size={11} color={liveChange >= 0 ? COLORS.success : COLORS.accent} />
                <Text style={[s.priceChangeTxt, liveChange < 0 && { color: COLORS.accent }]}>
                  {liveChange >= 0 ? '+' : ''}{Number(liveChange || 0).toFixed(2)}
                </Text>
              </View>
              <Text style={s.pricePairUnit}>{t('per_lkg', 'per Lkg')}</Text>
            </View>

            <View style={s.pricePairDivider} />

            {/* Mol — Molasses/MT */}
            <View style={s.pricePairItem}>
              <Text style={s.pricePairTag}>Mol</Text>
              <Text style={s.pricePairValue}>
                {liveMol.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </Text>
              <View style={s.priceChangeRow}>
                <Ionicons name={liveMolChange >= 0 ? "caret-up" : "caret-down"} size={11} color={liveMolChange >= 0 ? COLORS.success : COLORS.accent} />
                <Text style={[s.priceChangeTxt, liveMolChange < 0 && { color: COLORS.accent }]}>
                  {liveMolChange >= 0 ? '+' : ''}{Number(liveMolChange || 0).toFixed(2)}
                </Text>
              </View>
              <Text style={s.pricePairUnit}>{t('per_mt', 'per MT')}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Price Analytics ── */}
        <View style={s.card}>
          <View style={s.chartHeader}>
            <Text style={s.sectionTitle}>{t('analytics_price_monitor', 'SRA Weekly Price Monitor')}</Text>
            <View style={s.chartModeRow}>
              {['weekly', 'monthly'].map(m => (
                <TouchableOpacity key={m} style={[s.modeChip, chartMode === m && s.modeChipActive]} onPress={() => setChartMode(m)}>
                  <Text style={[s.modeChipText, chartMode === m && s.modeChipTextActive]}>{m === 'weekly' ? t('time_week', 'Week') : t('time_month', 'Month')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={s.syncStamp}>{synced ? `Official Broadcast: ${liveWeek} · ${liveDate}` : t('sync_cached_stamp', 'Last synced: Cached')}</Text>

          {/* Bar Chart */}
          <View style={s.chartWrap}>
            <View style={s.chartYAxis}>
              {['3,000', '2,500', '2,000', '1,500'].map(v => <Text key={v} style={s.yLabel}>{v}</Text>)}
            </View>
            <View style={s.chartPlotArea}>
              <View style={s.chartBarsRow}>
                {chart.months.map((month, mi) => (
                  <View key={mi} style={s.barGroup}>
                    {chartMode === 'weekly' ? (
                      chart.weeks.map((wk, wi) => {
                        const h = Math.max(4, ((wk[mi] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 110);
                        return <View key={wi} style={[s.bar, { height: h, backgroundColor: BAR_COLORS[wi] }]} />;
                      })
                    ) : (
                      (() => {
                        const avg = chart.weeks.reduce((sum, wk) => sum + wk[mi], 0) / chart.weeks.length;
                        const h = Math.max(4, ((avg - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 110);
                        return <View style={[s.bar, { width: 16, height: h, backgroundColor: COLORS.primary }]} />;
                      })()
                    )}
                  </View>
                ))}
              </View>
              <View style={s.chartXAxisRow}>
                {chart.months.map((month, mi) => (
                  <View key={mi} style={s.chartXAxisCol}>
                    <Text style={s.xLabel}>{month}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Legend */}
          {chartMode === 'weekly' ? (
            <View style={s.legendRow}>
              {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((l, i) => (
                <View key={i} style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: BAR_COLORS[i] }]} />
                  <Text style={s.legendText}>{l}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={s.legendRow}>
              <View style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: COLORS.primary }]} />
                <Text style={s.legendText}>{t('stat_monthly_avg', 'Monthly Average')}</Text>
              </View>
            </View>
          )}

          {/* Stats Row */}
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={s.statLabel}>{t('stat_monthly_avg', 'Monthly Avg')}</Text>
              <Text style={s.statValue}>Php 2,750</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statBox}>
              <Text style={s.statLabel}>{t('stat_year_peak', 'Crop Year Peak')}</Text>
              <Text style={s.statValue}>Php 2,900</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statBox}>
              <Text style={s.statLabel}>{t('stat_trend', 'Trend')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Ionicons name="trending-up" size={14} color={COLORS.success} />
                <Text style={[s.statValue, { color: COLORS.success }]}>+2%</Text>
              </View>
            </View>
          </View>

          {/* View Full Analytics */}
          <TouchableOpacity style={s.analyticsBtn} onPress={() => navigation.navigate('Analytics')}>
            <Text style={s.analyticsBtnText}>{t('action_analytics', 'View Full Analytics')}</Text>
            <Ionicons name="chevron-forward" size={15} color={COLORS.primaryLight} />
          </TouchableOpacity>
        </View>

        {/* ── Active Fields Quick View ── */}
        {session.role !== 'SRA (Admin)' && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>{session.role === 'Farm Manager' ? t('view_all_fields', 'Active Managing Fields') : t('my_fields', 'My Active Fields')}</Text>
            {(() => {
              const displayFields = session.role === 'Farm Manager' 
                ? MOCK_FIELDS.filter(f => f.blockFarm && f.blockFarm.startsWith(session.farm))
                : MOCK_FIELDS.filter(f => f.member === session.name);
              
              return displayFields.length > 0 ? (
                displayFields.map(field => (
                  <View key={field.id} style={s.fieldRow}>
                    <View style={[s.fieldStatusDot, { backgroundColor: field.month > 8 ? COLORS.accent : COLORS.success }]} />
                    <View style={s.fieldBody}>
                      <Text style={s.fieldId}>{field.id} · {field.ha} Ha</Text>
                      <Text style={s.fieldStage}>{field.stage}</Text>
                    </View>
                    <Text style={s.fieldAge}>{field.month} {t('time_months', 'months')}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ fontSize: 13, color: COLORS.textMuted, marginVertical: 10 }}>{t('empty_fields', 'No active fields assigned yet.')}</Text>
              );
            })()}
            <TouchableOpacity style={s.analyticsBtn} onPress={() => navigation.navigate('Field Ops')}>
              <Text style={s.analyticsBtnText}>{t('action_log_ops', 'Manage Field Operations')}</Text>
              <Ionicons name="chevron-forward" size={15} color={COLORS.primaryLight} />
            </TouchableOpacity>
          </View>
        )}

        {/* ── Active Block Farms Quick View (SRA) ── */}
        {session.role === 'SRA (Admin)' && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>Active Block Farms</Text>
            {(() => {
              const blockFarms = {};
              MOCK_FIELDS.forEach(f => {
                const farm = f.blockFarm || 'Silay Block Farm';
                if (!blockFarms[farm]) blockFarms[farm] = { name: farm, totalHa: 0, fieldsCount: 0 };
                blockFarms[farm].totalHa += parseFloat(f.ha || 0);
                blockFarms[farm].fieldsCount += 1;
              });
              const activeFarms = Object.values(blockFarms);

              return activeFarms.map((farm, i) => (
                <View key={i} style={s.fieldRow}>
                  <View style={[s.fieldStatusDot, { backgroundColor: COLORS.primary }]} />
                  <View style={s.fieldBody}>
                    <Text style={s.fieldId}>{farm.name}</Text>
                    <Text style={s.fieldStage}>{farm.fieldsCount} {t('my_fields', 'Active Fields')}</Text>
                  </View>
                  <Text style={[s.fieldAge, { color: COLORS.primary, fontWeight: '700' }]}>{farm.totalHa.toFixed(1)} Ha</Text>
                </View>
              ));
            })()}
            <TouchableOpacity style={s.analyticsBtn} onPress={() => navigation.navigate('Field Ops')}>
              <Text style={s.analyticsBtnText}>{t('view_all_fields', 'View District Operations')}</Text>
              <Ionicons name="chevron-forward" size={15} color={COLORS.primaryLight} />
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* ── Notifications Modal ── */}
      <Modal visible={showNotifs} transparent animationType="none">
        <TouchableOpacity style={s.notifOverlay} activeOpacity={1} onPress={closeNotifs} />
        <Animated.View style={[s.notifPanel, { transform: [{ translateY: slideAnim }] }]}>
          <View style={s.notifHeader}>
            <Text style={s.notifTitle}>{t('notif_title', 'Notifications')}</Text>
            <View style={s.notifHeaderRight}>
              <TouchableOpacity onPress={markAllRead}><Text style={s.markRead}>{t('notif_mark_all', 'Mark all read')}</Text></TouchableOpacity>
              <TouchableOpacity onPress={closeNotifs} style={{ padding: 4 }}>
                <Ionicons name="close" size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>
          {notifs.map(n => (
            <View key={n.id} style={[s.notifItem, n.unread && s.notifUnread]}>
              <View style={[s.notifIcon, { backgroundColor: n.color + '20' }]}>
                <Ionicons name={n.icon} size={18} color={n.color} />
              </View>
              <View style={s.notifBody}>
                <Text style={s.notifItemTitle}>{n.title}</Text>
                <Text style={s.notifMsg}>{n.msg}</Text>
                <Text style={s.notifTime}>{n.time}</Text>
              </View>
              {n.unread && <View style={s.unreadDot} />}
            </View>
          ))}
        </Animated.View>
      </Modal>

      {/* ── Post Price Modal (SRA Admin) ── */}
      <Modal visible={showPriceModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#fff', width: '100%', maxWidth: 440, borderRadius: RADIUS.xl, padding: 20, ...SHADOW.card }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 12 }}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={{ alignSelf: 'flex-start', backgroundColor: COLORS.primaryBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, marginBottom: 4 }}>
                  <Text style={{ fontSize: 9.5, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5 }}>SRA REGULATORY BROADCAST</Text>
                </View>
                <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.text }}>{t('post_official_price', 'Post Official SRA Benchmark')}</Text>
                <Text style={{ fontSize: 11.5, color: COLORS.textMuted, marginTop: 2 }}>Publish official circular to synchronize all district block farms</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPriceModal(false)} style={{ padding: 4 }}>
                <Ionicons name="close" size={22} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 460 }} showsVerticalScrollIndicator={false}>
              <View style={{ gap: 12 }}>
                {/* 1. Week Label & Circular Source */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11.5, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 5 }}>Week Label *</Text>
                    <TextInput
                      style={{ backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, fontWeight: '600', color: COLORS.text }}
                      placeholder="e.g. Week 3 Jun"
                      placeholderTextColor={COLORS.textMuted}
                      value={inputWeek}
                      onChangeText={setInputWeek}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11.5, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 5 }}>Reference Order *</Text>
                    <TextInput
                      style={{ backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, fontWeight: '600', color: COLORS.text }}
                      placeholder="e.g. SRA Order #108"
                      placeholderTextColor={COLORS.textMuted}
                      value={inputSource}
                      onChangeText={setInputSource}
                    />
                  </View>
                </View>

                {/* 2. Raw Sugar Price */}
                <View style={{ backgroundColor: '#F8FAF6', borderWidth: 1, borderColor: '#E2E8DC', borderRadius: 12, padding: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.text }}>Raw Sugar Price (50kg Bag)</Text>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.primary }}>₱ / Lkg</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.textMuted, marginRight: 6 }}>₱</Text>
                    <TextInput
                      style={{ flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text }}
                      keyboardType="decimal-pad"
                      placeholder="2950"
                      placeholderTextColor={COLORS.textMuted}
                      value={inputBag}
                      onChangeText={setInputBag}
                    />
                  </View>
                  {/* Live Sugar Movement Badge */}
                  {(() => {
                    const diff = (parseFloat(inputBag) || 0) - (livePrice || 2950);
                    if (isNaN(diff) || !inputBag) return null;
                    const isUp = diff > 0;
                    const isDown = diff < 0;
                    return (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                        <View style={{ backgroundColor: isUp ? '#E8F7EE' : (isDown ? '#FDE8E8' : '#F1F5F9'), paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                          <Text style={{ fontSize: 10.5, fontWeight: '800', color: isUp ? '#15803D' : (isDown ? '#B91C1C' : COLORS.textMuted) }}>
                            {isUp ? '▲ +' : (isDown ? '▼ -' : '')}₱{Math.abs(diff).toFixed(2)} / Lkg
                          </Text>
                        </View>
                        <Text style={{ fontSize: 10.5, color: COLORS.textMuted }}>vs current benchmark (₱{livePrice.toLocaleString()})</Text>
                      </View>
                    );
                  })()}
                </View>

                {/* 3. Molasses Price */}
                <View style={{ backgroundColor: '#F8FAF6', borderWidth: 1, borderColor: '#E2E8DC', borderRadius: 12, padding: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.text }}>Molasses Price (Industrial MT)</Text>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#15803D' }}>₱ / MT</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.textMuted, marginRight: 6 }}>₱</Text>
                    <TextInput
                      style={{ flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text }}
                      keyboardType="decimal-pad"
                      placeholder="4400"
                      placeholderTextColor={COLORS.textMuted}
                      value={inputMol}
                      onChangeText={setInputMol}
                    />
                  </View>
                  {/* Live Molasses Movement Badge */}
                  {(() => {
                    const diff = (parseFloat(inputMol) || 0) - (liveMol || 4400);
                    if (isNaN(diff) || !inputMol) return null;
                    const isUp = diff > 0;
                    const isDown = diff < 0;
                    return (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                        <View style={{ backgroundColor: isUp ? '#E8F7EE' : (isDown ? '#FDE8E8' : '#F1F5F9'), paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                          <Text style={{ fontSize: 10.5, fontWeight: '800', color: isUp ? '#15803D' : (isDown ? '#B91C1C' : COLORS.textMuted) }}>
                            {isUp ? '▲ +' : (isDown ? '▼ -' : '')}₱{Math.abs(diff).toFixed(2)} / MT
                          </Text>
                        </View>
                        <Text style={{ fontSize: 10.5, color: COLORS.textMuted }}>vs current benchmark (₱{liveMol.toLocaleString()})</Text>
                      </View>
                    );
                  })()}
                </View>
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={{ backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 18, flexDirection: 'row', justifyContent: 'center', gap: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 }}
                onPress={async () => {
                  const b = parseFloat(inputBag);
                  const m = parseFloat(inputMol);
                  if (isNaN(b) || isNaN(m)) {
                    Alert.alert('Invalid Price', 'Please enter valid numerical prices for Sugar and Molasses.');
                    return;
                  }
                  const oldSugar = livePrice || 2950;
                  const oldMol = liveMol || 4400;
                  const sugarDiff = b - oldSugar;
                  const molDiff = m - oldMol;
                  const weekStr = inputWeek.trim() || 'Week 3 Jun';
                  const sourceStr = inputSource.trim() || 'SRA Order #108';
                  const now = new Date();
                  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

                  MOCK_PRICE.value = b;
                  MOCK_PRICE.change = sugarDiff;
                  MOCK_PRICE.week = weekStr;
                  MOCK_PRICE.lastUpdated = dateStr;

                  MOCK_MOL.value = m;
                  MOCK_MOL.change = molDiff;
                  MOCK_MOL.week = weekStr;
                  MOCK_MOL.lastUpdated = dateStr;

                  setLivePrice(b);
                  setLiveMol(m);
                  setLiveChange(sugarDiff);
                  setLiveMolChange(molDiff);
                  setLiveWeek(weekStr);
                  setLiveDate(dateStr);
                  setShowPriceModal(false);

                  // Commit live to Firestore
                  try {
                    const { db } = require('../firebase/config');
                    const { doc, setDoc } = require('firebase/firestore');
                    if (db) {
                      const pId = `PRC-${Date.now()}`;
                      await setDoc(doc(db, 'sra_prices', pId), {
                        id: pId,
                        week: weekStr,
                        price: b,
                        molasses: m,
                        date: dateStr,
                        isoDate: now.toISOString().split('T')[0],
                        timestamp: Date.now(),
                        change: sugarDiff,
                        molassesChange: molDiff,
                        source: sourceStr,
                        createdAt: now.toISOString()
                      }, { merge: true });
                    }
                  } catch (e) {
                    console.warn('[Mobile] Error syncing price to Firestore:', e);
                  }

                  Alert.alert('Official Price Broadcasted ✓', `Successfully published ${weekStr} Circular!\n\nRaw Sugar: ₱${b.toLocaleString()} / Lkg\nMolasses: ₱${m.toLocaleString()} / MT`);
                }}
              >
                <Ionicons name="cloud-upload" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Broadcast Official Benchmark</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  notifBtn: { padding: 8, position: 'relative' },
  badge: { position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center' },
  badgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  iconBtn: { padding: 8 },
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 32 },

  trendText: { fontSize: 12, fontWeight: '700', color: COLORS.success },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.card },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.successLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  priceUpdated: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },

  // HPCo Silay unified card
  priceCard: { borderWidth: 1, borderColor: COLORS.border },
  priceCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  priceSourceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sourceDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  priceSource: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  pricePairRow: { flexDirection: 'row', alignItems: 'flex-start' },
  pricePairItem: { flex: 1, gap: 2 },
  pricePairTag: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  pricePairValue: { fontSize: 26, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  priceChangeRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  priceChangeTxt: { fontSize: 12, fontWeight: '700', color: COLORS.success },
  pricePairUnit: { fontSize: 11, color: COLORS.textMuted },
  pricePairDivider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: SPACING.md, alignSelf: 'stretch' },


  // Profit card (kept for Calculator screen reference)
  profitCard: { borderWidth: 1.5, borderColor: COLORS.border },
  profitInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profitLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 4, fontWeight: '500' },
  profitValue: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  profitSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  profitArrow: { flexDirection: 'row', alignItems: 'center', gap: 2 },


  // Chart
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  chartModeRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: 10, padding: 3, gap: 2 },
  modeChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  modeChipActive: { backgroundColor: '#fff', ...SHADOW.card },
  modeChipText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  modeChipTextActive: { color: COLORS.primary, fontWeight: '700' },
  chartWrap: { flexDirection: 'row', height: 140, marginBottom: SPACING.sm },
  chartYAxis: { justifyContent: 'space-between', marginRight: 6, height: 110 },
  yLabel: { fontSize: 9, color: COLORS.textMuted },
  chartPlotArea: { flex: 1 },
  chartBarsRow: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 110 },
  barGroup: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 1 },
  bar: { flex: 1, borderRadius: 3 },
  chartXAxisRow: { flexDirection: 'row', gap: 4, marginTop: 6, height: 18 },
  chartXAxisCol: { flex: 1, alignItems: 'center' },
  xLabel: { fontSize: 9, color: COLORS.textMuted, textAlign: 'center' },
  legendRow: { flexDirection: 'row', gap: 10, marginBottom: SPACING.md, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: COLORS.textMuted },
  statsRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginBottom: 2 },
  statValue: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  analyticsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: SPACING.sm },
  analyticsBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.primaryLight },
  syncStamp: { fontSize: 10, color: COLORS.textMuted, marginBottom: SPACING.sm },

  // Crop Year (kept for reference)
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACING.sm },
  cropItem: { width: (width - SPACING.lg * 2 - SPACING.lg * 2 - 10) / 2, backgroundColor: COLORS.background, borderRadius: RADIUS.sm, padding: SPACING.md },
  cropLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 4 },
  cropValue: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  stableNote: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.successLight, borderRadius: RADIUS.sm, padding: SPACING.sm },
  stableText: { fontSize: 11, color: COLORS.success, flex: 1 },

  // Active Fields
  fieldRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  fieldStatusDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  fieldBody: { flex: 1, gap: 2 },
  fieldId: { fontSize: 12, fontWeight: '700', color: COLORS.text },
  fieldStage: { fontSize: 11, color: COLORS.textMuted },
  fieldAge: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },

  // Notifications
  notifOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  notifPanel: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#fff', borderBottomLeftRadius: RADIUS.xl, borderBottomRightRadius: RADIUS.xl, paddingTop: 52, paddingBottom: 24, paddingHorizontal: SPACING.lg, ...SHADOW.card },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  notifTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  notifHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  markRead: { fontSize: 12, color: COLORS.primaryLight, fontWeight: '600' },
  notifItem: { flexDirection: 'row', gap: SPACING.md, paddingVertical: 12, borderTopWidth: 1, borderTopColor: COLORS.border, alignItems: 'flex-start' },
  notifUnread: { backgroundColor: COLORS.primaryBg + '60' },
  notifIcon: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  notifBody: { flex: 1, gap: 2 },
  notifItemTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  notifMsg: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  notifTime: { fontSize: 10, color: COLORS.textMuted },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 6, flexShrink: 0 },
});
