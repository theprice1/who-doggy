import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
// @ts-ignore - TypeScript doesn't natively recognize CSS file imports
import ConsentBanner from "../components/ConsentBanner";
import "../global.css";

// 1. Tell the native OS to keep the splash screen visible
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        // 2. Run initialization tasks here (e.g., checking Supabase auth, loading custom fonts)
        // We add a tiny artificial delay here just to ensure React has fully mounted the UI
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (e) {
        console.warn(e);
      } finally {
        // 3. Signal that the app structure is built and ready to render
        setAppIsReady(true);
      }
    }

    prepareApp();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // 4. Smoothly hide the native splash screen now that our UI is behind it
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Return null to keep the screen completely clear until we are ready to swap
  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Registering your new legal folder so the router knows how to navigate to it */}
        <Stack.Screen
          name="(legal)"
          options={{ headerShown: false, presentation: "modal" }}
        />
      </Stack>

      <ConsentBanner />
    </>
  );
}
