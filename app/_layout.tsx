// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
// import * as NavigationBar from "expo-navigation-bar";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { useEffect, useState } from "react";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import "react-native-reanimated";

// import AuthProvider from "@/context/auth/authProvider";
// import { HomeProvider } from "@/context/HomeContext";
// import { IntrantProvider } from "@/context/Intrant";
// import { MerchantProvider } from "@/context/Merchant";
// import { TransporteurProvider } from "@/context/Transporteur";
// import { useColorScheme } from "@/hooks/use-color-scheme";
// import "./global.css";

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [isAppReady, setIsAppReady] = useState(false);
//   const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

//   useEffect(() => {
//     NavigationBar.setBackgroundColorAsync("#000000");
//     NavigationBar.setButtonStyleAsync("light");

//     checkFirstLaunch();
//   }, []);

//   const checkFirstLaunch = async () => {
//     try {
//       const hasLaunched = await AsyncStorage.getItem("hasLaunchedBefore");
//       setIsFirstLaunch(hasLaunched !== "true");
//       setIsAppReady(true);
//     } catch (error) {
//       console.error("Error checking first launch:", error);
//       setIsFirstLaunch(true);
//       setIsAppReady(true);
//     }
//   };

//   if (!isAppReady) {
//     // Vous pouvez retourner un splash screen ici
//     return null;
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <AuthProvider>
//         <IntrantProvider>
//           <TransporteurProvider>
//             <HomeProvider>
//               <MerchantProvider>
//                 <ThemeProvider value={DefaultTheme}>
//                   <Stack
//                     screenOptions={{
//                       headerShown: false,
//                     }}
//                   >
//                     {isFirstLaunch ? (
//                       // Flow premier lancement
//                       <>
//                         <Stack.Screen
//                           name="onboarding"
//                           options={{ headerShown: false }}
//                         />
//                         <Stack.Screen
//                           name="welcome-choice"
//                           options={{ headerShown: false }}
//                         />
//                       </>
//                     ) : (
//                       // Flow normal après onboarding
//                       <>
//                         <Stack.Screen
//                           name="login/index"
//                           options={{ headerShown: false }}
//                         />
//                         <Stack.Screen
//                           name="(tabs)"
//                           options={{ headerShown: false }}
//                         />
//                         <Stack.Screen
//                           name="modal"
//                           options={{ presentation: "modal", title: "Modal" }}
//                         />
//                       </>
//                     )}
//                   </Stack>

//                   <StatusBar style="auto" />
//                 </ThemeProvider>
//               </MerchantProvider>
//             </HomeProvider>
//           </TransporteurProvider>
//         </IntrantProvider>
//       </AuthProvider>
//     </GestureHandlerRootView>
//   );
// }
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import AuthProvider from "@/context/auth/authProvider";
import { HomeProvider } from "@/context/HomeContext";
import { IntrantProvider } from "@/context/Intrant";
import { MerchantProvider } from "@/context/Merchant";
import { TransporteurProvider } from "@/context/Transporteur";
import { useColorScheme } from "@/hooks/use-color-scheme";
import "./global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAppReady, setIsAppReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<
    "onboarding" | "welcome-choice" | "login" | "tabs" | null
  >(null);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("#000000");
    NavigationBar.setButtonStyleAsync("light");

    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Vérifier si c'est le premier lancement
      const hasLaunched = await AsyncStorage.getItem("hasLaunchedBefore");

      // Vérifier si l'utilisateur est déjà connecté
      const userToken = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");

      if (hasLaunched !== "true") {
        // Premier lancement : toujours afficher l'onboarding
        setInitialRoute("onboarding");
      } else if (userToken && userData) {
        // Déjà lancé et connecté : aller directement aux tabs
        setInitialRoute("tabs");
      } else {
        // Déjà lancé mais non connecté : aller à la page de connexion
        setInitialRoute("login");
      }
    } catch (error) {
      console.error("Error initializing app:", error);
      // En cas d'erreur, montrer l'onboarding par défaut
      setInitialRoute("onboarding");
    } finally {
      setIsAppReady(true);
    }
  };

  if (!isAppReady || initialRoute === null) {
    // Écran de chargement ou splash screen
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <IntrantProvider>
          <TransporteurProvider>
            <HomeProvider>
              <MerchantProvider>
                <ThemeProvider value={DefaultTheme}>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                    }}
                  >
                    {/* Configuration des écrans de navigation */}
                    <Stack.Screen
                      name="onboarding"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="welcome-choice"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="login/index"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="modal"
                      options={{ presentation: "modal", title: "Modal" }}
                    />
                  </Stack>

                  {/* Composant pour gérer la navigation initiale */}
                  <InitialNavigation initialRoute={initialRoute} />

                  <StatusBar style="auto" />
                </ThemeProvider>
              </MerchantProvider>
            </HomeProvider>
          </TransporteurProvider>
        </IntrantProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// Composant pour gérer la navigation initiale
import { useAuth } from "@/context/auth";
import { useRouter } from "expo-router";

function InitialNavigation({ initialRoute }: { initialRoute: string }) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger vers les tabs
    if (user && initialRoute !== "tabs") {
      router.replace("/(tabs)");
      return;
    }

    // Gérer la navigation initiale
    switch (initialRoute) {
      case "onboarding":
        router.replace("/onboarding");
        break;
      case "welcome-choice":
        router.replace("/welcome-choice");
        break;
      case "login":
        router.replace("/screen/(auth)/login");
        break;
      case "tabs":
        router.replace("/(tabs)");
        break;
      default:
        router.replace("/onboarding");
    }
  }, [initialRoute, user]);

  return null;
}
