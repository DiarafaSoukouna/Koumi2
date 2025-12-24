import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  CheckCircle,
  ChevronRight,
  Eye,
  Lock,
  LogIn,
  Package,
  Shield,
  Sparkles,
  Star,
  Store,
  Truck,
  UserPlus,
} from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function WelcomeChoiceScreen() {
  const handleLogin = () => {
    router.push("/screen/(auth)/login");
  };

  const handleExplore = async () => {
    try {
      await AsyncStorage.setItem("hasLaunchedBefore", "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving launch status:", error);
      router.replace("/(tabs)");
    }
  };

  const handleRegister = () => {
    router.push("/screen/(auth)/register");
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-white via-yellow-50 to-white">
      <ScrollView>
        {/* Fond décoratif */}
        <View className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-yellow-400/10 to-transparent" />

        <View className="flex-1 px-6 py-8">
          {/* Logo et en-tête */}
          <View className="items-center mb-10">
            <View className="relative mb-8">
              <View className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-[40px] blur-xl" />
              <View className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-3xl shadow-2xl shadow-yellow-200 border border-yellow-100">
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={{ width: 120, height: 75 }}
                  resizeMode="contain"
                />
              </View>
              <View className="absolute -top-2 -right-2 bg-yellow-500 w-10 h-10 rounded-full items-center justify-center shadow-lg shadow-yellow-400">
                <Sparkles size={20} color="white" />
              </View>
            </View>

            <Text className="text-4xl font-bold text-gray-900 text-center mb-4">
              Bienvenue sur{" "}
              <Text className="text-transparent bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text">
                Koumi
              </Text>
            </Text>

            <View className="flex-row items-center bg-gradient-to-r from-yellow-100 to-amber-100 px-6 py-3 rounded-full mb-6 border border-yellow-200">
              <View className="flex-row items-center">
                <Star size={18} color="#D97706" fill="#D97706" />
                <Text className="text-amber-800 font-bold ml-2 text-lg">
                  L'écosystème agricole 4.0
                </Text>
              </View>
            </View>

            <Text className="text-gray-600 text-center text-base max-w-sm">
              La plateforme qui connecte toute la chaîne de valeur agricole au
              Cameroun
            </Text>
          </View>

          {/* Statistiques */}
          <View className="flex-row justify-between mb-10 px-2">
            {[
              {
                icon: Store,
                value: "500+",
                label: "Boutiques",
                color: "#F59E0B",
              },
              {
                icon: Package,
                value: "10K+",
                label: "Produits",
                color: "#D97706",
              },
              {
                icon: Truck,
                value: "200+",
                label: "Transporteurs",
                color: "#B45309",
              },
            ].map((stat, index) => (
              <View key={index} className="items-center flex-1">
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center mb-3"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon size={24} color={stat.color} />
                </View>
                <Text className="text-xl font-bold text-gray-900">
                  {stat.value}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Section principale des choix */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-6 text-center">
              Choisissez votre parcours
            </Text>

            {/* Option 1: Se connecter - Bouton principal */}
            <TouchableOpacity
              onPress={handleLogin}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl p-5 mb-5 shadow-lg shadow-yellow-500/30 active:opacity-90 bg-yellow-500"
              activeOpacity={0.85}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-white/20 p-3 rounded-xl">
                    <LogIn size={24} color="white" />
                  </View>
                  <View className="ml-4">
                    <Text className="font-bold text-xl text-white">
                      Se connecter
                    </Text>
                    <Text className="text-white/90 text-sm mt-1">
                      Accéder à votre compte
                    </Text>
                  </View>
                </View>
                <View className="bg-white/20 p-2 rounded-lg">
                  <ChevronRight size={20} color="white" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Option 2: Créer un compte - Bouton secondaire */}
            <TouchableOpacity
              onPress={handleRegister}
              className="bg-white rounded-2xl p-5 mb-5 shadow-lg shadow-gray-200 border-2 border-yellow-100 active:opacity-90"
              activeOpacity={0.85}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-yellow-100 p-3 rounded-xl">
                    <UserPlus size={24} color="#D97706" />
                  </View>
                  <View className="ml-4">
                    <Text className="font-bold text-xl text-gray-900">
                      Créer un compte
                    </Text>
                    <Text className="text-gray-600 text-sm mt-1">
                      Rejoindre la communauté
                    </Text>
                  </View>
                </View>
                <View className="bg-yellow-50 p-2 rounded-lg">
                  <ChevronRight size={20} color="#D97706" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Option 3: Explorer - Bouton léger */}
            <TouchableOpacity
              onPress={handleExplore}
              className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 active:opacity-90"
              activeOpacity={0.85}
            >
              <View className="flex-row items-center justify-center">
                <View className="flex-row items-center">
                  <Eye size={20} color="#6B7280" className="mr-3" />
                  <View>
                    <Text className="font-bold text-lg text-gray-700">
                      Explorer sans compte
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      Découvrir les fonctionnalités
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Ligne de séparation */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-gray-400 text-sm">Ou</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Accès rapide */}
            <View className="bg-gradient-to-r from-yellow-50/50 to-amber-50/50 rounded-2xl p-5 border border-yellow-100">
              <Text className="font-bold text-gray-800 mb-3 text-center">
                Accès rapide
              </Text>
              <View className="flex-row justify-between">
                <View className="items-center flex-1">
                  <View className="w-12 h-12 bg-amber-100 rounded-xl items-center justify-center mb-2">
                    <Store size={20} color="#D97706" />
                  </View>
                  <Text className="text-gray-700 text-xs text-center">
                    Marchés
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <View className="w-12 h-12 bg-yellow-100 rounded-xl items-center justify-center mb-2">
                    <Package size={20} color="#D97706" />
                  </View>
                  <Text className="text-gray-700 text-xs text-center">
                    Produits
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <View className="w-12 h-12 bg-amber-100 rounded-xl items-center justify-center mb-2">
                    <Truck size={20} color="#D97706" />
                  </View>
                  <Text className="text-gray-700 text-xs text-center">
                    Livraison
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Garanties de sécurité */}
          <View className="bg-gradient-to-r from-yellow-50/80 to-amber-50/80 rounded-2xl p-5 border border-yellow-100 mb-8">
            <View className="flex-row items-start mb-3">
              <View className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-sm">
                <Shield size={20} color="white" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-bold text-base text-gray-900 mb-1">
                  Sécurité garantie
                </Text>
                <Text className="text-gray-700 text-sm">
                  Transactions cryptées et données protégées
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between px-2">
              {[
                { icon: Lock, text: "Paiements", color: "#10B981" },
                {
                  icon: CheckCircle,
                  text: "Confidentialité",
                  color: "#10B981",
                },
                { icon: Shield, text: "Support", color: "#10B981" },
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-center">
                  <item.icon size={14} color={item.color} />
                  <Text className="text-gray-700 ml-2 text-xs">
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View className="items-center mt-6">
            <Text className="text-gray-500 text-center text-xs mb-4">
              En utilisant Koumi, vous acceptez nos{" "}
              <Text className="text-yellow-600 font-semibold">Conditions</Text>{" "}
              et notre{" "}
              <Text className="text-yellow-600 font-semibold">
                Politique de confidentialité
              </Text>
            </Text>
            <View className="flex-row items-center">
              <View className="w-1.5 h-1.5 bg-yellow-500 rounded-full mx-1" />
              <View className="w-1.5 h-1.5 bg-amber-500 rounded-full mx-1" />
              <View className="w-1.5 h-1.5 bg-orange-500 rounded-full mx-1" />
              <Text className="text-gray-400 text-xs ml-2">
                © 2024 Koumi - Tous droits réservés
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   Dimensions,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { router } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   LogIn,
//   Home,
//   Shield,
//   UserPlus,
//   Sparkles,
//   ArrowRight,
//   Store,
//   Truck,
//   Package,
// } from "lucide-react-native";

// const { width, height } = Dimensions.get("window");

// export default function WelcomeChoiceScreen() {
//   const handleLogin = () => {
//     router.push("/login");
//   };

//   const handleExplore = async () => {
//     try {
//       // Optionnel: marquer que l'utilisateur a choisi d'explorer
//       await AsyncStorage.setItem("userChoice", "explore");
//       router.replace("/(tabs)");
//     } catch (error) {
//       console.error('Error saving user choice:', error);
//       router.replace("/(tabs)");
//     }
//   };

//   const handleRegister = () => {
//     router.push("/register");
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gradient-to-b from-yellow-50 to-white">
//       <View className="flex-1 px-6 py-8">
//         {/* Logo et en-tête */}
//         <View className="items-center mb-12">
//           <View className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-3xl shadow-2xl shadow-yellow-100 border border-yellow-100 mb-8">
//             <Image
//               source={require("@/assets/images/logo.png")}
//               style={{ width: 120, height: 75 }}
//               resizeMode="contain"
//             />
//           </View>

//           <Text className="text-4xl font-bold text-gray-900 text-center mb-4">
//             Bienvenue sur{" "}
//             <Text className="text-yellow-600">Koumi</Text>
//           </Text>

//           <Text className="text-gray-600 text-center text-lg max-w-sm">
//             La plateforme qui connecte toute la chaîne de valeur agricole
//           </Text>
//         </View>

//         {/* Carte de choix principale */}
//         <View className="bg-white rounded-3xl p-6 shadow-xl shadow-yellow-100 border border-yellow-100 mb-6">
//           <Text className="text-xl font-bold text-gray-900 mb-6 text-center">
//             Comment souhaitez-vous continuer ?
//           </Text>

//           {/* Option 1: Se connecter */}
//           <TouchableOpacity
//             onPress={handleLogin}
//             className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-5 mb-4"
//             activeOpacity={0.8}
//           >
//             <View className="flex-row items-center">
//               <View className="bg-yellow-500 p-3 rounded-xl mr-4">
//                 <LogIn size={24} color="white" />
//               </View>
//               <View className="flex-1">
//                 <Text className="font-bold text-lg text-gray-900 mb-1">
//                   Se connecter
//                 </Text>
//                 <Text className="text-gray-600 text-sm">
//                   Accédez à votre compte existant
//                 </Text>
//               </View>
//               <ArrowRight size={20} color="#9CA3AF" />
//             </View>
//           </TouchableOpacity>

//           {/* Option 2: Explorer */}
//           <TouchableOpacity
//             onPress={handleExplore}
//             className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-5 mb-6"
//             activeOpacity={0.8}
//           >
//             <View className="flex-row items-center">
//               <View className="bg-gray-800 p-3 rounded-xl mr-4">
//                 <Home size={24} color="white" />
//               </View>
//               <View className="flex-1">
//                 <Text className="font-bold text-lg text-gray-900 mb-1">
//                   Explorer l'application
//                 </Text>
//                 <Text className="text-gray-600 text-sm">
//                   Découvrez les fonctionnalités sans connexion
//                 </Text>
//               </View>
//               <ArrowRight size={20} color="#9CA3AF" />
//             </View>
//           </TouchableOpacity>

//           {/* Option 3: S'inscrire */}
//           <TouchableOpacity
//             onPress={handleRegister}
//             className="border-2 border-yellow-500 rounded-2xl p-5"
//             activeOpacity={0.8}
//           >
//             <View className="flex-row items-center justify-center">
//               <UserPlus size={22} color="#D97706" className="mr-2" />
//               <Text className="text-yellow-600 font-bold text-lg">
//                 Créer un compte
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }
