import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import AppHeader from '../components/AppHeader';
import { getCurrentSession, MOCK_FIELDS, DRAFT_LOGS, notifyDataUpdate, subscribe } from '../data/mockData';
import { useTranslation } from '../services/i18n';

const DEFAULT_PHASES = [
  {
    key: 'landprep',
    category: 'prep',
    label: 'Land Prep & Furrowing',
    icon: 'construct',
    color: '#8F3A8F',
    month: 'Month 0–1',
    description: 'Plowing, dragging, furrowing, and harrowing for soil preparation.',
    items: [
      { id: '1', name: 'Tractor Plowing', type: 'equipment', perHa: 1, unit: 'ha', rate: 4500, icon: 'construct-outline' },
      { id: '2', name: 'Dragging & Furrowing', type: 'equipment', perHa: 1, unit: 'ha', rate: 3000, icon: 'git-branch-outline' },
      { id: '3', name: 'Field Prep Labor', type: 'labor', perHa: 4, unit: 'worker-days', rate: 450, icon: 'people-outline' },
    ],
  },
  {
    key: 'planting',
    category: 'plant',
    label: 'Planting (Patdan)',
    icon: 'leaf',
    color: '#4A7C2F',
    month: 'Month 1',
    description: 'Cane points (patdan) purchase, hauling, dipping, and manual planting.',
    items: [
      { id: '1', name: 'Cane Points (Patdan)', type: 'material', perHa: 40000, unit: 'pcs', rate: 0.35, icon: 'leaf-outline' },
      { id: '2', name: 'Seedpiece Hauling', type: 'equipment', perHa: 1, unit: 'truckload', rate: 2000, icon: 'car-outline' },
      { id: '3', name: 'Planting Labor Crew', type: 'labor', perHa: 10, unit: 'workers', rate: 450, icon: 'people-outline' },
    ],
  },
  {
    key: 'weed',
    category: 'weed',
    label: 'Pre-emergence & Weed Control',
    icon: 'water',
    color: '#1A6B9A',
    month: 'Month 1–2',
    description: 'Herbicide application, backpack sprayers, and initial manual weeding.',
    items: [
      { id: '1', name: 'Pre-emergence Herbicide', type: 'material', perHa: 3, unit: 'liters', rate: 950, icon: 'flask-outline' },
      { id: '2', name: 'Sprayer Equipment Rental', type: 'equipment', perHa: 2, unit: 'units', rate: 300, icon: 'hardware-chip-outline' },
      { id: '3', name: 'Spraying & Weeding Labor', type: 'labor', perHa: 4, unit: 'worker-days', rate: 450, icon: 'people-outline' },
    ],
  },
  {
    key: 'fert1',
    category: 'fert',
    label: 'Fertilization Stage 1',
    icon: 'archive',
    color: '#1A6B9A',
    month: 'Month 2–3',
    description: '18-46 (Ammonium Phosphate) fertilizer application with ridge busting.',
    items: [
      { id: '1', name: '18-46 Fertilizer', type: 'material', perHa: 3, unit: 'bags', rate: 2200, icon: 'archive-outline' },
      { id: '2', name: 'Ridge Busting / Off-barring', type: 'equipment', perHa: 1, unit: 'ha', rate: 2500, icon: 'construct-outline' },
      { id: '3', name: 'Application Labor', type: 'labor', perHa: 3, unit: 'worker-days', rate: 450, icon: 'people-outline' },
    ],
  },
  {
    key: 'fert2',
    category: 'fert',
    label: 'Fertilization Stage 2',
    icon: 'flask',
    color: '#4A7C2F',
    month: 'Month 3–4',
    description: 'Urea fertilizer application, weeding, and off-barring.',
    items: [
      { id: '1', name: 'Urea (46-0-0) Fertilizer', type: 'material', perHa: 4, unit: 'bags', rate: 1850, icon: 'archive-outline' },
      { id: '2', name: 'Weeding & Off-barring Labor', type: 'labor', perHa: 4, unit: 'worker-days', rate: 450, icon: 'people-outline' },
    ],
  },
  {
    key: 'fert3',
    category: 'fert',
    label: 'Fertilization Stage 3',
    icon: 'flask',
    color: '#F5A623',
    month: 'Month 4–5',
    description: 'Urea + MOP (0-0-60 Potash) application and hilling-up (on-barring).',
    items: [
      { id: '1', name: 'Urea Fertilizer', type: 'material', perHa: 3, unit: 'bags', rate: 1850, icon: 'archive-outline' },
      { id: '2', name: 'Muriate of Potash (MOP)', type: 'material', perHa: 2, unit: 'bags', rate: 1750, icon: 'archive-outline' },
      { id: '3', name: 'Hilling-up / On-barring Labor', type: 'labor', perHa: 4, unit: 'worker-days', rate: 450, icon: 'people-outline' },
    ],
  },
  {
    key: 'ratoon',
    category: 'weed',
    label: 'Ratoon Maintenance',
    icon: 'sync',
    color: '#8A9B7A',
    month: 'Ratoon Month 0–2',
    description: 'Stubble shaving, trash blanketing/burning, and ratoon cultivation.',
    items: [
      { id: '1', name: 'Stubble Shaving & Clearing', type: 'labor', perHa: 5, unit: 'worker-days', rate: 450, icon: 'people-outline' },
      { id: '2', name: 'Inter-row Cultivation (Tractor)', type: 'equipment', perHa: 1, unit: 'ha', rate: 2500, icon: 'construct-outline' },
      { id: '3', name: 'Initial Ratoon Urea', type: 'material', perHa: 3, unit: 'bags', rate: 1850, icon: 'archive-outline' },
    ],
  },
  {
    key: 'harvest',
    category: 'harvest',
    label: 'Harvesting & Cutting',
    icon: 'basket',
    color: '#D9534F',
    month: 'Month 10–12',
    description: 'Cane cutting (tapas), bundling, and field loading.',
    items: [
      { id: '1', name: 'Cane Cutters (Tapas)', type: 'labor', perHa: 12, unit: 'workers', rate: 450, icon: 'people-outline' },
      { id: '2', name: 'Bundling & Field Loading', type: 'labor', perHa: 6, unit: 'workers', rate: 450, icon: 'people-outline' },
    ],
  },
  {
    key: 'hauling',
    category: 'harvest',
    label: 'Trucking & Hauling',
    icon: 'car',
    color: '#2A7F8F',
    month: 'Milling',
    description: 'Truck rental, fuel, and hauling delivery to HPCo Silay sugar mill.',
    items: [
      { id: '1', name: 'Trucking / Freight to Mill', type: 'equipment', perHa: 60, unit: 'tons cane', rate: 350, icon: 'car-outline' },
      { id: '2', name: 'Hauling Crew / Escort', type: 'labor', perHa: 2, unit: 'worker-days', rate: 500, icon: 'people-outline' },
    ],
  },
];

