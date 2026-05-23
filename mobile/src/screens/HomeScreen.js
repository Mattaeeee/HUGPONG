import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, Modal, Dimensions, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';
import { MOCK_PRICE, MOCK_WEEKLY_CHART, subscribe, getIsSynced, getCurrentSession, MOCK_FIELDS } from '../data/mockData';
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

const MOCK_MOL = { value: 4200, change: +80, unit: '/ MT', lastUpdated: 'May 17, 2026' };


export default function HomeScreen({ navigation }) {
  const price = MOCK_PRICE;
  const mol = MOCK_MOL;
  const chart = MOCK_WEEKLY_CHART;
  const [chartMode, setChartMode] = useState('weekly');
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [synced, setSyncedState] = useState(getIsSynced());
  const [session, setSessionState] = useState(getCurrentSession());
  
  // Dynamic SRA Price States
  const [livePrice, setLivePrice] = useState(MOCK_PRICE.value);
  const [liveMol, setLiveMol] = useState(MOCK_MOL.value);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [inputBag, setInputBag] = useState('');
  const [inputMol, setInputMol] = useState('');

  const unreadCount = notifs.filter(n => n.unread).length;
  const slideAnim = useRef(new Animated.Value(-400)).current;

  React.useEffect(() => {
    const unsubscribe = subscribe(() => {
      setSyncedState(getIsSynced());
      setSessionState({ ...getCurrentSession() });
    });
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

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader right={
        <>
          <TouchableOpacity style={s.notifBtn} onPress={openNotifs}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
            {unreadCount > 0 && <View style={s.badge}><Text style={s.badgeText}>{unreadCount}</Text></View>}
          </TouchableOpacity>
          {/* Refresh icon removed to avoid redundancy with the main Sync button */}
        </>
      } />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Offline Mode Banner ── */}
        {!synced && (
          <View style={[s.card, { backgroundColor: '#FFFBF0', borderColor: '#FEF0D0', borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }]}>
            <Ionicons name="airplane" size={24} color="#C97A00" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#C97A00' }}>Offline Mode Sim</Text>
              <Text style={{ fontSize: 11, color: '#A06000', marginTop: 2 }}>You are operating offline. All activities are cached locally and will sync when connection returns.</Text>
            </View>
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
              setShowPriceModal(true);
            }
          }}
        >
          <View style={s.priceCardHeader}>
            <View style={s.priceSourceRow}>
              <View style={[s.sourceDot, !synced && { backgroundColor: COLORS.accent }]} />
              <Text style={s.priceSource}>HPCo · Silay</Text>
            </View>
            <Text style={[s.priceUpdated, !synced && { color: COLORS.accent, fontWeight: '600' }]}>
              {synced ? price.lastUpdated : 'Offline: Price may be outdated'}
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
                <Ionicons name="caret-up" size={11} color={COLORS.success} />
                <Text style={s.priceChangeTxt}>{price.change.toFixed(2)}</Text>
              </View>
              <Text style={s.pricePairUnit}>per Lkg</Text>
            </View>

            <View style={s.pricePairDivider} />

            {/* Mol — Molasses/MT */}
            <View style={s.pricePairItem}>
              <Text style={s.pricePairTag}>Mol</Text>
              <Text style={s.pricePairValue}>
                {liveMol.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </Text>
              <View style={{ height: 16 }} />
              <Text style={s.pricePairUnit}>per MT</Text>
            </View>
          </View>
        </TouchableOpacity>



        {/* ── Price Analytics ── */}
        <View style={s.card}>
          <View style={s.chartHeader}>
            <Text style={s.sectionTitle}>SRA Weekly Price Monitor</Text>
            <View style={s.chartModeRow}>
              {['weekly', 'monthly'].map(m => (
                <TouchableOpacity key={m} style={[s.modeChip, chartMode === m && s.modeChipActive]} onPress={() => setChartMode(m)}>
                  <Text style={[s.modeChipText, chartMode === m && s.modeChipTextActive]}>{m === 'weekly' ? 'Week' : 'Month'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={s.syncStamp}>Last synced: May 21, 2026 · 6:30 PM  ✓ Cached</Text>

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
                <Text style={s.legendText}>Monthly Average</Text>
              </View>
            </View>
          )}

          {/* Stats Row */}
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={s.statLabel}>Monthly Avg</Text>
              <Text style={s.statValue}>Php 2,750</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statBox}>
              <Text style={s.statLabel}>Crop Year Peak</Text>
              <Text style={s.statValue}>Php 2,900</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statBox}>
              <Text style={s.statLabel}>Trend</Text>
              <Text style={[s.statValue, { color: COLORS.success }]}>↑ 2%</Text>
            </View>
          </View>

          {/* View Full Analytics */}
          <TouchableOpacity style={s.analyticsBtn} onPress={() => navigation.navigate('Analytics')}>
            <Text style={s.analyticsBtnText}>View Full Analytics</Text>
            <Ionicons name="chevron-forward" size={15} color={COLORS.primaryLight} />
          </TouchableOpacity>
        </View>

        {/* ── Active Fields Quick View ── */}
        {session.role !== 'SRA (Admin)' && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>{session.role === 'Farm Manager' ? 'Active Managing Fields' : 'My Active Fields'}</Text>
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
                    <Text style={s.fieldAge}>{field.month} months</Text>
                  </View>
                ))
              ) : (
                <Text style={{ fontSize: 13, color: COLORS.textMuted, marginVertical: 10 }}>No active fields assigned yet.</Text>
              );
            })()}
            <TouchableOpacity style={s.analyticsBtn} onPress={() => navigation.navigate('Field Ops')}>
              <Text style={s.analyticsBtnText}>Manage Field Operations</Text>
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
                    <Text style={s.fieldStage}>{farm.fieldsCount} Active Fields</Text>
                  </View>
                  <Text style={[s.fieldAge, { color: COLORS.primary, fontWeight: '700' }]}>{farm.totalHa.toFixed(1)} Ha</Text>
                </View>
              ));
            })()}
            <TouchableOpacity style={s.analyticsBtn} onPress={() => navigation.navigate('Field Ops')}>
              <Text style={s.analyticsBtnText}>View District Operations</Text>
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
            <Text style={s.notifTitle}>Notifications</Text>
            <View style={s.notifHeaderRight}>
              <TouchableOpacity onPress={markAllRead}><Text style={s.markRead}>Mark all read</Text></TouchableOpacity>
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
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#fff', width: '100%', borderRadius: RADIUS.xl, padding: 20, ...SHADOW.card }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.text }}>Post Official Price</Text>
              <TouchableOpacity onPress={() => setShowPriceModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 16 }}>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 }}>Price per Bag (Lkg)</Text>
                <TextInput
                  style={{ backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 16, fontWeight: '600' }}
                  keyboardType="decimal-pad"
                  value={inputBag}
                  onChangeText={setInputBag}
                />
              </View>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 }}>Price per Molasses (MT)</Text>
                <TextInput
                  style={{ backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 16, fontWeight: '600' }}
                  keyboardType="decimal-pad"
                  value={inputMol}
                  onChangeText={setInputMol}
                />
              </View>
            </View>

            <TouchableOpacity
              style={{ backgroundColor: COLORS.primary, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 24, flexDirection: 'row', justifyContent: 'center', gap: 8 }}
              onPress={() => {
                const b = parseFloat(inputBag);
                const m = parseFloat(inputMol);
                if (isNaN(b) || isNaN(m)) {
                  Alert.alert('Error', 'Please enter valid numbers');
                  return;
                }
                setLivePrice(b);
                setLiveMol(m);
                setShowPriceModal(false);
                Alert.alert('Price Posted ✓', 'The new SRA prices have been successfully updated on the dashboard.');
              }}
            >
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Post New Price</Text>
            </TouchableOpacity>
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
