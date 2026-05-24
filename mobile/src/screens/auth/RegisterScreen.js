import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme';

const ROLES = ['Member', 'Farm Manager', 'SRA (Admin)'];

const ROLE_DESCRIPTIONS = {
  'Member': 'Logs weekly/monthly field operations',
  'Farm Manager': 'Reviews logs & compiles SRA reports',
  'SRA (Admin)': 'Scans QR & audits monthly reports',
};

const BLOCK_FARMS = [
  'Silay Block Farm A',
  'Silay Block Farm B',
  'Silay Block Farm C'
];

function ProgressBar({ step, totalSteps }) {
  const pct = ((step) / totalSteps) * 100;
  return (
    <View style={pb.wrap}>
      <View style={pb.track}>
        <View style={[pb.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={pb.label}>Step {step} of {totalSteps}</Text>
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
    firstName: '',
    middleInitial: '',
    lastName: '',
    nickname: '',
    role: '',
    blockFarm: '',
    contactNumber: '',
    password: '', 
    confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const set = (key, val) => { setForm(p => ({ ...p, [key]: val })); setErrors(p => ({ ...p, [key]: null })); };

  const requiresBlockFarm = ['Member', 'Farm Manager'].includes(form.role);
  
  const getStepTitles = () => {
    const titles = [
      { title: 'Personal Info', sub: 'Tell us about yourself' },
      { title: 'Your Role', sub: 'Select your role in the block farm' },
    ];
    if (requiresBlockFarm) {
      titles.push({ title: 'Block Farm', sub: 'Assign your registry location' });
    }
    titles.push({ title: 'Contact Number', sub: 'Used as your login credential' });
    titles.push({ title: 'Set Password', sub: 'Secure your HUGPONG account' });
    return titles;
  };

  const stepTitles = getStepTitles();
  const totalSteps = stepTitles.length;
  const activeStepTitle = stepTitles[step - 1].title;

  const validateStep = () => {
    const e = {};
    if (activeStepTitle === 'Personal Info') {
      if (!form.firstName.trim()) e.firstName = 'First name is required';
      if (!form.lastName.trim()) e.lastName = 'Last name is required';
    }
    if (activeStepTitle === 'Your Role') {
      if (!form.role) e.role = 'Please select a role';
    }
    if (activeStepTitle === 'Block Farm') {
      if (!form.blockFarm) e.blockFarm = 'Please select a block farm';
    }
    if (activeStepTitle === 'Contact Number') {
      const cleaned = form.contactNumber.replace(/\s/g, '');
      if (!cleaned.startsWith('09') || cleaned.length !== 11) {
        e.contactNumber = 'Enter a valid PH mobile number (09XXXXXXXXX)';
      } else if (!codeVerified) {
        e.contactNumber = 'Please verify your mobile number to continue';
      }
    }
    if (activeStepTitle === 'Set Password') {
      if (form.password.length < 8) e.password = 'Minimum 8 characters';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < totalSteps) { setStep(s => s + 1); return; }
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
          <ProgressBar step={step} totalSteps={totalSteps} />

          <View style={s.stepHeader}>
            <Text style={s.stepTitle}>{stepTitles[step - 1].title}</Text>
            <Text style={s.stepSub}>{stepTitles[step - 1].sub}</Text>
          </View>

          <View style={s.card}>
            {/* STEP: PERSONAL INFO */}
            {activeStepTitle === 'Personal Info' && <>
              <Field label="First Name *" error={errors.firstName}>
                <InputBox value={form.firstName} onChangeText={v => set('firstName', v)} placeholder="e.g. Juan" error={errors.firstName} autoCapitalize="words" />
              </Field>
              <Field label="Middle Initial (Optional)">
                <InputBox value={form.middleInitial} onChangeText={v => set('middleInitial', v)} placeholder="e.g. D" autoCapitalize="characters" maxLength={3} />
              </Field>
              <Field label="Last Name *" error={errors.lastName}>
                <InputBox value={form.lastName} onChangeText={v => set('lastName', v)} placeholder="e.g. Dela Cruz" error={errors.lastName} autoCapitalize="words" />
              </Field>
              <Field label="Nickname (Optional)">
                <InputBox value={form.nickname} onChangeText={v => set('nickname', v)} placeholder="e.g. Junjun" autoCapitalize="words" />
              </Field>
            </>}

            {/* STEP: YOUR ROLE */}
            {activeStepTitle === 'Your Role' && <>
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

            {/* STEP: BLOCK FARM */}
            {activeStepTitle === 'Block Farm' && <>
              <Field label="Select Block Farm *" error={errors.blockFarm}>
                <View style={{ gap: 8 }}>
                  {BLOCK_FARMS.map(farm => (
                    <TouchableOpacity 
                      key={farm}
                      style={[rc.chip, form.blockFarm === farm && rc.selected, { paddingVertical: 14 }]}
                      onPress={() => set('blockFarm', farm)}
                    >
                      <View style={rc.chipHeader}>
                        {form.blockFarm === farm ? (
                          <Ionicons name="radio-button-on" size={18} color={COLORS.primary} />
                        ) : (
                          <Ionicons name="radio-button-off" size={18} color={COLORS.border} />
                        )}
                        <Text style={[rc.text, form.blockFarm === farm && rc.textSelected]}>{farm}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </Field>
            </>}

            {/* STEP: CONTACT NUMBER */}
            {activeStepTitle === 'Contact Number' && <>
              <Field label="Contact Number *" error={errors.contactNumber}>
                <InputBox 
                  icon="call-outline" 
                  value={form.contactNumber} 
                  onChangeText={v => { set('contactNumber', v); setCodeSent(false); setCodeVerified(false); }} 
                  placeholder="09XX XXX XXXX" 
                  keyboardType="phone-pad" 
                  maxLength={13} 
                  error={errors.contactNumber && !codeSent ? errors.contactNumber : null} 
                  editable={!codeVerified}
                />
              </Field>
              
              {!codeVerified && (
                <TouchableOpacity 
                  style={[s.verifyBtn, codeSent && s.verifyBtnSent]} 
                  onPress={() => {
                    const cleaned = form.contactNumber.replace(/\s/g, '');
                    if (cleaned.startsWith('09') && cleaned.length === 11) {
                      setCodeSent(true);
                      setErrors({ ...errors, contactNumber: null });
                    } else {
                      setErrors({ ...errors, contactNumber: 'Enter full valid number first' });
                    }
                  }}
                >
                  <Text style={s.verifyBtnText}>{codeSent ? 'Resend Code' : 'Send Verification Code'}</Text>
                </TouchableOpacity>
              )}

              {codeSent && !codeVerified && (
                <Field label="Enter 6-digit Code *" error={errors.verificationCode}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TextInput 
                      style={[inp.input, { flex: 1, letterSpacing: 4, textAlign: 'center', fontWeight: '700' }]} 
                      value={verificationCode} 
                      onChangeText={setVerificationCode} 
                      placeholder="XXXXXX" 
                      keyboardType="number-pad" 
                      maxLength={6} 
                    />
                    <TouchableOpacity 
                      style={{ backgroundColor: COLORS.primary, justifyContent: 'center', paddingHorizontal: 20, borderRadius: 10 }}
                      onPress={() => {
                        if (verificationCode.length === 6) {
                          setCodeVerified(true);
                          setErrors({ ...errors, verificationCode: null, contactNumber: null });
                        } else {
                          setErrors({ ...errors, verificationCode: 'Code must be 6 digits' });
                        }
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Verify</Text>
                    </TouchableOpacity>
                  </View>
                </Field>
              )}
              
              {codeVerified && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.success + '20', padding: 12, borderRadius: 8, marginTop: 10 }}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  <Text style={{ color: COLORS.success, fontWeight: '700', fontSize: 13 }}>Number verified successfully!</Text>
                </View>
              )}
            </>}

            {/* STEP: SET PASSWORD */}
            {activeStepTitle === 'Set Password' && <>
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
            <Text style={s.btnText}>{loading ? 'Creating account...' : step === totalSteps ? 'Create Account' : 'Continue'}</Text>
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
  verifyBtn: { backgroundColor: COLORS.border, padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 5, marginBottom: 15 },
  verifyBtnSent: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border },
  verifyBtnText: { color: COLORS.text, fontWeight: '600', fontSize: 13 },
});
