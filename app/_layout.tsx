import React, { useEffect } from "react";
import { StatusBar, useColorScheme } from "react-native";
// importa estilos para modo Default y Dark de React
import { ThemeProvider } from "@react-navigation/native";
// importa estilos para modo claro y oscuro
import { darkTheme } from "../src/themes/darkTheme";
import { lightTheme } from "../src/themes/lightTheme";

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const themeStyles = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => { 
    StatusBar.setBarStyle(colorScheme === 'dark' ? 'light-content' : 'dark-content'); 
    StatusBar.setBackgroundColor(themeStyles.colors.background);
  }, [colorScheme]);
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <ThemeProvider value={themeStyles}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: 'Index' }} />
          <Stack.Screen name="web" options={{ title: 'Web' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
