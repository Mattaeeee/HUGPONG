import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!mobile.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.topNav}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.navTitle}>Forgot Password</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          {!sent ? (
            <>
              <View style={s.iconWrap}>
                <Ionicons name="lock-open-outline" size={48} color={COLORS.primary} />
              </View>
              <View style={s.textBlock}>
                <Text style={s.title}>Reset your password</Text>
                <Text style={s.sub}>Enter your mobile number or email and we'll send a reset link.</Text>
              </View>
              <View style={s.card}>
                <Text style={s.label}>Mobile Number or Email</Text>
                <View style={s.inputWrap}>
                  <Ionicons name="phone-portrait-outline" size={18} color={COLORS.textMuted} />
                  <TextInput
                    style={s.input}
                    value={mobile}
                    onChangeText={setMobile}
                    placeholder="+63 9XX XXX XXXX or email"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
              <TouchableOpacity style={[s.btn, loading && { opacity: 0.6 }]} onPress={handleSend} disabled={loading}>
                <Text style={s.btnText}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={s.successWrap}>
              <View style={s.successIcon}>
                <Ionicons name="checkmark-circle" size={60} color={COLORS.success} />
              </View>
              <Text style={s.successTitle}>Link Sent!</Text>
              <Text style={s.successSub}>Check your mobile or email for the password reset link. It expires in 15 minutes.</Text>
              <TouchableOpacity style={s.btn} onPress={() => navigation.navigate('Login')}>
                <Text style={s.btnText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
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
  scroll: { flexGrow: 1, padding: SPACING.xl, gap: SPACING.xl, alignItems: 'center', paddingTop: 40 },
  iconWrap: { width: 96, height: 96, borderRadius: 28, backgroundColor: COLORS.primaryBg, justifyContent: 'center', alignItems: 'center' },
  textBlock: { gap: 8, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  sub: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22 },
  card: { width: '100%', backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: SPACING.xl, gap: 10, ...SHADOW.card },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.background, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 13 },
  input: { flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500' },
  btn: { width: '100%', backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 16, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  successWrap: { flex: 1, alignItems: 'center', gap: SPACING.lg, paddingTop: 20 },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.successLight, justifyContent: 'center', alignItems: 'center' },
  successTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  successSub: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22 },
});
