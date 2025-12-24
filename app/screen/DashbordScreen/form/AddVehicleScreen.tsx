import { FormInput } from "@/components/common/CustomInput";
import { FormSelect } from "@/components/common/CustomSelect";
import { ImagePickerSection } from "@/components/common/ImagePickerSection";
import { useAuth } from "@/context/auth";
import { useTransporteur } from "@/context/Transporteur";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Barcode,
  Car,
  CheckCircle,
  Gauge,
  Hash,
  Info,
  MapPin,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Interface pour les prix par destination
interface DestinationPrice {
  destination: string;
  price: string;
}

export default function AddVehicleScreen() {
  const router = useRouter();
  const {
    createVehicule,
    updateVehicule,
    vehicules,
    loadingVehicules,
    typeVoitures,
    monnaies,
    pays,
    fetchTypeVoitures,
    fetchMonnaies,
    fetchPays,
    fetchVehicules, // Assurez-vous d'avoir accès au fetch pour recharger/trouver
  } = useTransporteur();

  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const { user, isInitializing } = useAuth();

  // États du formulaire
  const [formData, setFormData] = useState({
    nomVehicule: "",
    codeVehicule: "",
    capaciteVehicule: "",
    nbKilometrage: "",
    description: "",
    localisation: "",
    pays: "",
    etatVehicule: "",
    typeVoiture: "",
    monnaie: "",
    statutVehicule: true,
  });

  // Nouveau: gestion des prix par destination
  const [destinationPrices, setDestinationPrices] = useState<
    DestinationPrice[]
  >([{ destination: "", price: "" }]);

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(false);
  const [priceErrors, setPriceErrors] = useState<string[]>([]);

  // Charger les données initiales
  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingData(true);
      try {
        await Promise.all([
          fetchTypeVoitures(),
          fetchMonnaies(),
          fetchPays(),
          // Si on édite, on s'assure d'avoir la liste des véhicules pour trouver celui qu'on modifie
          isEditing ? fetchVehicules() : Promise.resolve(),
        ]);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        Alert.alert("Erreur", "Impossible de charger les données initiales");
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, []);

  // Vérifier l'authentification et rediriger si nécessaire
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

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (isEditing && vehicules.length > 0) {
      const vehicleToEdit = vehicules.find((v) => v.idVehicule === id);
      if (vehicleToEdit) {
        setFormData({
          nomVehicule: vehicleToEdit.nomVehicule,
          codeVehicule: vehicleToEdit.codeVehicule,
          capaciteVehicule: vehicleToEdit.capaciteVehicule,
          nbKilometrage: vehicleToEdit.nbKilometrage?.toString() || "",
          description: vehicleToEdit.description || "",
          localisation: vehicleToEdit.localisation,
          pays: vehicleToEdit.pays,
          etatVehicule: vehicleToEdit.etatVehicule,
          typeVoiture: vehicleToEdit.typeVoiture?.idTypeVoiture || "",
          monnaie: vehicleToEdit.monnaie?.idMonnaie || "",
          statutVehicule: vehicleToEdit.statutVehicule,
        });

        setImagePreview(vehicleToEdit.photoVehicule || "");
        setImageFile(vehicleToEdit.photoVehicule || null);

        // Reconstruire les prix par destination
        if (
          vehicleToEdit.prixParDestination &&
          Object.keys(vehicleToEdit.prixParDestination).length > 0
        ) {
          const prices = Object.entries(vehicleToEdit.prixParDestination).map(
            ([dest, price]) => ({
              destination: dest,
              price: price.toString(),
            })
          );
          setDestinationPrices(prices);
        }
      }
    }
  }, [id, vehicules, isEditing]);

  // Options pour les sélecteurs
  const typeVoitureOptions = typeVoitures.map((type) => ({
    value: type.idTypeVoiture,
    label: type.nom,
  }));

  const monnaieOptions = monnaies.map((mon) => ({
    value: mon.idMonnaie,
    label: `${mon.libelle} (${mon.codeMonnaie})`,
  }));

  const paysOptions = pays.map((p) => ({
    value: p.nomPays,
    label: p.nomPays,
  }));

  const etatOptions = [
    { value: "Neuf", label: "Neuf" },
    { value: "Bon état", label: "Bon état" },
    { value: "Usagé", label: "Usagé" },
    { value: "À réparer", label: "À réparer" },
  ];

  // Gestion des prix par destination
  const handleDestinationPriceChange = (
    index: number,
    field: keyof DestinationPrice,
    value: string
  ) => {
    const newPrices = [...destinationPrices];
    newPrices[index][field] = value;
    setDestinationPrices(newPrices);

    // Effacer les erreurs pour ce champ
    if (priceErrors[index]) {
      const newErrors = [...priceErrors];
      newErrors[index] = "";
      setPriceErrors(newErrors);
    }
  };

  const addDestinationPrice = () => {
    setDestinationPrices([
      ...destinationPrices,
      { destination: "", price: "" },
    ]);
  };

  const removeDestinationPrice = (index: number) => {
    if (destinationPrices.length > 1) {
      const newPrices = [...destinationPrices];
      newPrices.splice(index, 1);
      setDestinationPrices(newPrices);

      const newErrors = [...priceErrors];
      newErrors.splice(index, 1);
      setPriceErrors(newErrors);
    }
  };

  // Validation des prix par destination
  const validateDestinationPrices = (): boolean => {
    const errors: string[] = [];
    let isValid = true;

    destinationPrices.forEach((price, index) => {
      if (price.destination && price.price) {
        const numPrice = Number(price.price);
        if (isNaN(numPrice) || numPrice <= 0) {
          errors[index] = "Le prix doit être un nombre positif";
          isValid = false;
        }
      } else if (price.destination || price.price) {
        // Un des deux champs est rempli mais pas l'autre
        errors[index] = "Les deux champs doivent être remplis";
        isValid = false;
      } else {
        errors[index] = "";
      }
    });

    setPriceErrors(errors);
    return isValid;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Gestion des images
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
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImagePreview(result.assets[0].uri);
        setImageFile(result.assets[0].uri);
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
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImagePreview(result.assets[0].uri);
        setImageFile(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur prise photo:", error);
      Alert.alert("Erreur", "Erreur lors de la prise de photo");
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setImageFile(null);
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.nomVehicule.trim()) {
      newErrors.nomVehicule = "Le nom du véhicule est requis";
      isValid = false;
    }

    if (!formData.codeVehicule.trim()) {
      newErrors.codeVehicule = "Le code du véhicule est requis";
      isValid = false;
    }

    if (!formData.capaciteVehicule.trim()) {
      newErrors.capaciteVehicule = "La capacité est requise";
      isValid = false;
    }

    if (!formData.localisation.trim()) {
      newErrors.localisation = "La localisation est requise";
      isValid = false;
    }

    if (!formData.typeVoiture) {
      newErrors.typeVoiture = "Le type de véhicule est requis";
      isValid = false;
    }

    if (!formData.monnaie) {
      newErrors.monnaie = "La monnaie est requise";
      isValid = false;
    }

    // Valider les prix par destination
    if (!validateDestinationPrices()) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Construction de l'objet prixParDestination
  const buildPrixParDestination = () => {
    const prixParDestination: { [key: string]: number } = {};

    destinationPrices.forEach((item) => {
      if (item.destination && item.price) {
        const priceNum = Number(item.price);
        if (!isNaN(priceNum) && priceNum > 0) {
          prixParDestination[item.destination] = priceNum;
        }
      }
    });

    return prixParDestination;
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    console.log("id user", user?.idActeur);

    try {
      const vehicleData = {
        nomVehicule: formData.nomVehicule,
        codeVehicule: formData.codeVehicule,
        capaciteVehicule: formData.capaciteVehicule,
        description: formData.description,
        nbKilometrage: formData.nbKilometrage
          ? Number(formData.nbKilometrage)
          : 0,
        prixParDestination: buildPrixParDestination(),
        statutVehicule: formData.statutVehicule,
        pays: formData.pays,
        photoVehicule: imageFile || "",
        localisation: formData.localisation,
        etatVehicule: formData.etatVehicule || "Bon état",
        personneModif: null,
        nbreView: 0,
        acteur: { idActeur: user?.idActeur || "" },
        typeVoiture: { idTypeVoiture: formData.typeVoiture },
        monnaie: { idMonnaie: formData.monnaie },
      };
      console.log("id user", user?.idActeur);
      console.log("data", vehicleData);
      if (isEditing) {
        await updateVehicule(id as string, vehicleData);
        Alert.alert("Succès", "Véhicule mis à jour avec succès", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        await createVehicule(vehicleData);
        Alert.alert("Succès", "Véhicule créé avec succès", [
          {
            text: "OK",
            onPress: () => {
              setFormData({
                nomVehicule: "",
                codeVehicule: "",
                capaciteVehicule: "",
                nbKilometrage: "",
                description: "",
                localisation: "",
                pays: "",
                etatVehicule: "",
                typeVoiture: "",
                monnaie: "",
                statutVehicule: true,
              });
              setDestinationPrices([{ destination: "", price: "" }]);
              setImagePreview("");
              setImageFile(null);
              setErrors({});
              setPriceErrors([]);
              router.back();
            },
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message ||
          `Erreur lors de la ${
            isEditing ? "mise à jour" : "création"
          } du véhicule`
      );
      console.error("Erreur véhicule:", error);
    }
  };

  if (loadingData || isInitializing) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#079C48" />
          <Text className="text-gray-500 mt-4">
            {isInitializing
              ? "Vérification de l'authentification..."
              : "Chargement des données..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
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
                {isEditing ? "Modifier le véhicule" : "Nouveau véhicule"}
              </Text>
              <Text className="text-gray-500 text-xs">
                {isEditing
                  ? "Mettez à jour les informations"
                  : "Ajoutez un véhicule à votre flotte"}
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
            {/* Photo du véhicule */}
            <ImagePickerSection
              imagePreview={imagePreview}
              onPickImage={pickImage}
              onTakePhoto={takePhoto}
              onRemoveImage={removeImage}
              title="Photo du véhicule"
              description="PNG, JPG max 5MB"
              aspectRatio={[16, 9]}
            />

            {/* Informations de base */}
            <FormInput
              label="Nom du véhicule *"
              placeholder="Ex: Camion Renault, Pick-up Toyota..."
              value={formData.nomVehicule}
              onChange={(value) => handleInputChange("nomVehicule", value)}
              error={errors.nomVehicule}
              iconLeft={<Car size={20} color="#94A3B8" />}
            />

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <FormInput
                  label="Code véhicule *"
                  placeholder="Ex: VEH-001"
                  value={formData.codeVehicule}
                  onChange={(value) => handleInputChange("codeVehicule", value)}
                  error={errors.codeVehicule}
                  iconLeft={<Barcode size={20} color="#94A3B8" />}
                />
              </View>
              <View className="flex-1">
                <FormInput
                  label="Capacité *"
                  placeholder="Ex: 5 tonnes, 10m³..."
                  value={formData.capaciteVehicule}
                  onChange={(value) =>
                    handleInputChange("capaciteVehicule", value)
                  }
                  error={errors.capaciteVehicule}
                  iconLeft={<Hash size={20} color="#94A3B8" />}
                />
              </View>
            </View>

            {/* Localisation */}
            <FormInput
              label="Localisation *"
              placeholder="Ex: Douala, Yaoundé..."
              value={formData.localisation}
              onChange={(value) => handleInputChange("localisation", value)}
              error={errors.localisation}
              iconLeft={<MapPin size={20} color="#94A3B8" />}
            />

            {/* Sélecteurs requis */}
            <FormSelect
              label="Type de véhicule *"
              placeholder="Sélectionnez un type"
              value={formData.typeVoiture}
              onValueChange={(value) => handleInputChange("typeVoiture", value)}
              items={typeVoitureOptions}
              error={errors.typeVoiture}
              searchable
              required
            />

            <FormSelect
              label="Monnaie *"
              placeholder="Sélectionnez une monnaie"
              value={formData.monnaie}
              onValueChange={(value) => handleInputChange("monnaie", value)}
              items={monnaieOptions}
              error={errors.monnaie}
              searchable
              required
            />

            {/* Informations supplémentaires */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <FormInput
                  label="Kilométrage"
                  placeholder="Ex: 150000"
                  value={formData.nbKilometrage}
                  onChange={(value) =>
                    handleInputChange("nbKilometrage", value)
                  }
                  type="number"
                  keyboardType="numeric"
                  iconLeft={<Gauge size={20} color="#94A3B8" />}
                />
              </View>
              <View className="flex-1">
                <FormSelect
                  label="État"
                  placeholder="Sélectionnez un état"
                  value={formData.etatVehicule}
                  onValueChange={(value) =>
                    handleInputChange("etatVehicule", value)
                  }
                  items={etatOptions}
                />
              </View>
            </View>

            <FormSelect
              label="Pays"
              placeholder="Sélectionnez un pays"
              value={formData.pays}
              onValueChange={(value) => handleInputChange("pays", value)}
              items={paysOptions}
              searchable
            />

            {/* Prix par destination - Nouveau design */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-700 font-semibold text-sm">
                  Prix par destination
                </Text>
                <TouchableOpacity
                  onPress={addDestinationPrice}
                  className="flex-row items-center bg-yellow-500 px-3 py-1.5 rounded-lg"
                  activeOpacity={0.7}
                >
                  <Plus size={16} color="#079C48" className="mr-1" />
                  <Text className="text-primary font-medium text-sm">
                    Ajouter
                  </Text>
                </TouchableOpacity>
              </View>

              <Text className="text-gray-500 text-xs mb-3">
                Définissez les prix pour différentes destinations (optionnel)
              </Text>

              {destinationPrices.map((item, index) => (
                <View key={index} className="mb-3">
                  <View className="flex-row items-start gap-2">
                    <View className="flex-1">
                      <Text className="text-gray-700 text-xs mb-1">
                        Destination {index + 1}
                      </Text>
                      <TextInput
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 bg-white"
                        placeholder="Ex: Douala-Yaoundé"
                        value={item.destination}
                        onChangeText={(text) =>
                          handleDestinationPriceChange(
                            index,
                            "destination",
                            text
                          )
                        }
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-700 text-xs mb-1">
                        Prix (en{" "}
                        {monnaies.find((m) => m.idMonnaie === formData.monnaie)
                          ?.sigle || "XOF"}
                        )
                      </Text>
                      <TextInput
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 bg-white"
                        placeholder="Ex: 50000"
                        value={item.price}
                        onChangeText={(text) =>
                          handleDestinationPriceChange(index, "price", text)
                        }
                        keyboardType="numeric"
                      />
                    </View>
                    {destinationPrices.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeDestinationPrice(index)}
                        className="mt-6 p-2"
                        activeOpacity={0.7}
                      >
                        <Trash2 size={18} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                  {priceErrors[index] && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">
                      {priceErrors[index]}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            {/* Description */}
            <FormInput
              label="Description"
              placeholder="Décrivez votre véhicule (caractéristiques, équipements, etc.)"
              value={formData.description}
              onChange={(value) => handleInputChange("description", value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              containerClassName="mb-4"
              inputClassName="h-32 border-gray-300"
              iconLeft={<Info size={20} color="#94A3B8" />}
            />

            {/* Statut */}
            <View className="flex-row items-center justify-between bg-white p-4 rounded-lg border border-gray-300 mb-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center mr-3">
                  {formData.statutVehicule ? (
                    <CheckCircle size={20} color="#10B981" />
                  ) : (
                    <XCircle size={20} color="#EF4444" />
                  )}
                </View>
                <View>
                  <Text className="font-medium text-gray-800">
                    Statut du véhicule
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {formData.statutVehicule ? "Disponible" : "Indisponible"}
                  </Text>
                </View>
              </View>
              <Switch
                value={formData.statutVehicule}
                onValueChange={(value) =>
                  handleInputChange("statutVehicule", value)
                }
                trackColor={{ false: "#D1D5DB", true: "#079C48" }}
                thumbColor={formData.statutVehicule ? "#FFFFFF" : "#FFFFFF"}
              />
            </View>

            {/* Bouton de soumission */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loadingVehicules}
              className={`
                                w-full py-4 rounded-lg items-center justify-center
                                ${
                                  loadingVehicules
                                    ? "bg-yellow-500"
                                    : "bg-yellow-500"
                                }
                                active:opacity-90 mb-4
                            `}
              activeOpacity={0.8}
            >
              {loadingVehicules ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold text-base ml-2">
                    Création en cours...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-base">
                  {isEditing ? "Mettre à jour" : "Ajouter le véhicule"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Informations supplémentaires */}
            <View className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Text className="text-blue-800 text-xs">
                🚚 Votre véhicule sera visible pour les clients et pourra être
                utilisé pour les livraisons.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
