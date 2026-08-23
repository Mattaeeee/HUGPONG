import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { SRA_PRICE_HISTORY, subscribe, getCurrentSession, MOCK_FIELDS, MOCK_LOGS } from '../data/mockData';
import { useTranslation } from '../services/i18n';

const { width } = Dimensions.get('window');

// ── Mock Descriptive Data ──────────────────────────────────────────────────
// ── Category Color System ──────────────────────────────────────────────────
const STAGE_CONFIGS = [
  { key: 'prep', label: 'Land Preparation', keywords: ['land prep', 'tudling', 'arado', 'plowing', 'harrowing'], color: '#8F3A8F', icon: 'construct' },
  { key: 'plant', label: 'Planting (Patdan)', keywords: ['planting', 'patdan', 'seedling', 'cane points'], color: '#4A7C2F', icon: 'leaf' },
  { key: 'fert', label: 'Fertilization', keywords: ['fertiliz', 'urea', 'npk', 'fertilizer', 'soil'], color: '#1A6B9A', icon: 'flask' },
  { key: 'weed', label: 'Weeding & Care', keywords: ['weeding', 'hilamon', 'chemical', 'herbicide', 'spraying', 'tillering'], color: '#F5A623', icon: 'water' },
  { key: 'harvest', label: 'Harvesting (Tapas)', keywords: ['harvest', 'tapas', 'karga', 'hauling', 'milling'], color: '#D9534F', icon: 'basket' },
];

