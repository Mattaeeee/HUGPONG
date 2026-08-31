import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { SRA_PRICE_HISTORY, subscribe, getCurrentSession, MOCK_FIELDS, MOCK_LOGS } from '../data/dataStore';
import { useTranslation } from '../services/i18n';

// ── 6 SRA Growth Stages Definition ─────────────────────────────
const SRA_GROWTH_STAGES = [
  { key: 'stage-1', stageNum: 1, name: 'Soil & Land Prep', short: 'Land Prep', color: '#8F3A8F', icon: 'construct', days: '0–15 Days', ops: 'Ops 1–2', keywords: ['stage 1', 'pre-planting', 'prep', 'soil', 'land', 'furrow', 'plow', 'sampling'] },
  { key: 'stage-2', stageNum: 2, name: 'Planting & Seeds', short: 'Planting', color: '#4A7C2F', icon: 'leaf', days: '15–30 Days', ops: 'Ops 3–4', keywords: ['stage 2', 'establishment', 'plant', 'patdan', 'seedcane', 'canepoint'] },
  { key: 'stage-3', stageNum: 3, name: 'Basal Nutrition', short: 'Basal Fert', color: '#1A6B9A', icon: 'flask', days: '30–45 Days', ops: 'Ops 5–6', keywords: ['stage 3', 'nutrition', 'basal', 'dap', 'phosphate', 'fertiliz', 'abono', 'early care'] },
  { key: 'stage-4', stageNum: 4, name: 'Weeding & Care', short: 'Cultivation', color: '#F5A623', icon: 'git-branch', days: '45–90 Days', ops: 'Ops 7, 10–11', keywords: ['stage 4', 'cultivation', 'weed', 'weeding', 'barring', 'off-barring'] },
  { key: 'stage-5', stageNum: 5, name: 'Top-Dress Fert', short: 'Top-Dress', color: '#0284C7', icon: 'water', days: '90–120 Days', ops: 'Ops 8–9', keywords: ['stage 5', 'maintenance', 'hilling', 'pasandig', 'top-dress', 'top dress', '2nd dose', 'drainage'] },
  { key: 'stage-6', stageNum: 6, name: 'Harvest & Milling', short: 'Harvesting', color: '#D9534F', icon: 'bus', days: '10–12 Mos', ops: 'Ops 12–14', keywords: ['stage 6', 'harvest', 'cutting', 'hauling', 'trucking', 'bull cart', 'milling', 'tapas', 'karga', 'transport'] },
];

