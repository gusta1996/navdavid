import React, { useEffect, useRef, useState } from "react";
import { View, Text, useColorScheme, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Platform, StatusBar, Modal, TouchableWithoutFeedback } from "react-native";
import { WebView } from 'react-native-webview';
// Importa los iconos de Expo  
import { MaterialIcons, AntDesign, SimpleLineIcons, Feather, FontAwesome } from "@/src/icons/icons";
// importa estilos para modo claro y oscuro
import { darkTheme } from "../src/themes/darkTheme";
import { lightTheme } from "../src/themes/lightTheme";
// obtener el parámetro url
import { useGlobalSearchParams } from 'expo-router';
// navegacion con expo-router
import { useRouter } from 'expo-router';


export default function WebScreen() {
  const colorScheme = useColorScheme();
  const themeStyles = colorScheme === 'dark' ? darkTheme : lightTheme;
  const params = useGlobalSearchParams(); // Devuelve un objeto con los parámetros
  const { url } = params; // Accede al valor de 'url' del objeto
  const [currentUrl, setCurrentUrl] = useState(url ? url.toString() : "");
  const webViewRef = useRef<WebView>(null);// Crea una referencia al WebView
  const router = useRouter(); // navegacion con expo-router
  const [modalAutoRefresh, setModalAutoRefresh] = useState(false);
  const [segAutoRefresh, setSegAutoRefresh] = useState("");

  // Función para verificar si el texto ingresado es una URL
  const isValidUrl = (text: string) => {
    const pattern = /^(https?:\/\/)?([\da-z.-]+\.[a-z.]{2,6}|[0-9.]+)([\/\w .-]*)*(\?.*)?(#.*)?$/;
    return pattern.test(text);
  };

  // Función para manejar la búsqueda o redirección
  const handleSearch = () => {
    if (currentUrl.length > 0) {
      const url = isValidUrl(currentUrl) ? (currentUrl.startsWith("http") ? currentUrl : `https://${currentUrl}`) : `https://www.google.com/search?q=${encodeURIComponent(currentUrl)}`;
      router.push({ pathname: '/web', params: { url: url } });
      setCurrentUrl("");
    }
  };

  // Funcion para borrar texto del input
  const deleteText = () => {
    setCurrentUrl("");
  };

  // Función para ejecutar el script en la webview 
  const executeScript = ` 
  const enProgreso = document.querySelector("a[href='/peer-transfers/in-progress']");
  const disponible = document.querySelector("a[href='/peer-transfers/available']");
  const titulo = document.querySelector(".section__header h1");

  function clickEnProgeso() { enProgreso.click(); } 
  function clickDisponible() { disponible.click(); } 

  function recargador() {
    if (window.location.href == 'https://app.airtm.com/peer-transfers/available') {
      let seconds = ${segAutoRefresh};
      clickEnProgeso(); 
      clickDisponible(); 
      titulo.style.backgroundColor = "green"; 
      function actContador() { 
        if (seconds > 0) { 
          titulo.innerHTML = "Mi contador: " + seconds;
          if (seconds <= 6) { 
            titulo.style.backgroundColor = "white";
          } 
          seconds--; 
          setTimeout(actContador, 1000); // Llama a la función nuevamente después de 1 segundo 
        } else { 
          // Recarga 
          recargador();
        } 
      } 
      actContador(); 
    } 
  } 
  recargador(); `;

  // funcion autoRefresh
  const autoRefresh = () => {
    if (segAutoRefresh.length > 0) {
      setModalAutoRefresh(false);
      webViewRef.current?.injectJavaScript(executeScript);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Encabezado */}
      <View style={[styles.encabezado, { backgroundColor: themeStyles.colors.background, borderBottomColor: themeStyles.colors.border }]} >
        {/* Boton home */}
        <TouchableOpacity style={styles.iconNavBar} onPress={() => router.push('/')}>
          <AntDesign name="home" size={24} color={themeStyles.colors.text} />
        </TouchableOpacity>

        {/* Input URL */}
        <TextInput style={[styles.textInput, { backgroundColor: themeStyles.colors.inputBackground, color: themeStyles.colors.text }]}
          value={currentUrl}
          onChangeText={setCurrentUrl}
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
        <TouchableOpacity style={styles.iconNavBar} onPress={() => webViewRef.current?.reload()}>
          <MaterialIcons name="refresh" size={24} color={themeStyles.colors.text} />
        </TouchableOpacity>

        {/* Botón funcion autoRefresh */}
        <TouchableOpacity style={styles.iconNavBar} onPress={() => setModalAutoRefresh(true)}>
          <MaterialIcons name="access-time" size={24} color={themeStyles.colors.text} />
        </TouchableOpacity>

        {/* Modal de autoRefresh */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalAutoRefresh}
          onRequestClose={() => setModalAutoRefresh(!modalAutoRefresh)}
        >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { backgroundColor: themeStyles.colors.background, borderColor: themeStyles.colors.border }]}>

              {/* Cantidad de segundos */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <Text style={{ color: themeStyles.colors.text }}>Recargar despues X segundos:</Text>
                <AntDesign name="close" size={24} color={themeStyles.colors.text} onPress={() => { setModalAutoRefresh(false); }} />
              </View>
              <TextInput style={{ backgroundColor: themeStyles.colors.inputBackground, color: themeStyles.colors.text }}
                value={segAutoRefresh}
                onChangeText={setSegAutoRefresh}
                placeholder="Introduce segundos"
                placeholderTextColor={themeStyles.colors.text}
                keyboardType="numeric" />

              {/* Botón para cerrar la caja flotante */}
              <TouchableOpacity style={[styles.closeButton, { backgroundColor: themeStyles.colors.primary }]} onPress={autoRefresh} >
                <Text style={styles.textStyle}>Empezar a recargar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Cuerpo */}
      <WebView
        ref={webViewRef} // Asigna la referencia al WebView 
        source={{ uri: currentUrl }} // Usa currentUrl como URL
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconNavBar: {
    height: 35,
    width: 35,
    justifyContent: "center",
    alignItems: "center"
  },
  encabezado: {
    height: 60,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
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
    right: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    borderWidth: 1,
    margin: 25,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: '#F194FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});