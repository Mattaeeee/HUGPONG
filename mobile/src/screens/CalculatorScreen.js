import React, { useState, useMemo, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  Modal, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { MOCK_PRICE } from '../data/mockData';
import AppHeader from '../components/AppHeader';

const { height } = Dimensions.get('window');
const PRICE_PER_LKG = MOCK_PRICE.value;

const SAVED_SCENARIOS = [
  { id: 1, name: 'Sector B — Full Season', area: '2.0', yield: '118', cost: '45000', note: 'Main harvest plan', savedAt: 'May 15' },
  { id: 2, name: 'Sector A — Replant', area: '1.5', yield: '100', cost: '38000', note: 'Lower yield expected', savedAt: 'May 10' },
  { id: 3, name: 'Optimistic Scenario', area: '3.0', yield: '130', cost: '50000', note: 'Best case projection', savedAt: 'May 8' },
];

const fmt = n => 'Php ' + Math.round(n).toLocaleString('en-PH');
const fmt2 = n => n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CalculatorScreen() {
  const [mode, setMode] = useState('quick');
  const [landArea, setLandArea] = useState('');
  const [targetYield, setTargetYield] = useState('');
  const [investmentCost, setInvestmentCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [fertCost, setFertCost] = useState('');
  const [note, setNote] = useState('');
  const [noteExpanded, setNoteExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [scenarios, setScenarios] = useState(SAVED_SCENARIOS);
  const [scenarioName, setScenarioName] = useState('');
  const slideAnim = useRef(new Animated.Value(height)).current;

  const { volume, gross, expenses, netProfit } = useMemo(() => {
    const area = parseFloat(landArea) || 0;
    const yld = parseFloat(targetYield) || 0;
    const invest = parseFloat(investmentCost) || 0;
    const labor = mode === 'full' ? (parseFloat(laborCost) || 0) : 0;
    const fert = mode === 'full' ? (parseFloat(fertCost) || 0) : 0;
    const vol = area * yld;
    const gr = vol * PRICE_PER_LKG;
    const exp = (invest + labor + fert) * area;
    return { volume: vol, gross: gr, expenses: exp, netProfit: gr - exp };
  }, [landArea, targetYield, investmentCost, laborCost, fertCost, mode]);

  const openHistory = () => {
    setShowHistory(true);
    Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  };
  const closeHistory = () => {
    Animated.timing(slideAnim, { toValue: height, duration: 250, useNativeDriver: true }).start(() => setShowHistory(false));
  };

  const loadScenario = (sc) => {
    setLandArea(sc.area); setTargetYield(sc.yield);
    setInvestmentCost(sc.cost); setNote(sc.note || '');
    closeHistory();
  };

  const saveScenario = () => {
    if (!scenarioName.trim() || !landArea) return;
    setScenarios(prev => [{
      id: Date.now(), name: scenarioName,
      area: landArea, yield: targetYield, cost: investmentCost,
      note, savedAt: 'Today',
    }, ...prev]);
    setScenarioName('');
    closeHistory();
  };

  const clearAll = () => {
    setLandArea(''); setTargetYield('');
    setInvestmentCost(''); setLaborCost(''); setFertCost(''); setNote('');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader right={
        <TouchableOpacity style={s.historyBtn} onPress={openHistory}>
          <Ionicons name="time-outline" size={20} color={COLORS.text} />
          <Text style={s.historyBtnText}>History</Text>
        </TouchableOpacity>
      } />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={s.pageTitle}>Income Calculator</Text>

        {/* Market Base */}
        <View style={s.marketBar}>
          <Ionicons name="radio" size={12} color={COLORS.success} />
          <Text style={s.marketText}>  Active: HPCo – Silay  ·  </Text>
          <Text style={s.marketPrice}>Php {PRICE_PER_LKG.toLocaleString()} / Lkg</Text>
        </View>

        {/* Mode Toggle */}
        <View style={s.modeRow}>
          {[
            { key: 'quick', icon: 'flash', label: 'Quick Scratchpad' },
            { key: 'full', icon: 'document-text', label: 'Full Calculator' },
          ].map(m => (
            <TouchableOpacity key={m.key} style={[s.modeBtn, mode === m.key && s.modeBtnActive]} onPress={() => setMode(m.key)}>
              <Ionicons name={m.icon} size={14} color={mode === m.key ? '#fff' : COLORS.primary} />
              <Text style={[s.modeBtnText, mode === m.key && s.modeBtnTextActive]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inputs Card */}
        <View style={s.card}>
          {[
            { icon: 'map', label: 'Total Land Area', key: 'land', val: landArea, set: setLandArea, unit: 'Ha' },
            { icon: 'leaf', label: 'Target Yield', key: 'yield', val: targetYield, set: setTargetYield, unit: 'Lkg / Ha' },
            { icon: 'cash', label: 'Investment Cost', key: 'invest', val: investmentCost, set: setInvestmentCost, unit: '/ Ha', prefix: 'Php' },
          ].map((f, i) => (
            <View key={f.key} style={[s.inputRow, i > 0 && s.inputBorder]}>
              <Ionicons name={f.icon} size={17} color={COLORS.primaryLight} style={{ width: 24 }} />
              <Text style={s.inputLabel}>{f.label}</Text>
              <View style={s.inputRight}>
                {f.prefix && <Text style={s.inputPrefix}>{f.prefix}</Text>}
                <TextInput style={s.textInput} value={f.val} onChangeText={f.set} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={COLORS.textMuted} />
                <Text style={s.inputUnit}>{f.unit}</Text>
              </View>
            </View>
          ))}

          {/* Full mode extra fields */}
          {mode === 'full' && <>
            <View style={[s.inputRow, s.inputBorder]}>
              <Ionicons name="people" size={17} color={COLORS.primaryLight} style={{ width: 24 }} />
              <Text style={s.inputLabel}>Labor Cost</Text>
              <View style={s.inputRight}>
                <Text style={s.inputPrefix}>Php</Text>
                <TextInput style={s.textInput} value={laborCost} onChangeText={setLaborCost} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={COLORS.textMuted} />
                <Text style={s.inputUnit}>/ Ha</Text>
              </View>
            </View>
            <View style={[s.inputRow, s.inputBorder]}>
              <Ionicons name="beaker" size={17} color={COLORS.primaryLight} style={{ width: 24 }} />
              <Text style={s.inputLabel}>Fertilizer Cost</Text>
              <View style={s.inputRight}>
                <Text style={s.inputPrefix}>Php</Text>
                <TextInput style={s.textInput} value={fertCost} onChangeText={setFertCost} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={COLORS.textMuted} />
                <Text style={s.inputUnit}>/ Ha</Text>
              </View>
            </View>
          </>}
        </View>

        {/* Live Valuation Ledger */}
        <View style={s.card}>
          <Text style={s.ledgerTitle}>Live Valuation Ledger <Text style={s.ledgerSub}>(Estimated)</Text></Text>
          {[
            { icon: 'layers-outline', label: 'Total Volume', val: `${volume.toLocaleString()} Lkg` },
            { icon: 'trending-up', label: 'Gross Revenue', val: `Php ${fmt2(gross)}` },
            { icon: 'briefcase-outline', label: 'Projected Expenses', val: `Php ${fmt2(expenses)}` },
          ].map(r => (
            <View key={r.label} style={s.ledgerRow}>
              <Ionicons name={r.icon} size={15} color={COLORS.primaryLight} />
              <Text style={s.ledgerLabel}>{r.label}</Text>
              <Text style={s.ledgerVal}>{r.val}</Text>
            </View>
          ))}
        </View>

        {/* Net Profit */}
        <View style={s.netCard}>
          <Text style={s.netLabel}>Estimated Net Profit</Text>
          <Text style={s.netValue}>{fmt(netProfit)}</Text>
          {netProfit !== 0 && (
            <Text style={s.netMargin}>
              Margin: {gross > 0 ? ((netProfit / gross) * 100).toFixed(1) : 0}%
            </Text>
          )}
        </View>

        {/* Planning Notes */}
        <TouchableOpacity style={s.noteHeader} onPress={() => setNoteExpanded(e => !e)}>
          <Ionicons name="create-outline" size={16} color={COLORS.textSecondary} />
          <Text style={s.noteHeaderText}>Planning Notes</Text>
          <Ionicons name={noteExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        {noteExpanded && (
          <View style={s.card}>
            <TextInput
              style={s.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Add planning notes, assumptions, or observations..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
            />
          </View>
        )}

        <Text style={s.disclaimer}>ⓘ  Estimated calculation for planning purposes only — not actual earnings.</Text>

        <TouchableOpacity style={s.clearBtn} onPress={clearAll}>
          <Ionicons name="refresh" size={15} color={COLORS.primary} />
          <Text style={s.clearBtnText}>Clear All Fields</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── History / Saved Scenarios Bottom Sheet ── */}
      <Modal visible={showHistory} transparent animationType="none">
        <TouchableOpacity style={s.sheetOverlay} activeOpacity={1} onPress={closeHistory} />
        <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={s.sheetHandle} />
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Saved Scenarios</Text>
            <TouchableOpacity onPress={closeHistory}>
              <Ionicons name="close" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Save Current */}
          <View style={s.saveRow}>
            <TextInput
              style={s.saveInput}
              value={scenarioName}
              onChangeText={setScenarioName}
              placeholder="Name this scenario..."
              placeholderTextColor={COLORS.textMuted}
            />
            <TouchableOpacity style={s.saveBtn} onPress={saveScenario}>
              <Ionicons name="save-outline" size={16} color="#fff" />
              <Text style={s.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {scenarios.map(sc => (
              <TouchableOpacity key={sc.id} style={s.scCard} onPress={() => loadScenario(sc)}>
                <View style={s.scIcon}>
                  <Ionicons name="document-text" size={18} color={COLORS.primary} />
                </View>
                <View style={s.scBody}>
                  <Text style={s.scName}>{sc.name}</Text>
                  <Text style={s.scMeta}>{sc.area} Ha · {sc.yield} Lkg/Ha · Php {parseInt(sc.cost).toLocaleString()}/Ha</Text>
                  {sc.note ? <Text style={s.scNote}>{sc.note}</Text> : null}
                </View>
                <View style={s.scRight}>
                  <Text style={s.scDate}>{sc.savedAt}</Text>
                  <Ionicons name="chevron-forward" size={15} color={COLORS.textMuted} />
                </View>
              </TouchableOpacity>
            ))}
            <View style={{ height: 30 }} />
          </ScrollView>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  historyBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  historyBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  marketBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: 10, ...SHADOW.card },
  marketText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  marketPrice: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  modeRow: { flexDirection: 'row', gap: SPACING.sm },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: '#fff' },
  modeBtnActive: { backgroundColor: COLORS.primary },
  modeBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  modeBtnTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.card },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11 },
  inputBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  inputLabel: { flex: 1, fontSize: 14, color: COLORS.text, fontWeight: '500', marginLeft: 8 },
  inputRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  inputPrefix: { fontSize: 12, color: COLORS.textMuted },
  textInput: { minWidth: 64, textAlign: 'right', fontSize: 14, fontWeight: '700', color: COLORS.text, paddingVertical: 2, paddingHorizontal: 4 },
  inputUnit: { fontSize: 11, color: COLORS.textMuted },
  ledgerTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  ledgerSub: { fontWeight: '400', color: COLORS.textMuted, fontSize: 12 },
  ledgerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 7, borderTopWidth: 1, borderTopColor: COLORS.border },
  ledgerLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary },
  ledgerVal: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  netCard: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.xl, alignItems: 'center', gap: 4 },
  netLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  netValue: { fontSize: 32, fontWeight: '800', color: '#fff' },
  netMargin: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  noteHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md, ...SHADOW.card },
  noteHeaderText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  noteInput: { fontSize: 14, color: COLORS.text, lineHeight: 22, minHeight: 90, textAlignVertical: 'top' },
  disclaimer: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 17 },
  clearBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingVertical: 12, backgroundColor: '#fff' },
  clearBtnText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  // Sheet
  sheetOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, maxHeight: height * 0.8, paddingBottom: 24 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  saveRow: { flexDirection: 'row', gap: 8, padding: SPACING.lg, paddingBottom: SPACING.md },
  saveInput: { flex: 1, backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, color: COLORS.text },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 9 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  scCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: 13, paddingHorizontal: SPACING.lg, borderTopWidth: 1, borderTopColor: COLORS.border },
  scIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryBg, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  scBody: { flex: 1, gap: 2 },
  scName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  scMeta: { fontSize: 11, color: COLORS.textMuted },
  scNote: { fontSize: 11, color: COLORS.textSecondary, fontStyle: 'italic' },
  scRight: { alignItems: 'flex-end', gap: 2 },
  scDate: { fontSize: 10, color: COLORS.textMuted },
});
