import React, { useState, useEffect, useContext, useMemo } from 'react';
import { getItem, setItem } from './storageService';

const STORAGE_KEY = '@hugpong_language';

export const LANGUAGES = [
  { key: 'en', label: 'English', native: 'English' },
  { key: 'tl', label: 'Filipino / Tagalog', native: 'Filipino' },
  { key: 'hil', label: 'Hiligaynon / Ilonggo', native: 'Hiligaynon (Ilonggo)' },
];

let currentLanguage = 'en';
const listeners = new Set();

export const TRANSLATIONS = {
  en: {
    // Nav Tabs
    tab_home: 'Home',
    tab_field_ops: 'Field Ops',
    tab_planner: 'Planner',
    tab_profile: 'Profile',

    // Role Banners & Headers
    role_member: 'Sugarcane Block Farm Member',
    role_manager: 'Block Farm Manager',
    role_sra: 'SRA Administrator',
    welcome_back: 'Welcome back',
    my_field: 'My Field',
    my_fields: 'My Fields',
    field_plot: 'Field Plot',
    operating_area: 'Operating Land Area',
    operating_area_sub: 'Enter total hectares for budget calculation',
    hectares: 'Hectares (Ha)',
    view_all_fields: 'View All Block Farm Fields',
    stage: 'Stage',
    age: 'Age',
    status: 'Status',
    not_synced: 'Not synced',
    synced: 'Synced',
    field_alloc_notice: 'Field allocations are managed by your Farm Manager. Contact them to add or update your field plot.',

    // Categories
    cat_all: 'All',
    cat_prep: 'Land Prep',
    cat_plant: 'Planting',
    cat_fert: 'Fertilization',
    cat_weed: 'Weeding & Care',
    cat_harvest: 'Harvesting',

    // Home Screen
    price_card_title: 'HPCo Silay Sugar Price',
    price_sub: 'Official Mill Gate Benchmark',
    price_molasses: 'Molasses Benchmark',
    price_update_hint: 'Tap to update official SRA benchmark prices',
    quick_actions: 'Quick Operations',
    action_log_ops: 'Log Field Operation',
    action_log_ops_sub: 'Record fertilizer, weeding, labor',
    action_planner: 'Crop Cycle Planner',
    action_planner_sub: 'Interactive budget calculator',
    action_analytics: 'Full Analytics & Costs',
    action_analytics_sub: 'Cost breakdowns & stage progress',
    action_sync_hub: 'Sync Monitor & Diagnostics',
    action_sync_hub_sub: 'Lagging members & phone dialer',
    stat_total_cost: 'Operational Costs',
    stat_active_ha: 'Active Hectares',
    stat_records: 'Total Records',
    stat_sync_health: 'Sync Health',
    price_offline_warning: 'Offline: Price may be outdated',
    per_lkg: 'per Lkg',
    per_mt: 'per MT',
    time_week: 'Week',
    time_month: 'Month',
    time_months: 'months',
    stat_monthly_avg: 'Monthly Avg',
    stat_year_peak: 'Crop Year Peak',
    stat_trend: 'Trend',
    empty_fields: 'No active fields assigned yet.',
    notif_title: 'Notifications',
    notif_mark_all: 'Mark all read',
    post_official_price: 'Post Official SRA Benchmark',
    price_per_bag: 'Price per Bag (Lkg)',
    price_per_molasses: 'Price per Molasses (MT)',
    btn_post_price: 'Post New Price',

    // Field Ops & Modals
    ops_title: 'Field Operations & Ledger',
    btn_log_operation: '+ Log Operation',
    btn_save_draft: 'Save as Draft',
    btn_save_field_draft: 'Save as Field Draft Log',
    btn_submit: 'Record Operation',
    btn_edit: 'Edit',
    btn_delete: 'Delete',
    btn_cancel: 'Cancel',
    btn_close: 'Close',
    btn_reset: 'Reset Defaults',
    btn_take_over: 'Take Over Field',
    btn_sync_now: 'Sync Records Now',
    btn_call_manager: 'Call Manager',
    btn_view_history: 'View Full History & Ledger',
    btn_stage_editor: 'Customize Crop Stages',
    btn_unplanned_work: '+ Unplanned Work',
    btn_generate_audit: 'GENERATE AUDIT LOGS',
    btn_assign_field: 'Assign New Field',
    member_label: 'Member',
    sync_info: 'Sync Info',
    cost_breakdown: 'Operational Cost Breakdown',
    avg_cost_ha: 'Avg Cost / Ha',
    show_more: 'Show More',
    show_less: 'Show Less',
    receipt_ref: 'Log Reference',
    receipt_coverage: 'Work Coverage',
    btn_edit_draft: 'Edit Draft',
    btn_submit_draft: 'Submit Draft',

    // Timeline & Stages
    timeline_title: 'Crop Cycle Timeline',
    tap_active_stage: 'Tap active stage to log',
    status_completed: 'Completed',
    status_in_progress: 'In Progress',
    status_pending: 'Pending',
    current_stage_badge: 'CURRENT STAGE',
    no_cycle_setup: 'No Crop Cycle Set Up Yet',
    no_cycle_sub: "Each field follows its own cycle. Set up your field's stages to start logging and tracking progress.",
    btn_use_sra_standard: 'Use SRA Standard (8 Stages)',
    btn_build_custom_cycle: 'Build Custom Cycle',
    btn_start_new_cycle: 'Start New Crop Year',
    banner_member_view: 'Member View — Log your field operations',
    banner_manager_view: 'Farm Manager View — Review & compile SRA reports',
    banner_sra_view: 'SRA Admin View — Scan QR & audit reports',
    stage_reorder_hint: 'tap icons to reorder or remove',
    no_stages_yet: 'No stages yet. Add your first stage below.',
    stage_has_logs: 'Has submitted logs',
    add_new_stage: 'Add New Stage',
    suggested_presets: 'Suggested Stage Presets (Tap to fill)',
    stage_name_placeholder: 'Stage name (e.g. Weeding – Hilamon)',
    stage_color: 'Stage Color',
    btn_add_stage: 'Add Stage',
    btn_reset_sra_template: 'Reset to SRA Standard Template',
    reset_sra_confirm_msg: 'Replace your custom stages with the SRA standard 8-stage template?',
    btn_save_stage_plan: 'Save Stage Plan',
    saved_title: 'Saved',
    stage_plan_saved_msg: 'Your field stages have been updated.',
    cannot_remove_stage_with_logs: 'has submitted logs. You cannot remove it while logs exist for this stage.',
    remove_stage_confirm: 'Remove Stage',
    stat_total_ha: 'Total Hectares',
    stat_block_farms: 'Block Farms',
    stat_active_members: 'Active Members',
    stat_farm_managers: 'Farm Managers',
    stat_total_cost: 'Total Op. Cost',
    stat_recorded_logs: 'Compiled Logs',
    farms_unit: 'Farms',
    members_unit: 'Members',
    managers_unit: 'Managers',
    logs_unit: 'Logs',
    report_fields_reported: 'Total Fields Reported',
    report_total_cost: 'Total Operational Cost',
    report_compiled_logs: 'Compiled Operation Logs',
    report_generated_date: 'Report Generated',
    last_scanned_report: 'Last Scanned Report',

    // SRA Tasks
    task_t1: 'Land Preparation',
    task_t2: 'Planting',
    task_t3: 'Pre-emergence Spraying',
    task_t4: 'Fertilization Stage 1 (18-46) & Ridge Busting',
    task_t5: 'Weeding, Fertilization Stage 2 (Urea) & Off-barring',
    task_t6: 'Weeding, Fertilization Stage 3 (Urea + Potash) & On-barring',
    task_t7: 'Final Off-barring',
    task_t8: 'Harvesting & Milling',

    // Form Labels
    form_field_id: 'Field ID *',
    form_category: 'Category / Agronomic Stage *',
    form_activity: 'Activity / Operation *',
    form_date: 'Date *',
    form_cost: 'Operational Cost (Php) *',
    form_hectares: 'Hectares Covered *',
    form_people_count: 'Number of Workers *',
    form_materials_section: 'Materials & Inputs Used (Aligned with Planner)',
    form_input_name: 'Material / Input Name',
    form_input_qty: 'Quantity',
    form_input_unit: 'Unit of Measure',
    form_attach_photo: 'Attach Field Photo or Receipt (Optional)',
    form_photo_added: 'Photo attached',
    form_take_photo: 'Take Photo / Upload',
    form_remove_photo: 'Remove Photo',
    form_tap_date: 'Tap to select date',
    form_notes: 'Notes / Remarks (Optional)',
    form_placeholder_activity: 'e.g. Fertilization Stage 2 (Urea application)',
    form_placeholder_cost: 'e.g. 4500',
    search_logs_placeholder: 'Search logs by activity, date, cost, materials...',
    search_drafts_placeholder: 'Search draft logs...',

    // Drafts
    drafts_title: 'Saved Draft Logs',
    drafts_unsubmitted: 'Unsubmitted',
    draft_created: 'Draft Log Created!',
    draft_created_msg: 'has been saved to your offline Draft Logs.',

    // Ledger
    ledger_title: 'Field Activity & Operational Ledger',
    tab_submitted: 'Submitted',
    tab_drafts: 'Drafts',
    tab_past: 'Past Cycles',
    empty_logs: 'No operational logs recorded yet.',
    btn_delete_past_cycles: 'Delete All Past Cycles',
    confirm_delete_past_cycles: 'This will remove past cycle records for this field from local device history. Active cycle logs are not affected.',
    past_cycles_deleted_msg: 'Past cycle history has been cleared from local history.',
    btn_delete_all: 'Delete All',

    // Sync & Offline Notifications
    sync_status_synced: 'Fully Synced with Cloud',
    sync_status_pending: 'Offline Logs Waiting to Sync',
    sync_btn_syncing: 'Synchronizing...',
    sync_toast_synced: 'Your sugarcane records are fully synchronized with the HUGPONG cloud. Safe to work offline.',
    sync_toast_complete: 'All local sugarcane operation logs have been successfully uploaded and compiled.',
    sync_warning_title: 'Sync Warning',
    sync_critical_title: 'Critical Sync Overdue',

    // Planner Screen
    planner_title: 'Resource Planner',
    planner_sub: 'Customizable phase deep-dive for materials, labor & budget planning.',
    planner_phase: 'Operation Phase',
    planner_custom_op: '+ Custom Operation',
    planner_filter_cat: 'Filter by Category',
    planner_budget: 'ESTIMATED BUDGET',
    planner_materials: 'Materials',
    planner_labor: 'Labor',
    operating_area: 'Operating Land Area',
    operating_area_sub: 'Enter hectares for budget calculation',
    planner_unit_rate: 'Rate (Php)',
    planner_dosage: 'Dosage / Ha',
    planner_total_needed: 'Total Needed',
    planner_add_item: '+ Add Custom Material or Labor Item',
    planner_modal_add_item: 'Add Custom Requirement',
    planner_modal_custom_op: 'Create Custom Operation',
    planner_requirements_title: 'Custom Requirements & Rates',
    planner_requirements_sub: 'Tweak dosages and prices per hectare to match this field.',
    planner_enter_area_hint: 'Enter land area above to compute quantities and costs.',
    planner_disclaimer: 'Customized for local block farm operations. Adjust rates and dosages anytime as field conditions require.',
    planner_budget_sub: 'For',

    // Planner Phases
    phase_landprep: 'Land Prep & Furrowing',
    phase_planting: 'Planting (Patdan)',
    phase_weed: 'Pre-emergence & Weed Control',
    phase_fert1: 'Fertilization Stage 1',
    phase_fert2: 'Fertilization Stage 2',
    phase_fert3: 'Fertilization Stage 3',
    phase_ratoon: 'Ratoon Maintenance',
    phase_harvest: 'Harvesting & Cutting',
    phase_hauling: 'Trucking & Hauling',

    // Phase Descriptions
    desc_landprep: 'Plowing, dragging, furrowing, and harrowing for soil preparation.',
    desc_planting: 'Cane points (patdan) purchase, hauling, dipping, and manual planting.',
    desc_weed: 'Herbicide application, backpack sprayers, and initial manual weeding.',
    desc_fert1: '18-46 (Ammonium Phosphate) fertilizer application with ridge busting.',
    desc_fert2: 'Urea fertilizer application, weeding, and off-barring.',
    desc_fert3: 'Urea + MOP (0-0-60 Potash) application and hilling-up (on-barring).',
    desc_ratoon: 'Stubble shaving, trash blanketing/burning, and ratoon cultivation.',
    desc_harvest: 'Cane cutting (tapas), bundling, and field loading.',
    desc_hauling: 'Loading onto sugarcane trucks and delivery to mill.',

    // Planner Material & Labor Items
    item_tractor_plowing: 'Tractor Plowing',
    item_dragging_furrowing: 'Dragging & Furrowing',
    item_field_prep_labor: 'Field Prep Labor',
    item_cane_points: 'Cane Points (Patdan)',
    item_seedpiece_hauling: 'Seedpiece Hauling',
    item_planting_labor: 'Planting Labor Crew',
    item_pre_emergence_herbicide: 'Pre-emergence Herbicide',
    item_sprayer_rental: 'Sprayer Equipment Rental',
    item_spraying_labor: 'Spraying & Weeding Labor',
    item_18_46_fert: '18-46 Fertilizer',
    item_ridge_busting: 'Ridge Busting / Off-barring',
    item_app_labor: 'Application Labor',
    item_urea_fert: 'Urea (46-0-0) Fertilizer',
    item_weeding_offbarring_labor: 'Weeding & Off-barring Labor',
    item_mop_fert: 'Muriate of Potash (MOP)',
    item_hilling_up_labor: 'Hilling-up / On-barring Labor',
    item_stubble_shaving: 'Stubble Shaving & Clearing',
    item_inter_row_cult: 'Inter-row Cultivation (Tractor)',
    item_initial_ratoon_urea: 'Initial Ratoon Urea',
    item_cane_cutters: 'Cane Cutters (Tapas)',
    item_cane_hauling: 'Cane Hauling & Trucking',
    item_custom_labor: 'Custom Labor Crew',

    // Analytics Screen
    analytics_title: 'Descriptive Analytics',
    analytics_tab_financial: 'Financial Diagnostics',
    analytics_tab_crop: 'Crop Diagnostics',
    analytics_eff_title: 'Cost-per-Hectare Efficiency',
    analytics_eff_sub: 'Compare operational cost efficiency across active plots',
    analytics_eff_note: 'Review field operations with high average costs.',
    analytics_stage_title: 'Hectares by Crop Stage',
    analytics_price_monitor: 'SRA Weekly Price Monitor',
    analytics_price_trajectory: 'SRA Monthly Price Trajectory',
    analytics_filter_field: 'Filter by Field',
    price_current: 'Current',
    price_season_high: 'Season High',
    price_season_low: 'Season Low',
    price_latest_month: 'Latest Month',
    price_peak_month: 'Peak Month',
    price_lowest_month: 'Lowest Month',

    // Member Sync Telemetry & Hub
    telemetry_title: 'Member Sync Monitor',
    telemetry_sub: 'Real-time telemetry and lagging terminal follow-up',
    telemetry_needs_attention: 'Needs Attention',
    telemetry_lag_warning: 'Lag (3+ days)',
    telemetry_critical: 'Critical (7+ days)',
    telemetry_all_members: 'All Members',
    telemetry_lagging_one: '1 Member Lagging',
    telemetry_open_hub: 'Open Hub',
    search_members_placeholder: 'Search members or field ID...',
    action_send_sms: 'Send SMS Notice',

    // Support Desk & Tickets
    support_desk_title: 'Help & Support Desk',
    support_desk_sub: 'Submit issues, sync collisions, or requests to SRA / Coop Admin',
    ticket_tab_send: 'Send New Ticket',
    ticket_tab_my: 'My Tickets',
    ticket_intro: 'Need assistance with offline sync, plot boundaries, or app errors? Your ticket will be queued directly to the cooperative dispatch team.',
    ticket_issue_category: 'Issue Category',
    ticket_urgency: 'Urgency / Priority',
    ticket_subject: 'Subject / Short Summary',
    ticket_description: 'Detailed Description',
    ticket_btn_send: 'Send Support Ticket',
    status_resolved: 'Resolved',
    status_open: 'Open',

    // Confirmations & Cache
    cache_clear_confirm_title: 'Clear Cache?',
    cache_clear_confirm_msg: 'This will remove all locally cached drafts and reset offline buffers. Unsynced local drafts will be wiped.\n\nAre you sure you want to proceed?',
    signout_confirm_title: 'Sign Out',
    signout_confirm_msg: 'Are you sure you want to sign out?',
    signout_unsynced_msg: 'You have pending unsynced records. Signing out without syncing may cause data loss. Please sync first or proceed anyway.',
    signout_btn_anyway: 'Sign Out Anyway',

    // Profile & Settings
    profile_title: 'Member Profile & Settings',
    profile_role: 'Role / Designation',
    profile_block_farm: 'Block Farm Location',
    profile_language: 'Language',
    profile_settings_mgmt: 'Settings & Management',
    profile_support: 'Help & Support Desk',
    profile_security: 'Security & Password',
    profile_sync_monitor: 'Member Sync Telemetry Monitor',
    profile_cache: 'Clear Local Cache',
    profile_logout: 'Sign Out / Switch User',
    cache_cleared: 'Cache Cleared',
    cache_cleared_msg: 'Local offline cache has been reset to defaults.',
    profile_op_assignment: 'Operational Assignment',
    profile_admin_jurisdiction: 'Administrative Jurisdiction',
    profile_supervising_farm: 'Supervising Farm',
    profile_supervised_scope: 'Supervised Scope',
    profile_regulatory_agency: 'Regulatory Agency',
    profile_mobile_contact: 'Mobile Contact',
    profile_sync_dashboard: 'Sync Dashboard',
    profile_pending: 'Pending',
    profile_synced: 'Synced',
    profile_last_synced: 'Last synced',
    profile_no_pending_sync: 'No pending logs to sync',
    profile_sync_now: 'Sync Now',
    profile_syncing: 'Syncing...',
    profile_auto_sync: 'Auto Sync',
    profile_demo_offline: 'Demo: Offline POV',
    profile_sra_status: 'SRA Regulatory System Status',
    profile_district_cert: 'District Certification:',
    profile_sra_certified: 'District VII Certified',
    profile_sra_circular: 'SRA Circular Version:',
    profile_central_node: 'Cloud Central Node:',
    profile_operational_uptime: 'Operational (100% Uptime)',
    profile_footer: 'v1.0.0 · HUGPONG Agricultural Platform\nData is encrypted and stored securely.',

    // Security & Password Screen
    sec_title: 'Security & Password',
    sec_data_protect_title: 'Data Protection',
    sec_data_protect_text: 'Your account data is encrypted. Never share your password with anyone, including HUGPONG staff.',
    sec_change_pw: 'Change Password',
    sec_curr_pw: 'Current Password',
    sec_new_pw: 'New Password',
    sec_confirm_pw: 'Confirm New Password',
    sec_update_pw: 'Update Password',
    sec_pw_changed: 'Password Changed',
    sec_pw_changed_msg: 'Your password has been updated successfully.',
    sec_err_curr_pw: 'Enter your current password',
    sec_err_short: 'New password must be at least 8 characters',
    sec_err_mismatch: 'New passwords do not match',
    sec_auth_title: 'Authentication',
    sec_bio_login: 'Biometric Login',
    sec_bio_login_sub: 'Use fingerprint or face ID',
    sec_pin_lock: 'PIN Lock',
    sec_pin_lock_sub: 'Require PIN on app open',
    sec_2fa: 'Two-Factor Auth',
    sec_2fa_sub: 'Send OTP to your mobile',
    sec_session_title: 'Session & Alerts',
    sec_login_alerts: 'Login Alerts',
    sec_login_alerts_sub: 'Notify when a new session starts',
    sec_signout_all: 'Sign Out All Devices',
    sec_signout_all_sub: 'Revoke all active sessions',
    sec_signout_all_title: 'Sign Out All Devices',
    sec_signout_all_msg: 'This will end all active sessions on all devices and require re-authentication.',
    sec_btn_signout_all: 'Sign Out All',
    sec_strength_8chars: '8+ chars',
    sec_strength_uppercase: 'Uppercase',
    sec_strength_number: 'Number',
    sec_strength_symbol: 'Symbol',
    sync_info_alert_title: 'Offline Synchronization Info',
    sync_info_alert_msg: 'When a member records operations offline in the field, logs are securely saved on the device. Records automatically upload once reconnected to internet or synced at the office.',
  },

  tl: {
    // Nav Tabs
    tab_home: 'Tahanan',
    tab_field_ops: 'Gawain sa Bukid',
    tab_planner: 'Plano sa Pananim',
    tab_profile: 'Profile',

    // Role Banners & Headers
    role_member: 'Miyembro ng Block Farm',
    role_manager: 'Tagapamahala ng Block Farm',
    role_sra: 'Tagapangasiwa ng SRA',
    welcome_back: 'Maligayang pagbabalik',
    my_field: 'Aking Bukid',
    my_fields: 'Aking mga Bukid',
    field_plot: 'Lote ng Bukid',
    operating_area: 'Sukat ng Lupang Sakahan',
    operating_area_sub: 'Ilagay ang kabuuang ektarya para sa badyet',
    hectares: 'Ektarya (Ha)',
    view_all_fields: 'Tingnan ang Lahat ng Bukid',
    stage: 'Yugto',
    age: 'Gulang',
    status: 'Katayuan',
    not_synced: 'Hindi pa naka-sync',
    synced: 'Naka-sync na',
    field_alloc_notice: 'Ang pagtatalaga ng bukid ay pinapamahalaan ng iyong Tagapamahala. Makipag-ugnayan sa kanila upang magdagdag o mag-update ng iyong lote.',

    // Categories
    cat_all: 'Lahat',
    cat_prep: 'Paghahanda ng Lupa',
    cat_plant: 'Pagtatanim',
    cat_fert: 'Pagpapataba (Abono)',
    cat_weed: 'Pagdamo at Pag-aalaga',
    cat_harvest: 'Pag-aani at Paghakot',

    // Home Screen
    price_card_title: 'Presyo ng Asukal sa HPCo Silay',
    price_sub: 'Opisyal na Presyo sa Tarangkahan ng Kiskisan',
    price_molasses: 'Presyo ng Molases',
    price_update_hint: 'Pindutin upang i-update ang opisyal na presyo ng SRA',
    quick_actions: 'Mabilisang Operasyon',
    action_log_ops: 'Magtala ng Gawain sa Bukid',
    action_log_ops_sub: 'I-rekord ang abono, damo, at manggagawa',
    action_planner: 'Plano ng Siklo ng Pananim',
    action_planner_sub: 'Tantyahin ang badyet at kagamitan',
    action_analytics: 'Buong Pagsusuri at Gastos',
    action_analytics_sub: 'Pagkakahati ng gastos at pag-unlad',
    action_sync_hub: 'Pagsubaybay sa Pag-sync',
    action_sync_hub_sub: 'Tingnan ang mga nahuhuling miyembro',
    stat_total_cost: 'Kabuuang Gastos',
    stat_active_ha: 'Aktibong Ektarya',
    stat_records: 'Kabuuang Tala',
    stat_sync_health: 'Kalagayan ng Sync',
    price_offline_warning: 'Offline: Maaaring hindi napapanahon ang presyo',
    per_lkg: 'bawat Lkg',
    per_mt: 'bawat MT',
    time_week: 'Linggo',
    time_month: 'Buwan',
    time_months: 'buwan',
    stat_monthly_avg: 'Karaniwang Buwanan',
    stat_year_peak: 'Tuktok ng Taon',
    stat_trend: 'Takbo',
    empty_fields: 'Wala pang nakatalagang bukid.',
    notif_title: 'Mga Abiso',
    notif_mark_all: 'Markahang nabasa lahat',
    post_official_price: 'Mag-post ng Opisyal na Presyo ng SRA',
    price_per_bag: 'Presyo bawat Sako (Lkg)',
    price_per_molasses: 'Presyo bawat Molases (MT)',
    btn_post_price: 'I-post ang Bagong Presyo',

    // Field Ops & Modals
    ops_title: 'Mga Gawain sa Bukid at Talaan',
    btn_log_operation: '+ Magtala ng Gawain',
    btn_save_draft: 'I-save bilang Draft',
    btn_save_field_draft: 'I-save bilang Field Draft',
    btn_submit: 'I-rekord ang Gawain',
    btn_edit: 'I-edit',
    btn_delete: 'Burahin',
    btn_cancel: 'Kanselahin',
    btn_close: 'Isara',
    btn_reset: 'Ibalik sa Dati',
    btn_take_over: 'Pamahalaan ang Bukid',
    btn_sync_now: 'I-sync ang Tala Ngayon',
    btn_call_manager: 'Tawagan ang Tagapamahala',
    btn_view_history: 'Tingnan ang Buong Kasaysayan',
    btn_stage_editor: 'Isaayos ang mga Yugto',
    btn_unplanned_work: '+ Hindi Nakaplanong Gawain',
    btn_generate_audit: 'GUMAWA NG MGA TALA SA AUDIT',
    btn_assign_field: 'Magtalaga ng Bagong Bukid',
    member_label: 'Miyembro',
    sync_info: 'Impormasyon sa Sync',
    cost_breakdown: 'Pagkakahati ng Gastos sa Operasyon',
    avg_cost_ha: 'Karaniwang Gastos / Ha',
    show_more: 'Ipakita Pa',
    show_less: 'Ipakita Nang Mas Kaunti',
    receipt_ref: 'Reperensya ng Tala',
    receipt_coverage: 'Sakop ng Trabaho',
    btn_edit_draft: 'I-edit ang Draft',
    btn_submit_draft: 'Isumite ang Draft',

    // Timeline & Stages
    timeline_title: 'Timeline ng Siklo ng Pananim',
    tap_active_stage: 'Pindutin ang aktibong yugto upang magtala',
    status_completed: 'Tapos na',
    status_in_progress: 'Kasalukuyang Ginagawa',
    status_pending: 'Naghihintay',
    current_stage_badge: 'KASALUKUYANG YUGTO',
    no_cycle_setup: 'Wala pang Naitatag na Siklo ng Pananim',
    no_cycle_sub: 'Bawat bukid ay may sariling siklo. Isaayos ang mga yugto ng iyong bukid upang masimulan ang pagtatala.',
    btn_use_sra_standard: 'Gamitin ang Pamantayan ng SRA (8 Yugto)',
    btn_build_custom_cycle: 'Bumuo ng Pasadyang Siklo',
    btn_start_new_cycle: 'Simulan ang Bagong Taon ng Pananim',
    banner_member_view: 'Tinginan ng Miyembro — Magtala ng mga gawain sa bukid',
    banner_manager_view: 'Tinginan ng Tagapamahala — Suriin at tipunin ang mga ulat ng SRA',
    banner_sra_view: 'Tinginan ng SRA Admin — I-scan ang QR at magsagawa ng audit',
    stage_reorder_hint: 'pindutin ang mga icon para isaayos o alisin',
    no_stages_yet: 'Wala pang mga yugto. Magdagdag ng unang yugto sa ibaba.',
    stage_has_logs: 'May naisumiteng tala',
    add_new_stage: 'Magdagdag ng Bagong Yugto',
    suggested_presets: 'Mga Iminumungkahing Yugto (Pindutin para ilagay)',
    stage_name_placeholder: 'Pangalan ng yugto (hal. Pagdamo – Weeding)',
    stage_color: 'Kulay ng Yugto',
    btn_add_stage: 'Idagdag ang Yugto',
    btn_reset_sra_template: 'Ibalik sa Pamantayan ng SRA',
    reset_sra_confirm_msg: 'Palitan ang iyong pasadyang mga yugto ng opisyal na 8-yugtong pamantayan ng SRA?',
    btn_save_stage_plan: 'I-save ang Plano ng Yugto',
    saved_title: 'Na-save na',
    stage_plan_saved_msg: 'Ang mga yugto ng iyong bukid ay matagumpay na na-update.',
    cannot_remove_stage_with_logs: 'ay may mga naisumiteng tala. Hindi ito maaaring alisin habang may tala para sa yugtong ito.',
    remove_stage_confirm: 'Alisin ang Yugto',
    stat_total_ha: 'Kabuuang Ektarya',
    stat_block_farms: 'Mga Block Farm',
    stat_active_members: 'Aktibong Miyembro',
    stat_farm_managers: 'Mga Tagapamahala',
    stat_total_cost: 'Kabuuang Gastos',
    stat_recorded_logs: 'Tinipong Tala',
    farms_unit: 'Sakahan',
    members_unit: 'Miyembro',
    managers_unit: 'Tagapamahala',
    logs_unit: 'Tala',
    report_fields_reported: 'Kabuuang Bukid sa Ulat',
    report_total_cost: 'Kabuuang Gastos sa Operasyon',
    report_compiled_logs: 'Tinipong Tala ng Operasyon',
    report_generated_date: 'Petsa ng Paggawa',
    last_scanned_report: 'Huling Na-scan na Ulat',

    // SRA Tasks
    task_t1: 'Paghahanda ng Lupa',
    task_t2: 'Pagtatanim',
    task_t3: 'Pag-spray Bago Sumibol',
    task_t4: 'Pagpapataba Yugto 1 (18-46) at Pagbubungkal',
    task_t5: 'Pagdamo, Pagpapataba Yugto 2 (Urea) at Off-barring',
    task_t6: 'Pagdamo, Pagpapataba Yugto 3 (Urea + Potash) at On-barring',
    task_t7: 'Huling Pagbubungkal (Final Off-barring)',
    task_t8: 'Pag-aani at Panggiling',

    // Form Labels
    form_field_id: 'ID ng Bukid *',
    form_category: 'Kategorya / Yugto ng Pagtatanim *',
    form_activity: 'Gawain / Operasyon *',
    form_date: 'Petsa *',
    form_cost: 'Gastos sa Gawain (Php) *',
    form_hectares: 'Sukat ng Ektarya *',
    form_people_count: 'Bilang ng mga Manggagawa *',
    form_materials_section: 'Mga Kagamitan at Patabang Ginamit',
    form_input_name: 'Pangalan ng Pataba / Gamit',
    form_input_qty: 'Dami ng Gamit',
    form_input_unit: 'Yunit ng Sukat',
    form_attach_photo: 'Maglakip ng Larawan ng Bukid o Resibo (Opsyonal)',
    form_photo_added: 'Nakalakip na ang larawan',
    form_take_photo: 'Kumuha ng Larawan / Mag-upload',
    form_remove_photo: 'Alisin ang Larawan',
    form_tap_date: 'Pindutin upang pumili ng petsa',
    form_notes: 'Karagdagang Tala (Opsyonal)',
    form_placeholder_activity: 'hal. Paglalagay ng Urea (Stage 2)',
    form_placeholder_cost: 'hal. 4500',
    search_logs_placeholder: 'Maghanap ayon sa gawain, petsa, gastos, gamit...',
    search_drafts_placeholder: 'Maghanap ng mga draft...',

    // Drafts
    drafts_title: 'Mga Na-save na Draft',
    drafts_unsubmitted: 'Hindi pa Naisusumite',
    draft_created: 'Nagawa ang Draft!',
    draft_created_msg: 'ay matagumpay na nai-save sa iyong mga offline Draft.',

    // Ledger
    ledger_title: 'Gawain sa Bukid at Talaan ng Gastos',
    tab_submitted: 'Naisumite',
    tab_drafts: 'Mga Draft',
    tab_past: 'Naraang Siklo',
    empty_logs: 'Wala pang naitalang operasyon.',
    btn_delete_past_cycles: 'Burahin Lahat ng Nakaraang Siklo',
    confirm_delete_past_cycles: 'Tatanggalin nito ang mga tala ng nakaraang siklo para sa bukid na ito mula sa lokal na kasaysayan ng device. Hindi maaapektuhan ang kasalukuyang aktibong tala.',
    past_cycles_deleted_msg: 'Nalinis na ang kasaysayan ng nakaraang siklo mula sa lokal na talaan.',
    btn_delete_all: 'Burahin Lahat',

    // Sync & Offline Notifications
    sync_status_synced: 'Naka-sync sa Cloud',
    sync_status_pending: 'May Tala na Naghihintay I-sync',
    sync_btn_syncing: 'Kasalukuyang Nag-sync...',
    sync_toast_synced: 'Ang iyong mga tala sa tubuhan ay ganap na naka-sync sa HUGPONG cloud. Ligtas magtrabaho offline.',
    sync_toast_complete: 'Lahat ng lokal na tala sa operasyon ng tubuhan ay matagumpay na nai-upload.',
    sync_warning_title: 'Babala sa Pag-sync',
    sync_critical_title: 'Kritikal na Pagkahuli sa Sync',

    // Planner Screen
    planner_title: 'Plano ng Siklo ng Tubo',
    planner_sub: 'Pagtatantya ng kagamitan, manggagawa at badyet sa bawat yugto.',
    planner_phase: 'Yugto ng Operasyon',
    planner_custom_op: '+ Pasadyang Gawain',
    planner_filter_cat: 'Salain ayon sa Kategorya',
    planner_budget: 'TINATAYANG BADYET',
    planner_materials: 'Mga Kagamitan/Pataba',
    planner_labor: 'Paggawa (Labor)',
    operating_area: 'Sukat ng Lupang Sakahan',
    operating_area_sub: 'Ilagay ang ektarya para sa badyet',
    planner_unit_rate: 'Presyo (Php)',
    planner_dosage: 'Dami / Ha',
    planner_total_needed: 'Kabuuan',
    planner_add_item: '+ Magdagdag ng Gamit o Manggagawa',
    planner_modal_add_item: 'Magdagdag ng Kagamitan',
    planner_modal_custom_op: 'Gumawa ng Pasadyang Operasyon',
    planner_requirements_title: 'Mga Kagamitan at Halaga',
    planner_requirements_sub: 'Isaayos ang dami at presyo bawat ektarya ayon sa iyong bukid.',
    planner_enter_area_hint: 'Ilagay ang sukat ng lupa sa itaas upang makwenta ang dami at gastos.',
    planner_disclaimer: 'Naaayon sa lokal na operasyon ng block farm. Maaaring baguhin ang presyo at dami anumang oras.',
    planner_budget_sub: 'Para sa',

    // Planner Phases
    phase_landprep: 'Paghahanda ng Lupa at Pag-aarado',
    phase_planting: 'Pagtatanim (Patdan)',
    phase_weed: 'Pag-spray Bago Sumibol at Pagdamo',
    phase_fert1: 'Pagpapataba Yugto 1 (18-46)',
    phase_fert2: 'Pagpapataba Yugto 2 (Urea)',
    phase_fert3: 'Pagpapataba Yugto 3 (Urea + Potash)',
    phase_ratoon: 'Pag-aalaga ng Ratoon',
    phase_harvest: 'Pag-aani at Pagtatapas',
    phase_hauling: 'Paghahakot sa Kiskisan',

    // Phase Descriptions
    desc_landprep: 'Pang-aararo, paghila, pagtutudling, at pagpapatag ng lupa.',
    desc_planting: 'Pagbili ng patdan, paghakot, pagbabad, at manu-manong pagtatanim.',
    desc_weed: 'Pag-spray ng pamatay-damo at panimulang pag-aalis ng damo.',
    desc_fert1: 'Paglalagay ng patabang 18-46 at pagbubungkal ng lupa.',
    desc_fert2: 'Paglalagay ng Urea, pagdamo, at off-barring.',
    desc_fert3: 'Paglalagay ng Urea at Potash (MOP) kasama ang on-barring.',
    desc_ratoon: 'Pag-ahit ng tuod, paglilinis, at pag-aalaga ng ratoon.',
    desc_harvest: 'Pagtatapas ng tubo, pagtali, at pagkarga.',
    desc_hauling: 'Pagsakay sa trak ng tubo at paghatid sa kiskisan.',

    // Planner Material & Labor Items
    item_tractor_plowing: 'Pang-aararo gamit ang Traktora',
    item_dragging_furrowing: 'Paghila at Pagtutudling',
    item_field_prep_labor: 'Manggagawa sa Paghahanda',
    item_cane_points: 'Pangtatanim na Patdan',
    item_seedpiece_hauling: 'Paghahakot ng Patdan',
    item_planting_labor: 'Manggagawa sa Pagtatanim',
    item_pre_emergence_herbicide: 'Pamatay-damo Bago Sumibol',
    item_sprayer_rental: 'Renta ng Sprayer',
    item_spraying_labor: 'Manggagawa sa Pag-spray at Pagdamo',
    item_18_46_fert: '18-46 na Pataba',
    item_ridge_busting: 'Off-barring / Pagbubungkal',
    item_app_labor: 'Manggagawa sa Pagpapataba',
    item_urea_fert: 'Urea (46-0-0) na Pataba',
    item_weeding_offbarring_labor: 'Manggagawa sa Pagdamo at Off-barring',
    item_mop_fert: 'Potash (MOP) na Pataba',
    item_hilling_up_labor: 'Manggagawa sa On-barring',
    item_stubble_shaving: 'Pang-ahit ng Tuod at Paglilinis',
    item_inter_row_cult: 'Pagbubungkal sa Pagitan ng Tubuhan',
    item_initial_ratoon_urea: 'Urea para sa Ratoon',
    item_cane_cutters: 'Manggagawa sa Pagtatapas',
    item_cane_hauling: 'Paghahakot at Truck sa Kiskisan',
    item_custom_labor: 'Pasadyang Manggagawa',

    // Analytics Screen
    analytics_title: 'Pagsusuri at Estadistika',
    analytics_tab_financial: 'Pagsusuri sa Pananalapi',
    analytics_tab_crop: 'Pagsusuri sa Pananim',
    analytics_eff_title: 'Kahusayan ng Gastos bawat Ektarya',
    analytics_eff_sub: 'Paghambingin ang gastos sa bawat aktibong lote',
    analytics_eff_note: 'Suriin ang mga operasyong may mataas na karaniwang gastos.',
    analytics_stage_title: 'Ektarya ayon sa Yugto ng Pananim',
    analytics_price_monitor: 'Lingguhang Presyo ayon sa SRA',
    analytics_price_trajectory: 'Buwanang Takbo ng Presyo ayon sa SRA',
    analytics_filter_field: 'Salain ayon sa Bukid',
    price_current: 'Kasalukuyan',
    price_latest_month: 'Huling Buwan',
    price_season_high: 'Mataas (Taon)',
    price_peak_month: 'Tuktok na Buwan',
    price_season_low: 'Mababa (Taon)',
    price_lowest_month: 'Mababang Buwan',

    // Member Sync Telemetry & Hub
    telemetry_title: 'Pagsubaybay sa Sync ng Miyembro',
    telemetry_sub: 'Real-time na estado at pagsubaybay sa mga terminal',
    telemetry_needs_attention: 'Kailangan ng Pansin',
    telemetry_lag_warning: 'Nahuhuli (3+ araw)',
    telemetry_critical: 'Kritikal (7+ araw)',
    telemetry_all_members: 'Lahat ng Miyembro',
    telemetry_lagging_one: '1 Miyembrong Nahuhuli',
    telemetry_open_hub: 'Buksan ang Hub',
    search_members_placeholder: 'Maghanap ng miyembro o ID...',
    action_send_sms: 'Magpadala ng SMS',

    // Support Desk & Tickets
    support_desk_title: 'Tulong at Suporta',
    support_desk_sub: 'Magsumite ng problema, aberya sa sync, o kahilingan sa Admin',
    ticket_tab_send: 'Magpadala ng Ticket',
    ticket_tab_my: 'Aking mga Ticket',
    ticket_intro: 'Kailangan ng tulong sa offline sync, boundary ng lote, o error sa app? Ang iyong ticket ay direktang maipapadala sa dispatch team.',
    ticket_issue_category: 'Kategorya ng Problema',
    ticket_urgency: 'Antas ng Pangangailangan',
    ticket_subject: 'Paksa / Buod',
    ticket_description: 'Detalyadong Paliwanag',
    ticket_btn_send: 'Ipadala ang Ticket',
    status_resolved: 'Nalutas na',
    status_open: 'Bukas',

    // Confirmations & Cache
    cache_clear_confirm_title: 'Linisin ang Cache?',
    cache_clear_confirm_msg: 'Tatanggalin nito ang lahat ng lokal na draft at ire-reset ang offline buffers.\n\nSigurado ka bang nais mong magpatuloy?',
    signout_confirm_title: 'Mag-sign Out',
    signout_confirm_msg: 'Sigurado ka bang nais mong mag-sign out?',
    signout_unsynced_msg: 'Mayroon kang mga hindi pa naka-sync na tala. Ang pag-sign out nang hindi nag-sync ay maaaring magdulot ng pagkawala ng datos.',
    signout_btn_anyway: 'Mag-sign Out Pa Rin',

    // Profile & Settings
    profile_title: 'Profile ng Miyembro at Setting',
    profile_role: 'Tungkulin',
    profile_block_farm: 'Lokasyon ng Block Farm',
    profile_language: 'Wika / Salita',
    profile_settings_mgmt: 'Mga Setting at Pamamahala',
    profile_support: 'Tulong at Suporta',
    profile_security: 'Seguridad at Password',
    profile_sync_monitor: 'Pagsubaybay sa Sync ng Miyembro',
    profile_cache: 'Linisin ang Lokal na Cache',
    profile_logout: 'Mag-logout / Magpalit ng Gumagamit',
    cache_cleared: 'Nalinis ang Cache',
    cache_cleared_msg: 'Ang offline cache ay naibalik sa default na estado.',
    profile_op_assignment: 'Itinalagang Operasyon',
    profile_admin_jurisdiction: 'Huriskdiksiyong Administratibo',
    profile_supervising_farm: 'Pinangangasiwaang Sakahan',
    profile_supervised_scope: 'Nasasakupang Sakahan',
    profile_regulatory_agency: 'Ahensyang Nagpapatupad',
    profile_mobile_contact: 'Numero ng Telepono',
    profile_sync_dashboard: 'Dashboard ng Pag-sync',
    profile_pending: 'Naghihintay',
    profile_synced: 'Naka-sync',
    profile_last_synced: 'Huling na-sync',
    profile_no_pending_sync: 'Walang nakabinbing tala na kailangang i-sync',
    profile_sync_now: 'I-sync Ngayon',
    profile_syncing: 'Kasalukuyang Nag-sync...',
    profile_auto_sync: 'Kusang Pag-sync',
    profile_demo_offline: 'Demo: Katayuang Offline',
    profile_sra_status: 'Katayuan ng Sistema ng SRA',
    profile_district_cert: 'Sertipikasyon ng Distrito:',
    profile_sra_certified: 'Sertipikado sa Distrito VII',
    profile_sra_circular: 'Bersyon ng SRA Circular:',
    profile_central_node: 'Sentral na Node sa Cloud:',
    profile_operational_uptime: 'Gumagana (100% Uptime)',
    profile_footer: 'v1.0.0 · HUGPONG Agricultural Platform\nAng datos ay protektado at ligtas na nakatala.',

    // Security & Password Screen
    sec_title: 'Seguridad at Password',
    sec_data_protect_title: 'Proteksyon ng Datos',
    sec_data_protect_text: 'Naka-encrypt ang datos ng iyong account. Huwag ibahagi ang iyong password kahit kanino, kabilang ang kawani ng HUGPONG.',
    sec_change_pw: 'Palitan ang Password',
    sec_curr_pw: 'Kasalukuyang Password',
    sec_new_pw: 'Bagong Password',
    sec_confirm_pw: 'Kumpirmahin ang Bagong Password',
    sec_update_pw: 'I-update ang Password',
    sec_pw_changed: 'Napalitan na ang Password',
    sec_pw_changed_msg: 'Matagumpay na na-update ang iyong password.',
    sec_err_curr_pw: 'Ilagay ang iyong kasalukuyang password',
    sec_err_short: 'Ang bagong password ay dapat may hindi bababa sa 8 karakter',
    sec_err_mismatch: 'Hindi magkatugma ang mga bagong password',
    sec_auth_title: 'Pagpapatotoo (Authentication)',
    sec_bio_login: 'Biometric Login',
    sec_bio_login_sub: 'Gamitin ang fingerprint o face ID',
    sec_pin_lock: 'PIN Lock',
    sec_pin_lock_sub: 'Hingin ang PIN sa pagbukas ng app',
    sec_2fa: 'Two-Factor Auth (2FA)',
    sec_2fa_sub: 'Magpadala ng OTP sa iyong cellphone',
    sec_session_title: 'Sesyon at mga Alerto',
    sec_login_alerts: 'Mga Alerto sa Pag-login',
    sec_login_alerts_sub: 'Abisuhan kapag may bagong sesyon na nagbukas',
    sec_signout_all: 'I-sign Out sa Lahat ng Device',
    sec_signout_all_sub: 'Tapusin ang lahat ng aktibong sesyon',
    sec_signout_all_title: 'I-sign Out sa Lahat ng Device',
    sec_signout_all_msg: 'Tatapusin nito ang lahat ng aktibong sesyon sa lahat ng device at hihingi muli ng pag-login.',
    sec_btn_signout_all: 'I-sign Out Lahat',
    sec_strength_8chars: '8+ karakter',
    sec_strength_uppercase: 'Malaking titik',
    sec_strength_number: 'Numero',
    sec_strength_symbol: 'Simbolo',
    sync_info_alert_title: 'Impormasyon sa Offline Sync',
    sync_info_alert_msg: 'Kapag ang miyembro ay nagtala ng operasyon nang offline sa bukid, ligtas itong naitatala sa device. Awtomatiko itong maia-upload pagka-konekta sa internet o pagka-sync sa opisina.',
  },

  hil: {
    // Nav Tabs
    tab_home: 'Balay',
    tab_field_ops: 'Hilikuton sa Uma',
    tab_planner: 'Plano sa Patdan',
    tab_profile: 'Profile',

    // Role Banners & Headers
    role_member: 'Miyembro sang Block Farm',
    role_manager: 'Manugdumala sang Block Farm',
    role_sra: 'Opisyal sang SRA',
    welcome_back: 'Maayong pagbalik',
    my_field: 'Akon Uma',
    my_fields: 'Akon mga Uma',
    field_plot: 'Plot sang Uma',
    operating_area: 'Kalaparon sang Uma',
    operating_area_sub: 'Ibutang ang kabug-osan nga ektarya sang uma',
    hectares: 'Ektarya (Ha)',
    view_all_fields: 'Tan-awa ang Tanan nga Uma',
    stage: 'Yugto',
    age: 'Edad',
    status: 'Kaimtangan',
    not_synced: 'Wala pa na-sync',
    synced: 'Naka-sync na',
    field_alloc_notice: 'Ang pag-assign sang uma ginadumalahan sang imo Farm Manager. Pakig-angot sa ila para magdugang ukon mag-update sang imo plot sang uma.',

    // Categories
    cat_all: 'Tanan',
    cat_prep: 'Arado kag Tudling',
    cat_plant: 'Patdan kag Tanom',
    cat_fert: 'Pag-abono (Urea/18-46)',
    cat_weed: 'Hilamon kag Sagbot',
    cat_harvest: 'Tapas kag Karga',

    // Home Screen
    price_card_title: 'Presyo sang Kalamay sa HPCo Silay',
    price_sub: 'Opisyal nga Presyo sa Central sang Tubuhan',
    price_molasses: 'Presyo sang Molases',
    price_update_hint: 'Pislita para i-update ang opisyal nga presyo sang SRA',
    quick_actions: 'Madasig nga Hilikuton',
    action_log_ops: 'Mag-rekord sang Hilikuton',
    action_log_ops_sub: 'I-rekord ang abono, hilamon, manug-obra',
    action_planner: 'Plano sang Siklo sang Tubo',
    action_planner_sub: 'Kalkulahon ang badyet kag gamiton',
    action_analytics: 'Kabilugan nga Gastos kag Analitiks',
    action_analytics_sub: 'Detalyado nga kabilugan sang gastos',
    action_sync_hub: 'Monitor sang Pag-sync sang Miyembro',
    action_sync_hub_sub: 'Tan-awa ang mga ulihi sa pag-sync',
    stat_total_cost: 'Kabilugan nga Gastos',
    stat_active_ha: 'Aktibo nga Ektarya',
    stat_records: 'Kabilugan nga Rekord',
    stat_sync_health: 'Kalagayan sang Sync',
    price_offline_warning: 'Offline: Basi indi bag-o ang presyo',
    per_lkg: 'kada Lkg',
    per_mt: 'kada MT',
    time_week: 'Semana',
    time_month: 'Bulan',
    time_months: 'bulan',
    stat_monthly_avg: 'Kinaandan nga Bulan',
    stat_year_peak: 'Pinakamataas sa Tuig',
    stat_trend: 'Dalagan',
    empty_fields: 'Wala pa sang nadestino nga uma.',
    notif_title: 'Mga Pahibalo',
    notif_mark_all: 'Markahan nga nabasa tanan',
    post_official_price: 'Mag-post sang Opisyal nga Presyo sang SRA',
    price_per_bag: 'Presyo kada Sako (Lkg)',
    price_per_molasses: 'Presyo kada Molases (MT)',
    btn_post_price: 'I-post ang Bag-o nga Presyo',

    // Field Ops & Modals
    ops_title: 'Hilikuton sa Uma kag Listahan',
    btn_log_operation: '+ Mag-rekord sang Hilikuton',
    btn_save_draft: 'I-save bilang Draft',
    btn_save_field_draft: 'I-save bilang Draft sang Uma',
    btn_submit: 'I-rekord ang Hilikuton',
    btn_edit: 'Bag-uhon',
    btn_delete: 'Panason',
    btn_cancel: 'Kanselahon',
    btn_close: 'Takpan',
    btn_reset: 'I-reset ang Filter',
    btn_take_over: 'Dumalahan ang Uma',
    btn_sync_now: 'I-sync ang Rekord Subong',
    btn_call_manager: 'Tawagan ang Manugdumala',
    btn_view_history: 'Tan-awa ang Tanan nga Rekord',
    btn_stage_editor: 'Bag-uhon ang Yugto sang Tanom',
    btn_unplanned_work: '+ Wala Na-plano nga Hilikuton',
    btn_generate_audit: 'MAGHIMO SANG AUDIT REKORD',
    btn_assign_field: 'Magtugyan sang Bag-o nga Uma',
    member_label: 'Miyembro',
    sync_info: 'Impormasyon sa Sync',
    cost_breakdown: 'Kabilugan sang Gastos sa Hilikuton',
    avg_cost_ha: 'Kinaandan nga Gastos / Ha',
    show_more: 'Ipakita Pa',
    show_less: 'Ipakita sang Diutay',
    receipt_ref: 'Reperensya sang Rekord',
    receipt_coverage: 'Kabilugan sang Na-obra',
    btn_edit_draft: 'Bag-uhon ang Draft',
    btn_submit_draft: 'Isumiter ang Draft',

    // Timeline & Stages
    timeline_title: 'Timeline sang Yugto sang Tubo',
    tap_active_stage: 'Pislita ang aktibo nga yugto para mag-rekord',
    status_completed: 'Nahuman na',
    status_in_progress: 'Karon Gina-obra',
    status_pending: 'Wala pa',
    current_stage_badge: 'SUBONG NGA YUGTO',
    no_cycle_setup: 'Wala pa sang Na-set up nga Siklo sang Tubo',
    no_cycle_sub: 'Kada uma may kaugalingon nga siklo. I-set up ang mga yugto sang imo uma para makasugod sa pag-rekord.',
    btn_use_sra_standard: 'Gamiton ang Standard sang SRA (8 Yugto)',
    btn_build_custom_cycle: 'Maghimo sang Kaugalingon nga Siklo',
    btn_start_new_cycle: 'Suguran ang Bag-o nga Tuig sang Pananom',
    banner_member_view: 'Panan-aw sang Miyembro — Mag-rekord sang mga hilikuton sa uma',
    banner_manager_view: 'Panan-aw sang Manugdumala — Usisaon kag tipunon ang mga report sang SRA',
    banner_sra_view: 'Panan-aw sang SRA Admin — I-scan ang QR kag mag-audit sang report',
    stage_reorder_hint: 'pislita ang icon para husayon ukon kuhaon',
    no_stages_yet: 'Wala pa sang yugto. Magdugang sang una nga yugto sa idalom.',
    stage_has_logs: 'May naisumite nga rekord',
    add_new_stage: 'Magdugang sang Bag-o nga Yugto',
    suggested_presets: 'Mga Rekomendado nga Yugto (Pislita para ibutang)',
    stage_name_placeholder: 'Pangalan sang yugto (hal. Pang-hilamon)',
    stage_color: 'Kolor sang Yugto',
    btn_add_stage: 'Idugang ang Yugto',
    btn_reset_sra_template: 'Ibalik sa Standard sang SRA',
    reset_sra_confirm_msg: 'Ilisan ang imo kinaandan nga yugto sang opisyal nga 8-yugto nga template sang SRA?',
    btn_save_stage_plan: 'I-save ang Plano sang Yugto',
    saved_title: 'Na-save na',
    stage_plan_saved_msg: 'Ang mga yugto sang imo uma madinalag-on nga na-update.',
    cannot_remove_stage_with_logs: 'may mga naisumite nga rekord. Indi mo ini pwede mapanas samtang may rekord para sa sini nga yugto.',
    remove_stage_confirm: 'Kuhaon ang Yugto',
    stat_total_ha: 'Kabilugan nga Ektarya',
    stat_block_farms: 'Mga Block Farm',
    stat_active_members: 'Aktibo nga Miyembro',
    stat_farm_managers: 'Mga Manugdumala',
    stat_total_cost: 'Kabilugan nga Gastos',
    stat_recorded_logs: 'Gintipon nga Tala',
    farms_unit: 'Uma',
    members_unit: 'Miyembro',
    managers_unit: 'Manugdumala',
    logs_unit: 'Rekord',
    report_fields_reported: 'Kabilugan nga Uma sa Report',
    report_total_cost: 'Kabilugan nga Gastos sa Hilikuton',
    report_compiled_logs: 'Gintipon nga Tala sang Hilikuton',
    report_generated_date: 'Petsa sang Pagtuga',
    last_scanned_report: 'Ulihi nga Na-scan nga Report',

    // SRA Tasks
    task_t1: 'Pang-arado kag Tudling',
    task_t2: 'Pagtanom sang Patdan',
    task_t3: 'Pag-spray sang Hilamon',
    task_t4: 'Pag-abono Yugto 1 (18-46) kag Pag-arado',
    task_t5: 'Hilamon, Pag-abono Yugto 2 (Urea) kag Pasulod',
    task_t6: 'Hilamon, Pag-abono Yugto 3 (Urea + Potash) kag Pagpagwa',
    task_t7: 'Ulihi nga Pagpasulod (Final Off-barring)',
    task_t8: 'Tapas, Karga kag Galing',

    // Form Labels
    form_field_id: 'ID sang Uma *',
    form_category: 'Kategorya sang Hilikuton *',
    form_activity: 'Hilikuton / Operasyon *',
    form_date: 'Petsa *',
    form_cost: 'Gastos sa Hilikuton (Php) *',
    form_hectares: 'Kalaparon sang Ektarya *',
    form_people_count: 'Kadamuon sang Manug-obra *',
    form_materials_section: 'Mga Gamit kag Abono nga Gingamit',
    form_input_name: 'Pangalan sang Abono / Bulong',
    form_input_qty: 'Kadamuon sang Abono / Gamit',
    form_input_unit: 'Yunit sang Sukat',
    form_attach_photo: 'Magbutang sang Litrato sang Uma ukon Resibo (Kon may ara)',
    form_photo_added: 'Nabutang na ang litrato',
    form_take_photo: 'Magkuha sang Litrato / Mag-upload',
    form_remove_photo: 'Kuhaon ang Litrato',
    form_tap_date: 'Pislita para magpili sang petsa',
    form_notes: 'Dugang nga Paathag (Kon may ara)',
    form_placeholder_activity: 'hal. Pag-abono sang Urea (Yugto 2)',
    form_placeholder_cost: 'hal. 4500',
    search_logs_placeholder: 'Magpangita suno sa hilikuton, petsa, gastos, gamit...',
    search_drafts_placeholder: 'Magpangita sang mga draft...',

    // Drafts
    drafts_title: 'Mga Na-save nga Draft',
    drafts_unsubmitted: 'Wala pa na-sumite',
    draft_created: 'Nakahimo sang Draft!',
    draft_created_msg: 'na-save na sa imo offline Draft logs.',

    // Ledger
    ledger_title: 'Hilikuton sa Uma kag Listahan sang Gastos',
    tab_submitted: 'Naisumite',
    tab_drafts: 'Mga Draft',
    tab_past: 'Nagligad nga Siklo',
    empty_logs: 'Wala pa sang na-rekord nga hilikuton.',
    btn_delete_past_cycles: 'Panason ang Tanan nga Nagligad nga Siklo',
    confirm_delete_past_cycles: 'Kuhaon sini ang mga rekord sang nagligad nga siklo para sa sini nga uma sa memory sang device. Indi maapektuhan ang subong nga aktibo nga rekord.',
    past_cycles_deleted_msg: 'Napanas na ang rekord sang nagligad nga siklo sa lokal nga memory.',
    btn_delete_all: 'Panason Tanan',

    // Sync & Offline Notifications
    sync_status_synced: 'Naka-sync na sa Cloud',
    sync_status_pending: 'May Rekord nga Ginahulat I-sync',
    sync_btn_syncing: 'Ginasynchronize pa...',
    sync_toast_synced: 'Ang imo mga rekord sa kampo sang tubo kompleto nga naka-sync sa HUGPONG cloud. Hilway ka maka-obra offline.',
    sync_toast_complete: 'Ang tanan nga lokal nga rekord sang hilikuton madinalag-on nga na-upload.',
    sync_warning_title: 'Pahibalo sa Pag-sync',
    sync_critical_title: 'Ulihi sa Pag-sync',

    // Planner Screen
    planner_title: 'Plano sang Siklo sang Tubo',
    planner_sub: 'Detalyado nga plano sang gamit, manug-obra kag badyet sa tagsa ka yugto.',
    planner_phase: 'Yugto sang Hilikuton',
    planner_custom_op: '+ Kinaandan nga Hilikuton',
    planner_filter_cat: 'Pilion suno sa Kategorya',
    planner_budget: 'GINABULUBANTA NGA GASTOS',
    planner_materials: 'Mga Gamit / Abono',
    planner_labor: 'Manug-obra (Labor)',
    operating_area: 'Kalaparon sang Uma',
    operating_area_sub: 'Ibutang ang ektarya para sa badyet',
    planner_unit_rate: 'Presyo (Php)',
    planner_dosage: 'Kadamuon / Ha',
    planner_total_needed: 'Kabilugan',
    planner_add_item: '+ Magdugang sang Gamit ukon Manug-obra',
    planner_modal_add_item: 'Dugang nga Kinahanglanon',
    planner_modal_custom_op: 'Maghimo sang Kinaandan nga Hilikuton',
    planner_requirements_title: 'Mga Kinahanglanon kag Presyo',
    planner_requirements_sub: 'Bag-uhon ang kadamuon kag presyo kada ektarya para sa imo uma.',
    planner_enter_area_hint: 'Ibutang ang kalaparon sang uma sa ibabaw para makwenta ang gastos.',
    planner_disclaimer: 'Ginpahaum para sa lokal nga block farm. Pwede mo mabag-o ang presyo kag kadamuon suno sa kahimtangan sang uma.',
    planner_budget_sub: 'Para sa',

    // Planner Phases
    phase_landprep: 'Pang-arado kag Tudling',
    phase_planting: 'Pagtanom sang Patdan',
    phase_weed: 'Pag-spray sang Hilamon',
    phase_fert1: 'Pag-abono Yugto 1 (18-46)',
    phase_fert2: 'Pag-abono Yugto 2 (Urea)',
    phase_fert3: 'Pag-abono Yugto 3 (Urea + Potash)',
    phase_ratoon: 'Pang-atipan sang Ratoon',
    phase_harvest: 'Tapas kag Karga',
    phase_hauling: 'Hakot kag Karga sa Central',

    // Phase Descriptions
    desc_landprep: 'Pang-arado, pagkalaykay, pagtudling, kag pag-preparar sang duta.',
    desc_planting: 'Pagbakal sang patdan, paghakot, pagbuntog, kag pagtanom sang patdan.',
    desc_weed: 'Pag-spray sang bulong sa hilamon kag pagpang-hilamon.',
    desc_fert1: 'Pag-abono sang 18-46 kag pagpasulod sang arado.',
    desc_fert2: 'Pag-abono sang Urea, pag-hilamon, kag pasulod.',
    desc_fert3: 'Pag-abono sang Urea kag Potash (MOP) upod ang pagpagwa / on-barring.',
    desc_ratoon: 'Pang-utod sang tuod, pag-hawan, kag pag-arado sang ratoon.',
    desc_harvest: 'Pagtapas sang tubo, pag-bugkos, kag pagkarga.',
    desc_hauling: 'Pagkarga sa trak sang tubo kag pagdul-ong sa Central.',

    // Planner Material & Labor Items
    item_tractor_plowing: 'Pang-arado sang Traktora',
    item_dragging_furrowing: 'Pag-kalaykay kag Tudling',
    item_field_prep_labor: 'Manug-obra sa Pag-arado',
    item_cane_points: 'Patdan sang Tubo',
    item_seedpiece_hauling: 'Hakot sang Patdan',
    item_planting_labor: 'Manug-tanom sang Patdan',
    item_pre_emergence_herbicide: 'Bulong sa Sagbot / Hilamon',
    item_sprayer_rental: 'Renta sang Bomba / Sprayer',
    item_spraying_labor: 'Manug-spray kag Manug-hilamon',
    item_18_46_fert: '18-46 nga Abono',
    item_ridge_busting: 'Pasulod / Pag-arado sang Bangko',
    item_app_labor: 'Manug-pataba / Manug-abono',
    item_urea_fert: 'Urea (46-0-0) nga Abono',
    item_weeding_offbarring_labor: 'Manug-hilamon kag Pasulod',
    item_mop_fert: 'Potash (MOP) nga Abono',
    item_hilling_up_labor: 'Manug-pagwa / On-barring',
    item_stubble_shaving: 'Pang-utod sang Tuod kag Pang-hawan',
    item_inter_row_cult: 'Pag-arado sa Ulot sang Tubo',
    item_initial_ratoon_urea: 'Urea para sa Ratoon',
    item_cane_cutters: 'Manug-tapas sang Tubo',
    item_cane_hauling: 'Hakot kag Trucking sa Central',
    item_custom_labor: 'Kinaandan nga Manug-obra',

    // Analytics Screen
    analytics_title: 'Analitiks kag Estadistika',
    analytics_tab_financial: 'Analitiks sa Pinansyal',
    analytics_tab_crop: 'Analitiks sa Pananom',
    analytics_eff_title: 'Episensya sang Gastos kada Ektarya',
    analytics_eff_sub: 'Ikomparar ang gasto kada plot sang uma',
    analytics_eff_note: 'Usisaon ang mga hilikuton nga may mataas nga gastos.',
    analytics_stage_title: 'Ektarya suno sa Yugto sang Tubo',
    analytics_price_monitor: 'Semanal nga Presyo sang SRA',
    analytics_price_trajectory: 'Bulanon nga Dalagan sang Presyo',
    analytics_filter_field: 'Pilion suno sa Uma',
    price_current: 'Subong',
    price_latest_month: 'Ulihi nga Bulan',
    price_season_high: 'Mataas (Tuig)',
    price_peak_month: 'Tuktok nga Bulan',
    price_season_low: 'Mababa (Tuig)',
    price_lowest_month: 'Nubo nga Bulan',

    // Member Sync Telemetry & Hub
    telemetry_title: 'Monitor sang Pag-sync sang Miyembro',
    telemetry_sub: 'Real-time nga monitor kag pag-follow up sa mga terminal',
    telemetry_needs_attention: 'Kinahanglan Tutokan',
    telemetry_lag_warning: 'Ulihi (3+ ka adlaw)',
    telemetry_critical: 'Kritikal (7+ ka adlaw)',
    telemetry_all_members: 'Tanan nga Miyembro',
    telemetry_lagging_one: '1 ka Miyembro ang Ulihi',
    telemetry_open_hub: 'Buksan ang Hub',
    search_members_placeholder: 'Magpangita sang miyembro ukon ID...',
    action_send_sms: 'Magpadala sang SMS',

    // Support Desk & Tickets
    support_desk_title: 'Bulig kag Serbisyo',
    support_desk_sub: 'Magsumite sang problema, aberya sa sync, ukon hangyo sa Admin',
    ticket_tab_send: 'Magpadala sang Ticket',
    ticket_tab_my: 'Akon mga Ticket',
    ticket_intro: 'Kinahanglan mo bulig sa offline sync, boundary sang plot, ukon error sa app? Ang imo ticket diretso nga ipadala sa dispatch team sang kooperatiba.',
    ticket_issue_category: 'Kategorya sang Problema',
    ticket_urgency: 'Kadasigon / Importansya',
    ticket_subject: 'Tema / Malip-ot nga Paathag',
    ticket_description: 'Detalyado nga Paathag',
    ticket_btn_send: 'Ipadala ang Ticket',
    status_resolved: 'Nasolbar na',
    status_open: 'Bukas',

    // Confirmations & Cache
    cache_clear_confirm_title: 'Tinluan ang Cache?',
    cache_clear_confirm_msg: 'Kuhaon sini ang tanan nga lokal nga draft kag i-reset ang offline buffers.\n\nSigurado ka gid nga magpadayon?',
    signout_confirm_title: 'Maggwa / Sign Out',
    signout_confirm_msg: 'Sigurado ka bala nga gusto mo maggwa?',
    signout_unsynced_msg: 'May ara ka sang mga rekord nga wala pa na-sync. Ang paggwa nga wala nag-sync mahimo makadula sang imo datos.',
    signout_btn_anyway: 'Maggwa Gihapon',

    // Profile & Settings
    profile_title: 'Profile sang Miyembro kag Setting',
    profile_role: 'Katungdanan',
    profile_block_farm: 'Lokasyon sang Block Farm',
    profile_language: 'Hambal / Lenggwahe',
    profile_settings_mgmt: 'Mga Setting kag Pagdumala',
    profile_support: 'Bulig kag Serbisyo',
    profile_security: 'Seguridad kag Password',
    profile_sync_monitor: 'Monitor sang Pag-sync sang Miyembro',
    profile_cache: 'I-reset ang Offline Cache',
    profile_logout: 'Maggwa / Mag-ilis User',
    cache_cleared: 'Natinluan ang Cache',
    cache_cleared_msg: 'Ang offline cache naibalik na sa kinaandan nga kahimtangan.',
    profile_op_assignment: 'Ginatugyan nga Hilikuton',
    profile_admin_jurisdiction: 'Huriskdiksiyon sa Administrasyon',
    profile_supervising_farm: 'Ginadumalahan nga Uma',
    profile_supervised_scope: 'Nasakupan nga Uma',
    profile_regulatory_agency: 'Ahensya sang Gobyerno',
    profile_mobile_contact: 'Numero sang Telepono',
    profile_sync_dashboard: 'Dashboard sang Pag-sync',
    profile_pending: 'Wala pa na-sync',
    profile_synced: 'Naka-sync',
    profile_last_synced: 'Ulihi nga na-sync',
    profile_no_pending_sync: 'Wala sang nabilin nga rekord nga i-sync',
    profile_sync_now: 'I-sync Subong',
    profile_syncing: 'Ginasynchronize pa...',
    profile_auto_sync: 'Kaugalingon nga Pag-sync',
    profile_demo_offline: 'Demo: Kaimtangan nga Offline',
    profile_sra_status: 'Kaimtangan sang Sistema sang SRA',
    profile_district_cert: 'Sertipikasyon sang Distrito:',
    profile_sra_certified: 'Sertipikado sa Distrito VII',
    profile_sra_circular: 'Bersyon sang SRA Circular:',
    profile_central_node: 'Sentral nga Node sa Cloud:',
    profile_operational_uptime: 'Naga-andar (100% Uptime)',
    profile_footer: 'v1.0.0 · HUGPONG Agricultural Platform\nAng impormasyon protektado kag hilway nga na-save.',

    // Security & Password Screen
    sec_title: 'Seguridad kag Password',
    sec_data_protect_title: 'Proteksyon sang Datos',
    sec_data_protect_text: 'Naka-encrypt ang imo impormasyon. Indi gid pag-ipahibalo ang imo password sa bisan sin-o, lakip na sa tinawo sang HUGPONG.',
    sec_change_pw: 'Ilisan ang Password',
    sec_curr_pw: 'Subong nga Password',
    sec_new_pw: 'Bag-o nga Password',
    sec_confirm_pw: 'Kumpirmahon ang Bag-o nga Password',
    sec_update_pw: 'I-update ang Password',
    sec_pw_changed: 'Nailisan na ang Password',
    sec_pw_changed_msg: 'Madinalag-on nga na-update ang imo password.',
    sec_err_curr_pw: 'Ibutang ang imo subong nga password',
    sec_err_short: 'Ang bag-o nga password dapat may 8 ukon kapin pa ka karakter',
    sec_err_mismatch: 'Wala nagatugma ang bag-o nga mga password',
    sec_auth_title: 'Pagpamatuod (Authentication)',
    sec_bio_login: 'Biometric Login',
    sec_bio_login_sub: 'Gamiton ang fingerprint ukon face ID',
    sec_pin_lock: 'PIN Lock',
    sec_pin_lock_sub: 'Pangayuon ang PIN sa pagbukas sang app',
    sec_2fa: 'Two-Factor Auth (2FA)',
    sec_2fa_sub: 'Magpadala sang OTP sa imo cellphone',
    sec_session_title: 'Sesyon kag mga Alerto',
    sec_login_alerts: 'Mga Alerto sa Pag-login',
    sec_login_alerts_sub: 'Pahibaluon kon may bag-o nga nag-login',
    sec_signout_all: 'I-sign Out sa Tanan nga Device',
    sec_signout_all_sub: 'Untaton ang tanan nga aktibo nga sesyon',
    sec_signout_all_title: 'I-sign Out sa Tanan nga Device',
    sec_signout_all_msg: 'Untaton sini ang tanan nga aktibo nga sesyon sa tanan nga device kag kinahanglan liwat mag-login.',
    sec_btn_signout_all: 'I-sign Out Tanan',
    sec_strength_8chars: '8+ karakter',
    sec_strength_uppercase: 'Daku nga letra',
    sec_strength_number: 'Numero',
    sec_strength_symbol: 'Simbolo',
    sync_info_alert_title: 'Impormasyon sa Offline Sync',
    sync_info_alert_msg: 'Kon ang miyembro mag-rekord sang hilikuton nga offline sa uma, luwas ini nga masalbar sa memory sang device. Kaugalingon ini nga ma-upload kon may internet na ukon mag-sync sa opisina.',
  }
};

