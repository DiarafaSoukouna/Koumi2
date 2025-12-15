import { useTransporteur } from "@/context/Transporteur";
import { Vehicule } from "@/Types/transportType";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle,
  CreditCard,
  DollarSign,
  Edit,
  ExternalLink,
  Eye,
  Gauge,
  Globe,
  MapPin,
  Share2,
  Trash2,
  Truck,
  Users,
  Wrench,
  XCircle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { vehicules, deleteVehicule } = useTransporteur();

  const [vehicle, setVehicle] = useState<Vehicule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && vehicules.length > 0) {
      const foundVehicle = vehicules.find((v) => v.idVehicule === id);
      setVehicle(foundVehicle || null);
      setLoading(false);
    }
  }, [id, vehicules]);

  const handleDelete = async () => {
    Alert.alert(
      "Supprimer le véhicule",
      "Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteVehicule(id);
              router.back();
            } catch (error: any) {
              Alert.alert(
                "Erreur",
                error.message || "Erreur lors de la suppression"
              );
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!vehicle) return;

    try {
      await Share.share({
        title: vehicle.nomVehicule,
        message: `Découvrez ${vehicle.nomVehicule} - ${vehicle.typeVoiture?.nom}. Capacité: ${vehicle.capaciteVehicule}. Localisation: ${vehicle.localisation}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleOpenMap = () => {
    // Utiliser Google Maps avec la localisation
    if (vehicle?.localisation) {
      const encodedLocation = encodeURIComponent(vehicle.localisation);
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
      Linking.openURL(url).catch((err) => {
        Alert.alert("Erreur", "Impossible d'ouvrir la carte");
      });
    }
  };

  const parsePriceDestination = (
    priceData: string | DestinationPrice | { [key: string]: number } | undefined
  ) => {
    if (!priceData) return {};
    if (typeof priceData === "string") {
      try {
        return JSON.parse(priceData);
      } catch (e) {
        return {};
      }
    }
    return priceData;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#079C48" />
          <Text className="text-gray-600 mt-4 font-medium">
            Chargement du véhicule...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-32 h-32 bg-gray-100 rounded-full items-center justify-center mb-6">
            <Car size={56} color="#9CA3AF" />
          </View>
          <Text className="text-gray-700 text-xl font-bold mb-2">
            Véhicule non trouvé
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Le véhicule que vous recherchez n'existe pas ou a été supprimé.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="px-8 py-4 bg-[#079C48] rounded-lg shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const priceDestination = parsePriceDestination(vehicle.prixParDestination);
  const hasPriceDestination = Object.keys(priceDestination).length > 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header Fixe */}
      <View className="bg-white px-4 py-4 border-b border-gray-200 shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color="#1F2937" />
          </TouchableOpacity>

          <View className="flex-1 mx-3">
            <Text
              className="text-lg font-bold text-gray-900 text-center"
              numberOfLines={1}
            >
              {vehicle.nomVehicule}
            </Text>
            <Text
              className="text-gray-500 text-xs text-center"
              numberOfLines={1}
            >
              {vehicle.codeVehicule}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleShare}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
              activeOpacity={0.7}
            >
              <Share2 size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Section Image */}
        <View className="relative">
          {vehicle.photoVehicule ? (
            <Image
              source={{ uri: vehicle.photoVehicule }}
              className="w-full h-72"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-72 bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center">
              <Car size={80} color="#4F46E5" opacity={0.8} />
              <Text className="text-gray-500 mt-3 font-medium">
                Aucune photo disponible
              </Text>
            </View>
          )}

          {/* Badge de statut */}
          <View className="absolute top-4 right-4">
            <View
              className={`px-4 py-2 rounded-full flex-row items-center ${
                vehicle.statutVehicule ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {vehicle.statutVehicule ? (
                <>
                  <CheckCircle size={16} color="white" />
                  <Text className="font-semibold text-white text-sm ml-2">
                    Disponible
                  </Text>
                </>
              ) : (
                <>
                  <XCircle size={16} color="white" />
                  <Text className="font-semibold text-white text-sm ml-2">
                    Indisponible
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Section Informations principales */}
        <View className="px-4 pt-6">
          <View className="bg-white p-2 mb-2">
            <View className="mb-5">
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {vehicle.nomVehicule}
              </Text>
              <View className="flex-row items-center">
                <View className="bg-blue-100 px-3 py-1 rounded-full">
                  <Text className="text-blue-700 text-sm font-semibold">
                    {vehicle.typeVoiture?.nom}
                  </Text>
                </View>
              </View>
            </View>

            {vehicle.description && (
              <View className="mb-6 p-3 bg-gray-50 rounded-xl">
                <Text className="text-gray-700 text-sm leading-relaxed">
                  {vehicle.description}
                </Text>
              </View>
            )}

            {/* Métriques importantes */}
            <View className="flex-row justify-between mb-6">
              <View className="items-center">
                <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-2">
                  <Users size={28} color="#3B82F6" />
                </View>
                <Text className="text-gray-500 text-xs mb-1">Capacité</Text>
                <Text className="text-2xl font-bold text-gray-900">
                  {vehicle.capaciteVehicule}
                </Text>
              </View>

              <View className="items-center">
                <View className="w-16 h-16 bg-green-50 rounded-full items-center justify-center mb-2">
                  <Gauge size={28} color="#10B981" />
                </View>
                <Text className="text-gray-500 text-xs mb-1">Kilométrage</Text>
                <Text className="text-2xl font-bold text-gray-900">
                  {vehicle.nbKilometrage.toLocaleString()}
                </Text>
                <Text className="text-gray-400 text-xs">km</Text>
              </View>

              <View className="items-center">
                <View className="w-16 h-16 bg-purple-50 rounded-full items-center justify-center mb-2">
                  <Eye size={28} color="#8B5CF6" />
                </View>
                <Text className="text-gray-500 text-xs mb-1">Vues</Text>
                <Text className="text-2xl font-bold text-gray-900">
                  {vehicle.nbreView || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Section Détails */}
          <View className="bg-white p-5 mb-4">
            <Text className="text-xl font-bold text-gray-900 mb-5">
              Détails du véhicule
            </Text>

            <View className="space-y-4">
              {/* Localisation */}
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <MapPin size={20} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm">Localisation</Text>
                  <Text className="text-gray-900 font-medium">
                    {vehicle.localisation}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleOpenMap}
                  className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                  activeOpacity={0.7}
                >
                  <ExternalLink size={18} color="#079C48" />
                </TouchableOpacity>
              </View>

              {/* Pays */}
              {vehicle.pays && (
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                    <Globe size={20} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-sm">Pays</Text>
                    <Text className="text-gray-900 font-medium">
                      {vehicle.pays}
                    </Text>
                  </View>
                </View>
              )}

              {/* État */}
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                  <Wrench size={20} color="#F59E0B" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm">État</Text>
                  <Text className="text-gray-900 font-medium">
                    {vehicle.etatVehicule || "Non spécifié"}
                  </Text>
                </View>
              </View>

              {/* Devise */}
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-3">
                  <CreditCard size={20} color="#D97706" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm">Devise acceptée</Text>
                  <Text className="text-gray-900 font-medium">
                    {vehicle.monnaie.libelle} ({vehicle.monnaie.sigle})
                  </Text>
                </View>
              </View>

              {/* Date d'ajout */}
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                  <Calendar size={20} color="#8B5CF6" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm">Date d'ajout</Text>
                  <Text className="text-gray-900 font-medium">
                    {formatDate(vehicle.dateAjout)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Prix par destination */}
          {hasPriceDestination && (
            <View className="bg-white   p-5 mb-4">
              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-xl font-bold text-gray-900">
                  Prix par destination
                </Text>
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                  <DollarSign size={20} color="#059669" />
                </View>
              </View>

              <View className="space-y-3">
                {Object.entries(priceDestination).map(
                  ([destination, price], index) => (
                    <View
                      key={index}
                      className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <View className="flex-row items-center flex-1">
                        <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                          <Truck size={16} color="#3B82F6" />
                        </View>
                        <Text
                          className="text-gray-800 font-medium flex-1"
                          numberOfLines={1}
                        >
                          {destination}
                        </Text>
                      </View>
                      <Text className="text-gray-900 font-bold text-lg">
                        {formatCurrency(Number(price) || 0)}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          )}

          {/* Section Actions */}
          <View className="bg-white   p-5 mb-4">
            <Text className="text-xl font-bold text-gray-900 mb-5">
              Actions
            </Text>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Information",
                  "La modification du véhicule sera bientôt disponible"
                )
              }
              className="flex-row items-center justify-center py-4 bg-[#079C48] rounded-xl mb-3"
              activeOpacity={0.8}
            >
              <Edit size={22} color="white" className="mr-3" />
              <Text className="text-white font-semibold text-base">
                Modifier le véhicule
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="flex-row items-center justify-center py-4 border-2 border-red-200 bg-red-50 rounded-xl"
              activeOpacity={0.8}
            >
              <Trash2 size={22} color="#DC2626" className="mr-3" />
              <Text className="text-red-600 font-semibold text-base">
                Supprimer le véhicule
              </Text>
            </TouchableOpacity>
          </View>

          {/* Note informative */}
          <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
            <View className="flex-row items-start">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <AlertCircle size={22} color="#1D4ED8" />
              </View>
              <View className="flex-1">
                <Text className="text-blue-900 text-lg font-bold mb-2">
                  Informations importantes
                </Text>
                <View className="space-y-2">
                  <Text className="text-blue-800 text-sm">
                    • Ce véhicule est visible pour les clients et peut être
                    réservé
                  </Text>
                  <Text className="text-blue-800 text-sm">
                    • Mettez régulièrement à jour les informations du véhicule
                  </Text>
                  <Text className="text-blue-800 text-sm">
                    • Le statut "Indisponible" masque le véhicule des recherches
                    clients
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
