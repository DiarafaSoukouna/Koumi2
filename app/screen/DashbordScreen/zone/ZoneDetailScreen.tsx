import { useMerchant } from "@/context/Merchant";
import { ZoneProduction } from "@/Types/merchantType";
import { Stock } from "@/Types/Stock";
import { formatDate } from "@/utils/formatters";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Edit,
  ExternalLink,
  Globe,
  Leaf,
  MapPin,
  Navigation,
  Package,
  Plus,
  Share2,
  Trash2,
  Users,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
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
const { width } = Dimensions.get("window");

export default function ZoneDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { zonesProduction, deleteZoneProduction, stocks } = useMerchant();

  const [zone, setZone] = useState<ZoneProduction | null>(null);
  const [zoneProducts, setZoneProducts] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && zonesProduction.length > 0) {
      const foundZone = zonesProduction.find((z) => z.idZoneProduction === id);
      setZone(foundZone || null);

      if (foundZone) {
        const products = stocks.filter(
          (stock) =>
            stock.zoneProduction?.idZoneProduction ===
            foundZone.idZoneProduction
        );
        setZoneProducts(products);
      }
      setLoading(false);
    }
  }, [id, zonesProduction, stocks]);

  const handleDelete = async () => {
    Alert.alert(
      "Supprimer la zone",
      "Êtes-vous sûr de vouloir supprimer cette zone de production ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteZoneProduction(id);
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

  const handleOpenMap = () => {
    if (zone?.latitude && zone?.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${zone.latitude},${zone.longitude}`;
      Linking.openURL(url).catch((err) => {
        Alert.alert("Erreur", "Impossible d'ouvrir la carte");
      });
    }
  };

  const handleShare = async () => {
    if (!zone) return;

    try {
      await Share.share({
        title: zone.nomZoneProduction,
        message: `Zone de production: ${zone.nomZoneProduction}\nCoordonnées: ${
          zone.latitude
        }, ${zone.longitude}\nDate de création: ${formatDate(zone.dateAjout)}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar style="dark" />
        <View className="flex-1 items-center justify-center">
          <View className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#079C48]"></View>
          <Text className="text-gray-600 mt-4 font-medium">
            Chargement de la zone...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!zone) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar style="dark" />
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-32 h-32 bg-gray-100 rounded-full items-center justify-center mb-6">
            <Globe size={56} color="#9CA3AF" />
          </View>
          <Text className="text-gray-700 text-xl font-bold mb-2">
            Zone non trouvée
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            La zone que vous recherchez n'existe pas ou a été supprimée.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="px-8 py-4 bg-yellow-500 rounded-lg shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header Fixe */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between w-full">
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
              {zone.nomZoneProduction}
            </Text>
            <Text
              className="text-gray-500 text-xs text-center"
              numberOfLines={1}
            >
              Zone de production
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
          {zone.photoZone ? (
            <Image
              source={{ uri: zone.photoZone }}
              className="w-full h-80"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-80 bg-gradient-to-br from-green-50 to-emerald-100 items-center justify-center">
              <Leaf size={80} color="#059669" opacity={0.8} />
              <Text className="text-gray-500 mt-3 font-medium">
                Aucune photo disponible
              </Text>
            </View>
          )}

          {/* Badge zone */}
          <View className="absolute top-4 right-4">
            <View className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm flex-row items-center">
              <Globe size={16} color="#059669" />
              <Text className="font-semibold text-gray-800 text-sm ml-2">
                Zone de production
              </Text>
            </View>
          </View>
        </View>

        {/* Section Informations principales */}
        <View className="px-4 pt-6">
          {/* Carte principale */}
          <View className="bg-white p-1 mb-4">
            <View className="mb-5">
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {zone.nomZoneProduction}
              </Text>
              <View className="flex-row items-center">
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-700 text-sm font-semibold">
                    Zone agricole
                  </Text>
                </View>
                {zoneProducts.length > 0 && (
                  <View className="ml-2 bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-blue-700 text-sm font-semibold">
                      {zoneProducts.length} produit
                      {zoneProducts.length !== 1 ? "s" : ""}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Métriques */}
            <View className="flex-row justify-between mb-6">
              <View className="items-center">
                <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center mb-2">
                  <Package size={24} color="#059669" />
                </View>
                <Text className="text-black-500 text-xs mb-1">Produits</Text>
                <Text className="text-2xl font-bold text-gray-900">
                  {zoneProducts.length}
                </Text>
              </View>

              <View className="items-center">
                <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-2">
                  <Calendar size={24} color="#3B82F6" />
                </View>
                <Text className="text-gray-500 text-xs mb-1">Crée le</Text>
                <Text className="text-base font-bold text-gray-900">
                  {formatDate(zone.dateAjout).split(" ")[0]}
                </Text>
              </View>

              <View className="items-center">
                <View className="w-12 h-12 bg-purple-50 rounded-full items-center justify-center mb-2">
                  <Users size={24} color="#8B5CF6" />
                </View>
                <Text className="text-black-500 text-xs mb-1">Modifié par</Text>
                <Text
                  className="text-base font-bold text-gray-900"
                  numberOfLines={1}
                >
                  {zone.personneModif || "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* Section Localisation */}
          <View className="bg-white p-1 mb-2">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-xl font-bold text-gray-900">
                Localisation
              </Text>
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                <MapPin size={20} color="#3B82F6" />
              </View>
            </View>

            {zone.latitude && zone.longitude ? (
              <>
                <View className="mb-6">
                  <TouchableOpacity
                    onPress={handleOpenMap}
                    className="flex-row items-center bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-5 active:scale-95 transition-all"
                    activeOpacity={0.9}
                  >
                    <View className="w-14 h-14 bg-yellow-500 rounded-full items-center justify-center shadow-lg mr-4">
                      <MapPin size={28} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-bold text-base">
                        Ouvrir la localisation
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        Voir cette zone sur la carte
                      </Text>
                    </View>
                    <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center">
                      <ExternalLink size={18} color="white" />
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View className="items-center py-8">
                <MapPin size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-3 font-medium">
                  Aucune localisation disponible
                </Text>
              </View>
            )}
          </View>

          {/* Section Produits */}
          {zoneProducts.length > 0 && (
            <View className="bg-white p-1 mb-2">
              <View className="flex-row items-center justify-between mb-5">
                <View>
                  <Text className="text-xl font-bold text-gray-900">
                    Produits de la zone
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    {zoneProducts.length} produit
                    {zoneProducts.length !== 1 ? "s" : ""} cultivé
                    {zoneProducts.length !== 1 ? "s" : ""}
                  </Text>
                </View>
                <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
                  <Package size={20} color="#F59E0B" />
                </View>
              </View>

              <View className="space-y-3">
                {zoneProducts.slice(0, 5).map((product) => (
                  <TouchableOpacity
                    key={product.idStock}
                    onPress={() =>
                      router.push({
                        pathname: "/screen/DashbordScreen/ProductDetailScreen",
                        params: { id: product.idStock },
                      })
                    }
                    className="flex-row items-center p-4 bg-gray-50 rounded-xl border border-gray-200"
                    activeOpacity={0.7}
                  >
                    <View className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl items-center justify-center mr-4">
                      <Package size={24} color="#D97706" />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-bold text-gray-900 text-base mb-1"
                        numberOfLines={1}
                      >
                        {product.nomProduit}
                      </Text>
                      <View className="flex-row items-center">
                        <Text className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                          {product.magasin?.nomMagasin || "Non spécifié"}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {product.quantiteStock} unités
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}

                {zoneProducts.length > 5 && (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/screen/DashbordScreen/ProductsListScreen",
                        params: { zone: zone.idZoneProduction },
                      })
                    }
                    className="flex-row items-center justify-center py-3 mt-2"
                    activeOpacity={0.7}
                  >
                    <Plus size={20} color="#059669" className="mr-2" />
                    <Text className="text-black font-semibold text-base">
                      Voir tous les produits ({zoneProducts.length})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Section Actions */}
          <View className="bg-white p-1 mb-1">
            <Text className="text-xl font-bold text-gray-900 mb-5">
              Gestion de la zone
            </Text>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Information",
                  "La modification de la zone sera bientôt disponible"
                )
              }
              className="flex-row items-center justify-center py-4 bg-[#079C48] rounded-xl mb-3"
              activeOpacity={0.8}
            >
              <Edit size={22} color="white" className="mr-3" />
              <Text className="text-white font-semibold text-base">
                Modifier la zone
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="flex-row items-center justify-center py-4 border-2 border-red-200 bg-red-50 rounded-xl"
              activeOpacity={0.8}
            >
              <Trash2 size={22} color="#DC2626" className="mr-3" />
              <Text className="text-red-600 font-semibold text-base">
                Supprimer la zone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Informations supplémentaires */}
          <View className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
            <View className="flex-row items-start">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                <Navigation size={22} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-green-900 text-lg font-bold mb-2">
                  À propos de cette zone
                </Text>
                <View className="space-y-2">
                  <Text className="text-green-800 text-sm">
                    • Cette zone représente une superficie de production
                    agricole
                  </Text>
                  <Text className="text-green-800 text-sm">
                    • Les produits cultivés ici sont directement liés à cette
                    zone
                  </Text>
                  <Text className="text-green-800 text-sm">
                    • Les coordonnées GPS permettent de localiser précisément la
                    zone
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
