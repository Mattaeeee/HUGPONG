import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';

const { width } = Dimensions.get('window');

// ── Mock Descriptive Data ──────────────────────────────────────────────────
const COST_BREAKDOWN = [
  { label: 'Land Prep & Planting', value: 38, color: '#8F3A8F', amount: 52000 },
  { label: 'Fertilizer (All Stages)', value: 32, color: '#1A6B9A', amount: 43800 },
  { label: 'Labor Wages', value: 18, color: '#4A7C2F', amount: 24600 },
  { label: 'Chemical Spraying', value: 8, color: '#F5A623', amount: 10950 },
  { label: 'Other', value: 4, color: '#8A9B7A', amount: 5480 },
];

const FIELD_COSTS = [
  { id: 'FLD-KTR-001', costPerHa: 12400, ha: 1.5 },
  { id: 'FLD-KTR-003', costPerHa: 8900, ha: 2.0 },
  { id: 'FLD-KTR-007', costPerHa: 15200, ha: 1.0 },
  { id: 'FLD-KTR-009', costPerHa: 10100, ha: 0.8 },
];

const CROP_STAGES = [
  { label: 'Land Prep', ha: 3.0, color: '#8F3A8F', icon: 'construct' },
  { label: 'Planting', ha: 5.5, color: '#4A7C2F', icon: 'leaf' },
  { label: 'Fertilizing', ha: 8.0, color: '#1A6B9A', icon: 'flask' },
  { label: 'Weeding', ha: 4.5, color: '#F5A623', icon: 'water' },
  { label: 'Harvesting', ha: 1.5, color: '#D9534F', icon: 'basket' },
];

const SRA_PRICE_HISTORY = [
  { week: 'Wk1 Mar', price: 2450 },
  { week: 'Wk2 Mar', price: 2500 },
  { week: 'Wk3 Mar', price: 2480 },
  { week: 'Wk4 Mar', price: 2550 },
  { week: 'Wk1 Apr', price: 2600 },
  { week: 'Wk2 Apr', price: 2580 },
  { week: 'Wk3 Apr', price: 2650 },
  { week: 'Wk4 Apr', price: 2700 },
  { week: 'Wk1 May', price: 2720 },
  { week: 'Wk2 May', price: 2750 },
  { week: 'Wk3 May', price: 2800 },
  { week: 'Wk4 May', price: 2800 },
];

const maxPrice = Math.max(...SRA_PRICE_HISTORY.map(p => p.price));
const minPrice = Math.min(...SRA_PRICE_HISTORY.map(p => p.price));
const maxFieldCost = Math.max(...FIELD_COSTS.map(f => f.costPerHa));
const totalHa = CROP_STAGES.reduce((sum, s) => sum + s.ha, 0);
const totalCost = COST_BREAKDOWN.reduce((sum, c) => sum + c.amount, 0);

