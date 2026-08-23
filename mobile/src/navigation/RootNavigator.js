import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOW } from '../theme';
import { getCurrentSession, subscribe } from '../data/mockData';

import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

import HomeScreen from '../screens/HomeScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import PlannerScreen from '../screens/PlannerScreen';
import FieldOpsScreen from '../screens/FieldOpsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SecurityScreen from '../screens/SecurityScreen';
import SyncMonitorScreen from '../screens/SyncMonitorScreen';
import { useTranslation } from '../services/i18n';

const Root = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const CalcStack = createNativeStackNavigator();
const SchedStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const TAB_ICONS = {
  Home: { active: 'home', inactive: 'home-outline' },
  Planner: { active: 'construct', inactive: 'construct-outline' },
  'Field Ops': { active: 'book', inactive: 'book-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Analytics" component={AnalyticsScreen} options={{ animation: 'slide_from_right' }} />
      <HomeStack.Screen name="SyncMonitor" component={SyncMonitorScreen} options={{ animation: 'slide_from_right' }} />
    </HomeStack.Navigator>
  );
}

function CalcNavigator() {
  return (
    <CalcStack.Navigator screenOptions={{ headerShown: false }}>
      <CalcStack.Screen name="CalcMain" component={PlannerScreen} />
    </CalcStack.Navigator>
  );
}

function SchedNavigator() {
  return (
    <SchedStack.Navigator screenOptions={{ headerShown: false }}>
      <SchedStack.Screen name="SchedMain" component={FieldOpsScreen} />
      <SchedStack.Screen name="SyncMonitor" component={SyncMonitorScreen} options={{ animation: 'slide_from_right' }} />
    </SchedStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Security" component={SecurityScreen} options={{ animation: 'slide_from_right' }} />
      <ProfileStack.Screen name="SyncMonitor" component={SyncMonitorScreen} options={{ animation: 'slide_from_right' }} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  const [role, setRole] = React.useState(getCurrentSession().role);
  const { t } = useTranslation();

  React.useEffect(() => {
    return subscribe(() => {
      setRole(getCurrentSession().role);
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          ...SHADOW.float,
        },
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: '600', letterSpacing: 0.2, marginTop: 1 },
        tabBarIcon: ({ focused, color }) => {
          const cfg = TAB_ICONS[route.name];
          return <Ionicons name={focused ? cfg.active : cfg.inactive} size={23} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} options={{ tabBarLabel: t('tab_home', 'Home') }} />
      {role !== 'SRA (Admin)' && (
        <Tab.Screen name="Planner" component={CalcNavigator} options={{ tabBarLabel: t('tab_planner', 'Planner') }} />
      )}
      <Tab.Screen 
        name="Field Ops" 
        component={SchedNavigator} 
        options={{ tabBarLabel: role === 'SRA (Admin)' ? 'District Ops' : t('tab_field_ops', 'Field Ops') }}
      />
      <Tab.Screen name="Profile" component={ProfileNavigator} options={{ tabBarLabel: t('tab_profile', 'Profile') }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Root.Screen name="Splash" component={SplashScreen} />
      <Root.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'slide_from_right' }} />
      <Root.Screen name="Login" component={LoginScreen} options={{ animation: 'slide_from_right' }} />
      <Root.Screen name="Register" component={RegisterScreen} options={{ animation: 'slide_from_right' }} />
      <Root.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ animation: 'slide_from_right' }} />
      <Root.Screen name="MainTabs" component={MainTabs} options={{ animation: 'fade' }} />
    </Root.Navigator>
  );
}
