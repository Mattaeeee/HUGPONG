import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Dimensions, TextInput, Alert, Platform, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import AppHeader from '../components/AppHeader';
import { subscribe, getCurrentSession, setSynced, setSession, updateSessionFieldId, getIsSynced, MOCK_ASSIGNMENT_REQUESTS, resolveAssignmentRequest, requestFieldAssignment, MOCK_FIELDS, MOCK_LOGS, DRAFT_LOGS, notifyDataUpdate, SRA_PRICE_HISTORY, addSRAPrice, MOCK_MANAGERS, updateFieldCustomStages, getMemberSyncHealth, performMobileSync, SRA_OPERATIONS_CATALOGUE, getFieldCustomOperations, saveFieldCustomOperations, MOCK_AUDIT_HISTORY, blockFarms, users, resolveFieldBlockFarm, resolveFieldMember } from '../data/dataStore';
import { enqueueOutboxItem, generateLogId, generateDraftId, generateSubItemId, generateCustomOpId } from '../services/syncEngine';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useTranslation } from '../services/i18n';
import MemberFieldOpsView from './member/MemberFieldOpsView';
import ManagerFieldOpsView from './manager/ManagerFieldOpsView';
import SRAFieldOpsView from './sra/SRAFieldOpsView';
import AuditHistoryModal from '../components/AuditHistoryModal';

const { height, width } = Dimensions.get('window');

// Official SRA Sugarcane 6 Growth Stages Templates
const CROP_CYCLE_STAGES_BY_TYPE = {
  'Plant Cane (New Plant)': [
    {
      id: 'S1',
      stageNumber: 1,
      name: 'Pre-Planting & Land Preparation',
      monthRange: 'Month 0–1',
      description: 'Soil sampling, mechanical disc plowing, harrowing, and seedbed furrowing (tudling).',
      benchmarkCost: 12100,
      icon: 'construct',
      color: '#8F3A8F',
      done: true,
      active: false,
      operations: [
        { id: 'SRA-01', name: 'Soil Sampling', costPerHa: 100, unit: 'ha' },
        { id: 'SRA-02', name: 'Land Preparation', costPerHa: 12000, unit: 'ha' }
      ]
    },
    {
      id: 'S2',
      stageNumber: 2,
      name: 'Planting & Crop Establishment',
      monthRange: 'Month 1–2',
      description: 'Cane points acquisition (patdan), hauling, selection, and furrow planting crew.',
      benchmarkCost: 20000,
      icon: 'leaf',
      color: '#4A7C2F',
      done: true,
      active: false,
      operations: [
        { id: 'SRA-03', name: 'Cost of Planting Material (Seedcane acquisition)', costPerHa: 15000, unit: 'lac' },
        { id: 'SRA-04', name: 'Planting (including hauling and selection)', costPerHa: 5000, unit: 'lac' }
      ]
    },
    {
      id: 'S3',
      stageNumber: 3,
      name: 'Basal Nutrition & Early Care',
      monthRange: 'Month 2–3',
      description: 'Basal fertilizer application (Urea+DAP+MOP), rock phosphate, and initial off-barring.',
      benchmarkCost: 20800,
      icon: 'flask',
      color: '#1A6B9A',
      done: false,
      active: true,
      operations: [
        { id: 'SRA-05', name: 'Basal Fertilization', costPerHa: 15100, unit: 'bag' },
        { id: 'SRA-06', name: 'Fertilizer Application & Soil Amending', costPerHa: 5700, unit: 'bag' }
      ]
    },
    {
      id: 'S4',
      stageNumber: 4,
      name: 'Cultivation & Weed Management',
      monthRange: 'Month 3–5',
      description: 'Ridge busting, off-barring & on-barring passes, 1st, 2nd, and 3rd round manual weeding.',
      benchmarkCost: 9000,
      icon: 'git-branch',
      color: '#F5A623',
      done: false,
      active: false,
      operations: [
        { id: 'SRA-07', name: 'Cultivation (Off-barring & On-barring)', costPerHa: 3000, unit: 'pass' },
        { id: 'SRA-10', name: 'Weeding', costPerHa: 6000, unit: 'ha' }
      ]
    },
    {
      id: 'S5',
      stageNumber: 5,
      name: 'Crop Maintenance & Final Hilling-Up',
      monthRange: 'Month 5–8',
      description: '2nd dose top-dress fertilization, final hilling-up (pasandig), and canal drainage maintenance.',
      benchmarkCost: 5000,
      icon: 'water',
      color: '#0284C7',
      done: false,
      active: false,
      operations: [
        { id: 'SRA-08', name: 'Fertilization (2nd Dose / Top-dress)', costPerHa: 3800, unit: 'bag' },
        { id: 'SRA-09', name: 'Fertilizer Application (2nd dose labor)', costPerHa: 200, unit: 'bag' },
        { id: 'SRA-11', name: 'Drainage / Irrigation', costPerHa: 1000, unit: 'ha' }
      ]
    },
    {
      id: 'S6',
      stageNumber: 6,
      name: 'Harvesting & Post-Harvest Transport',
      monthRange: 'Month 10–12',
      description: 'Cane cutting (tapas), truck loading (karga), carabao bull cart, and freight transport to sugar mill.',
      benchmarkCost: 51000,
      icon: 'bus',
      color: '#D9534F',
      done: false,
      active: false,
      operations: [
        { id: 'SRA-12', name: 'Cutting and Loading', costPerHa: 21000, unit: 'ton' },
        { id: 'SRA-13', name: 'Hauling (Trucking)', costPerHa: 21000, unit: 'ton' },
        { id: 'SRA-14', name: 'Bull Cart (In-field transport)', costPerHa: 9000, unit: 'ton' }
      ]
    }
  ],
  '1st Ratoon (Ratoon 1)': [
    {
      id: 'S1',
      stageNumber: 1,
      name: 'Pre-Planting & Land Preparation',
      monthRange: 'Month 0–1',
      description: 'Stubble shaving, trash blanketing/farming, and field clearing.',
      benchmarkCost: 4000,
      icon: 'construct',
      color: '#8F3A8F',
      done: true,
      active: false,
      operations: [
        { id: 'SRA-07', name: 'Stubble Shaving & Trash Blanketing', costPerHa: 4000, unit: 'ha' }
      ]
    },
    {
      id: 'S2',
      stageNumber: 2,
      name: 'Planting & Crop Establishment',
      monthRange: 'Month 1–2',
      description: 'Stool rehabilitation, replanting missing hills (gap filling), and seedbed loosening.',
      benchmarkCost: 6000,
      icon: 'leaf',
      color: '#4A7C2F',
      done: true,
      active: false,
      operations: [
        { id: 'SRA-04', name: 'Gap Filling & Stool Rehab', costPerHa: 6000, unit: 'ha' }
      ]
    },
    {
      id: 'S3',
      stageNumber: 3,
      name: 'Basal Nutrition & Early Care',
      monthRange: 'Month 2–3',
      description: 'Ratoon basal fertilization (Urea + DAP + MOP), off-barring & furrow cleaning.',
      benchmarkCost: 14000,
      icon: 'flask',
      color: '#1A6B9A',
      done: false,
      active: true,
      operations: [
        { id: 'SRA-05', name: 'Basal Fertilization', costPerHa: 14000, unit: 'bag' }
      ]
    },
    {
      id: 'S4',
      stageNumber: 4,
      name: 'Cultivation & Weed Management',
      monthRange: 'Month 3–5',
      description: 'Off-barring & on-barring passes, inter-row cultivation, and weeding rounds.',
      benchmarkCost: 7000,
      icon: 'git-branch',
      color: '#F5A623',
      done: false,
      active: false,
      operations: [
        { id: 'SRA-07', name: 'Cultivation (Off-barring & On-barring)', costPerHa: 3000, unit: 'pass' },
        { id: 'SRA-10', name: 'Weeding', costPerHa: 4000, unit: 'ha' }
      ]
    },
    {
      id: 'S5',
      stageNumber: 5,
      name: 'Crop Maintenance & Final Hilling-Up',
      monthRange: 'Month 5–8',
      description: '2nd dose top-dress fertilizer application, final hilling-up, and canal drainage maintenance.',
      benchmarkCost: 4500,
      icon: 'water',
      color: '#0284C7',
      done: false,
      active: false,
      operations: [
        { id: 'SRA-08', name: 'Fertilization (2nd Dose / Top-dress)', costPerHa: 3800, unit: 'bag' },
        { id: 'SRA-11', name: 'Drainage / Irrigation', costPerHa: 700, unit: 'ha' }
      ]
    },
    {
      id: 'S6',
      stageNumber: 6,
      name: 'Harvesting & Post-Harvest Transport',
      monthRange: 'Month 10–12',
      description: 'Cane cutting (tapas), truck loading (karga), and freight transport to sugar mill.',
      benchmarkCost: 48000,
      icon: 'bus',
      color: '#D9534F',
      done: false,
      active: false,
      operations: [
        { id: 'SRA-12', name: 'Cutting and Loading', costPerHa: 20000, unit: 'ton' },
        { id: 'SRA-13', name: 'Hauling (Trucking)', costPerHa: 20000, unit: 'ton' },
        { id: 'SRA-14', name: 'Bull Cart (In-field transport)', costPerHa: 8000, unit: 'ton' }
      ]
    }
  ],
  '2nd Ratoon (Ratoon 2)': [
    {
      id: 'S1',
      stageNumber: 1,
      name: 'Pre-Planting & Land Preparation',
      monthRange: 'Month 0–1',
      description: 'Stubble shaving, trash blanketing, and field clearing.',
      benchmarkCost: 4500,
      icon: 'construct',
      color: '#8F3A8F',
      done: true,
      active: false,
      operations: [
        { id: 'SRA-07', name: 'Stubble Shaving & Prep', costPerHa: 4500, unit: 'ha' }
      ]
    },
    {
      id: 'S2',
      stageNumber: 2,
      name: 'Planting & Crop Establishment',
      monthRange: 'Month 1–2',
      description: 'Stool rehabilitation, gap filling, and soil aeration.',
      benchmarkCost: 6500,
      icon: 'leaf',
      color: '#4A7C2F',
      done: true,
      active: false,
      operations: [
        { id: 'SRA-04', name: '2nd Ratoon Gap Filling', costPerHa: 6500, unit: 'ha' }
      ]
    },
    {
      id: 'S3',
      stageNumber: 3,
      name: 'Basal Nutrition & Early Care',
      monthRange: 'Month 2–3',
      description: '2nd Ratoon basal fertilization, off-barring & furrow clearing.',
      benchmarkCost: 14000,
      icon: 'flask',
      color: '#1A6B9A',
      done: false,
      active: true,
      operations: [
        { id: 'SRA-05', name: 'Basal Fertilization', costPerHa: 14000, unit: 'bag' }
      ]
    },
    {
      id: 'S4',
      stageNumber: 4,
      name: 'Cultivation & Weed Management',
      monthRange: 'Month 3–5',
      description: 'Off-barring & on-barring passes, inter-row cultivation, and weeding.',
      benchmarkCost: 7000,
      icon: 'git-branch',
      color: '#F5A623',
      done: false,
      active: false,
      operations: [
        { id: 'SRA-07', name: 'Cultivation (Off-barring & On-barring)', costPerHa: 3000, unit: 'pass' },
        { id: 'SRA-10', name: 'Weeding', costPerHa: 4000, unit: 'ha' }
      ]
    },
    {
      id: 'S5',
      stageNumber: 5,
      name: 'Crop Maintenance & Final Hilling-Up',
      monthRange: 'Month 5–8',
      description: 'Top-dress fertilization, weed management, and drainage upkeep.',
      benchmarkCost: 4500,
      icon: 'water',
      color: '#0284C7',
      done: false,
      active: false,
      operations: [
        { id: 'SRA-08', name: 'Fertilization (2nd Dose / Top-dress)', costPerHa: 3800, unit: 'bag' },
        { id: 'SRA-11', name: 'Drainage / Irrigation', costPerHa: 700, unit: 'ha' }
      ]
    },
    {
      id: 'S6',
      stageNumber: 6,
      name: 'Harvesting & Post-Harvest Transport',
      monthRange: 'Month 10–12',
      description: 'Cane cutting, hauling to mill, and cycle conclusion.',
      benchmarkCost: 48000,
      icon: 'bus',
      color: '#D9534F',
      done: false,
      active: false,
      operations: [
        { id: 'SRA-12', name: 'Cutting and Loading', costPerHa: 20000, unit: 'ton' },
        { id: 'SRA-13', name: 'Hauling (Trucking)', costPerHa: 20000, unit: 'ton' },
        { id: 'SRA-14', name: 'Bull Cart (In-field transport)', costPerHa: 8000, unit: 'ton' }
      ]
    }
  ]
};

// Preset colour palette for custom stages
const STAGE_COLORS = [
  '#8F3A8F', '#4A7C2F', '#1A6B9A', '#F5A623', '#0284C7', '#D9534F',
  '#267326', '#C97A00', '#5B4DA7', '#8A9B7A',
];

// Returns the active stage list for a field based on its active crop cycle
const getFieldStages = (fieldId) => {
  const field = MOCK_FIELDS.find(f => f.id === fieldId);
  const cycleType = field?.cycleType || 'Plant Cane (New Plant)';
  if (field?.customStages && field.customStages.length > 0) return field.customStages;
  const stages = CROP_CYCLE_STAGES_BY_TYPE[cycleType] || CROP_CYCLE_STAGES_BY_TYPE['Plant Cane (New Plant)'];
  
  const fieldStageName = (field?.stage || '').toLowerCase();
  let targetStageNum = 1;
  const stageMatch = fieldStageName.match(/stage\s*(\d+)/i);
  if (stageMatch) {
    targetStageNum = parseInt(stageMatch[1], 10);
  }

  return stages.map(s => {
    const sNum = s.stageNumber || 1;
    if (sNum < targetStageNum) {
      return { ...s, done: true, active: false };
    } else if (sNum === targetStageNum) {
      return { ...s, done: false, active: true };
    } else {
      return { ...s, done: false, active: false };
    }
  });
};

const STATUS_COLORS = { approved: COLORS.success, pending: '#F5A623', flagged: '#D9534F' };

