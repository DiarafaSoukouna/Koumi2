import { useMerchant } from "@/context/Merchant";
import { Stock } from "@/Types/Stock";
import { formatNumber } from "@/utils/formatters";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Eye,
  MapPin,
  Package,
  Share2,
  Store,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const { stocks, loadingStocks } = useMerchant();
  const [product, setProduct] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stocks.length > 0 && id) {
      const foundProduct = stocks.find((stock) => stock.idStock === id);
      setProduct(foundProduct || null);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [stocks, id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading || loadingStocks) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#079C48" />
        <Text className="mt-4 text-gray-600">Chargement du produit...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Package size={64} color="#CBD5E1" />
        <Text className="text-xl font-bold text-gray-800 mt-4">
          Produit non trouvé
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          Le produit que vous recherchez n'existe pas ou a été supprimé.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 bg-primary rounded-full"
        >
          <Text className="text-white font-medium">Retour aux produits</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleOpenMap = () => {
    if (
      product?.zoneProduction?.latitude &&
      product?.zoneProduction?.longitude
    ) {
      const url = `https://www.google.com/maps/search/?api=1&query=${product.zoneProduction.latitude},${product.zoneProduction.longitude}`;
      Linking.openURL(url).catch((err) => {
        Alert.alert("Erreur", "Impossible d'ouvrir la carte");
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* En-tête */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>

        <Text
          className="text-lg font-bold text-gray-800 flex-1 px-4"
          numberOfLines={1}
        >
          {product.nomProduit}
        </Text>

        <TouchableOpacity
          onPress={() => {
            /* Logique de partage */
          }}
          className="p-2"
        >
          <Share2 size={24} color="#079C48" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Image produit */}
        <View className="h-64 bg-gray-100">
          {product.photo ? (
            <Image
              source={{ uri: product.photo }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Package size={64} color="#079C48" />
            </View>
          )}
        </View>

        {/* Version minimaliste */}
        <View className="px-4 pt-6">
          {/* En-tête produit */}
          <View className="mb-6">
            <View className="mb-4">
              <Text className="text-xs text-primary font-semibold uppercase tracking-wide mb-2">
                {product.speculation?.categorieProduit?.libelleCategorie}
              </Text>
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                {product.nomProduit}
              </Text>
              <Text className="text-gray-500">
                {product.speculation?.nomSpeculation} • {product.codeStock}
              </Text>
            </View>

            {/* Prix et stock */}
            <View className="mb-6">
              <Text className="text-3xl font-bold text-gray-900 mb-1">
                {formatNumber(product.prix)} {product.monnaie.sigle}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500 text-sm">
                  / {product.unite.nomUnite} ({product.unite.sigleUnite})
                </Text>
                <Text
                  className={`text-sm font-medium ${
                    product.quantiteStock > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.quantiteStock > 0
                    ? `✓ ${formatNumber(product.quantiteStock)} disponibles`
                    : "✗ Rupture"}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          {product.descriptionStock && (
            <View className="mb-8">
              <Text className="text-gray-800 font-medium mb-3">
                Description
              </Text>
              <Text className="text-gray-600 leading-relaxed">
                {product.descriptionStock}
              </Text>
            </View>
          )}

          {/* Spécifications */}
          <View className="mb-8">
            <Text className="text-gray-800 font-medium mb-4">
              Spécifications
            </Text>
            <View className="space-y-3">
              <View className="flex-row border-b border-gray-100 pb-3">
                <Text className="text-gray-500 flex-1">Type</Text>
                <Text className="text-gray-900 font-medium flex-1 text-right">
                  {product.typeProduit || "-"}
                </Text>
              </View>
              <View className="flex-row border-b border-gray-100 pb-3">
                <Text className="text-gray-500 flex-1">Forme</Text>
                <Text className="text-gray-900 font-medium flex-1 text-right">
                  {product.formeProduit || "-"}
                </Text>
              </View>
              <View className="flex-row border-b border-gray-100 pb-3">
                <Text className="text-gray-500 flex-1">Origine</Text>
                <Text className="text-gray-900 font-medium flex-1 text-right">
                  {product.origineProduit || "-"}
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-gray-500 flex-1">Pays</Text>
                <Text className="text-gray-900 font-medium flex-1 text-right">
                  {product.pays || "-"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Informations principales */}
        <View className="px-4 pt-1">
          {/* Zone de production */}
          {product.zoneProduction && (
            <View className="mb-8">
              <Text className="text-gray-800 font-bold text-lg mb-4">
                Zone de production
              </Text>

              <TouchableOpacity
                className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                onPress={() => {
                  handleOpenMap();
                }}
              >
                <View className="flex-row items-start">
                  <MapPin size={24} color="#079C48" className="mr-3" />
                  <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-lg mb-1">
                      {product.zoneProduction.nomZoneProduction}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-primary font-medium flex-1">
                        Voir sur la carte
                      </Text>
                      <ChevronRight size={20} color="#079C48" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Magasin */}
          {product.magasin && (
            <View className="mb-8">
              <Text className="text-gray-800 font-bold text-lg mb-4">
                Magasin
              </Text>

              <TouchableOpacity
                className="bg-primary/5 rounded-xl p-4 border border-primary/20"
                onPress={() => {
                  router.push({
                    pathname: "/screen/DashbordScreen/store/[id]",
                    params: { id: product.magasin.idMagasin },
                  });
                }}
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-4">
                    <Store size={24} color="#079C48" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-lg mb-1">
                      {product.magasin.nomMagasin}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {product.magasin.localiteMagasin}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#079C48" />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Informations complémentaires */}
          <View className="mb-12">
            <Text className="text-gray-800 font-bold text-lg mb-4">
              Informations complémentaires
            </Text>

            <View className="space-y-3">
              <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
                <View className="flex-row items-center">
                  <Calendar size={20} color="#64748B" className="mr-3" />
                  <Text className="text-gray-600">Ajouté le</Text>
                </View>
                <Text className="text-gray-800 font-medium">
                  {formatDate(product.dateAjout)}
                </Text>
              </View>

              {product.dateModif && (
                <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
                  <View className="flex-row items-center">
                    <Calendar size={20} color="#64748B" className="mr-3" />
                    <Text className="text-gray-600">Dernière mise à jour</Text>
                  </View>
                  <Text className="text-gray-800 font-medium">
                    {formatDate(product.dateModif)}
                  </Text>
                </View>
              )}

              <View className="flex-row items-center justify-between py-3">
                <View className="flex-row items-center">
                  <Eye size={20} color="#64748B" className="mr-3" />
                  <Text className="text-gray-600">Nombre de consultations</Text>
                </View>
                <Text className="text-gray-800 font-medium">
                  {formatNumber(product.nbreView)}
                </Text>
              </View>
            </View>
            <View className="flex-row space-x-3 mb-8">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/screen/DashbordScreen/form/AddProductScreen",
                    params: { id: product.idStock },
                  })
                }
                className="flex-1 bg-yellow-500 py-4 rounded-lg items-center"
              >
                <Text className="text-white font-medium">
                  Modifier le produit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
