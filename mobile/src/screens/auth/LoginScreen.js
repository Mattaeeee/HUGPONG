import React, { useState } from 'react';
const LOGO = require('../../../assets/HUGPONG LOGO.png');
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';
import { setSession } from '../../data/mockData';

export default function LoginScreen({ navigation }) {
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    const cleaned = contactNumber.replace(/\s/g, '');
    if (!cleaned.startsWith('09') || cleaned.length !== 11) {
      e.contactNumber = 'Enter a valid PH mobile number (09XXXXXXXXX)';
    }
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);
    // Find matching session role
    const cleaned = contactNumber.replace(/\s/g, '');
    if (cleaned === '09171234567') {
      setSession('Member');
    } else if (cleaned === '09189876543') {
      setSession('Farm Manager');
    } else if (cleaned === '09194448888') {
      setSession('SRA Checker');
    } else {
      // default
      setSession('Member');
    }
    
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainTabs');
    }, 1200);
  };

  const handleDemoLogin = (role) => {
    setLoading(true);
    setSession(role);
    if (role === 'Member') {
      setContactNumber('09171234567');
    } else if (role === 'Farm Manager') {
      setContactNumber('09189876543');
    } else {
      setContactNumber('09194448888');
    }
    setPassword('password');
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainTabs');
    }, 1000);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={s.header}>
            <Image source={LOGO} style={s.logoImg} resizeMode="contain" />
            <Text style={s.title}>Welcome back</Text>
            <Text style={s.sub}>Sign in to your HUGPONG account</Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            {/* Contact Number */}
            <View style={s.fieldGroup}>
              <Text style={s.label}>Contact Number</Text>
              <View style={[s.inputWrap, errors.contactNumber && s.inputError]}>
                <Ionicons name="call-outline" size={18} color={COLORS.textMuted} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  value={contactNumber}
                  onChangeText={v => { setContactNumber(v); setErrors(p => ({ ...p, contactNumber: null })); }}
                  placeholder="09XX XXX XXXX"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="phone-pad"
                  maxLength={13}
                />
              </View>
              {errors.contactNumber && <Text style={s.errorText}>{errors.contactNumber}</Text>}
            </View>

            {/* Password */}
            <View style={s.fieldGroup}>
              <Text style={s.label}>Password</Text>
              <View style={[s.inputWrap, errors.password && s.inputError]}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={s.inputIcon} />
                <TextInput
                  style={[s.input, { flex: 1 }]}
                  value={password}
                  onChangeText={v => { setPassword(v); setErrors(p => ({ ...p, password: null })); }}
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPw}
                />
                <TouchableOpacity onPress={() => setShowPw(p => !p)} style={{ paddingRight: 4 }}>
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={s.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity style={s.forgotWrap} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={s.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleLogin} disabled={loading}>
              {loading
                ? <Text style={s.btnText}>Signing in...</Text>
                : <><Text style={s.btnText}>Sign In</Text><Ionicons name="arrow-forward" size={18} color="#fff" /></>
              }
            </TouchableOpacity>
          </View>

          {/* Quick Demo Login */}
          <View style={s.demoCard}>
            <Text style={s.demoCardTitle}>Quick Demo Access</Text>
            <Text style={s.demoCardSub}>Tap a role preset below to automatically log in and experience HUGPONG as different members of the farm ecosystem.</Text>

            <View style={s.demoRow}>
              {[
                { role: 'Member', name: 'Juan dela Cruz (Member)', color: '#4A7C2F', sub: 'Log operations & offline tasks' },
                { role: 'Farm Manager', name: 'Jose Reyes (Farm Manager)', color: '#1A6B9A', sub: 'Approve logs & generate QR' },
                { role: 'SRA Checker', name: 'Maria Santos (SRA Checker)', color: '#8F3A8F', sub: 'Scan QR & compile sugar reports' },
              ].map(d => (
                <TouchableOpacity
                  key={d.role}
                  style={[s.demoBtn, { borderColor: d.color + '25' }]}
                  onPress={() => handleDemoLogin(d.role)}
                  activeOpacity={0.7}
                >
                  <View style={[s.demoDot, { backgroundColor: d.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[s.demoBtnText, { color: d.color }]}>{d.name}</Text>
                    <Text style={s.demoBtnSub} numberOfLines={1}>{d.sub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={d.color} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Register */}
          <View style={s.registerRow}>
            <Text style={s.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={s.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.lg, gap: SPACING.md, paddingBottom: 32 },
  header: { alignItems: 'center', gap: 10, paddingTop: 10 },
  logoImg: { width: 80, height: 80 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  sub: { fontSize: 14, color: COLORS.textMuted },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: SPACING.xl, gap: SPACING.lg, ...SHADOW.card },
  fieldGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  inputError: { borderColor: '#D9534F' },
  inputIcon: { flexShrink: 0 },
  input: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
  errorText: { fontSize: 11, color: '#D9534F', marginTop: 2 },
  forgotWrap: { alignSelf: 'flex-end' },
  forgotText: { fontSize: 13, color: COLORS.primaryLight, fontWeight: '600' },
  btn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 4 },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  registerText: { fontSize: 14, color: COLORS.textMuted },
  registerLink: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  
  // Demo styling
  demoCard: { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: SPACING.xl, gap: SPACING.md, ...SHADOW.card },
  demoCardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  demoCardSub: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
  demoRow: { gap: 8, marginTop: 4 },
  demoBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderRadius: RADIUS.md, padding: SPACING.md, backgroundColor: COLORS.background },
  demoDot: { width: 8, height: 8, borderRadius: 4 },
  demoBtnText: { fontSize: 13, fontWeight: '700' },
  demoBtnSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
