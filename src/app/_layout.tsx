import { Fraunces_500Medium, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance, Platform } from 'react-native';

import AppTabs from '@/components/app-tabs';
import { AppScheme, Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();
// A short fade from the plain night-pine splash into the feed (iOS only; Android uses its own exit).
SplashScreen.setOptions({ duration: 250, fade: true });
// Native chrome (tab bar, alerts, share sheet) follows the app's single dark scheme.
// react-native-web has no setColorScheme.
if (Platform.OS !== 'web') Appearance.setColorScheme(AppScheme);

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors[AppScheme].background,
    card: Colors[AppScheme].background,
    primary: Colors[AppScheme].accent,
    text: Colors[AppScheme].text,
  },
};

export default function TabLayout() {
  // Keep the splash screen up until the fonts load, so text never flashes in the system font.
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const ready = fontsLoaded || fontError !== null;
  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);
  if (!ready) return null;

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style="light" />
      <AppTabs />
    </ThemeProvider>
  );
}