export default function AnalyticsScreen({ navigation }) {
  const [tab, setTab] = useState('financial');

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Descriptive Analytics</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Sync Stamp */}
      <View style={s.syncBar}>
        <Ionicons name="cloud-done-outline" size={13} color={COLORS.success} />
        <Text style={s.syncText}>Data synced: May 21, 2026 · 6:30 PM  ·  Offline cached</Text>
      </View>

      {/* Tab Bar */}
      <View style={s.tabBar}>
        {[
          { key: 'financial', label: 'Financial Diagnostics', icon: 'cash-outline' },
          { key: 'crop', label: 'Crop Diagnostics', icon: 'leaf-outline' },
        ].map(t => (
          <TouchableOpacity
            key={t.key}
            style={[s.tab, tab === t.key && s.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[s.tabText, tab === t.key && s.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ════════════════════════════════════ */}
        {/* FINANCIAL DIAGNOSTICS TAB */}
        {/* ════════════════════════════════════ */}
        {tab === 'financial' && (
          <>
            {/* Summary KPIs */}
            <View style={s.kpiRow}>
              <View style={s.kpiCard}>
                <Text style={s.kpiLabel}>Total Op. Cost</Text>
                <Text style={s.kpiValue}>Php {(totalCost / 1000).toFixed(1)}k</Text>
              </View>
              <View style={s.kpiCard}>
                <Text style={s.kpiLabel}>Avg Cost / Ha</Text>
                <Text style={s.kpiValue}>Php {Math.round(totalCost / totalHa).toLocaleString()}</Text>
              </View>
              <View style={s.kpiCard}>
                <Text style={s.kpiLabel}>Active Fields</Text>
                <Text style={s.kpiValue}>{FIELD_COSTS.length}</Text>
              </View>
            </View>

            {/* Cost Breakdown Donut-style list */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Operational Cost Breakdown</Text>
              <Text style={s.cardSub}>Block farm total: Php {totalCost.toLocaleString()}</Text>

              {/* Donut Bar */}
              <View style={s.donutBar}>
                {COST_BREAKDOWN.map(c => (
                  <View key={c.label} style={[s.donutSegment, { flex: c.value, backgroundColor: c.color }]} />
                ))}
              </View>

              {/* Legend + Bars */}
              {COST_BREAKDOWN.map(c => (
                <View key={c.label} style={s.breakRow}>
                  <View style={[s.breakDot, { backgroundColor: c.color }]} />
                  <View style={s.breakBody}>
                    <View style={s.breakTop}>
                      <Text style={s.breakLabel}>{c.label}</Text>
                      <Text style={s.breakPct}>{c.value}%</Text>
                    </View>
                    <View style={s.breakTrack}>
                      <View style={[s.breakFill, { width: `${c.value}%`, backgroundColor: c.color }]} />
                    </View>
                    <Text style={s.breakAmt}>Php {c.amount.toLocaleString()}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Cost per Hectare Comparison */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Cost-per-Hectare Efficiency</Text>
              <Text style={s.cardSub}>Compare operational cost efficiency across active fields</Text>
              {FIELD_COSTS.map(f => {
                const pct = (f.costPerHa / maxFieldCost) * 100;
                const isHigh = f.costPerHa === maxFieldCost;
                return (
                  <View key={f.id} style={s.effRow}>
                    <View style={s.effLeft}>
                      <Text style={s.effId}>{f.id}</Text>
                      <Text style={s.effHa}>{f.ha} Ha</Text>
                    </View>
                    <View style={s.effBarWrap}>
                      <View style={[s.effBar, { width: `${pct}%`, backgroundColor: isHigh ? '#D9534F' : COLORS.primary }]} />
                    </View>
                    <Text style={[s.effCost, isHigh && { color: '#D9534F' }]}>₱{(f.costPerHa / 1000).toFixed(1)}k</Text>
                  </View>
                );
              })}
              <View style={s.effNote}>
                <Ionicons name="information-circle-outline" size={13} color={COLORS.blue} />
                <Text style={s.effNoteText}>FLD-KTR-007 is the highest cost field. Manager may want to review its operations.</Text>
              </View>
            </View>
          </>
        )}

        {/* ════════════════════════════════════ */}
        {/* CROP DIAGNOSTICS TAB */}
        {/* ════════════════════════════════════ */}
        {tab === 'crop' && (
          <>
            {/* Crop Stage Distribution */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Hectares by Crop Stage</Text>
              <Text style={s.cardSub}>Total: {totalHa} Ha across {FIELD_COSTS.length} active fields</Text>

              {/* Stage Bar */}
              <View style={s.stageBar}>
                {CROP_STAGES.map(st => (
                  <View key={st.label} style={[s.stageSegment, { flex: st.ha, backgroundColor: st.color }]} />
                ))}
              </View>

              {CROP_STAGES.map(st => (
                <View key={st.label} style={s.stageRow}>
                  <View style={[s.stageDot, { backgroundColor: st.color }]} />
                  <Ionicons name={st.icon} size={14} color={st.color} />
                  <Text style={s.stageLabel}>{st.label}</Text>
                  <View style={s.stageBarMini}>
                    <View style={[s.stageBarFill, { width: `${(st.ha / totalHa) * 100}%`, backgroundColor: st.color + '50' }]} />
                  </View>
                  <Text style={s.stageHa}>{st.ha} Ha</Text>
                  <Text style={s.stagePct}>{((st.ha / totalHa) * 100).toFixed(0)}%</Text>
                </View>
              ))}
            </View>

            {/* SRA Price Monitor */}
            <View style={s.card}>
              <View style={s.priceChartHeader}>
                <View>
                  <Text style={s.cardTitle}>SRA Weekly Price Monitor</Text>
                  <Text style={s.cardSub}>Raw sugar price per Lkg (Php) — Posted by SRA</Text>
                </View>
                <View style={s.liveBadge}>
                  <View style={s.liveDot} />
                  <Text style={s.liveText}>Cached</Text>
                </View>
              </View>

              {/* KPI row */}
              <View style={s.priceKpiRow}>
                <View style={s.priceKpi}>
                  <Text style={s.priceKpiLabel}>Current</Text>
                  <Text style={[s.priceKpiVal, { color: COLORS.primary }]}>₱{SRA_PRICE_HISTORY[SRA_PRICE_HISTORY.length - 1].price.toLocaleString()}</Text>
                </View>
                <View style={s.priceKpiDiv} />
                <View style={s.priceKpi}>
                  <Text style={s.priceKpiLabel}>Season High</Text>
                  <Text style={[s.priceKpiVal, { color: COLORS.success }]}>₱{maxPrice.toLocaleString()}</Text>
                </View>
                <View style={s.priceKpiDiv} />
                <View style={s.priceKpi}>
                  <Text style={s.priceKpiLabel}>Season Low</Text>
                  <Text style={[s.priceKpiVal, { color: '#D9534F' }]}>₱{minPrice.toLocaleString()}</Text>
                </View>
              </View>

              {/* Bar Chart */}
              <View style={s.priceChartWrap}>
                <View style={s.priceYAxis}>
                  {[2800, 2650, 2500, 2350].map(v => (
                    <Text key={v} style={s.priceYLabel}>{(v / 1000).toFixed(1)}k</Text>
                  ))}
                </View>
                <View style={s.pricePlotArea}>
                  <View style={s.priceBarsRow}>
                    {SRA_PRICE_HISTORY.map((item, i) => {
                      const pct = ((item.price - 2300) / (2900 - 2300)) * 100;
                      const isLatest = i === SRA_PRICE_HISTORY.length - 1;
                      return (
                        <View key={i} style={s.priceBarCol}>
                          <View style={s.priceBarTrack}>
                            <View style={[s.priceBarFill, { height: `${pct}%`, backgroundColor: isLatest ? COLORS.primary : COLORS.primaryLight }]} />
                          </View>
                        </View>
                      );
                    })}
                  </View>
                  <View style={s.priceXAxisRow}>
                    {SRA_PRICE_HISTORY.map((item, i) => (
                      <View key={i} style={s.priceXAxisCol}>
                        {i % 3 === 0 ? (
                          <Text style={s.priceXLabel}>{item.week.replace(' ', '\n')}</Text>
                        ) : null}
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <Text style={s.priceNote}>Last updated by SRA: May 21, 2026  ·  Cached offline</Text>
            </View>
          </>
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
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  syncBar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: SPACING.lg, paddingVertical: 7, backgroundColor: COLORS.successLight },
  syncText: { fontSize: 11, color: COLORS.success, fontWeight: '500' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: 13, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary, fontWeight: '800' },
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 32 },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, gap: SPACING.sm, ...SHADOW.card },
  cardTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  cardSub: { fontSize: 11, color: COLORS.textMuted, marginTop: -2 },

  // KPI Row
  kpiRow: { flexDirection: 'row', gap: 8 },
  kpiCard: { flex: 1, backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', gap: 4, ...SHADOW.card },
  kpiLabel: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center' },
  kpiValue: { fontSize: 15, fontWeight: '800', color: COLORS.text },

  // Donut Bar
  donutBar: { flexDirection: 'row', height: 16, borderRadius: 8, overflow: 'hidden', marginVertical: SPACING.sm },
  donutSegment: { height: '100%' },

  // Cost Breakdown
  breakRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border },
  breakDot: { width: 10, height: 10, borderRadius: 5, marginTop: 5, flexShrink: 0 },
  breakBody: { flex: 1, gap: 4 },
  breakTop: { flexDirection: 'row', justifyContent: 'space-between' },
  breakLabel: { fontSize: 12, fontWeight: '600', color: COLORS.text, flex: 1 },
  breakPct: { fontSize: 12, fontWeight: '800', color: COLORS.textSecondary },
  breakTrack: { height: 5, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  breakFill: { height: '100%', borderRadius: 3 },
  breakAmt: { fontSize: 11, color: COLORS.textMuted },

  // Efficiency
  effRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  effLeft: { width: 90 },
  effId: { fontSize: 11, fontWeight: '700', color: COLORS.text },
  effHa: { fontSize: 10, color: COLORS.textMuted },
  effBarWrap: { flex: 1, height: 10, backgroundColor: COLORS.border, borderRadius: 5, overflow: 'hidden' },
  effBar: { height: '100%', borderRadius: 5 },
  effCost: { fontSize: 12, fontWeight: '800', color: COLORS.primary, width: 42, textAlign: 'right' },
  effNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: '#E0F0FA', borderRadius: RADIUS.sm, padding: SPACING.sm, marginTop: 4 },
  effNoteText: { flex: 1, fontSize: 11, color: COLORS.blue, lineHeight: 16 },

  // Stage Distribution
  stageBar: { flexDirection: 'row', height: 18, borderRadius: 9, overflow: 'hidden', marginVertical: SPACING.sm },
  stageSegment: { height: '100%' },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  stageDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  stageLabel: { fontSize: 12, fontWeight: '600', color: COLORS.text, width: 80 },
  stageBarMini: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  stageBarFill: { height: '100%', borderRadius: 3 },
  stageHa: { fontSize: 12, fontWeight: '700', color: COLORS.text, width: 36, textAlign: 'right' },
  stagePct: { fontSize: 10, color: COLORS.textMuted, width: 28, textAlign: 'right' },

  // Price Chart
  priceChartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.successLight, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  liveText: { fontSize: 10, fontWeight: '700', color: COLORS.success },
  priceKpiRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md },
  priceKpi: { flex: 1, alignItems: 'center', gap: 3 },
  priceKpiDiv: { width: 1, backgroundColor: COLORS.border },
  priceKpiLabel: { fontSize: 10, color: COLORS.textMuted },
  priceKpiVal: { fontSize: 15, fontWeight: '800' },
  priceChartWrap: { flexDirection: 'row', height: 160, marginTop: SPACING.sm },
  priceYAxis: { width: 30, justifyContent: 'space-between', height: 130 },
  priceYLabel: { fontSize: 8, color: COLORS.textMuted, textAlign: 'right' },
  pricePlotArea: { flex: 1, paddingLeft: 4 },
  priceBarsRow: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 130 },
  priceBarCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  priceBarTrack: { flex: 1, width: '80%', justifyContent: 'flex-end' },
  priceBarFill: { width: '100%', borderRadius: 2, minHeight: 4 },
  priceXAxisRow: { flexDirection: 'row', gap: 2, marginTop: 6, height: 24 },
  priceXAxisCol: { flex: 1, alignItems: 'center' },
  priceXLabel: { fontSize: 8, color: COLORS.textSecondary, fontWeight: '600', textAlign: 'center', lineHeight: 10 },
  priceNote: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', paddingTop: 4 },
});
