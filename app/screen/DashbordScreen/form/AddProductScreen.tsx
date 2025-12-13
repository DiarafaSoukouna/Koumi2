// app/screens/AddProductScreen.tsx
import { FormInput } from '@/components/common/CustomInput';
import { FormSelect } from '@/components/common/CustomSelect';
import { ImagePickerSection } from '@/components/common/ImagePickerSection';
import { useMerchant } from '@/context/Merchant';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Barcode,
  DollarSign,
  Globe,
  Hash as HashIcon,
  Info,
  Package,
  Type
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddProductScreen() {
  const router = useRouter();
  const {
    createStock,
    updateStock,
    loadingStocks,
    zonesProduction,
    speculations,
    unites,
    magasins,
    monnaies,
    fetchZonesProduction,
    fetchSpeculations,
    fetchUnites,
    fetchMagasins,
    fetchMonnaies,
  } = useMerchant();

  // États du formulaire
  const [formData, setFormData] = useState({
    nomProduit: '',
    codeStock: '',
    quantiteStock: '',
    prix: '',
    typeProduit: '',
    origineProduit: '',
    descriptionStock: '',
    zoneProduction: '',
    speculation: '',
    unite: '',
    magasin: '',
    monnaie: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(false);

  // Charger les données initiales
  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingData(true);
      try {
        await Promise.all([
          fetchZonesProduction(),
          fetchSpeculations(),
          fetchUnites(),
          fetchMagasins(),
          fetchMonnaies(),
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        Alert.alert('Erreur', 'Impossible de charger les données initiales');
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, []);

  // Options pour les sélecteurs
  const zoneOptions = zonesProduction.map(zone => ({
    value: zone.idZoneProduction,
    label: zone.nomZoneProduction,
  }));

  const speculationOptions = speculations.map(spec => ({
    value: spec.idSpeculation,
    label: spec.nomSpeculation,
  }));

  const uniteOptions = unites.map(unite => ({
    value: unite.idUnite,
    label: unite.nomUnite,
  }));

  const magasinOptions = magasins.map(mag => ({
    value: mag.idMagasin,
    label: mag.nomMagasin,
  }));

  const monnaieOptions = monnaies.map(mon => ({
    value: mon.idMonnaie,
    label: `${mon.libelle} (${mon.codeMonnaie})`,
  }));


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Gestion des images
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
        aspect: [1, 1],
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
        allowsEditing: true,
        aspect: [1, 1],
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

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomProduit.trim()) {
      newErrors.nomProduit = 'Le nom du produit est requis';
    }

    if (!formData.quantiteStock.trim()) {
      newErrors.quantiteStock = 'La quantité est requise';
    } else if (isNaN(Number(formData.quantiteStock)) || Number(formData.quantiteStock) < 0) {
      newErrors.quantiteStock = 'Quantité invalide';
    }

    if (!formData.prix.trim()) {
      newErrors.prix = 'Le prix est requis';
    } else if (isNaN(Number(formData.prix)) || Number(formData.prix) <= 0) {
      newErrors.prix = 'Prix invalide';
    }

    if (!formData.speculation) {
      newErrors.speculation = 'La spéculation est requise';
    }

    if (!formData.unite) {
      newErrors.unite = 'L\'unité de mesure est requise';
    }

    if (!formData.magasin) {
      newErrors.magasin = 'Le magasin est requis';
    }

    if (!formData.monnaie) {
      newErrors.monnaie = 'La monnaie est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const stockData = {
        nomProduit: formData.nomProduit,
        codeStock: formData.codeStock || `PROD-${Date.now()}`,
        quantiteStock: Number(formData.quantiteStock),
        prix: Number(formData.prix),
        typeProduit: formData.typeProduit,
        origineProduit: formData.origineProduit,
        descriptionStock: formData.descriptionStock,
        photo: imageFile || '',
        zoneProduction: formData.zoneProduction ? { idZoneProduction: formData.zoneProduction } : undefined,
        speculation: { idSpeculation: formData.speculation },
        unite: { idUnite: formData.unite },
        magasin: { idMagasin: formData.magasin },
        monnaie: { idMonnaie: formData.monnaie },
        acteur: { idActeur: 'd48lrq5lpgw53adl0yq1' },
      };

      await createStock(stockData);

      Alert.alert('Succès', 'Produit créé avec succès', [
        {
          text: 'OK',
          onPress: () => {
            // Réinitialiser le formulaire
            setFormData({
              nomProduit: '',
              codeStock: '',
              quantiteStock: '',
              prix: '',
              typeProduit: '',
              origineProduit: '',
              descriptionStock: '',
              zoneProduction: '',
              speculation: '',
              unite: '',
              magasin: '',
              monnaie: '',
            });
            setImagePreview('');
            setImageFile(null);
            setErrors({});

            // Retourner à la liste ou rester sur la page
            router.back()
          }
        }
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la création du produit');
      console.error('Erreur création produit:', error);
    }
  };

  if (loadingData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#079C48" />
          <Text className="text-gray-500 mt-4">Chargement des données...</Text>
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
                Nouveau produit
              </Text>
              <Text className="text-gray-500 text-xs">
                Ajoutez un produit à votre stock
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
            {/* Photo du produit */}
            <ImagePickerSection
              imagePreview={imagePreview}
              onPickImage={pickImage}
              onTakePhoto={takePhoto}
              onRemoveImage={removeImage}
              title="Photo du produit"
              description="PNG, JPG max 5MB"
              aspectRatio={[1, 1]}
            />

            {/* Informations de base */}
            <FormInput
              label="Nom du produit *"
              placeholder="Ex: Pommes Golden, Riz local..."
              value={formData.nomProduit}
              onChange={value => handleInputChange('nomProduit', value)}
              error={errors.nomProduit}
              iconLeft={<Package size={20} color="#94A3B8" />}
            />

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <FormInput
                  label="Code produit"
                  placeholder="Auto-généré si vide"
                  value={formData.codeStock}
                  onChange={value => handleInputChange('codeStock', value)}
                  iconLeft={<Barcode size={20} color="#94A3B8" />}
                />
              </View>
            </View>

            {/* Prix et Quantité */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <FormInput
                  label="Prix *"
                  placeholder="0"
                  value={formData.prix}
                  onChange={value => handleInputChange('prix', value)}
                  error={errors.prix}
                  type="number"
                  keyboardType="decimal-pad"
                  iconLeft={<DollarSign size={20} color="#94A3B8" />}
                />
              </View>
              <View className="flex-1">
                <FormInput
                  label="Quantité *"
                  placeholder="0"
                  value={formData.quantiteStock}
                  onChange={value => handleInputChange('quantiteStock', value)}
                  error={errors.quantiteStock}
                  type="number"
                  keyboardType="numeric"
                  iconLeft={<HashIcon size={20} color="#94A3B8" />}
                />
              </View>
            </View>

            {/* Sélecteurs requis */}
            <FormSelect
              label="Spéculation *"
              placeholder="Sélectionnez une spéculation"
              value={formData.speculation}
              onValueChange={value => handleInputChange('speculation', value)}
              items={speculationOptions}
              error={errors.speculation}
              searchable
              required
            />

            <FormSelect
              label="Unité de mesure *"
              placeholder="Sélectionnez une unité"
              value={formData.unite}
              onValueChange={value => handleInputChange('unite', value)}
              items={uniteOptions}
              error={errors.unite}
              searchable
              required
            />

            <FormSelect
              label="Magasin *"
              placeholder="Sélectionnez un magasin"
              value={formData.magasin}
              onValueChange={value => handleInputChange('magasin', value)}
              items={magasinOptions}
              error={errors.magasin}
              searchable
              required
            />

            <FormSelect
              label="Monnaie *"
              placeholder="Sélectionnez une monnaie"
              value={formData.monnaie}
              onValueChange={value => handleInputChange('monnaie', value)}
              items={monnaieOptions}
              error={errors.monnaie}
              searchable
              required
            />

            {/* Informations supplémentaires */}
            <FormInput
              label="Type de produit"
              placeholder="Ex: Fruits, Légumes, Céréales..."
              value={formData.typeProduit}
              onChange={value => handleInputChange('typeProduit', value)}
              iconLeft={<Type size={20} color="#94A3B8" />}
            />
            <FormSelect
              label="Zone de production"
              placeholder="Sélectionnez une zone"
              value={formData.zoneProduction}
              onValueChange={value => handleInputChange('zoneProduction', value)}
              items={zoneOptions}
              searchable
            />

            <FormInput
              label="Origine du produit"
              placeholder="Ex: Région de l'Ouest, Importé de..."
              value={formData.origineProduit}
              onChange={value => handleInputChange('origineProduit', value)}
              iconLeft={<Globe size={20} color="#94A3B8" />}
            />

            {/* Description */}
            <FormInput
              label="Description"
              placeholder="Décrivez votre produit (caractéristiques, qualité, etc.)"
              value={formData.descriptionStock}
              onChange={value => handleInputChange('descriptionStock', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              containerClassName="mb-4"
              inputClassName="h-32 border-gray-300"
              iconLeft={<Info size={20} color="#94A3B8" />}
            />

            {/* Bouton de soumission */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loadingStocks}
              className={`
                w-full py-4 rounded-lg items-center justify-center
                ${loadingStocks ? 'bg-primary/70' : 'bg-primary'}
                active:opacity-90 mb-4
              `}
              activeOpacity={0.8}
            >
              {loadingStocks ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-black font-bold text-base ml-2">
                    Création en cours...
                  </Text>
                </View>
              ) : (
                <Text className="text-black font-bold text-base">
                  Ajouter le produit
                </Text>
              )}
            </TouchableOpacity>

            {/* Informations supplémentaires */}
            <View className="p-3 bg-green-50 rounded-lg border border-green-100">
              <Text className="text-green-800 text-xs">
                📦 Votre produit sera visible dans votre stock et pourra être associé à des commandes.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}