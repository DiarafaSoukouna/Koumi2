import { FormInput } from '@/components/common/CustomInput';
import { ImagePickerSection } from '@/components/common/ImagePickerSection';
import { useMerchant } from '@/context/Merchant';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddProductionZoneScreen() {
  const router = useRouter();
  const { createZoneProduction, updateZoneProduction, loadingZones } = useMerchant();

  const generateCodeZone = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  };

  const [formData, setFormData] = useState({
    nomZoneProduction: '',
    latitude: '',
    longitude: '',
    codeZone: generateCodeZone(),
    acteur: { idActeur: "d48lrq5lpgw53adl0yq1" },
    image: ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    nomZoneProduction: '',
    latitude: '',
    longitude: '',
  });

  // Effacer les erreurs quand l'utilisateur modifie
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Sélection d'image
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Permission d\'accès à la galerie requise');
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
      }
    } catch (error) {
      console.error('Erreur sélection image:', error);
      Alert.alert('Erreur', 'Erreur lors de la sélection de l\'image');
    }
  };

  // Prendre une photo
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Permission d\'accès à la caméra requise');
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
      }
    } catch (error) {
      console.error('Erreur prise photo:', error);
      Alert.alert('Erreur', 'Erreur lors de la prise de photo');
    }
  };

  // Obtenir la localisation actuelle
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Permission de localisation requise');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setFormData(prev => ({
        ...prev,
        latitude: location.coords.latitude.toString(),
        longitude: location.coords.longitude.toString(),
      }));
    } catch (error) {
      console.error('Erreur géolocalisation:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir la localisation actuelle');
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {
      nomZoneProduction: '',
      latitude: '',
      longitude: '',
      acteur: 'd48lrq5lpgw53adl0yq1',
    };
    let isValid = true;

    if (!formData.nomZoneProduction.trim()) {
      newErrors.nomZoneProduction = 'Le nom de la zone est requis';
      isValid = false;
    }

    if (formData.latitude && !formData.longitude) {
      newErrors.longitude = 'La longitude est requise si la latitude est renseignée';
      isValid = false;
    }

    if (formData.longitude && !formData.latitude) {
      newErrors.latitude = 'La latitude est requise si la longitude est renseignée';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const zoneData = {
        nomZoneProduction: formData.nomZoneProduction,
        latitude: formData.latitude,
        longitude: formData.longitude,
        image: imageFile || undefined,
        personneModif: null,
        acteur: { idActeur: "d48lrq5lpgw53adl0yq1" },
        codeZone: formData.codeZone,
      };

      await createZoneProduction(zoneData);

      Alert.alert('Succès', 'Zone de production créée avec succès', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la création');
    }
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
                Nouvelle zone de production
              </Text>
              <Text className="text-gray-500 text-xs">
                Ajoutez une nouvelle zone pour vos cultures
              </Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                setImagePreview('');
                setImageFile(null);
              }}
              title="Photo de la zone"
              description="PNG, JPG max 5MB"
              aspectRatio={[4, 3]}
            />

            {/* Nom de la zone */}
            <FormInput
              label="Nom de la zone"
              placeholder="Ex: Champ principal, Serre Nord..."
              value={formData.nomZoneProduction}
              onChange={value => handleInputChange('nomZoneProduction', value)}
              error={errors.nomZoneProduction}
              required
            />

            {/* Coordonnées GPS */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-700 font-semibold text-sm">
                  Coordonnées GPS
                </Text>
                <TouchableOpacity
                  onPress={getCurrentLocation}
                  className="flex-row items-center bg-primary/10 px-3 py-2 rounded-lg"
                  activeOpacity={0.7}
                >
                  <MapPin size={16} color="#079C48" className="mr-2" />
                  <Text className="text-primary font-medium text-sm">
                    Localisation actuelle
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <FormInput
                    label="Latitude"
                    placeholder="Ex: 4.0511"
                    value={formData.latitude}
                    onChange={value => handleInputChange('latitude', value)}
                    error={errors.latitude}
                    type="number"
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
                <View className="flex-1">
                  <FormInput
                    label="Longitude"
                    placeholder="Ex: 9.7679"
                    value={formData.longitude}
                    onChange={value => handleInputChange('longitude', value)}
                    error={errors.longitude}
                    type="number"
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
              </View>
            </View>

            {/* Bouton de soumission */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loadingZones}
              className={`
                w-full py-4 rounded-lg items-center justify-center
                ${loadingZones ? 'bg-primary/70' : 'bg-primary'}
                active:opacity-90
              `}
              activeOpacity={0.8}
            >
              {loadingZones ? (
                <Text className="text-black font-bold text-base">
                  Création en cours...
                </Text>
              ) : (
                <Text className="text-black font-bold text-base">
                  Créer la zone
                </Text>
              )}
            </TouchableOpacity>

            {/* Informations supplémentaires */}
            <View className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Text className="text-blue-800 text-xs">
                💡 La zone de production sera utilisée pour associer vos cultures et suivre leur production. Vous pourrez y ajouter des informations détaillées plus tard.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}