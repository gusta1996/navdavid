import { useColorScheme } from "react-native";
import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";

export default function useTheme() {
    // reconoce el tema que se está usando (dark o light)
    const colorScheme = useColorScheme();

    // Si colorScheme es "dark", usa darkTheme; de lo contrario, usa lightTheme como predeterminado
    const themeStyles = colorScheme === "dark" ? darkTheme : lightTheme;

    // devuelve los colores
    return themeStyles;
}