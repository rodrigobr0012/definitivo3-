# Setup do frontend mobile (React Native)

As telas em `src/mobile/pages` foram criadas para serem consumidas por um projeto React Native/Expo separado (não há Metro ou Expo configurado neste repositório). Siga os passos abaixo para rodá-las em um app móvel.

## Pré-requisitos
- Node.js 18+ e npm.
- Android Studio/Emulador ou Xcode/Simulador, ou um dispositivo físico com o app Expo Go instalado.

## 1) Criar um novo app Expo
```bash
npx create-expo-app buymove-mobile
cd buymove-mobile
```

## 2) Instalar dependências usadas pelas telas
As telas usam React Navigation (stack) e componentes padrão do React Native.
```bash
npm install @react-navigation/native @react-navigation/native-stack react-native-safe-area-context react-native-screens react-native-gesture-handler
```

> Caso prefira usar ícones, instale também `react-native-vector-icons` ou use os ícones embutidos do Expo (`@expo/vector-icons`).

## 3) Copiar as telas para o projeto Expo
No novo app criado, adicione uma pasta `src/mobile/pages` e copie o conteúdo de `src/mobile/pages` deste repositório para lá.

```
<seu-app-expo>/src/mobile/pages/
├─ CatalogScreen.jsx
├─ FavoritesScreen.jsx
├─ ForgotPasswordScreen.jsx
├─ HomeScreen.jsx
├─ LoginScreen.jsx
├─ MyVehiclesScreen.jsx
├─ ProfileScreen.jsx
├─ RegisterScreen.jsx
├─ ResetPasswordScreen.jsx
├─ VehicleCreateScreen.jsx
├─ common.js
└─ index.js
```

## 4) Registrar as telas no navegador de rotas
No `App.js` do projeto Expo, configure o `NavigationContainer` e registre as telas exportadas em `src/mobile/pages/index.js`:

```jsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HomeScreen,
  CatalogScreen,
  FavoritesScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  ProfileScreen,
  MyVehiclesScreen,
  VehicleCreateScreen,
} from "./src/mobile/pages";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="catalog" component={CatalogScreen} />
        <Stack.Screen name="favorites" component={FavoritesScreen} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
        <Stack.Screen name="forgot" component={ForgotPasswordScreen} />
        <Stack.Screen name="reset" component={ResetPasswordScreen} />
        <Stack.Screen name="profile" component={ProfileScreen} />
        <Stack.Screen name="myVehicles" component={MyVehiclesScreen} />
        <Stack.Screen name="vehicleCreate" component={VehicleCreateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 5) Rodar o app
```bash
npm start
```
Abra o app no Expo Go (ou emulador) escaneando o QR Code ou escolhendo o dispositivo desejado.

## 6) Integração com backend
As telas atualmente usam estados mockados. Se você possuir uma API, adicione chamadas HTTP (ex.: `fetch` ou `axios`) nas telas relevantes (login, cadastro, catálogo, etc.) apontando para o endpoint do backend. Centralize a URL base em um arquivo compartilhado (por exemplo, `src/services/api.js`) para facilitar a configuração por ambiente.

## Problemas comuns
- **Gestos travando**: certifique-se de importar `react-native-gesture-handler` no topo do `index.js`/`App.js` quando não usar Expo Go.
- **Erro de navegação**: verifique se o `NavigationContainer` envolve o `Stack.Navigator` e se os nomes das rotas batem com os usados nos botões (`navigation.navigate("catalog")`, etc.).