/**
 * Initialize language from local storage on startup.
 */
export async function initializeLanguage() {
  try {
    const saved = await getItem(STORAGE_KEY);
    if (saved && TRANSLATIONS[saved]) {
      currentLanguage = saved;
      notifyLanguageChange();
    }
  } catch (e) {
    console.warn('[i18n] Failed to load language:', e);
  }
  return currentLanguage;
}

/**
 * Get current active language key ('en' | 'tl' | 'hil').
 */
export function getLanguage() {
  return currentLanguage;
}

/**
 * Set and persist active language immediately.
 */
export function setLanguage(langKey) {
  if (TRANSLATIONS[langKey]) {
    currentLanguage = langKey;
    notifyLanguageChange();
    setItem(STORAGE_KEY, langKey).catch(e => console.warn('[i18n] Failed to save language:', e));
  }
}

/**
 * Translate a key into current language with English fallback.
 */
export function t(key, fallback = '') {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  if (dict[key] !== undefined) return dict[key];
  if (TRANSLATIONS.en[key] !== undefined) return TRANSLATIONS.en[key];
  return fallback || key;
}

/**
 * Subscribe to language changes.
 */
export function subscribeLanguage(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyLanguageChange() {
  listeners.forEach(fn => {
    try {
      fn(currentLanguage);
    } catch (e) {
      console.warn('[i18n] Listener error:', e);
    }
  });
}

export const formatRelativeTime = (timeStr, currentLang = 'en') => {
  if (!timeStr) return '';
  const s = String(timeStr).trim();
  
  if (/just now/i.test(s)) {
    if (currentLang === 'tl') return 'Kani-kanina lang';
    if (currentLang === 'hil') return 'Karon lang gid';
    return 'Just now';
  }
  
  if (/yesterday/i.test(s)) {
    if (currentLang === 'tl') return 'Kahapon';
    if (currentLang === 'hil') return 'Kahapon';
    return 'Yesterday';
  }

  if (/today/i.test(s)) {
    if (currentLang === 'tl') return s.replace(/today/i, 'Ngayong araw');
    if (currentLang === 'hil') return s.replace(/today/i, 'Subong nga adlaw');
    return s;
  }

  const minMatch = s.match(/(\d+)\s*(?:mins?|min|m)\s*ago/i);
  if (minMatch) {
    const n = minMatch[1];
    if (currentLang === 'tl') return `${n} min ang nakalipas`;
    if (currentLang === 'hil') return `${n} min ang nagligad`;
    return `${n} mins ago`;
  }

  const hrMatch = s.match(/(\d+)\s*(?:hrs?|hour|hours|hr|h)\s*ago/i);
  if (hrMatch) {
    const n = hrMatch[1];
    if (currentLang === 'tl') return `${n} oras ang nakalipas`;
    if (currentLang === 'hil') return `${n} ka oras ang nagligad`;
    return `${n} hrs ago`;
  }

  const dayMatch = s.match(/(\d+)\+?\s*(?:days?|day|d)\s*ago/i);
  if (dayMatch) {
    const n = dayMatch[1];
    if (currentLang === 'tl') return `${n} araw ang nakalipas`;
    if (currentLang === 'hil') return `${n} ka adlaw ang nagligad`;
    return `${n} days ago`;
  }

  return s;
};

export const formatSyncTime = (timeStr, lang) => formatRelativeTime(timeStr, lang || currentLanguage);

export const formatPhaseMonth = (monthStr, currentLang = 'en') => {
  if (!monthStr) return '';
  const s = String(monthStr).trim();
  const m = s.match(/month\s*(\d+(?:[–-]\d+)?)/i);
  if (m) {
    const range = m[1];
    if (currentLang === 'tl') return `Buwan ${range}`;
    if (currentLang === 'hil') return `Bulan ${range}`;
    return `Month ${range}`;
  }
  return s;
};

// React Context for lightning-fast synchronous re-renders across all screens
export const LanguageContext = React.createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback) => t(key, fallback),
  formatSyncTime: (timeStr) => formatRelativeTime(timeStr, 'en'),
  formatPhaseMonth: (monthStr) => formatPhaseMonth(monthStr, 'en'),
  languages: LANGUAGES,
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(currentLanguage);

  useEffect(() => {
    const unsub = subscribeLanguage((newLang) => {
      setLang(newLang);
    });
    return unsub;
  }, []);

  const value = useMemo(() => ({
    language: lang,
    setLanguage,
    t: (key, fallback) => t(key, fallback),
    formatSyncTime: (timeStr) => formatRelativeTime(timeStr, lang),
    formatPhaseMonth: (monthStr) => formatPhaseMonth(monthStr, lang),
    languages: LANGUAGES,
  }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!context) {
      const unsub = subscribeLanguage(() => {
        setTick(t => t + 1);
      });
      return unsub;
    }
  }, [context]);

  if (context && context.language) return context;

  return {
    t: (key, fallback) => t(key, fallback),
    formatSyncTime: (timeStr) => formatRelativeTime(timeStr, currentLanguage),
    formatPhaseMonth: (monthStr) => formatPhaseMonth(monthStr, currentLanguage),
    language: currentLanguage,
    setLanguage,
    languages: LANGUAGES,
  };
}

// Auto-initialize immediately
initializeLanguage();
