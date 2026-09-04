// ══════════════════════════════════════════════════════════════
// HUGPONG Mobile — Farm Manager Home View Component
// Role: Block Farm Manager
// ══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme';
import { operationLogs } from '../../data/dataStore';
import { useTranslation } from '../../services/i18n';

function ManagerHomeView({
  session = {},
  fields = [],
  navigation,
  onManualSync
}) {
  const { t, formatStageName } = useTranslation();

  const targetFarm = session?.farm || 'Nacayao Block Farm';

  const { managedFields, totalHectares, totalOperationsCount, fieldsWithRecentLogs } = React.useMemo(() => {
    const mf = fields.filter(f => f.blockFarm === targetFarm);
    const th = mf.reduce((sum, f) => sum + (Number(f.ha) || 0), 0);
    const mIds = mf.map(f => f.id);
    const toc = operationLogs.filter(l => (mIds.length === 0 || mIds.includes(l.fieldId)) && !l.isPastCycle).length;

    const fwrl = mf.map(f => {
      const fieldLogs = operationLogs.filter(l => l.fieldId === f.id && !l.isPastCycle);
      const latestLog = fieldLogs[0] || null;
      return {
        ...f,
        latestLog,
        totalFieldLogs: fieldLogs.length,
        lastActivityTime: latestLog ? (latestLog.period || latestLog.date || 'Recent') : null,
        latestOpName: latestLog ? (latestLog.operationName || latestLog.activity || 'Operation Logged') : null,
        latestOpCost: latestLog ? Number(latestLog.cost || 0) : null
      };
    }).sort((a, b) => {
      if (a.latestLog && !b.latestLog) return -1;
      if (!a.latestLog && b.latestLog) return 1;
      return 0;
    });

    return {
      managedFields: mf,
      totalHectares: th,
      totalOperationsCount: toc,
      fieldsWithRecentLogs: fwrl
    };
  }, [fields, targetFarm]);

  return (
    <View style={s.container}>
      {/* Farm Overview Card */}
      <View style={s.summaryCard}>
        <View style={s.summaryHeader}>
          <View>
            <Text style={s.farmName}>{session?.farm || 'Nacayao Block Farm'}</Text>
            <Text style={s.managerTag}>Supervising Manager: {session?.name || 'Manager'}</Text>
          </View>
          <View style={s.totalBadge}>
            <Text style={s.totalHa}>{totalHectares.toFixed(2)} Ha</Text>
            <Text style={s.totalPlots}>{managedFields.length} Member Plots</Text>
          </View>
        </View>

        <View style={s.quickStatsRow}>
          <View style={s.statBox}>
            <Text style={s.statNumber}>{managedFields.length}</Text>
            <Text style={s.statLabel}>{t('active_plots', 'Active Plots')}</Text>
          </View>
          <TouchableOpacity 
            style={s.statBox}
            onPress={() => navigation.navigate('Field Ops')}
            activeOpacity={0.7}
          >
            <Text style={[s.statNumber, { color: COLORS.primary }]}>
              {totalOperationsCount}
            </Text>
            <Text style={s.statLabel}>{t('logged_ops', 'Logged Ops')}</Text>
          </TouchableOpacity>
          <View style={s.statBox}>
            <Text style={[s.statNumber, { color: COLORS.success }]}>100%</Text>
            <Text style={s.statLabel}>{t('sync_state', 'Sync State')}</Text>
          </View>
        </View>
      </View>

      {/* Member Plots Header */}
      <View style={s.sectionHeader}>
        <View>
          <Text style={s.sectionTitle}>{t('recent_field_activity', 'Latest Field Activity & Logs')}</Text>
          <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>Sorted by most recent field operations</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Field Ops')}>
          <Text style={s.seeAllText}>{t('take_over_desk', 'Take Over Desk')} →</Text>
        </TouchableOpacity>
      </View>

      {/* Managed Fields List with Latest Logged Operation */}
      {fieldsWithRecentLogs.map(item => (
        <TouchableOpacity
          key={item.id}
          style={s.plotItem}
          onPress={() => navigation.navigate('Field Ops', { screen: 'SchedMain', params: { fieldId: item.id } })}
          activeOpacity={0.7}
        >
          <View style={{ flex: 1 }}>
            <View style={s.plotTopRow}>
              <Text style={s.plotId}>{item.id}</Text>
              <Text style={s.plotMember}>· {item.member}</Text>
              {item.latestLog && (
                <View style={s.recentBadge}>
                  <Text style={s.recentBadgeText}>{item.lastActivityTime}</Text>
                </View>
              )}
            </View>

            {item.latestLog ? (
              <View style={s.latestOpRow}>
                <Ionicons name="checkmark-circle" size={13} color={COLORS.primary} />
                <Text style={s.latestOpText} numberOfLines={1}>
                  {item.latestOpName} · <Text style={{ fontWeight: '800', color: COLORS.primary }}>₱{item.latestOpCost?.toLocaleString()}</Text>
                </Text>
              </View>
            ) : (
              <Text style={s.plotStage}>{formatStageName ? formatStageName(item.stage) : item.stage}</Text>
            )}

            <Text style={s.subMetaText}>
              {formatStageName ? formatStageName(item.stage) : item.stage} · {item.totalFieldLogs} {t('logs_recorded_count', 'logs recorded')}
            </Text>
          </View>

          <View style={s.plotRight}>
            <Text style={s.plotHa}>{item.ha} Ha</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginTop: 0 },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOW.card
  },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  farmName: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  managerTag: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  totalBadge: { alignItems: 'flex-end', backgroundColor: COLORS.primaryBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.md },
  totalHa: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  totalPlots: { fontSize: 10, fontWeight: '600', color: COLORS.primaryLight },

  quickStatsRow: { flexDirection: 'row', backgroundColor: '#F8FAF5', borderRadius: RADIUS.lg, padding: SPACING.sm },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },

  auditBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F8EC',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#C2E0B4',
    marginBottom: SPACING.md,
    ...SHADOW.card
  },
  auditBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  auditIconBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary + '35' },
  auditBannerTitle: { fontSize: 13.5, fontWeight: '800', color: COLORS.primary },
  auditBannerSub: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  seeAllText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

  plotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    ...SHADOW.card
  },
  plotTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  plotId: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  plotMember: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  recentBadge: { backgroundColor: '#F0F8EC', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  recentBadgeText: { fontSize: 9.5, fontWeight: '700', color: COLORS.primary },
  latestOpRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  latestOpText: { fontSize: 12, fontWeight: '600', color: COLORS.text, flex: 1 },
  plotStage: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  subMetaText: { fontSize: 10.5, color: COLORS.textMuted, marginTop: 2 },
  plotRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  plotHa: { fontSize: 13, fontWeight: '700', color: COLORS.primary }
});

export default React.memo(ManagerHomeView);
