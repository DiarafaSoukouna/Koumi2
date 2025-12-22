import { CustomInput } from "@/components/common/CustomInput";
import { useAuth } from "@/context/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await login(formData);
    } catch (error) {
      // L'erreur est déjà gérée dans le provider
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 py-8">
          {/* Header avec logo centré */}
          <View className="items-center mb-8">
            <View className="bg-white p-4 rounded-3xl shadow-lg shadow-orange-200">
              <Image
                source={require("@/assets/images/logo.png")}
                style={{ width: 140, height: 88 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-2xl font-bold mt-6 text-gray-800 text-center">
              Bienvenue sur Koumi 👋
            </Text>
            <Text className="text-gray-500 mt-2 text-center">
              Connectez-vous pour accéder à votre compte
            </Text>
          </View>

          {/* Erreur globale */}
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <Text className="text-red-600 text-center">{error}</Text>
            </View>
          )}

          {/* Formulaire */}
          <View className="space-y-4">
            <CustomInput
              label="Nom d'utilisateur"
              placeholder="Entrez votre nom d'utilisateur"
              value={formData.username}
              onChange={(value) => {
                setFormData({ ...formData, username: value });
                if (errors.username) setErrors({ ...errors, username: "" });
                clearError();
              }}
              error={errors.username}
              type="text"
              required
            />

            <CustomInput
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              value={formData.password}
              onChange={(value) => {
                setFormData({ ...formData, password: value });
                if (errors.password) setErrors({ ...errors, password: "" });
                clearError();
              }}
              error={errors.password}
              type="password"
              required
            />

            {/* Lien mot de passe oublié */}
            <TouchableOpacity className="self-end mb-4">
              <Text className="text-primary font-medium">
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            {/* Bouton de connexion */}
            <TouchableOpacity
              className={`rounded-xl py-4 ${
                isLoading ? "bg-yellow-500" : "bg-yellow-500"
              }`}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text className="text-black font-semibold text-center text-lg">
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">Ou</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Lien vers l'inscription */}
          <View className="items-center mt-4">
            <Text className="text-gray-600">
              Vous n'avez pas de compte ?{" "}
              <TouchableOpacity
                onPress={() => router.push("/screen/(auth)/register")}
              >
                <Text className="text-primary font-semibold">S'inscrire</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
