import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { MOCK_WEEKLY_CHART } from '../data/mockData';

const { width } = Dimensions.get('window');

const MONTHLY_DATA = {
  labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
  prices: [2200, 2300, 2400, 2350, 2500, 2600, 2550, 2700, 2750, 2800],
};

const BAR_COLORS = ['#B8D4A0', '#8FBF6A', '#6BA045', '#4A7C2F', '#2D5016'];

export default function AnalyticsScreen({ navigation }) {
  const [period, setPeriod] = useState('monthly');
  const chart = MOCK_WEEKLY_CHART;
  const maxP = 3000, minP = 1800;

  const data = period === 'monthly'
    ? { labels: MONTHLY_DATA.labels, values: MONTHLY_DATA.prices }
    : { labels: chart.months, values: chart.weeks[4] };

  const barMax = Math.max(...data.values);
  const barMin = Math.min(...data.values);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Price Analytics</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Period Toggle */}
        <View style={s.periodRow}>
          {['weekly', 'monthly', 'crop-year'].map(p => (
            <TouchableOpacity key={p} style={[s.periodBtn, period === p && s.periodBtnActive]} onPress={() => setPeriod(p)}>
              <Text style={[s.periodText, period === p && s.periodTextActive]}>
                {p === 'weekly' ? 'Weekly' : p === 'monthly' ? 'Monthly' : 'Crop Year'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Chart */}
        <View style={s.card}>
          <Text style={s.cardTitle}>HPCo Price Trend (Php / Lkg)</Text>
          <View style={s.lineChart}>
            <View style={s.yAxis}>
              {[3000, 2750, 2500, 2250, 2000].map(v => (
                <Text key={v} style={s.yLabel}>{(v / 1000).toFixed(1)}k</Text>
              ))}
            </View>
            <View style={s.barsArea}>
              {data.labels.map((label, i) => {
                const pct = ((data.values[i] - 1500) / (3000 - 1500)) * 100;
                const isLatest = i === data.values.length - 1;
                return (
                  <View key={i} style={s.barCol}>
                    <View style={s.barTrack}>
                      <View style={[s.barFill, { height: `${pct}%`, backgroundColor: isLatest ? COLORS.primary : COLORS.primaryLight }]} />
                    </View>
                    <Text style={s.barLabel}>{label}</Text>
                    {isLatest && <View style={s.latestDot} />}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={s.metricsGrid}>
          {[
            { icon: 'trending-up', label: 'Highest Price', value: 'Php 2,900', color: COLORS.success },
            { icon: 'trending-down', label: 'Lowest Price', value: 'Php 2,100', color: '#D9534F' },
            { icon: 'analytics', label: 'Average Price', value: 'Php 2,650', color: COLORS.blue },
            { icon: 'pulse', label: 'Volatility', value: '±2.1%', color: COLORS.accent },
          ].map(m => (
            <View key={m.label} style={s.metricCard}>
              <View style={[s.metricIcon, { backgroundColor: m.color + '18' }]}>
                <Ionicons name={m.icon} size={18} color={m.color} />
              </View>
              <Text style={s.metricValue}>{m.value}</Text>
              <Text style={s.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* Weekly Breakdown */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Weekly Breakdown</Text>
          {chart.months.map((month, mi) => (
            <View key={mi} style={s.weekRow}>
              <Text style={s.weekMonth}>{month}</Text>
              <View style={s.weekBars}>
                {chart.weeks.map((wk, wi) => {
                  const h = Math.max(6, ((wk[mi] - 1800) / (3000 - 1800)) * 32);
                  return <View key={wi} style={[s.weekBar, { height: h, backgroundColor: BAR_COLORS[wi] }]} />;
                })}
              </View>
              <Text style={s.weekPrice}>Php {chart.weeks[4][mi].toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Trend Analysis */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Trend Analysis</Text>
          {[
            { label: '7-day change', value: '+Php 50', positive: true },
            { label: '30-day change', value: '+Php 150', positive: true },
            { label: 'vs. same period last year', value: '+Php 200', positive: true },
            { label: 'Forecast (next 2 weeks)', value: 'Php 2,820–2,850', positive: true },
          ].map(t => (
            <View key={t.label} style={s.trendRow}>
              <Text style={s.trendLabel}>{t.label}</Text>
              <Text style={[s.trendValue, { color: t.positive ? COLORS.success : '#D9534F' }]}>{t.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 32 },
  periodRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: RADIUS.md, padding: 4, gap: 4, ...SHADOW.card },
  periodBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: RADIUS.sm },
  periodBtnActive: { backgroundColor: COLORS.primary },
  periodText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  periodTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.card },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  lineChart: { flexDirection: 'row', height: 180 },
  yAxis: { width: 32, justifyContent: 'space-between', paddingBottom: 20 },
  yLabel: { fontSize: 9, color: COLORS.textMuted, textAlign: 'right' },
  barsArea: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingBottom: 20, paddingLeft: 8 },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barTrack: { flex: 1, width: '70%', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 3, minHeight: 4 },
  barLabel: { fontSize: 8, color: COLORS.textMuted, marginTop: 4 },
  latestDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, position: 'absolute', top: 0 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { width: (width - SPACING.lg * 2 - 10) / 2, backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md, ...SHADOW.card, gap: 6 },
  metricIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  metricValue: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  metricLabel: { fontSize: 11, color: COLORS.textMuted },
  weekRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  weekMonth: { width: 32, fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  weekBars: { flex: 1, flexDirection: 'row', gap: 3, alignItems: 'flex-end', height: 32 },
  weekBar: { flex: 1, borderRadius: 2 },
  weekPrice: { fontSize: 12, fontWeight: '700', color: COLORS.text, width: 70, textAlign: 'right' },
  trendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  trendLabel: { fontSize: 13, color: COLORS.textSecondary },
  trendValue: { fontSize: 13, fontWeight: '700' },
});
