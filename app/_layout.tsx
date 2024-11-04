import React from "react";
import { useColorScheme } from "react-native";
// importa estilos para modo Default y Dark de React
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import { createStackNavigator } from '@react-navigation/stack';
import IndexScreen from "./index"; // Asegúrate de que esté bien importado
import web from "./web";     // Asegúrate de que esté bien importado

const Stack = createStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const themeStyles = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={themeStyles}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" component={IndexScreen}  />
        <Stack.Screen name="web" component={web} />
      </Stack.Navigator>
    </ThemeProvider>
    
  );
}