const ITEM_TYPES = [
  { key: 'material', label: 'Material', icon: 'cube-outline', color: '#1A6B9A' },
  { key: 'labor', label: 'Labor', icon: 'people-outline', color: '#4A7C2F' },
  { key: 'equipment', label: 'Equipment / Machine', icon: 'construct-outline', color: '#F5A623' },
];

const fmt = n => Number.isFinite(n) ? n.toLocaleString('en-PH') : '—';

export default function PlannerScreen() {
  const { t, formatPhaseMonth } = useTranslation();
  const [session, setSession] = useState(getCurrentSession());
  const isMember = session.role === 'Member';

  const myFields = useMemo(() => {
    if (isMember) {
      const filtered = MOCK_FIELDS.filter(f => f.member === session.name || f.owner === session.name);
      return filtered.length > 0 ? filtered : [MOCK_FIELDS[0]];
    }
    return MOCK_FIELDS;
  }, [session, isMember]);

  const [selectedField, setSelectedField] = useState(() => {
    const cur = getCurrentSession();
    if (cur.role === 'Member') {
      const memberFields = MOCK_FIELDS.filter(f => f.member === cur.name || f.owner === cur.name);
      return memberFields.length > 0 ? memberFields[0] : MOCK_FIELDS[0];
    }
    return MOCK_FIELDS[0];
  });

  const [landArea, setLandArea] = useState(() => {
    const cur = getCurrentSession();
    if (cur.role === 'Member') {
      const memberFields = MOCK_FIELDS.filter(f => f.member === cur.name || f.owner === cur.name);
      return (memberFields.length > 0 ? memberFields[0]?.ha : MOCK_FIELDS[0]?.ha) || '1.5';
    }
    return MOCK_FIELDS[0]?.ha || '1.5';
  });

  const [selectedPhaseKey, setSelectedPhaseKey] = useState('landprep');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Deep-dive custom phase states
  const [phaseItems, setPhaseItems] = useState(() => {
    const map = {};
    DEFAULT_PHASES.forEach(p => {
      map[p.key] = p.items.map(it => ({ ...it }));
    });
    return map;
  });

  // Modal for adding custom line item
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('material');
  const [newItemPerHa, setNewItemPerHa] = useState('2');
  const [newItemUnit, setNewItemUnit] = useState('bags');
  const [newItemRate, setNewItemRate] = useState('1800');

  // Modal for custom phase creation
  const [showAddCustomPhase, setShowAddCustomPhase] = useState(false);
  const [customPhaseName, setCustomPhaseName] = useState('');
  const [customPhaseCategory, setCustomPhaseCategory] = useState('weed');
  const [allPhases, setAllPhases] = useState(DEFAULT_PHASES);

  useEffect(() => {
    const unsub = subscribe(() => {
      const cur = getCurrentSession();
      setSession({ ...cur });
      if (cur.role === 'Member') {
        const memberFields = MOCK_FIELDS.filter(f => f.member === cur.name || f.owner === cur.name);
        const defaultField = memberFields.length > 0 ? memberFields[0] : MOCK_FIELDS[0];
        setSelectedField(defaultField);
        setLandArea(defaultField?.ha || '1.5');
      }
    });
    return unsub;
  }, []);

  const filteredPhases = useMemo(() => {
    if (selectedCategory === 'all') return allPhases;
    return allPhases.filter(p => p.category === selectedCategory);
  }, [allPhases, selectedCategory]);

  const currentPhase = useMemo(() => {
    return allPhases.find(p => p.key === selectedPhaseKey) || allPhases[0];
  }, [allPhases, selectedPhaseKey]);

  const itemsForCurrentPhase = useMemo(() => {
    return phaseItems[currentPhase.key] || [];
  }, [phaseItems, currentPhase]);

  const area = parseFloat(landArea) || 0;

  // Update item per-Ha dosage
  const updateItemPerHa = (itemId, newPerHa) => {
    const val = parseFloat(newPerHa);
    setPhaseItems(prev => {
      const currentList = prev[currentPhase.key] || [];
      const updated = currentList.map(it => it.id === itemId ? { ...it, perHa: isNaN(val) ? 0 : val } : it);
      return { ...prev, [currentPhase.key]: updated };
    });
  };

  // Update item unit cost rate
  const updateItemRate = (itemId, newRate) => {
    const val = parseFloat(newRate);
    setPhaseItems(prev => {
      const currentList = prev[currentPhase.key] || [];
      const updated = currentList.map(it => it.id === itemId ? { ...it, rate: isNaN(val) ? 0 : val } : it);
      return { ...prev, [currentPhase.key]: updated };
    });
  };

  // Add custom item
  const handleAddNewItem = () => {
    if (!newItemName.trim() || !newItemPerHa || !newItemRate) {
      Alert.alert('Required', 'Please fill in Name, Quantity per Ha, and Unit Rate.');
      return;
    }
    const perHaNum = parseFloat(newItemPerHa);
    const rateNum = parseFloat(newItemRate);
    if (isNaN(perHaNum) || perHaNum <= 0 || isNaN(rateNum) || rateNum < 0) {
      Alert.alert('Invalid Input', 'Please enter valid positive numbers.');
      return;
    }

    const typeConfig = ITEM_TYPES.find(t => t.key === newItemType) || ITEM_TYPES[0];
    const newItem = {
      id: `ITEM-${Date.now()}`,
      name: newItemName.trim(),
      type: newItemType,
      perHa: perHaNum,
      unit: newItemUnit.trim() || 'units',
      rate: rateNum,
      icon: typeConfig.icon,
    };

    setPhaseItems(prev => ({
      ...prev,
      [currentPhase.key]: [...(prev[currentPhase.key] || []), newItem],
    }));

    setNewItemName('');
    setNewItemPerHa('2');
    setNewItemUnit('bags');
    setNewItemRate('1800');
    setShowAddItem(false);
  };

  // Remove line item
  const removeItem = (itemId) => {
    setPhaseItems(prev => {
      const currentList = prev[currentPhase.key] || [];
      return { ...prev, [currentPhase.key]: currentList.filter(it => it.id !== itemId) };
    });
  };

  // Create custom phase
  const handleAddCustomPhase = () => {
    if (!customPhaseName.trim()) {
      Alert.alert('Required', 'Please enter a name for the custom operation.');
      return;
    }
    const newKey = `custom_${Date.now()}`;
    const newP = {
      key: newKey,
      category: customPhaseCategory || 'weed',
      label: customPhaseName.trim(),
      icon: 'sparkles',
      color: '#5B4DA7',
      month: 'Custom Phase',
      description: 'Custom field operation tailored for this specific plot.',
      items: [
        { id: 'c1', name: 'Custom Labor Crew', type: 'labor', perHa: 4, unit: 'worker-days', rate: 450, icon: 'people-outline' },
      ],
    };

    setAllPhases(prev => [...prev, newP]);
    setPhaseItems(prev => ({ ...prev, [newKey]: newP.items }));
    setSelectedPhaseKey(newKey);
    setCustomPhaseName('');
    setCustomPhaseCategory('weed');
    setShowAddCustomPhase(false);
  };

  // Reset phase items to default
  const resetPhaseToDefault = () => {
    const original = DEFAULT_PHASES.find(p => p.key === currentPhase.key);
    if (original) {
      setPhaseItems(prev => ({
        ...prev,
        [currentPhase.key]: original.items.map(it => ({ ...it })),
      }));
      Alert.alert('Reset', `"${currentPhase.label}" has been reset to standard benchmark requirements.`);
    }
  };

  // Calculated totals for current phase
  const calculatedItems = useMemo(() => {
    return itemsForCurrentPhase.map(item => {
      const totalQty = area * item.perHa;
      const subtotal = totalQty * item.rate;
      return {
        ...item,
        totalQty,
        subtotal,
      };
    });
  }, [itemsForCurrentPhase, area]);

  const totalBudget = useMemo(() => {
    return calculatedItems.reduce((sum, it) => sum + it.subtotal, 0);
  }, [calculatedItems]);

  const totalWorkers = useMemo(() => {
    const laborItems = calculatedItems.filter(it => it.type === 'labor');
    return Math.round(laborItems.reduce((sum, it) => sum + it.totalQty, 0));
  }, [calculatedItems]);

  const materialCost = useMemo(() => {
    return calculatedItems.filter(it => it.type === 'material').reduce((sum, it) => sum + it.subtotal, 0);
  }, [calculatedItems]);

  const laborCost = useMemo(() => {
    return calculatedItems.filter(it => it.type === 'labor').reduce((sum, it) => sum + it.subtotal, 0);
  }, [calculatedItems]);

  const equipmentCost = useMemo(() => {
    return calculatedItems.filter(it => it.type === 'equipment').reduce((sum, it) => sum + it.subtotal, 0);
  }, [calculatedItems]);

  // Send to Draft Log action
  const sendToDraftLog = () => {
    if (area <= 0 || totalBudget <= 0) {
      Alert.alert(t('sync_warning_title', 'Cannot Save'), t('planner_enter_area_hint', 'Please enter a valid land area and configure costs before saving as draft.'));
      return;
    }

    const fieldId = selectedField?.id || 'FLD-KTR-001';
    const primaryInput = calculatedItems.find(it => it.type === 'material') || calculatedItems.find(it => it.type === 'equipment') || calculatedItems[0];
    const phaseName = getPhaseLabel(currentPhase);
    const draftLog = {
      id: `D${Date.now()}`,
      fieldId: fieldId,
      category: currentPhase.category || 'weed',
      activity: `${phaseName} (Planned)`,
      cost: Math.round(totalBudget),
      hectares: landArea,
      people: totalWorkers > 0 ? totalWorkers.toString() : '4',
      inputQty: primaryInput ? primaryInput.totalQty.toString() : '',
      inputUnit: primaryInput ? primaryInput.unit : 'ha',
      inputName: primaryInput ? primaryInput.name : '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    DRAFT_LOGS.unshift(draftLog);
    notifyDataUpdate();

    const inputNote = draftLog.inputQty ? ` · ${draftLog.inputQty} ${draftLog.inputUnit} ${draftLog.inputName ? `(${draftLog.inputName})` : ''}` : '';
    Alert.alert(
      t('draft_created', 'Draft Log Created!'),
      `"${phaseName}" (Php ${fmt(Math.round(totalBudget))}${inputNote}) ${t('draft_created_msg', 'has been saved to your Draft Logs for')} ${fieldId}.`,
      [{ text: 'OK' }]
    );
  };

  const getPhaseLabel = (phase) => {
    const keyMap = {
      landprep: 'phase_landprep',
      planting: 'phase_planting',
      weed: 'phase_weed',
      fert1: 'phase_fert1',
      fert2: 'phase_fert2',
      fert3: 'phase_fert3',
      ratoon: 'phase_ratoon',
      harvest: 'phase_harvest',
      hauling: 'phase_hauling',
    };
    if (phase.key && keyMap[phase.key]) {
      return t(keyMap[phase.key], phase.label);
    }
    return phase.label;
  };

  const getPhaseDesc = (phase) => {
    const descMap = {
      landprep: 'desc_landprep',
      planting: 'desc_planting',
      weed: 'desc_weed',
      fert1: 'desc_fert1',
      fert2: 'desc_fert2',
      fert3: 'desc_fert3',
      ratoon: 'desc_ratoon',
      harvest: 'desc_harvest',
      hauling: 'desc_hauling',
    };
    if (phase.key && descMap[phase.key]) {
      return t(descMap[phase.key], phase.description);
    }
    return phase.description;
  };

  const ITEM_NAME_KEY_MAP = {
    'Tractor Plowing': 'item_tractor_plowing',
    'Dragging & Furrowing': 'item_dragging_furrowing',
    'Field Prep Labor': 'item_field_prep_labor',
    'Cane Points (Patdan)': 'item_cane_points',
    'Seedpiece Hauling': 'item_seedpiece_hauling',
    'Planting Labor Crew': 'item_planting_labor',
    'Pre-emergence Herbicide': 'item_pre_emergence_herbicide',
    'Sprayer Equipment Rental': 'item_sprayer_rental',
    'Spraying & Weeding Labor': 'item_spraying_labor',
    '18-46 Fertilizer': 'item_18_46_fert',
    'Ridge Busting / Off-barring': 'item_ridge_busting',
    'Application Labor': 'item_app_labor',
    'Urea (46-0-0) Fertilizer': 'item_urea_fert',
    'Weeding & Off-barring Labor': 'item_weeding_offbarring_labor',
    'Urea Fertilizer': 'item_urea_fert',
    'Muriate of Potash (MOP)': 'item_mop_fert',
    'Hilling-up / On-barring Labor': 'item_hilling_up_labor',
    'Stubble Shaving & Clearing': 'item_stubble_shaving',
    'Inter-row Cultivation (Tractor)': 'item_inter_row_cult',
    'Initial Ratoon Urea': 'item_initial_ratoon_urea',
    'Cane Cutters (Tapas)': 'item_cane_cutters',
    'Cane Hauling & Trucking': 'item_cane_hauling',
    'Custom Labor Crew': 'item_custom_labor',
  };

  const getItemNameLabel = (name) => {
    if (ITEM_NAME_KEY_MAP[name]) {
      return t(ITEM_NAME_KEY_MAP[name], name);
    }
    return name;
  };

  const getCategoryBadgeLabel = (cat) => {
    if (cat === 'prep') return t('cat_prep', 'Land Prep');
    if (cat === 'plant') return t('cat_plant', 'Planting');
    if (cat === 'fert') return t('cat_fert', 'Fertilization');
    if (cat === 'weed') return t('cat_weed', 'Weeding & Care');
    if (cat === 'harvest') return t('cat_harvest', 'Harvesting');
    return cat;
  };

  const getItemTypeLabel = (typeKey) => {
    if (typeKey === 'material') return t('planner_materials', 'Material');
    if (typeKey === 'labor') return t('planner_labor', 'Labor');
    if (typeKey === 'equipment') return t('planner_equip', 'Equipment / Machine');
    return typeKey;
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <AppHeader />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* Header Title */}
        <View>
          <Text style={s.pageTitle}>{t('planner_title', 'Resource Planner')}</Text>
          <Text style={s.pageSub}>{t('planner_sub', 'Customizable phase deep-dive for materials, labor & budget planning.')}</Text>
        </View>

        {/* My Field Section */}
        {isMember ? (
          myFields.length === 1 ? (
            <View style={s.singleFieldCard}>
              <View style={s.singleFieldLeft}>
                <View style={s.singleFieldIcon}>
                  <Ionicons name="location" size={18} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={s.singleFieldTitle}>{selectedField?.id || 'FLD-KTR-001'} · {selectedField?.ha || landArea} Ha</Text>
                  <Text style={s.singleFieldSub}>{t('my_field', 'My Field')} · {session.name}</Text>
                </View>
              </View>
              <View style={s.singleFieldBadge}>
                <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
                <Text style={s.singleFieldBadgeText}>{t('synced', 'Allocated')}</Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={s.sectionLabel}>{t('my_fields', 'My Fields')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginTop: 4 }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 8 }}>
                {myFields.map(field => (
                  <TouchableOpacity
                    key={field.id}
                    style={[s.fieldChip, selectedField?.id === field.id && s.fieldChipActive]}
                    onPress={() => {
                      setSelectedField(field);
                      setLandArea(field.ha);
                    }}
                  >
                    <Ionicons name="location-outline" size={13} color={selectedField?.id === field.id ? COLORS.primary : COLORS.textMuted} />
                    <Text style={[s.fieldChipText, selectedField?.id === field.id && s.fieldChipTextActive]}>
                      {field.id} ({field.ha} Ha)
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )
        ) : (
          <View>
            <Text style={s.sectionLabel}>{t('my_fields', 'Select Field for Planning')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginTop: 4 }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 8 }}>
              {MOCK_FIELDS.map(field => (
                <TouchableOpacity
                  key={field.id}
                  style={[s.fieldChip, selectedField?.id === field.id && s.fieldChipActive]}
                  onPress={() => {
                    setSelectedField(field);
                    setLandArea(field.ha);
                  }}
                >
                  <Ionicons name="location-outline" size={13} color={selectedField?.id === field.id ? COLORS.primary : COLORS.textMuted} />
                  <Text style={[s.fieldChipText, selectedField?.id === field.id && s.fieldChipTextActive]}>
                    {field.id} ({field.ha} Ha)
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Land Area Input Card */}
        <View style={s.areaCard}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryBg, justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
            <Ionicons name="map-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={s.areaBody}>
            <Text style={s.areaLabel} numberOfLines={1}>{t('operating_area', 'Operating Land Area')}</Text>
            <Text style={s.areaSub} numberOfLines={2}>{t('operating_area_sub', 'Enter hectares for budget calculation')}</Text>
          </View>
          <View style={s.areaInputWrap}>
            <TextInput
              style={s.areaInput}
              value={landArea}
              onChangeText={setLandArea}
              keyboardType="decimal-pad"
              placeholder="0.0"
              placeholderTextColor={COLORS.textMuted}
            />
            <Text style={s.areaUnitText}>Ha</Text>
          </View>
        </View>

        {/* Category Filter Selector */}
        <View style={{ marginBottom: 6 }}>
          <Text style={[s.sectionLabel, { marginBottom: 6 }]}>{t('planner_filter_cat', 'Filter by Category')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SPACING.lg, marginBottom: 8 }} contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: 6 }}>
            {[
              { key: 'all', label: `${t('cat_all', 'All')} (${allPhases.length})`, icon: 'apps-outline' },
              { key: 'prep', label: t('cat_prep', 'Land Prep'), icon: 'construct-outline' },
              { key: 'plant', label: t('cat_plant', 'Planting'), icon: 'leaf-outline' },
              { key: 'fert', label: t('cat_fert', 'Fertilization'), icon: 'flask-outline' },
              { key: 'weed', label: t('cat_weed', 'Weeding & Care'), icon: 'water-outline' },
              { key: 'harvest', label: t('cat_harvest', 'Harvesting'), icon: 'basket-outline' },
            ].map(cat => {
              const isCatActive = selectedCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff' },
                    isCatActive && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg }
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat.key);
                    const matching = cat.key === 'all' ? allPhases : allPhases.filter(p => p.category === cat.key);
                    if (matching.length > 0 && !matching.some(p => p.key === selectedPhaseKey)) {
                      setSelectedPhaseKey(matching[0].key);
                    }
                  }}
                >
                  <Ionicons name={cat.icon} size={13} color={isCatActive ? COLORS.primary : COLORS.textMuted} />
                  <Text style={{ fontSize: 12, fontWeight: isCatActive ? '800' : '600', color: isCatActive ? COLORS.primary : COLORS.textSecondary }}>{cat.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Operation Phase Selector */}
        <View>
          <View style={s.sectionRow}>
            <Text style={s.sectionLabel}>{t('planner_phase', 'Operation Phase')} ({filteredPhases.length})</Text>
            <TouchableOpacity onPress={() => setShowAddCustomPhase(true)}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary }}>{t('planner_custom_op', '+ Custom Operation')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.phaseScroll} contentContainerStyle={s.phaseRow}>
            {filteredPhases.map(p => {
              const isActive = selectedPhaseKey === p.key;
              return (
                <TouchableOpacity
                  key={p.key}
                  style={[s.phaseChip, isActive && { backgroundColor: p.color, borderColor: p.color }]}
                  onPress={() => setSelectedPhaseKey(p.key)}
                >
                  <Ionicons name={p.icon} size={14} color={isActive ? '#fff' : p.color} />
                  <Text style={[s.phaseChipText, isActive && s.phaseChipTextActive]}>{getPhaseLabel(p)}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Phase Info Banner */}
        <View style={s.phaseInfoCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
              <Text style={s.phaseMonth}>{formatPhaseMonth(currentPhase.month || 'Target Operation')}</Text>
              <View style={{ backgroundColor: currentPhase.color + '20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.sm, marginLeft: 4 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: currentPhase.color }}>
                  {getCategoryBadgeLabel(currentPhase.category)}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={resetPhaseToDefault} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="refresh-outline" size={13} color={COLORS.textMuted} />
              <Text style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: '600' }}>{t('btn_reset', 'Reset Defaults')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.phaseDesc}>{getPhaseDesc(currentPhase)}</Text>
        </View>

        {/* Customizable Requirements & Costs Table */}
        <View style={s.card}>
          <View>
            <Text style={s.cardTitle}>{t('planner_requirements_title', 'Custom Requirements & Rates')}</Text>
            <Text style={s.cardSub}>{t('planner_requirements_sub', 'Tweak dosages and prices per hectare to match this field.')}</Text>
          </View>

          {area <= 0 && (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <Ionicons name="alert-circle-outline" size={24} color={COLORS.textMuted} />
              <Text style={s.hintText}>{t('planner_enter_area_hint', 'Enter land area above to compute quantities and costs.')}</Text>
            </View>
          )}

          {area > 0 && calculatedItems.length === 0 && (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <Text style={s.hintText}>No items for this phase. Tap "+ Add Custom Item" below.</Text>
            </View>
          )}

          {area > 0 && calculatedItems.map(item => {
            return (
              <View key={item.id} style={s.itemRowCard}>
                <View style={s.itemHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                    <Ionicons name={item.icon || 'cube-outline'} size={16} color={currentPhase.color} />
                    <Text style={s.itemTitle} numberOfLines={1}>{getItemNameLabel(item.name)}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeItem(item.id)} style={{ padding: 4 }}>
                    <Ionicons name="trash-outline" size={15} color="#D9534F" />
                  </TouchableOpacity>
                </View>

                <View style={s.itemControlGrid}>
                  {/* Dosage Input */}
                  <View style={s.controlCol}>
                    <Text style={s.controlLabel} numberOfLines={1}>{t('planner_dosage', 'Dosage / Ha')}</Text>
                    <View style={s.controlInputWrap}>
                      <TextInput
                        style={s.controlInput}
                        defaultValue={item.perHa.toString()}
                        onChangeText={v => updateItemPerHa(item.id, v)}
                        keyboardType="decimal-pad"
                        placeholder="0"
                      />
                      <Text style={s.controlUnit}>{item.unit}</Text>
                    </View>
                  </View>

                  {/* Unit Rate Input */}
                  <View style={s.controlCol}>
                    <Text style={s.controlLabel} numberOfLines={1}>{t('planner_unit_rate', 'Rate (Php)')}</Text>
                    <View style={s.controlInputWrap}>
                      <Text style={s.controlPrefix}>₱</Text>
                      <TextInput
                        style={s.controlInput}
                        defaultValue={item.rate.toString()}
                        onChangeText={v => updateItemRate(item.id, v)}
                        keyboardType="decimal-pad"
                        placeholder="0"
                      />
                    </View>
                  </View>

                  {/* Total & Subtotal */}
                  <View style={[s.controlCol, { alignItems: 'flex-end' }]}>
                    <Text style={s.controlLabel} numberOfLines={1}>{t('planner_total_needed', 'Total Needed')}</Text>
                    <Text style={s.itemTotalQty} numberOfLines={1}>
                      {fmt(Math.round(item.totalQty * 10) / 10)} {item.unit}
                    </Text>
                    <Text style={s.itemSubtotal} numberOfLines={1}>Php {fmt(Math.round(item.subtotal))}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Clean Placed Add Item Button at bottom of list */}
          {area > 0 && (
            <TouchableOpacity
              style={s.addItemBottomBtn}
              onPress={() => setShowAddItem(true)}
            >
              <Ionicons name="add-circle-outline" size={17} color={COLORS.primary} />
              <Text style={s.addItemBottomBtnText}>{t('planner_add_item', '+ Add Custom Material or Labor Item')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Phase Budget Summary Card */}
        <View style={[s.budgetCard, { backgroundColor: currentPhase.color }]}>
          <Text style={s.budgetLabel}>{t('planner_budget', 'ESTIMATED BUDGET')}: {getPhaseLabel(currentPhase).toUpperCase()}</Text>
          <Text style={s.budgetValue}>Php {fmt(Math.round(totalBudget))}</Text>
          <Text style={s.budgetSub}>{t('planner_budget_sub', 'For')} {landArea} {t('hectares', 'Hectares')} · {selectedField?.id || 'Selected Field'}</Text>

          {/* Breakdown Pills */}
          <View style={s.breakdownPillsRow}>
            <View style={s.breakdownPill}>
              <Ionicons name="cube-outline" size={13} color="#fff" />
              <Text style={s.breakdownPillText} numberOfLines={1}>{t('planner_materials', 'Materials')}: ₱{fmt(Math.round(materialCost))}</Text>
            </View>
            <View style={s.breakdownPill}>
              <Ionicons name="people-outline" size={13} color="#fff" />
              <Text style={s.breakdownPillText} numberOfLines={1}>{t('planner_labor', 'Labor')}: ₱{fmt(Math.round(laborCost))}</Text>
            </View>
            {equipmentCost > 0 && (
              <View style={s.breakdownPill}>
                <Ionicons name="construct-outline" size={13} color="#fff" />
                <Text style={s.breakdownPillText} numberOfLines={1}>{t('planner_equip', 'Equip')}: ₱{fmt(Math.round(equipmentCost))}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Button: Send to Draft Log */}
        <TouchableOpacity style={s.sendDraftBtn} onPress={sendToDraftLog} activeOpacity={0.85}>
          <Ionicons name="document-text-outline" size={18} color="#fff" />
          <Text style={s.sendDraftBtnText} numberOfLines={1}>{t('btn_save_field_draft', 'Save as Field Draft Log')}</Text>
        </TouchableOpacity>

        <View style={s.disclaimerWrap}>
          <Ionicons name="information-circle-outline" size={14} color={COLORS.textMuted} />
          <Text style={s.disclaimer}>
            {t('planner_disclaimer', 'Customized for local block farm operations. Adjust rates and dosages anytime as field conditions require.')}
          </Text>
        </View>
      </ScrollView>

      {/* ── Modal: Add Custom Item ── */}
      <Modal visible={showAddItem} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t('planner_modal_add_item', 'Add Custom Requirement')}</Text>
              <TouchableOpacity onPress={() => setShowAddItem(false)}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: SPACING.lg, gap: 12 }}>
              <Text style={s.formLabel}>{t('form_input_name', 'Item Name *')}</Text>
              <TextInput
                style={s.formInput}
                placeholder="e.g. Organic Bio-fertilizer or Carabao Rental"
                placeholderTextColor={COLORS.textMuted}
                value={newItemName}
                onChangeText={setNewItemName}
              />

              <Text style={s.formLabel}>{t('form_category', 'Category *')}</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {ITEM_TYPES.map(it => (
                  <TouchableOpacity
                    key={it.key}
                    style={[s.typeChip, newItemType === it.key && { backgroundColor: it.color, borderColor: it.color }]}
                    onPress={() => setNewItemType(it.key)}
                  >
                    <Ionicons name={it.icon} size={14} color={newItemType === it.key ? '#fff' : it.color} />
                    <Text style={[s.typeChipText, newItemType === it.key && { color: '#fff', fontWeight: '700' }]} numberOfLines={2}>
                      {getItemTypeLabel(it.key)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.formLabel}>{t('planner_dosage', 'Dosage / Ha *')}</Text>
                  <TextInput
                    style={s.formInput}
                    placeholder="e.g. 3"
                    placeholderTextColor={COLORS.textMuted}
                    value={newItemPerHa}
                    onChangeText={setNewItemPerHa}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.formLabel}>{t('form_input_unit', 'Unit')}</Text>
                  <TextInput
                    style={s.formInput}
                    placeholder="e.g. bags"
                    placeholderTextColor={COLORS.textMuted}
                    value={newItemUnit}
                    onChangeText={setNewItemUnit}
                  />
                </View>
              </View>

              <Text style={s.formLabel}>{t('planner_unit_rate', 'Rate per Unit (Php) *')}</Text>
              <TextInput
                style={s.formInput}
                placeholder="e.g. 1850"
                placeholderTextColor={COLORS.textMuted}
                value={newItemRate}
                onChangeText={setNewItemRate}
                keyboardType="decimal-pad"
              />

              <TouchableOpacity style={s.submitBtn} onPress={handleAddNewItem}>
                <Ionicons name="add-circle-outline" size={18} color="#fff" />
                <Text style={s.submitBtnText}>{t('planner_add_item', 'Add Item')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Modal: Add Custom Phase ── */}
      <Modal visible={showAddCustomPhase} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t('planner_modal_custom_op', 'Create Custom Operation')}</Text>
              <TouchableOpacity onPress={() => setShowAddCustomPhase(false)}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={{ padding: SPACING.lg, gap: 12 }}>
              <Text style={s.formLabel}>{t('form_activity', 'Operation Name *')}</Text>
              <TextInput
                style={s.formInput}
                placeholder="e.g. Lime Application or Drainage Canal Prep"
                placeholderTextColor={COLORS.textMuted}
                value={customPhaseName}
                onChangeText={setCustomPhaseName}
              />

              <Text style={s.formLabel}>{t('form_category', 'Category / Agronomic Stage *')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }} contentContainerStyle={{ gap: 6, paddingVertical: 2 }}>
                {[
                  { key: 'prep', label: t('cat_prep', 'Land Prep'), icon: 'construct-outline' },
                  { key: 'plant', label: t('cat_plant', 'Planting'), icon: 'leaf-outline' },
                  { key: 'fert', label: t('cat_fert', 'Fertilization'), icon: 'flask-outline' },
                  { key: 'weed', label: t('cat_weed', 'Weeding & Care'), icon: 'water-outline' },
                  { key: 'harvest', label: t('cat_harvest', 'Harvesting'), icon: 'basket-outline' },
                ].map(c => {
                  const isSel = customPhaseCategory === c.key;
                  return (
                    <TouchableOpacity
                      key={c.key}
                      style={[
                        { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: '#fff' },
                        isSel && { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg }
                      ]}
                      onPress={() => setCustomPhaseCategory(c.key)}
                    >
                      <Ionicons name={c.icon} size={14} color={isSel ? COLORS.primary : COLORS.textMuted} />
                      <Text style={{ fontSize: 12, fontWeight: isSel ? '800' : '600', color: isSel ? COLORS.primary : COLORS.textSecondary }}>{c.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <TouchableOpacity style={s.submitBtn} onPress={handleAddCustomPhase}>
                <Ionicons name="sparkles-outline" size={18} color="#fff" />
                <Text style={s.submitBtnText}>{t('planner_modal_custom_op', 'Create Operation')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 16 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  pageSub: { fontSize: 13, color: COLORS.textMuted, marginTop: -4 },

  sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  // Single Field Card (Member Dedicated View)
  singleFieldCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1.5, borderColor: COLORS.primary + '35', ...SHADOW.card },
  singleFieldLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  singleFieldIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryBg, justifyContent: 'center', alignItems: 'center' },
  singleFieldTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  singleFieldSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  singleFieldBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.successLight, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: COLORS.success + '30' },
  singleFieldBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.success },

  // Field Chips
  fieldChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff' },
  fieldChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg },
  fieldChipText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  fieldChipTextActive: { color: COLORS.primary, fontWeight: '800' },

  // Land Area Card
  areaCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, gap: 10, ...SHADOW.card, borderWidth: 1.5, borderColor: COLORS.primary + '30' },
  areaBody: { flex: 1, minWidth: 0 },
  areaLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase' },
  areaSub: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, lineHeight: 14 },
  areaInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.primary + '40', paddingHorizontal: 8, paddingVertical: 5, gap: 4, flexShrink: 0 },
  areaInput: { fontSize: 16, fontWeight: '800', color: COLORS.text, padding: 0, minWidth: 32, textAlign: 'center' },
  areaUnitBadge: { backgroundColor: COLORS.primaryBg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  areaUnitText: { fontSize: 12, fontWeight: '800', color: COLORS.primary },

  // Phase Chips
  phaseScroll: { marginHorizontal: -SPACING.lg, marginTop: 6 },
  phaseRow: { paddingHorizontal: SPACING.lg, gap: 8 },
  phaseChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#fff' },
  phaseChipText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  phaseChipTextActive: { color: '#fff', fontWeight: '800' },

  // Phase Info Card
  phaseInfoCard: { backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.card },
  phaseMonth: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  phaseDesc: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18, marginTop: 4 },

  // Requirements Card
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, gap: SPACING.md, ...SHADOW.card, borderWidth: 1, borderColor: COLORS.border },
  cardTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  cardSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  addItemBottomBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primaryBg, borderWidth: 1.5, borderColor: COLORS.primary + '40', borderStyle: 'dashed', borderRadius: RADIUS.md, paddingVertical: 12, marginTop: 4 },
  addItemBottomBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  hintText: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginTop: 4 },

  // Row Item Card
  itemRowCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  itemHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, flex: 1 },
  itemControlGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'center' },
  controlCol: { flex: 1, minWidth: 0 },
  controlLabel: { fontSize: 9.5, fontWeight: '700', color: COLORS.textMuted, marginBottom: 3, textTransform: 'uppercase' },
  controlInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 6, paddingVertical: 4 },
  controlPrefix: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, marginRight: 2 },
  controlInput: { flex: 1, fontSize: 12, fontWeight: '700', color: COLORS.text, padding: 0, minWidth: 24 },
  controlUnit: { fontSize: 10.5, color: COLORS.textMuted, marginLeft: 2 },
  itemTotalQty: { fontSize: 12.5, fontWeight: '800', color: COLORS.primary },
  itemSubtotal: { fontSize: 10.5, fontWeight: '700', color: COLORS.textSecondary, marginTop: 1 },

  // Budget Card
  budgetCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', gap: 6, ...SHADOW.card },
  budgetLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '800', letterSpacing: 0.5 },
  budgetValue: { fontSize: 32, fontWeight: '900', color: '#fff' },
  budgetSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  breakdownPillsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 6 },
  breakdownPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  breakdownPillText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  // Send to Draft Button
  sendDraftBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.success, paddingVertical: 14, paddingHorizontal: 16, borderRadius: RADIUS.md, ...SHADOW.card },
  sendDraftBtnText: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 0.3, textAlign: 'center' },

  disclaimerWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: SPACING.md, marginTop: 4 },
  disclaimer: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 16, flexShrink: 1 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  formLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase' },
  formInput: { backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontWeight: '600', color: COLORS.text },
  typeChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.sm, paddingVertical: 10, paddingHorizontal: 6, backgroundColor: '#fff', minHeight: 46 },
  typeChipText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, textAlign: 'center', flexShrink: 1 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 16, borderRadius: RADIUS.md, marginTop: 6 },
  submitBtnText: { fontSize: 14, fontWeight: '700', color: '#fff', textAlign: 'center', flexShrink: 1 },
});
