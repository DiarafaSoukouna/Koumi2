import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  ArrowRight,
  CreditCard,
  Leaf,
  Sparkles,
  Star,
  Users,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "Bienvenue sur Koumi",
    description:
      "La plateforme agricole qui révolutionne votre façon de faire des affaires au Cameroun",
    icon: Leaf,
    color: "#EAB308",
    gradient: ["#FEF3C7", "#FDE68A"],
    emoji: "🌱",
  },
  {
    id: 2,
    title: "Marché Digital Agricole",
    description:
      "Connectez-vous avec des centaines de fournisseurs, agriculteurs et transporteurs en temps réel",
    icon: Users,
    color: "#D97706",
    gradient: ["#FEF3C7", "#FCD34D"],
    emoji: "📱",
  },
  {
    id: 3,
    title: "Transactions Sécurisées",
    description:
      "Paiements 100% sécurisés avec suivi en temps réel de toutes vos transactions",
    icon: CreditCard,
    color: "#B45309",
    gradient: ["#FDE68A", "#FBBF24"],
    emoji: "💳",
  },
  {
    id: 4,
    title: "Prêt à Démarrer ?",
    description:
      "Rejoignez notre communauté de plus de 10,000 acteurs agricoles",
    icon: Star,
    color: "#92400E",
    gradient: ["#FBBF24", "#F59E0B"],
    emoji: "✨",
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: width * nextSlide,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem("hasLaunchedBefore", "true");
      router.push("/welcome-choice");
    } catch (error) {
      console.error("Error saving launch status:", error);
    }
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem("hasLaunchedBefore", "true");
      router.push("/welcome-choice");
    } catch (error) {
      console.error("Error saving launch status:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-yellow-50 to-white">
      {/* Header avec logo */}
      <View className="px-6 pt-8 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="bg-gradient-to-br from-yellow-400 to-amber-500 p-2 rounded-2xl shadow-lg shadow-yellow-200">
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-2xl font-bold text-gray-900 ml-3">Koumi</Text>
        </View>

        <TouchableOpacity
          onPress={handleSkip}
          className="bg-white/80 px-4 py-2 rounded-full border border-yellow-200"
          activeOpacity={0.7}
        >
          <Text className="text-gray-700 font-medium">Passer</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <View className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setCurrentSlide(slideIndex);
          }}
        >
          {slides.map((slide, index) => (
            <View key={slide.id} style={{ width }} className="px-8">
              {/* Illustration */}
              <View className="items-center justify-center mt-12 mb-12">
                <View
                  className="w-72 h-72 rounded-[40px] items-center justify-center mb-8"
                  style={{
                    backgroundColor: `${slide.color}15`,
                    transform: [{ rotate: "45deg" }],
                  }}
                >
                  <View
                    className="w-64 h-64 rounded-[32px] items-center justify-center"
                    style={{ backgroundColor: `${slide.color}25` }}
                  >
                    <View
                      className="w-56 h-56 rounded-3xl items-center justify-center"
                      style={{
                        backgroundColor: `${slide.color}35`,
                        transform: [{ rotate: "-45deg" }],
                      }}
                    >
                      <View className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-[40px] items-center justify-center shadow-2xl shadow-yellow-300">
                        <Text style={{ fontSize: 96 }} className="text-10xl">
                          {slide.emoji}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Contenu */}
              <View className="items-center">
                <View className="flex-row items-center mb-6">
                  <View className="bg-yellow-500 p-3 rounded-xl shadow-md shadow-yellow-300">
                    <slide.icon size={28} color="white" />
                  </View>
                  <Text className="text-2xl font-bold text-gray-900 ml-4 max-w-[70%]">
                    {slide.title}
                  </Text>
                </View>

                <Text className="text-gray-600 text-lg text-center leading-7">
                  {slide.description}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Indicateurs de progression */}
        <View className="flex-row justify-center items-center mb-8">
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1.2, 0.8],
              extrapolate: "clamp",
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={index}
                style={{
                  transform: [{ scale }],
                  opacity,
                }}
                className="w-3 h-3 rounded-full bg-yellow-500 mx-2"
              />
            );
          })}
        </View>

        {/* Bouton principal */}
        <View className="px-8 pb-12">
          <TouchableOpacity
            onPress={handleNext}
            className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl py-5 shadow-2xl shadow-yellow-300 bg-yellow-500 "
            activeOpacity={0.9}
            style={{
              transform: [
                { scale: currentSlide === slides.length - 1 ? 1.02 : 1 },
              ],
            }}
          >
            <View className="flex-row items-center justify-center">
              {currentSlide === slides.length - 1 ? (
                <>
                  <Text className="text-white font-bold text-xl mr-3">
                    Commencer l'aventure
                  </Text>
                  <Sparkles size={24} color="white" />
                </>
              ) : (
                <>
                  <Text className="text-white font-bold text-xl mr-3">
                    Suivant
                  </Text>
                  <ArrowRight size={24} color="white" />
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Progression */}
          <View className="flex-row items-center justify-between mt-8">
            <Text className="text-gray-500 font-medium">
              {currentSlide + 1}/{slides.length}
            </Text>
            <View className="flex-row items-center">
              <View className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <Animated.View
                  className="h-full bg-yellow-500 rounded-full"
                  style={{
                    width: scrollX.interpolate({
                      inputRange: [0, width * (slides.length - 1)],
                      outputRange: ["25%", "100%"],
                      extrapolate: "clamp",
                    }),
                  }}
                />
              </View>
              <Text className="text-yellow-600 font-bold ml-3">
                {Math.round(((currentSlide + 1) / slides.length) * 100)}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   Dimensions,
//   ScrollView,
//   Animated,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { router } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   ArrowRight,
//   Check,
//   Sparkles,
//   Leaf,
//   Users,
//   CreditCard,
// } from "lucide-react-native";

// const { width } = Dimensions.get("window");

// const slides = [
//   {
//     id: 1,
//     title: "Bienvenue sur Koumi",
//     description: "La plateforme agricole qui révolutionne votre façon de faire des affaires",
//     emoji: "🌱",
//   },
//   {
//     id: 2,
//     title: "Marché Digital Agricole",
//     description: "Connectez-vous avec des centaines d'acteurs agricoles",
//     emoji: "📱",
//   },
//   {
//     id: 3,
//     title: "Transactions Sécurisées",
//     description: "Paiements 100% sécurisés avec suivi en temps réel",
//     emoji: "💳",
//   },
// ];

// export default function OnboardingScreen() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const scrollViewRef = useRef<ScrollView>(null);

//   const handleNext = async () => {
//     if (currentSlide < slides.length - 1) {
//       const nextSlide = currentSlide + 1;
//       setCurrentSlide(nextSlide);
//       scrollViewRef.current?.scrollTo({
//         x: width * nextSlide,
//         animated: true,
//       });
//     } else {
//       // Marquer l'onboarding comme terminé
//       await AsyncStorage.setItem("hasLaunchedBefore", "true");
//       router.replace("/welcome-choice");
//     }
//   };

//   const handleSkip = async () => {
//     // Marquer l'onboarding comme terminé
//     await AsyncStorage.setItem("hasLaunchedBefore", "true");
//     router.replace("/welcome-choice");
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gradient-to-b from-yellow-50 to-white">
//       {/* Header avec bouton skip */}
//       <View className="px-6 pt-8 flex-row justify-between items-center">
//         <View className="flex-row items-center">
//           <View className="bg-gradient-to-br from-yellow-400 to-amber-500 p-2 rounded-2xl shadow-lg shadow-yellow-200">
//             <Image
//               source={require("@/assets/images/logo.png")}
//               style={{ width: 40, height: 40 }}
//               resizeMode="contain"
//             />
//           </View>
//           <Text className="text-2xl font-bold text-gray-900 ml-3">Koumi</Text>
//         </View>

//         <TouchableOpacity
//           onPress={handleSkip}
//           className="bg-white/80 px-4 py-2 rounded-full border border-yellow-200"
//           activeOpacity={0.7}
//         >
//           <Text className="text-gray-700 font-medium">Passer</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Carousel */}
//       <ScrollView
//         ref={scrollViewRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: false }
//         )}
//         scrollEventThrottle={16}
//         onMomentumScrollEnd={(event) => {
//           const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
//           setCurrentSlide(slideIndex);
//         }}
//       >
//         {slides.map((slide, index) => (
//           <View key={slide.id} style={{ width }} className="px-8">
//             {/* Illustration */}
//             <View className="items-center justify-center mt-12 mb-12">
//               <View className="w-72 h-72 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-[40px] items-center justify-center shadow-2xl shadow-yellow-300">
//                 <Text className="text-6xl">{slide.emoji}</Text>
//               </View>
//             </View>

//             {/* Contenu */}
//             <View className="items-center">
//               <Text className="text-4xl font-bold text-gray-900 mb-6 text-center">
//                 {slide.title}
//               </Text>

//               <Text className="text-gray-600 text-lg text-center leading-7">
//                 {slide.description}
//               </Text>
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Bouton principal */}
//       <View className="px-8 pb-12">
//         <TouchableOpacity
//           onPress={handleNext}
//           className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl py-5 shadow-2xl shadow-yellow-300"
//           activeOpacity={0.9}
//         >
//           <View className="flex-row items-center justify-center">
//             {currentSlide === slides.length - 1 ? (
//               <>
//                 <Text className="text-white font-bold text-xl mr-3">
//                   Commencer
//                 </Text>
//                 <Sparkles size={24} color="white" />
//               </>
//             ) : (
//               <>
//                 <Text className="text-white font-bold text-xl mr-3">
//                   Suivant
//                 </Text>
//                 <ArrowRight size={24} color="white" />
//               </>
//             )}
//           </View>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }
