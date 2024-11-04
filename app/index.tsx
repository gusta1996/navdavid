import React, { useState } from "react";
import { Text, TouchableOpacity, View, TextInput, SafeAreaView, useColorScheme, Platform, StatusBar, Image, StyleSheet, Linking } from "react-native";
import { Link } from "expo-router";
// Importa los iconos de Expo  
import { MaterialIcons, SimpleLineIcons } from "@/src/icons/icons";
// importa estilos para modo Default y Dark de React
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

// navegacion con expo-router
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();// modo oscuro o claro
  const themeStyles = colorScheme === 'dark' ? DarkTheme : DefaultTheme; 
  const [input, setInput] = useState(""); // estado de url
  const router = useRouter(); // navegacion con expo-router

  // Función para verificar si el texto ingresado es una URL
  const isValidUrl = (text : string) => {
    const pattern = /^(https?:\/\/)?([\da-z.-]+\.[a-z.]{2,6}|[0-9.]+)([\/\w .-]*)*(\?.*)?(#.*)?$/;
    return pattern.test(text);
  };

  // Función para manejar la búsqueda o redirección
  const handleSearch = ( ) => {
    if (input.length > 0) {
      const url = isValidUrl(input) ? (input.startsWith("http") ? input : `https://${input}`) : `https://www.google.com/search?q=${encodeURIComponent(input)}`;
      router.push({ pathname: '/web', params: { url: url }});
      setInput("");
    }
  };

  // Funcion para borrar texto del input
  const deleteText = () => {
    setInput("");
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <View>

        {/* Botón Opciones */}
        <View style={[styles.viewLink]}>
          <Link href="/web" asChild style={[styles.linkOpciones]}>
            <TouchableOpacity>
              <SimpleLineIcons name="options-vertical" size={23} color={themeStyles.colors.text} />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Imagen */}
        <View style={{ alignItems: 'center' }}>
          <Image style={{ marginTop: 60, marginBottom: 20 }} source={require("../assets/images/google.png")} />
        </View>

        {/* Input URL */}
        <View style={styles.searchContainer} >
          <TextInput
            style={[styles.textInput, { backgroundColor: themeStyles.colors.inputBackground, color: themeStyles.colors.text }]}
            value={input}
            onChangeText={(text) => setInput(text)}
            placeholder="Busqueda web"
            placeholderTextColor={themeStyles.colors.text}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleSearch} // Inicia la búsqueda al presionar "Enviar" en el teclado
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <MaterialIcons name="search" size={25} color={themeStyles.colors.text} />
          </TouchableOpacity>

          {/* Botón de Borrar solo visible si hay texto en el input */}
          {input.length > 0 && (
            <TouchableOpacity onPress={deleteText} style={styles.deleteTextButton}>
              <MaterialIcons name="close" size={20} color={themeStyles.colors.text} />
            </TouchableOpacity>
          )}

        </View>

        {/* Cuerpo */}
        <View style={{ padding: 10 }}>
          <Text style={{ color: themeStyles.colors.text }}>Pantalla home</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewLink: {
    alignItems: 'flex-end',
    paddingRight: 10
  },
  linkOpciones: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  textInput: {
    flex: 1,
    height: 60,
    borderRadius: 50,
    paddingHorizontal: 50,
  },
  searchButton: {
    position: "absolute",
    width: 40,
    height: 40,
    left: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteTextButton: {
    position: "absolute",
    width: 40,
    height: 40,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
  }
});