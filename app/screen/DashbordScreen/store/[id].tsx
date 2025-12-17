import { useMerchant } from "@/context/Merchant";
import { Magasin } from "@/Types/merchantType";
import { Stock } from "@/Types/Stock";
import { formatDate } from "@/utils/formatters";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Edit,
  Eye,
  FileText,
  Globe,
  MapPin,
  MessageCircle,
  Navigation,
  Package,
  Phone,
  Share2,
  Store,
  Trash2,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReportGenerator from "./ReportGenerator";

export default function StoreDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("ID magasin:", id);
  const { magasins, deleteMagasin, stocks } = useMerchant();

  const [store, setStore] = useState<Magasin | null>(null);
  const [storeProducts, setStoreProducts] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportOptions, setShowReportOptions] = useState(false);

  useEffect(() => {
    if (id && magasins.length > 0) {
      const foundStore = magasins.find((m) => m.idMagasin === id);
      console.log("Magasin trouvé:", foundStore);
      setStore(foundStore || null);

      if (foundStore) {
        const products = stocks.filter((stock) => {
          return (
            stock.magasin && stock.magasin.idMagasin === foundStore.idMagasin
          );
        });
        console.log("Produits trouvés pour le magasin:", products.length);
        setStoreProducts(products);
      } else {
        console.log("Magasin non trouvé avec ID:", id);
      }

      setLoading(false);
    } else if (magasins.length === 0) {
      console.log("Aucun magasin disponible");
      setLoading(false);
    }
  }, [id, magasins, stocks]);

  const handleDelete = async () => {
    Alert.alert(
      "Supprimer le magasin",
      "Êtes-vous sûr de vouloir supprimer ce magasin ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMagasin(id);
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
    if (!store) return;

    try {
      await Share.share({
        title: store.nomMagasin,
        message: `Découvrez ${store.nomMagasin} situé à ${store.localiteMagasin}. Contact: ${store.contactMagasin} `,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const openWhatsApp = () => {
    if (!store?.contactMagasin) {
      Alert.alert("Erreur", "Numéro WhatsApp non disponible");
      return;
    }

    const phone = store.contactMagasin.replace(/\s+/g, "").replace("+", "");
    const message = `Bonjour, je suis intéressé par votre magasin : ${store.nomMagasin}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert("Erreur", "Impossible d'ouvrir WhatsApp");
    });
  };

  const openPhone = () => {
    if (!store?.contactMagasin) {
      Alert.alert("Erreur", "Numéro de téléphone non disponible");
      return;
    }

    const phone = store.contactMagasin.replace(/\s+/g, "");
    const url = `tel:${phone}`;

    Linking.openURL(url).catch(() => {
      Alert.alert("Erreur", "Impossible de composer le numéro");
    });
  };

  const openMap = () => {
    if (!store?.latitude || !store?.longitude) {
      Alert.alert("Erreur", "Coordonnées GPS non disponibles");
      return;
    }

    const lat = parseFloat(store.latitude);
    const lng = parseFloat(store.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert("Erreur", "Coordonnées GPS invalides");
      return;
    }

    const url = Platform.select({
      ios: `maps://?q=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(
        store.nomMagasin
      )})`,
      default: `https://maps.google.com/?q=${lat},${lng}`,
    });

    Linking.openURL(url!).catch(() => {
      Alert.alert("Erreur", "Impossible d'ouvrir l'application de carte");
    });
  };

  const navigateToAllProducts = () => {
    if (storeProducts.length === 0) return;

    router.push({
      pathname: "/screen/DashbordScreen/produits/ProductsListScreen",
      params: {
        magasinId: store?.idMagasin,
        magasinName: store?.nomMagasin,
      },
    });
  };

  const navigateToProductDetail = (productId: string) => {
    router.push({
      pathname: "/screen/DashbordScreen/produits/[id]",
      params: { id: productId },
    });
  };

  const getProductImage = (product: Stock) => {
    if (product.photo) return product.photo;
    return null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price);
  };

  const calculateTotalValue = () => {
    return storeProducts.reduce((total, product) => {
      return total + product.prix * product.quantiteStock;
    }, 0);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!store) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-4">
          <Store size={64} color="#CBD5E1" />
          <Text className="text-gray-500 mt-4 text-lg">Magasin non trouvé</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 px-6 py-3 bg-primary rounded-full"
          >
            <Text className="text-white font-medium">Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header amélioré */}
      <View className="bg-white px-4 pt-12 pb-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-2 mr-2 bg-black/20 rounded-full"
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-black" numberOfLines={1}>
                {store.nomMagasin}
              </Text>
              <Text className="text-black/80 text-sm" numberOfLines={1}>
                {store.localiteMagasin}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleShare}
              className="p-2 bg-black/20 rounded-full"
            >
              <Share2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/screen/DashbordScreen/form/CreateStoreScreen",
                  params: { id: store.idMagasin },
                })
              }
              className="p-2 bg-black/20 rounded-full"
            >
              <Edit size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image du magasin */}
        <View className="relative -mt-8">
          <View>
            {store.photo ? (
              <Image
                source={{ uri: store.photo }}
                className="w-full h-72"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-64 bg-blue-50 items-center justify-center">
                <Store size={80} color="#079C48" />
              </View>
            )}
          </View>
        </View>

        {/* Informations principales en cartes */}
        <View className="px-2 mt-6">
          {/* Carte de localisation */}
          <View className="bg-white p-4 mb-3">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                <MapPin size={20} color="#079C48" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-sm">Localisation</Text>
                <Text className="text-gray-800 font-semibold text-lg">
                  {store.localiteMagasin}
                </Text>
                {store.pays && (
                  <Text className="text-gray-500 text-sm mt-1">
                    {store.pays}
                  </Text>
                )}
              </View>
            </View>

            {store.latitude && store.longitude && (
              <TouchableOpacity
                onPress={openMap}
                className="flex-row items-center justify-center py-3 bg-blue-50 rounded-xl mt-2 border border-blue-100"
              >
                <Navigation size={18} color="#3B82F6" className="mr-2" />
                <Text className="text-blue-600 font-medium">
                  Ouvrir la carte
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Carte de contact */}
          {store.contactMagasin && (
            <View className="bg-white p-4 mb-3">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mr-3">
                  <Phone size={20} color="#079C48" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm">Contact</Text>
                  <Text className="text-gray-800 font-semibold text-lg">
                    {store.contactMagasin}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={openPhone}
                  className="flex-1 flex-row items-center justify-center py-3 bg-green-50 rounded-xl border border-green-200"
                >
                  <Phone size={18} color="#079C48" className="mr-2" />
                  <Text className="text-green-700 font-medium">Appeler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={openWhatsApp}
                  className="flex-1 flex-row items-center justify-center py-3 bg-[#25D366]/10 rounded-xl border border-[#25D366]/20"
                >
                  <MessageCircle size={18} color="#25D366" className="mr-2" />
                  <Text className="text-[#25D366] font-medium">WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Carte d'informations */}
          <View className="bg-white p-4 mb-3">
            <Text className="text-gray-800 font-semibold text-lg mb-3">
              Informations
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Calendar size={18} color="#64748B" className="mr-3" />
                  <Text className="text-gray-600">Date de création</Text>
                </View>
                <Text className="text-gray-800 font-medium">
                  {formatDate(store.dateAjout || "")}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Eye size={18} color="#64748B" className="mr-3" />
                  <Text className="text-gray-600">Nombre de vues</Text>
                </View>
                <Text className="text-gray-800 font-medium">
                  {store.nbreView || 0}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Globe size={18} color="#64748B" className="mr-3" />
                  <Text className="text-gray-600">Pays</Text>
                </View>
                <Text className="text-gray-800 font-medium">
                  {store.pays || "Non renseigné"}
                </Text>
              </View>
            </View>
          </View>

          {/* Carte de statistiques */}
          <View className="bg-white p-4 mb-3 ">
            <Text className="text-gray-800 font-semibold text-lg mb-3">
              Statistiques
            </Text>

            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary">
                  {storeProducts.length}
                </Text>
                <Text className="text-gray-600 text-sm">Produits</Text>
              </View>

              <View className="items-center">
                <Text className="text-2xl font-bold text-primary">
                  {store.nbreView || 0}
                </Text>
                <Text className="text-gray-600 text-sm">Vues</Text>
              </View>

              <View className="items-center">
                <Text className="text-2xl font-bold text-primary">
                  {storeProducts.reduce(
                    (total, product) => total + product.quantiteStock,
                    0
                  )}
                </Text>
                <Text className="text-gray-600 text-sm">Stock total</Text>
              </View>

              <View className="items-center">
                <Text className="text-2xl font-bold text-primary">
                  {formatPrice(calculateTotalValue())} F
                </Text>
                <Text className="text-gray-600 text-sm">Valeur totale</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section produits */}
        <View className="px-4 mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-xl font-bold text-gray-800">
                Produits en stock
              </Text>
              <Text className="text-gray-500 text-sm">
                {storeProducts.length} produit
                {storeProducts.length !== 1 ? "s" : ""} disponible
                {storeProducts.length !== 1 ? "s" : ""}
              </Text>
            </View>
            {storeProducts.length > 0 && (
              <TouchableOpacity
                onPress={navigateToAllProducts}
                className="bg-yellow-500 px-4 py-2 rounded-full"
              >
                <Text className="text-black text-sm font-medium">
                  Voir tout
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {storeProducts.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {storeProducts.slice(0, 10).map((product) => (
                <TouchableOpacity
                  key={product.idStock}
                  onPress={() => navigateToProductDetail(product.idStock)}
                  className="bg-white rounded-xl p-3 mr-3 w-48 shadow-sm border border-gray-100"
                >
                  <View className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-primary/10 items-center justify-center">
                    {getProductImage(product) ? (
                      <Image
                        source={{ uri: getProductImage(product) }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <Package size={40} color="#079C48" />
                    )}
                  </View>

                  <Text
                    className="font-semibold text-gray-800 text-sm mb-1"
                    numberOfLines={1}
                  >
                    {product.nomProduit}
                  </Text>

                  <Text className="text-primary font-bold text-base mb-2">
                    {formatPrice(product.prix)} F CFA
                  </Text>

                  <View className="flex-row items-center justify-between">
                    <View className="bg-gray-100 px-2 py-1 rounded">
                      <Text className="text-gray-700 text-xs">
                        Stock: {product.quantiteStock}
                      </Text>
                    </View>
                    <ChevronRight size={14} color="#94A3B8" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center justify-center">
              <Package size={64} color="#CBD5E1" />
              <Text className="text-gray-400 mt-4 text-lg">
                Aucun produit disponible
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Ce magasin n'a pas encore ajouté de produits en stock
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View className="px-4 mt-6 mb-8">
          <TouchableOpacity
            onPress={() => setShowReportOptions(true)}
            className="flex-row items-center justify-center py-4 bg-white rounded-2xl mb-3 border border-gray-200 shadow-sm"
          >
            <FileText size={20} color="#3B82F6" className="mr-2" />
            <Text className="text-blue-600 font-medium">
              Générer un rapport
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className="flex-row items-center justify-center py-4 bg-white rounded-2xl border border-red-200 shadow-sm"
          >
            <Trash2 size={20} color="#EF4444" className="mr-2" />
            <Text className="text-red-600 font-medium">
              Supprimer le magasin
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal pour la génération de rapport */}
      {showReportOptions && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center px-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Générer un rapport
            </Text>
            <Text className="text-gray-500 mb-6">
              Choisissez le format du rapport pour le magasin {store.nomMagasin}
            </Text>

            <ReportGenerator
              store={store}
              products={storeProducts}
              onClose={() => setShowReportOptions(false)}
            />

            <TouchableOpacity
              onPress={() => setShowReportOptions(false)}
              className="mt-4 py-3 border border-gray-300 rounded-xl"
            >
              <Text className="text-gray-700 text-center font-medium">
                Annuler
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
