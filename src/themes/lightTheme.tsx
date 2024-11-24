import { DefaultTheme } from "@react-navigation/native";
import CustomTheme from "./themes";

// Tema personalizado oscuro
export const lightTheme: CustomTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#33d1ff',
        background: "#fff",
        card: '#eee',
        text: "#000",
        border: "#ddd",
        notification: '#CF6679',
        inputBackground: "#eee",
    },
};