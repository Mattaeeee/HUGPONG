import React, { useState } from 'react';
const LOGO = require('../../../assets/HUGPONG LOGO.png');
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../../theme';

export default function LoginScreen({ navigation }) {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!credential.trim()) e.credential = 'Email or mobile number is required';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);
    // Mock auth — replace with API call
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainTabs');
    }, 1200);
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
            {/* Credential */}
            <View style={s.fieldGroup}>
              <Text style={s.label}>Email or Mobile Number</Text>
              <View style={[s.inputWrap, errors.credential && s.inputError]}>
                <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  value={credential}
                  onChangeText={v => { setCredential(v); setErrors(p => ({ ...p, credential: null })); }}
                  placeholder="Enter email or mobile"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.credential && <Text style={s.errorText}>{errors.credential}</Text>}
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
  scroll: { flexGrow: 1, padding: SPACING.xl, gap: SPACING.xl },
  header: { alignItems: 'center', gap: 10, paddingTop: 20 },
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
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { fontSize: 14, color: COLORS.textMuted },
  registerLink: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});
