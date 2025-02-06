import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from '../src/components/SplashScreen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || !isReady) {
    return <CustomSplashScreen onFinish={() => setIsReady(true)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="game" />
    </Stack>
  );
}