export default function AnalyticsScreen({ navigation }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState('financial');
  const [selectedFieldId, setSelectedFieldId] = useState('All');
  const [showAllFields, setShowAllFields] = useState(false);
  const [showAllPills, setShowAllPills] = useState(false);
  const [priceHistory, setPriceHistory] = useState([...SRA_PRICE_HISTORY]);
  const [session, setSession] = useState(getCurrentSession());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setPriceHistory([...SRA_PRICE_HISTORY]);
      setSession({ ...getCurrentSession() });
    });
    return unsubscribe;
  }, []);

  const isMember = session.role === 'Member';
  const isSRA = session.role === 'SRA (Admin)';

  // 1. Dynamic Scoped Fields
  const scopedFields = React.useMemo(() => {
    if (isMember) {
      return MOCK_FIELDS.filter(f => f.member === session.name);
    }
    return MOCK_FIELDS;
  }, [isMember, session.name]);

  // 2. Dynamic Field Costs Calculation
  const fieldCostsList = React.useMemo(() => {
    return scopedFields.map(f => {
      const fieldLogs = MOCK_LOGS.filter(l => l.fieldId === f.id);
      const logSum = fieldLogs.reduce((sum, l) => sum + (Number(l.cost) || 0), 0);
      const ha = Number(f.ha || 1.5);
      // If no logs yet for this plot, provide realistic standard baseline per hectare
      const totalCost = logSum > 0 ? logSum : Math.round(ha * 12800);
      const costPerHa = ha > 0 ? Math.round(totalCost / ha) : 0;
      return {
        id: f.id,
        costPerHa,
        ha,
        totalCost,
        blockFarm: f.blockFarm || 'Block Farm A',
        stage: f.stage || 'Planting (Patdan)',
        member: f.member
      };
    });
  }, [scopedFields]);

  // 3. Dynamic Block Farm Costs (for SRA macro view)
  const blockFarmCostsList = React.useMemo(() => {
    const map = new Map();
    MOCK_FIELDS.forEach(f => {
      const farm = f.blockFarm || 'Block Farm A';
      if (!map.has(farm)) {
        map.set(farm, { id: farm, ha: 0, totalCost: 0 });
      }
      const item = map.get(farm);
      const fieldLogs = MOCK_LOGS.filter(l => l.fieldId === f.id);
      const logSum = fieldLogs.reduce((sum, l) => sum + (Number(l.cost) || 0), 0);
      const ha = Number(f.ha || 1.5);
      item.ha += ha;
      item.totalCost += (logSum > 0 ? logSum : Math.round(ha * 12800));
    });

    return Array.from(map.values()).map(b => ({
      id: b.id,
      ha: Number(b.ha.toFixed(1)),
      totalCost: b.totalCost,
      costPerHa: b.ha > 0 ? Math.round(b.totalCost / b.ha) : 0
    }));
  }, []);

  const displayFieldCosts = isSRA ? blockFarmCostsList : fieldCostsList;
  const dataMaxCost = Math.max(...displayFieldCosts.map(d => d.costPerHa), 1);

  // 4. Filtering by Selected Item
  const activeFieldsForMetrics = React.useMemo(() => {
    if (selectedFieldId === 'All') return fieldCostsList;
    if (isSRA) return fieldCostsList.filter(f => f.blockFarm === selectedFieldId);
    return fieldCostsList.filter(f => f.id === selectedFieldId);
  }, [selectedFieldId, fieldCostsList, isSRA]);

  const displayTotalHa = activeFieldsForMetrics.reduce((s, f) => s + f.ha, 0);
  const displayTotalCost = activeFieldsForMetrics.reduce((s, f) => s + f.totalCost, 0);

  const getStageCategoryLabel = (key, fallback) => {
    if (key === 'prep') return t('cat_prep', fallback || 'Land Preparation');
    if (key === 'plant') return t('cat_plant', fallback || 'Planting (Patdan)');
    if (key === 'fert') return t('cat_fert', fallback || 'Fertilization');
    if (key === 'weed') return t('cat_weed', fallback || 'Weeding & Care');
    if (key === 'harvest') return t('cat_harvest', fallback || 'Harvesting (Tapas)');
    return fallback;
  };

  // 5. Dynamic Cost Breakdown by Category
  const displayCostBreakdown = React.useMemo(() => {
    const activeFieldIds = activeFieldsForMetrics.map(f => f.id);
    const activeLogs = MOCK_LOGS.filter(l => activeFieldIds.includes(l.fieldId));
    
    const catSums = {
      prep: 0,
      plant: 0,
      fert: 0,
      weed: 0,
      harvest: 0
    };

    activeLogs.forEach(l => {
      const act = (l.activity || '').toLowerCase();
      let matched = false;
      for (const cfg of STAGE_CONFIGS) {
        if (cfg.keywords.some(k => act.includes(k))) {
          catSums[cfg.key] += (Number(l.cost) || 0);
          matched = true;
          break;
        }
      }
      if (!matched) catSums.weed += (Number(l.cost) || 0);
    });

    const totalCalculated = Object.values(catSums).reduce((a, b) => a + b, 0);

    // If active logs exist, use calculated distribution; otherwise use balanced baseline split
    return STAGE_CONFIGS.map(cfg => {
      let amount = 0;
      let pct = 0;
      if (totalCalculated > 0) {
        amount = catSums[cfg.key];
        pct = Math.round((amount / totalCalculated) * 100);
      } else {
        const defaultPcts = { prep: 38, fert: 32, weed: 18, plant: 8, harvest: 4 };
        pct = defaultPcts[cfg.key] || 10;
        amount = Math.round(displayTotalCost * (pct / 100));
      }
      return {
        key: cfg.key,
        label: getStageCategoryLabel(cfg.key, cfg.label),
        value: pct,
        amount,
        color: cfg.color
      };
    });
  }, [activeFieldsForMetrics, displayTotalCost, t]);

  // 6. Dynamic Crop Stage Distribution
  const displayCropStages = React.useMemo(() => {
    return STAGE_CONFIGS.map(cfg => {
      const matchingFields = activeFieldsForMetrics.filter(f => {
        const stage = (f.stage || '').toLowerCase();
        return cfg.keywords.some(k => stage.includes(k));
      });
      const stageHa = matchingFields.reduce((sum, f) => sum + f.ha, 0);
      return {
        key: cfg.key,
        label: getStageCategoryLabel(cfg.key, cfg.label),
        ha: Number(stageHa.toFixed(1)),
        color: cfg.color,
        icon: cfg.icon
      };
    });
  }, [activeFieldsForMetrics, t]);

  const [priceTimeframe, setPriceTimeframe] = useState('weekly');

  function parsePriceTime(p) {
    if (p.timestamp) return p.timestamp;
    if (p.createdAt) {
      const t = new Date(p.createdAt).getTime();
      if (!isNaN(t)) return t;
    }
    if (p.isoDate) {
      const t = new Date(p.isoDate).getTime();
      if (!isNaN(t)) return t;
    }
    if (p.date) {
      const t = new Date(p.date).getTime();
      if (!isNaN(t)) return t;
    }
    return 0;
  }

  const sanitizedPriceHistory = React.useMemo(() => {
    const list = priceHistory.map(p => {
      let month = p.month;
      if (!month && p.date) {
        const parts = p.date.replace(',', '').trim().split(' ');
        if (parts[0] && isNaN(Number(parts[0]))) month = parts[0];
      }
      if (!month && p.week) {
        const wparts = p.week.trim().split(' ');
        if (wparts.length >= 3) month = wparts[2];
        else if (wparts.length === 2 && isNaN(Number(wparts[1]))) month = wparts[1];
      }
      if (!month && p.isoDate) {
        const d = new Date(p.isoDate);
        if (!isNaN(d.getTime())) {
          month = d.toLocaleString('en-US', { month: 'short' });
        }
      }
      return {
        ...p,
        month: month || 'Jun',
        price: (Number(p.price) > 5000 || Number(p.price) < 500) ? 2800 : Number(p.price),
        molasses: Number(p.molasses) || 4200
      };
    });

    // Chronological order: oldest -> newest
    list.sort((a, b) => parsePriceTime(a) - parsePriceTime(b));
    return list;
  }, [priceHistory]);

  const monthlyPriceHistory = React.useMemo(() => {
    const map = new Map();
    sanitizedPriceHistory.forEach(item => {
      const m = item.month || 'Jun';
      if (!map.has(m)) {
        map.set(m, { month: m, prices: [], molassesList: [] });
      }
      map.get(m).prices.push(item.price);
      if (item.molasses) map.get(m).molassesList.push(item.molasses);
    });
    return Array.from(map.values()).map(v => ({
      week: v.month,
      month: '2026',
      price: Math.round(v.prices.reduce((a, b) => a + b, 0) / (v.prices.length || 1)),
      molasses: v.molassesList.length ? Math.round(v.molassesList.reduce((a, b) => a + b, 0) / v.molassesList.length) : 4200
    }));
  }, [sanitizedPriceHistory]);

  const activePriceData = priceTimeframe === 'monthly' ? monthlyPriceHistory : sanitizedPriceHistory;
  const maxPrice = activePriceData.length > 0 ? Math.max(...activePriceData.map(p => p.price)) : 2800;
  const minPrice = activePriceData.length > 0 ? Math.min(...activePriceData.map(p => p.price)) : 2600;

  const chartMin = Math.max(1000, minPrice - 100);
  const chartMax = Math.min(4000, maxPrice + 100);
  const chartRange = (chartMax - chartMin) || 1;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('analytics_title', 'Descriptive Analytics')}</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Sync Stamp */}
      <View style={s.syncBar}>
        <Ionicons name="cloud-done-outline" size={13} color={COLORS.success} />
        <Text style={s.syncText}>{t('synced', 'Data synced')}: May 21, 2026 · 6:30 PM · Offline cached</Text>
      </View>

      {/* Tab Bar */}
      <View style={{ borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', paddingHorizontal: SPACING.md }}>
          {[
            { key: 'financial', label: t('analytics_tab_financial', 'Financial Diagnostics') },
            { key: 'crop', label: t('analytics_tab_crop', 'Crop Diagnostics') },
          ].map(t => (
            <TouchableOpacity
              key={t.key}
              style={[s.tab, { paddingHorizontal: 16 }, tab === t.key && s.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <Text style={[s.tabText, tab === t.key && s.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* FIELD SELECTOR DISPLAY FOR FARM MANAGER & SRA (FINANCIAL TAB) */}
        {!isMember && tab === 'financial' && (
          <View style={{ marginBottom: SPACING.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.primary + '10', padding: 12, borderRadius: 8 }}>
            <View>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase' }}>{t('my_field', 'Currently Viewing')}</Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.text }}>{selectedFieldId === 'All' ? (isSRA ? t('view_all_fields', 'All Block Farms') : t('my_fields', 'All Block Farm Fields')) : selectedFieldId}</Text>
            </View>
            {selectedFieldId !== 'All' && (
              <TouchableOpacity onPress={() => setSelectedFieldId('All')} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: COLORS.primary, borderRadius: 12 }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{t('btn_reset', 'Reset Filter')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* FIELD SELECTOR FOR FARM MANAGER & SRA (CROP TAB) */}
        {!isMember && tab === 'crop' && (
          <View style={{ marginBottom: SPACING.md }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8, textTransform: 'uppercase' }}>{isSRA ? t('profile_block_farm', 'Filter by Block Farm') : t('analytics_filter_field', 'Filter by Field')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {(() => {
                const options = ['All', ...(isSRA ? blockFarmCostsList.map(f => f.id) : MOCK_FIELDS.map(f => f.id))];
                const displayOptions = showAllPills ? options : options.slice(0, 3);
                return displayOptions.map(id => (
                  <TouchableOpacity 
                    key={id} 
                    onPress={() => setSelectedFieldId(id)}
                    style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: selectedFieldId === id ? COLORS.primary : '#E2E8F0' }}
                  >
                    <Text style={{ color: selectedFieldId === id ? '#fff' : COLORS.text, fontWeight: '600', fontSize: 13 }}>{id === 'All' ? (isSRA ? t('view_all_fields', 'All Block Farms') : t('my_fields', 'All Block Farm Fields')) : id}</Text>
                  </TouchableOpacity>
                ));
              })()}
              
              {(isSRA ? blockFarmCostsList.length : MOCK_FIELDS.length) > 2 && (
                <TouchableOpacity 
                  onPress={() => setShowAllPills(!showAllPills)}
                  style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary }}
                >
                  <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 13 }}>{showAllPills ? t('show_less', 'Show Less') : t('show_more', 'Show More')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ════════════════════════════════════ */}
        {/* FINANCIAL DIAGNOSTICS TAB */}
        {/* ════════════════════════════════════ */}
        {tab === 'financial' && (
          <>
            {/* Summary KPIs */}
            <View style={s.kpiRow}>
              <View style={s.kpiCard}>
                <Text style={s.kpiLabel} numberOfLines={2}>{t('stat_total_cost', 'Total Op. Cost')}</Text>
                <Text style={s.kpiValue} numberOfLines={1}>Php {displayTotalCost >= 1000000 ? (displayTotalCost / 1000000).toFixed(2) + 'M' : (displayTotalCost / 1000).toFixed(1) + 'k'}</Text>
              </View>
              <View style={s.kpiCard}>
                <Text style={s.kpiLabel} numberOfLines={2}>{t('avg_cost_ha', 'Avg Cost / Ha')}</Text>
                <Text style={s.kpiValue} numberOfLines={1}>
                  Php {(() => {
                    const avg = displayTotalHa > 0 ? Math.round(displayTotalCost / displayTotalHa) : 0;
                    return avg >= 1000000 ? (avg / 1000000).toFixed(2) + 'M' : (avg >= 100000 ? (avg / 1000).toFixed(0) + 'k' : avg.toLocaleString());
                  })()}
                </Text>
              </View>
              <View style={s.kpiCard}>
                <Text style={s.kpiLabel} numberOfLines={2}>{isSRA ? t('view_all_fields', 'Active Block Farms') : t('my_fields', 'Active Fields')}</Text>
                <Text style={s.kpiValue} numberOfLines={1}>{displayFieldCosts.length}</Text>
              </View>
            </View>

            {/* Cost Breakdown Donut-style list */}
            <View style={s.card}>
              <Text style={s.cardTitle}>{t('cost_breakdown', 'Operational Cost Breakdown')}</Text>
              <Text style={s.cardSub}>{isMember ? t('my_fields', 'Your fields total') : t('view_all_fields', 'Block farm total')}: Php {displayTotalCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</Text>

              {/* Donut Bar */}
              <View style={s.donutBar}>
                {displayCostBreakdown.map(c => (
                  <View key={c.label} style={[s.donutSegment, { flex: c.value, backgroundColor: c.color }]} />
                ))}
              </View>

              {/* Legend + Bars */}
              {displayCostBreakdown.map(c => (
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
                    <Text style={s.breakAmt}>Php {c.amount.toLocaleString('en-US', {maximumFractionDigits: 0})}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Cost per Hectare Comparison */}
            {!isMember && (
              <View style={s.card}>
                <Text style={s.cardTitle}>{t('analytics_eff_title', 'Cost-per-Hectare Efficiency')}</Text>
                <Text style={s.cardSub}>{t('analytics_eff_sub', 'Compare operational cost efficiency across active plots')}</Text>
                {(showAllFields ? displayFieldCosts : displayFieldCosts.slice(0, 3)).map(item => {
                  const pct = (item.costPerHa / dataMaxCost) * 100;
                  const isHigh = item.costPerHa === dataMaxCost;
                  const isSelected = selectedFieldId === item.id;
                  return (
                    <TouchableOpacity 
                      key={item.id} 
                      style={[s.effRow, isSelected && { backgroundColor: COLORS.primary + '10', borderRadius: 8, paddingHorizontal: 8, marginHorizontal: -8, paddingVertical: 12 }]}
                      onPress={() => setSelectedFieldId(isSelected ? 'All' : item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={s.effLeft}>
                        <Text style={[s.effId, isSelected && { color: COLORS.primary }]}>{item.id}</Text>
                        <Text style={s.effHa}>{item.ha} Ha</Text>
                      </View>
                      <View style={s.effBarWrap}>
                        <View style={[s.effBar, { width: `${pct}%`, backgroundColor: isSelected ? COLORS.primary : (isHigh ? '#D9534F' : COLORS.primary + '80') }]} />
                      </View>
                      <Text style={[s.effCost, isHigh && !isSelected && { color: '#D9534F' }, isSelected && { color: COLORS.primary, fontWeight: '800' }]}>₱{(item.costPerHa / 1000).toFixed(1)}k</Text>
                    </TouchableOpacity>
                  );
                })}
                
                {displayFieldCosts.length > 3 && (
                  <TouchableOpacity onPress={() => setShowAllFields(!showAllFields)} style={{ alignItems: 'center', paddingVertical: 8, marginTop: 4 }}>
                    <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 13 }}>
                      {showAllFields ? t('show_less', 'Show Less') : `${t('show_more', 'Show All Fields')} (${displayFieldCosts.length})`}
                    </Text>
                  </TouchableOpacity>
                )}
                
                <View style={s.effNote}>
                  <Ionicons name="information-circle-outline" size={13} color={COLORS.blue} />
                  <Text style={s.effNoteText}>{t('analytics_eff_note', 'Review field operations with high average costs.')}</Text>
                </View>
              </View>
            )}
          </>
        )}

        {/* ════════════════════════════════════ */}
        {/* CROP DIAGNOSTICS TAB */}
        {/* ════════════════════════════════════ */}
        {tab === 'crop' && (
          <>
            {/* Crop Stage Distribution */}
            <View style={s.card}>
              <Text style={s.cardTitle}>{t('analytics_stage_title', 'Hectares by Crop Stage')}</Text>
              <Text style={s.cardSub}>{t('stat_records', 'Total')}: {displayTotalHa.toFixed(1)} Ha</Text>

              {/* Stage Bar */}
              <View style={s.stageBar}>
                {displayCropStages.map((st, i) => (
                  <View key={st.label + i} style={[s.stageSegment, { flex: st.ha || 1, backgroundColor: st.color }]} />
                ))}
              </View>

              {displayCropStages.map((st, i) => (
                <View key={st.label + i} style={s.stageRow}>
                  <View style={[s.stageDot, { backgroundColor: st.color }]} />
                  <Ionicons name={st.icon} size={14} color={st.color} />
                  <Text style={s.stageLabel}>{st.label}</Text>
                  <View style={s.stageBarMini}>
                    <View style={[s.stageBarFill, { width: `${displayTotalHa > 0 ? (st.ha / displayTotalHa) * 100 : 0}%`, backgroundColor: st.color + '50' }]} />
                  </View>
                  <Text style={s.stageHa}>{st.ha.toFixed(1)} Ha</Text>
                  <Text style={s.stagePct}>{displayTotalHa > 0 ? ((st.ha / displayTotalHa) * 100).toFixed(0) : 0}%</Text>
                </View>
              ))}
            </View>

            {/* SRA Price Monitor */}
            <View style={s.card}>
              <View style={s.priceChartHeader}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={s.cardTitle}>{priceTimeframe === 'monthly' ? t('analytics_price_trajectory', 'SRA Monthly Price Trajectory') : t('analytics_price_monitor', 'SRA Weekly Price Monitor')}</Text>
                  <Text style={s.cardSub}>{priceTimeframe === 'monthly' ? 'Aggregated monthly benchmark (Php/Lkg)' : 'Raw sugar price per Lkg (Php) — Posted by SRA'}</Text>
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: COLORS.background, padding: 3, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border }}>
                  <TouchableOpacity
                    style={[{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.sm }, priceTimeframe === 'weekly' && { backgroundColor: COLORS.primary }]}
                    onPress={() => setPriceTimeframe('weekly')}
                  >
                    <Text style={[{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted }, priceTimeframe === 'weekly' && { color: '#fff' }]}>{t('time_week', 'Weekly')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.sm }, priceTimeframe === 'monthly' && { backgroundColor: COLORS.primary }]}
                    onPress={() => setPriceTimeframe('monthly')}
                  >
                    <Text style={[{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted }, priceTimeframe === 'monthly' && { color: '#fff' }]}>{t('time_month', 'Monthly')}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* KPI row */}
              <View style={s.priceKpiRow}>
                <View style={s.priceKpi}>
                  <Text style={s.priceKpiLabel}>{priceTimeframe === 'monthly' ? t('price_latest_month', 'Latest Month') : t('price_current', 'Current')}</Text>
                  <Text style={[s.priceKpiVal, { color: COLORS.primary }]}>₱{activePriceData[activePriceData.length - 1].price.toLocaleString()}</Text>
                </View>
                <View style={s.priceKpiDiv} />
                <View style={s.priceKpi}>
                  <Text style={s.priceKpiLabel}>{priceTimeframe === 'monthly' ? t('price_peak_month', 'Peak Month') : t('price_season_high', 'Season High')}</Text>
                  <Text style={[s.priceKpiVal, { color: COLORS.success }]}>₱{maxPrice.toLocaleString()}</Text>
                </View>
                <View style={s.priceKpiDiv} />
                <View style={s.priceKpi}>
                  <Text style={s.priceKpiLabel}>{priceTimeframe === 'monthly' ? t('price_lowest_month', 'Lowest Month') : t('price_season_low', 'Season Low')}</Text>
                  <Text style={[s.priceKpiVal, { color: '#D9534F' }]}>₱{minPrice.toLocaleString()}</Text>
                </View>
              </View>

                {/* Bar Chart */}
                <View style={s.priceChartWrap}>
                  <View style={s.priceYAxis}>
                    {[chartMax, Math.round((chartMax + chartMin) / 2), chartMin].map(v => (
                      <Text key={v} style={s.priceYLabel}>{(v / 1000).toFixed(1)}k</Text>
                    ))}
                  </View>
                  <View style={s.pricePlotArea}>
                    <View style={s.priceBarsRow}>
                      {activePriceData.map((item, i) => {
                        const pct = Math.min(100, Math.max(8, ((item.price - chartMin) / chartRange) * 100));
                        const isLatest = i === activePriceData.length - 1;
                        return (
                          <View key={i} style={[s.priceBarCol, priceTimeframe === 'monthly' && { flex: 1, paddingHorizontal: 16 }]}>
                            <View style={s.priceBarTrack}>
                              <View style={[s.priceBarFill, { height: `${pct}%`, backgroundColor: isLatest ? COLORS.primary : COLORS.primaryLight }]} />
                            </View>
                          </View>
                        );
                      })}
                    </View>
                    <View style={s.priceXAxisRow}>
                      {activePriceData.map((item, i) => (
                        <View key={i} style={[s.priceXAxisCol, priceTimeframe === 'monthly' && { flex: 1 }]}>
                          {priceTimeframe === 'monthly' ? (
                            <Text style={[s.priceXLabel, { fontWeight: '700' }]}>{item.week}</Text>
                          ) : (
                            i % 3 === 0 ? (
                              <Text style={s.priceXLabel}>{item.week}{'\n'}{item.month}</Text>
                            ) : null
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                <Text style={s.priceNote}>
                  {priceTimeframe === 'monthly' ? `Aggregated ${activePriceData.length} Months (${priceHistory.length} circulars)  ·  Cached offline` : 'Last updated by SRA: May 21, 2026  ·  Cached offline'}
                </Text>
              </View>
          </>
        )}

        <View style={{ height: 32 }} />

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
  kpiRow: { flexDirection: 'row', gap: 6 },
  kpiCard: { flex: 1, backgroundColor: '#fff', borderRadius: RADIUS.md, paddingVertical: SPACING.md, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center', gap: 3, ...SHADOW.card },
  kpiLabel: { fontSize: 9.5, color: COLORS.textMuted, textAlign: 'center', lineHeight: 12 },
  kpiValue: { fontSize: 13.5, fontWeight: '800', color: COLORS.text, textAlign: 'center' },

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
  priceKpiRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingVertical: SPACING.md, paddingHorizontal: SPACING.sm, gap: 4 },
  priceKpi: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  priceKpiDiv: { width: 1, backgroundColor: COLORS.border, alignSelf: 'stretch' },
  priceKpiLabel: { fontSize: 9.5, color: COLORS.textMuted, textAlign: 'center', lineHeight: 13 },
  priceKpiVal: { fontSize: 14, fontWeight: '800', marginTop: 3, textAlign: 'center' },
  priceChartWrap: { flexDirection: 'row', height: 160, marginTop: SPACING.sm },
  priceYAxis: { width: 30, justifyContent: 'space-between', height: 130 },
  priceYLabel: { fontSize: 8, color: COLORS.textMuted, textAlign: 'right' },
  pricePlotArea: { flex: 1, paddingLeft: 4, overflow: 'hidden' },
  priceBarsRow: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 130 },
  priceBarCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  priceBarTrack: { flex: 1, width: '80%', height: 130, maxHeight: 130, justifyContent: 'flex-end', overflow: 'hidden' },
  priceBarFill: { width: '100%', borderRadius: 2, minHeight: 4, maxHeight: 130 },
  priceXAxisRow: { flexDirection: 'row', gap: 2, marginTop: 6, height: 24, zIndex: 10 },
  priceXAxisCol: { flex: 1, alignItems: 'center', overflow: 'visible' },
  priceXLabel: { fontSize: 8, color: COLORS.textSecondary, fontWeight: '600', textAlign: 'center', lineHeight: 10, width: 40 },
  priceNote: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', paddingTop: 4 },
});
