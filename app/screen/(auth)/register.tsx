// app/(auth)/register.tsx
import { CustomInput } from "@/components/common/CustomInput";
import { CustomMultiSelect } from "@/components/common/CustomMultiSelect";
import { CustomSelect } from "@/components/common/CustomSelect";
import { useAuth } from "@/context/auth";
import { registerType } from "@/Types/authtype";
import { router } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const {
    register,
    isLoading,
    error,
    clearError,
    getAllSpeculation,
    getAllNiveau,
    getAllTypeActeu,
    speculations,
    niveau3Pays,
    typeActeur,
    loadingSpeculations,
    loadingNiveau3Pays,
    loadingTypeActeur,
  } = useAuth();

  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("ML"); // Mali par défaut
  const [formattedValue, setFormattedValue] = useState("");

  // État pour le formulaire (avec confirmPassword)
  const [formData, setFormData] = useState({
    nomActeur: "",
    username: "",
    adresseActeur: "",
    telephoneActeur: "",
    niveau3PaysActeur: "",
    password: "",
    confirmPassword: "",
    localiteActeur: "",
    speculation: [] as string[],
    typeActeur: [] as string[],
  });

  const [errors, setErrors] = useState({
    nomActeur: "",
    username: "",
    adresseActeur: "",
    telephoneActeur: "",
    niveau3PaysActeur: "",
    password: "",
    confirmPassword: "",
    localiteActeur: "",
    speculation: "",
    typeActeur: "",
  });

  // Charger les données nécessaires
  useEffect(() => {
    const loadData = async () => {
      try {
        await getAllNiveau();
        await getAllSpeculation();
        await getAllTypeActeu();
      } catch (error) {
        Alert.alert("Erreur", "Impossible de charger les données");
      }
    };

    loadData();
  }, []);

  // Transformer les données pour les selects
  const niveau3PaysOptions = niveau3Pays.map((item) => ({
    value: item.idNiveau3Pays,
    label: item.nomN3,
  }));

  const speculationOptions = speculations.map((item) => ({
    value: item.idSpeculation,
    label: item.nomSpeculation,
  }));

  const typeActeurOptions = typeActeur.map((item) => ({
    value: item.idTypeActeur,
    label: item.libelle,
  }));

  const validateStep1 = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Réinitialiser les erreurs de l'étape 1
    newErrors.nomActeur = "";
    newErrors.username = "";
    newErrors.telephoneActeur = "";
    newErrors.niveau3PaysActeur = "";
    newErrors.password = "";
    newErrors.confirmPassword = "";

    if (!formData.nomActeur.trim()) {
      newErrors.nomActeur = "Le nom est requis";
      valid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
      valid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Minimum 3 caractères";
      valid = false;
    }

    if (!phoneNumber) {
      newErrors.telephoneActeur = "Le numéro de téléphone est requis";
      valid = false;
    } else if (phoneNumber.length < 8) {
      newErrors.telephoneActeur = "Numéro de téléphone invalide";
      valid = false;
    }

    if (!formData.niveau3PaysActeur) {
      newErrors.niveau3PaysActeur = "La commune est requise";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 caractères";
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateStep2 = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Réinitialiser les erreurs de l'étape 2
    newErrors.speculation = "";
    newErrors.typeActeur = "";

    if (formData.speculation.length === 0) {
      newErrors.speculation = "Sélectionnez au moins une spéculation";
      valid = false;
    }

    if (formData.typeActeur.length === 0) {
      newErrors.typeActeur = "Sélectionnez au moins un type d'acteur";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    try {
      // Préparer les données pour l'API (sans confirmPassword)
      const apiData: registerType = {
        nomActeur: formData.nomActeur,
        username: formData.username,
        adresseActeur: formData.adresseActeur,
        telephoneActeur: formattedValue || phoneNumber,
        niveau3PaysActeur: formData.niveau3PaysActeur,
        password: formData.password,
        localiteActeur: formData.localiteActeur,
        speculation: formData.speculation,
        typeActeur: formData.typeActeur,
      };

      console.log("Données envoyées à l'API:", apiData);
      await register(apiData);
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      Alert.alert(
        "Erreur d'inscription",
        error.response?.data?.message || "Une erreur est survenue"
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 py-8">
            {/* Header avec logo centré */}
            <View className="items-center mb-6">
              <View className="bg-white p-4 rounded-3xl shadow-lg shadow-orange-200">
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={{ width: 140, height: 88 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-2xl font-bold mt-6 text-gray-800 text-center">
                Créez votre compte
              </Text>
              <Text className="text-gray-500 mt-2 text-center">
                Étape {step} sur 2
              </Text>

              {/* Indicateur de progression */}
              <View className="flex-row mt-4 space-x-2">
                <View
                  className={`h-2 rounded-full ${
                    step >= 1 ? "bg-primary w-20" : "bg-gray-300 w-8"
                  }`}
                />
                <View
                  className={`h-2 rounded-full ${
                    step >= 2 ? "bg-primary w-20" : "bg-gray-300 w-8"
                  }`}
                />
              </View>
            </View>

            {/* Erreur globale */}
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <Text className="text-red-600 text-center">{error}</Text>
              </View>
            )}

            {step === 1 ? (
              // ÉTAPE 1 : Informations personnelles
              <View className="space-y-3">
                <CustomInput
                  label="Nom complet"
                  placeholder="Entrez votre nom complet"
                  value={formData.nomActeur}
                  onChange={(value) => {
                    setFormData({ ...formData, nomActeur: value });
                    if (errors.nomActeur)
                      setErrors({ ...errors, nomActeur: "" });
                    clearError();
                  }}
                  error={errors.nomActeur}
                  type="text"
                  required
                />

                <CustomInput
                  label="Nom d'utilisateur"
                  placeholder="Choisissez un nom d'utilisateur"
                  value={formData.username}
                  onChange={(value) => {
                    setFormData({ ...formData, username: value });
                    if (errors.username) setErrors({ ...errors, username: "" });
                    clearError();
                  }}
                  error={errors.username}
                  type="text"
                  required
                  helperText="Minimum 3 caractères"
                />

                <CustomInput
                  label="Adresse"
                  placeholder="Entrez votre adresse complète"
                  value={formData.adresseActeur}
                  onChange={(value) => {
                    setFormData({ ...formData, adresseActeur: value });
                    if (errors.adresseActeur)
                      setErrors({ ...errors, adresseActeur: "" });
                  }}
                  error={errors.adresseActeur}
                  type="text"
                />

                {/* Champ téléphone avec indicatif pays */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-gray-700 font-medium text-sm">
                      Téléphone
                      <Text className="text-red-500"> *</Text>
                    </Text>
                  </View>

                  <View
                    className={`
    w-full rounded-lg border bg-white
    ${errors.telephoneActeur ? "border-red-300" : "border-gray-300"}
    overflow-hidden
  `}
                  >
                    <PhoneInput
                      defaultCode="ML"
                      layout="first"
                      onChangeText={(text) => {
                        setPhoneNumber(text);
                        if (errors.telephoneActeur)
                          setErrors({ ...errors, telephoneActeur: "" });
                        clearError();
                      }}
                      onChangeFormattedText={(text) => {
                        setFormattedValue(text);
                        setFormData({ ...formData, telephoneActeur: text });
                      }}
                      onChangeCountry={(country) => {
                        setCountryCode(country.cca2);
                      }}
                      value={phoneNumber}
                      autoFocus={false}
                      containerStyle={{
                        width: "100%",
                        height: 48,
                        backgroundColor: "transparent",
                        borderWidth: 0,
                      }}
                      textContainerStyle={{
                        backgroundColor: "white",
                        height: 48,
                        paddingVertical: 0,
                        borderRadius: 0,
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                      }}
                      textInputStyle={{
                        fontSize: 16,
                        color: "#1F2937",
                        height: 48,
                        paddingVertical: 0,
                      }}
                      codeTextStyle={{
                        fontSize: 16,
                        color: "#1F2937",
                      }}
                      countryPickerButtonStyle={{
                        width: 80,
                        height: 48,
                        paddingHorizontal: 8,
                        backgroundColor: "#F8FAFC",
                        borderRightWidth: 1,
                        borderRightColor: "#E2E8F0",
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      flagButtonStyle={{
                        width: "100%",
                        height: "100%",
                      }}
                      textInputProps={{
                        placeholder: "Entrez votre numéro",
                        placeholderTextColor: "#94A3B8",
                        selectionColor: "#079C48",
                      }}
                      disableArrowIcon={false}
                      renderDropdownImage={
                        <ChevronDown size={16} color="#64748B" />
                      }
                    />
                  </View>

                  {errors.telephoneActeur && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.telephoneActeur}
                    </Text>
                  )}
                </View>

                <CustomInput
                  label="Localité"
                  placeholder="Votre ville ou village"
                  value={formData.localiteActeur}
                  onChange={(value) => {
                    setFormData({ ...formData, localiteActeur: value });
                    if (errors.localiteActeur)
                      setErrors({ ...errors, localiteActeur: "" });
                  }}
                  error={errors.localiteActeur}
                  type="text"
                />

                {/* Sélecteur de commune */}
                <CustomSelect
                  label="Commune"
                  placeholder="Sélectionnez votre commune"
                  value={formData.niveau3PaysActeur}
                  onValueChange={(value) => {
                    setFormData({ ...formData, niveau3PaysActeur: value });
                    if (errors.niveau3PaysActeur)
                      setErrors({ ...errors, niveau3PaysActeur: "" });
                    clearError();
                  }}
                  items={niveau3PaysOptions}
                  error={errors.niveau3PaysActeur}
                  disabled={loadingNiveau3Pays}
                  required
                  searchable
                  searchPlaceholder="Rechercher une commune..."
                  emptyMessage={
                    loadingNiveau3Pays
                      ? "Chargement..."
                      : "Aucune commune trouvée"
                  }
                />

                <CustomInput
                  label="Mot de passe"
                  placeholder="Créez un mot de passe sécurisé"
                  value={formData.password}
                  onChange={(value) => {
                    setFormData({ ...formData, password: value });
                    if (errors.password) setErrors({ ...errors, password: "" });
                    clearError();
                  }}
                  error={errors.password}
                  type="password"
                  required
                  helperText="Minimum 6 caractères"
                />

                <CustomInput
                  label="Confirmer le mot de passe"
                  placeholder="Retapez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={(value) => {
                    setFormData({ ...formData, confirmPassword: value });
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: "" });
                    clearError();
                  }}
                  error={errors.confirmPassword}
                  type="password"
                  required
                />

                {/* Bouton suivant */}
                <TouchableOpacity
                  className="rounded-xl py-4 mt-4 bg-yellow-500"
                  onPress={handleNextStep}
                  disabled={isLoading}
                >
                  <Text className="text-black font-semibold text-center text-lg">
                    Suivant
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // ÉTAPE 2 : Spéculations et type d'acteur
              <View className="space-y-3">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  Vos activités agricoles
                </Text>
                <Text className="text-gray-500 mb-4 text-sm">
                  Sélectionnez vos spéculations et votre type d'acteur dans la
                  chaîne agricole
                </Text>

                {/* Multi-select pour les spéculations */}
                <CustomMultiSelect
                  label="Spéculations"
                  placeholder="Sélectionnez vos spéculations"
                  selectedValues={formData.speculation}
                  onSelectedValuesChange={(values) => {
                    setFormData({ ...formData, speculation: values });
                    if (errors.speculation)
                      setErrors({ ...errors, speculation: "" });
                    clearError();
                  }}
                  items={speculationOptions}
                  error={errors.speculation}
                  disabled={loadingSpeculations}
                  required
                  searchable
                  searchPlaceholder="Rechercher une spéculation..."
                  emptyMessage={
                    loadingSpeculations
                      ? "Chargement..."
                      : "Aucune spéculation trouvée"
                  }
                  // maxSelections={5}
                />

                {/* Multi-select pour le type d'acteur */}
                <CustomMultiSelect
                  label="Type d'acteur"
                  placeholder="Sélectionnez votre rôle"
                  selectedValues={formData.typeActeur}
                  onSelectedValuesChange={(values) => {
                    setFormData({ ...formData, typeActeur: values });
                    if (errors.typeActeur)
                      setErrors({ ...errors, typeActeur: "" });
                    clearError();
                  }}
                  items={typeActeurOptions}
                  error={errors.typeActeur}
                  disabled={loadingTypeActeur}
                  required
                  searchable
                  searchPlaceholder="Rechercher un type d'acteur..."
                  emptyMessage={
                    loadingTypeActeur
                      ? "Chargement..."
                      : "Aucun type d'acteur trouvé"
                  }
                  maxSelections={3}
                />

                {/* Boutons de navigation */}
                <View className="flex-row space-x-3 mt-4 gap-2">
                  <TouchableOpacity
                    className="flex-1 rounded-xl py-4 border border-gray-300"
                    onPress={handlePreviousStep}
                    disabled={isLoading}
                  >
                    <Text className="text-gray-700 font-semibold text-center">
                      Retour
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`flex-1 rounded-xl py-4 ${
                      isLoading ? "bg-yellow-500" : "bg-yellow-500"
                    }`}
                    onPress={handleSubmit}
                    disabled={isLoading}
                  >
                    <Text className="text-black font-semibold text-center">
                      {isLoading ? "Inscription..." : "S'inscrire"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Lien vers le login */}
            <View className="items-center mt-6">
              <Text className="text-gray-600">
                Vous avez déjà un compte ?{" "}
                <TouchableOpacity
                  onPress={() => router.push("/screen/(auth)/login")}
                >
                  <Text className="text-primary font-semibold">
                    Se connecter
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>

            {/* Conditions d'utilisation */}
            <View className="mt-8">
              <Text className="text-gray-400 text-xs text-center">
                En vous inscrivant, vous acceptez nos{" "}
                <Text className="text-primary">Conditions d'utilisation</Text>{" "}
                et notre{" "}
                <Text className="text-primary">
                  Politique de confidentialité
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
