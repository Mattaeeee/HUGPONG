import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { subscribe, getIsSynced, getCurrentSession, setSynced } from '../data/mockData';

const LOGO = require('../../assets/HUGPONG LOGO.png');

/**
 * AppHeader — shared header brand row used across all main tab screens.
 * Features a dynamic sync indicator button on the right that turns green/yellow.
 */
export default function AppHeader({ right }) {
  const [synced, setSyncedState] = useState(getIsSynced());
  const [pendingCount, setPendingCount] = useState(getCurrentSession().pendingLogs);
  const [isSyncing, setIsSyncing] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setSyncedState(getIsSynced());
      setPendingCount(getCurrentSession().pendingLogs);
    });
    return unsubscribe;
  }, []);

  const handleSync = () => {
    if (isSyncing) return;
    if (synced && pendingCount === 0) {
      Alert.alert(
        'Synced ✓',
        'Your sugarcane records are fully synchronized with the HUGPONG cloud. Safe to work offline.'
      );
      return;
    }

    setIsSyncing(true);
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setIsSyncing(false);
      setSynced(true);
      Alert.alert(
        'Sync Complete ✓',
        'All local sugarcane operation logs have been successfully uploaded and compiled.'
      );
    });
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={s.header}>
      <View style={s.brand}>
        <Image source={LOGO} style={s.logoImg} resizeMode="contain" />
        <Text style={s.logoText}>HUGPONG</Text>
      </View>
      <View style={s.rightActions}>
        <TouchableOpacity
          style={[
            s.syncPill,
            synced ? s.syncPillGreen : s.syncPillYellow,
            isSyncing && s.syncPillSyncing
          ]}
          onPress={handleSync}
          activeOpacity={0.75}
        >
          <Animated.View style={isSyncing ? { transform: [{ rotate: spin }] } : {}}>
            <Ionicons
              name={isSyncing ? "sync-outline" : (synced ? "cloud-done" : "cloud-upload")}
              size={16}
              color={isSyncing ? '#1A6B9A' : (synced ? '#267326' : '#C97A00')}
            />
          </Animated.View>
          <Text style={[s.syncText, synced ? s.syncTextGreen : s.syncTextYellow]}>
            {isSyncing ? 'Syncing...' : (synced ? 'Synced' : `Sync (${pendingCount})`)}
          </Text>
        </TouchableOpacity>

        {right ? <View style={s.right}>{right}</View> : <View style={s.rightPlaceholder} />}
      </View>
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
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightPlaceholder: {
    width: 0,
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  syncPillGreen: {
    backgroundColor: '#F2FBF2',
    borderColor: '#E8F5E8',
  },
  syncPillYellow: {
    backgroundColor: '#FFFBF0',
    borderColor: '#FEF0D0',
  },
  syncPillSyncing: {
    backgroundColor: '#F0F8FF',
    borderColor: '#DFF0FB',
  },
  syncText: {
    fontSize: 11,
    fontWeight: '700',
  },
  syncTextGreen: {
    color: '#267326',
  },
  syncTextYellow: {
    color: '#C97A00',
  },
});
