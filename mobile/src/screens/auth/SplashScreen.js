import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { COLORS } from '../../theme';

const LOGO = require('../../../assets/HUGPONG LOGO.png');

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(tagOpacity, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Onboarding'), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={s.container}>
      <View style={s.center}>
        <Animated.View style={[s.logoWrap, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
          <Image source={LOGO} style={s.logoImg} resizeMode="contain" />
          <Text style={s.logoText}>HUGPONG</Text>
        </Animated.View>
        <Animated.Text style={[s.tagline, { opacity: tagOpacity }]}>
          Agricultural Operations Platform
        </Animated.Text>
      </View>
      <Animated.Text style={[s.version, { opacity: tagOpacity }]}>v1.0.0</Animated.Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  logoWrap: { alignItems: 'center', gap: 18 },
  logoImg: { width: 130, height: 130 },
  logoText: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: 4 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, fontWeight: '400' },
  version: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
});