export default function AnalyticsScreen({ navigation, route }) {
  const { t, formatStageName, formatPhaseMonth } = useTranslation();
  const [tab, setTab] = useState('overview'); // 'overview' | 'roster' (or 'logs' for member)
  const [selectedBlockFarm, setSelectedBlockFarm] = useState('All');
  const [selectedFieldId, setSelectedFieldId] = useState('All');
  const [selectedStageKey, setSelectedStageKey] = useState(null);
  const [session, setSession] = useState(getCurrentSession());

  useEffect(() => {
    if (route?.params?.blockFarm) {
      setSelectedBlockFarm(route.params.blockFarm);
      setSelectedFieldId('All');
    }
  }, [route?.params]);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setSession({ ...getCurrentSession() });
    });
    return unsubscribe;
  }, []);

  const isMember = session.role === 'Member';
  const isSRA = session.role === 'SRA (Admin)';
  const isManager = session.role === 'Farm Manager';

  // 1. Scoped Fields by Role
  const scopedFields = React.useMemo(() => {
    if (isMember) {
      const myFields = MOCK_FIELDS.filter(f => f.member === session.name);
      return myFields.length > 0 ? myFields : MOCK_FIELDS.slice(0, 1);
    }
    if (isSRA) {
      if (selectedBlockFarm === 'All') return MOCK_FIELDS;
      return MOCK_FIELDS.filter(f => (f.blockFarm || 'Nacayao Block Farm A') === selectedBlockFarm);
    }
    // Farm Manager: scoped to assigned farm
    const mgrFarm = session.farm || 'Nacayao Block Farm A';
    const mgrFields = MOCK_FIELDS.filter(f => f.blockFarm === mgrFarm);
    return mgrFields.length > 0 ? mgrFields : MOCK_FIELDS;
  }, [isMember, isSRA, selectedBlockFarm, session.name, session.farm]);

  // Block farms list for SRA filter
  const blockFarmsList = React.useMemo(() => {
    const map = {};
    MOCK_FIELDS.forEach(f => {
      const name = f.blockFarm || 'Nacayao Block Farm A';
      if (!map[name]) {
        map[name] = { name, fields: [], totalHa: 0 };
      }
      map[name].fields.push(f);
      map[name].totalHa += Number(f.ha) || 1.5;
    });
    return Object.values(map);
  }, []);

  // Active fields for current calculation
  const activeFields = React.useMemo(() => {
    if (selectedFieldId !== 'All') {
      return scopedFields.filter(f => f.id === selectedFieldId);
    }
    return scopedFields;
  }, [scopedFields, selectedFieldId]);

  const totalHa = activeFields.reduce((s, f) => s + (Number(f.ha) || 1.5), 0);

  // Cost calculations
  const { totalCost, costPerHa } = React.useMemo(() => {
    const activeFieldIds = activeFields.map(f => f.id);
    const activeLogs = MOCK_LOGS.filter(l => activeFieldIds.includes(l.fieldId));
    const cost = activeLogs.reduce((sum, l) => sum + (Number(l.totalCost || l.cost) || 0), 0);
    const ha = Math.max(totalHa, 0.1);
    return {
      totalCost: cost,
      costPerHa: Math.round(cost / ha)
    };
  }, [activeFields, totalHa]);


  // Helper: map a field to exactly one SRA stage (prevent double counting)
  const matchFieldToStageKey = (f) => {
    const stageStr = (f.stage || '').toLowerCase();
    for (let i = 1; i <= 6; i++) {
      if (stageStr.includes(`stage ${i}`) || stageStr.includes(`stage${i}`)) {
        return `stage-${i}`;
      }
    }
    for (const st of SRA_GROWTH_STAGES) {
      if (st.keywords.some(kw => stageStr.includes(kw))) {
        return st.key;
      }
    }
    return 'stage-2';
  };

  // Crop stage distribution (strictly 1 stage per field)
  const stageDistribution = React.useMemo(() => {
    return SRA_GROWTH_STAGES.map(st => {
      const matching = activeFields.filter(f => matchFieldToStageKey(f) === st.key);
      const ha = matching.reduce((s, f) => s + (Number(f.ha) || 1.5), 0);
      const pct = totalHa > 0 ? Math.round((ha / totalHa) * 100) : 0;
      return {
        ...st,
        ha,
        pct,
        count: matching.length
      };
    });
  }, [activeFields, totalHa]);

  // Member current active stage focus
  const memberCurrentStage = React.useMemo(() => {
    if (!isMember) return null;
    const myField = scopedFields[0];
    const stageKey = myField ? matchFieldToStageKey(myField) : 'stage-2';
    const stageObj = SRA_GROWTH_STAGES.find(s => s.key === stageKey) || SRA_GROWTH_STAGES[1];
    return {
      ...stageObj,
      fieldId: myField?.id || 'FLD-KTR-001',
      ha: Number(myField?.ha || 1.5),
      variety: myField?.variety || 'Phil 2006-2282',
      blockFarm: myField?.blockFarm || 'Nacayao Block Farm A'
    };
  }, [isMember, scopedFields]);

  // Member field logs for member view
  const memberLogs = React.useMemo(() => {
    if (!isMember) return [];
    const myFieldIds = scopedFields.map(f => f.id);
    return MOCK_LOGS.filter(l => myFieldIds.includes(l.fieldId));
  }, [isMember, scopedFields]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Clean Top Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={s.headerTitle}>{t('analytics_header_title', 'HUGPONG Analytics')}</Text>
          <Text style={s.headerSub}>
            {isSRA
              ? (selectedBlockFarm === 'All' ? 'District Block Farms Supervision' : `${selectedBlockFarm} Supervision`)
              : isManager
              ? `${session.farm || 'Block Farm A'} Operations`
              : `${scopedFields[0]?.id || 'Field Plot'} · ${session.name || 'Member Farmer'}`}
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Role-Specific Clean Tab Selector */}
      <View style={s.tabBarWrapper}>
        <View style={s.tabBar}>
          <TouchableOpacity
            style={[s.tab, tab === 'overview' && s.tabActive]}
            onPress={() => setTab('overview')}
            activeOpacity={0.7}
          >
            <Text style={[s.tabText, tab === 'overview' && s.tabTextActive]}>
              {isMember ? 'My Field Overview' : 'Overview & Agronomy'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, tab !== 'overview' && s.tabActive]}
            onPress={() => setTab(isMember ? 'logs' : 'roster')}
            activeOpacity={0.7}
          >
            <Text style={[s.tabText, tab !== 'overview' && s.tabTextActive]}>
              {isMember ? `Activities (${memberLogs.length})` : `Member Plots (${activeFields.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── SRA ADMIN: Minimal Sleek Block Farm Filter Pill Bar ── */}
        {isSRA && (
          <View style={s.sraFilterContainer}>
            <Text style={s.sraFilterLabel}>Block Farm Filter:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              <TouchableOpacity
                style={[s.sraPill, selectedBlockFarm === 'All' && s.sraPillActive]}
                onPress={() => { setSelectedBlockFarm('All'); setSelectedFieldId('All'); }}
                activeOpacity={0.7}
              >
                <Text style={[s.sraPillText, selectedBlockFarm === 'All' && s.sraPillTextActive]}>
                  All Districts (110.5 Ha)
                </Text>
              </TouchableOpacity>
              {blockFarmsList.map(bf => (
                <TouchableOpacity
                  key={bf.name}
                  style={[s.sraPill, selectedBlockFarm === bf.name && s.sraPillActive]}
                  onPress={() => { setSelectedBlockFarm(bf.name); setSelectedFieldId('All'); }}
                  activeOpacity={0.7}
                >
                  <Text style={[s.sraPillText, selectedBlockFarm === bf.name && s.sraPillTextActive]}>
                    {bf.name} ({bf.totalHa.toFixed(1)} Ha)
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 1: OVERVIEW & AGRONOMY (Role Tailored) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {tab === 'overview' && (
          <>

            {/* 2. Role-Dependent KPI Twin Cards (Matching Web) */}
            <View style={s.twinRow}>
              {isSRA ? (
                <>
                  <View style={s.twinCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[s.twinIconBox, { backgroundColor: '#F3E8FF' }]}>
                        <Ionicons name="cube" size={13} color="#7C3AED" />
                      </View>
                      <Text style={s.twinLabel}>Managed Area</Text>
                    </View>
                    <Text style={s.twinValue}>{selectedBlockFarm === 'All' ? '110.5 Ha' : `${totalHa.toFixed(1)} Ha`}</Text>
                    <Text style={s.twinSub}>{selectedBlockFarm === 'All' ? '4 block farms · 100% mapped' : selectedBlockFarm}</Text>
                  </View>

                  <View style={s.twinCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[s.twinIconBox, { backgroundColor: '#DCFCE7' }]}>
                        <Ionicons name="grid" size={13} color={COLORS.primary} />
                      </View>
                      <Text style={s.twinLabel}>Monitored Plots</Text>
                    </View>
                    <Text style={s.twinValue}>{selectedBlockFarm === 'All' ? '16 Plots' : `${activeFields.length} Plots`}</Text>
                    <Text style={s.twinSub}>{selectedBlockFarm === 'All' ? '16 member farmers · Active' : `${activeFields.length} active plots`}</Text>
                  </View>
                </>
              ) : isManager ? (
                <>
                  <View style={s.twinCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[s.twinIconBox, { backgroundColor: '#DCFCE7' }]}>
                        <Ionicons name="grid" size={13} color={COLORS.primary} />
                      </View>
                      <Text style={s.twinLabel}>My Field Plots</Text>
                    </View>
                    <Text style={s.twinValue}>{activeFields.length} Plots</Text>
                    <Text style={s.twinSub}>Nacayao Block Farm A</Text>
                  </View>

                  <View style={s.twinCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[s.twinIconBox, { backgroundColor: '#E0F2FE' }]}>
                        <Ionicons name="map" size={13} color="#0284C7" />
                      </View>
                      <Text style={s.twinLabel}>Cultivated Area</Text>
                    </View>
                    <Text style={s.twinValue}>{totalHa.toFixed(1)} Ha</Text>
                    <Text style={s.twinSub}>100% mapped &amp; assigned</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={s.twinCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[s.twinIconBox, { backgroundColor: '#DCFCE7' }]}>
                        <Ionicons name="location" size={13} color={COLORS.primary} />
                      </View>
                      <Text style={s.twinLabel}>My Plot</Text>
                    </View>
                    <Text style={s.twinValue}>{scopedFields[0]?.id || 'FLD-01'}</Text>
                    <Text style={s.twinSub}>{scopedFields[0]?.ha || '1.5'} Ha · {scopedFields[0]?.variety || 'Phil 84-77'}</Text>
                  </View>

                  <View style={s.twinCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[s.twinIconBox, { backgroundColor: '#FEF3C7' }]}>
                        <Ionicons name="time" size={13} color="#D97706" />
                      </View>
                      <Text style={s.twinLabel}>Active Stage</Text>
                    </View>
                    <Text style={s.twinValue} numberOfLines={1}>{scopedFields[0]?.stage ? scopedFields[0].stage.split(':')[0] : 'Stage 2'}</Text>
                    <Text style={s.twinSub}>Active Cycle 2026</Text>
                  </View>
                </>
              )}
            </View>

            {/* 3. Direct Operational Spend Summary Card (Clean Real Actuals, No Benchmarks) */}
            <View style={s.spendCard}>
              <View style={s.spendCardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <View style={s.spendIconBox}>
                    <Ionicons name="cash" size={16} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={s.spendCardTitle}>{isMember ? 'My Direct Field Expenditure' : 'Direct Operations Expenditure'}</Text>
                    <Text style={s.spendCardSub}>Real operational costs recorded on field logs</Text>
                  </View>
                </View>
                <View style={s.activePlotsPill}>
                  <Text style={s.activePlotsPillText}>{activeFields.length} {activeFields.length === 1 ? 'Plot' : 'Plots'}</Text>
                </View>
              </View>

              <View style={s.spendValueRow}>
                <Text style={s.spendMainValue}>₱ {costPerHa.toLocaleString()}</Text>
                <Text style={s.spendMainUnit}>/ Ha</Text>
              </View>

              <View style={s.spendFooterRow}>
                <Text style={s.spendFooterText}>
                  Total Recorded: <Text style={{ fontWeight: '800', color: COLORS.text }}>₱ {totalCost.toLocaleString()}</Text>
                </Text>
                <Text style={s.spendFooterSub}>{totalHa.toFixed(2)} Ha under active tracking</Text>
              </View>
            </View>

            {/* 4. Crop Cycle Section (Role Tailored) */}
            {isMember && memberCurrentStage ? (
              /* MEMBER FARMER: Sleek 6-Stage Timeline Stepper & Active Stage Focus */
              <View style={s.sectionCard}>
                <View style={s.sectionHeader}>
                  <View>
                    <Text style={s.sectionTitle}>My Field Crop Cycle Progress</Text>
                    <Text style={s.sectionSub}>SRA 6-stage agronomic cycle for {memberCurrentStage.fieldId}</Text>
                  </View>
                  <View style={[s.badgePill, { backgroundColor: `${memberCurrentStage.color}15` }]}>
                    <Text style={[s.badgePillText, { color: memberCurrentStage.color }]}>
                      Stage {memberCurrentStage.stageNum} Active
                    </Text>
                  </View>
                </View>

                {/* Horizontal 6-Stage Timeline Stepper */}
                <View style={s.timelineStepperContainer}>
                  <View style={s.timelineTrackLine} />
                  <View style={s.timelineStepsRow}>
                    {SRA_GROWTH_STAGES.map((st) => {
                      const isPassed = st.stageNum < memberCurrentStage.stageNum;
                      const isCurrent = st.stageNum === memberCurrentStage.stageNum;

                      return (
                        <View key={st.key} style={s.stepItem}>
                          <View style={[
                            s.stepCircle,
                            isPassed && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
                            isCurrent && { backgroundColor: st.color, borderColor: st.color, transform: [{ scale: 1.15 }] },
                            !isPassed && !isCurrent && { backgroundColor: '#fff', borderColor: COLORS.border }
                          ]}>
                            {isPassed ? (
                              <Ionicons name="checkmark" size={11} color="#fff" />
                            ) : (
                              <Text style={[
                                s.stepNumberText,
                                isCurrent ? { color: '#fff' } : { color: COLORS.textMuted }
                              ]}>
                                {st.stageNum}
                              </Text>
                            )}
                          </View>
                          <Text style={[
                            s.stepLabel,
                            isCurrent && { color: st.color, fontWeight: '800' }
                          ]} numberOfLines={1}>
                            {st.short}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Current Active Stage Focus Card */}
                <View style={[s.activeStageCard, { borderColor: `${memberCurrentStage.color}50` }]}>
                  <View style={[s.stageAccentStrip, { backgroundColor: memberCurrentStage.color }]} />
                  <View style={{ padding: 12, gap: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={[s.stageTag, { backgroundColor: `${memberCurrentStage.color}15` }]}>
                        <Text style={[s.stageTagText, { color: memberCurrentStage.color }]}>
                          Current: Stage {memberCurrentStage.stageNum}
                        </Text>
                      </View>
                      <View style={s.liveBadge}>
                        <View style={[s.liveDot, { backgroundColor: memberCurrentStage.color }]} />
                        <Text style={[s.liveText, { color: memberCurrentStage.color }]}>In Progress</Text>
                      </View>
                    </View>

                    <Text style={{ fontSize: 14, fontWeight: '900', color: COLORS.text }}>
                      {memberCurrentStage.name}
                    </Text>
                    <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>
                      Standard Agronomic Window: <Text style={{ fontWeight: '700', color: COLORS.text }}>{memberCurrentStage.days}</Text> ({memberCurrentStage.ops})
                    </Text>

                    <View style={{ backgroundColor: '#F8FAF5', borderRadius: RADIUS.xs, padding: 8, marginTop: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View>
                        <Text style={{ fontSize: 10, color: COLORS.textMuted }}>Assigned Land</Text>
                        <Text style={{ fontSize: 13, fontWeight: '900', color: COLORS.text }}>{memberCurrentStage.ha.toFixed(2)} Ha</Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 10, color: COLORS.textMuted }}>Crop Variety</Text>
                        <Text style={{ fontSize: 11.5, fontWeight: '800', color: COLORS.primary }}>{memberCurrentStage.variety}</Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 10, color: COLORS.textMuted }}>Cycle Progress</Text>
                        <Text style={{ fontSize: 13, fontWeight: '900', color: memberCurrentStage.color }}>
                          {Math.round((memberCurrentStage.stageNum / 6) * 100)}%
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              /* SRA & MANAGER: 2-Column Balanced Crop Cycle Stage Grid */
              <View style={s.sectionCard}>
                <View style={s.sectionHeader}>
                  <View>
                    <Text style={s.sectionTitle}>Crop Cycle Stage Distribution</Text>
                    <Text style={s.sectionSub}>6 official SRA agronomic stages · Active Cycle 2026</Text>
                  </View>
                  <View style={s.badgePill}>
                    <Text style={s.badgePillText}>{totalHa.toFixed(1)} Ha Active</Text>
                  </View>
                </View>

                <View style={s.stagesGrid}>
                  {stageDistribution.map(st => {
                    const isStageSelected = selectedStageKey === st.key;
                    return (
                      <TouchableOpacity
                        key={st.key}
                        style={[
                          s.stageCard,
                          isStageSelected && { borderColor: st.color, backgroundColor: '#FAFDF7' }
                        ]}
                        onPress={() => setSelectedStageKey(isStageSelected ? null : st.key)}
                        activeOpacity={0.7}
                      >
                        {/* Top Colored Accent Strip (Matching Web) */}
                        <View style={[s.stageAccentStrip, { backgroundColor: st.color }]} />

                        <View style={{ padding: 9, gap: 4 }}>
                          {/* Header: Stage Tag & Share % */}
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={[s.stageTag, { backgroundColor: `${st.color}15` }]}>
                              <Text style={[s.stageTagText, { color: st.color }]}>Stage {st.stageNum}</Text>
                            </View>
                            <View style={s.stagePctBadge}>
                              <Text style={s.stagePct}>{st.pct}%</Text>
                            </View>
                          </View>

                          {/* Stage Name & Timeline */}
                          <Text style={s.stageName} numberOfLines={1}>{st.name}</Text>
                          <Text style={s.stageTimeline}>{st.days}</Text>

                          {/* Bottom Stats */}
                          <View style={{ marginTop: 2, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#F0F0F0' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <Text style={[s.stageHa, { color: st.color }]}>
                                {st.ha.toFixed(1)} <Text style={{ fontSize: 10, fontWeight: '600', color: COLORS.textMuted }}>Ha</Text>
                              </Text>
                              <View style={[s.stagePlotsPill, st.count > 0 ? { backgroundColor: COLORS.primaryBg } : { backgroundColor: '#F3F4F6' }]}>
                                <Text style={[s.stagePlotsText, st.count > 0 ? { color: COLORS.primary } : { color: COLORS.textMuted }]}>
                                  {st.count} {st.count === 1 ? 'plot' : 'plots'}
                                </Text>
                              </View>
                            </View>

                            {/* Progress Track */}
                            <View style={s.stageTrack}>
                              <View style={[s.stageFill, { width: `${Math.max(st.pct, st.ha > 0 ? 10 : 0)}%`, backgroundColor: st.color }]} />
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Tapped Stage: Detailed Plot Drilldown Drawer */}
                {selectedStageKey && (
                  <View style={s.selectedStageDrawer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={s.drawerTitle}>
                        Plots in {SRA_GROWTH_STAGES.find(s => s.key === selectedStageKey)?.name || 'This Stage'}:
                      </Text>
                      <TouchableOpacity onPress={() => setSelectedStageKey(null)}>
                        <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                      </TouchableOpacity>
                    </View>
                    {activeFields.filter(f => matchFieldToStageKey(f) === selectedStageKey).length === 0 ? (
                      <Text style={{ fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic' }}>
                        No plots are currently in this stage.
                      </Text>
                    ) : (
                      activeFields.filter(f => matchFieldToStageKey(f) === selectedStageKey).map(p => (
                        <View key={p.id} style={s.drawerPlotItem}>
                          <View style={{ flex: 1 }}>
                            <Text style={s.drawerPlotId}>{p.id} · <Text style={{ fontWeight: '600', color: COLORS.textSecondary }}>{p.member || 'Member'}</Text></Text>
                            <Text style={s.drawerPlotSub}>{p.blockFarm || 'Block Farm'} · {p.variety || 'Phil 84-77'}</Text>
                          </View>
                          <Text style={s.drawerPlotHa}>{Number(p.ha || 1.5).toFixed(1)} Ha</Text>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            )}

          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 2: ROSTER / ACTIVITIES (Role Tailored) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {tab !== 'overview' && (
          <>
            {isMember ? (
              /* Member Farmer: Field Operations Log History */
              <View style={s.sectionCard}>
                <View style={s.sectionHeader}>
                  <View>
                    <Text style={s.sectionTitle}>Recorded Field Activities</Text>
                    <Text style={s.sectionSub}>Chronological logs for {scopedFields[0]?.id || 'Field Plot'}</Text>
                  </View>
                  <View style={s.badgePill}>
                    <Text style={s.badgePillText}>{memberLogs.length} Verified Logs</Text>
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  {memberLogs.length === 0 ? (
                    <View style={s.emptyBox}>
                      <Ionicons name="document-text-outline" size={24} color={COLORS.textMuted} />
                      <Text style={s.emptyText}>No operations recorded yet</Text>
                    </View>
                  ) : (
                    memberLogs.map(l => (
                      <View key={l.id} style={s.logItem}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <View style={{ flex: 1 }}>
                            <Text style={s.logActivity}>{l.activity || l.operationName || 'Field Operation'}</Text>
                            <Text style={s.logDate}>{l.date || '2026-05-18'} · {l.fieldId}</Text>
                            {l.people && (
                              <Text style={s.logMeta}>{l.people} workers · {l.inputQty || 1} {l.inputUnit || 'bags'}</Text>
                            )}
                          </View>
                          <Text style={s.logCost}>₱ {Number(l.totalCost || l.cost || 0).toLocaleString()}</Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            ) : (
              /* SRA Admin & Farm Manager: Clean Member Plots Directory */
              <View style={s.sectionCard}>
                <View style={s.sectionHeader}>
                  <View>
                    <Text style={s.sectionTitle}>Member Plots Directory</Text>
                    <Text style={s.sectionSub}>Status, cultivated area, and recorded spend per member</Text>
                  </View>
                  <View style={s.badgePill}>
                    <Text style={s.badgePillText}>{activeFields.length} Plots</Text>
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  {activeFields.map(f => {
                    const fieldLogs = MOCK_LOGS.filter(l => l.fieldId === f.id);
                    const fieldCost = fieldLogs.reduce((sum, l) => sum + (Number(l.totalCost || l.cost) || 0), 0);
                    const isSelected = selectedFieldId === f.id;

                    return (
                      <TouchableOpacity
                        key={f.id}
                        style={[
                          s.plotCard,
                          isSelected && s.plotCardSelected
                        ]}
                        onPress={() => setSelectedFieldId(selectedFieldId === f.id ? 'All' : f.id)}
                        activeOpacity={0.7}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginRight: 8 }}>
                            <View style={s.memberAvatar}>
                              <Text style={s.memberAvatarText}>
                                {(f.member || 'M').split(' ').map(n => n[0]).slice(0, 2).join('')}
                              </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={s.plotMemberName} numberOfLines={1}>{f.member || 'Member Farmer'}</Text>
                              <Text style={s.plotSubText} numberOfLines={1}>
                                {f.id} · {f.ha} Ha · {f.blockFarm || 'Block Farm'}
                              </Text>
                              <Text style={s.plotVarietyText}>
                                {f.variety || 'Sugarcane'} · {f.cycleType || 'Plant Cane'}
                              </Text>
                            </View>
                          </View>

                          <View style={{ alignItems: 'flex-end', gap: 3 }}>
                            <View style={s.plotStagePill}>
                              <Text style={s.plotStageText} numberOfLines={1}>
                                {f.stage ? f.stage.split(':')[0] : 'Stage 1'}
                              </Text>
                            </View>
                            <Text style={s.plotCost}>₱ {fieldCost.toLocaleString()}</Text>
                            <Text style={s.plotLogCount}>{fieldLogs.length} logs</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </>
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  backBtn: { padding: 6, borderRadius: RADIUS.sm },
  headerTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  headerSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 1, textAlign: 'center' },

  // Role Tab Bar
  tabBarWrapper: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tabBar: { flexDirection: 'row', paddingHorizontal: SPACING.md },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primary, fontWeight: '800' },

  scroll: { padding: 12, gap: 12, paddingBottom: 28 },

  // SRA Minimal Filter Row
  sraFilterContainer: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6
  },
  sraFilterLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase'
  },
  sraPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  sraPillActive: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primary
  },
  sraPillText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  sraPillTextActive: { color: COLORS.primary, fontWeight: '800' },

  // Status Badges
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#BBF7D0'
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#15803D'
  },
  liveText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#15803D'
  },

  // Twin Row
  twinRow: {
    flexDirection: 'row',
    gap: 10
  },
  twinCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    padding: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card,
    gap: 3
  },
  twinIconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center'
  },
  twinLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.textSecondary
  },
  twinValue: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 1
  },
  twinSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500'
  },

  // Direct Spend Card
  spendCard: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    padding: 13,
    borderWidth: 1,
    borderColor: '#DCE8CC',
    ...SHADOW.card,
    gap: 8
  },
  spendCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  spendIconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E2EED9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spendCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text
  },
  spendCardSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 0.5
  },
  activePlotsPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#BBF7D0'
  },
  activePlotsPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D'
  },
  spendValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4
  },
  spendMainValue: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.5
  },
  spendMainUnit: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted
  },
  spendFooterRow: {
    backgroundColor: '#F8FAF5',
    borderRadius: RADIUS.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  spendFooterText: {
    fontSize: 11,
    color: COLORS.textSecondary
  },
  spendFooterSub: {
    fontSize: 10,
    color: COLORS.textMuted
  },

  // Standard Section Card
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    padding: 13,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.text
  },
  sectionSub: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginTop: 1
  },
  badgePill: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: RADIUS.full
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary
  },

  // Stages Grid (2 Columns, Perfectly Balanced Across Entire Width)
  stagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginTop: 4,
  },
  stageCard: {
    width: '48.5%',
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  stageAccentStrip: {
    height: 3.5,
    width: '100%',
  },

  // Member Timeline Stepper
  timelineStepperContainer: {
    position: 'relative',
    paddingVertical: 10,
    marginVertical: 4,
  },
  timelineTrackLine: {
    position: 'absolute',
    top: 22,
    left: 20,
    right: 20,
    height: 2.5,
    backgroundColor: '#E5E7EB',
  },
  timelineStepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepItem: {
    alignItems: 'center',
    width: 46,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepNumberText: {
    fontSize: 10,
    fontWeight: '800',
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  activeStageCard: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginTop: 4,
    ...SHADOW.card,
  },
  stageTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  stageTagText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  stagePctBadge: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  stagePct: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  stageName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },
  stageTimeline: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  stageHa: {
    fontSize: 15,
    fontWeight: '900',
  },
  stagePlotsPill: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: RADIUS.xs,
  },
  stagePlotsText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  stageTrack: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginTop: 5,
    overflow: 'hidden',
  },
  stageFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Selected Stage Drawer
  selectedStageDrawer: {
    backgroundColor: '#F8FAF5',
    borderRadius: RADIUS.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DCE8CC',
    marginTop: 6,
    gap: 6,
  },
  drawerTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  drawerPlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  drawerPlotId: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.primary,
  },
  drawerPlotSub: {
    fontSize: 9.5,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  drawerPlotHa: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },


  // Member Plot Card
  plotCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  plotCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F9EB'
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4E5C7'
  },
  memberAvatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary
  },
  plotMemberName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text
  },
  plotSubText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 0.5
  },
  plotVarietyText: {
    fontSize: 9.5,
    color: COLORS.textMuted
  },
  plotStagePill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: '#C8E6C9'
  },
  plotStageText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary
  },
  plotCost: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.text
  },
  plotLogCount: {
    fontSize: 9,
    color: COLORS.textMuted
  },

  // Member Log Item
  logItem: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    padding: 9,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  logActivity: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.text
  },
  logDate: {
    fontSize: 9.5,
    color: COLORS.textMuted,
    marginTop: 1
  },
  logMeta: {
    fontSize: 9.5,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  logCost: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary
  },

  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 6
  },
  emptyText: {
    fontSize: 11,
    color: COLORS.textMuted
  }
});
