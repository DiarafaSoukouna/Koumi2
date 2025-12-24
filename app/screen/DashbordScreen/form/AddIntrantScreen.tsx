import { FormInput } from "@/components/common/CustomInput";
import { ImagePickerSection } from "@/components/common/ImagePickerSection";
import { useAuth } from "@/context/auth";
import { useIntrant } from "@/context/Intrant";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Globe,
  Hash,
  Package,
  Scale,
  Tag,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AddIntrantScreenProps {
  intrantToEdit?: any;
  onSuccess?: () => void;
}

export default function AddIntrantScreen({
  intrantToEdit,
  onSuccess,
}: AddIntrantScreenProps) {
  const router = useRouter();
  const {
    createIntrant,
    updateIntrant,
    loading,
    monnaies,
    categories,
    formes,
    fetchMonnaies,
    fetchCategories,
    fetchFormes,
  } = useIntrant();
  const { user, isInitializing } = useAuth();

  // Vérifier l'authentification
  useEffect(() => {
    if (!isInitializing && !user) {
      Alert.alert(
        "Non connecté",
        "Vous devez être connecté pour accéder à cette page.",
        [
          {
            text: "Se connecter",
            onPress: () => router.replace("/screen/(auth)/login"),
          },
          { text: "Annuler", onPress: () => router.back() },
        ]
      );
    }
  }, [isInitializing, user]);

  const generateCodeIntrant = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  };

  const [formData, setFormData] = useState({
    nomIntrant: "",
    quantiteIntrant: "0",
    codeIntrant: generateCodeIntrant(),
    prixIntrant: "0",
    descriptionIntrant: "",
    photoIntrant: "",
    statutIntrant: true,
    dateExpiration: null as Date | null,
    pays: "",
    unite: "",
    categorieProduit: { idCategorieProduit: "" },
    forme: { idForme: "" },
    acteur: { idActeur: user?.idActeur },
    monnaie: { idMonnaie: "" },
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showFormePicker, setShowFormePicker] = useState(false);
  const [showMonnaiePicker, setShowMonnaiePicker] = useState(false);

  const [errors, setErrors] = useState({
    nomIntrant: "",
    quantiteIntrant: "",
    codeIntrant: "",
    prixIntrant: "",
    categorieProduit: "",
    forme: "",
    monnaie: "",
  });

  // Charger les données de référence
  useEffect(() => {
    fetchMonnaies();
    fetchCategories();
    fetchFormes();
  }, []);

  // Pré-remplir en cas d'édition
  useEffect(() => {
    if (intrantToEdit) {
      setFormData({
        nomIntrant: intrantToEdit.nomIntrant,
        quantiteIntrant: intrantToEdit.quantiteIntrant.toString(),
        codeIntrant: intrantToEdit.codeIntrant,
        prixIntrant: intrantToEdit.prixIntrant.toString(),
        descriptionIntrant: intrantToEdit.descriptionIntrant || "",
        photoIntrant: intrantToEdit.photoIntrant || "",
        statutIntrant: intrantToEdit.statutIntrant,
        dateExpiration: intrantToEdit.dateExpiration
          ? new Date(intrantToEdit.dateExpiration)
          : null,
        pays: intrantToEdit.pays || "",
        unite: intrantToEdit.unite || "",
        categorieProduit: {
          idCategorieProduit: intrantToEdit.categorieProduit.idCategorieProduit,
        },
        forme: { idForme: intrantToEdit.forme.idForme },
        acteur: { idActeur: user?.idActeur || "" },
        monnaie: intrantToEdit.monnaie
          ? { idMonnaie: intrantToEdit.monnaie.idMonnaie }
          : { idMonnaie: "" },
      });
      if (intrantToEdit.photoIntrant) {
        setImagePreview(intrantToEdit.photoIntrant);
      }
    }
  }, [intrantToEdit]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleObjectChange = (
    field: "categorieProduit" | "forme" | "monnaie",
    id: string,
    label?: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { [`id${field.charAt(0).toUpperCase() + field.slice(1)}`]: id },
    }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, dateExpiration: selectedDate }));
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Permission d'accès à la galerie requise"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImagePreview(result.assets[0].uri);
        setImageFile(result.assets[0].uri);
        handleInputChange("photoIntrant", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur sélection image:", error);
      Alert.alert("Erreur", "Erreur lors de la sélection de l'image");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Permission d'accès à la caméra requise"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImagePreview(result.assets[0].uri);
        setImageFile(result.assets[0].uri);
        handleInputChange("photoIntrant", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur prise photo:", error);
      Alert.alert("Erreur", "Erreur lors de la prise de photo");
    }
  };

  const validateForm = () => {
    const newErrors = {
      nomIntrant: "",
      quantiteIntrant: "",
      codeIntrant: "",
      prixIntrant: "",
      categorieProduit: "",
      forme: "",
      monnaie: "",
    };
    let isValid = true;

    if (!formData.nomIntrant.trim()) {
      newErrors.nomIntrant = "Le nom de l'intrant est requis";
      isValid = false;
    }

    if (
      !formData.quantiteIntrant ||
      parseFloat(formData.quantiteIntrant) <= 0
    ) {
      newErrors.quantiteIntrant = "La quantité doit être supérieure à 0";
      isValid = false;
    }

    if (!formData.codeIntrant.trim()) {
      newErrors.codeIntrant = "Le code intrant est requis";
      isValid = false;
    }

    if (!formData.prixIntrant || parseFloat(formData.prixIntrant) <= 0) {
      newErrors.prixIntrant = "Le prix doit être supérieur à 0";
      isValid = false;
    }

    if (!formData.categorieProduit.idCategorieProduit) {
      newErrors.categorieProduit = "La catégorie est requise";
      isValid = false;
    }

    if (!formData.forme.idForme) {
      newErrors.forme = "La forme est requise";
      isValid = false;
    }

    if (!formData.monnaie.idMonnaie) {
      newErrors.monnaie = "La monnaie est requise";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const intrantData = {
        nomIntrant: formData.nomIntrant,
        quantiteIntrant: parseFloat(formData.quantiteIntrant),
        codeIntrant: formData.codeIntrant,
        prixIntrant: parseFloat(formData.prixIntrant),
        descriptionIntrant: formData.descriptionIntrant,
        photoIntrant: formData.photoIntrant,
        statutIntrant: formData.statutIntrant,
        dateExpiration: formData.dateExpiration
          ? formData.dateExpiration.toISOString()
          : null,
        pays: formData.pays,
        unite: formData.unite,
        categorieProduit: formData.categorieProduit,
        forme: formData.forme,
        acteur: { idActeur: user?.idActeur || "" },
        monnaie: formData.monnaie,
      };

      if (intrantToEdit) {
        await updateIntrant(intrantToEdit.idIntrant, intrantData);
        Alert.alert("Succès", "Intrant modifié avec succès", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        await createIntrant(intrantData);
        Alert.alert("Succès", "Intrant créé avec succès", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }

      onSuccess?.();
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Erreur lors de l'opération");
    }
  };

  // Formatage de la date pour l'affichage
  const formatDate = (date: Date | null) => {
    if (!date) return "Non défini";
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-2 mr-2"
            >
              <ArrowLeft size={24} color="#1E293B" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-gray-800">
                {intrantToEdit
                  ? "Modifier l'intrant"
                  : "Nouvel intrant agricole"}
              </Text>
              <Text className="text-gray-500 text-xs">
                {intrantToEdit
                  ? "Modifiez les informations de l'intrant"
                  : "Ajoutez un nouvel intrant agricole"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-4">
            {/* Section Photo */}
            <ImagePickerSection
              imagePreview={imagePreview}
              onPickImage={pickImage}
              onTakePhoto={takePhoto}
              onRemoveImage={() => {
                setImagePreview("");
                setImageFile(null);
                handleInputChange("photoIntrant", "");
              }}
              title="Photo de l'intrant"
              description="PNG, JPG max 5MB"
              aspectRatio={[4, 3]}
            />

            {/* Nom de l'intrant */}
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Package size={18} color="#4B5563" className="mr-2" />
                <Text className="text-gray-700 font-semibold text-sm">
                  Nom de l'intrant *
                </Text>
              </View>
              <FormInput
                placeholder="Ex: Engrais NPK, Fongicide X, Semences de maïs..."
                value={formData.nomIntrant}
                onChange={(value) => handleInputChange("nomIntrant", value)}
                error={errors.nomIntrant}
              />
            </View>

            {/* Code intrant */}
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Hash size={18} color="#4B5563" className="mr-2" />
                <Text className="text-gray-700 font-semibold text-sm">
                  Code intrant *
                </Text>
              </View>
              <FormInput
                placeholder="Code unique de l'intrant"
                value={formData.codeIntrant}
                onChange={(value) => handleInputChange("codeIntrant", value)}
                error={errors.codeIntrant}
              />
            </View>

            {/* Description */}
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <FileText size={18} color="#4B5563" className="mr-2" />
                <Text className="text-gray-700 font-semibold text-sm">
                  Description
                </Text>
              </View>
              <FormInput
                placeholder="Description détaillée de l'intrant..."
                value={formData.descriptionIntrant}
                onChange={(value) =>
                  handleInputChange("descriptionIntrant", value)
                }
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Quantité et Unité */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Scale size={18} color="#4B5563" className="mr-2" />
                  <Text className="text-gray-700 font-semibold text-sm">
                    Quantité *
                  </Text>
                </View>
                <View className="flex-1 ml-4">
                  <FormInput
                    placeholder="Unité (Ex: kg, L, sac...)"
                    value={formData.unite}
                    onChange={(value) => handleInputChange("unite", value)}
                    className="text-right"
                  />
                </View>
              </View>
              <FormInput
                placeholder="Ex: 50, 100, 250..."
                value={formData.quantiteIntrant}
                onChange={(value) =>
                  handleInputChange("quantiteIntrant", value)
                }
                error={errors.quantiteIntrant}
                type="number"
                keyboardType="numeric"
              />
            </View>

            {/* Prix et Monnaie */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <DollarSign size={18} color="#4B5563" className="mr-2" />
                  <Text className="text-gray-700 font-semibold text-sm">
                    Prix *
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowMonnaiePicker(true)}
                  className="flex-1 ml-4 bg-gray-100 p-3 rounded-lg"
                >
                  <Text
                    className={
                      formData.monnaie.idMonnaie
                        ? "text-gray-800"
                        : "text-gray-500"
                    }
                  >
                    {formData.monnaie.idMonnaie
                      ? monnaies.find(
                          (m) => m.idMonnaie === formData.monnaie.idMonnaie
                        )?.libelle
                      : "Sélectionner une monnaie"}
                  </Text>
                  {errors.monnaie ? (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.monnaie}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              </View>
              <FormInput
                placeholder="Prix unitaire"
                value={formData.prixIntrant}
                onChange={(value) => handleInputChange("prixIntrant", value)}
                error={errors.prixIntrant}
                type="number"
                keyboardType="numeric"
              />
            </View>

            {/* Catégorie et Forme */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <Tag size={18} color="#4B5563" className="mr-2" />
                  <Text className="text-gray-700 font-semibold text-sm">
                    Catégorie *
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowCategoryPicker(true)}
                  className="bg-gray-100 p-3 rounded-lg"
                >
                  <Text
                    className={
                      formData.categorieProduit.idCategorieProduit
                        ? "text-gray-800"
                        : "text-gray-500"
                    }
                  >
                    {formData.categorieProduit.idCategorieProduit
                      ? categories.find(
                          (c) =>
                            c.idCategorieProduit ===
                            formData.categorieProduit.idCategorieProduit
                        )?.libelleCategorie
                      : "Sélectionner"}
                  </Text>
                  {errors.categorieProduit ? (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.categorieProduit}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <Package size={18} color="#4B5563" className="mr-2" />
                  <Text className="text-gray-700 font-semibold text-sm">
                    Forme *
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowFormePicker(true)}
                  className="bg-gray-100 p-3 rounded-lg"
                >
                  <Text
                    className={
                      formData.forme.idForme ? "text-gray-800" : "text-gray-500"
                    }
                  >
                    {formData.forme.idForme
                      ? formes.find((f) => f.idForme === formData.forme.idForme)
                          ?.libelleForme
                      : "Sélectionner"}
                  </Text>
                  {errors.forme ? (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.forme}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              </View>
            </View>

            {/* Date d'expiration et Pays */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <Calendar size={18} color="#4B5563" className="mr-2" />
                  <Text className="text-gray-700 font-semibold text-sm">
                    Date d'expiration
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="bg-gray-100 p-3 rounded-lg"
                >
                  <Text
                    className={
                      formData.dateExpiration
                        ? "text-gray-800"
                        : "text-gray-500"
                    }
                  >
                    {formatDate(formData.dateExpiration)}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <Globe size={18} color="#4B5563" className="mr-2" />
                  <Text className="text-gray-700 font-semibold text-sm">
                    Pays d'origine
                  </Text>
                </View>
                <FormInput
                  placeholder="Ex: Cameroun, France..."
                  value={formData.pays}
                  onChange={(value) => handleInputChange("pays", value)}
                />
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={formData.dateExpiration || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {/* Bouton de soumission */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading || isInitializing}
              className={`
                w-full py-4 rounded-lg items-center justify-center
                ${loading || isInitializing ? "bg-yellow-500" : "bg-yellow-500"}
                active:opacity-90
              `}
              activeOpacity={0.8}
            >
              {loading || isInitializing ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="black" />
                  <Text className="text-black font-bold text-base ml-2">
                    {isInitializing
                      ? "Auth..."
                      : intrantToEdit
                      ? "Modification..."
                      : "Création..."}
                  </Text>
                </View>
              ) : (
                <Text className="text-black font-bold text-base">
                  {intrantToEdit ? "Modifier l'intrant" : "Créer l'intrant"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Informations supplémentaires */}
            <View className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Text className="text-blue-800 text-xs">
                💡 Les intrants agricoles comprennent les engrais, pesticides,
                semences et autres produits utilisés dans l'agriculture.
                Assurez-vous de renseigner toutes les informations obligatoires
                (*).
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modaux pour les sélecteurs */}
      <Modal
        visible={showCategoryPicker}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-4 max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">
                Sélectionner une catégorie
              </Text>
              <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                <Text className="text-primary font-bold">Fermer</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.idCategorieProduit}
                  onPress={() => {
                    handleObjectChange(
                      "categorieProduit",
                      category.idCategorieProduit
                    );
                    setShowCategoryPicker(false);
                  }}
                  className="p-3 border-b border-gray-200"
                >
                  <Text className="text-gray-800">
                    {category.libelleCategorie}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showFormePicker} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-4 max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Sélectionner une forme</Text>
              <TouchableOpacity onPress={() => setShowFormePicker(false)}>
                <Text className="text-primary font-bold">Fermer</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {formes.map((forme) => (
                <TouchableOpacity
                  key={forme.idForme}
                  onPress={() => {
                    handleObjectChange("forme", forme.idForme);
                    setShowFormePicker(false);
                  }}
                  className="p-3 border-b border-gray-200"
                >
                  <Text className="text-gray-800">{forme.libelleForme}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showMonnaiePicker}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-4 max-h-3/4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">
                Sélectionner une monnaie
              </Text>
              <TouchableOpacity onPress={() => setShowMonnaiePicker(false)}>
                <Text className="text-primary font-bold">Fermer</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {monnaies.map((monnaie) => (
                <TouchableOpacity
                  key={monnaie.idMonnaie}
                  onPress={() => {
                    handleObjectChange("monnaie", monnaie.idMonnaie);
                    setShowMonnaiePicker(false);
                  }}
                  className="p-3 border-b border-gray-200"
                >
                  <Text className="text-gray-800">{monnaie.libelle}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
