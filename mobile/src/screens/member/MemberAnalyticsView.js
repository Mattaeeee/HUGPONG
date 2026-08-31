// ══════════════════════════════════════════════════════════════
// HUGPONG Mobile — Member Analytics View Component
// Role: Sugarcane Block Farm Member
// ══════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';
import { useTranslation } from '../../services/i18n';

export default function MemberAnalyticsView({
  session,
  myFields = [],
  myLogs = [],
  benchmarks = {}
}) {
  const { t } = useTranslation();
  const totalHa = myFields.reduce((sum, f) => sum + (Number(f.ha) || 1.5), 0);
  const totalSpent = myLogs.reduce((sum, l) => sum + (Number(l.cost || l.totalCost) || 0), 0);
  const costPerHa = totalHa > 0 ? Math.round(totalSpent / totalHa) : 0;
  const targetYield = totalHa * (benchmarks.targetYieldTonsPerHa || 60);

  return (
    <View style={s.container}>
      {/* Member Yield & Investment Card */}
      <View style={s.summaryCard}>
        <Text style={s.cardLabel}>{t('plot_perf_title', 'Plot Performance & Projections')}</Text>
        <Text style={s.cardTitle}>{myFields[0]?.id || 'FLD-KTR-001'} · {totalHa.toFixed(2)} {t('lbl_hectares', 'Hectares')}</Text>

        <View style={s.statsGrid}>
          <View style={s.statCell}>
            <Text style={s.statVal}>₱{totalSpent.toLocaleString()}</Text>
            <Text style={s.statDesc}>{t('total_logged_input', 'Total Logged Input')}</Text>
          </View>
          <View style={s.statCell}>
            <Text style={[s.statVal, { color: COLORS.primary }]}>₱{costPerHa.toLocaleString()}</Text>
            <Text style={s.statDesc}>{t('cost_per_hectare', 'Cost Per Hectare')}</Text>
          </View>
          <View style={s.statCell}>
            <Text style={[s.statVal, { color: COLORS.success }]}>{targetYield.toFixed(0)} TC</Text>
            <Text style={s.statDesc}>{t('target_harvest_tons', 'Target Harvest (Tons)')}</Text>
          </View>
          <View style={s.statCell}>
            <Text style={s.statVal}>₱66,900</Text>
            <Text style={s.statDesc}>{t('sra_direct_bench', 'SRA Direct Benchmark')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginTop: SPACING.sm },
  summaryCard: { backgroundColor: '#FFF', borderRadius: RADIUS.xl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.xs },
  cardLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', color: COLORS.textMuted },
  cardTitle: { fontSize: 15, fontWeight: '900', color: COLORS.text, marginTop: 2, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCell: { width: '48%', backgroundColor: '#F9FAF7', padding: 10, borderRadius: RADIUS.md },
  statVal: { fontSize: 16, fontWeight: '900', color: COLORS.text },
  statDesc: { fontSize: 9, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 }
});
