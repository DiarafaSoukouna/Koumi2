// import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
// import * as NavigationBar from "expo-navigation-bar";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { useEffect } from "react";
// import "react-native-reanimated";

// import { useColorScheme } from "@/hooks/use-color-scheme";
// import "./global.css";
// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   useEffect(() => {
//     NavigationBar.setBackgroundColorAsync("#000000");
//     NavigationBar.setButtonStyleAsync("light");
//   }, []);
//   return (
//     <ThemeProvider value={DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="login/index" options={{ headerShown: false }} />
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="profil/index" options={{ headerShown: false }} />

//         <Stack.Screen
//           name="modal"
//           options={{ presentation: "modal", title: "Modal" }}
//         />
//       </Stack>

//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }

import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { IntrantProvider } from "@/context/Intrant";
import { MerchantProvider } from "@/context/Merchant";
import { TransporteurProvider } from "@/context/Transporteur";
import { useColorScheme } from "@/hooks/use-color-scheme";
import "./global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#000000");
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <IntrantProvider>
        <TransporteurProvider>
          <MerchantProvider>
            <ThemeProvider value={DefaultTheme}>
              <Stack>
                <Stack.Screen
                  name="login/index"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal", title: "Modal" }}
                />
              </Stack>

              <StatusBar style="auto" />
            </ThemeProvider>
          </MerchantProvider>
        </TransporteurProvider>
      </IntrantProvider>
    </GestureHandlerRootView>
  );
}
