import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

const LOGO = require('../../assets/HUGPONG LOGO.png');

/**
 * AppHeader — shared header brand row used across all main tab screens.
 * Place the `right` prop to render action buttons (notifications, refresh, etc.)
 */
export default function AppHeader({ right }) {
  return (
    <View style={s.header}>
      <View style={s.brand}>
        <Image source={LOGO} style={s.logoImg} resizeMode="contain" />
        <Text style={s.logoText}>HUGPONG</Text>
      </View>
      {right ? <View style={s.right}>{right}</View> : <View style={s.rightPlaceholder} />}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#DCE8CC',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImg: {
    width: 32,
    height: 32,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightPlaceholder: {
    width: 36,
  },
});
