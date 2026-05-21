import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import AppHeader from '../components/AppHeader';

const PHASES = [
  {
    key: 'landprep',
    label: 'Land Prep & Planting',
    icon: 'construct',
    color: '#8F3A8F',
    month: 'Month 0–1',
    description: 'Plowing, dragging, hauling cane points (patdan), and planting.',
    items: [
      { key: 'plowing', label: 'Plowing Time', formula: a => a * 4, unit: 'hours', icon: 'time-outline' },
      { key: 'dragging', label: 'Dragging Time', formula: a => a * 2.5, unit: 'hours', icon: 'time-outline' },
      { key: 'canepoints', label: 'Cane Points (Patdan)', formula: a => a * 40000, unit: 'pieces', icon: 'leaf-outline' },
      { key: 'labor', label: 'Labor Crew Needed', formula: a => `${Math.round(a * 10)}–${Math.round(a * 15)} workers`, unit: '', icon: 'people-outline', isRange: true },
    ],
    costs: [
      { key: 'tractorRate', label: 'Tractor Rate (per hour)', prefix: 'Php', placeholder: 'e.g. 2500' },
      { key: 'caneRate', label: 'Cost per 10,000 Cane Points', prefix: 'Php', placeholder: 'e.g. 3500' },
      { key: 'wageRate', label: 'Daily Farm Wage (per worker)', prefix: 'Php', placeholder: 'e.g. 500' },
    ],
  },
  {
    key: 'fert1',
    label: 'Fertilization Stage 1',
    icon: 'leaf',
    color: '#1A6B9A',
    month: 'Month 2',
    description: '18-46 (Ammonium Phosphate) fertilizer application with ridge busting.',
    items: [
      { key: 'bags1846', label: '18-46 Fertilizer Bags', formula: a => Math.ceil(a * 3), unit: 'bags', icon: 'archive-outline' },
      { key: 'labor1', label: 'Labor Days Needed', formula: a => `${Math.round(a * 2)}–${Math.round(a * 3)} worker-days`, unit: '', icon: 'people-outline', isRange: true },
    ],
    costs: [
      { key: 'bagRate1', label: 'Cost per Bag of 18-46', prefix: 'Php', placeholder: 'e.g. 1800' },
      { key: 'wageRate', label: 'Daily Farm Wage (per worker)', prefix: 'Php', placeholder: 'e.g. 500' },
    ],
  },
  {
    key: 'fert2',
    label: 'Fertilization Stage 2',
    icon: 'water',
    color: '#4A7C2F',
    month: 'Month 3',
    description: 'Urea fertilizer application, weeding, and off-barring.',
    items: [
      { key: 'urea', label: 'Urea Bags', formula: a => Math.ceil(a * 4), unit: 'bags', icon: 'archive-outline' },
      { key: 'labor2', label: 'Labor Days Needed', formula: a => `${Math.round(a * 3)}–${Math.round(a * 4)} worker-days`, unit: '', icon: 'people-outline', isRange: true },
    ],
    costs: [
      { key: 'ureaRate', label: 'Cost per Bag of Urea', prefix: 'Php', placeholder: 'e.g. 1600' },
      { key: 'wageRate', label: 'Daily Farm Wage (per worker)', prefix: 'Php', placeholder: 'e.g. 500' },
    ],
  },
  {
    key: 'fert3',
    label: 'Fertilization Stage 3',
    icon: 'flask',
    color: '#F5A623',
    month: 'Month 4',
    description: 'Urea & Potash application, final weeding, and on-barring.',
    items: [
      { key: 'urea3', label: 'Urea Bags', formula: a => Math.ceil(a * 3), unit: 'bags', icon: 'archive-outline' },
      { key: 'potash', label: 'Potash (MOP) Bags', formula: a => Math.ceil(a * 2), unit: 'bags', icon: 'archive-outline' },
      { key: 'labor3', label: 'Labor Days Needed', formula: a => `${Math.round(a * 3)}–${Math.round(a * 4)} worker-days`, unit: '', icon: 'people-outline', isRange: true },
    ],
    costs: [
      { key: 'ureaRate3', label: 'Cost per Bag of Urea', prefix: 'Php', placeholder: 'e.g. 1600' },
      { key: 'potashRate', label: 'Cost per Bag of Potash', prefix: 'Php', placeholder: 'e.g. 1400' },
      { key: 'wageRate', label: 'Daily Farm Wage (per worker)', prefix: 'Php', placeholder: 'e.g. 500' },
    ],
  },
];

