import React, { useRef, useState } from "react";
import { View, Text, useColorScheme, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";
import { Link, useRouter } from "expo-router";
import { WebView } from 'react-native-webview';
// Importa los iconos de Expo  
import { MaterialIcons, AntDesign, SimpleLineIcons } from "@/src/icons/icons";
// importa estilos para modo Default y Dark de React
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

// obtener el parámetro url
import { useGlobalSearchParams } from 'expo-router';

export default function WebScreen() {
  const colorScheme = useColorScheme();
  const themeStyles = colorScheme === 'dark' ? DarkTheme : DefaultTheme
  const params = useGlobalSearchParams(); // Devuelve un objeto con los parámetros
  const { url } = params; // Accede al valor de 'url' del objeto
  const urla = url.toString();
  const [currentUrl, setCurrentUrl] = useState(urla || ""); // Usa el parámetro 'url' o un valor por defecto
  const webViewRef = useRef<WebView>(null);// Crea una referencia al WebView
  const router = useRouter(); // navegacion con expo-router

  // Función para verificar si el texto ingresado es una URL
  const isValidUrl = (text: string) => {
    const pattern = /^(https?:\/\/)?([\da-z.-]+\.[a-z.]{2,6}|[0-9.]+)([\/\w .-]*)*(\?.*)?(#.*)?$/;
    return pattern.test(text);
  };

  // Función para manejar la búsqueda o redirección
  const handleSearch = () => {
    if (currentUrl.length > 0) {
      const url = isValidUrl(currentUrl) ? (currentUrl.startsWith("http") ? currentUrl : `https://${currentUrl}`) : `https://www.google.com/search?q=${encodeURIComponent(currentUrl)}`;
      // router.push({ pathname: '/web', params: { url: url }});
      setCurrentUrl("");
    }
  };

  // Funcion para borrar texto del input
  const deleteText = () => {
    setCurrentUrl("");
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      {/* Encabezado */}
      <View style={[styles.encabezado, { backgroundColor: themeStyles.colors.background, borderBottomColor: themeStyles.colors.border }]} >
        {/* Boton home */}
        <TouchableOpacity onPress={() => router.push('/')}>
          <AntDesign name="home" size={24} color={themeStyles.colors.text} />
        </TouchableOpacity>

        {/* Input URL */}
        <TextInput style={[styles.textInput, { backgroundColor: themeStyles.colors.inputBackground, color: themeStyles.colors.text }]}
          value={currentUrl}
          onChangeText={(text) => setCurrentUrl(text)}
          placeholder="Intruce una url"
          placeholderTextColor="#999"
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleSearch} // Inicia la búsqueda al presionar "Enviar" en el teclado
        />
        {/* Botón de Borrar solo visible si hay texto en el input */}
        {currentUrl.length > 0 && (
          <TouchableOpacity onPress={deleteText} style={styles.deleteTextButton}>
            <MaterialIcons name="close" size={20} color={themeStyles.colors.text} />
          </TouchableOpacity>
        )}

        {/* Botón Refrescar */}
        <TouchableOpacity onPress={() => webViewRef.current?.reload()}>
          <MaterialIcons name="refresh" size={24} color={themeStyles.colors.text} />
        </TouchableOpacity>

        {/* Botón Opciones */}
        <TouchableOpacity>
          <SimpleLineIcons name="options-vertical" size={20} color={themeStyles.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Cuerpo */}
      <WebView
        ref={webViewRef} // Asigna la referencia al WebView 
        source={{ uri: url.toString() }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    height: 60,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 50,
    paddingLeft: 15,
    paddingRight: 40,
    overflow: 'hidden', // Evita que el texto se desborde
  },
  deleteTextButton: {
    position: "absolute",
    width: 40,
    height: 40,
    right: 85,
    alignItems: "center",
    justifyContent: "center",
  }
});