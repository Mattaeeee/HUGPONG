import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme';

const ROLES = ['Member', 'Farm Manager', 'SRA Checker'];
const TOTAL_STEPS = 4;

const ROLE_DESCRIPTIONS = {
  'Member': 'Logs weekly/monthly field operations',
  'Farm Manager': 'Reviews logs & compiles SRA reports',
  'SRA Checker': 'Scans QR & audits monthly reports',
};

const STEP_TITLES = [
  { title: 'Personal Info', sub: 'Tell us about yourself' },
  { title: 'Your Role', sub: 'Select your role in the block farm' },
  { title: 'Contact Number', sub: 'Used as your login credential' },
  { title: 'Set Password', sub: 'Secure your HUGPONG account' },
];

function ProgressBar({ step }) {
  const pct = ((step) / TOTAL_STEPS) * 100;
  return (
    <View style={pb.wrap}>
      <View style={pb.track}>
        <View style={[pb.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={pb.label}>Step {step} of {TOTAL_STEPS}</Text>
    </View>
  );
}
const pb = StyleSheet.create({
  wrap: { gap: 6 },
  track: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  label: { fontSize: 11, color: COLORS.textMuted, textAlign: 'right' },
});

function Field({ label, children, error }) {
  return (
    <View style={f.group}>
      <Text style={f.label}>{label}</Text>
      {children}
      {error ? <Text style={f.error}>{error}</Text> : null}
    </View>
  );
}
const f = StyleSheet.create({
  group: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  error: { fontSize: 11, color: '#D9534F' },
});

function InputBox({ icon, error, ...props }) {
  return (
    <View style={[inp.wrap, error && inp.err]}>
      {icon && <Ionicons name={icon} size={17} color={COLORS.textMuted} />}
      <TextInput style={inp.input} placeholderTextColor={COLORS.textMuted} {...props} />
    </View>
  );
}
const inp = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 13 },
  err: { borderColor: '#D9534F' },
  input: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
});

function RoleChip({ label, description, selected, onPress }) {
  return (
    <TouchableOpacity style={[rc.chip, selected && rc.selected]} onPress={onPress}>
      <View style={rc.chipInner}>
        <View style={rc.chipHeader}>
          {selected && <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />}
          <Text style={[rc.text, selected && rc.textSelected]}>{label}</Text>
        </View>
        <Text style={[rc.desc, selected && rc.descSelected]}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}
const rc = StyleSheet.create({
  chip: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, backgroundColor: '#fff' },
  selected: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryBg },
  chipInner: { gap: 4 },
  chipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  textSelected: { color: COLORS.primary, fontWeight: '700' },
  desc: { fontSize: 12, color: COLORS.textMuted, fontWeight: '400' },
  descSelected: { color: COLORS.primary, opacity: 0.8 },
});

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '',
    role: '',
    contactNumber: '',
    password: '', confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => { setForm(p => ({ ...p, [key]: val })); setErrors(p => ({ ...p, [key]: null })); };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required';
    }
    if (step === 2) {
      if (!form.role) e.role = 'Please select a role';
    }
    if (step === 3) {
      const cleaned = form.contactNumber.replace(/\s/g, '');
      if (!cleaned.startsWith('09') || cleaned.length !== 11) {
        e.contactNumber = 'Enter a valid PH mobile number (09XXXXXXXXX)';
      }
    }
    if (step === 4) {
      if (form.password.length < 8) e.password = 'Minimum 8 characters';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) { setStep(s => s + 1); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.replace('MainTabs'); }, 1400);
  };

  const back = () => step > 1 ? setStep(s => s - 1) : navigation.replace('Login');

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Top Nav */}
        <View style={s.topNav}>
          <TouchableOpacity style={s.backBtn} onPress={back}>
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={s.navTitle}>Create Account</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <ProgressBar step={step} />

          <View style={s.stepHeader}>
            <Text style={s.stepTitle}>{STEP_TITLES[step - 1].title}</Text>
            <Text style={s.stepSub}>{STEP_TITLES[step - 1].sub}</Text>
          </View>

          <View style={s.card}>
            {/* STEP 1 */}
            {step === 1 && <>
              <Field label="Full Name *" error={errors.fullName}>
                <InputBox icon="person-outline" value={form.fullName} onChangeText={v => set('fullName', v)} placeholder="e.g. Juan dela Cruz" error={errors.fullName} autoCapitalize="words" />
              </Field>
            </>}

            {/* STEP 2 */}
            {step === 2 && <>
              <Field label="System Role *" error={errors.role}>
                <View style={{ gap: 8 }}>
                  {ROLES.map(r => (
                    <RoleChip
                      key={r}
                      label={r}
                      description={ROLE_DESCRIPTIONS[r]}
                      selected={form.role === r}
                      onPress={() => set('role', r)}
                    />
                  ))}
                </View>
              </Field>
            </>}

            {/* STEP 3 */}
            {step === 3 && <>
              <Field label="Contact Number *" error={errors.contactNumber}>
                <InputBox icon="call-outline" value={form.contactNumber} onChangeText={v => set('contactNumber', v)} placeholder="09XX XXX XXXX" keyboardType="phone-pad" maxLength={13} error={errors.contactNumber} />
              </Field>
            </>}

            {/* STEP 4 */}
            {step === 4 && <>
              <Field label="Password *" error={errors.password}>
                <View style={[inp.wrap, errors.password && inp.err]}>
                  <Ionicons name="lock-closed-outline" size={17} color={COLORS.textMuted} />
                  <TextInput style={[inp.input, { flex: 1 }]} value={form.password} onChangeText={v => set('password', v)} placeholder="Minimum 8 characters" placeholderTextColor={COLORS.textMuted} secureTextEntry={!showPw} />
                  <TouchableOpacity onPress={() => setShowPw(p => !p)}>
                    <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={17} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              </Field>
              <Field label="Confirm Password *" error={errors.confirmPassword}>
                <View style={[inp.wrap, errors.confirmPassword && inp.err]}>
                  <Ionicons name="lock-closed-outline" size={17} color={COLORS.textMuted} />
                  <TextInput style={[inp.input, { flex: 1 }]} value={form.confirmPassword} onChangeText={v => set('confirmPassword', v)} placeholder="Repeat password" placeholderTextColor={COLORS.textMuted} secureTextEntry={!showCPw} />
                  <TouchableOpacity onPress={() => setShowCPw(p => !p)}>
                    <Ionicons name={showCPw ? 'eye-off-outline' : 'eye-outline'} size={17} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              </Field>
            </>}
          </View>

          <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={next} disabled={loading}>
            <Text style={s.btnText}>{loading ? 'Creating account...' : step === TOTAL_STEPS ? 'Create Account' : 'Continue'}</Text>
            {!loading && <Ionicons name="arrow-forward" size={18} color="#fff" />}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 8 },
  navTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  scroll: { padding: SPACING.xl, gap: SPACING.lg },
  stepHeader: { gap: 4 },
  stepTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  stepSub: { fontSize: 14, color: COLORS.textMuted },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: SPACING.xl, gap: SPACING.lg, ...SHADOW.card },
  btn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