const fmt = n => Number.isFinite(n) ? n.toLocaleString('en-PH') : '—';

export default function CalculatorScreen() {
  const [selectedPhase, setSelectedPhase] = useState('landprep');
  const [landArea, setLandArea] = useState('');
  const [costInputs, setCostInputs] = useState({});

  const phase = PHASES.find(p => p.key === selectedPhase);
  const area = parseFloat(landArea) || 0;

  const setCost = (key, val) => setCostInputs(prev => ({ ...prev, [key]: val }));

  const totalBudget = useMemo(() => {
    if (!area || selectedPhase === 'landprep') {
      if (selectedPhase === 'landprep') {
        const plowing = area * 4 * (parseFloat(costInputs.tractorRate) || 0);
        const dragging = area * 2.5 * (parseFloat(costInputs.tractorRate) || 0);
        const canePoints = (area * 40000 / 10000) * (parseFloat(costInputs.caneRate) || 0);
        const laborDays = area * 12.5 * (parseFloat(costInputs.wageRate) || 0);
        return plowing + dragging + canePoints + laborDays;
      }
      return 0;
    }
    if (selectedPhase === 'fert1') {
      const bags = Math.ceil(area * 3) * (parseFloat(costInputs.bagRate1) || 0);
      const labor = area * 2.5 * (parseFloat(costInputs.wageRate) || 0);
      return bags + labor;
    }
    if (selectedPhase === 'fert2') {
      const urea = Math.ceil(area * 4) * (parseFloat(costInputs.ureaRate) || 0);
      const labor = area * 3.5 * (parseFloat(costInputs.wageRate) || 0);
      return urea + labor;
    }
    if (selectedPhase === 'fert3') {
      const urea = Math.ceil(area * 3) * (parseFloat(costInputs.ureaRate3) || 0);
      const potash = Math.ceil(area * 2) * (parseFloat(costInputs.potashRate) || 0);
      const labor = area * 3.5 * (parseFloat(costInputs.wageRate) || 0);
      return urea + potash + labor;
    }
    return 0;
  }, [area, selectedPhase, costInputs]);

  const clearAll = () => { setLandArea(''); setCostInputs({}); };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={s.pageTitle}>Resource Planner</Text>
        <Text style={s.pageSub}>Calculate materials & budget needed for each crop cycle phase.</Text>

        {/* Land Area Input */}
        <View style={s.areaCard}>
          <Ionicons name="map-outline" size={20} color={COLORS.primary} />
          <View style={s.areaBody}>
            <Text style={s.areaLabel}>Total Land Area (Hectares)</Text>
            <TextInput
              style={s.areaInput}
              value={landArea}
              onChangeText={setLandArea}
              keyboardType="decimal-pad"
              placeholder="e.g. 2.0"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
          <Text style={s.areaUnit}>Ha</Text>
        </View>

        {/* Phase Selector */}
        <Text style={s.sectionLabel}>Select Operation Phase</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.phaseScroll} contentContainerStyle={s.phaseRow}>
          {PHASES.map(p => (
            <TouchableOpacity
              key={p.key}
              style={[s.phaseChip, selectedPhase === p.key && { backgroundColor: p.color, borderColor: p.color }]}
              onPress={() => { setSelectedPhase(p.key); setCostInputs({}); }}
            >
              <Ionicons name={p.icon} size={14} color={selectedPhase === p.key ? '#fff' : p.color} />
              <Text style={[s.phaseChipText, selectedPhase === p.key && s.phaseChipTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Phase Info */}
        <View style={s.phaseInfoCard}>
          <Text style={s.phaseMonth}>{phase.month}</Text>
          <Text style={s.phaseDesc}>{phase.description}</Text>
        </View>

        {/* Material Requirements */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Material & Labor Requirements</Text>
          {area <= 0 && (
            <Text style={s.hintText}>Enter land area above to see requirements.</Text>
          )}
          {area > 0 && phase.items.map(item => {
            const result = item.isRange ? item.formula(area) : item.formula(area);
            const displayVal = item.isRange ? result : fmt(result);
            return (
              <View key={item.key} style={s.reqRow}>
                <Ionicons name={item.icon} size={16} color={COLORS.primaryLight} />
                <Text style={s.reqLabel}>{item.label}</Text>
                <Text style={s.reqVal}>
                  {displayVal}{item.unit ? ` ${item.unit}` : ''}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Cost Inputs */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Phase Budget Calculator</Text>
          <Text style={s.cardSub}>Enter your local rates to estimate total cash needed.</Text>
          {phase.costs.map(c => (
            <View key={c.key} style={s.costRow}>
              <Text style={s.costLabel}>{c.label}</Text>
              <View style={s.costInputWrap}>
                <Text style={s.costPrefix}>{c.prefix}</Text>
                <TextInput
                  style={s.costInput}
                  value={costInputs[c.key] || ''}
                  onChangeText={v => setCost(c.key, v)}
                  keyboardType="decimal-pad"
                  placeholder={c.placeholder}
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Budget Result */}
        <View style={[s.budgetCard, { backgroundColor: phase.color }]}>
          <Text style={s.budgetLabel}>Estimated Phase Budget</Text>
          <Text style={s.budgetValue}>Php {fmt(Math.round(totalBudget))}</Text>
          {area > 0 && <Text style={s.budgetSub}>For {landArea} Ha · {phase.label}</Text>}
          {totalBudget === 0 && <Text style={s.budgetHint}>Enter area and rates above to compute.</Text>}
        </View>

        <Text style={s.disclaimer}>ⓘ Estimates based on standard Negros Occidental block farm rates. Actual costs may vary by season and location.</Text>

        <TouchableOpacity style={s.clearBtn} onPress={clearAll}>
          <Ionicons name="refresh" size={15} color={COLORS.primary} />
          <Text style={s.clearBtnText}>Clear All Fields</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  pageSub: { fontSize: 13, color: COLORS.textMuted, marginTop: -6 },
  areaCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, gap: SPACING.md, ...SHADOW.card, borderWidth: 2, borderColor: COLORS.primary + '30' },
  areaBody: { flex: 1 },
  areaLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 4 },
  areaInput: { fontSize: 28, fontWeight: '800', color: COLORS.text, padding: 0 },
  areaUnit: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  phaseScroll: { marginHorizontal: -SPACING.lg },
  phaseRow: { paddingHorizontal: SPACING.lg, gap: 8 },
  phaseChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#fff' },
  phaseChipText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  phaseChipTextActive: { color: '#fff' },
  phaseInfoCard: { backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.card },
  phaseMonth: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 4 },
  phaseDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, gap: SPACING.sm, ...SHADOW.card },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  cardSub: { fontSize: 12, color: COLORS.textMuted, marginTop: -4 },
  hintText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.md },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  reqLabel: { flex: 1, fontSize: 13, color: COLORS.text, fontWeight: '500' },
  reqVal: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  costRow: { paddingVertical: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 6 },
  costLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  costInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 10, paddingVertical: 8, gap: 6 },
  costPrefix: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },
  costInput: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text, padding: 0 },
  budgetCard: { borderRadius: RADIUS.lg, padding: SPACING.xl, alignItems: 'center', gap: 6 },
  budgetLabel: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  budgetValue: { fontSize: 32, fontWeight: '800', color: '#fff' },
  budgetSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  budgetHint: { fontSize: 12, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' },
  disclaimer: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 17 },
  clearBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingVertical: 12, backgroundColor: '#fff' },
  clearBtnText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
});
