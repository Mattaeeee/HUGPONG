import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { getSecurityPreferences, updateSecurityPreferences, subscribe } from '../data/dataStore';
import { useTranslation } from '../services/i18n';

export default function SecurityScreen({ navigation }) {
  const { t } = useTranslation();
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [prefs, setPrefs] = useState(getSecurityPreferences());

  React.useEffect(() => {
    const unsubscribe = subscribe(() => {
      setPrefs(getSecurityPreferences());
    });
    return unsubscribe;
  }, []);

  const handleToggle = (key, val) => {
    updateSecurityPreferences({ [key]: val });
  };

  const submitPasswordChange = () => {
    if (!currentPw) { Alert.alert(t('error_title', 'Required'), t('sec_err_curr_pw', 'Enter your current password')); return; }
    if (newPw.length < 8) { Alert.alert(t('error_title', 'Too Short'), t('sec_err_short', 'New password must be at least 8 characters')); return; }
    if (newPw !== confirmPw) { Alert.alert(t('error_title', 'Mismatch'), t('sec_err_mismatch', 'New passwords do not match')); return; }
    updateSecurityPreferences({ lastPasswordChange: new Date().toISOString().split('T')[0] });
    Alert.alert(t('sec_pw_changed', 'Password Changed'), t('sec_pw_changed_msg', 'Your password has been updated successfully.'), [
      { text: 'OK', onPress: () => { setShowChangePw(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); } }
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t('sec_title', 'Security & Password')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Data Protection Notice */}
        <View style={s.warningCard}>
          <Ionicons name="shield" size={22} color={COLORS.primary} />
          <View style={s.warningBody}>
            <Text style={s.warningTitle}>{t('sec_data_protect_title', 'Data Protection')}</Text>
            <Text style={s.warningText}>{t('sec_data_protect_text', 'Your account data is encrypted. Never share your password with anyone, including HUGPONG staff.')}</Text>
          </View>
        </View>

        {/* Change Password */}
        <View style={s.card}>
          <TouchableOpacity style={s.sectionRow} onPress={() => setShowChangePw(e => !e)}>
            <View style={[s.secIcon, { backgroundColor: COLORS.primaryBg }]}>
              <Ionicons name="lock-closed" size={17} color={COLORS.primary} />
            </View>
            <Text style={s.sectionLabel}>{t('sec_change_pw', 'Change Password')}</Text>
            <Ionicons name={showChangePw ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          {showChangePw && (
            <View style={s.pwForm}>
              {[
                { label: t('sec_curr_pw', 'Current Password'), val: currentPw, set: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(p => !p) },
                { label: t('sec_new_pw', 'New Password'), val: newPw, set: setNewPw, show: showNew, toggle: () => setShowNew(p => !p) },
                { label: t('sec_confirm_pw', 'Confirm New Password'), val: confirmPw, set: setConfirmPw, show: showNew, toggle: () => setShowNew(p => !p) },
              ].map(f => (
                <View key={f.label} style={s.pwField}>
                  <Text style={s.pwLabel}>{f.label}</Text>
                  <View style={s.pwInput}>
                    <TextInput
                      style={s.pwTextInput}
                      value={f.val}
                      onChangeText={f.set}
                      secureTextEntry={!f.show}
                      placeholder="••••••••"
                      placeholderTextColor={COLORS.textMuted}
                    />
                    <TouchableOpacity onPress={f.toggle}>
                      <Ionicons name={f.show ? 'eye-off-outline' : 'eye-outline'} size={17} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {newPw.length > 0 && (
                <View style={s.pwStrength}>
                  {[
                    { key: '8+ chars', label: t('sec_strength_8chars', '8+ chars') },
                    { key: 'Uppercase', label: t('sec_strength_uppercase', 'Uppercase') },
                    { key: 'Number', label: t('sec_strength_number', 'Number') },
                    { key: 'Symbol', label: t('sec_strength_symbol', 'Symbol') }
                  ].map(check => {
                    const passed =
                      check.key === '8+ chars' ? newPw.length >= 8 :
                      check.key === 'Uppercase' ? /[A-Z]/.test(newPw) :
                      check.key === 'Number' ? /\d/.test(newPw) :
                      /[^a-zA-Z0-9]/.test(newPw);
                    return (
                      <View key={check.key} style={s.strengthItem}>
                        <Ionicons name={passed ? 'checkmark-circle' : 'ellipse-outline'} size={13} color={passed ? COLORS.success : COLORS.textMuted} />
                        <Text style={[s.strengthText, { color: passed ? COLORS.success : COLORS.textMuted }]}>{check.label}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
              <TouchableOpacity style={s.saveBtn} onPress={submitPasswordChange}>
                <Text style={s.saveBtnText}>{t('sec_update_pw', 'Update Password')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Security Toggles */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t('sec_auth_title', 'Authentication')}</Text>
          {[
            { icon: 'finger-print', label: t('sec_bio_login', 'Biometric Login'), sub: t('sec_bio_login_sub', 'Use fingerprint or face ID'), color: '#4A7C2F', key: 'biometrics', val: prefs.biometrics },
            { icon: 'keypad', label: t('sec_pin_lock', 'PIN Lock'), sub: t('sec_pin_lock_sub', 'Require PIN on app open'), color: COLORS.blue, key: 'pinEnabled', val: prefs.pinEnabled },
            { icon: 'phone-portrait', label: t('sec_2fa', 'Two-Factor Auth'), sub: t('sec_2fa_sub', 'Send OTP to your mobile'), color: COLORS.accent, key: 'twoFactor', val: prefs.twoFactor },
          ].map(item => (
            <View key={item.key} style={s.toggleRow}>
              <View style={[s.secIcon, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon} size={17} color={item.color} />
              </View>
              <View style={s.toggleBody}>
                <Text style={s.toggleLabel}>{item.label}</Text>
                <Text style={s.toggleSub}>{item.sub}</Text>
              </View>
              <Switch
                value={item.val}
                onValueChange={(v) => handleToggle(item.key, v)}
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={item.val ? COLORS.primary : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        {/* Alerts & Sessions */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t('sec_session_title', 'Session & Alerts')}</Text>
          <View style={s.toggleRow}>
            <View style={[s.secIcon, { backgroundColor: COLORS.successLight }]}>
              <Ionicons name="notifications" size={17} color={COLORS.success} />
            </View>
            <View style={s.toggleBody}>
              <Text style={s.toggleLabel}>{t('sec_login_alerts', 'Login Alerts')}</Text>
              <Text style={s.toggleSub}>{t('sec_login_alerts_sub', 'Notify when a new session starts')}</Text>
            </View>
            <Switch
              value={prefs.sessionAlert}
              onValueChange={(v) => handleToggle('sessionAlert', v)}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={prefs.sessionAlert ? COLORS.primary : '#f4f3f4'}
            />
          </View>
          <TouchableOpacity 
            style={s.dangerRow} 
            onPress={() => Alert.alert(
              t('sec_signout_all_title', 'Sign Out All Devices'), 
              t('sec_signout_all_msg', 'This will end all active sessions on all devices and require re-authentication.'), 
              [
                { text: t('btn_cancel', 'Cancel'), style: 'cancel' }, 
                { 
                  text: t('sec_btn_signout_all', 'Sign Out All'), 
                  style: 'destructive',
                  onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
                }
              ]
            )}
          >
            <View style={[s.secIcon, { backgroundColor: '#FFF0F0' }]}>
              <Ionicons name="log-out" size={17} color="#D9534F" />
            </View>
            <View style={s.toggleBody}>
              <Text style={[s.toggleLabel, { color: '#D9534F' }]}>{t('sec_signout_all', 'Sign Out All Devices')}</Text>
              <Text style={s.toggleSub}>{t('sec_signout_all_sub', 'Revoke all active sessions')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

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
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 40 },
  warningCard: { flexDirection: 'row', gap: SPACING.md, backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, alignItems: 'flex-start' },
  warningBody: { flex: 1, gap: 4 },
  warningTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  warningText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.lg, ...SHADOW.card },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  secIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  sectionLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text },
  pwForm: { marginTop: SPACING.md, gap: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  pwField: { gap: 6 },
  pwLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  pwInput: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 11 },
  pwTextInput: { flex: 1, fontSize: 15, color: COLORS.text },
  pwStrength: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  strengthItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  strengthText: { fontSize: 11 },
  saveBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 13, alignItems: 'center' },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: 11, borderTopWidth: 1, borderTopColor: COLORS.border },
  toggleBody: { flex: 1, gap: 2 },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  toggleSub: { fontSize: 11, color: COLORS.textMuted },
  dangerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: 11, borderTopWidth: 1, borderTopColor: COLORS.border },
});