// Memoized Log Item Card to prevent re-rendering the entire list on expand/edit
const CompactLogItem = React.memo(function CompactLogItem({
  log,
  isDraft,
  isExpanded,
  onToggleExpand,
  formatOperationName,
  formatStageName,
  t,
  editDraft,
  submitDraft,
  deleteDraft,
  editSubmittedLog,
  deleteSubmittedLog,
  canDeleteSubmitted,
  s,
}) {
  return (
    <View style={[s.compactLogCard, isDraft && { borderColor: '#F5A623', backgroundColor: '#FFFBF0' }]}>
      <TouchableOpacity
        style={s.compactLogHeader}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <View style={[s.compactLogDot, { backgroundColor: isDraft ? '#C97A00' : COLORS.primary }]} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {log.sraOperationId && (
              <View style={{ backgroundColor: COLORS.primaryBg, paddingHorizontal: 6, paddingVertical: 1.5, borderRadius: RADIUS.xs }}>
                <Text style={{ fontSize: 10, fontWeight: '900', color: COLORS.primary }}>{log.sraOperationId}</Text>
              </View>
            )}
            <Text style={s.compactLogTitle} numberOfLines={1}>
              {formatOperationName ? formatOperationName(log.operationName || log.activity) : log.operationName || log.activity}
            </Text>
          </View>
          
          {/* Connected Parent Stage Badge */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Ionicons name="git-branch-outline" size={11} color={COLORS.primary} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }} numberOfLines={1}>
              {formatStageName ? formatStageName(log.stageName || `Stage ${log.stageNumber}`, true) : log.stageName || `Stage ${log.stageNumber}`}
            </Text>
          </View>

          <Text style={[s.compactLogSub, { marginTop: 2 }]}>
            {log.date || log.period} · {log.hectares} Ha · {log.people} Workers{log.subItems?.length ? ` · ${log.subItems.length} ${t('child_items_lbl', 'Items')}` : ''}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
          <Text style={[s.compactLogCost, isDraft && { color: '#C97A00' }]}>₱{Number(log.cost || 0).toLocaleString()}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
            {log.isOffline && <Ionicons name="cloud-offline-outline" size={12} color="#C97A00" />}
            <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={14} color={COLORS.textMuted} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Expandable Details Drawer with Child Sub-Items */}
      {isExpanded && (
        <View style={s.compactLogDrawer}>
          <View style={s.compactLogDivider} />
          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>{t('operation_name_lbl', 'Operation Name')}</Text>
            <Text style={s.receiptValue}>{log.sraOperationId ? `[${log.sraOperationId}] ` : ''}{log.operationName || log.activity}</Text>
          </View>
          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>{t('connected_stage_lbl', 'Connected Stage')}</Text>
            <Text style={[s.receiptValue, { color: COLORS.primary, fontWeight: '800' }]}>
              {log.stageName || (log.stageNumber ? `Stage ${log.stageNumber}` : 'General Operation')}
            </Text>
          </View>
          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>{t('receipt_ref', 'Log Reference')}</Text>
            <Text style={s.receiptValue}>#{log.id}</Text>
          </View>
          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>{t('receipt_coverage', 'Work Coverage')}</Text>
            <Text style={s.receiptValue}>{log.hectares} {t('hectares_unit', 'Hectares')} · {log.people} {t('workers_unit', 'Workers')}</Text>
          </View>

          {/* Child Items / Materials & Inputs Breakdown */}
          {log.subItems && log.subItems.length > 0 && (
            <View style={{ backgroundColor: '#F8FAF5', padding: 10, borderRadius: RADIUS.sm, gap: 5, marginVertical: 6, borderWidth: 1, borderColor: COLORS.border }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.primary, textTransform: 'uppercase' }}>
                {t('op_children_materials_lbl', 'Operation Items & Materials')} ({log.subItems.length})
              </Text>
              {log.subItems.map((si, idx) => (
                <View key={si.id || idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: idx !== log.subItems.length - 1 ? 1 : 0, borderBottomColor: '#EDEDED', paddingVertical: 3 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text, flex: 1, marginRight: 6 }}>
                    • {si.description}
                  </Text>
                  <Text style={{ fontSize: 11.5, fontWeight: '700', color: COLORS.textSecondary }}>
                    {si.qty} {si.unit} @ ₱{Number(si.unitCost || 0).toLocaleString()} = ₱{Number(si.subTotal || 0).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {Boolean(log.inputQty) && (!log.subItems || log.subItems.length === 0) && (
            <View style={s.receiptRow}>
              <Text style={s.receiptLabel}>{t('direct_op_input_lbl', 'Direct Operation Input')}</Text>
              <Text style={s.receiptValue}>{log.inputQty} {log.inputUnit || 'ha'} {log.directRate ? `@ ₱${Number(log.directRate).toLocaleString()}/${log.inputUnit || 'ha'}` : ''}</Text>
            </View>
          )}
          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>{t('stat_total_cost', 'Total Cost')}</Text>
            <Text style={[s.receiptCostText, isDraft && { color: '#C97A00' }]}>Php {Number(log.cost || 0).toLocaleString()}</Text>
          </View>
          <View style={s.receiptRow}>
            <Text style={s.receiptLabel}>{t('form_date', 'Date Recorded')}</Text>
            <Text style={s.receiptValue}>{log.date || log.period}</Text>
          </View>
          {!isDraft && (
            <View style={s.receiptRow}>
              <Text style={s.receiptLabel}>{t('status', 'Status')}</Text>
              <View style={[s.receiptStatusBadge, { backgroundColor: log.isOffline ? '#FFFBF0' : '#F2FBF2', borderColor: log.isOffline ? '#FEF0D0' : '#E8F5E8' }]}>
                <Ionicons name={log.isOffline ? 'cloud-offline-outline' : 'checkmark-circle-outline'} size={12} color={log.isOffline ? '#C97A00' : '#267326'} />
                <Text style={[s.receiptStatusText, { fontSize: 10, color: log.isOffline ? '#C97A00' : '#267326' }]}>
                  {log.isOffline ? t('sync_status_pending', 'Saved Offline (Pending Sync)') : t('synced', 'Recorded')}
                </Text>
              </View>
            </View>
          )}

          {/* Actions inside drawer */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border }}>
            {isDraft ? (
              <>
                <TouchableOpacity
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#fff', borderWidth: 1, borderColor: '#C97A00', borderRadius: RADIUS.sm, paddingVertical: 7 }}
                  onPress={() => editDraft(log)}
                >
                  <Ionicons name="create-outline" size={14} color="#C97A00" />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#C97A00' }}>{t('btn_edit_draft', 'Edit Draft')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: COLORS.success, borderRadius: RADIUS.sm, paddingVertical: 7 }}
                  onPress={() => submitDraft(log)}
                >
                  <Ionicons name="paper-plane-outline" size={14} color="#fff" />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{t('btn_submit_draft', 'Submit Draft')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ width: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFEAEB', borderRadius: RADIUS.sm, borderWidth: 1, borderColor: '#FFD4D4' }}
                  onPress={() => deleteDraft(log.id)}
                >
                  <Ionicons name="trash-outline" size={15} color="#D9534F" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#F8FAF5', borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm, paddingVertical: 7 }}
                  onPress={() => editSubmittedLog(log)}
                >
                  <Ionicons name="create-outline" size={14} color={COLORS.primary} />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }}>
                    {t('btn_edit', 'Edit / Correct')}
                  </Text>
                </TouchableOpacity>

                {canDeleteSubmitted && (
                  <TouchableOpacity
                    style={{ flex: 0.8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FFD4D4', borderRadius: RADIUS.sm, paddingVertical: 7 }}
                    onPress={() => deleteSubmittedLog(log)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#D9534F" />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#D9534F' }}>Delete</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
});

export default function FieldOpsScreen({ navigation, route }) {
  const { t, formatSyncTime, formatOperationName, formatStageName, formatPhaseMonth } = useTranslation();
  const [activeRole, setActiveRole] = useState(getCurrentSession().role);
  const [selectedFarm, setSelectedFarm] = useState('All Block Farms');
  const [selectedField, setSelectedField] = useState(MOCK_FIELDS[0]);
  const [showAuditHistoryModal, setShowAuditHistoryModal] = useState(false);
  const [selectedManagerAuditId, setSelectedManagerAuditId] = useState('AUD-2026-05');

  useEffect(() => {
    const targetFieldId = route?.params?.fieldId || route?.params?.initialFieldId || route?.params?.takeOverFieldId;
    if (targetFieldId) {
      const targetF = MOCK_FIELDS.find(f => f.id === targetFieldId);
      if (targetF) {
        setSelectedField(targetF);
        updateSessionFieldId(targetF.id);
        if (route?.params?.isTakeOver) {
          setIsTakeOver(true);
        }
      }
    }
  }, [route?.params]);
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [showLog, setShowLog] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [logForm, setLogForm] = useState({
    id: null,
    fieldId: '',
    saveFieldId: true,
    sraOperationId: 'SRA-02',
    operationName: 'Land Preparation',
    activity: 'Land Preparation',
    category: 'prep',
    cost: '12000',
    period: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    hectares: '1.50',
    people: '2',
    subItems: [
      { id: 'SI-02-1', description: '1st Pass Disc Plowing (Tractor)', qty: 1.5, unit: 'ha', unitCost: 5000, subTotal: 7500 },
      { id: 'SI-02-2', description: '2nd Pass Disc Harrowing', qty: 1.5, unit: 'ha', unitCost: 4000, subTotal: 6000 },
      { id: 'SI-02-3', description: 'Furrowing / Tudling', qty: 1.5, unit: 'ha', unitCost: 3000, subTotal: 4500 }
    ],
    inputQty: '',
    inputUnit: 'ha',
    inputName: '',
    taskId: null,
    isSubmit: true
  });
  const [draftLogs, setDraftLogs] = useState(DRAFT_LOGS);
  const [logTab, setLogTab] = useState('submitted');
  const [managerFieldFilter, setManagerFieldFilter] = useState('my');
  const [logSearch, setLogSearch] = useState('');
  const [logCategoryFilter, setLogCategoryFilter] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [logCurrentPage, setLogCurrentPage] = useState(1);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [synced, setSyncedState] = useState(getIsSynced());

  // Automatically open the active cycle Operations Ledger modal when navigating from Analytics
  useEffect(() => {
    if (route?.params?.openLedger) {
      setLogTab('submitted');
      setShowHistoryModal(true);
      navigation.setParams({ openLedger: undefined });
    }
  }, [route?.params?.openLedger]);
  const [requests, setRequests] = useState(MOCK_ASSIGNMENT_REQUESTS);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calDate, setCalDate] = useState(new Date(2026, 4, 21));
  const [showAddField, setShowAddField] = useState(false);
  const [isTakeOver, setIsTakeOver] = useState(false);
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [fieldSearch, setFieldSearch] = useState('');
  const [fieldsModalPage, setFieldsModalPage] = useState(1);
  const [manualQR, setManualQR] = useState('');
  const [showOpPicker, setShowOpPicker] = useState(false);
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [cycleTypeForm, setCycleTypeForm] = useState({
    cycleType: 'Plant Cane (New Plant)',
    cropYear: 'CY 2025–2026'
  });
  const [showManagerAssignModal, setShowManagerAssignModal] = useState(false);
  const [managerAssignForm, setManagerAssignForm] = useState({ memberName: '', fieldId: '', ha: '' });

  const openAssignModal = (fieldToEdit = null) => {
    if (fieldToEdit) {
      setManagerAssignForm({
        userId: fieldToEdit.memberContact || fieldToEdit.userId || fieldToEdit.member || '',
        fieldId: fieldToEdit.id,
        ha: String(fieldToEdit.ha || '1.5'),
        isEditing: true
      });
    } else {
      const nextNum = MOCK_FIELDS.length + 1;
      const generatedId = `FLD-NCY-${String(nextNum).padStart(3, '0')}`;
      setManagerAssignForm({ userId: '', fieldId: generatedId, ha: '', isEditing: false });
    }
    setShowManagerAssignModal(true);
  };

  const [showStageEditor, setShowStageEditor] = useState(false);
  const [editingStages, setEditingStages] = useState([]);
  const [newStageLabel, setNewStageLabel] = useState('');
  const [newStageColor, setNewStageColor] = useState(STAGE_COLORS[0]);
  const handleGenerateAudit = () => {
    if (!synced) {
      Alert.alert('Offline Mode', 'You are currently offline. Please connect to the internet to generate reports.');
      return;
    }

    const offlineLogs = logs.filter(l => l.isOffline);
    
    if (offlineLogs.length > 0) {
      const warningMessage = `There are ${offlineLogs.length} offline logs waiting to be synced by field members. You should ask them to sync before generating the final report.`;

      Alert.alert(
        'Action Required Before Export',
        warningMessage,
        [
          { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
          { text: 'Generate Anyway', onPress: () => checkMissingFields(), style: 'destructive' }
        ]
      );
      return;
    }

    checkMissingFields();
  };

  const checkMissingFields = () => {
    const missingFields = [];
    MOCK_FIELDS.forEach(field => {
      const fieldTasks = cycleTasksByField[field.id] || [];
      const activeTask = fieldTasks.find(t => t.active);
      if (activeTask) {
        const hasLog = logs.some(l => l.fieldId === field.id && l.taskId === activeTask.id && !l.declined);
        if (!hasLog) {
          missingFields.push(field.id);
        }
      }
    });

    if (missingFields.length > 0) {
      Alert.alert(
        'Incomplete Logs Warning',
        `Operation logs are incomplete! The following fields are missing a log for their current active stage:\n\n${missingFields.join('\n')}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Generate Anyway', onPress: () => setShowQR(true), style: 'destructive' }
        ]
      );
    } else {
      setShowQR(true);
    }
  };
  const [reqFieldId, setReqFieldId] = useState('');
  const [reqFieldHa, setReqFieldHa] = useState('');
  const [cycleTasksByField, setCycleTasksByField] = useState(() => {
    const initial = {};
    MOCK_FIELDS.forEach(f => {
      initial[f.id] = getFieldStages(f.id);
    });
    return initial;
  });
  const openOperationLog = (targetTask, sraOpId) => {
    const stageNum = targetTask?.stageNumber || 1;
    const customOps = getFieldCustomOperations(selectedField.id, stageNum);
    const targetOp = customOps.find(o => o.id === sraOpId) || SRA_OPERATIONS_CATALOGUE.find(o => o.id === sraOpId) || SRA_OPERATIONS_CATALOGUE.find(o => o.name === targetTask?.name) || SRA_OPERATIONS_CATALOGUE[1];
    const haVal = parseFloat(selectedField.ha || '1.5') || 1.0;
    const isGrp = targetOp.isGroup ?? (targetOp.inputType === 'group' || (targetOp.subItems && targetOp.subItems.length > 1));

    let initialSubItems = [];
    let totalCost = 0;
    let directQty = '';
    let directUnit = targetOp.unit || 'ha';
    let directRate = targetOp.rate || targetOp.costPerHa || 0;

    if (isGrp) {
      initialSubItems = (targetOp.subItems || []).map((si, idx) => {
        const scaledQty = Number(((si.qty || 1) * (si.unit === 'lac' || si.unit === 'pass' || si.unit === 'ha' || si.unit === 'ton' ? haVal : 1)).toFixed(1));
        const subTotal = Math.round(scaledQty * (si.unitCost || si.rate || 0));
        return {
          id: generateSubItemId(targetOp.id || 'OP', idx),
          description: si.description || si.name,
          qty: scaledQty,
          unit: si.unit || 'bag',
          unitCost: si.unitCost || si.rate || 0,
          subTotal: subTotal
        };
      });
      totalCost = initialSubItems.reduce((sum, item) => sum + item.subTotal, 0);
    } else {
      const scaledDirectQty = Number(((targetOp.perHa || 1) * haVal).toFixed(1));
      directQty = String(scaledDirectQty);
      directRate = targetOp.rate || targetOp.costPerHa || 0;
      totalCost = Math.round(scaledDirectQty * directRate);
    }

    setLogForm({
      id: null,
      fieldId: selectedField.id,
      saveFieldId: true,
      stageNumber: stageNum,
      stageName: targetTask?.name || targetOp.stageName || `Stage ${stageNum}`,
      sraOperationId: targetOp.id || 'CUSTOM',
      operationName: targetOp.name,
      activity: targetOp.name,
      category: targetOp.category || 'prep',
      isGroup: isGrp,
      inputType: isGrp ? 'group' : 'direct',
      cost: String(totalCost),
      directRate: String(directRate),
      period: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      hectares: selectedField.ha || '1.5',
      people: '2',
      subItems: initialSubItems,
      inputQty: directQty,
      inputUnit: directUnit,
      inputName: !isGrp ? targetOp.name : '',
      taskId: targetTask?.id || `S${stageNum}`,
      isSubmit: true
    });
    setShowOpPicker(false);
    setShowLog(true);
  };

  const toggleTaskStatus = (taskId, forceComplete = false) => {
    if (activeRole === 'SRA (Admin)') return;
    
    const session = getCurrentSession();
    const isMyField = selectedField.member === session.name;
    if (activeRole === 'Farm Manager' && !isMyField && !isTakeOver) {
      Alert.alert(
        'Supervisor Takeover Required',
        'This field is managed by ' + selectedField.member + '. To record stage work or make changes, please tap "Take Over Field" on the field card first.'
      );
      return;
    }

    const fieldTasks = cycleTasksByField[selectedField.id] || getFieldStages(selectedField.id);
    const taskIndex = fieldTasks.findIndex(t => t.id === taskId);
    const targetTask = fieldTasks[taskIndex];
    if (!targetTask) return;

    const applyToggle = () => {
      const currentTasks = cycleTasksByField[selectedField.id] || getFieldStages(selectedField.id);
      const updated = currentTasks.map(t => {
        if (t.id === taskId) {
          if (forceComplete) return { ...t, done: true, active: false };
          if (t.done) return { ...t, done: false, active: false };
          if (t.active) return { ...t, done: true, active: false };
          return { ...t, done: false, active: true };
        }
        if (!targetTask.active && !targetTask.done && t.active && !forceComplete) {
          return { ...t, active: false };
        }
        return t;
      });

      let isFullyCompleted = false;
      if (targetTask.active || forceComplete) {
        updated.forEach(t => t.active = false);
        const nextIndex = updated.findIndex(t => !t.done);
        if (nextIndex === -1) {
          isFullyCompleted = true;
        } else {
          updated[nextIndex].active = true;
        }
      }

      const activeTask = updated.find(t => t.active);
      const newStageLabel = activeTask ? (activeTask.name || activeTask.label) : (isFullyCompleted ? 'Harvesting & Milling (Completed)' : 'Waiting for Next Stage');
      
      setSelectedField(prevF => ({ ...prevF, stage: newStageLabel }));
      const mf = MOCK_FIELDS.find(f => f.id === selectedField.id);
      if (mf) mf.stage = newStageLabel;

      setCycleTasksByField(prev => ({ ...prev, [selectedField.id]: updated }));

      if (isFullyCompleted) {
        setTimeout(() => {
          Alert.alert(
            'Crop Cycle Completed!',
            'All 5 stages for this field cycle are complete. Would you like to start a new crop cycle?',
            [
              { text: 'Not Now', style: 'cancel' },
              { text: 'Start New Cycle', style: 'default', onPress: () => {
                 const resetStages = getFieldStages(selectedField.id).map((t) => ({...t, done: false, active: false}));
                 resetStages[0].active = true;
                 setCycleTasksByField(p => ({
                   ...p,
                   [selectedField.id]: resetStages
                 }));
                 setSelectedField(prevF => ({ ...prevF, stage: resetStages[0].name }));
                 const resetMf = MOCK_FIELDS.find(f => f.id === selectedField.id);
                 if (resetMf) resetMf.stage = resetStages[0].name;
                 
                 // Mark logs as past cycle instead of deleting
                 MOCK_LOGS.forEach(l => {
                   if (l.fieldId === selectedField.id) l.isPastCycle = true;
                 });
                 setLogs([...MOCK_LOGS]);
                 
                 // Drafts from previous cycle can be safely removed
                 setDraftLogs(prev => prev.filter(d => d.fieldId !== selectedField.id));
              }}
            ]
          );
        }, 500);
      }
    };

    const isProgressing = !targetTask.done;
    
    if (isProgressing && taskIndex > 0) {
      const hasPendingPrior = fieldTasks.slice(0, taskIndex).some(t => !t.done);
      if (hasPendingPrior) {
        if (activeRole === 'Member') {
          Alert.alert('Action Denied', 'You cannot skip ahead. Please submit logs and mark the previous stages as complete first.');
          return;
        }
        const priorTask = fieldTasks[taskIndex - 1];
        const hasPriorLogs = logs.some(l => l.fieldId === selectedField.id && (l.taskId === priorTask?.id || l.stageNumber === priorTask?.stageNumber) && !l.isPastCycle);
        const priorMsg = hasPriorLogs 
          ? 'Previous stages are not yet marked done. Are you sure you want to jump ahead?' 
          : `Notice: Stage ${priorTask?.stageNumber || taskIndex} has no operations recorded yet. Are you sure you want to skip ahead without logging previous work?`;
        Alert.alert(
          'Skip Stage Warning',
          priorMsg,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes, Skip Ahead', onPress: applyToggle, style: 'destructive' }
          ]
        );
        return;
      }
    } 

    if (!targetTask.active && !targetTask.done && !forceComplete) {
       Alert.alert(
         'Activate Stage',
         `Start working on Stage ${targetTask.stageNumber || taskIndex + 1}: "${targetTask.name || targetTask.label}"?`,
         [
           { text: 'Cancel', style: 'cancel' },
           { text: 'Activate', onPress: applyToggle, style: 'default' }
         ]
       );
       return;
    }

    if (targetTask.active && !forceComplete) {
      const stageNum = targetTask.stageNumber || taskIndex + 1;
      const stageDrafts = draftLogs.filter(d => (d.taskId === targetTask.id || d.stageNumber === stageNum) && d.fieldId === selectedField.id);
      if (stageDrafts.length > 0) {
        editDraft(stageDrafts[0]);
      } else {
        const stageOps = getFieldCustomOperations(selectedField.id, stageNum);

        // Find the first operation in this stage that hasn't been recorded yet
        const nextPendingOp = stageOps.find(op => !logs.some(l => 
          l.fieldId === selectedField.id && 
          (l.operationName === op.name || l.sraOperationId === op.id || l.activity === op.name) && 
          (l.stageNumber === stageNum || l.taskId === targetTask.id) && 
          !l.isPastCycle
        ));

        const targetOpToOpen = nextPendingOp || stageOps[0] || (targetTask.operations && targetTask.operations[0]) || { id: 'SRA-02' };
        openOperationLog(targetTask, targetOpToOpen.id);
      }
      return;
    } else if (!isProgressing) {
      if (activeRole === 'Member') {
        Alert.alert('Action Denied', 'Members cannot revert completed stages. Please contact your Farm Manager if you made a mistake.');
        return;
      }
      const hasSubmittedLogs = logs.some(l => l.fieldId === selectedField.id && l.taskId === taskId);
      if (hasSubmittedLogs) {
        Alert.alert('Cannot Revert', 'This stage already has submitted logs. Please delete or decline them first before reverting.');
        return;
      }
      Alert.alert(
        'Revert Stage',
        'Are you sure you want to revert this completed stage back to pending?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes, Revert', onPress: applyToggle, style: 'destructive' }
        ]
      );
      return;
    }

    applyToggle();
  };

  useEffect(() => {
    // Initial sync
    const initialSession = getCurrentSession();
    if (initialSession.fieldId) {
      const found = MOCK_FIELDS.find(f => f.id === initialSession.fieldId);
      if (found) {
        setSelectedField(found);
      } else {
        setSelectedField(MOCK_FIELDS[0]);
      }
    } else {
      setSelectedField(MOCK_FIELDS[0]);
    }
    const unsubscribe = subscribe(() => {
      const session = getCurrentSession();
      setActiveRole(session.role);
      if (session.fieldId) {
        const found = MOCK_FIELDS.find(f => f.id === session.fieldId);
        if (found) {
          setSelectedField(found);
        } else {
          setSelectedField(prev => prev || MOCK_FIELDS[0]);
        }
      }
      setSyncedState(getIsSynced());
      setRequests([...MOCK_ASSIGNMENT_REQUESTS]);
      setLogs([...MOCK_LOGS]);
      setDraftLogs([...DRAFT_LOGS]);
    });
    return unsubscribe;
  }, []);

  const handleRequestField = () => {
    if (!reqFieldId.trim() || !reqFieldHa.trim()) {
      Alert.alert('Required', 'Please enter a Field ID and Hectares (HA).');
      return;
    }
    const haValue = parseFloat(reqFieldHa);
    if (isNaN(haValue) || haValue <= 0 || haValue > 100) {
      Alert.alert('Invalid', 'Please enter a valid hectare size (between 0.1 and 100).');
      return;
    }
    requestFieldAssignment(reqFieldId.trim().toUpperCase(), getCurrentSession().name, haValue.toFixed(1));
    Alert.alert('Request Sent', `Assignment request for ${reqFieldId.toUpperCase()} (${haValue.toFixed(1)} Ha) has been sent to the Farm Manager for approval.`);
    setReqFieldId('');
    setReqFieldHa('');
    setShowAddField(false);
  };

  const selectSraOperation = (opId, ha = null) => {
    const op = SRA_OPERATIONS_CATALOGUE.find(o => o.id === opId) || SRA_OPERATIONS_CATALOGUE[0];
    const haVal = parseFloat(ha || logForm.hectares || selectedField.ha || '1.5') || 1.0;
    const scaledSubItems = op.subItems.map((si, idx) => {
      const baseQty = si.qty;
      const scaledQty = Number((baseQty * (si.unit === 'lac' || si.unit === 'pass' || si.unit === 'ha' || si.unit === 'ton' ? haVal : 1)).toFixed(1));
      const subTotal = Math.round(scaledQty * si.unitCost);
      return {
        id: generateSubItemId(op.id, idx),
        description: si.description,
        qty: scaledQty,
        unit: si.unit,
        unitCost: si.unitCost,
        subTotal: subTotal
      };
    });
    const totalCost = scaledSubItems.reduce((sum, item) => sum + (Number(item.subTotal) || 0), 0);
    setLogForm(prev => ({
      ...prev,
      sraOperationId: op.id,
      operationName: op.name,
      activity: op.name,
      category: op.category,
      subItems: scaledSubItems,
      cost: String(totalCost),
    }));
  };

  const addCustomSubItem = () => {
    const nextIdx = (logForm.subItems || []).length;
    const newItem = {
      id: generateSubItemId(logForm.sraOperationId || 'CUST', nextIdx),
      description: '',
      qty: 1,
      unit: 'days',
      unitCost: 500,
      subTotal: 500
    };
    setLogForm(prev => {
      const updated = [...(prev.subItems || []), newItem];
      const totalCost = updated.reduce((sum, item) => sum + (Number(item.subTotal) || 0), 0);
      return {
        ...prev,
        subItems: updated,
        cost: String(totalCost)
      };
    });
  };

  const updateSubItemRow = (index, field, value) => {
    setLogForm(prev => {
      const updated = [...(prev.subItems || [])];
      if (!updated[index]) return prev;
      const item = { ...updated[index], [field]: value };
      if (field === 'qty' || field === 'unitCost') {
        const q = parseFloat(item.qty) || 0;
        const uc = parseFloat(item.unitCost) || 0;
        item.subTotal = Math.round(q * uc);
      }
      updated[index] = item;
      const totalCost = updated.reduce((sum, it) => sum + (Number(it.subTotal) || 0), 0);
      return {
        ...prev,
        subItems: updated,
        cost: String(totalCost)
      };
    });
  };

  const removeSubItemRow = (index) => {
    setLogForm(prev => {
      const updated = (prev.subItems || []).filter((_, i) => i !== index);
      const totalCost = updated.reduce((sum, it) => sum + (Number(it.subTotal) || 0), 0);
      return {
        ...prev,
        subItems: updated,
        cost: String(totalCost)
      };
    });
  };

  const openLog = (opId = 'SRA-02') => {
    const targetOp = SRA_OPERATIONS_CATALOGUE.find(o => o.id === opId) || SRA_OPERATIONS_CATALOGUE[1];
    const haVal = parseFloat(selectedField.ha || '1.5') || 1.0;
    const initialSubItems = targetOp.subItems.map((si, idx) => {
      const scaledQty = Number((si.qty * (si.unit === 'lac' || si.unit === 'pass' || si.unit === 'ha' || si.unit === 'ton' ? haVal : 1)).toFixed(1));
      const subTotal = Math.round(scaledQty * si.unitCost);
      return {
        id: generateSubItemId(targetOp.id, idx),
        description: si.description,
        qty: scaledQty,
        unit: si.unit,
        unitCost: si.unitCost,
        subTotal: subTotal
      };
    });
    const totalCost = initialSubItems.reduce((sum, item) => sum + item.subTotal, 0);

    setLogForm(p => ({
      ...p,
      id: null,
      fieldId: selectedField.id,
      saveFieldId: true,
      sraOperationId: targetOp.id,
      operationName: targetOp.name,
      activity: targetOp.name,
      category: targetOp.category,
      cost: String(totalCost),
      hectares: selectedField.ha || '1.5',
      people: '2',
      subItems: initialSubItems,
      inputQty: '',
      inputUnit: targetOp.unit || 'bags',
      inputName: '',
      period: p.period || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isSubmit: true
    }));
    setShowLog(true);
  };

  const closeLog = () => {
    setShowLog(false);
  };

  const handleSaveLog = (asSubmit = true, forceCostConfirm = false, forceDuplicateConfirm = false) => {
    const effectiveActivity = logForm.operationName || logForm.activity || 'Field Operation';
    let computedCost = parseFloat(logForm.cost) || 0;
    if (logForm.isGroup && logForm.subItems && logForm.subItems.length > 0) {
      computedCost = logForm.subItems.reduce((sum, it) => sum + (it.subTotal || 0), 0);
    } else if (!logForm.isGroup && logForm.inputQty && logForm.directRate) {
      computedCost = Math.round(parseFloat(logForm.inputQty) * parseFloat(logForm.directRate));
    }

    if (!effectiveActivity.trim() || !logForm.fieldId?.trim() || !logForm.period?.trim() || !logForm.hectares || !logForm.people) {
      Alert.alert('Required', 'Please fill in Date, Activity, Operational Cost, Hectares, and Workers.');
      return;
    }
    
    const costValue = computedCost;
    const ha = parseFloat(logForm.hectares);
    const ppl = parseInt(logForm.people);

    if (isNaN(costValue) || costValue < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive number for Operational Cost.');
      return;
    }
    if (isNaN(ha) || ha <= 0 || isNaN(ppl) || ppl <= 0) {
      Alert.alert('Invalid Input', 'Hectares and Workers must be positive numbers greater than 0.');
      return;
    }
    if (ha > 50) { Alert.alert('Invalid Input', 'Hectares cannot exceed 50 per log.'); return; }
    if (ppl > 100) { Alert.alert('Invalid Input', 'Worker count cannot exceed 100 per log.'); return; }

    // Block future dates
    const parsedDate = new Date(logForm.period);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (!isNaN(parsedDate.getTime()) && parsedDate > today) {
      Alert.alert('Invalid Date', 'You cannot set a future date for completed work. Please select today or an earlier date.');
      return;
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (!isNaN(parsedDate.getTime()) && parsedDate < thirtyDaysAgo) {
      Alert.alert('Date Too Old', 'Logs cannot be back-dated more than 30 days. Contact your Farm Manager for corrections beyond this period.');
      return;
    }

    const submittedFieldId = logForm.fieldId.trim().toUpperCase();

    // Member Field Lock: Members can only log activities for their own assigned plot
    if (activeRole === 'Member') {
      const session = getCurrentSession();
      const myPlot = session.fieldId?.trim()?.toUpperCase();
      if (myPlot && submittedFieldId !== myPlot) {
        Alert.alert(
          'Action Denied',
          `As a Member farmer, you may only record operations for your assigned plot (${session.fieldId}). To request an additional plot, please use Field Requests.`
        );
        return;
      }
    }

    // Duplicate detection (soft warning)
    const isDupConfirmed = forceDuplicateConfirm || logForm._duplicateConfirmed;
    if (asSubmit && !logForm.id) {
      const isDuplicate = MOCK_LOGS.some(l =>
        l.fieldId === submittedFieldId &&
        (l.operationName === logForm.operationName || l.activity === logForm.activity.trim()) &&
        l.date === (logForm.period || '')
      );
      if (isDuplicate && !isDupConfirmed) {
        Alert.alert(
          'Possible Duplicate Notice',
          `An operation for "${logForm.operationName || logForm.activity}" is already recorded on ${logForm.period} for ${submittedFieldId}. Do you still wish to record this?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Record Anyway', style: 'default', onPress: () => {
              setLogForm(prev => ({ ...prev, _duplicateConfirmed: true }));
              handleSaveLog(asSubmit, true, true);
            }}
          ]
        );
        return;
      }
    }

    const safeHa = Math.max(ha, 0.1);
    const costPerHaVal = Math.round(costValue / safeHa);
    const loggedByStr = isTakeOver
      ? `Manager (${getCurrentSession().name} - Takeover)`
      : `${getCurrentSession().role === 'Farm Manager' ? 'Manager' : 'Farmer'} (${getCurrentSession().name})`;

    const matchedOp = SRA_OPERATIONS_CATALOGUE.find(o => o.id === logForm.sraOperationId) || {};
    const parentStageNum = logForm.stageNumber || matchedOp.stageNumber || 1;
    const parentStageName = logForm.stageName || matchedOp.stageName || 'Stage 1: Pre-Planting & Land Preparation';

    const logIdToUse = logForm.id || (asSubmit ? generateLogId(submittedFieldId) : generateDraftId(submittedFieldId));
    const newLog = {
      id: logIdToUse,
      fieldId: submittedFieldId,
      stageNumber: parentStageNum,
      stageName: parentStageName,
      sraOperationId: logForm.sraOperationId || matchedOp.id || 'SRA-02',
      operationName: logForm.operationName || matchedOp.name || logForm.activity,
      activity: logForm.activity,
      category: logForm.category || matchedOp.category || 'prep',
      cost: costValue,
      totalCost: costValue,
      costPerHa: costPerHaVal,
      hectares: logForm.hectares,
      people: logForm.people,
      subItems: logForm.subItems || [],
      inputQty: logForm.inputQty || '',
      inputUnit: logForm.inputUnit || '',
      inputName: logForm.inputName || '',
      date: logForm.period || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      approved: false,
      status: 'Recorded',
      loggedBy: loggedByStr,
      taskId: logForm.taskId,
      isOffline: !synced,
      editHistory: [],
    };

    if (!MOCK_FIELDS.find(f => f.id === submittedFieldId)) {
      MOCK_FIELDS.push({ id: submittedFieldId, member: getCurrentSession().name || 'Current User', ha: logForm.hectares || '0.0', stage: logForm.operationName || 'Newly Logged', month: 0, synced: false, lastSync: 'Just now', customStages: [] });
    }

    if (asSubmit) {
      if (logForm.id) {
        // Check if updating an existing submitted log
        const logIdx = MOCK_LOGS.findIndex(l => l.id === logForm.id);
        if (logIdx >= 0) {
          // Audit trail — preserve original values before overwriting
          const originalLog = { ...MOCK_LOGS[logIdx] };
          const editRecord = {
            editedBy: getCurrentSession().name,
            editedRole: activeRole,
            editedAt: new Date().toLocaleString('en-PH'),
            previousValues: {
              activity: originalLog.activity,
              cost: originalLog.cost,
              hectares: originalLog.hectares,
              people: originalLog.people,
              inputQty: originalLog.inputQty,
              inputUnit: originalLog.inputUnit,
              inputName: originalLog.inputName,
              date: originalLog.date,
            }
          };
          const existingHistory = MOCK_LOGS[logIdx].editHistory || [];
          MOCK_LOGS[logIdx] = { ...newLog, id: logForm.id, editHistory: [...existingHistory, editRecord] };
          
          if (synced && db) {
            setDoc(doc(db, 'operation_logs', logForm.id), MOCK_LOGS[logIdx], { merge: true }).catch(err => {
              console.warn('[FieldOpsScreen] Direct Firestore edit sync failed:', err);
            });
          }

          setLogs([...MOCK_LOGS]);
          setLogTab('submitted');
          notifyDataUpdate();
          Alert.alert('Log Updated', `Operation log "${newLog.activity}" has been updated.\n\nEdit recorded by: ${getCurrentSession().name} (${activeRole})`);
          setLogForm({ id: null, fieldId: selectedField.id, saveFieldId: true, activity: '', cost: '', period: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), hectares: '', people: '', inputQty: '', inputUnit: 'bags', inputName: '', taskId: null, isSubmit: true });
          closeLog();
          return;
        }

        // If submitting a draft, remove draft and add to MOCK_LOGS
        const draftIdx = DRAFT_LOGS.findIndex(d => d.id === logForm.id);
        if (draftIdx >= 0) DRAFT_LOGS.splice(draftIdx, 1);
        setDraftLogs([...DRAFT_LOGS]);
      }

      if (!synced) {
        enqueueOutboxItem('operation_log', newLog);
      } else if (db) {
        // Direct live write to Firestore
        setDoc(doc(db, 'operation_logs', newLog.id), {
          ...newLog,
          synced: true,
          syncedAt: new Date().toISOString()
        }, { merge: true }).catch(err => {
          console.warn('[FieldOpsScreen] Direct Firestore write error, queuing:', err);
          enqueueOutboxItem('operation_log', newLog);
        });
      }

      MOCK_LOGS.unshift(newLog);
      setLogs([...MOCK_LOGS]);
      setLogTab('submitted');
      
      // Keep stage active and allow multiple operations per stage
      if (logForm.taskId && logForm.taskId !== 'Emergency') {
        const currentTasks = cycleTasksByField[submittedFieldId] || [];
        const targetTask = currentTasks.find(t => t.id === logForm.taskId);
        const stageNum = logForm.stageNumber || targetTask?.stageNumber || 1;

        const stagePlannedOps = getFieldCustomOperations(submittedFieldId, stageNum);
        const stageLoggedOps = MOCK_LOGS.filter(l => l.fieldId === submittedFieldId && (l.stageNumber === stageNum || l.taskId === logForm.taskId) && !l.isPastCycle);

        if (stagePlannedOps.length > 1 && stageLoggedOps.length < stagePlannedOps.length) {
          Alert.alert(
            'Operation Recorded',
            `"${newLog.activity}" recorded to field history (${stageLoggedOps.length} of ${stagePlannedOps.length} operations logged for Stage ${stageNum}).\n\nStage ${stageNum} remains active for your next operation.`,
            [{ text: 'OK', style: 'default' }]
          );
        } else if (stagePlannedOps.length > 0 && stageLoggedOps.length >= stagePlannedOps.length) {
          Alert.alert(
            'Stage Operations Complete!',
            `All ${stagePlannedOps.length} operations for Stage ${stageNum} have been recorded.\n\nWould you like to mark Stage ${stageNum} as complete and advance to the next stage?`,
            [
              { text: 'Keep Stage Active', style: 'cancel' },
              { 
                text: 'Complete Stage', 
                style: 'default', 
                onPress: () => toggleTaskStatus(logForm.taskId, true) 
              }
            ]
          );
        } else {
          Alert.alert(
            'Operation Logged',
            `"${newLog.activity}" recorded to field history.`,
            [{ text: 'OK', style: 'default' }]
          );
        }
      } else {
        Alert.alert(
          'Operation Logged',
          `"${newLog.activity}" has been recorded to field history.`,
          [{ text: 'OK', style: 'default' }]
        );
      }
    } else {
      if (logForm.id) {
        const idx = DRAFT_LOGS.findIndex(d => d.id === logForm.id);
        if (idx >= 0) DRAFT_LOGS[idx] = { ...newLog, id: logForm.id };
        setDraftLogs([...DRAFT_LOGS]);
      } else {
        const draftObj = { ...newLog, id: generateDraftId(submittedFieldId) };
        DRAFT_LOGS.unshift(draftObj);
        setDraftLogs([...DRAFT_LOGS]);
      }
      setLogTab('drafts');
      Alert.alert('Draft Saved', 'Your log has been saved as a draft.');
    }
    
    notifyDataUpdate();

    if (logForm.saveFieldId && submittedFieldId !== selectedField.id) {
      updateSessionFieldId(submittedFieldId);
    }

    setLogForm({ id: null, fieldId: selectedField.id, saveFieldId: true, activity: '', cost: '', period: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), hectares: '', people: '', inputQty: '', inputUnit: 'bags', inputName: '', taskId: null, isSubmit: true });
    closeLog();
  };

  const submitDraft = (log) => {
    const idx = DRAFT_LOGS.findIndex(d => d.id === log.id);
    if (idx >= 0) DRAFT_LOGS.splice(idx, 1);
    setDraftLogs([...DRAFT_LOGS]);
    const submittedId = generateLogId(log.fieldId);
    const submittedLog = {
      ...log,
      id: submittedId,
      approved: true,
      isOffline: !synced,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    if (synced && db) {
      setDoc(doc(db, 'operation_logs', submittedLog.id), {
        ...submittedLog,
        synced: true,
        syncedAt: new Date().toISOString()
      }, { merge: true }).catch(err => {
        console.warn('[FieldOpsScreen] Firestore draft upload notice:', err);
        enqueueOutboxItem('operation_log', submittedLog);
      });
    } else if (!synced) {
      enqueueOutboxItem('operation_log', submittedLog);
    }

    MOCK_LOGS.unshift(submittedLog);
    setLogs([...MOCK_LOGS]);
    setLogTab('submitted');

    if (log.taskId && log.taskId !== 'Emergency') {
      const currentTasks = cycleTasksByField[log.fieldId] || [];
      const taskIdx = currentTasks.findIndex(t => t.id === log.taskId);
      if (taskIdx > -1) {
        const updated = currentTasks.map(t => {
          if (t.id === log.taskId) return { ...t, done: true, active: false };
          return t;
        });
        setCycleTasksByField(p => ({ ...p, [log.fieldId]: updated }));
        const isFullyCompleted = updated.every(t => t.done);
        const nextPending = updated.find(t => !t.done);
        const newStageLabel = isFullyCompleted 
          ? 'Harvesting & Milling (Completed)' 
          : (nextPending ? `Waiting: ${nextPending.label}` : 'Crop Cycle Complete');
        
        if (log.fieldId === selectedField.id) {
          setSelectedField(prevF => ({ ...prevF, stage: newStageLabel }));
        }
        const mf = MOCK_FIELDS.find(f => f.id === log.fieldId);
        if (mf) mf.stage = newStageLabel;
      }
    }

    notifyDataUpdate();
    Alert.alert('Draft Submitted', `"${submittedLog.activity}" recorded to field history!`);
  };

  const editDraft = (draft) => {
    setLogForm({
      id: draft.id,
      fieldId: draft.fieldId,
      saveFieldId: true,
      activity: draft.activity,
      cost: draft.cost ? draft.cost.toString() : '',
      period: draft.date || draft.period || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      hectares: draft.hectares ? draft.hectares.toString() : '',
      people: draft.people ? draft.people.toString() : '',
      inputQty: draft.inputQty ? draft.inputQty.toString() : '',
      inputUnit: draft.inputUnit || 'bags',
      inputName: draft.inputName || '',
      taskId: draft.taskId,
      isSubmit: false,
    });
    setShowLog(true);
  };

  const deleteDraft = (draftId) => {
    Alert.alert('Delete Draft', 'Are you sure you want to remove this draft?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        const idx = DRAFT_LOGS.findIndex(d => d.id === draftId);
        if (idx >= 0) DRAFT_LOGS.splice(idx, 1);
        setDraftLogs([...DRAFT_LOGS]);
        notifyDataUpdate();
      }}
    ]);
  };

  const editSubmittedLog = (log) => {
    const session = getCurrentSession();
    const isOwner = selectedField?.member === session.name || log?.authorName === session.name || activeRole === 'Member';

    if (activeRole === 'Farm Manager' && !isOwner && !isTakeOver) {
      Alert.alert(
        'Supervisor Takeover Required',
        'This operation log belongs to ' + (selectedField?.member || 'this member') + '. To edit or correct their records, please tap "Take Over Field" on the field card first.'
      );
      return;
    }

    setLogForm({
      id: log.id,
      fieldId: log.fieldId,
      saveFieldId: true,
      sraOperationId: log.sraOperationId || '',
      operationName: log.operationName || log.activity || '',
      activity: log.activity || '',
      category: log.category || 'prep',
      stageNumber: log.stageNumber,
      stageName: log.stageName,
      isGroup: Array.isArray(log.subItems) && log.subItems.length > 0,
      subItems: Array.isArray(log.subItems) ? log.subItems.map(si => ({ ...si })) : [],
      cost: log.totalCost != null ? log.totalCost.toString() : (log.cost ? log.cost.toString() : ''),
      period: log.date || log.period || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      hectares: log.hectares ? log.hectares.toString() : (selectedField?.ha || '1.5'),
      people: log.people ? log.people.toString() : '',
      inputQty: log.inputQty ? log.inputQty.toString() : '',
      inputUnit: log.inputUnit || 'bags',
      inputName: log.inputName || '',
      taskId: log.taskId,
      isSubmit: true,
    });
    setShowLog(true);
  };

  const deleteSubmittedLog = (log) => {
    const session = getCurrentSession();
    const isOwner = selectedField?.member === session.name || log?.authorName === session.name || activeRole === 'Member';

    if (activeRole === 'Farm Manager' && !isOwner) {
      Alert.alert(
        'Action Not Allowed',
        'Farm Managers cannot delete operation logs submitted by other field members. You can use "Edit / Correct" to adjust log details.'
      );
      return;
    }

    Alert.alert(
      'Delete Operation Log',
      `Delete "${log.activity}" (#${log.id})? If this was a stage log, the stage will revert to active so you can re-log it if needed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          const idx = MOCK_LOGS.findIndex(l => l.id === log.id);
          if (idx >= 0) MOCK_LOGS.splice(idx, 1);
          setLogs([...MOCK_LOGS]);

          // If this was the only log for this stage, revert the stage back to active so the member can re-log it
          if (log.taskId && log.taskId !== 'Emergency') {
            const hasOtherLogsForStage = MOCK_LOGS.some(l => l.fieldId === log.fieldId && l.taskId === log.taskId && !l.isPastCycle);
            if (!hasOtherLogsForStage) {
              const currentTasks = cycleTasksByField[log.fieldId] || [];
              const updated = currentTasks.map(t => {
                if (t.id === log.taskId) return { ...t, done: false, active: true };
                return t;
              });
              setCycleTasksByField(p => ({ ...p, [log.fieldId]: updated }));
              const activeTask = updated.find(t => t.active);
              if (log.fieldId === (selectedField?.id || MOCK_FIELDS[0]?.id)) {
                setSelectedField(prevF => ({ ...(prevF || MOCK_FIELDS[0]), stage: activeTask ? activeTask.label : 'In Progress' }));
              }
              const mf = MOCK_FIELDS.find(f => f.id === log.fieldId);
              if (mf) mf.stage = activeTask ? activeTask.label : 'In Progress';
            }
          }

          notifyDataUpdate();
          Alert.alert('Log Removed', 'The operation log has been removed.');
        }}
      ]
    );
  };

  const activeFieldId = selectedField?.id || MOCK_FIELDS[0]?.id || 'FLD-NCY-001';
  
  const visibleLogs = React.useMemo(() => {
    return activeRole === 'Member' ? logs : logs.filter(l => !l.isOffline);
  }, [activeRole, logs]);

  const fieldLogs = React.useMemo(() => {
    return visibleLogs.filter(l => l.fieldId === activeFieldId && !l.isPastCycle);
  }, [visibleLogs, activeFieldId]);

  const pastLogs = React.useMemo(() => {
    return visibleLogs.filter(l => l.fieldId === activeFieldId && l.isPastCycle);
  }, [visibleLogs, activeFieldId]);

  const handleClearPastLogs = () => {
    if (pastLogs.length === 0) return;
    Alert.alert(
      t('btn_delete_past_cycles', 'Delete All Past Cycles'),
      t('confirm_delete_past_cycles', 'This will remove past cycle records for this field from local device history. Active cycle logs are not affected.'),
      [
        { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('btn_delete_all', 'Delete All'),
          style: 'destructive',
          onPress: () => {
            const updated = MOCK_LOGS.filter(l => !(l.fieldId === activeFieldId && l.isPastCycle));
            MOCK_LOGS.length = 0;
            MOCK_LOGS.push(...updated);
            setLogs([...MOCK_LOGS]);
            notifyDataUpdate();
            Alert.alert(t('saved_title', 'Saved'), t('past_cycles_deleted_msg', 'Past cycle history has been cleared from local history.'));
          }
        }
      ]
    );
  };

  const unsynced = React.useMemo(() => {
    return MOCK_FIELDS.filter(f => !f.synced);
  }, []);

  // Dynamic calculations for month-level QR code compilation
  const { activeCycleLogs, uniqueFieldsCount, totalLogsCount, totalOperationalCost } = React.useMemo(() => {
    const acl = visibleLogs.filter(l => !l.isPastCycle);
    const ufc = new Set(acl.map(l => l.fieldId)).size;
    const tlc = acl.length;
    const toc = acl.reduce((sum, l) => sum + (Number(l.cost) || 0), 0);
    return { activeCycleLogs: acl, uniqueFieldsCount: ufc, totalLogsCount: tlc, totalOperationalCost: toc };
  }, [visibleLogs]);

  const LOGS_PER_PAGE = 5;

  const renderCompactLogList = (baseList, isDraft = false, isManager = false) => {
    const filtered = baseList.filter(log => {
      if (!isDraft && logCategoryFilter !== 'all') {
        const stageNum = parseInt(logCategoryFilter.replace('stage', ''), 10);
        const isMatch = (
          log.stageNumber === stageNum ||
          (log.taskId && log.taskId.toUpperCase() === `S${stageNum}`) ||
          (log.taskId && (
            (stageNum === 1 && (log.taskId === 'T1' || log.taskId === 'T2')) ||
            (stageNum === 2 && (log.taskId === 'T3' || log.taskId === 'T4')) ||
            (stageNum === 3 && (log.taskId === 'T5' || log.taskId === 'T6')) ||
            (stageNum === 4 && (log.taskId === 'T7' || log.taskId === 'T10')) ||
            (stageNum === 5 && (log.taskId === 'T8' || log.taskId === 'T9' || log.taskId === 'T11')) ||
            (stageNum === 6 && (log.taskId === 'T12' || log.taskId === 'T13' || log.taskId === 'T14'))
          )) ||
          (log.sraOperationId && (
            (stageNum === 1 && (log.sraOperationId === 'SRA-01' || log.sraOperationId === 'SRA-02')) ||
            (stageNum === 2 && (log.sraOperationId === 'SRA-03' || log.sraOperationId === 'SRA-04')) ||
            (stageNum === 3 && (log.sraOperationId === 'SRA-05' || log.sraOperationId === 'SRA-06')) ||
            (stageNum === 4 && (log.sraOperationId === 'SRA-07' || log.sraOperationId === 'SRA-10')) ||
            (stageNum === 5 && (log.sraOperationId === 'SRA-08' || log.sraOperationId === 'SRA-09' || log.sraOperationId === 'SRA-11')) ||
            (stageNum === 6 && (log.sraOperationId === 'SRA-12' || log.sraOperationId === 'SRA-13' || log.sraOperationId === 'SRA-14'))
          )) ||
          (stageNum === 1 && ((log.activity || '').toLowerCase().includes('prep') || (log.activity || '').toLowerCase().includes('plow') || (log.activity || '').toLowerCase().includes('soil'))) ||
          (stageNum === 2 && ((log.activity || '').toLowerCase().includes('plant') || (log.activity || '').toLowerCase().includes('patdan') || (log.activity || '').toLowerCase().includes('seedcane'))) ||
          (stageNum === 3 && ((log.activity || '').toLowerCase().includes('basal') || (log.activity || '').toLowerCase().includes('dap') || (log.activity || '').toLowerCase().includes('phosphate') || (log.activity || '').toLowerCase().includes('early care'))) ||
          (stageNum === 4 && ((log.activity || '').toLowerCase().includes('cultivation') || (log.activity || '').toLowerCase().includes('weed') || (log.activity || '').toLowerCase().includes('barring'))) ||
          (stageNum === 5 && ((log.activity || '').toLowerCase().includes('top-dress') || (log.activity || '').toLowerCase().includes('hilling') || (log.activity || '').toLowerCase().includes('maintenance') || (log.activity || '').toLowerCase().includes('drainage'))) ||
          (stageNum === 6 && ((log.activity || '').toLowerCase().includes('harvest') || (log.activity || '').toLowerCase().includes('cutting') || (log.activity || '').toLowerCase().includes('truck') || (log.activity || '').toLowerCase().includes('haul') || (log.activity || '').toLowerCase().includes('bull cart')))
        );
        if (!isMatch) return false;
      }

      if (logSearch.trim()) {
        const q = logSearch.trim().toLowerCase();
        const matchAct = (log.activity || '').toLowerCase().includes(q);
        const matchDate = (log.date || log.period || '').toLowerCase().includes(q);
        const matchCost = (log.cost || '').toString().includes(q);
        const matchId = (log.id || '').toLowerCase().includes(q);
        const matchMat = (log.inputName || '').toLowerCase().includes(q);
        return matchAct || matchDate || matchCost || matchId || matchMat;
      }
      return true;
    });

    const isFiltering = logSearch.trim().length > 0 || (!isDraft && logCategoryFilter !== 'all');
    const totalPages = Math.max(1, Math.ceil(filtered.length / LOGS_PER_PAGE));
    const currentPageClamped = Math.min(logCurrentPage, totalPages);
    const displayItems = filtered.slice((currentPageClamped - 1) * LOGS_PER_PAGE, currentPageClamped * LOGS_PER_PAGE);

    return (
      <View style={{ gap: 8 }}>
        {/* Search Bar */}
        <View style={s.logSearchBox}>
          <Ionicons name="search-outline" size={16} color={COLORS.textMuted} />
          <TextInput
            style={s.logSearchInput}
            placeholder={isDraft ? t('search_drafts_placeholder', "Search draft logs...") : t('search_logs_placeholder', "Search logs by activity, date, cost, materials...")}
            placeholderTextColor={COLORS.textMuted}
            value={logSearch}
            onChangeText={(t) => {
              setLogSearch(t);
              setLogCurrentPage(1);
            }}
          />
          {logSearch.length > 0 && (
            <TouchableOpacity onPress={() => { setLogSearch(''); setLogCurrentPage(1); }} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills (6 Official SRA Growth Stages) */}
        {!isDraft && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginBottom: 4 }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 6 }}>
            {[
              { key: 'all', label: `${t('cat_all', 'All')} (${baseList.length})` },
              { key: 'stage1', label: `${t('stage_word', 'Stage')} 1: ${t('stage_1_short', 'Land Prep')}` },
              { key: 'stage2', label: `${t('stage_word', 'Stage')} 2: ${t('stage_2_short', 'Planting')}` },
              { key: 'stage3', label: `${t('stage_word', 'Stage')} 3: ${t('stage_3_short', 'Basal Fert')}` },
              { key: 'stage4', label: `${t('stage_word', 'Stage')} 4: ${t('stage_4_short', 'Cultivation')}` },
              { key: 'stage5', label: `${t('stage_word', 'Stage')} 5: ${t('stage_5_short', 'Maintenance')}` },
              { key: 'stage6', label: `${t('stage_word', 'Stage')} 6: ${t('stage_6_short', 'Harvesting')}` },
            ].map(f => (
              <TouchableOpacity
                key={f.key}
                style={[s.filterPill, logCategoryFilter === f.key && s.filterPillActive]}
                onPress={() => {
                  setLogCategoryFilter(f.key);
                  setLogCurrentPage(1);
                }}
              >
                <Text style={[s.filterPillText, logCategoryFilter === f.key && s.filterPillTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Results summary when filtering */}
        {isFiltering && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2, marginBottom: 2 }}>
            <Text style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: '600' }}>
              Showing {filtered.length} of {baseList.length} logs
            </Text>
            <TouchableOpacity onPress={() => { setLogSearch(''); setLogCategoryFilter('all'); setLogCurrentPage(1); }}>
              <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: '700' }}>{t('btn_reset', 'Reset Filter')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty state */}
        {displayItems.length === 0 && (
          <View style={s.emptyCard}>
            <Ionicons name="document-text-outline" size={28} color={COLORS.border} />
            <Text style={s.emptyText}>{isFiltering ? t('no_matching_logs', 'No logs match your search or filter.') : (isDraft ? t('no_draft_logs', 'No draft logs.') : t('empty_logs', 'No operational logs recorded yet.'))}</Text>
          </View>
        )}

        {/* Compact Expandable Item Rows using memoized component */}
        {displayItems.map(log => {
          const isExpanded = expandedLogId === log.id;
          const canDeleteSubmitted = !isManager || selectedField.member === getCurrentSession().name || log.authorName === getCurrentSession().name;

          return (
            <CompactLogItem
              key={log.id}
              log={log}
              isDraft={isDraft}
              isExpanded={isExpanded}
              onToggleExpand={() => setExpandedLogId(isExpanded ? null : log.id)}
              formatOperationName={formatOperationName}
              formatStageName={formatStageName}
              t={t}
              editDraft={editDraft}
              submitDraft={submitDraft}
              deleteDraft={deleteDraft}
              editSubmittedLog={editSubmittedLog}
              deleteSubmittedLog={deleteSubmittedLog}
              canDeleteSubmitted={canDeleteSubmitted}
              s={s}
            />
          );
        })}

        {/* Simple Page-by-Page Pagination Controls (Prev / Page X of Y / Next) */}
        {filtered.length > 0 && totalPages > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border }}>
            <TouchableOpacity
              disabled={currentPageClamped <= 1}
              onPress={() => setLogCurrentPage(p => Math.max(1, p - 1))}
              style={[{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#fff' }, currentPageClamped <= 1 && { opacity: 0.4 }]}
            >
              <Ionicons name="chevron-back" size={14} color={COLORS.text} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.text }}>Prev</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textSecondary }}>
              Page {currentPageClamped} of {totalPages}
            </Text>

            <TouchableOpacity
              disabled={currentPageClamped >= totalPages}
              onPress={() => setLogCurrentPage(p => Math.min(totalPages, p + 1))}
              style={[{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#fff' }, currentPageClamped >= totalPages && { opacity: 0.4 }]}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.text }}>Next</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };



  const SRA_TASK_KEY_MAP = {
    T1: 'task_t1',
    T2: 'task_t2',
    T3: 'task_t3',
    T4: 'task_t4',
    T5: 'task_t5',
    T6: 'task_t6',
    T7: 'task_t7',
    T8: 'task_t8',
    T9: 'task_t9',
    T10: 'task_t10',
    T11: 'task_t11',
    T12: 'task_t12',
    T13: 'task_t13',
    T14: 'task_t14',
  };

  const getTaskLabel = (task) => {
    if (task.id && SRA_TASK_KEY_MAP[task.id]) {
      return t(SRA_TASK_KEY_MAP[task.id], task.label);
    }
    return task.label;
  };

  const renderTimeline = () => {
    const tasks = cycleTasksByField[selectedField.id] || getFieldStages(selectedField.id);
    const activeStage = tasks.find(t => t.active) || tasks.find(t => !t.done) || tasks[0];
    const completedCount = tasks.filter(t => t.done).length;
    const progressPercent = Math.round((completedCount / tasks.length) * 100);
    const isFullyCompleted = tasks.every(t => t.done);

    return (
      <View style={{ marginBottom: SPACING.md }}>
        {/* Section Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, marginRight: 6 }}>
            <Ionicons name="git-network-outline" size={18} color={COLORS.primary} />
            <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.text, textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 1 }} numberOfLines={1}>
              {t('field_growth_stages_title', 'Field Growth Stages')}
            </Text>
          </View>
          <View style={{ backgroundColor: '#F0F8EC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.xs, flexShrink: 0 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.primary }}>
              {completedCount} / {tasks.length} ({progressPercent}%)
            </Text>
          </View>
        </View>

        {/* Main Growth Stages Card */}
        <View style={[s.fieldCard, { padding: SPACING.md, gap: 12 }]}>
          {/* Active Stage Indicator Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAF5', padding: 12, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.primary, textTransform: 'uppercase' }}>{t('current_field_stage_title', 'Current Field Stage')}</Text>
              <Text style={{ fontSize: 15, fontWeight: '900', color: COLORS.text, marginTop: 2 }}>
                {formatStageName ? formatStageName(activeStage?.name || selectedField.stage) : (activeStage?.name || selectedField.stage)}
              </Text>
              <Text style={{ fontSize: 11.5, color: COLORS.textSecondary, marginTop: 1 }}>
                {formatPhaseMonth ? formatPhaseMonth(activeStage?.monthRange || 'Month 1–3') : (activeStage?.monthRange || 'Month 1–3')} · {t('tap_active_stage_hint', 'Tap active stage below to log operations')}
              </Text>
            </View>
          </View>

          {/* Visual Progress Bar */}
          <View style={{ height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 }} />
          </View>

          {/* 5 Growth Stages */}
          <View style={{ gap: 8 }}>
            {tasks.map((task, i) => {
              const isCurrentActive = task.active && !task.done;
              return (
                <View
                  key={task.id || i}
                  style={[
                    { borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff', overflow: 'hidden' },
                    isCurrentActive && { borderColor: COLORS.primary, backgroundColor: '#F8FAF5' }
                  ]}
                >
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 }}
                    onPress={() => {
                      if (activeRole === 'Farm Manager' && !isTakeOver) {
                        Alert.alert('View Only', 'Please enable "Take Over Field" mode to update the timeline.');
                        return;
                      }
                      toggleTaskStatus(task.id);
                    }}
                    activeOpacity={0.7}
                  >
                    {/* Stage Number Badge */}
                    <View style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: task.done ? COLORS.success : isCurrentActive ? COLORS.primary : '#E5E7EB',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexShrink: 0
                    }}>
                      {task.done ? (
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      ) : isCurrentActive ? (
                        <Ionicons name="play" size={14} color="#fff" style={{ marginLeft: 2 }} />
                      ) : (
                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#6B7280' }}>{task.stageNumber || i + 1}</Text>
                      )}
                    </View>

                    {/* Stage Details */}
                    <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
                      <Text style={{
                        fontSize: isCurrentActive ? 14 : 13,
                        fontWeight: isCurrentActive ? '900' : task.done ? '700' : '600',
                        color: isCurrentActive ? COLORS.primary : task.done ? COLORS.text : COLORS.textMuted,
                        lineHeight: 18
                      }}>
                        {formatStageName ? formatStageName(task.name || task.label) : `Stage ${task.stageNumber || i + 1}: ${task.name || task.label}`}
                      </Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                        <View style={{ backgroundColor: isCurrentActive ? '#E2EED9' : '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.xs }}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: isCurrentActive ? COLORS.primary : COLORS.textSecondary }}>
                            {formatPhaseMonth ? formatPhaseMonth(task.monthRange || `Month ${task.month || i + 1}`) : (task.monthRange || `Month ${task.month || i + 1}`)}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 11, color: task.done ? COLORS.success : isCurrentActive ? COLORS.textSecondary : COLORS.textMuted, flex: 1 }} numberOfLines={1}>
                          {task.done ? t('status_completed', 'Completed') : (isCurrentActive ? t('tap_to_record_op_hint', 'Tap to record operation log') : t('status_pending', 'Pending'))}
                        </Text>
                      </View>
                    </View>

                    {/* Right Icon / Status Badge */}
                    {task.done ? (
                      <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
                    ) : isCurrentActive ? (
                      <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.xs, borderWidth: 1, borderColor: '#86EFAC', flexShrink: 0 }}>
                        <Text style={{ fontSize: 10.5, fontWeight: '900', color: '#15803D' }}>{t('badge_active', 'ACTIVE')}</Text>
                      </View>
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                    )}
                  </TouchableOpacity>

                  {/* Active Stage Expanded Action Box with Nested Operations */}
                  {isCurrentActive && (
                    <View style={{ backgroundColor: '#F0F8EC', borderTopWidth: 1, borderTopColor: '#D1E0C5', padding: 12, gap: 10 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 11.5, fontWeight: '800', color: COLORS.primary, textTransform: 'uppercase' }}>
                          {t('operations_in_stage', 'Operations in Stage')} {task.stageNumber || i + 1}
                        </Text>
                        <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>
                          {t('benchmark_lbl', 'Benchmark')}: ₱ {Number(task.benchmarkCost || 12000).toLocaleString()} / ha
                        </Text>
                      </View>

                      {/* List of distinct operations under this stage (Customized by member or SRA default) */}
                      <View style={{ gap: 6 }}>
                        {getFieldCustomOperations(selectedField.id, task.stageNumber || i + 1).map(op => {
                          const opCostPerHa = (op.subItems || []).reduce((sum, si) => sum + (si.qty * si.unitCost), 0) || op.costPerHa || 0;
                          const isOpLogged = fieldLogs.some(l => (l.operationName === op.name || l.sraOperationId === op.id || l.activity === op.name) && (l.stageNumber === (task.stageNumber || i + 1) || l.taskId === task.id) && !l.isPastCycle);

                          return (
                            <TouchableOpacity
                              key={op.id}
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: isOpLogged ? '#F4FAF0' : '#fff',
                                padding: 10,
                                borderRadius: RADIUS.md,
                                borderWidth: 1.5,
                                borderColor: isOpLogged ? COLORS.primary + '50' : COLORS.border,
                                ...SHADOW.card
                              }}
                              onPress={() => {
                                if (isOpLogged) {
                                  Alert.alert(
                                    'Log Additional Entry',
                                    `"${op.name}" has already been recorded for this stage. Would you like to record an additional entry or repeat pass?`,
                                    [
                                      { text: 'Cancel', style: 'cancel' },
                                      { text: 'Yes, Log Again', onPress: () => openOperationLog(task, op.id) }
                                    ]
                                  );
                                } else {
                                  openOperationLog(task, op.id);
                                }
                              }}
                              activeOpacity={0.8}
                            >
                              <View style={{ flex: 1, paddingRight: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                  <View style={{ backgroundColor: COLORS.primaryBg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.xs }}>
                                    <Text style={{ fontSize: 10.5, fontWeight: '900', color: COLORS.primary }}>{op.id}</Text>
                                  </View>
                                  {isOpLogged && (
                                    <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.xs }}>
                                      <Text style={{ fontSize: 9.5, fontWeight: '900', color: '#15803D' }}>✓ {t('recorded_badge', 'RECORDED')}</Text>
                                    </View>
                                  )}
                                  <Text style={{ fontSize: 13.5, fontWeight: '800', color: COLORS.text }} numberOfLines={1}>
                                    {formatOperationName ? formatOperationName(op.name) : op.name}
                                  </Text>
                                </View>
                                <Text style={{ fontSize: 11.5, color: COLORS.textSecondary, marginTop: 3 }}>
                                  ₱ {Number(opCostPerHa).toLocaleString()} / ha {(op.isGroup || (op.subItems && op.subItems.length > 1)) ? `· ${op.subItems?.length || 0} Child Item${op.subItems?.length !== 1 ? 's' : ''}` : `· Direct Input`}
                                </Text>
                              </View>
                              <View
                                style={{
                                  width: 38,
                                  height: 38,
                                  borderRadius: RADIUS.sm,
                                  backgroundColor: isOpLogged ? '#E2EED9' : COLORS.primary,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderWidth: isOpLogged ? 1.5 : 0,
                                  borderColor: COLORS.primary,
                                  flexShrink: 0
                                }}
                              >
                                <Ionicons
                                  name={isOpLogged ? "repeat-outline" : "create-outline"}
                                  size={20}
                                  color={isOpLogged ? COLORS.primary : '#fff'}
                                />
                              </View>
                            </TouchableOpacity>
                          );
                        })}

                        {/* Quick Add Custom Operation to Active Stage */}
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            backgroundColor: '#fff',
                            borderWidth: 1.5,
                            borderColor: COLORS.primary + '60',
                            borderStyle: 'dashed',
                            borderRadius: RADIUS.md,
                            paddingVertical: 10,
                            marginTop: 4
                          }}
                          onPress={() => {
                            setLogForm({
                              id: null,
                              fieldId: selectedField.id,
                              saveFieldId: true,
                              stageNumber: task.stageNumber || i + 1,
                              stageName: `Stage ${task.stageNumber || i + 1}: ${task.name || task.label}`,
                              sraOperationId: 'CUSTOM',
                              operationName: '',
                              activity: '',
                              category: 'prep',
                              cost: '0',
                              period: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                              hectares: selectedField.ha || '1.5',
                              people: '2',
                              subItems: [],
                              inputQty: '',
                              inputUnit: 'bags',
                              inputName: '',
                              taskId: task.id,
                              isSubmit: true
                            });
                            setShowOpPicker(false);
                            setShowLog(true);
                          }}
                        >
                          <Ionicons name="add-circle-outline" size={17} color={COLORS.primary} />
                          <Text style={{ fontSize: 12.5, fontWeight: '800', color: COLORS.primary }}>Add Custom Operation</Text>
                        </TouchableOpacity>

                        {/* Manual Complete Stage Button */}
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            backgroundColor: COLORS.primary,
                            borderRadius: RADIUS.md,
                            paddingVertical: 12,
                            marginTop: 6
                          }}
                          onPress={() => {
                            Alert.alert(
                              'Complete Stage',
                              `Are you finished with all operations in Stage ${task.stageNumber || i + 1}?`,
                              [
                                { text: 'Keep Active', style: 'cancel' },
                                { text: 'Yes, Complete Stage', onPress: () => toggleTaskStatus(task.id, true) }
                              ]
                            );
                          }}
                        >
                          <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>
                            Mark Stage {task.stageNumber || i + 1} as Complete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {isFullyCompleted && (
            <TouchableOpacity
              style={{ marginTop: 8, backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: RADIUS.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
              onPress={() => {
                Alert.alert(
                  t('btn_start_new_cycle', 'Start New Crop Year'),
                  'Are you sure you want to start a new crop cycle?',
                  [
                    { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
                    { text: 'Yes, Start', style: 'default', onPress: () => {
                      const baseStages = getFieldStages(selectedField.id).map(t => ({ ...t, done: false, active: false }));
                      baseStages[0].active = true;
                      setCycleTasksByField(p => ({
                        ...p,
                        [selectedField.id]: baseStages
                      }));
                      setSelectedField(prevF => ({ ...prevF, stage: baseStages[0].name }));
                      const resetMf = MOCK_FIELDS.find(f => f.id === selectedField.id);
                      if (resetMf) resetMf.stage = baseStages[0].name;

                      MOCK_LOGS.forEach(l => {
                        if (l.fieldId === selectedField.id) l.isPastCycle = true;
                      });
                      setLogs([...MOCK_LOGS]);
                      setDraftLogs(prev => prev.filter(d => d.fieldId !== selectedField.id));
                    }}
                  ]
                );
              }}
            >
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 13.5, fontWeight: '800' }}>Start New Crop Year Cycle</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const scopedDrafts = activeRole === 'Member' ? draftLogs.filter(d => d.fieldId === selectedField.id) : [];
  const totalLedgerCount = fieldLogs.length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader
        right={
          activeRole === 'SRA (Admin)' ? (
            <TouchableOpacity
              style={s.topbarLedgerBtn}
              onPress={() => {
                setLogTab('audit_history');
                setShowHistoryModal(true);
              }}
              activeOpacity={0.75}
            >
              <Ionicons name="receipt-outline" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={s.topbarLedgerBtn}
              onPress={() => setShowHistoryModal(true)}
              activeOpacity={0.75}
            >
              <Ionicons name="receipt-outline" size={22} color={COLORS.text} />
              {totalLedgerCount > 0 && (
                <View style={s.topbarLedgerBadge}>
                  <Text style={s.topbarLedgerBadgeText}>{totalLedgerCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )
        }
      />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MEMBER VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'Member' && (
          <>
            {/* My Fields Selector */}
            <Text style={s.sectionLabel}>{t('my_fields', 'My Sugarcane Plots')}</Text>
            {(() => {
              const sess = getCurrentSession();
              const sName = (sess.name || '').trim().toLowerCase();
              const memberFieldList = MOCK_FIELDS.filter(f => {
                const mName = (f.member || '').trim().toLowerCase();
                return (sess.fieldId && f.id === sess.fieldId) || (sName && (mName === sName || mName.includes(sName) || sName.includes(mName))) || f.id === selectedField.id;
              });
              const fieldsToRender = memberFieldList.length > 0 ? memberFieldList : [MOCK_FIELDS[0]];

              return (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginBottom: SPACING.sm }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 8 }}>
                  {fieldsToRender.map(field => (
                    <TouchableOpacity
                      key={field.id}
                      style={[s.fieldChip, selectedField.id === field.id && s.fieldChipActive]}
                      onPress={() => {
                        setSelectedField(field);
                        updateSessionFieldId(field.id);
                      }}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="leaf" size={13} color={selectedField.id === field.id ? COLORS.primary : COLORS.textMuted} />
                      <Text style={[s.fieldChipText, selectedField.id === field.id && s.fieldChipTextActive]}>
                        {field.id} ({field.ha} Ha)
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              );
            })()}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.md, backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.md, padding: 10 }}>
              <Ionicons name="information-circle-outline" size={14} color={COLORS.primary} />
              <Text style={{ fontSize: 12, color: COLORS.primary, flex: 1 }}>{t('field_alloc_notice')}</Text>
            </View>

            <Text style={s.sectionLabel}>{t('field_plot', 'Selected Field Details')}</Text>
            <View style={s.fieldCard}>
              <View style={s.fieldCardTop}>
                <View style={s.fieldIdBadge}><Text style={s.fieldIdText}>{selectedField.id}</Text></View>
                <Text style={s.fieldHa}>{selectedField.ha} Ha</Text>
              </View>
              <Text style={s.fieldMember}>{t('member_label', 'Member')}: {selectedField.member}</Text>
              <Text style={s.fieldSync}>
                <Ionicons name={selectedField.synced ? 'cloud-done-outline' : 'cloud-offline-outline'} size={14} color={selectedField.synced ? '#267326' : '#C97A00'} />
                {' '}{selectedField.synced ? `${t('synced', 'Synced')} ${formatSyncTime(selectedField.lastSync)}` : `${t('not_synced', 'Not synced')} (${formatSyncTime(selectedField.lastSync)})`}
              </Text>
            </View>

            {/* Crop Cycle Timeline */}
            {renderTimeline()}
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* FARM MANAGER VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'Farm Manager' && (
          <>
            <Text style={[s.sectionLabel, { marginBottom: 8 }]}>Manager Actions</Text>
            <View style={{ gap: 10, marginBottom: SPACING.lg }}>
              <TouchableOpacity 
                style={{ backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, ...SHADOW.card }} 
                onPress={handleGenerateAudit}
              >
                <Ionicons name="qr-code-outline" size={20} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 }}>{t('btn_generate_audit', 'GENERATE AUDIT LOGS')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{ backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border, paddingVertical: 12, borderRadius: RADIUS.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }} 
                onPress={openAssignModal}
              >
                <Ionicons name="person-add-outline" size={16} color={COLORS.text} />
                <Text style={{ color: COLORS.text, fontSize: 13, fontWeight: '700' }}>{t('btn_assign_field', 'Assign New Field')}</Text>
              </TouchableOpacity>
            </View>

            {/* Sync Status Warning */}
            {unsynced.length > 0 && (
              <View style={s.syncWarning}>
                <Ionicons name="alert-circle" size={18} color='#C97A00' />
                <View style={{ flex: 1 }}>
                  <Text style={[s.syncWarningText, { fontWeight: '700' }]}>
                    Member Device Sync Notice
                  </Text>
                  {unsynced.map(f => (
                    <Text key={f.id} style={[s.syncWarningText, { marginTop: 2 }]}>
                      • <Text style={{ fontWeight: '700' }}>{f.id}</Text> ({f.member}): {t('sync_info', 'last synced')} <Text style={{ fontWeight: '700', color: '#C97A00' }}>{formatSyncTime(f.lastSync || '4 days ago')}</Text>
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Field Scope Filter Switcher */}
            {/* Field Selector & Segmented Scope Switcher */}
            {(() => {
              const myFieldList = MOCK_FIELDS.filter(f => f.member === getCurrentSession().name || f.id === getCurrentSession().fieldId);
              const displayedFields = managerFieldFilter === 'my'
                ? (myFieldList.length > 0 ? myFieldList : MOCK_FIELDS)
                : MOCK_FIELDS;

              return (
                <View style={{ marginBottom: 4 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={[s.sectionLabel, { marginBottom: 0 }]}>
                      {managerFieldFilter === 'my' ? t('my_fields', 'My Managed Plot') : t('view_all_fields', 'All Block Farm Fields')}
                    </Text>
                    
                    {/* Sleek Segmented Pill Switcher matching Planner UI */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#EEF2E6', borderRadius: RADIUS.sm, padding: 2 }}>
                      <TouchableOpacity
                        style={[{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.xs }, managerFieldFilter === 'my' && { backgroundColor: '#fff', ...SHADOW.card }]}
                        onPress={() => {
                          setManagerFieldFilter('my');
                          if (myFieldList.length > 0) {
                            setSelectedField(myFieldList[0]);
                            updateSessionFieldId(myFieldList[0].id);
                          }
                        }}
                      >
                        <Text style={{ fontSize: 11, fontWeight: managerFieldFilter === 'my' ? '800' : '600', color: managerFieldFilter === 'my' ? COLORS.primary : COLORS.textMuted }}>
                          My Plot ({myFieldList.length})
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.xs }, managerFieldFilter === 'all' && { backgroundColor: '#fff', ...SHADOW.card }]}
                        onPress={() => setManagerFieldFilter('all')}
                      >
                        <Text style={{ fontSize: 11, fontWeight: managerFieldFilter === 'all' ? '800' : '600', color: managerFieldFilter === 'all' ? COLORS.primary : COLORS.textMuted }}>
                          All Plots ({MOCK_FIELDS.length})
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginBottom: SPACING.md }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 8, paddingBottom: 4 }}>
                    {displayedFields.slice(0, 3).map(field => (
                      <TouchableOpacity
                        key={field.id}
                        style={[s.fieldChip, selectedField.id === field.id && s.fieldChipActive]}
                        onPress={() => {
                          setSelectedField(field);
                          updateSessionFieldId(field.id);
                        }}
                      >
                        <View style={[s.syncDot, { backgroundColor: field.synced ? COLORS.success : '#C97A00' }]} />
                        <Text style={[s.fieldChipText, selectedField.id === field.id && s.fieldChipTextActive]}>{field.id} ({field.ha} Ha)</Text>
                      </TouchableOpacity>
                    ))}
                    {displayedFields.length > 3 && (
                      <TouchableOpacity style={[s.fieldChip, { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary }]} onPress={() => setShowFieldsModal(true)}>
                        <Text style={[s.fieldChipText, { color: COLORS.primary, fontWeight: '800' }]}>+ {displayedFields.length - 3} More</Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                </View>
              );
            })()}

            {/* Selected Field Detail */}
            <View style={s.fieldCard}>
              <View style={s.fieldCardTop}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={s.fieldIdBadge}><Text style={s.fieldIdText}>{selectedField.id}</Text></View>
                  <Text style={s.fieldHa}>{selectedField.ha} Ha</Text>
                </View>
                {activeRole === 'Farm Manager' && (
                  <TouchableOpacity onPress={() => setIsTakeOver(!isTakeOver)} style={{ backgroundColor: isTakeOver ? '#D9534F' : COLORS.primaryBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: isTakeOver ? '#fff' : COLORS.primary }}>{isTakeOver ? 'Cancel Take Over' : t('btn_take_over', 'Take Over Field')}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={s.fieldMember}>{t('member_label', 'Member')}: {selectedField.member}</Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, flexWrap: 'wrap', gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name={selectedField.synced ? 'cloud-done-outline' : 'cloud-offline-outline'} size={14} color={selectedField.synced ? COLORS.success : '#C97A00'} />
                  <Text style={[s.fieldSync, { color: selectedField.synced ? COLORS.success : '#C97A00', fontWeight: '600' }]}>
                    {selectedField.synced ? `${t('synced', 'Synced')} (${formatSyncTime(selectedField.lastSync)})` : `${t('not_synced', 'Pending Member Sync')} (${formatSyncTime(selectedField.lastSync)})`}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm }}
                  onPress={() => {
                    Alert.alert(
                      t('sync_info_alert_title', 'Offline Synchronization Info'),
                      `${t('my_field', 'Field')} ${selectedField.id} (${selectedField.member})\n\n` +
                      t('sync_info_alert_msg', 'When a member records operations offline in the field, logs are securely saved on the device. Records automatically upload once reconnected to internet or synced at the office.')
                    );
                  }}
                >
                  <Ionicons name="information-circle-outline" size={13} color={COLORS.textMuted} />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.textSecondary }}>{t('sync_info', 'Sync Info')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Crop Cycle Timeline */}
            {renderTimeline()}
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SRA (Admin) VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeRole === 'SRA (Admin)' && (
          <>
            {/* ── Block Farm Summary (SRA Supervision) ── */}
            <Text style={s.sectionLabel}>District Block Farms Overview</Text>

            {/* Farm Selector */}
            {(() => {
              const availableFarms = blockFarms.length > 0
                ? ['All Block Farms', ...blockFarms.map(bf => bf.name)]
                : ['All Block Farms', ...new Set(MOCK_FIELDS.map(f => f.blockFarm || resolveFieldBlockFarm(f)))];

              return (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 10, marginBottom: SPACING.md }}>
                  {availableFarms.map(farm => (
                    <TouchableOpacity 
                      key={farm}
                      style={{
                        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                        backgroundColor: (selectedFarm === farm || (selectedFarm === 'All' && farm === 'All Block Farms')) ? COLORS.primary : COLORS.background,
                        borderWidth: 1, borderColor: (selectedFarm === farm || (selectedFarm === 'All' && farm === 'All Block Farms')) ? COLORS.primary : COLORS.border
                      }}
                      onPress={() => setSelectedFarm(farm === 'All Block Farms' ? 'All' : farm)}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '700', color: (selectedFarm === farm || (selectedFarm === 'All' && farm === 'All Block Farms')) ? '#fff' : COLORS.text }}>{farm}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              );
            })()}

            <View style={[s.receiptCard, { marginBottom: SPACING.md }]}>
              <View style={s.receiptHeader}>
                <View>
                  <Text style={s.receiptTitle}>Descriptive Summary</Text>
                  <Text style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 }}>
                    {selectedFarm === 'All' ? 'All District Block Farms' : selectedFarm}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Analytics', { blockFarm: selectedFarm })}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primaryBg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.xs }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }}>Open Analytics</Text>
                  <Ionicons name="chevron-forward" size={12} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <View style={s.receiptDivider} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: SPACING.sm }}>
                {(() => {
                  const isAll = selectedFarm === 'All' || selectedFarm === 'All Block Farms';
                  const farmFields = isAll 
                    ? MOCK_FIELDS 
                    : MOCK_FIELDS.filter(f => (f.blockFarm || resolveFieldBlockFarm(f)) === selectedFarm || f.blockFarmId === selectedFarm);
                  const farmFieldIds = farmFields.map(f => f.id);
                  const farmLogs = MOCK_LOGS.filter(l => farmFieldIds.includes(l.fieldId));

                  const totalHa = farmFields.reduce((sum, f) => sum + (parseFloat(f.ha) || 1.5), 0);
                  const uniqueFarms = isAll ? (blockFarms.length || 1) : 1;
                  const uniqueMembers = new Set(farmFields.map(f => f.member || f.memberName || resolveFieldMember(f)).filter(Boolean)).size || farmFields.length;
                  const fManagers = isAll ? (users.filter(u => u.role === 'Farm Manager').length || 1) : 1;
                  const totalCost = farmLogs.reduce((sum, l) => sum + (Number(l.totalCost || l.cost) || 0), 0);
                  const costPerHa = totalHa > 0 ? Math.round(totalCost / totalHa) : 0;
                  const compiledLogsCount = farmLogs.length;

                  return [
                    {
                      label: t('stat_total_ha', 'Total Hectares'),
                      value: `${totalHa.toFixed(1)} Ha`,
                      icon: 'map-outline',
                      color: COLORS.primary,
                    },
                    {
                      label: t('stat_block_farms', 'Block Farms'),
                      value: `${uniqueFarms} ${t('farms_unit', 'Farms')}`,
                      icon: 'grid-outline',
                      color: '#4A7C2F',
                    },
                    {
                      label: t('stat_active_members', 'Active Members'),
                      value: `${uniqueMembers} ${t('members_unit', 'Members')}`,
                      icon: 'people-outline',
                      color: '#1A6B9A',
                    },
                    {
                      label: t('stat_farm_managers', 'Farm Managers'),
                      value: `${fManagers.length > 0 ? fManagers.length : 1} ${t('managers_unit', 'Managers')}`,
                      icon: 'briefcase-outline',
                      color: '#8F3A8F',
                    },
                    {
                      label: 'Avg Direct Cost',
                      value: `₱${costPerHa.toLocaleString()} / Ha`,
                      icon: 'cash-outline',
                      color: '#D97706',
                    },
                    {
                      label: t('stat_recorded_logs', 'Compiled Logs'),
                      value: `${compiledLogsCount.toLocaleString()} ${t('logs_unit', 'Logs')}`,
                      icon: 'checkmark-circle-outline',
                      color: COLORS.success,
                    },
                  ].map(stat => (
                    <View key={stat.label} style={{ width: '48%', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.sm, gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name={stat.icon} size={14} color={stat.color} />
                        <Text style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 }} numberOfLines={1}>{stat.label}</Text>
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: stat.color }} numberOfLines={1}>{stat.value}</Text>
                    </View>
                  ));
                })()}
              </View>
            </View>

            {/* Scanner Card */}
            <TouchableOpacity style={s.scannerCard} onPress={() => setShowScanner(true)}>
              <View style={s.scannerIcon}>
                <Ionicons name="qr-code" size={48} color={COLORS.primary} />
              </View>
              <Text style={s.scannerTitle}>{t('scanner_title', 'Scan Manager QR Code')}</Text>
              <Text style={s.scannerSub}>{t('scanner_sub', "Point camera at the Farm Manager's phone screen to import this month's compiled field report.")}</Text>
              <View style={s.scannerBtn}>
                <Ionicons name="camera-outline" size={18} color="#fff" />
                <Text style={s.scannerBtnText}>{t('open_scanner_btn', 'Open QR Scanner')}</Text>
              </View>
            </TouchableOpacity>

            {/* Manual QR Input Fallback */}
            <View style={{ backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, ...SHADOW.card }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8, letterSpacing: 1 }}>{t('or_enter_manually', 'OR ENTER MANUALLY')}</Text>
              <TextInput 
                style={{ backgroundColor: '#f2f4ef', borderRadius: 8, padding: 12, fontSize: 14, fontWeight: '700', letterSpacing: 2, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 }}
                placeholder="HUG-XXXXXX-XXXX"
                placeholderTextColor={COLORS.textMuted}
                value={manualQR}
                onChangeText={setManualQR}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={{ backgroundColor: manualQR.length > 0 ? COLORS.primary : COLORS.border, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                disabled={manualQR.length === 0}
                onPress={() => {
                  setManualQR('');
                  Alert.alert(
                    t('report_loaded_title', 'Report Loaded Successfully'),
                    `May 2026 Block Farm Report loaded.\n\n• ${uniqueFieldsCount} fields\n• ${totalLogsCount} operation logs\n• Total cost: Php ${totalOperationalCost.toLocaleString()}\n• Manager: Jose Reyes`,
                    [{ text: t('btn_view_report', 'View Report'), style: 'default' }]
                  );
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: manualQR.length > 0 ? '#fff' : COLORS.textMuted }}>{t('btn_submit_manual_id', 'Submit Manual ID')}</Text>
              </TouchableOpacity>
            </View>

            {/* Last Audit Summary Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs }}>
              <Text style={[s.sectionLabel, { marginBottom: 0 }]}>{t('last_scanned_report', 'Last Scanned Report')}</Text>
              <TouchableOpacity onPress={() => setShowAuditHistoryModal(true)}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: COLORS.primary }}>{t('monthly_audit_history_tab', 'Audit History')} →</Text>
              </TouchableOpacity>
            </View>
            <View style={s.auditCard}>
              <View style={s.auditHeader}>
                <Ionicons name="document-text" size={18} color={COLORS.primary} />
                <Text style={s.auditTitle}>Block Farm — May 2026 Report</Text>
              </View>
              <View style={s.auditRow}><Text style={s.auditLabel}>{t('report_fields_reported', 'Total Fields Reported')}</Text><Text style={s.auditVal}>{uniqueFieldsCount} fields</Text></View>
              <View style={s.auditRow}><Text style={s.auditLabel}>{t('report_total_cost', 'Total Operational Cost')}</Text><Text style={s.auditVal}>Php {totalOperationalCost.toLocaleString()}</Text></View>
              <View style={s.auditRow}><Text style={s.auditLabel}>{t('report_compiled_logs', 'Compiled Operation Logs')}</Text><Text style={s.auditVal}>{totalLogsCount} logs</Text></View>
              <View style={s.auditRow}><Text style={s.auditLabel}>{t('report_generated_date', 'Report Generated')}</Text><Text style={s.auditVal}>May 21, 2026</Text></View>
              <TouchableOpacity 
                style={s.pdfBtn}
                onPress={() => {
                  Alert.alert(
                    'Exporting PDF',
                    `Generating District Operations Report for ${selectedFarm}...`,
                    [
                      { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
                      { 
                        text: 'Download', 
                        onPress: () => Alert.alert('Success', 'HUGPONG_District_Ops_Report.pdf has been securely saved to your device Downloads folder.')
                      }
                    ]
                  );
                }}
              >
                <Ionicons name="download-outline" size={16} color={COLORS.primary} />
                <Text style={s.pdfBtnText}>Export PDF Report</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

      </ScrollView>

      {/* ── Add / Edit Log Full-Screen Modal ── */}
      <Modal visible={showLog} animationType="slide" onRequestClose={closeLog}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={s.sheetHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.sheetTitle}>{logForm.id ? t('log_modal_edit_title', 'Edit Log') : t('log_modal_record_title', 'Record Field Operation')}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 1 }}>Field {logForm.fieldId || selectedField.id} ({selectedField.ha} Ha)</Text>
            </View>
            <TouchableOpacity onPress={closeLog} style={{ padding: 4 }}><Ionicons name="close" size={24} color={COLORS.text} /></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={s.sheetBody} keyboardShouldPersistTaps="handled">

            {/* Target Operation & Connected Stage Banner */}
            <View style={{ backgroundColor: '#F0F8EC', borderRadius: RADIUS.md, padding: 14, borderWidth: 1.5, borderColor: COLORS.primary, marginBottom: SPACING.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ionicons name="construct" size={22} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ backgroundColor: COLORS.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.xs }}>
                      <Text style={{ fontSize: 11, fontWeight: '900', color: '#fff' }}>{logForm.sraOperationId || 'SRA'}</Text>
                    </View>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.primary, textTransform: 'uppercase' }}>{t('log_target_op', 'Target Operation')}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: COLORS.text, marginTop: 3 }}>
                    {formatOperationName ? formatOperationName(logForm.operationName || logForm.activity) : (logForm.operationName || logForm.activity || 'Field Operation')}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    <Ionicons name="git-branch-outline" size={12} color={COLORS.primary} />
                    <Text style={{ fontSize: 12, fontWeight: '800', color: COLORS.primary }}>
                      {t('log_connected_to', 'Connected to:')} {formatStageName ? formatStageName(logForm.stageName || (logForm.stageNumber ? `Stage ${logForm.stageNumber}` : 'Stage 1: Pre-Planting & Land Preparation')) : (logForm.stageName || 'Stage 1')}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11.5, color: COLORS.textSecondary, marginTop: 3 }}>
                    {t('log_std_cost', 'Standard Cost')}: ₱ {Number(SRA_OPERATIONS_CATALOGUE.find(o => o.id === logForm.sraOperationId)?.costPerHa || 0).toLocaleString()} / hectare
                  </Text>
                </View>
                <View style={{ padding: 6, backgroundColor: '#E2EED9', borderRadius: RADIUS.xs }}>
                  <Ionicons name="lock-closed" size={16} color={COLORS.primary} />
                </View>
              </View>
            </View>

            {/* Field Plot Selector */}
            <Text style={[s.formLabel, { fontSize: 13, fontWeight: '700', marginBottom: 6 }]}>{t('log_field_plot', 'Field Plot')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginBottom: SPACING.md }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 8 }}>
              {MOCK_FIELDS.filter(f => f.member === getCurrentSession().name || f.id === selectedField.id).map(field => (
                <TouchableOpacity
                  key={field.id}
                  style={[
                    { paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff' },
                    logForm.fieldId === field.id && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg }
                  ]}
                  onPress={() => setLogForm(p => ({ ...p, fieldId: field.id }))}
                >
                  <Text style={{ fontSize: 14, fontWeight: logForm.fieldId === field.id ? '900' : '600', color: logForm.fieldId === field.id ? COLORS.primary : COLORS.text }}>{field.id}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Date Picker Button */}
            <Text style={[s.formLabel, { fontSize: 13, fontWeight: '700', marginBottom: 6 }]}>{t('log_date_of_op', 'Date of Operation')}</Text>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAF5', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 12, marginBottom: SPACING.md }}
              onPress={() => setShowCalendar(true)}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }}>{logForm.period || t('log_tap_date', 'Tap to select date')}</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary }}>{t('btn_change_date', 'Change Date')}</Text>
            </TouchableOpacity>

            {/* Hectares & Workers Side-by-Side */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: SPACING.md }}>
              <View style={{ flex: 1 }}>
                <Text style={[s.formLabel, { fontSize: 13, fontWeight: '700', marginBottom: 6 }]}>{t('log_ha_covered', 'Hectares Covered')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAF5', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 12 }}>
                  <TextInput
                    style={{ flex: 1, height: 48, fontSize: 16, fontWeight: '800', color: COLORS.text }}
                    value={logForm.hectares}
                    onChangeText={v => {
                      setLogForm(p => ({ ...p, hectares: v }));
                      if (logForm.sraOperationId) selectSraOperation(logForm.sraOperationId, v);
                    }}
                    keyboardType="decimal-pad"
                    placeholder='1.5'
                    placeholderTextColor={COLORS.textMuted}
                  />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.textMuted }}>Ha</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.formLabel, { fontSize: 13, fontWeight: '700', marginBottom: 6 }]}>{t('log_workers_crew', 'Workers / Crew')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAF5', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 12 }}>
                  <TextInput
                    style={{ flex: 1, height: 48, fontSize: 16, fontWeight: '800', color: COLORS.text }}
                    value={logForm.people}
                    onChangeText={v => setLogForm(p => ({ ...p, people: v }))}
                    keyboardType="number-pad"
                    placeholder='2'
                    placeholderTextColor={COLORS.textMuted}
                  />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.textMuted }}>Pax</Text>
                </View>
              </View>
            </View>

            {/* ── Member Choice: Structure Mode Switcher ── */}
            <View style={{ marginBottom: SPACING.md }}>
              <Text style={[s.formLabel, { fontSize: 13, fontWeight: '700', marginBottom: 6 }]}>{t('log_input_style', 'Input Style (Member Choice)')}</Text>
              <View style={{ flexDirection: 'row', backgroundColor: '#EDEFE9', borderRadius: RADIUS.sm, padding: 3 }}>
                <TouchableOpacity
                  style={[
                    { flex: 1, paddingVertical: 8, paddingHorizontal: 10, borderRadius: RADIUS.xs, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
                    logForm.isGroup && { backgroundColor: '#fff', ...SHADOW.card }
                  ]}
                  onPress={() => {
                    if (!logForm.isGroup) {
                      const defaultItems = (logForm.subItems && logForm.subItems.length > 0)
                        ? logForm.subItems
                        : [{ id: `SI-${Date.now()}`, description: `${logForm.operationName || 'Operation'} Material/Labor`, qty: parseFloat(logForm.inputQty) || 1, unit: logForm.inputUnit || 'ha', unitCost: parseFloat(logForm.directRate) || 1000, subTotal: Math.round((parseFloat(logForm.inputQty) || 1) * (parseFloat(logForm.directRate) || 1000)) }];
                      const totalCost = defaultItems.reduce((sum, item) => sum + (item.subTotal || 0), 0);
                      setLogForm(p => ({ ...p, isGroup: true, inputType: 'group', subItems: defaultItems, cost: String(totalCost) }));
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="layers-outline" size={16} color={logForm.isGroup ? '#6D28D9' : COLORS.textMuted} />
                  <Text style={{ fontSize: 12, fontWeight: logForm.isGroup ? '900' : '700', color: logForm.isGroup ? '#6D28D9' : COLORS.textSecondary, textAlign: 'center', flexShrink: 1 }} numberOfLines={1} adjustsFontSizeToFit>{t('mode_title_child', 'Title with Child Items')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    { flex: 1, paddingVertical: 8, paddingHorizontal: 10, borderRadius: RADIUS.xs, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
                    !logForm.isGroup && { backgroundColor: '#fff', ...SHADOW.card }
                  ]}
                  onPress={() => {
                    if (logForm.isGroup) {
                      const totalFromSub = (logForm.subItems || []).reduce((sum, item) => sum + (item.subTotal || 0), 0);
                      const haVal = parseFloat(logForm.hectares) || 1.0;
                      const directRate = Math.round(totalFromSub / haVal) || 1000;
                      setLogForm(p => ({
                        ...p,
                        isGroup: false,
                        inputType: 'direct',
                        inputQty: String(haVal),
                        inputUnit: 'ha',
                        directRate: String(directRate),
                        cost: String(totalFromSub || Math.round(haVal * directRate))
                      }));
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={16} color={!logForm.isGroup ? '#15803D' : COLORS.textMuted} />
                  <Text style={{ fontSize: 12, fontWeight: !logForm.isGroup ? '900' : '700', color: !logForm.isGroup ? '#15803D' : COLORS.textSecondary, textAlign: 'center', flexShrink: 1 }} numberOfLines={1} adjustsFontSizeToFit>{t('mode_direct_input', 'Direct Input')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Input Section: Title-Only Group vs Direct Input Operation ── */}
            {logForm.isGroup ? (
              /* CASE A: Title Only Group (e.g. Basal Fertilization) -> Inputs in Child Items */
              <View style={{ backgroundColor: '#F8FAF5', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: SPACING.md, gap: 12, marginBottom: SPACING.md }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="list-circle" size={20} color={COLORS.primary} />
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.text }}>{t('log_child_materials', 'Child Materials & Labor')}</Text>
                      <Text style={{ fontSize: 10.5, color: COLORS.textMuted }}>{t('log_child_sub', 'Inputs are recorded per child item')}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted }}>{logForm.subItems?.length || 0} item{(logForm.subItems?.length || 0) !== 1 ? 's' : ''}</Text>
                </View>

                {(logForm.subItems || []).map((item, index) => (
                  <View key={item.id || index} style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 12, gap: 8, ...SHADOW.card }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase' }}>{t('log_item_num', 'Item #')}{index + 1}</Text>
                      <TouchableOpacity onPress={() => removeSubItemRow(index)} style={{ padding: 4 }}>
                        <Ionicons name="trash-outline" size={18} color="#D9534F" />
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      style={{ fontSize: 14.5, fontWeight: '700', color: COLORS.text, backgroundColor: '#F8FAF5', borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm, paddingHorizontal: 12, paddingVertical: 8 }}
                      value={item.description}
                      onChangeText={v => updateSubItemRow(index, 'description', v)}
                      placeholder='e.g. 46-0-0 Urea / DAP / Labor Crew'
                      placeholderTextColor={COLORS.textMuted}
                    />

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: '700', marginBottom: 3 }}>{t('log_qty', 'Quantity')}</Text>
                        <TextInput
                          style={{ height: 42, backgroundColor: '#F8FAF5', borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm, paddingHorizontal: 10, fontSize: 14, fontWeight: '800', color: COLORS.text }}
                          value={String(item.qty || '')}
                          onChangeText={v => updateSubItemRow(index, 'qty', v)}
                          keyboardType="decimal-pad"
                          placeholder='1'
                        />
                      </View>

                      <View style={{ flex: 1.4 }}>
                        <Text style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: '700', marginBottom: 3 }}>{t('log_unit_price', 'Unit Price (₱)')}</Text>
                        <TextInput
                          style={{ height: 42, backgroundColor: '#F8FAF5', borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm, paddingHorizontal: 10, fontSize: 14, fontWeight: '800', color: COLORS.text }}
                          value={String(item.unitCost || '')}
                          onChangeText={v => updateSubItemRow(index, 'unitCost', v)}
                          keyboardType="decimal-pad"
                          placeholder='₱ 0'
                        />
                      </View>
                    </View>

                    {/* Unit Selector Chips */}
                    <View>
                      <Text style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: '700', marginBottom: 4 }}>{t('log_select_unit', 'Select Unit:')}</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                        {['bag', 'ha', 'pass', 'lac', 'ton', 'days', 'pax', 'liters'].map(u => (
                          <TouchableOpacity
                            key={u}
                            style={[
                              { paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, backgroundColor: '#fff' },
                              item.unit === u && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg }
                            ]}
                            onPress={() => updateSubItemRow(index, 'unit', u)}
                          >
                            <Text style={{ fontSize: 11.5, fontWeight: '700', color: item.unit === u ? COLORS.primary : COLORS.textSecondary }}>{u}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 6, marginTop: 2 }}>
                      <Text style={{ fontSize: 11, color: COLORS.textMuted }}>{item.unit === 'lac' ? 'Note: 1 lac = 10,000 points' : ''}</Text>
                      <Text style={{ fontSize: 14, fontWeight: '900', color: COLORS.text }}>{t('log_subtotal', 'Subtotal:')} ₱ {(item.subTotal || 0).toLocaleString()}</Text>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.primary, borderStyle: 'dashed', borderRadius: RADIUS.md, paddingVertical: 12 }}
                  onPress={addCustomSubItem}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add-circle" size={20} color={COLORS.primary} />
                  <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.primary, textAlign: 'center', flexShrink: 1 }} numberOfLines={1} adjustsFontSizeToFit>{t('log_add_expense', 'Add Expense / Material')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* CASE B: Direct Single Operation (e.g. Soil Sampling, Hauling) -> Direct Inputs */
              <View style={{ backgroundColor: '#F8FAF5', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: SPACING.md, gap: 12, marginBottom: SPACING.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.text }}>{t('log_direct_inputs', 'Direct Operation Inputs')}</Text>
                    <Text style={{ fontSize: 10.5, color: COLORS.textMuted }}>{t('log_direct_sub', 'Record direct quantity and rate for this operation')}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: '700', marginBottom: 4 }}>Quantity</Text>
                    <TextInput
                      style={{ height: 44, backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.sm, paddingHorizontal: 12, fontSize: 15, fontWeight: '800', color: COLORS.text }}
                      value={String(logForm.inputQty || '')}
                      onChangeText={v => {
                        const q = parseFloat(v) || 0;
                        const r = parseFloat(logForm.directRate) || 0;
                        setLogForm(p => ({ ...p, inputQty: v, cost: String(Math.round(q * r)) }));
                      }}
                      keyboardType="decimal-pad"
                      placeholder="1"
                      placeholderTextColor={COLORS.textMuted}
                    />
                  </View>

                  <View style={{ flex: 1.4 }}>
                    <Text style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: '700', marginBottom: 4 }}>{t('log_unit_rate', 'Unit Rate / Cost (₱)')}</Text>
                    <TextInput
                      style={{ height: 44, backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.sm, paddingHorizontal: 12, fontSize: 15, fontWeight: '800', color: COLORS.text }}
                      value={String(logForm.directRate || '')}
                      onChangeText={v => {
                        const r = parseFloat(v) || 0;
                        const q = parseFloat(logForm.inputQty) || 0;
                        setLogForm(p => ({ ...p, directRate: v, cost: String(Math.round(q * r)) }));
                      }}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor={COLORS.textMuted}
                    />
                  </View>
                </View>

                {/* Unit Selector Chips */}
                <View>
                  <Text style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: '700', marginBottom: 4 }}>Select Unit:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                    {['ha', 'ton', 'lac', 'pass', 'bag', 'days', 'pax', 'liters'].map(u => (
                      <TouchableOpacity
                        key={u}
                        style={[
                          { paddingHorizontal: 12, paddingVertical: 7, borderRadius: RADIUS.sm, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff' },
                          logForm.inputUnit === u && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg }
                        ]}
                        onPress={() => setLogForm(p => ({ ...p, inputUnit: u }))}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '800', color: logForm.inputUnit === u ? COLORS.primary : COLORS.textSecondary }}>{u}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}

            {/* High-Visibility Cost Summary Card */}
            <View style={{ backgroundColor: '#1E4D2B', borderRadius: RADIUS.lg, padding: 16, marginBottom: SPACING.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#D4EAD6', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('log_total_cost', 'Total Operation Cost')}</Text>
                  <Text style={{ fontSize: 26, fontWeight: '900', color: '#fff', marginTop: 2 }}>₱ {Number(logForm.cost || 0).toLocaleString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.sm }}>
                  <Text style={{ fontSize: 10.5, fontWeight: '700', color: '#D4EAD6' }}>{t('log_per_ha', 'Per Hectare')}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginTop: 1 }}>
                    ₱ {Math.round((Number(logForm.cost || 0)) / Math.max(parseFloat(logForm.hectares) || 1, 0.1)).toLocaleString()} / ha
                  </Text>
                </View>
              </View>
            </View>

            {/* Big Action Buttons */}
            <View style={{ gap: 10, marginTop: SPACING.xs, paddingBottom: SPACING.lg }}>
              <TouchableOpacity
                style={{ backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, ...SHADOW.card }}
                onPress={() => handleSaveLog(true)}
                activeOpacity={0.8}
              >
                <Ionicons name={logForm.id ? "checkmark-circle" : "paper-plane"} size={20} color="#fff" />
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 0.5 }}>
                  {logForm.id ? t('log_save_changes', 'SAVE CHANGES') : t('log_record_op', 'RECORD OPERATION')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ backgroundColor: '#FFFBF0', borderWidth: 1.5, borderColor: '#F5A623', borderRadius: RADIUS.md, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}
                onPress={() => handleSaveLog(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="document-text-outline" size={16} color="#C97A00" />
                <Text style={{ fontSize: 13.5, fontWeight: '800', color: '#C97A00' }} numberOfLines={1} adjustsFontSizeToFit>{t('log_save_draft', 'Save as Draft')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ── QR Code Display Modal ── */}
      <Modal visible={showQR} transparent animationType="fade">
        <View style={s.qrOverlay}>
          <View style={s.qrModal}>
            <Text style={s.qrModalTitle}>SRA Monthly Audit QR</Text>
            <Text style={s.qrModalSub}>May 2026 — Block Farm Kapitan Ramon, Silay</Text>
            {/* Real Scannable QR Code */}
            <View style={[s.qrBox, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: '#e2e8dc' }]}>
              <Image
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent('HUG-202605-A3F9')}` }}
                style={{ width: 190, height: 190, borderRadius: 8, backgroundColor: '#fff' }}
                resizeMode="contain"
              />
              <Text style={[s.qrCode, { marginTop: 10, letterSpacing: 2 }]}>HUG-202605-A3F9</Text>
            </View>
            <Text style={s.qrNote}>{uniqueFieldsCount} field{uniqueFieldsCount !== 1 ? 's' : ''} · {totalLogsCount} log{totalLogsCount !== 1 ? 's' : ''} · Total: Php {totalOperationalCost.toLocaleString()}</Text>
            <TouchableOpacity style={s.qrCloseBtn} onPress={() => setShowQR(false)}>
              <Text style={s.qrCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Custom Calendar Modal ── */}
      <Modal visible={showCalendar} transparent animationType="fade">
        <View style={s.qrOverlay}>
          <View style={[s.qrModal, { width: 330, padding: 0, overflow: 'hidden', borderRadius: RADIUS.xl }]}>
            
            {/* Calendar Header with Month & Year Navigation */}
            <View style={{ backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity 
                style={{ padding: 6, borderRadius: RADIUS.sm, backgroundColor: 'rgba(255,255,255,0.15)' }}
                onPress={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1))}
              >
                <Ionicons name="chevron-back" size={20} color="#fff" />
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 }}>
                  {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(calDate)}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10.5, fontWeight: '600', marginTop: 1 }}>Select Operation Date</Text>
              </View>
              <TouchableOpacity 
                style={{ padding: 6, borderRadius: RADIUS.sm, backgroundColor: 'rgba(255,255,255,0.15)' }}
                onPress={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1))}
              >
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Quick 1-Tap Preset Date Chips */}
            <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, backgroundColor: '#F8FAF5', borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
              {[
                { label: 'Today', offsetDays: 0 },
                { label: 'Yesterday', offsetDays: 1 },
                { label: '2 Days Ago', offsetDays: 2 },
              ].map(preset => (
                <TouchableOpacity
                  key={preset.label}
                  style={{ flex: 1, paddingVertical: 6, backgroundColor: '#fff', borderRadius: RADIUS.xs, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' }}
                  onPress={() => {
                    const d = new Date();
                    d.setDate(d.getDate() - preset.offsetDays);
                    const formatted = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
                    setLogForm(p => ({ ...p, period: formatted }));
                    setShowCalendar(false);
                  }}
                  activeOpacity={0.75}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={{ padding: 16, paddingBottom: 12 }}>
              {/* Day of Week Headers */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, idx) => (
                  <Text key={d + idx} style={{ width: 36, textAlign: 'center', fontSize: 11.5, color: COLORS.textMuted, fontWeight: '800' }}>{d}</Text>
                ))}
              </View>

              {/* Day Number Cells */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 6, justifyContent: 'space-between' }}>
                {Array.from({ length: new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay() }).map((_, i) => (
                  <View key={`blank-${i}`} style={{ width: 36, height: 36 }} />
                ))}
                
                {Array.from({ length: new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                  const day = i + 1;
                  const formattedMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(calDate);
                  const thisDateStr = `${formattedMonth} ${day}, ${calDate.getFullYear()}`;
                  const isSelected = (logForm.period || '').startsWith(thisDateStr);
                  const now = new Date();
                  const isToday = calDate.getFullYear() === now.getFullYear() && calDate.getMonth() === now.getMonth() && day === now.getDate();

                  return (
                    <TouchableOpacity
                      key={day}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: isSelected ? COLORS.primary : isToday ? '#E2EED9' : 'transparent',
                        borderWidth: isToday && !isSelected ? 1.5 : 0,
                        borderColor: COLORS.primary
                      }}
                      onPress={() => {
                        setLogForm(p => ({ ...p, period: thisDateStr }));
                        setShowCalendar(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{
                        fontSize: 13,
                        color: isSelected ? '#fff' : isToday ? COLORS.primary : COLORS.text,
                        fontWeight: isSelected || isToday ? '800' : '500'
                      }}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Selected Date Summary & Actions */}
            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#FAFAFA' }}>
              <TouchableOpacity style={{ flex: 1, paddingVertical: 13, alignItems: 'center' }} onPress={() => setShowCalendar(false)}>
                <Text style={{ color: COLORS.textMuted, fontWeight: '700', fontSize: 13 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, paddingVertical: 13, alignItems: 'center', backgroundColor: COLORS.primary }} onPress={() => setShowCalendar(false)}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>Confirm Date</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* ── QR Scanner Modal (SRA) ── */}
      <Modal visible={showScanner} transparent animationType="fade">
        <View style={s.scanOverlay}>
          <View style={s.scanModal}>
            <Text style={s.scanTitle}>QR Code Scanner</Text>
            <View style={s.scanViewfinder}>
              <View style={[s.scanCorner, s.scanTL]} />
              <View style={[s.scanCorner, s.scanTR]} />
              <View style={[s.scanCorner, s.scanBL]} />
              <View style={[s.scanCorner, s.scanBR]} />
              <Ionicons name="qr-code-outline" size={64} color="rgba(255,255,255,0.3)" />
              <Text style={s.scanHint}>Point camera at manager's phone screen</Text>
            </View>
            <TouchableOpacity
              style={s.scanSimBtn}
              onPress={() => {
                setShowScanner(false);
                Alert.alert(
                  'QR Scanned Successfully',
                  `May 2026 Block Farm Report loaded.\n\n• ${uniqueFieldsCount} fields\n• ${totalLogsCount} operation logs\n• Total cost: Php ${totalOperationalCost.toLocaleString()}\n• Manager: Jose Reyes`,
                  [{ text: 'View Report', style: 'default' }]
                );
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={s.scanSimBtnText}>Simulate Successful Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.scanCancelBtn} onPress={() => setShowScanner(false)}>
              <Text style={s.scanCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ── Fields Search Modal ── */}
      <Modal visible={showFieldsModal} transparent animationType="slide">
        <View style={s.overlay} />
        <View style={[s.sheet, { height: '85%' }]}>
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Block Farm Fields</Text>
            <TouchableOpacity onPress={() => { setShowFieldsModal(false); setFieldSearch(''); }}>
              <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={{ padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.background }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: RADIUS.md, paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.border }}>
              <Ionicons name="search" size={16} color={COLORS.textMuted} />
              <TextInput 
                placeholder="Search by Field ID or Member name..."
                style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 8, fontSize: 13 }}
                value={fieldSearch}
                onChangeText={setFieldSearch}
              />
              {fieldSearch.length > 0 && (
                <TouchableOpacity onPress={() => setFieldSearch('')}>
                  <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {(() => {
            const filtered = MOCK_FIELDS.filter(f => f.id.toLowerCase().includes(fieldSearch.toLowerCase()) || f.member.toLowerCase().includes(fieldSearch.toLowerCase()));
            const pageSize = 4;
            const totalPages = Math.ceil(filtered.length / pageSize) || 1;
            const curPage = Math.min(fieldsModalPage, totalPages);
            const paginated = filtered.slice((curPage - 1) * pageSize, curPage * pageSize);

            return (
              <>
                <ScrollView contentContainerStyle={{ padding: SPACING.lg, gap: 10, paddingBottom: 16 }}>
                  {filtered.length === 0 && (
                    <Text style={s.emptyText}>No fields match your search.</Text>
                  )}
                  {paginated.map(field => (
                    <View key={field.id} style={[s.receiptCard, selectedField.id === field.id && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg, marginBottom: 0 }, { marginBottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md }]}>
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                        setSelectedField(field);
                        updateSessionFieldId(field.id);
                        setShowFieldsModal(false);
                        setFieldSearch('');
                        setFieldsModalPage(1);
                      }}>
                        <View style={s.receiptHeader}>
                          <Text style={[s.receiptTitle, { color: COLORS.text }]}>{field.id}</Text>
                          <Text style={s.receiptId}>{field.ha} Ha</Text>
                        </View>
                        <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Member: <Text style={{ color: COLORS.text, fontWeight: '700' }}>{field.member}</Text></Text>
                        <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>Stage: <Text style={{ color: COLORS.text }}>{field.stage}</Text></Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                          <View style={[s.syncDot, { backgroundColor: field.synced ? COLORS.success : '#C97A00' }]} />
                          <Text style={{ fontSize: 11, fontWeight: '600', color: field.synced ? COLORS.success : '#C97A00' }}>
                            {field.synced ? `Synced (${formatSyncTime(field.lastSync)})` : `Not synced (${formatSyncTime(field.lastSync || '4 days ago')})`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {activeRole === 'Farm Manager' && (
                        <TouchableOpacity 
                          style={{ padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, marginLeft: 10, alignItems: 'center', justifyContent: 'center' }}
                          onPress={() => {
                            setShowFieldsModal(false);
                            openAssignModal(field);
                          }}
                          title="Edit Field Ownership"
                        >
                          <Ionicons name="pencil" size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </ScrollView>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: 12, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: '#fff' }}>
                    <TouchableOpacity
                      disabled={curPage === 1}
                      onPress={() => setFieldsModalPage(p => Math.max(1, p - 1))}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 12, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: curPage === 1 ? COLORS.border : COLORS.primary, backgroundColor: curPage === 1 ? '#F8F9FA' : COLORS.primaryBg, opacity: curPage === 1 ? 0.6 : 1 }}
                    >
                      <Ionicons name="chevron-back" size={14} color={curPage === 1 ? COLORS.textMuted : COLORS.primary} />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: curPage === 1 ? COLORS.textMuted : COLORS.primary }}>Prev</Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textSecondary }}>
                      Page {curPage} of {totalPages} ({filtered.length} Fields)
                    </Text>

                    <TouchableOpacity
                      disabled={curPage === totalPages}
                      onPress={() => setFieldsModalPage(p => Math.min(totalPages, p + 1))}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 12, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: curPage === totalPages ? COLORS.border : COLORS.primary, backgroundColor: curPage === totalPages ? '#F8F9FA' : COLORS.primaryBg, opacity: curPage === totalPages ? 0.6 : 1 }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '700', color: curPage === totalPages ? COLORS.textMuted : COLORS.primary }}>Next</Text>
                      <Ionicons name="chevron-forward" size={14} color={curPage === totalPages ? COLORS.textMuted : COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            );
          })()}
        </View>
      </Modal>

      {/* ── Audit History & Monthly Breakdown Modal ── */}
      <AuditHistoryModal
        visible={showAuditHistoryModal}
        onClose={() => setShowAuditHistoryModal(false)}
        onOpenQR={() => {
          setShowAuditHistoryModal(false);
          handleGenerateAudit();
        }}
      />

      {/* ── Manager Assign Field Modal ── */}
      <Modal visible={showManagerAssignModal} transparent animationType="slide">
        <View style={s.overlay} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>{managerAssignForm.isEditing ? 'Edit Field Plot & Ownership' : 'Assign Field to Member'}</Text>
            <TouchableOpacity onPress={() => setShowManagerAssignModal(false)}>
              <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={s.sheetBody}>
            <View style={{ gap: 4 }}>
              <Text style={s.formLabel}>Field ID <Text style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: '400' }}>({managerAssignForm.isEditing ? 'Registered Plot ID' : 'Auto-generated'})</Text></Text>
              <View style={[s.formInput, { backgroundColor: '#F4F7F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                <Text style={{ fontSize: 14, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: COLORS.primary }}>
                  {managerAssignForm.fieldId}
                </Text>
                <View style={{ backgroundColor: COLORS.primaryBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.primary }}>{managerAssignForm.isEditing ? 'Plot ID' : 'Auto-assigned'}</Text>
                </View>
              </View>
            </View>
            <View style={{ gap: 4 }}>
              <Text style={s.formLabel}>Assigned Member User ID <Text style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: '400' }}>(Phone / Account ID)</Text></Text>
              <TextInput style={s.formInput} placeholder="e.g. 09176543210" value={managerAssignForm.userId} onChangeText={t => setManagerAssignForm({...managerAssignForm, userId: t})} keyboardType="phone-pad" />
            </View>
            <View style={{ gap: 4 }}>
              <Text style={s.formLabel}>Declared Area (Ha)</Text>
              <TextInput style={s.formInput} placeholder="e.g. 1.5" keyboardType="numeric" value={managerAssignForm.ha} onChangeText={t => setManagerAssignForm({...managerAssignForm, ha: t})} />
            </View>
            <View style={s.sheetFooter}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowManagerAssignModal(false)}><Text style={s.cancelBtnText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={s.submitBtn} onPress={() => {
                if(!managerAssignForm.userId || !managerAssignForm.fieldId || !managerAssignForm.ha) {
                  Alert.alert('Error', 'Please fill in all required fields.');
                  return;
                }
                const session = getCurrentSession();
                const existing = MOCK_FIELDS.find(f => f.id === managerAssignForm.fieldId);
                if (existing) {
                  existing.member = managerAssignForm.userId;
                  existing.userId = managerAssignForm.userId;
                  existing.memberContact = managerAssignForm.userId;
                  existing.ha = managerAssignForm.ha;
                  if (selectedField.id === existing.id) {
                    setSelectedField({ ...selectedField, member: managerAssignForm.userId, userId: managerAssignForm.userId, ha: managerAssignForm.ha });
                  }
                } else {
                  const newField = {
                    id: managerAssignForm.fieldId,
                    member: managerAssignForm.userId,
                    userId: managerAssignForm.userId,
                    memberContact: managerAssignForm.userId,
                    ha: managerAssignForm.ha,
                    stage: 'Land Preparation',
                    month: 0,
                    synced: false,
                    lastSync: 'Just now',
                    blockFarm: session.farm || 'Nacayao Block Farm'
                  };
                  MOCK_FIELDS.push(newField);
                  setSelectedField(newField);
                }
                Alert.alert('Success', `Field plot ${managerAssignForm.fieldId} assigned to User ID: ${managerAssignForm.userId}.`);
                setShowManagerAssignModal(false);
                setManagerAssignForm({ userId: '', fieldId: '', ha: '', isEditing: false });
              }}>
                <Text style={s.submitBtnText}>{managerAssignForm.isEditing ? 'Save Changes' : 'Assign Field'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Crop Cycle Selection Modal ── */}
      <Modal visible={showCycleModal} transparent animationType="slide">
        <View style={s.overlay} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <View style={s.sheetHeader}>
            <View>
              <Text style={s.sheetTitle}>Crop Cycle Configuration</Text>
              <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>Field {selectedField.id} ({selectedField.ha} Ha)</Text>
            </View>
            <TouchableOpacity onPress={() => setShowCycleModal(false)}>
              <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={s.sheetBody}>
            <Text style={s.formLabel}>Select Sugarcane Cycle Type *</Text>
            <View style={{ gap: 8, marginBottom: SPACING.md }}>
              {[
                { type: 'Plant Cane (New Plant)', duration: '12–14 months', icon: 'leaf', desc: 'New planting cycle: Full soil prep, canepoints planting, basal & top-dress.' },
                { type: '1st Ratoon (Ratoon 1)', duration: '10–12 months', icon: 'git-branch', desc: 'First ratoon stubble shaving, trash blanketing, off-barring & fertilization.' },
                { type: '2nd Ratoon (Ratoon 2)', duration: '10–12 months', icon: 'water', desc: 'Second ratoon maintenance, cultivation, fertilization & harvesting.' }
              ].map(item => {
                const isSel = cycleTypeForm.cycleType === item.type;
                return (
                  <TouchableOpacity
                    key={item.type}
                    style={[
                      { padding: 12, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff', gap: 3 },
                      isSel && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg }
                    ]}
                    onPress={() => setCycleTypeForm(p => ({ ...p, cycleType: item.type }))}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name={item.icon} size={16} color={isSel ? COLORS.primary : COLORS.textSecondary} />
                        <Text style={{ fontSize: 13, fontWeight: '800', color: isSel ? COLORS.primary : COLORS.text }}>{item.type}</Text>
                      </View>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: isSel ? COLORS.primary : COLORS.textMuted }}>{item.duration}</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 15 }}>{item.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={s.formLabel}>Select Crop Year (CY) *</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: SPACING.lg }}>
              {['CY 2025–2026', 'CY 2026–2027', 'CY 2027–2028'].map(cy => {
                const isSel = cycleTypeForm.cropYear === cy;
                return (
                  <TouchableOpacity
                    key={cy}
                    style={[
                      { flex: 1, paddingVertical: 10, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff', alignItems: 'center' },
                      isSel && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg }
                    ]}
                    onPress={() => setCycleTypeForm(p => ({ ...p, cropYear: cy }))}
                  >
                    <Text style={{ fontSize: 11.5, fontWeight: isSel ? '800' : '600', color: isSel ? COLORS.primary : COLORS.text }}>{cy}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={s.sheetFooter}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowCycleModal(false)}>
                <Text style={s.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.submitBtn}
                onPress={() => {
                  const newStages = (CROP_CYCLE_STAGES_BY_TYPE[cycleTypeForm.cycleType] || CROP_CYCLE_STAGES_BY_TYPE['Plant Cane (New Plant)']).map(s => ({ ...s }));
                  const activeStg = newStages.find(s => s.active) || newStages[0];
                  
                  const updatedField = {
                    ...selectedField,
                    cycleType: cycleTypeForm.cycleType,
                    cropYear: cycleTypeForm.cropYear,
                    stage: activeStg.name
                  };
                  setSelectedField(updatedField);
                  setCycleTasksByField(p => ({
                    ...p,
                    [selectedField.id]: newStages
                  }));

                  const mf = MOCK_FIELDS.find(f => f.id === selectedField.id);
                  if (mf) {
                    mf.cycleType = cycleTypeForm.cycleType;
                    mf.cropYear = cycleTypeForm.cropYear;
                    mf.stage = activeStg.name;
                  }
                  notifyDataUpdate();
                  setShowCycleModal(false);
                  Alert.alert('Crop Cycle Updated', `${selectedField.id} is now set to ${cycleTypeForm.cycleType} (${cycleTypeForm.cropYear}) with its 5 growth stages.`);
                }}
              >
                <Text style={s.submitBtnText}>Save Cycle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Stage Editor Modal ── */}
      <Modal visible={showStageEditor} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, maxHeight: height * 0.88 }}>
            <View style={s.sheetHandle} />
            <View style={s.sheetHeader}>
              <View>
                <Text style={s.sheetTitle}>{t('btn_stage_editor', 'Field Stages')}</Text>
                <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>{selectedField.id} · {t('stage_reorder_hint', 'tap icons to reorder or remove')}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowStageEditor(false)}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: SPACING.lg, gap: 10, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">

              {/* Current stages list */}
              {editingStages.length === 0 && (
                <View style={[s.emptyCard, { marginBottom: 8 }]}>
                  <Ionicons name="list-outline" size={28} color={COLORS.border} />
                  <Text style={s.emptyText}>{t('no_stages_yet', 'No stages yet. Add your first stage below.')}</Text>
                </View>
              )}
              {editingStages.map((stage, idx) => {
                const hasLogs = logs.some(l => l.fieldId === selectedField.id && l.taskId === stage.id && !l.isPastCycle);
                return (
                  <View key={stage.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: RADIUS.md, padding: 12, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.card }}>
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: stage.color, flexShrink: 0 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }}>{getTaskLabel(stage)}</Text>
                      {stage.done && <Text style={{ fontSize: 10, color: COLORS.success, marginTop: 2 }}>{t('status_completed', 'Completed')}</Text>}
                      {stage.active && <Text style={{ fontSize: 10, color: stage.color, marginTop: 2 }}>{t('status_in_progress', 'In Progress')}</Text>}
                      {!stage.done && !stage.active && <Text style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>{t('status_pending', 'Pending')}</Text>}
                      {hasLogs && <Text style={{ fontSize: 10, color: '#C97A00', marginTop: 2 }}>{t('stage_has_logs', 'Has submitted logs')}</Text>}
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <TouchableOpacity
                        disabled={idx === 0}
                        onPress={() => {
                          const updated = [...editingStages];
                          [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                          setEditingStages(updated);
                        }}
                        style={{ padding: 6, opacity: idx === 0 ? 0.3 : 1 }}
                      >
                        <Ionicons name="chevron-up" size={18} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={idx === editingStages.length - 1}
                        onPress={() => {
                          const updated = [...editingStages];
                          [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                          setEditingStages(updated);
                        }}
                        style={{ padding: 6, opacity: idx === editingStages.length - 1 ? 0.3 : 1 }}
                      >
                        <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          if (hasLogs) {
                            Alert.alert('Cannot Remove', `"${getTaskLabel(stage)}" ${t('cannot_remove_stage_with_logs', 'has submitted logs. You cannot remove it while logs exist for this stage.')}`);
                            return;
                          }
                          Alert.alert(t('remove_stage_confirm', 'Remove Stage'), `${t('remove_stage_confirm', 'Remove')} "${getTaskLabel(stage)}"?`, [
                            { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
                            { text: t('btn_delete', 'Remove'), style: 'destructive', onPress: () => setEditingStages(prev => prev.filter((_, i) => i !== idx)) }
                          ]);
                        }}
                        style={{ padding: 6 }}
                      >
                        <Ionicons name="trash-outline" size={18} color="#D9534F" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}

              {/* Add new stage */}
              {(() => {
                const defaultStagesForCycle = CROP_CYCLE_STAGES_BY_TYPE[selectedField?.cycleType || 'Plant Cane (New Plant)'] || CROP_CYCLE_STAGES_BY_TYPE['Plant Cane (New Plant)'];

                return (
                  <>
                    <View style={{ marginTop: 8, backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: 14, gap: 10 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }}>{t('add_new_stage', 'Add New Stage')}</Text>
                      
                      {/* Quick Sugarcane Stage Presets */}
                      <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textSecondary }}>{t('suggested_presets', 'Suggested SRA Operations (Tap to fill)')}</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -14 }} contentContainerStyle={{ paddingHorizontal: 14, gap: 6 }}>
                        {defaultStagesForCycle.map(tItem => {
                          const preset = getTaskLabel(tItem);
                          return (
                            <TouchableOpacity
                              key={tItem.id}
                              style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 }}
                              onPress={() => setNewStageLabel(preset)}
                            >
                              <Text style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' }}>+ {preset}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>

                      <TextInput
                        style={s.formInput}
                        placeholder={t('stage_name_placeholder', 'Stage name (e.g. Weeding – Hilamon)')}
                        placeholderTextColor={COLORS.textMuted}
                        value={newStageLabel}
                        onChangeText={setNewStageLabel}
                      />
                      <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textSecondary }}>{t('stage_color', 'Stage Color')}</Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {STAGE_COLORS.map(c => (
                          <TouchableOpacity key={c} onPress={() => setNewStageColor(c)}
                            style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c, borderWidth: newStageColor === c ? 3 : 0, borderColor: '#fff', ...SHADOW.card }}
                          />
                        ))}
                      </View>
                      <TouchableOpacity
                        style={[s.submitBtn, { marginTop: 4, opacity: newStageLabel.trim() ? 1 : 0.45 }]}
                        disabled={!newStageLabel.trim()}
                        onPress={() => {
                          const stage = {
                            id: generateCustomOpId(editingStages.length + 1),
                            label: newStageLabel.trim(),
                            phase: newStageLabel.trim(),
                            color: newStageColor,
                            done: false,
                            active: false, // Starts as Pending until explicitly activated
                          };
                          setEditingStages(prev => [...prev, stage]);
                          setNewStageLabel('');
                        }}
                      >
                        <Ionicons name="add" size={16} color="#fff" />
                        <Text style={s.submitBtnText}>{t('btn_add_stage', 'Add Stage')}</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Reset to SRA Default */}
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md }}
                      onPress={() => {
                        Alert.alert(t('btn_reset', 'Reset to Default'), t('reset_sra_confirm_msg', 'Replace your custom stages with the official SRA template for this crop cycle?'), [
                          { text: t('btn_cancel', 'Cancel'), style: 'cancel' },
                          { text: t('btn_reset', 'Reset'), style: 'destructive', onPress: () => setEditingStages(defaultStagesForCycle.map((t) => ({ ...t, label: getTaskLabel(t), done: false, active: false }))) }
                        ]);
                      }}
                    >
                      <Ionicons name="refresh-outline" size={14} color={COLORS.textMuted} />
                      <Text style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: '600' }}>{t('btn_reset_sra_template', 'Reset to SRA Standard Template')}</Text>
                    </TouchableOpacity>
                  </>
                );
              })()}

              {/* Save */}
              <TouchableOpacity
                style={[s.submitBtn, { marginTop: 4 }]}
                onPress={() => {
                  const updatedStages = [...editingStages];
                  updateFieldCustomStages(selectedField.id, updatedStages);
                  setCycleTasksByField(p => ({ ...p, [selectedField.id]: updatedStages }));

                  const activeTask = updatedStages.find(t => t.active);
                  const currentLabel = activeTask 
                    ? getTaskLabel(activeTask) 
                    : (updatedStages.length > 0 
                        ? (updatedStages.every(t => t.done) ? `${t('task_t11', 'Harvesting / Cutting')} (${t('status_completed', 'Completed')})` : (updatedStages.some(t => t.done) ? t('status_pending', 'Waiting to Start Next Stage') : t('status_pending', 'Not Started'))) 
                        : 'Not Started');

                  setSelectedField(prevF => ({ ...prevF, stage: currentLabel, customStages: updatedStages }));
                  const mf = MOCK_FIELDS.find(f => f.id === selectedField.id);
                  if (mf) {
                    mf.stage = currentLabel;
                    mf.customStages = updatedStages;
                  }
                  setShowStageEditor(false);
                  Alert.alert(t('saved_title', 'Saved'), t('stage_plan_saved_msg', 'Your field stages have been updated.'));
                }}
              >
                <Ionicons name="save-outline" size={16} color="#fff" />
                <Text style={s.submitBtnText}>{t('btn_save_stage_plan', 'Save Stage Plan')}</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Dedicated Full History & Ledger Modal (Full Screen) ── */}
      <Modal visible={showHistoryModal} animationType="none" onRequestClose={() => setShowHistoryModal(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          {/* Modal Header */}
          <View style={s.historyModalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.historyModalTitle}>
                {activeRole === 'SRA (Admin)' ? t('district_audit_records_title', 'District Audit History Records') : t('ledger_title', 'Field History & Ledger')}
              </Text>
              <Text style={s.historyModalSub}>
                {activeRole === 'SRA (Admin)'
                  ? t('sra_oversight_scope_sub', 'Silay SRA Regulatory Oversight Scope · District 3')
                  : `${t('my_field', 'Field')} ${selectedField.id} · ${selectedField.member}`}
              </Text>
            </View>
            <TouchableOpacity 
              style={s.historyModalCloseBtn}
              onPress={() => setShowHistoryModal(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Stat Summary Bar (Dynamic to Active Tab) */}
          {(() => {
            const scopedDrafts = draftLogs.filter(d => d.fieldId === selectedField.id);
            const submittedTotalCost = fieldLogs.reduce((sum, l) => sum + Number(l.cost || 0), 0);
            const draftsTotalCost = scopedDrafts.reduce((sum, d) => sum + Number(d.cost || 0), 0);
            const pastTotalCost = pastLogs.reduce((sum, l) => sum + Number(l.cost || 0), 0);

            let statCostLabel = t('stat_total_cost', 'Total Recorded Cost');
            let statCostValue = `Php ${submittedTotalCost.toLocaleString()}`;
            let statCostColor = COLORS.primary;
            let statCountLabel = t('stat_records', 'Submitted Records');
            let statCountValue = `${fieldLogs.length} ${t('total_records_lbl', 'Total Records')}`;

            if (logTab === 'audit_history') {
              const auditTotalCost = (MOCK_AUDIT_HISTORY || []).reduce((sum, a) => sum + Number(a.totalCost || 0), 0);
              statCostLabel = t('compiled_audited_cost_lbl', 'Compiled Audited Cost');
              statCostValue = `Php ${auditTotalCost.toLocaleString()}`;
              statCostColor = COLORS.primary;
              statCountLabel = t('verified_sra_audits_lbl', 'Verified SRA Audits');
              statCountValue = `${(MOCK_AUDIT_HISTORY || []).length} ${t('monthly_reports_lbl', 'Monthly Reports')}`;
            } else if (activeRole === 'Member') {
              if (logTab === 'drafts') {
                statCostLabel = t('estimated_draft_cost_lbl', 'Estimated Draft Cost');
                statCostValue = `Php ${draftsTotalCost.toLocaleString()}`;
                statCostColor = '#C97A00';
                statCountLabel = t('pending_draft_pipeline_lbl', 'Pending Draft Pipeline');
                statCountValue = `${scopedDrafts.length} ${t('draft_records_lbl', 'Draft Records')}`;
              } else if (logTab === 'past') {
                statCostLabel = t('past_cycles_cost_lbl', 'Past Cycles Total Cost');
                statCostValue = `Php ${pastTotalCost.toLocaleString()}`;
                statCostColor = '#64748B';
                statCountLabel = t('archived_logs_lbl', 'Archived Logs');
                statCountValue = `${pastLogs.length} ${t('past_records_lbl', 'Past Records')}`;
              }
            }

            return (
              <View style={[
                s.historyStatBar,
                activeRole === 'Member' && logTab === 'drafts' && { backgroundColor: '#FFFBF0', borderBottomColor: '#FDE68A' },
                activeRole === 'Member' && logTab === 'past' && { backgroundColor: '#F8FAFC', borderBottomColor: '#E2E8F0' },
              ]}>
                <View style={s.historyStatItem}>
                  <Text style={[s.historyStatLbl, activeRole === 'Member' && logTab === 'drafts' && { color: '#92400E' }]}>{statCostLabel}</Text>
                  <Text style={[s.historyStatVal, { color: statCostColor }]}>{statCostValue}</Text>
                </View>
                <View style={[s.historyStatItem, { borderLeftWidth: 1, borderLeftColor: activeRole === 'Member' && logTab === 'drafts' ? '#FDE68A' : COLORS.border, paddingLeft: 12 }]}>
                  <Text style={[s.historyStatLbl, activeRole === 'Member' && logTab === 'drafts' && { color: '#92400E' }]}>{statCountLabel}</Text>
                  <Text style={[s.historyStatVal, { color: statCostColor }]}>{statCountValue}</Text>
                </View>
              </View>
            );
          })()}

          {/* Ledger Sub-tabs */}
          {activeRole === 'Member' ? (
            <View style={[s.logTabsRow, { paddingHorizontal: SPACING.lg, marginBottom: 8 }]}>
              <TouchableOpacity style={[s.logTabBtn, logTab === 'submitted' && s.logTabBtnActive]} onPress={() => setLogTab('submitted')}>
                <Text style={[s.logTabText, logTab === 'submitted' && s.logTabTextActive]}>{t('tab_submitted', 'Submitted')} ({fieldLogs.length})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.logTabBtn, logTab === 'drafts' && s.logTabBtnActive]} onPress={() => setLogTab('drafts')}>
                <Text style={[s.logTabText, logTab === 'drafts' && s.logTabTextActive]}>
                  {t('tab_drafts', 'Drafts')} {draftLogs.filter(l => l.fieldId === selectedField.id).length > 0 && `(${draftLogs.filter(l => l.fieldId === selectedField.id).length})`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.logTabBtn, logTab === 'past' && s.logTabBtnActive]} onPress={() => setLogTab('past')}>
                <Text style={[s.logTabText, logTab === 'past' && s.logTabTextActive]}>{t('tab_past', 'Past Cycles')}</Text>
              </TouchableOpacity>
            </View>
          ) : activeRole === 'SRA (Admin)' ? (
            <View style={[s.logTabsRow, { paddingHorizontal: SPACING.lg, marginBottom: 8 }]}>
              <TouchableOpacity style={[s.logTabBtn, s.logTabBtnActive]}>
                <Text style={[s.logTabText, s.logTabTextActive]}>{t('monthly_audit_history_tab', 'Monthly Audit History')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[s.logTabsRow, { paddingHorizontal: SPACING.lg, marginBottom: 8 }]}>
              <TouchableOpacity style={[s.logTabBtn, logTab === 'submitted' && s.logTabBtnActive]} onPress={() => setLogTab('submitted')}>
                <Text style={[s.logTabText, logTab === 'submitted' && s.logTabTextActive]}>{t('tab_submitted', 'Submitted Logs')} ({fieldLogs.length})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.logTabBtn, logTab === 'audit_history' && s.logTabBtnActive]} onPress={() => setLogTab('audit_history')}>
                <Text style={[s.logTabText, logTab === 'audit_history' && s.logTabTextActive]}>{t('monthly_audit_history_tab', 'Monthly Audit History')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Scrollable Modal Body */}
          <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
            {activeRole === 'Member' ? (
              logTab === 'drafts' ? (
                renderCompactLogList(draftLogs.filter(l => l.fieldId === selectedField.id), true, false)
              ) : logTab === 'past' ? (
                <>
                  {pastLogs.length > 0 && (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        backgroundColor: '#FFF5F5',
                        borderWidth: 1,
                        borderColor: '#FED7D7',
                        borderRadius: RADIUS.md,
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        marginBottom: 12
                      }}
                      onPress={handleClearPastLogs}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="trash-outline" size={15} color="#E53E3E" />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#E53E3E' }}>
                        {t('btn_delete_past_cycles', 'Delete All Past Cycles')} ({pastLogs.length})
                      </Text>
                    </TouchableOpacity>
                  )}
                  {renderCompactLogList(pastLogs, false, false)}
                </>
              ) : (
                renderCompactLogList(fieldLogs, false, false)
              )
            ) : logTab === 'audit_history' ? (
              <View style={{ gap: SPACING.md }}>
                <Text style={s.sectionLabel}>{t('compiled_monthly_audit_title', 'Compiled Monthly Audit History')}</Text>
                {MOCK_AUDIT_HISTORY.map(audit => (
                  <View key={audit.id} style={[s.auditCard, { marginBottom: 6 }]}>
                    {/* Header: Audit ID & Status */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="document-text" size={16} color={COLORS.primary} />
                        <Text style={{ fontSize: 14.5, fontWeight: '900', color: COLORS.text }}>{formatPhaseMonth ? formatPhaseMonth(audit.month) : audit.month} {t('audit_report_suffix', 'Audit Report')}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primaryBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.xs }}>
                        <Ionicons name="checkmark-done-circle" size={13} color={COLORS.primary} />
                        <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.primary }}>{t('verified_sra_badge', 'Verified SRA')}</Text>
                      </View>
                    </View>

                    {/* Date & Time + QR Payload Signature */}
                    <View style={{ backgroundColor: '#F8FAF5', padding: 10, borderRadius: RADIUS.sm, gap: 5, borderWidth: 1, borderColor: COLORS.border }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted }}>{t('date_time_gen', 'Date & Time Generated:')}</Text>
                        <Text style={{ fontSize: 11.5, fontWeight: '800', color: COLORS.text }}>{audit.dateGenerated}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted }}>{t('qr_payload_id', 'QR Payload ID:')}</Text>
                        <Text style={{ fontSize: 10.5, fontWeight: '800', color: COLORS.primary, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>
                          {audit.qrSignature}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted }}>{t('summary_metrics_lbl', 'Summary Metrics:')}</Text>
                        <Text style={{ fontSize: 11.5, fontWeight: '800', color: COLORS.text }}>
                          {audit.fieldsReported} {t('plots_word', 'Plots')} · {audit.logsCount} {t('logs_unit', 'Logs')} · ₱{audit.totalCost.toLocaleString()}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted }}>{t('inspector_verifier', 'Inspector Verifier:')}</Text>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textSecondary }}>{audit.verifiedBy}</Text>
                      </View>
                    </View>

                    {/* Actions: View QR & Export PDF */}
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
                      <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary, paddingVertical: 10, borderRadius: RADIUS.md }}
                        onPress={handleGenerateAudit}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="qr-code-outline" size={14} color="#fff" />
                        <Text style={{ fontSize: 12, fontWeight: '800', color: '#fff' }}>{t('view_qr_code_btn', 'View SRA QR Code')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primaryBg, borderWidth: 1, borderColor: COLORS.primary + '40', paddingVertical: 10, borderRadius: RADIUS.md }}
                        onPress={() => {
                          Alert.alert('Exporting PDF', `Downloading official monthly audit report for ${audit.month}...`, [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Download', onPress: () => Alert.alert('Success', `HUGPONG_${audit.month.replace(' ', '_')}_Audit_Report.pdf saved to Downloads.`) }
                          ]);
                        }}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="download-outline" size={14} color={COLORS.primary} />
                        <Text style={{ fontSize: 12, fontWeight: '800', color: COLORS.primary }}>{t('export_pdf_btn', 'Export PDF')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              renderCompactLogList(fieldLogs, false, true)
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 32 },

  // Role switcher
  roleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  roleBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  roleBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: SPACING.lg, paddingVertical: 10 },
  bannerMember: { backgroundColor: '#4A7C2F' },
  bannerManager: { backgroundColor: '#1A6B9A' },
  bannerSRA: { backgroundColor: '#8F3A8F' },
  roleBannerText: { fontSize: 12, fontWeight: '600', color: '#fff', flex: 1, lineHeight: 17 },

  // Section
  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  // Field Card
  fieldCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: 18, gap: 8, ...SHADOW.card, borderWidth: 1, borderColor: COLORS.border },
  fieldCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fieldIdBadge: { backgroundColor: COLORS.primaryBg, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  fieldIdText: { fontSize: 15, fontWeight: '900', color: COLORS.primary },
  fieldHa: { fontSize: 14, fontWeight: '800', color: COLORS.textSecondary },
  fieldMember: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  fieldStage: { fontSize: 13, color: COLORS.textMuted },
  fieldStageVal: { fontWeight: '800', color: COLORS.text },
  fieldSync: { fontSize: 12, color: COLORS.textMuted },

  // Field Chips (Manager & Member)
  fieldChip: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 9, backgroundColor: '#fff', minHeight: 42 },
  fieldChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg },
  fieldChipText: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted },
  fieldChipTextActive: { color: COLORS.primary, fontWeight: '900' },
  syncDot: { width: 8, height: 8, borderRadius: 4 },

  // Sync Warning
  syncWarning: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FFFBF0', borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: '#FEF0D0' },
  syncWarningText: { flex: 1, fontSize: 12, color: '#8B6A00', lineHeight: 18 },

  // Receipt Card Layout (Senior Accessible)
  receiptCard: { backgroundColor: '#fff', borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.card },
  // Search & Filter
  logSearchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 4 },
  logSearchInput: { flex: 1, fontSize: 13, color: COLORS.text, padding: 0 },
  filterPill: { backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 5 },
  filterPillActive: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  filterPillText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  filterPillTextActive: { color: COLORS.primary, fontWeight: '800' },

  // Compact Log Row
  compactLogCard: { backgroundColor: '#fff', borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 10, ...SHADOW.card },
  compactLogHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  compactLogDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  compactLogTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  compactLogSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  compactLogCost: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  compactLogDrawer: { marginTop: 8, gap: 6 },
  compactLogDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 4 },

  // Show More Button
  showMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primaryBg, borderWidth: 1, borderColor: COLORS.primary + '30', borderRadius: RADIUS.md, paddingVertical: 10, marginTop: 4 },
  showMoreBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

  receiptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  receiptTitle: { fontSize: 11, fontWeight: '800', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  receiptId: { fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: COLORS.textMuted, fontWeight: '600' },
  receiptDivider: { height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#DCE8CC', borderRadius: 1, marginVertical: 4 },
  receiptBody: { gap: 8 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 4, gap: 8 },
  receiptLabel: { fontSize: 12.5, color: COLORS.textMuted, fontWeight: '600', width: 125, flexShrink: 0 },
  receiptValue: { fontSize: 12.5, color: COLORS.text, fontWeight: '700', flex: 1, textAlign: 'right' },
  receiptValueBold: { fontSize: 13.5, color: COLORS.text, fontWeight: '800', flex: 1, textAlign: 'right' },
  receiptCostText: { fontSize: 15, color: COLORS.primary, fontWeight: '900', flex: 1, textAlign: 'right' },
  receiptStatusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  receiptStatusText: { fontSize: 11, fontWeight: '700' },
  receiptApproveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.success, borderRadius: RADIUS.md, paddingVertical: 10, marginTop: 6 },
  receiptApproveBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Timeline
  timelineCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.card },
  timelineRow: { flexDirection: 'row', gap: 12, minHeight: 52 },
  timelineLeft: { width: 24, alignItems: 'center' },
  timelineDot: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  activePulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  timelineLine: { flex: 1, width: 2, marginTop: 2 },
  timelineContent: { flex: 1, paddingBottom: 16, gap: 3 },
  timelineContentActive: { backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.sm },
  timelineLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  timelineMonth: { fontSize: 10, color: COLORS.textMuted },
  activeBadge: { alignSelf: 'flex-start', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginTop: 2 },
  activeBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  // Log Tabs
  logTabsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  logTabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  logTabBtnActive: { borderBottomColor: COLORS.primary },
  logTabText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  logTabTextActive: { color: COLORS.primary, fontWeight: '700' },

  // Add Log Button
  addLogBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 7 },
  addLogBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // QR & Scanner
  qrBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.card },
  qrBtnTitle: { fontSize: 14, fontWeight: '800', color: '#fff' },
  qrBtnSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },

  // SRA Scanner Card
  scannerCard: { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', gap: SPACING.md, ...SHADOW.card, borderWidth: 2, borderColor: COLORS.primary + '30' },
  scannerIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryBg, justifyContent: 'center', alignItems: 'center' },
  scannerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  scannerSub: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 19 },
  scannerBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 20, paddingVertical: 12 },
  scannerBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // Audit Card
  auditCard: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, gap: SPACING.sm, ...SHADOW.card },
  auditHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  auditTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, flex: 1 },
  auditRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.border },
  auditLabel: { fontSize: 13, color: COLORS.textSecondary },
  auditVal: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  pdfBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 12, marginTop: 4 },
  pdfBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  // Empty
  emptyCard: { alignItems: 'center', gap: 8, paddingVertical: 32, backgroundColor: '#fff', borderRadius: RADIUS.lg, ...SHADOW.card },
  emptyText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', paddingHorizontal: SPACING.lg },

  // Bottom Sheet
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, maxHeight: height * 0.88 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  sheetBody: { padding: SPACING.lg, gap: SPACING.sm, paddingBottom: 32 },
  typeToggle: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: 4, gap: 4 },
  typeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: RADIUS.sm },
  typeBtnActive: { backgroundColor: '#fff', ...SHADOW.card },
  typeBtnText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },
  typeBtnTextActive: { color: COLORS.primary, fontWeight: '700' },
  formLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  formInput: { backgroundColor: '#F8FAF5', borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontWeight: '600', color: COLORS.text, minHeight: 48 },
  sheetFooter: { flexDirection: 'row', gap: 10, marginTop: SPACING.md },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingVertical: 13, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  submitBtn: { flex: 2, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  // QR Modal
  qrOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  qrModal: { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', gap: SPACING.md, width: '100%' },
  qrModalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  qrModalSub: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },
  qrBox: { alignItems: 'center', gap: 10 },
  qrSimulated: { borderWidth: 2, borderColor: '#000', padding: 8, backgroundColor: '#fff' },
  qrCell: { width: 18, height: 18 },
  qrCode: { fontSize: 16, fontWeight: '800', color: COLORS.primary, letterSpacing: 2 },
  qrNote: { fontSize: 12, color: COLORS.textMuted },
  qrCloseBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 32, paddingVertical: 12, width: '100%', alignItems: 'center' },
  qrCloseBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // Scanner Modal
  scanOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  scanModal: { width: '100%', alignItems: 'center', gap: SPACING.lg },
  scanTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  scanViewfinder: { width: 240, height: 240, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', gap: 12 },
  scanCorner: { position: 'absolute', width: 28, height: 28, borderColor: COLORS.primary, borderWidth: 3 },
  scanTL: { top: 8, left: 8, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 4 },
  scanTR: { top: 8, right: 8, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 4 },
  scanBL: { bottom: 8, left: 8, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 4 },
  scanBR: { bottom: 8, right: 8, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 4 },
  scanHint: { fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  scanSimBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.success, borderRadius: RADIUS.md, paddingHorizontal: 24, paddingVertical: 14 },
  scanSimBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  scanCancelBtn: { paddingVertical: 10 },
  scanCancelText: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },

  // Topbar Ledger Button
  topbarLedgerBtn: {
    position: 'relative',
    padding: 6,
  },
  topbarLedgerBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLORS.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  topbarLedgerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
  },

  // Dedicated Full History Modal
  historyModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  historyModalContainer: { backgroundColor: '#fff', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, maxHeight: '92%', height: '92%' },
  historyModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  historyModalTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  historyModalSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  historyModalCloseBtn: { padding: 4 },
  historyStatBar: { flexDirection: 'row', backgroundColor: '#F8FAF5', paddingHorizontal: SPACING.lg, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 16 },
  historyStatItem: { flex: 1 },
  historyStatLbl: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  historyStatVal: { fontSize: 13, fontWeight: '800', color: COLORS.primary, marginTop: 1 },
});
