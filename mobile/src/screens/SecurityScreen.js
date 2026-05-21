import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';

export default function SecurityScreen({ navigation }) {
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionAlert, setSessionAlert] = useState(true);

  const submitPasswordChange = () => {
    if (!currentPw) { Alert.alert('Required', 'Enter your current password'); return; }
    if (newPw.length < 8) { Alert.alert('Too Short', 'New password must be at least 8 characters'); return; }
    if (newPw !== confirmPw) { Alert.alert('Mismatch', 'New passwords do not match'); return; }
    Alert.alert('Password Changed', 'Your password has been updated successfully.', [
      { text: 'OK', onPress: () => { setShowChangePw(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); } }
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Security & Password</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Data Protection Notice */}
        <View style={s.warningCard}>
          <Ionicons name="shield" size={22} color={COLORS.primary} />
          <View style={s.warningBody}>
            <Text style={s.warningTitle}>Data Protection</Text>
            <Text style={s.warningText}>Your account data is encrypted. Never share your password with anyone, including HUGPONG staff.</Text>
          </View>
        </View>

        {/* Change Password */}
        <View style={s.card}>
          <TouchableOpacity style={s.sectionRow} onPress={() => setShowChangePw(e => !e)}>
            <View style={[s.secIcon, { backgroundColor: COLORS.primaryBg }]}>
              <Ionicons name="lock-closed" size={17} color={COLORS.primary} />
            </View>
            <Text style={s.sectionLabel}>Change Password</Text>
            <Ionicons name={showChangePw ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          {showChangePw && (
            <View style={s.pwForm}>
              {[
                { label: 'Current Password', val: currentPw, set: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(p => !p) },
                { label: 'New Password', val: newPw, set: setNewPw, show: showNew, toggle: () => setShowNew(p => !p) },
                { label: 'Confirm New Password', val: confirmPw, set: setConfirmPw, show: showNew, toggle: () => setShowNew(p => !p) },
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
                  {['8+ chars', 'Uppercase', 'Number', 'Symbol'].map(check => {
                    const passed =
                      check === '8+ chars' ? newPw.length >= 8 :
                      check === 'Uppercase' ? /[A-Z]/.test(newPw) :
                      check === 'Number' ? /\d/.test(newPw) :
                      /[^a-zA-Z0-9]/.test(newPw);
                    return (
                      <View key={check} style={s.strengthItem}>
                        <Ionicons name={passed ? 'checkmark-circle' : 'ellipse-outline'} size={13} color={passed ? COLORS.success : COLORS.textMuted} />
                        <Text style={[s.strengthText, { color: passed ? COLORS.success : COLORS.textMuted }]}>{check}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
              <TouchableOpacity style={s.saveBtn} onPress={submitPasswordChange}>
                <Text style={s.saveBtnText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Security Toggles */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Authentication</Text>
          {[
            { icon: 'finger-print', label: 'Biometric Login', sub: 'Use fingerprint or face ID', color: '#4A7C2F', val: biometrics, set: setBiometrics },
            { icon: 'keypad', label: 'PIN Lock', sub: 'Require PIN on app open', color: COLORS.blue, val: pinEnabled, set: setPinEnabled },
            { icon: 'phone-portrait', label: 'Two-Factor Auth', sub: 'Send OTP to your mobile', color: COLORS.accent, val: twoFactor, set: setTwoFactor },
          ].map(item => (
            <View key={item.label} style={s.toggleRow}>
              <View style={[s.secIcon, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon} size={17} color={item.color} />
              </View>
              <View style={s.toggleBody}>
                <Text style={s.toggleLabel}>{item.label}</Text>
                <Text style={s.toggleSub}>{item.sub}</Text>
              </View>
              <Switch
                value={item.val}
                onValueChange={item.set}
                trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                thumbColor={item.val ? COLORS.primary : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        {/* Alerts & Sessions */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Session & Alerts</Text>
          <View style={s.toggleRow}>
            <View style={[s.secIcon, { backgroundColor: COLORS.successLight }]}>
              <Ionicons name="notifications" size={17} color={COLORS.success} />
            </View>
            <View style={s.toggleBody}>
              <Text style={s.toggleLabel}>Login Alerts</Text>
              <Text style={s.toggleSub}>Notify when a new session starts</Text>
            </View>
            <Switch
              value={sessionAlert}
              onValueChange={setSessionAlert}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={sessionAlert ? COLORS.primary : '#f4f3f4'}
            />
          </View>
          <TouchableOpacity style={s.dangerRow} onPress={() => Alert.alert('Sign Out All Devices', 'This will end all active sessions on all devices.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign Out All', style: 'destructive' }])}>
            <View style={[s.secIcon, { backgroundColor: '#FFF0F0' }]}>
              <Ionicons name="log-out" size={17} color="#D9534F" />
            </View>
            <View style={s.toggleBody}>
              <Text style={[s.toggleLabel, { color: '#D9534F' }]}>Sign Out All Devices</Text>
              <Text style={s.toggleSub}>Revoke all active sessions</Text>
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
