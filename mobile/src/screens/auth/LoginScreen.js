import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme';
import { authenticateUser } from '../../data/dataStore';
import { useTranslation } from '../../services/i18n';

const LOGO = require('../../../assets/HUGPONG LOGO.png');

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  // Security: Brute-Force Rate Limiting & Account Lockout
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (lockoutSeconds > 0) {
      timerRef.current = setTimeout(() => {
        setLockoutSeconds(prev => prev - 1);
      }, 1000);
    } else if (lockoutSeconds === 0 && failedAttempts >= 5) {
      setFailedAttempts(0);
      setAuthError('');
    }
    return () => clearTimeout(timerRef.current);
  }, [lockoutSeconds, failedAttempts]);

  const validate = () => {
    const e = {};
    const cleaned = contactNumber.replace(/\D/g, '');
    if (!cleaned.startsWith('09') || cleaned.length !== 11) {
      e.contactNumber = t('auth_enter_valid_phone', 'Enter a valid 11-digit PH mobile number (09XXXXXXXXX)');
    }
    if (password.length < 6) {
      e.password = t('auth_pw_min_length', 'Password must be at least 6 characters');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (lockoutSeconds > 0) {
      Alert.alert(
        'Account Temporarily Locked',
        `Too many failed attempts. Please wait ${lockoutSeconds} seconds before trying again.`
      );
      return;
    }

    setAuthError('');
    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      const cleaned = contactNumber.replace(/\D/g, '');
      const res = authenticateUser(cleaned, password);
      setLoading(false);

      if (!res.success) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);

        if (nextAttempts >= 5) {
          setLockoutSeconds(60);
          setAuthError('Too many failed attempts. Login locked for 60 seconds to protect your account.');
        } else {
          setAuthError(res.error || t('auth_invalid_credentials', 'Invalid mobile number or password.'));
        }
        return;
      }

      // Successful authentication
      setFailedAttempts(0);
      setAuthError('');
      navigation.replace('MainTabs');
    }, 450);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={s.header}>
            <Image source={LOGO} style={s.logoImg} resizeMode="contain" />
            <Text style={s.title}>{t('auth_welcome_title', 'Welcome back')}</Text>
            <Text style={s.sub}>{t('auth_welcome_sub', 'Sign in to your HUGPONG mobile account')}</Text>
          </View>

          {/* Login Card */}
          <View style={s.card}>

            {/* Lockout or Auth Error Banner */}
            {authError ? (
              <View style={[s.errorBanner, lockoutSeconds > 0 && s.lockoutBanner]}>
                <Ionicons 
                  name={lockoutSeconds > 0 ? "shield-outline" : "alert-circle-outline"} 
                  size={18} 
                  color={lockoutSeconds > 0 ? "#B45309" : "#DC2626"} 
                />
                <Text style={[s.errorBannerText, lockoutSeconds > 0 && s.lockoutBannerText]}>
                  {lockoutSeconds > 0 ? `Security Lockout: Wait ${lockoutSeconds}s` : authError}
                </Text>
              </View>
            ) : null}

            {/* Contact Number */}
            <View style={s.fieldGroup}>
              <Text style={s.label}>{t('auth_contact_number', 'Contact Number')}</Text>
              <View style={[s.inputWrap, errors.contactNumber && s.inputError]}>
                <Ionicons name="call-outline" size={18} color={COLORS.textMuted} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  value={contactNumber}
                  onChangeText={v => { 
                    setContactNumber(v); 
                    setErrors(p => ({ ...p, contactNumber: null })); 
                    setAuthError('');
                  }}
                  placeholder="0919 444 8888"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="phone-pad"
                  maxLength={13}
                  editable={lockoutSeconds === 0}
                  autoComplete="tel"
                />
              </View>
              {errors.contactNumber && <Text style={s.errorText}>{errors.contactNumber}</Text>}
            </View>

            {/* Password */}
            <View style={s.fieldGroup}>
              <Text style={s.label}>{t('auth_password', 'Password')}</Text>
              <View style={[s.inputWrap, errors.password && s.inputError]}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={s.inputIcon} />
                <TextInput
                  style={[s.input, { flex: 1 }]}
                  value={password}
                  onChangeText={v => { 
                    setPassword(v); 
                    setErrors(p => ({ ...p, password: null })); 
                    setAuthError('');
                  }}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPw}
                  editable={lockoutSeconds === 0}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPw(p => !p)} style={{ padding: 4 }} activeOpacity={0.7}>
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={s.errorText}>{errors.password}</Text>}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={s.forgotWrap} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={s.forgotText}>{t('auth_forgot_pw', 'Forgot Password?')}</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity 
              style={[
                s.btn, 
                (loading || lockoutSeconds > 0) && s.btnDisabled,
                lockoutSeconds > 0 && { backgroundColor: '#9CA3AF' }
              ]} 
              onPress={handleLogin} 
              disabled={loading || lockoutSeconds > 0}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={s.btnText}>
                    {lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : t('auth_sign_in', 'Sign In to App')}
                  </Text>
                  <Ionicons name={lockoutSeconds > 0 ? "lock-closed" : "arrow-forward"} size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Instant Role Access (No Emojis) */}
            <View style={s.quickAccessWrap}>
              <View style={s.quickAccessHeader}>
                <Text style={s.quickAccessTitle}>Instant Role Access</Text>
                <Text style={s.quickAccessSub}>1-Click Fast Switch</Text>
              </View>
              <View style={s.quickGrid}>
                <TouchableOpacity
                  style={s.quickRoleBtn}
                  onPress={() => {
                    setContactNumber('09171234567');
                    setPassword('password123');
                    authenticateUser('09171234567', 'password123');
                    navigation.replace('MainTabs');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={s.quickRoleTitle}>Farmer Member</Text>
                  <Text style={s.quickRoleName}>Juan dela Cruz</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.quickRoleBtn}
                  onPress={() => {
                    setContactNumber('09189876543');
                    setPassword('password123');
                    authenticateUser('09189876543', 'password123');
                    navigation.replace('MainTabs');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={s.quickRoleTitle}>Farm Manager</Text>
                  <Text style={s.quickRoleName}>Jose Reyes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.quickRoleBtn, { width: '100%' }]}
                  onPress={() => {
                    setContactNumber('09194448888');
                    setPassword('password123');
                    authenticateUser('09194448888', 'password123');
                    navigation.replace('MainTabs');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={s.quickRoleTitle}>SRA Admin</Text>
                  <Text style={s.quickRoleName}>Engr. Maria Santos (Silay Authority)</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.securityNotice}>
              <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.primary} />
              <Text style={s.securityNoticeText}>Encrypted &amp; SRA Certified Agricultural Gateway</Text>
            </View>
          </View>

          {/* Register Link */}
          <View style={s.registerRow}>
            <Text style={s.registerText}>{t('auth_no_account', "Don't have an account?")} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={s.registerLink}>{t('auth_register_now', 'Create Account')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.lg, gap: SPACING.lg, paddingBottom: 32, justifyContent: 'center' },
  header: { alignItems: 'center', gap: 6, paddingTop: 10 },
  logoImg: { width: 80, height: 80 },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.text, letterSpacing: -0.3 },
  sub: { fontSize: 13, color: COLORS.textMuted },
  card: { backgroundColor: '#fff', borderRadius: RADIUS['2xl'] || 24, padding: SPACING.xl, gap: SPACING.md, ...SHADOW.card },
  
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 10,
    borderRadius: RADIUS.md,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 11.5,
    color: '#DC2626',
    fontWeight: '600',
  },
  lockoutBanner: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  lockoutBannerText: {
    color: '#B45309',
  },

  fieldGroup: { gap: 4 },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.3 },
  inputWrap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.background, 
    borderRadius: RADIUS.md, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    gap: 8 
  },
  inputError: { borderColor: '#D9534F' },
  inputIcon: { flexShrink: 0 },
  input: { flex: 1, fontSize: 14, color: COLORS.text, fontWeight: '600' },
  errorText: { fontSize: 11, color: '#D9534F', marginTop: 2 },
  forgotWrap: { alignSelf: 'flex-end', marginTop: -2 },
  forgotText: { fontSize: 12, color: COLORS.primaryLight, fontWeight: '700' },
  btn: { 
    backgroundColor: COLORS.primary, 
    borderRadius: RADIUS.lg, 
    paddingVertical: 14, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 8, 
    marginTop: 4,
    ...SHADOW.sm 
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 2,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  securityNoticeText: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    fontWeight: '600',
  },

  // Instant Role Access Styles (No Emojis)
  quickAccessWrap: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  quickAccessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickAccessTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickAccessSub: {
    fontSize: 9.5,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickRoleBtn: {
    width: '48.5%',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: 9,
    paddingHorizontal: 10,
    gap: 2,
  },
  quickRoleTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  quickRoleName: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },

  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  registerText: { fontSize: 13, color: COLORS.textMuted },
  registerLink: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
});
