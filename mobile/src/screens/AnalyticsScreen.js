import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { SRA_PRICE_HISTORY, subscribe, getCurrentSession, MOCK_FIELDS, MOCK_LOGS } from '../data/mockData';

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

const BLOCK_FARM_COSTS = [
  { id: 'Block Farm A', costPerHa: 12400, ha: 34.5 },
  { id: 'Block Farm B', costPerHa: 14200, ha: 28.0 },
  { id: 'Block Farm C', costPerHa: 9800, ha: 45.2 },
  { id: 'Block Farm D', costPerHa: 11500, ha: 22.0 },
];

const CROP_STAGES = [
  { label: 'Land Prep', ha: 3.0, color: '#8F3A8F', icon: 'construct' },
  { label: 'Planting', ha: 5.5, color: '#4A7C2F', icon: 'leaf' },
  { label: 'Fertilizing', ha: 8.0, color: '#1A6B9A', icon: 'flask' },
  { label: 'Weeding', ha: 4.5, color: '#F5A623', icon: 'water' },
  { label: 'Harvesting', ha: 1.5, color: '#D9534F', icon: 'basket' },
];

export default function AnalyticsScreen({ navigation }) {
  const [tab, setTab] = useState('financial');
  const [selectedFieldId, setSelectedFieldId] = useState('All');
  const [showAllFields, setShowAllFields] = useState(false);
  const [showAllPills, setShowAllPills] = useState(false);
  const [priceHistory, setPriceHistory] = useState([...SRA_PRICE_HISTORY]);
  const session = getCurrentSession();
  
  const isMember = session.role === 'Member';
  const isSRA = session.role === 'SRA (Admin)';
  
  const memberFieldIds = isMember ? MOCK_FIELDS.filter(f => f.member === session.name).map(f => f.id) : [];
  const displayFieldCosts = isMember ? FIELD_COSTS.filter(fc => memberFieldIds.includes(fc.id)) : (isSRA ? BLOCK_FARM_COSTS : FIELD_COSTS);
  const dataMaxCost = Math.max(...displayFieldCosts.map(d => d.costPerHa));
  
  const rawTotalHa = isSRA ? BLOCK_FARM_COSTS.reduce((sum, s) => sum + s.ha, 0) : CROP_STAGES.reduce((sum, s) => sum + s.ha, 0);
  const rawTotalCost = isSRA ? BLOCK_FARM_COSTS.reduce((sum, s) => sum + (s.costPerHa * s.ha), 0) : COST_BREAKDOWN.reduce((sum, c) => sum + c.amount, 0);
  
  const filteredDisplayFieldCosts = (!isMember && selectedFieldId !== 'All') 
    ? displayFieldCosts.filter(fc => fc.id === selectedFieldId) 
    : displayFieldCosts;

  const displayTotalHa = isMember ? displayFieldCosts.reduce((s, f) => s + f.ha, 0) : 
    ((!isMember && selectedFieldId !== 'All') ? filteredDisplayFieldCosts.reduce((s, f) => s + f.ha, 0) : rawTotalHa);
    
  const scale = rawTotalHa > 0 ? (displayTotalHa / rawTotalHa) : 1;
  
  const displayTotalCost = selectedFieldId === 'All' 
    ? rawTotalCost 
    : filteredDisplayFieldCosts.reduce((sum, f) => sum + (f.costPerHa * f.ha), 0);
  
  const getPieShift = (id) => {
    if (id === 'Block Farm A') return [5, -3, -2, 0, 0];
    if (id === 'Block Farm B') return [-4, 5, 2, -3, 0];
    if (id === 'Block Farm C') return [2, -5, 4, -1, 0];
    if (id === 'Block Farm D') return [-3, 2, -4, 4, 1];
    if (id === 'FLD-KTR-001') return [8, -4, -4, 0, 0];
    if (id === 'FLD-KTR-003') return [-5, 8, -3, 0, 0];
    return [0, 0, 0, 0, 0];
  };

  const shift = getPieShift(selectedFieldId);
  const displayCostBreakdown = COST_BREAKDOWN.map((c, i) => {
    const newValue = c.value + shift[i];
    return {
      ...c,
      value: newValue,
      amount: displayTotalCost * (newValue / 100)
    };
  });
  
  const displayCropStages = isMember ? MOCK_FIELDS.filter(f => f.member === session.name).map(f => ({
    label: f.stage,
    ha: parseFloat(f.ha || 0),
    color: COLORS.primary,
    icon: 'leaf'
  })) : (isSRA ? CROP_STAGES.map((s, i) => {
      const stageVariance = selectedFieldId === 'All' ? 1 : 0.5 + (((selectedFieldId.charCodeAt(selectedFieldId.length - 1) + i) % 5) * 0.3);
      return {...s, ha: s.ha * scale * stageVariance};
    }) : 
    (selectedFieldId === 'All' ? CROP_STAGES : MOCK_FIELDS.filter(f => f.id === selectedFieldId).map(f => ({
      label: f.stage,
      ha: parseFloat(f.ha || 0),
      color: COLORS.primary,
      icon: 'leaf'
    })))
  );

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setPriceHistory([...SRA_PRICE_HISTORY]);
    });
    return unsubscribe;
  }, []);

  const maxPrice = Math.max(...priceHistory.map(p => p.price));
  const minPrice = Math.min(...priceHistory.map(p => p.price));

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
      <View style={{ borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: '#fff' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.md }}>
          {[
            { key: 'financial', label: 'Financial Diagnostics' },
            { key: 'crop', label: 'Crop Diagnostics' },
            { key: 'sync', label: 'Offline Sync Lag' },
          ].map(t => (
            <TouchableOpacity
              key={t.key}
              style={[s.tab, { paddingHorizontal: 16 }, tab === t.key && s.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <Text style={[s.tabText, tab === t.key && s.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* FIELD SELECTOR DISPLAY FOR FARM MANAGER & SRA (FINANCIAL TAB) */}
        {!isMember && tab === 'financial' && (
          <View style={{ marginBottom: SPACING.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.primary + '10', padding: 12, borderRadius: 8 }}>
            <View>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase' }}>Currently Viewing</Text>
              <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.text }}>{selectedFieldId === 'All' ? (isSRA ? 'All Block Farms' : 'All Block Farm Fields') : selectedFieldId}</Text>
            </View>
            {selectedFieldId !== 'All' && (
              <TouchableOpacity onPress={() => setSelectedFieldId('All')} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: COLORS.primary, borderRadius: 12 }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Reset Filter</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* FIELD SELECTOR FOR FARM MANAGER & SRA (CROP & SYNC TABS) */}
        {!isMember && (tab === 'crop' || tab === 'sync') && (
          <View style={{ marginBottom: SPACING.md }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8, textTransform: 'uppercase' }}>{isSRA ? 'Filter by Block Farm' : 'Filter by Field'}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {(() => {
                const options = ['All', ...(isSRA ? BLOCK_FARM_COSTS.map(f => f.id) : MOCK_FIELDS.map(f => f.id))];
                const displayOptions = showAllPills ? options : options.slice(0, 3);
                return displayOptions.map(id => (
                  <TouchableOpacity 
                    key={id} 
                    onPress={() => setSelectedFieldId(id)}
                    style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: selectedFieldId === id ? COLORS.primary : '#E2E8F0' }}
                  >
                    <Text style={{ color: selectedFieldId === id ? '#fff' : COLORS.text, fontWeight: '600', fontSize: 13 }}>{id === 'All' ? (isSRA ? 'All Block Farms' : 'All Block Farm Fields') : id}</Text>
                  </TouchableOpacity>
                ));
              })()}
              
              {(isSRA ? BLOCK_FARM_COSTS.length : MOCK_FIELDS.length) > 2 && (
                <TouchableOpacity 
                  onPress={() => setShowAllPills(!showAllPills)}
                  style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary }}
                >
                  <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 13 }}>{showAllPills ? 'Show Less' : 'Show More'}</Text>
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
                <Text style={s.kpiLabel}>Total Op. Cost</Text>
                <Text style={s.kpiValue}>Php {displayTotalCost >= 1000000 ? (displayTotalCost / 1000000).toFixed(2) + 'M' : (displayTotalCost / 1000).toFixed(1) + 'k'}</Text>
              </View>
              <View style={s.kpiCard}>
                <Text style={s.kpiLabel}>Avg Cost / Ha</Text>
                <Text style={s.kpiValue}>Php {displayTotalHa > 0 ? Math.round(displayTotalCost / displayTotalHa).toLocaleString() : 0}</Text>
              </View>
              <View style={s.kpiCard}>
                <Text style={s.kpiLabel}>{isSRA ? 'Active Block Farms' : 'Active Fields'}</Text>
                <Text style={s.kpiValue}>{displayFieldCosts.length}</Text>
              </View>
            </View>

            {/* Cost Breakdown Donut-style list */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Operational Cost Breakdown</Text>
              <Text style={s.cardSub}>{isMember ? 'Your fields total' : 'Block farm total'}: Php {displayTotalCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</Text>

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
                <Text style={s.cardTitle}>Cost-per-Hectare Efficiency</Text>
                <Text style={s.cardSub}>{isSRA ? 'Compare operational cost efficiency across Block Farms' : 'Compare operational cost efficiency across active fields'}</Text>
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
                      {showAllFields ? 'Show Less' : `Show All Fields (${displayFieldCosts.length})`}
                    </Text>
                  </TouchableOpacity>
                )}
                
                <View style={s.effNote}>
                  <Ionicons name="information-circle-outline" size={13} color={COLORS.blue} />
                  <Text style={s.effNoteText}>{isSRA ? 'Block Farm B has the highest average cost. Consider reviewing their aggregated reports.' : 'FLD-KTR-007 is the highest cost field. Manager may want to review its operations.'}</Text>
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
              <Text style={s.cardTitle}>Hectares by Crop Stage</Text>
              <Text style={s.cardSub}>Total: {displayTotalHa.toFixed(1)} Ha across {displayFieldCosts.length} active {isSRA ? 'block farm(s)' : 'field(s)'}</Text>

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
                  <Text style={[s.priceKpiVal, { color: COLORS.primary }]}>₱{priceHistory[priceHistory.length - 1].price.toLocaleString()}</Text>
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
                    {priceHistory.map((item, i) => {
                      const pct = ((item.price - 2300) / (2900 - 2300)) * 100;
                      const isLatest = i === priceHistory.length - 1;
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
                    {priceHistory.map((item, i) => (
                      <View key={i} style={s.priceXAxisCol}>
                        {i % 3 === 0 ? (
                          <Text style={s.priceXLabel}>{item.week}{'\n'}{item.month}</Text>
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

        {/* ════════════════════════════════════ */}
        {/* ════════════════════════════════════ */}
        {/* OFFLINE SYNC & LAG DIAGNOSTICS TAB */}
        {/* ════════════════════════════════════ */}
        {tab === 'sync' && (() => {
          // Add pseudo-random variance based on selected block farm
          const variance = selectedFieldId === 'All' ? 1 : 1 + ((selectedFieldId.charCodeAt(selectedFieldId.length - 1) % 5) * 0.25);
          const syncedItems = isMember ? session.syncedLogs : Math.round((isSRA ? 3412 : 412) * scale);
          const pendingItems = isMember ? session.pendingLogs : Math.round((isSRA ? 158 : 38) * scale * variance);
          const totalItems = syncedItems + pendingItems;
          const syncPct = totalItems === 0 ? 100 : (syncedItems / totalItems) * 100;

          return (
            <>
              <View style={s.kpiRow}>
                <View style={s.kpiCard}>
                  <Text style={s.kpiLabel}>Sync Success Rate</Text>
                  <Text style={[s.kpiValue, { color: COLORS.success }]}>{syncPct.toFixed(1)}%</Text>
                </View>
                <View style={s.kpiCard}>
                  <Text style={s.kpiLabel}>Pending Sync</Text>
                  <Text style={[s.kpiValue, { color: pendingItems > 0 ? '#D9534F' : COLORS.success }]}>{pendingItems} Logs</Text>
                </View>
              </View>

              <View style={s.card}>
                <Text style={s.cardTitle}>Offline Architecture Diagnostics</Text>
                <Text style={s.cardSub}>Local storage vs Cloud database status</Text>

                <View style={{ alignItems: 'center', marginVertical: 24 }}>
                  <View style={{ height: 120, width: 120, borderRadius: 60, borderWidth: 16, borderColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
                    {/* Simulated Donut segments */}
                    <View style={{ position: 'absolute', top: -16, left: -16, right: -16, bottom: -16, borderRadius: 76, borderWidth: 16, borderColor: COLORS.success, borderRightColor: 'transparent', borderTopColor: 'transparent', transform: [{ rotate: '-45deg' }] }} />
                    <View style={{ position: 'absolute', top: -16, left: -16, right: -16, bottom: -16, borderRadius: 76, borderWidth: 16, borderColor: COLORS.success, borderLeftColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '-45deg' }] }} />
                    {pendingItems > 0 && (
                      <View style={{ position: 'absolute', top: -16, left: -16, right: -16, bottom: -16, borderRadius: 76, borderWidth: 16, borderColor: '#D9534F', borderBottomColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: `${15 + (variance * 40)}deg` }] }} />
                    )}
                    
                    <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.text }}>{totalItems}</Text>
                    <Text style={{ fontSize: 10, color: COLORS.textMuted }}>Total Logs</Text>
                  </View>
                </View>

                <View style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success }} />
                      <Text style={{ fontSize: 14, color: COLORS.text }}>Fully Synced to Cloud</Text>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.text }}>{syncedItems}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: pendingItems > 0 ? '#D9534F' : COLORS.success }} />
                      <Text style={{ fontSize: 14, color: COLORS.text }}>Pending Offline Lag</Text>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.text }}>{pendingItems}</Text>
                  </View>
                </View>

                {pendingItems > 0 ? (
                  <View style={{ marginTop: 20, padding: 12, backgroundColor: '#FFFBF0', borderRadius: 8, borderWidth: 1, borderColor: '#FEF0D0' }}>
                    <Text style={{ fontSize: 12, color: '#A06000', fontStyle: 'italic' }}>
                      <Ionicons name="warning-outline" size={12} /> Warning: High offline lag detected. {isMember ? "Please connect to Wi-Fi to sync your logs." : "Farmers in specific zones may not have had internet access recently. Remind them to connect to Wi-Fi."}
                    </Text>
                  </View>
                ) : (
                  <View style={{ marginTop: 20, padding: 12, backgroundColor: '#F2FBF2', borderRadius: 8, borderWidth: 1, borderColor: '#E8F5E8' }}>
                    <Text style={{ fontSize: 12, color: '#267326', fontStyle: 'italic' }}>
                      <Ionicons name="checkmark-circle-outline" size={12} /> Excellent: All logs are fully synchronized with the cloud.
                    </Text>
                  </View>
                )}
              </View>
            </>
          );
        })()}

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
  priceXAxisRow: { flexDirection: 'row', gap: 2, marginTop: 6, height: 24, zIndex: 10 },
  priceXAxisCol: { flex: 1, alignItems: 'center', overflow: 'visible' },
  priceXLabel: { fontSize: 8, color: COLORS.textSecondary, fontWeight: '600', textAlign: 'center', lineHeight: 10, width: 40 },
  priceNote: { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', paddingTop: 4 },
});
