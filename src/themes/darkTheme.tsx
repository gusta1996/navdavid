import { DarkTheme } from "@react-navigation/native";
import CustomTheme from "./themes";

// Tema personalizado oscuro
export const darkTheme: CustomTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: '#33d1ff',
        background: '#111',
        card: '#1E1E1E',
        text: '#FFFFFF',
        border: '#272727',
        notification: '#CF6679',
        inputBackground: '#1F1F1F',
    },
};