import { Theme } from "@react-navigation/native";

interface CustomTheme extends Theme {
  colors: Theme['colors'] & {
    // Agrega tus colores personalizados para los temas oscuro y claro
    inputBackground: string; 
  };
}

export default CustomTheme;