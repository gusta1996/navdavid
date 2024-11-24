import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, TextInput, SafeAreaView, useColorScheme, Image, StyleSheet, Modal, ScrollView, Button, Vibration } from "react-native";

import { Link } from "expo-router";
// Importa los iconos de Expo  
import { AntDesign, Feather, MaterialIcons } from "@/src/icons/icons";
// importa estilos para modo claro y oscuro
import { darkTheme } from "../src/themes/darkTheme";
import { lightTheme } from "../src/themes/lightTheme";
// navegacion con expo-router
import { useRouter } from 'expo-router';
import { FlatList } from "react-native-gesture-handler";
import { Fontisto } from "@expo/vector-icons";
// Importamos AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const colorScheme = useColorScheme();// modo oscuro o claro
  const themeStyles = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [input, setInput] = useState(""); // estado de url
  const router = useRouter(); // navegacion con expo-router
  const [modalVisible, setModalVisible] = useState(false);


  const [favorites, setFavorites] = useState<{ id: number; name: string; url: string }[]>([]);
  const [nameFavorite, setNameFavorite] = useState("");
  const [urlFavorite, setUrlFavorite] = useState("");
  const [errorFavorite, setErrorFavorite] = useState("")
  const [favoriteToDelete, setFavoriteToDelete] = useState<number | null>(null); // Estado para el ID del favorito a borrar
  const [modalFavoriteToDelete, setModalFavoriteToDelete] = useState(false);


  useEffect(() => {
    loadFavorites();
  }, []);

  // renderiza icono de modo oscuro y claro

  // Verificar si el texto ingresado es una URL
  const isValidUrl = (text: string) => {
    const pattern = /^(https?:\/\/)?([\da-z.-]+\.[a-z.]{2,6}|[0-9.]+)([\/\w .-]*)*(\?.*)?(#.*)?$/;
    if (pattern.test(text)) {
      if (text.startsWith("http")) {
        return text;
      } else {
        return `https://${text}`;
      }
    } else {
      return `https://www.google.com/search?q=${encodeURIComponent(text)}`;
    }
  };

  // Manejar la búsqueda o redirección
  const handleSearch = () => {
    if (input.length > 0) {
      const url = isValidUrl(input);
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

  // Guardar favoritos con ID único
  const saveFavorite = async () => {
    if (nameFavorite.length > 0 && urlFavorite.length > 0) {
      // limpiar los estados
      clearFavoriteStates();
      setModalVisible(false);
      // Crea un objeto con un ID único, el nombre y la URL
      const newFavorite = {
        id: Date.now(), // Usamos el tiempo actual como ID único
        name: nameFavorite,
        url: urlFavorite,
      };

      try {
        // Obtiene la lista actual de favoritos
        const existingFavorites = await AsyncStorage.getItem('favorites');
        const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];

        // Agrega el nuevo favorito a la lista
        favorites.push(newFavorite);

        // Guarda la lista actualizada
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));

        // carga lista actualizada
        loadFavorites();

      } catch (error) {
        console.error('Error al guardar el favorito:', error);
      }
    } else {
      setErrorFavorite('Llene todos los campos.');
    }
  };

  // Cargar favoritos
  const loadFavorites = async () => {
    try {
      // Obtiene la lista actual de favoritos (en JSON)
      const existingFavorites = await AsyncStorage.getItem('favorites');

      // convierte la cadena JSON en lista
      if (existingFavorites) {
        const parsedFavorites = JSON.parse(existingFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error al cargar los favoritos:', error);
    }
  };

  // Borrar favorito usando el ID
  const deleteFavorite = async (idToDelete: number) => {
    try {
      // Obtiene la lista actual de favoritos (en JSON)
      const existingFavorites = await AsyncStorage.getItem('favorites');
      const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];

      // Filtra la lista para eliminar el favorito con el ID proporcionado
      const updatedFavorites = favorites.filter((favorite: { id: number; name: string; url: string }) => favorite.id !== idToDelete);

      // Guarda la lista actualizada
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));

      // Actualiza el estado con la lista de favoritos modificada
      setFavorites(updatedFavorites);

      // Cierra el modal
      Vibration.vibrate(100); // vibracion
      setModalFavoriteToDelete(false);
    } catch (error) {
      console.error('Error al borrar el favorito:', error);
    }
  };

  const handleLongPress = (id: number) => {
    setFavoriteToDelete(id); // Guarda el ID del favorito a eliminar
    setModalFavoriteToDelete(true); // Muestra el modal de confirmación
    Vibration.vibrate(100); // vibracion
  };

  // lista de favoritos
  const renderItem = ({ item }: { item: { id: number; name: string; url: string } }) => (
    <View style={styles.itemFlatList}>
      <TouchableOpacity
        onPress={() => {
          const url = isValidUrl(item.url);
          router.push({ pathname: '/web', params: { url: url } });
        }}
        onLongPress={() => handleLongPress(item.id)}  // Usamos el ID para eliminar el favorito
      >
        <View style={styles.itemButtomWeb}>
          <Fontisto name="world-o" size={24} color={themeStyles.colors.text} />
          <Text style={{ fontSize: 10, color: themeStyles.colors.text }} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );


  return (
    <SafeAreaView style={{ backgroundColor: themeStyles.colors.background, flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

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
            <FlatList
              data={favorites}
              renderItem={renderItem}
              numColumns={4}
              contentContainerStyle={styles.containerFlatList}
              scrollEnabled={false} />

            {/* Modal de Confirmación */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalFavoriteToDelete}
              onRequestClose={() => setModalFavoriteToDelete(false)}
            >
              <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: themeStyles.colors.background, borderColor: themeStyles.colors.border }]}>
                  <Text style={{ fontSize: 16, color: 'white', marginBottom: 20 }}>¿Estás seguro de que quieres eliminar este favorito?</Text>

                  <View style={styles.buttonsContainer}>
                    <Button
                      title="Eliminar"
                      onPress={() => {
                        if (favoriteToDelete !== null) {
                          deleteFavorite(favoriteToDelete); // Llama a la función para borrar el favorito
                        }
                      }}
                    />
                    <Button title="Cancelar" onPress={() => setModalFavoriteToDelete(false)} />
                  </View>
                </View>
              </View>
            </Modal>

            {/* Botom de modal */}
            <TouchableOpacity style={[styles.openButtom, { backgroundColor: themeStyles.colors.primary }]} onPress={() => setModalVisible(true)}>
              <Feather name="plus" size={20} color='black' />
              <Text style={{ fontSize: 16, color: 'black' }}>Agregar enlace</Text>
            </TouchableOpacity>

            {/* Modal: agregar enlaces*/}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
              <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: themeStyles.colors.background, borderColor: themeStyles.colors.border }]}>

                  {/* Titulo modal */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.titleModal, { color: themeStyles.colors.text }]}>GUARDAR FAVORITO</Text>
                    <AntDesign name="close" size={24} color={themeStyles.colors.text} onPress={() => { setModalVisible(false); clearFavoriteStates(); }} />
                  </View>

                  {/* Nombre web */}
                  <Text style={[styles.modalText, { color: themeStyles.colors.text }]}>Nombre:</Text>
                  <TextInput style={[styles.modalInput, { backgroundColor: themeStyles.colors.inputBackground, color: themeStyles.colors.text }]}
                    value={nameFavorite}
                    onChangeText={setNameFavorite}
                    placeholder="Introduce nombre"
                    placeholderTextColor={themeStyles.colors.text}
                    keyboardType="url"
                    autoCapitalize="none"
                    autoCorrect={false} />

                  {/* Url web */}
                  <Text style={[styles.modalText, { color: themeStyles.colors.text }]}>Url / Busqueda:</Text>
                  <TextInput style={[styles.modalInput, { backgroundColor: themeStyles.colors.inputBackground, color: themeStyles.colors.text }]}
                    value={urlFavorite}
                    onChangeText={setUrlFavorite}
                    placeholder="Introduce la Url o Busqueda"
                    placeholderTextColor={themeStyles.colors.text}
                    keyboardType="url"
                    autoCapitalize="none"
                    autoCorrect={false} />

                  {errorFavorite ? <Text style={{ color: 'red', fontWeight: 'bold' }}>{errorFavorite}</Text> : null}

                  {/* Botón para cerrar la caja flotante */}
                  <TouchableOpacity style={[styles.closeButton, { backgroundColor: themeStyles.colors.primary }]} onPress={saveFavorite} >
                    <Text style={styles.textStyle}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>

      </ScrollView >
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: 5,
    paddingHorizontal: 3,
  },
  itemButtomWeb: {
    alignItems: 'center',
    gap: 5,
    height: 60,
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
});