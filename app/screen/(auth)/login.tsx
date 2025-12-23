import { CustomInput } from "@/components/common/CustomInput";
import { useAuth } from "@/context/auth";
import { router } from "expo-router";
import {
  KeyRound,
  LockKeyhole,
  Shield,
  Smartphone,
  User,
  UserCog,
  UserRound,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { login, isLoading, error, clearError, loginCodePin } = useAuth();
  const [activeTab, setActiveTab] = useState<"username" | "codeActeur">(
    "username"
  );
  const [fadeAnim] = useState(new Animated.Value(1)); // Changé de 0 à 1
  const [slideAnim] = useState(new Animated.Value(0));

  const screenWidth = Dimensions.get("window").width;

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    codeActeur: "",
    codePinPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    codeActeur: "",
    codePinPassword: "",
  });

  // Initialiser l'animation au montage
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateUsernameForm = () => {
    let valid = true;
    const newErrors = {
      username: "",
      password: "",
      codeActeur: "",
      codePinPassword: "",
    };

    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateCodePinForm = () => {
    let valid = true;
    const newErrors = {
      username: "",
      password: "",
      codeActeur: "",
      codePinPassword: "",
    };

    if (!formData.codeActeur.trim()) {
      newErrors.codeActeur = "Le code acteur est requis";
      valid = false;
    }

    if (!formData.codePinPassword) {
      newErrors.codePinPassword = "Le mot de passe est requis";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleTabChange = (tab: "username" | "codeActeur") => {
    // Animer la transition
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: tab === "username" ? 0 : 1,
        tension: 100,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveTab(tab);
      // Réanimer à 1 après le changement
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSubmit = async () => {
    if (activeTab === "username") {
      if (!validateUsernameForm()) return;
      try {
        await login(formData);
      } catch (error) {
        // L'erreur est déjà gérée dans le provider
      }
    } else {
      if (!validateCodePinForm()) return;
      try {
        await loginCodePin({
          codeActeur: formData.codeActeur,
          password: formData.codePinPassword,
        });
      } catch (error) {
        // L'erreur est déjà gérée dans le provider
      }
    }
  };

  const tabUnderlinePosition = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenWidth / 2],
  });

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-white to-orange-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className="flex-1 px-6 py-8">
            {/* Header avec logo centré */}
            <View className="items-center mb-10">
              <View className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-3xl shadow-2xl shadow-orange-100 border border-orange-100">
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={{ width: 160, height: 100 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-3xl font-bold mt-8 text-gray-900 text-center">
                Bienvenue sur Koumi 👋
              </Text>
              <Text className="text-gray-600 mt-3 text-center text-base">
                Connectez-vous pour accéder à votre compte
              </Text>
            </View>

            {/* Erreur globale */}
            {error && (
              <View className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 mb-6 shadow-sm">
                <View className="flex-row items-start">
                  <Shield size={20} color="#DC2626" className="mr-2 mt-0.5" />
                  <Text className="text-red-700 text-sm flex-1">{error}</Text>
                </View>
              </View>
            )}

            {/* Sélecteur de mode de connexion */}
            <View className="mb-8">
              <Text className="text-gray-700 font-semibold text-base mb-4">
                Choisissez votre mode de connexion
              </Text>

              <View className="relative bg-gray-100 rounded-2xl p-1">
                <Animated.View
                  className="absolute top-1 h-12 bg-white rounded-xl shadow-lg shadow-orange-200"
                  style={{
                    width: "50%",
                    transform: [{ translateX: tabUnderlinePosition }],
                  }}
                />

                <View className="flex-row">
                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center py-3 rounded-xl z-10"
                    onPress={() => handleTabChange("username")}
                  >
                    <UserRound
                      size={20}
                      color={activeTab === "username" ? "#EA580C" : "#6B7280"}
                      className="mr-2"
                    />
                    <Text
                      className={`font-semibold text-base ${
                        activeTab === "username"
                          ? "text-orange-600"
                          : "text-gray-500"
                      }`}
                    >
                      Utilisateur
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center py-3 rounded-xl z-10"
                    onPress={() => handleTabChange("codeActeur")}
                  >
                    <Smartphone
                      size={20}
                      color={activeTab === "codeActeur" ? "#EA580C" : "#6B7280"}
                      className="mr-2"
                    />
                    <Text
                      className={`font-semibold text-base ${
                        activeTab === "codeActeur"
                          ? "text-orange-600"
                          : "text-gray-500"
                      }`}
                    >
                      Code Acteur
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Formulaire dynamique - Retiré l'animation d'opacité pour éviter les problèmes */}
            <View>
              {activeTab === "username" ? (
                <View className="space-y-5">
                  <CustomInput
                    label="Nom d'utilisateur"
                    placeholder="Entrez votre nom d'utilisateur"
                    value={formData.username}
                    onChange={(value) => {
                      setFormData({ ...formData, username: value });
                      if (errors.username)
                        setErrors({ ...errors, username: "" });
                      clearError();
                    }}
                    error={errors.username}
                    type="text"
                    required
                    iconLeft={<User size={20} color="#9CA3AF" />}
                  />

                  <CustomInput
                    label="Mot de passe"
                    placeholder="Entrez votre mot de passe"
                    value={formData.password}
                    onChange={(value) => {
                      setFormData({ ...formData, password: value });
                      if (errors.password)
                        setErrors({ ...errors, password: "" });
                      clearError();
                    }}
                    error={errors.password}
                    type="password"
                    required
                    iconLeft={<LockKeyhole size={20} color="#9CA3AF" />}
                  />
                </View>
              ) : (
                <View className="space-y-5">
                  <CustomInput
                    label="Code Acteur"
                    placeholder="Entrez votre code acteur"
                    value={formData.codeActeur}
                    onChange={(value) => {
                      setFormData({ ...formData, codeActeur: value });
                      if (errors.codeActeur)
                        setErrors({ ...errors, codeActeur: "" });
                      clearError();
                    }}
                    error={errors.codeActeur}
                    type="text"
                    required
                    iconLeft={<UserCog size={20} color="#9CA3AF" />}
                  />

                  <CustomInput
                    label="Mot de passe"
                    placeholder="Entrez votre mot de passe"
                    value={formData.codePinPassword}
                    onChange={(value) => {
                      setFormData({ ...formData, codePinPassword: value });
                      if (errors.codePinPassword)
                        setErrors({ ...errors, codePinPassword: "" });
                      clearError();
                    }}
                    error={errors.codePinPassword}
                    type="password"
                    required
                    iconLeft={<KeyRound size={20} color="#9CA3AF" />}
                  />

                  <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-2">
                    <View className="flex-row items-start">
                      <Shield
                        size={18}
                        color="#3B82F6"
                        className="mr-2 mt-0.5"
                      />
                      <Text className="text-blue-800 text-sm flex-1">
                        Le code acteur est votre identifiant unique fourni par
                        l'administration.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Lien mot de passe oublié */}
            <TouchableOpacity
              className="self-end mb-6 mt-2"
              onPress={() => router.push("/screen/(auth)/forgot-password")}
            >
              <View className="flex-row items-center">
                <Text className="text-primary font-semibold text-base">
                  Mot de passe oublié ?
                </Text>
              </View>
            </TouchableOpacity>

            {/* Bouton de connexion */}
            <TouchableOpacity
              className={`rounded-2xl py-4 shadow-lg bg-yellow-500 ${
                isLoading
                  ? "bg-orange-400"
                  : "bg-gradient-to-r from-orange-500 to-yellow-500"
              }`}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <>
                    <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <Text className="text-white font-bold text-lg">
                      Connexion en cours...
                    </Text>
                  </>
                ) : (
                  <>
                    <Shield size={22} color="white" className="mr-2" />
                    <Text className="text-white font-bold text-lg">
                      Se connecter
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            {/* Divider avec effet */}
            <View className="my-10">
              <View className="relative">
                <View className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <View className="absolute inset-0 flex items-center justify-center">
                  <View className="bg-white px-4">
                    <Text className="text-gray-500 font-medium">Ou</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Lien vers l'inscription */}
            <View className="items-center">
              <Text className="text-gray-600 text-base">
                Vous n'avez pas de compte ?{" "}
                <TouchableOpacity
                  onPress={() => router.push("/screen/(auth)/register")}
                  activeOpacity={0.7}
                >
                  <Text className="text-primary font-bold text-base">
                    S'inscrire maintenant
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>

            {/* Info supplémentaire */}
            <View className="mt-10 p-4 bg-gray-50 rounded-2xl">
              <View className="flex-row items-center">
                <Shield size={18} color="#6B7280" className="mr-2" />
                <Text className="text-gray-600 text-sm">
                  Vos informations de connexion sont sécurisées et cryptées.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
