import React, { useState } from "react";
import { Text, TouchableOpacity, View, TextInput, SafeAreaView, useColorScheme, Platform, StatusBar, Image, StyleSheet, Linking, Modal } from "react-native";

import { Link } from "expo-router";
// Importa los iconos de Expo  
import { AntDesign, Feather, MaterialIcons, SimpleLineIcons } from "@/src/icons/icons";
// importa estilos para modo Default y Dark de React
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

// navegacion con expo-router
import { useRouter } from 'expo-router';
import { FullWindowOverlay } from "react-native-screens";
import { FlatList } from "react-native-gesture-handler";
import { Fontisto } from "@expo/vector-icons";

export default function HomeScreen() {
  const colorScheme = useColorScheme();// modo oscuro o claro
  const themeStyles = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const [input, setInput] = useState(""); // estado de url
  const router = useRouter(); // navegacion con expo-router
  const [modalVisible, setModalVisible] = useState(false);

  const [nameFavorite, setNameFavorite] = useState("");
  const [urlFavorite, setUrlFavorite] = useState("");
  const [errorFavorite, setErrorFavorite] = useState("")

  // Función para verificar si el texto ingresado es una URL
  const isValidUrl = (text: string) => {
    const pattern = /^(https?:\/\/)?([\da-z.-]+\.[a-z.]{2,6}|[0-9.]+)([\/\w .-]*)*(\?.*)?(#.*)?$/;
    return pattern.test(text);
  };

  // Función para manejar la búsqueda o redirección
  const handleSearch = () => {
    if (input.length > 0) {
      const url = isValidUrl(input) ? (input.startsWith("http") ? input : `https://${input}`) : `https://www.google.com/search?q=${encodeURIComponent(input)}`;
      router.push({ pathname: '/web', params: { url: url } });
      setInput("");
    }
  };

  // Funcion para borrar texto del input
  const deleteText = () => {
    setInput("");
  };

  // vaciar (name,url,error)Favorite
  const clearFavoriteStates = () => {
    setNameFavorite(''); // vacía nombre
    setUrlFavorite(''); // vacía url
    setErrorFavorite(''); // vacía mensaje de error
  };

  // Guardar favoritos
  const saveFavorite = () => {

    if (nameFavorite.length > 0 && urlFavorite.length > 0) {
      // agregar funcion de guardado

      clearFavoriteStates(); // vacia los estados setNameFavorite, setUrlFavorite, setErrorFavorite
      setModalVisible(false); // cierra modal
    } else {
      setErrorFavorite('Llene todos los campos.');
    }
  };

  const data = [
    { id: '1', url: 'Elemento 1' },
    { id: '2', url: 'Elemento 2' },
    { id: '3', url: 'Elemento 3' },
    { id: '4', url: 'Elemento 4' },
    { id: '5', url: 'Elemento 5' },
    { id: '6', url: 'Elemento 6' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.itemFlatList}>
      <TouchableOpacity onPress={() => router.push('/web')}>
        <View style={styles.itemButtomWeb}>
          <Fontisto name="world-o" size={24} color={themeStyles.colors.text} />
          <Text style={{ fontSize: 12, color: themeStyles.colors.text }} numberOfLines={1} ellipsizeMode="tail">{item.url}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

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
            onChangeText={setInput}
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
        <View style={{ padding: 15 }}>
          <View style={{ padding: 15, borderRadius: 10, backgroundColor: themeStyles.colors.card }}>
            {/* Titulo */}
            <Text style={{ color: themeStyles.colors.text, fontWeight: 'bold' }}>Favoritos:</Text>

            {/* Lista de enlaces guardados */}
            <FlatList data={data} renderItem={renderItem} numColumns={4} contentContainerStyle={styles.containerFlatList} />

            {/* Botom de modal */}
            <TouchableOpacity style={[styles.openButtom, { backgroundColor: themeStyles.colors.primary }]} onPress={() => setModalVisible(true)}>
              <Feather name="plus" size={20} color='white' />
              <Text style={{ fontSize: 16, color: 'white' }}>Agregar enlace</Text>
            </TouchableOpacity>

            {/* Modal: agregar enlaces*/}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
              <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: themeStyles.colors.background, borderColor: themeStyles.colors.border }]}>

                  {/* Titulo modal */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.titleModal, { color: themeStyles.colors.text }]}>GUARDAR FAVORITO</Text>
                    <AntDesign name="close" size={24} color={themeStyles.colors.text} onPress={() =>{ setModalVisible(false); clearFavoriteStates(); }} />
                  </View>

                  {/* Nombre web */}
                  <Text style={[styles.modalText, { color: themeStyles.colors.text }]}>Nombre de la web:</Text>
                  <TextInput style={[styles.modalInput, { backgroundColor: themeStyles.colors.inputBackground }]}
                    value={nameFavorite}
                    onChangeText={setNameFavorite}
                    placeholder="Introduce nombre de la pagina"
                    placeholderTextColor={themeStyles.colors.text}
                    keyboardType="url"
                    autoCapitalize="none"
                    autoCorrect={false} />

                  {/* Url web */}
                  <Text style={[styles.modalText, { color: themeStyles.colors.text }]}>Url:</Text>
                  <TextInput style={[styles.modalInput, { backgroundColor: themeStyles.colors.inputBackground }]}
                    value={urlFavorite}
                    onChangeText={setUrlFavorite}
                    placeholder="Introduce la url"
                    placeholderTextColor={themeStyles.colors.text}
                    keyboardType="url"
                    autoCapitalize="none"
                    autoCorrect={false} />

                  {errorFavorite ? <Text style={{ color: 'red', fontWeight: 'bold' }}>{errorFavorite}</Text> : null}

                  {/* Botón para cerrar la caja flotante */}
                  <TouchableOpacity style={styles.closeButton} onPress={saveFavorite} >
                    <Text style={styles.textStyle}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
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
  },
  openButtom: {
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center'
  },
  closeButton: {
    backgroundColor: '#F194FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
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
  modalInput: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10
  },
  titleModal: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  },
  modalText: {
    marginBottom: 15,
    fontWeight: '500'
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerFlatList: {
    marginVertical: 10
  },
  itemFlatList: {
    width: '25%',
    paddingVertical: 15,
    paddingHorizontal: 6,
  },
  itemButtomWeb: {
    alignItems: 'center',
    gap: 5
  }
});