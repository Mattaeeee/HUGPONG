import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Dimensions, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { MOCK_PRICE, MOCK_MOL, MOCK_WEEKLY_CHART, subscribe, getIsSynced, getCurrentSession, MOCK_FIELDS, performMobileSync } from '../data/dataStore';
import { useTranslation } from '../services/i18n';
import AppHeader from '../components/AppHeader';

// Role-Specific Modular Views
import MemberHomeView from './member/MemberHomeView';
import ManagerHomeView from './manager/ManagerHomeView';
import SRAHomeView from './sra/SRAHomeView';

const { width } = Dimensions.get('window');
const BAR_COLORS = ['#B8D4A0', '#8FBF6A', '#6BA045', '#4A7C2F', '#2D5016'];
const MAX_PRICE = 3000;
const MIN_PRICE = 1000;

const NOTIFICATIONS = [
  { id: 1, type: 'price', icon: 'trending-up', color: COLORS.success, title: 'Price Update', msg: 'HPCo price increased by Php 70/Lkg to ₱2,950', time: '4:15 PM', unread: true },
  { id: 2, type: 'alert', icon: 'warning', color: COLORS.accent, title: 'Sync Reminder', msg: '5 offline records are pending sync', time: '2:30 PM', unread: true },
  { id: 3, type: 'info', icon: 'information-circle', color: COLORS.blue, title: 'Market Summary', msg: 'Monthly average is Php 2,845/Lkg — 3% upward trend', time: 'Yesterday', unread: false },
];

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [chartMode, setChartMode] = useState('weekly');
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [synced, setSyncedState] = useState(getIsSynced());
  const [session, setSessionState] = useState(getCurrentSession());
  const [fields, setFields] = useState([...MOCK_FIELDS]);
  
  // Consolidated Dynamic SRA Price State
  const [priceData, setPriceData] = useState({
    livePrice: MOCK_PRICE.value,
    liveMol: MOCK_MOL.value,
    liveDate: MOCK_PRICE.lastUpdated || 'May 21, 2026',
    liveChange: MOCK_PRICE.change || 70.0,
    liveWeek: MOCK_PRICE.week || 'Week 4 May',
  });
  const { livePrice, liveMol, liveDate, liveChange, liveWeek } = priceData;

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [inputWeek, setInputWeek] = useState('Week 4 May');
  const [inputBag, setInputBag] = useState('2950');
  const [inputMol, setInputMol] = useState('4400');
  const [inputCircular, setInputCircular] = useState('SRA Circular #105');

  const unreadCount = React.useMemo(() => notifs.filter(n => n.unread).length, [notifs]);

  React.useEffect(() => {
    const unsubscribe = subscribe(() => {
      setSyncedState(getIsSynced());
      setSessionState(getCurrentSession());
      setFields(MOCK_FIELDS);
      setPriceData({
        livePrice: MOCK_PRICE.value,
        liveMol: MOCK_MOL.value,
        liveDate: MOCK_PRICE.lastUpdated || 'May 21, 2026',
        liveChange: MOCK_PRICE.change || 70.0,
        liveWeek: MOCK_PRICE.week || 'Week 4 May',
      });
    });
    return unsubscribe;
  }, []);

  const handleDismissNotif = React.useCallback((id) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleClearAllNotifs = () => {
    if (notifs.length === 0) return;
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to dismiss all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => setNotifs([]) }
      ]
    );
  };

  const openNotifs = () => setShowNotifs(true);
  const closeNotifs = () => setShowNotifs(false);

  const handleManualSync = () => {
    performMobileSync();
    Alert.alert('Sync Complete', `All offline records and field logs have been synchronized.`);
  };

  const handleOpenPriceModal = () => {
    if (session.role === 'SRA (Admin)') {
      setInputBag(livePrice.toString());
      setInputMol(liveMol.toString());
      setInputWeek(liveWeek || 'Week 3 Jun');
      setInputCircular('SRA Circular #105');
      setShowPriceModal(true);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader right={
        <TouchableOpacity style={s.notifBtn} onPress={openNotifs}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
          {unreadCount > 0 && <View style={s.badge}><Text style={s.badgeText}>{unreadCount}</Text></View>}
        </TouchableOpacity>
      } />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── 1. Top HPCo · Silay Price Card ── */}
        <TouchableOpacity
          style={[s.card, s.priceCard]}
          activeOpacity={session.role === 'SRA (Admin)' ? 0.7 : 1}
          onPress={handleOpenPriceModal}
        >
          <View style={s.priceCardHeader}>
            <View style={s.priceSourceRow}>
              <View style={[s.sourceDot, !synced && { backgroundColor: COLORS.accent }]} />
              <Text style={s.priceSource}>HPCo · Silay</Text>
            </View>
            <Text style={[s.priceUpdated, !synced && { color: COLORS.accent, fontWeight: '600' }]}>
              {synced ? `Official: ${liveWeek} · ${liveDate}` : 'Offline: Cached'}
            </Text>
          </View>

          <View style={s.pricePairRow}>
            {/* B — Sugarcane/Lkg */}
            <View style={s.pricePairItem}>
              <Text style={s.pricePairTag}>Sugar (B)</Text>
              <Text style={s.pricePairValue} numberOfLines={1} adjustsFontSizeToFit>
                ₱{livePrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <View style={s.priceChangeRow}>
                <Ionicons name="caret-up" size={11} color={COLORS.success} />
                <Text style={s.priceChangeTxt}>+{Number(liveChange).toFixed(2)}</Text>
              </View>
              <Text style={s.pricePairUnit}>{t('unit_per_lkg', 'per Lkg')}</Text>
            </View>

            <View style={s.pricePairDivider} />

            {/* Mol — Molasses/MT */}
            <View style={s.pricePairItem}>
              <Text style={s.pricePairTag}>{t('molasses_short', 'Molasses')}</Text>
              <Text style={s.pricePairValue} numberOfLines={1} adjustsFontSizeToFit>
                ₱{liveMol.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <View style={s.priceChangeRow}>
                <Ionicons name="caret-up" size={11} color={COLORS.success} />
                <Text style={s.priceChangeTxt}>+{Number(MOCK_MOL.change || 100).toFixed(2)}</Text>
              </View>
              <Text style={s.pricePairUnit}>{t('unit_per_mt', 'per MT')}</Text>
            </View>
          </View>

          {session.role === 'SRA (Admin)' && (
            <View style={s.sraEditHint}>
              <Ionicons name="create-outline" size={13} color={COLORS.primary} />
              <Text style={s.sraEditText}>{t('tap_to_broadcast', 'Tap to broadcast new official SRA weekly price')}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* ── 2. SRA Weekly Price Monitor (Directly Under Price Card) ── */}
        <View style={s.card}>
          <View style={s.chartHeader}>
            <Text style={s.sectionTitle}>{t('analytics_price_monitor', 'SRA Weekly Price Monitor')}</Text>
            <View style={s.chartModeRow}>
              {['weekly', 'monthly'].map(m => (
                <TouchableOpacity key={m} style={[s.modeChip, chartMode === m && s.modeChipActive]} onPress={() => setChartMode(m)}>
                  <Text style={[s.modeChipText, chartMode === m && s.modeChipTextActive]}>
                    {m === 'weekly' ? t('time_week', 'Week') : t('time_month', 'Month')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={s.syncStamp}>
            {synced ? `Last synced: May 21, 2026 · 6:30 PM ✓ Cached` : t('sync_cached_stamp', 'Last synced: Cached')}
          </Text>

          {/* Bar Chart */}
          <View style={s.chartWrap}>
            <View style={s.chartYAxis}>
              {['3,000', '2,500', '2,000', '1,500'].map(v => <Text key={v} style={s.yLabel}>{v}</Text>)}
            </View>
            <View style={s.chartPlotArea}>
              <View style={s.chartBarsRow}>
                {MOCK_WEEKLY_CHART.months.map((month, mi) => (
                  <View key={mi} style={s.barGroup}>
                    {chartMode === 'weekly' ? (
                      MOCK_WEEKLY_CHART.weeks.map((wk, wi) => {
                        const h = Math.max(4, ((wk[mi] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 110);
                        return <View key={wi} style={[s.bar, { height: h, backgroundColor: BAR_COLORS[wi] }]} />;
                      })
                    ) : (
                      (() => {
                        const avg = MOCK_WEEKLY_CHART.weeks.reduce((sum, wk) => sum + wk[mi], 0) / MOCK_WEEKLY_CHART.weeks.length;
                        const h = Math.max(4, ((avg - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 110);
                        return <View style={[s.bar, { width: 14, height: h, backgroundColor: COLORS.primary }]} />;
                      })()
                    )}
                  </View>
                ))}
              </View>
              <View style={s.chartXAxisRow}>
                {MOCK_WEEKLY_CHART.months.map((month, mi) => (
                  <View key={mi} style={s.chartXAxisCol}>
                    <Text style={s.xLabel}>{month}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Legend (Weeks 1 to 4) */}
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
                <Text style={s.legendText}>{t('monthly_avg_label', 'Monthly Average')}</Text>
              </View>
            </View>
          )}

          {/* Stats Row */}
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={s.statLabel}>{t('stat_monthly_avg', 'Monthly Avg')}</Text>
              <Text style={s.statValue}>₱{Number(MOCK_WEEKLY_CHART.monthlyAvg || 2845).toLocaleString()}</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statBox}>
              <Text style={s.statLabel}>{t('stat_crop_year_peak', 'Crop Year Peak')}</Text>
              <Text style={s.statValue}>₱{Number(MOCK_WEEKLY_CHART.cropYearPeak || 2950).toLocaleString()}</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statBox}>
              <Text style={s.statLabel}>{t('stat_trend', 'Trend')}</Text>
              <Text style={[s.statValue, { color: COLORS.success }]}>↑ 3.2%</Text>
            </View>
          </View>

          {/* View Full Analytics Link */}
          <TouchableOpacity style={s.analyticsBtn} onPress={() => navigation.navigate('Analytics')}>
            <Text style={s.analyticsBtnText}>{t('view_full_analytics', 'View Full Analytics')}</Text>
            <Ionicons name="chevron-forward" size={15} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* ── 2. Role-Specific Modular Views ── */}
        {session.role === 'Member' && (
          <MemberHomeView
            session={session}
            myFields={fields.filter(f => f.member === session.name || f.id === session.fieldId)}
            navigation={navigation}
            onManualSync={handleManualSync}
          />
        )}
        {session.role === 'Farm Manager' && (
          <ManagerHomeView
            session={session}
            fields={fields}
            navigation={navigation}
            onManualSync={handleManualSync}
          />
        )}
        {session.role === 'SRA (Admin)' && (
          <SRAHomeView
            session={session}
            fields={fields}
            navigation={navigation}
          />
        )}

      </ScrollView>

      {/* ── SRA Price Edit Modal ── */}
      <Modal visible={showPriceModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t('sra_publish_title', 'Publish Official SRA Price')}</Text>
              <TouchableOpacity onPress={() => setShowPriceModal(false)}>
                <Ionicons name="close" size={22} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={s.inputLabel}>{t('sra_circ_week', 'Circular / Week')}</Text>
            <TextInput style={s.input} value={inputWeek} onChangeText={setInputWeek} placeholder="e.g. Week 3 Jun" />

            <Text style={s.inputLabel}>{t('sra_circ_num', 'SRA Circular Number')}</Text>
            <TextInput
              style={s.input}
              value={inputCircular}
              onChangeText={setInputCircular}
              placeholder="e.g. SRA Circular #105 (HPCo Silay Millsite)"
            />

            <Text style={s.inputLabel}>{t('sra_raw_sugar_price', 'Raw Sugar (₱ / Lkg Bag)')}</Text>
            <TextInput style={s.input} value={inputBag} onChangeText={setInputBag} keyboardType="numeric" placeholder="2950" />

            <Text style={s.inputLabel}>{t('sra_molasses_price', 'Molasses (₱ / Metric Ton)')}</Text>
            <TextInput style={s.input} value={inputMol} onChangeText={setInputMol} keyboardType="numeric" placeholder="4400" />

            <TouchableOpacity 
              style={s.saveModalBtn}
              onPress={() => {
                const b = parseFloat(inputBag);
                const m = parseFloat(inputMol);
                if (isNaN(b) || isNaN(m)) {
                  Alert.alert(t('error_title', 'Error'), t('invalid_numbers_error', 'Please enter valid numbers'));
                  return;
                }
                setPriceData(prev => ({
                  ...prev,
                  livePrice: b,
                  liveMol: m,
                  liveWeek: inputWeek,
                  liveDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                }));
                setShowPriceModal(false);
                Alert.alert(t('price_posted_title', 'Price Posted ✓'), `${inputCircular || 'SRA Circular'} benchmark updated to ₱${b.toLocaleString()}/Lkg.`);
              }}
            >
              <Text style={s.saveModalBtnText}>{t('sra_btn_broadcast', 'Broadcast Benchmark Price')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Notifications Modal (Full Screen) ── */}
      <Modal visible={showNotifs} animationType="slide" onRequestClose={closeNotifs}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.text }}>{t('notif_title', 'System Notifications')}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{t('notif_sub', 'District 3 & Sugar Central Updates')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {notifs.length > 0 && (
                <TouchableOpacity
                  onPress={handleClearAllNotifs}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#FEE2E2', borderRadius: RADIUS.sm }}
                >
                  <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.danger }}>{t('btn_clear_all', 'Clear All')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={closeNotifs} style={{ padding: 4 }}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          {notifs.length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl, gap: 12 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="notifications-off-outline" size={32} color={COLORS.textMuted} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.text }}>{t('notif_empty', 'No Notifications')}</Text>
              <Text style={{ fontSize: 13, color: COLORS.textMuted, textAlign: 'center', maxWidth: 260 }}>
                {t('notif_caught_up', "You're all caught up on all district advisories and central updates.")}
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ padding: SPACING.md, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
              {notifs.map(n => (
                <View key={n.id} style={s.notifItem}>
                  <View style={[s.notifIconBox, { backgroundColor: n.color + '15' }]}>
                    <Ionicons name={n.icon} size={18} color={n.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Text style={s.notifTitle}>{n.title}</Text>
                      <TouchableOpacity
                        onPress={() => handleDismissNotif(n.id)}
                        style={{ padding: 4, marginRight: -4, marginTop: -4 }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons name="close" size={16} color={COLORS.textMuted} />
                      </TouchableOpacity>
                    </View>
                    <Text style={s.notifMsg}>{n.msg}</Text>
                    <Text style={s.notifTime}>{n.time}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.md, gap: SPACING.md, paddingBottom: SPACING.xl * 2 },
  notifBtn: { position: 'relative', padding: 6 },
  badge: {
    position: 'absolute', top: 2, right: 2,
    backgroundColor: COLORS.danger, width: 16, height: 16,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center'
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOW.card
  },

  // HPCo Silay unified card
  priceCard: { borderWidth: 1, borderColor: COLORS.border },
  priceCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  priceSourceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sourceDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  priceSource: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  priceUpdated: { fontSize: 10, color: COLORS.textMuted, flexShrink: 1, textAlign: 'right' },
  pricePairRow: { flexDirection: 'row', alignItems: 'flex-start' },
  pricePairItem: { flex: 1, gap: 2 },
  pricePairTag: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  pricePairValue: { fontSize: 26, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  priceChangeRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  priceChangeTxt: { fontSize: 12, fontWeight: '700', color: COLORS.success },
  pricePairUnit: { fontSize: 11, color: COLORS.textMuted },
  pricePairDivider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: SPACING.md, alignSelf: 'stretch' },
  sraEditHint: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  sraEditText: { fontSize: 11, color: COLORS.primary, fontWeight: '600', flex: 1 },

  // Chart
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  chartModeRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: 10, padding: 3, gap: 2 },
  modeChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  modeChipActive: { backgroundColor: '#fff', ...SHADOW.card },
  modeChipText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  modeChipTextActive: { color: COLORS.primary, fontWeight: '700' },
  syncStamp: { fontSize: 10, color: COLORS.textMuted, marginBottom: SPACING.sm },
  chartWrap: { flexDirection: 'row', height: 140, marginBottom: SPACING.sm },
  chartYAxis: { justifyContent: 'space-between', marginRight: 6, height: 110 },
  yLabel: { fontSize: 9, color: COLORS.textMuted },
  chartPlotArea: { flex: 1 },
  chartBarsRow: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 110 },
  barGroup: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 1 },
  bar: { flex: 1, borderRadius: 3 },
  chartXAxisRow: { flexDirection: 'row', gap: 4, marginTop: 6, height: 18 },
  chartXAxisCol: { flex: 1, alignItems: 'center' },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: SPACING.sm,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAF5',
    borderRadius: 20,
    alignSelf: 'center',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 3.5 },
  legendText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  statsRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  statBox: { flex: 1, alignItems: 'center', paddingHorizontal: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginBottom: 2, textAlign: 'center' },
  statValue: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  analyticsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: SPACING.sm },
  analyticsBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.primaryLight },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: SPACING.lg },
  modalCard: { backgroundColor: '#FFF', borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOW.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  modalTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  inputLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', color: COLORS.textMuted, marginTop: 8, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, color: COLORS.text, backgroundColor: '#F9FAF7' },
  saveModalBtn: { backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: RADIUS.lg, alignItems: 'center', marginTop: SPACING.lg },
  saveModalBtnText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  notifItem: { flexDirection: 'row', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  notifIconBox: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  notifMsg: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  notifTime: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 }
});
