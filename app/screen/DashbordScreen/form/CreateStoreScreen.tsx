import { FormInput } from '@/components/common/CustomInput';
import { FormSelect } from '@/components/common/CustomSelect';
import { ImagePickerSection } from '@/components/common/ImagePickerSection';
import { useMerchant } from '@/context/Merchant';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Phone,
  Store as StoreIcon
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateStoreScreen() {
  const router = useRouter();
  const {
    createMagasin,
    loadingMagasins,
    pays,
    niveau1Pays,
    fetchPays,
    fetchNiveau1Pays,
  } = useMerchant();

  const [formData, setFormData] = useState({
    nomMagasin: '',
    localiteMagasin: '',
    contactMagasin: '',
    pays: '',
    region: '',
    latitude: '',
    longitude: '',
    photo: '',
    acteur: { idActeur: "d48lrq5lpgw53adl0yq1" },
  });

  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    nomMagasin: '',
    localiteMagasin: '',
    contactMagasin: '',
    pays: '',
    region: '',
  });

  const [filteredRegions, setFilteredRegions] = useState<Array<{ value: string, label: string }>>([]);

  // Charger les données initiales
  useEffect(() => {
    fetchPays();
    fetchNiveau1Pays();
  }, []);

  // Options pour les pays
  const paysOptions = pays.map(p => ({
    value: p.nomPays,
    label: p.nomPays || 'Sans nom',
  }));

  // Filtrer les régions quand le pays change
  useEffect(() => {
    if (formData.pays) {
      const regions = niveau1Pays
        .filter(region => region.pays?.nomPays === formData.pays)
        .map(region => ({
          value: region.idNiveau1Pays,
          label: region.nomN1 || 'Sans nom',
        }));
      setFilteredRegions(regions);
      if (!regions.find(r => r.value === formData.region)) {
        setFormData(prev => ({ ...prev, region: '' }));
      }
    } else {
      setFilteredRegions([]);
    }
  }, [formData.pays, niveau1Pays]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Image picker
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

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Permission d\'accès à la caméra requise');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
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

  // Obtenir la localisation
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

  const validateForm = () => {
    const newErrors = {
      nomMagasin: '',
      localiteMagasin: '',
      contactMagasin: '',
      pays: '',
      region: '',
      acteur: { idActeur: "d48lrq5lpgw53adl0yq1" },
    };
    let isValid = true;

    if (!formData.nomMagasin.trim()) {
      newErrors.nomMagasin = 'Le nom du magasin est requis';
      isValid = false;
    }

    if (!formData.localiteMagasin.trim()) {
      newErrors.localiteMagasin = 'La localisation est requise';
      isValid = false;
    }

    if (!formData.contactMagasin.trim()) {
      newErrors.contactMagasin = 'Le contact est requis';
      isValid = false;
    }

    if (!formData.pays) {
      newErrors.pays = 'Le pays est requis';
      isValid = false;
    }

    if (!formData.region) {
      newErrors.region = 'La région est requise';
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
      const storeData = {
        nomMagasin: formData.nomMagasin,
        localiteMagasin: formData.localiteMagasin,
        contactMagasin: formData.contactMagasin,
        pays: formData.pays,
        niveau1Pays: { idNiveau1Pays: formData.region },
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        photo: imageFile || '',
        acteur: { idActeur: "d48lrq5lpgw53adl0yq1" },
      };

      await createMagasin(storeData);

      Alert.alert('Succès', 'Magasin créé avec succès', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la création');
    }
  };

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
                Nouveau magasin
              </Text>
              <Text className="text-gray-500 text-xs">
                Créez un nouveau point de vente
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
            {/* Photo du magasin */}
            <ImagePickerSection
              imagePreview={imagePreview}
              onPickImage={pickImage}
              onTakePhoto={takePhoto}
              onRemoveImage={() => {
                setImagePreview('');
                setImageFile(null);
              }}
              title="Photo du magasin"
              description="PNG, JPG max 5MB"
              aspectRatio={[4, 3]}
            />

            {/* Informations de base */}
            <FormInput
              label="Nom du magasin"
              placeholder="Ex: Supermarché Central, Boutique du coin..."
              value={formData.nomMagasin}
              onChange={value => handleInputChange('nomMagasin', value)}
              error={errors.nomMagasin}
              iconLeft={<StoreIcon size={20} color="#94A3B8" />}
              required
            />

            <FormInput
              label="Localisation"
              placeholder="Adresse complète du magasin"
              value={formData.localiteMagasin}
              onChange={value => handleInputChange('localiteMagasin', value)}
              error={errors.localiteMagasin}
              iconLeft={<MapPin size={20} color="#94A3B8" />}
              required
            />

            <FormInput
              label="Contact"
              placeholder="Numéro de téléphone"
              value={formData.contactMagasin}
              onChange={value => handleInputChange('contactMagasin', value)}
              error={errors.contactMagasin}
              type="phone"
              iconLeft={<Phone size={20} color="#94A3B8" />}
              required
            />

            {/* Sélecteurs Pays et Région */}
            <FormSelect
              label="Pays"
              placeholder="Sélectionnez un pays"
              value={formData.pays}
              onValueChange={value => handleInputChange('pays', value)}
              items={paysOptions}
              error={errors.pays}
              searchable
              required
            />

            <FormSelect
              label="Région/Province"
              placeholder={formData.pays ? "Sélectionnez une région" : "Sélectionnez d'abord un pays"}
              value={formData.region}
              onValueChange={value => handleInputChange('region', value)}
              items={filteredRegions}
              error={errors.region}
              searchable
              disabled={!formData.pays}
              required
            />

            {/* Coordonnées GPS */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-700 font-semibold text-sm">
                  Coordonnées GPS (optionnel)
                </Text>
                <TouchableOpacity
                  onPress={getCurrentLocation}
                  className="flex-row items-center bg-primary/10 px-3 py-2 rounded-lg"
                  activeOpacity={0.7}
                >
                  <Navigation size={16} color="#079C48" className="mr-2" />
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
                    type="number"
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
              </View>
            </View>

            {/* Bouton de soumission */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loadingMagasins}
              className={`
                w-full py-4 rounded-lg items-center justify-center
                ${loadingMagasins ? 'bg-primary/70' : 'bg-primary'}
                active:opacity-90
              `}
              activeOpacity={0.8}
            >
              {loadingMagasins ? (
                <Text className="text-black font-bold text-base">
                  Création en cours...
                </Text>
              ) : (
                <Text className="text-black font-bold text-base">
                  Créer le magasin
                </Text>
              )}
            </TouchableOpacity>

            {/* Informations supplémentaires */}
            <View className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <Text className="text-orange-800 text-xs">
                🏪 Votre magasin sera visible sur la plateforme et pourra être associé à vos produits et stocks.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}