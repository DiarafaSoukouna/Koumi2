import { CustomInput } from "@/components/common/CustomInput";
import { router } from "expo-router";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Shield,
  Smartphone,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<"identify" | "code" | "reset" | "success">(
    "identify"
  );
  const [method, setMethod] = useState<"email" | "codeActeur">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    codeActeur: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    codeActeur: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Simulation d'envoi de code
  const handleSendCode = async () => {
    setError("");

    // Validation
    if (method === "email" && !formData.email.trim()) {
      setErrors({ ...errors, email: "L'email est requis" });
      return;
    }

    if (method === "codeActeur" && !formData.codeActeur.trim()) {
      setErrors({ ...errors, codeActeur: "Le code acteur est requis" });
      return;
    }

    setIsLoading(true);

    // Simulation d'appel API
    setTimeout(() => {
      setIsLoading(false);
      setStep("code");
      setSuccessMessage(
        method === "email"
          ? "Un code de réinitialisation a été envoyé à votre adresse email."
          : "Un code de réinitialisation a été envoyé à votre téléphone."
      );
    }, 1500);
  };

  const handleVerifyCode = async () => {
    setError("");

    if (!formData.resetCode.trim()) {
      setErrors({ ...errors, resetCode: "Le code est requis" });
      return;
    }

    if (formData.resetCode.length !== 6) {
      setErrors({ ...errors, resetCode: "Le code doit contenir 6 chiffres" });
      return;
    }

    setIsLoading(true);

    // Simulation de vérification
    setTimeout(() => {
      setIsLoading(false);
      setStep("reset");
      setSuccessMessage(
        "Code vérifié avec succès. Définissez votre nouveau mot de passe."
      );
    }, 1500);
  };

  const handleResetPassword = async () => {
    setError("");

    // Validation
    let valid = true;
    const newErrors = {
      email: "",
      codeActeur: "",
      resetCode: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!formData.newPassword) {
      newErrors.newPassword = "Le nouveau mot de passe est requis";
      valid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword =
        "Le mot de passe doit contenir au moins 6 caractères";
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
      valid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    setIsLoading(true);

    // Simulation de réinitialisation
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
      setSuccessMessage("Votre mot de passe a été réinitialisé avec succès.");
    }, 2000);
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-white to-orange-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className="flex-1 px-6 py-8">
            {/* Header avec bouton retour */}
            <TouchableOpacity
              onPress={handleBackToLogin}
              className="flex-row items-center mb-8"
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color="#374151" />
              <Text className="text-gray-700 ml-2 font-medium text-base">
                Retour
              </Text>
            </TouchableOpacity>

            {/* Logo et titre */}
            <View className="items-center mb-10">
              <View className="bg-gradient-to-br from-white to-orange-50 p-4 rounded-3xl shadow-xl shadow-orange-100 border border-orange-100">
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={{ width: 120, height: 75 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-3xl font-bold mt-8 text-gray-900 text-center">
                {step === "success" ? "Succès !" : "Mot de passe oublié"}
              </Text>
              <Text className="text-gray-600 mt-3 text-center text-base max-w-xs">
                {step === "identify" &&
                  "Identifiez-vous pour réinitialiser votre mot de passe"}
                {step === "code" && "Entrez le code de vérification"}
                {step === "reset" && "Définissez votre nouveau mot de passe"}
                {step === "success" &&
                  "Votre mot de passe a été réinitialisé avec succès"}
              </Text>
            </View>

            {/* Indicateur de progression */}
            {step !== "success" && (
              <View className="mb-8">
                <View className="flex-row justify-between items-center mb-4">
                  <View
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === "identify" ? "bg-orange-500" : "bg-green-500"
                    }`}
                  >
                    {step === "identify" ? (
                      <User size={16} color="white" />
                    ) : (
                      <CheckCircle2 size={16} color="white" />
                    )}
                  </View>
                  <View className="flex-1 h-1 mx-2 bg-gray-300">
                    <View
                      className={`h-full ${
                        step !== "identify" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  </View>
                  <View
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === "code" || step === "reset" || step === "success"
                        ? "bg-green-500"
                        : step === "identify"
                        ? "bg-orange-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {step === "identify" ? (
                      <Text className="text-white font-bold">2</Text>
                    ) : (
                      <CheckCircle2 size={16} color="white" />
                    )}
                  </View>
                  <View className="flex-1 h-1 mx-2 bg-gray-300">
                    <View
                      className={`h-full ${
                        step === "reset" || step === "success"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  </View>
                  <View
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === "reset" || step === "success"
                        ? step === "success"
                          ? "bg-green-500"
                          : "bg-orange-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {step === "success" ? (
                      <CheckCircle2 size={16} color="white" />
                    ) : (
                      <Text className="text-white font-bold">3</Text>
                    )}
                  </View>
                </View>
                <View className="flex-row justify-between px-1">
                  <Text className="text-xs text-gray-600">Identification</Text>
                  <Text className="text-xs text-gray-600">Vérification</Text>
                  <Text className="text-xs text-gray-600">
                    Nouveau mot de passe
                  </Text>
                </View>
              </View>
            )}

            {/* Messages d'erreur et succès */}
            {error && (
              <View className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 mb-6 shadow-sm">
                <View className="flex-row items-start">
                  <Shield size={20} color="#DC2626" className="mr-2 mt-0.5" />
                  <Text className="text-red-700 text-sm flex-1">{error}</Text>
                </View>
              </View>
            )}

            {successMessage && step !== "success" && (
              <View className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4 mb-6 shadow-sm">
                <View className="flex-row items-start">
                  <CheckCircle2
                    size={20}
                    color="#16A34A"
                    className="mr-2 mt-0.5"
                  />
                  <Text className="text-green-700 text-sm flex-1">
                    {successMessage}
                  </Text>
                </View>
              </View>
            )}

            {/* Étape 1: Identification */}
            {step === "identify" && (
              <View className="space-y-6">
                <View className="mb-4">
                  <Text className="text-gray-700 font-semibold text-base mb-4">
                    Comment souhaitez-vous réinitialiser votre mot de passe ?
                  </Text>

                  <View className="flex-row bg-gray-100 rounded-2xl p-1 mb-6">
                    <TouchableOpacity
                      className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${
                        method === "email" ? "bg-white shadow-lg" : ""
                      }`}
                      onPress={() => setMethod("email")}
                    >
                      <Mail
                        size={20}
                        color={method === "email" ? "#EA580C" : "#6B7280"}
                        className="mr-2"
                      />
                      <Text
                        className={`font-semibold text-base ${
                          method === "email"
                            ? "text-orange-600"
                            : "text-gray-500"
                        }`}
                      >
                        Par Email
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${
                        method === "codeActeur" ? "bg-white shadow-lg" : ""
                      }`}
                      onPress={() => setMethod("codeActeur")}
                    >
                      <Smartphone
                        size={20}
                        color={method === "codeActeur" ? "#EA580C" : "#6B7280"}
                        className="mr-2"
                      />
                      <Text
                        className={`font-semibold text-base ${
                          method === "codeActeur"
                            ? "text-orange-600"
                            : "text-gray-500"
                        }`}
                      >
                        Par Code Acteur
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {method === "email" ? (
                  <CustomInput
                    label="Adresse Email"
                    placeholder="Entrez votre adresse email"
                    value={formData.email}
                    onChange={(value) => {
                      setFormData({ ...formData, email: value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                      setError("");
                    }}
                    error={errors.email}
                    type="email"
                    required
                    iconLeft={<Mail size={20} color="#9CA3AF" />}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <CustomInput
                    label="Code Acteur"
                    placeholder="Entrez votre code acteur"
                    value={formData.codeActeur}
                    onChange={(value) => {
                      setFormData({ ...formData, codeActeur: value });
                      if (errors.codeActeur)
                        setErrors({ ...errors, codeActeur: "" });
                      setError("");
                    }}
                    error={errors.codeActeur}
                    type="text"
                    required
                    iconLeft={<User size={20} color="#9CA3AF" />}
                  />
                )}

                <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-2">
                  <View className="flex-row items-start">
                    <Shield size={18} color="#3B82F6" className="mr-2 mt-0.5" />
                    <Text className="text-blue-800 text-sm flex-1">
                      {method === "email"
                        ? "Un code de réinitialisation sera envoyé à votre adresse email."
                        : "Un code de réinitialisation sera envoyé au numéro associé à votre code acteur."}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  className={`rounded-2xl py-4 shadow-lg bg-yellow-500 ${
                    isLoading
                      ? "bg-orange-400"
                      : "bg-gradient-to-r from-orange-500 to-yellow-500"
                  }`}
                  onPress={handleSendCode}
                  disabled={isLoading}
                  activeOpacity={0.9}
                >
                  <Text className="text-white font-bold text-lg text-center">
                    {isLoading ? "Envoi en cours..." : "Envoyer le code"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Étape 2: Code de vérification */}
            {step === "code" && (
              <View className="space-y-6">
                <View className="items-center mb-2">
                  <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4">
                    <Mail size={40} color="#EA580C" />
                  </View>
                  <Text className="text-gray-700 text-center text-base mb-2">
                    Entrez le code à 6 chiffres envoyé à votre{" "}
                    {method === "email" ? "email" : "téléphone"}
                  </Text>
                  <Text className="text-orange-600 font-semibold">
                    {method === "email"
                      ? formData.email
                      : `Code acteur: ${formData.codeActeur}`}
                  </Text>
                </View>

                <CustomInput
                  label="Code de vérification"
                  placeholder="Entrez le code à 6 chiffres"
                  value={formData.resetCode}
                  onChange={(value) => {
                    // N'autoriser que les chiffres
                    const numericValue = value.replace(/[^0-9]/g, "");
                    setFormData({ ...formData, resetCode: numericValue });
                    if (errors.resetCode)
                      setErrors({ ...errors, resetCode: "" });
                    setError("");
                  }}
                  error={errors.resetCode}
                  type="text"
                  required
                  iconLeft={<Shield size={20} color="#9CA3AF" />}
                  keyboardType="number-pad"
                  maxLength={6}
                />

                <View className="flex-row justify-center items-center mt-2">
                  <Text className="text-gray-600 text-sm">
                    Vous n'avez pas reçu le code ?{" "}
                  </Text>
                  <TouchableOpacity onPress={handleSendCode}>
                    <Text className="text-primary font-semibold text-sm">
                      Renvoyer
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row space-x-4 gap-2">
                  <TouchableOpacity
                    className="flex-1 rounded-2xl py-4 border-2 border-gray-300"
                    onPress={() => setStep("identify")}
                    disabled={isLoading}
                    activeOpacity={0.7}
                  >
                    <Text className="text-gray-700 font-semibold text-center">
                      Retour
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`flex-1 rounded-2xl py-4 shadow-lg bg-yellow-500 ${
                      isLoading
                        ? "bg-orange-400"
                        : "bg-gradient-to-r from-orange-500 to-yellow-500"
                    }`}
                    onPress={handleVerifyCode}
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    <Text className="text-white font-bold text-lg text-center">
                      {isLoading ? "Vérification..." : "Vérifier"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Étape 3: Réinitialisation du mot de passe */}
            {step === "reset" && (
              <View className="space-y-6">
                <CustomInput
                  label="Nouveau mot de passe"
                  placeholder="Entrez votre nouveau mot de passe"
                  value={formData.newPassword}
                  onChange={(value) => {
                    setFormData({ ...formData, newPassword: value });
                    if (errors.newPassword)
                      setErrors({ ...errors, newPassword: "" });
                    setError("");
                  }}
                  error={errors.newPassword}
                  type="password"
                  required
                  iconLeft={<Shield size={20} color="#9CA3AF" />}
                />

                <CustomInput
                  label="Confirmer le mot de passe"
                  placeholder="Confirmez votre nouveau mot de passe"
                  value={formData.confirmPassword}
                  onChange={(value) => {
                    setFormData({ ...formData, confirmPassword: value });
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: "" });
                    setError("");
                  }}
                  error={errors.confirmPassword}
                  type="password"
                  required
                  iconLeft={<Shield size={20} color="#9CA3AF" />}
                />

                <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-2">
                  <Text className="text-yellow-800 text-sm">
                    • Le mot de passe doit contenir au moins 6 caractères
                  </Text>
                </View>

                <View className="flex-row space-x-4 gap-2">
                  <TouchableOpacity
                    className="flex-1 rounded-2xl py-4 border-2 border-gray-300"
                    onPress={() => setStep("code")}
                    disabled={isLoading}
                    activeOpacity={0.7}
                  >
                    <Text className="text-gray-700 font-semibold text-center">
                      Retour
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`flex-1 rounded-2xl py-4 shadow-lg bg-yellow-500 ${
                      isLoading
                        ? "bg-orange-400"
                        : "bg-gradient-to-r from-orange-500 to-yellow-500"
                    }`}
                    onPress={handleResetPassword}
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    <Text className="text-white font-bold text-lg text-center">
                      {isLoading ? "Réinitialisation..." : "Réinitialiser"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Étape 4: Succès */}
            {step === "success" && (
              <View className="items-center space-y-8">
                <View className="w-32 h-32 bg-green-100 rounded-full items-center justify-center">
                  <CheckCircle2 size={64} color="#16A34A" />
                </View>

                <View className="items-center">
                  <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Mot de passe réinitialisé !
                  </Text>
                  <Text className="text-gray-600 text-center text-base">
                    Vous pouvez maintenant vous connecter avec votre nouveau mot
                    de passe.
                  </Text>
                </View>

                <View className="w-full space-y-4">
                  <TouchableOpacity
                    className="rounded-2xl py-4 bg-gradient-to-r from-orange-500 to-yellow-500 shadow-lg bg-yellow-500 m-2"
                    onPress={handleBackToLogin}
                    activeOpacity={0.9}
                  >
                    <Text className="text-white font-bold text-lg text-center">
                      Se connecter
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="rounded-2xl py-4 border-2 border-gray-300"
                    onPress={() => router.push("/screen/(auth)/register")}
                    activeOpacity={0.7}
                  >
                    <Text className="text-gray-700 font-semibold text-center">
                      Créer un nouveau compte
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Footer informations */}
            <View className="mt-10 p-4 bg-gray-50 rounded-2xl">
              <View className="flex-row items-center">
                <Shield size={18} color="#6B7280" className="mr-2" />
                <Text className="text-gray-600 text-sm">
                  La réinitialisation de mot de passe est sécurisée et cryptée.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
