import { Intrant } from "@/Types/intrant";
import { useRouter } from "expo-router";
import { ChevronRight, Eye, Leaf, Package } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IntrantsPreviewListProps {
  intrants: Intrant[];
  loading?: boolean;
  onPressItem: (intrant: Intrant) => void;
}

export default function IntrantsPreviewList({
  intrants,
  loading = false,
  onPressItem,
}: IntrantsPreviewListProps) {
  const router = useRouter();

  // Limiter à 10 intrants pour la prévisualisation
  const displayedIntrants = intrants?.slice(0, 7) || [];

  const formatPrice = (price: number, monnaie?: any) => {
    if (!price) return "0";
    const formatted = new Intl.NumberFormat("fr-FR").format(price);
    return monnaie ? `${formatted} ${monnaie.libelle || ""}` : `${formatted}`;
  };

  const renderIntrantCard = ({ item }: { item: Intrant }) => {
    const isExpired = item.dateExpiration
      ? new Date(item.dateExpiration) < new Date()
      : false;

    return (
      <TouchableOpacity
        onPress={() => onPressItem(item)}
        className="w-40 mr-4"
        activeOpacity={0.8}
      >
        {/* Carte produit */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Image produit */}
          <View className="relative">
            {item.photoIntrant ? (
              <Image
                source={{ uri: item.photoIntrant }}
                className="w-full h-32"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-32 bg-gray-100 items-center justify-center">
                <Leaf size={32} color="#9CA3AF" />
              </View>
            )}

            {/* Badges */}
            <View className="absolute top-2 left-2">
              {isExpired ? (
                <View className="bg-red-500 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-bold">EXPIRÉ</Text>
                </View>
              ) : item.dateExpiration ? (
                <View className="bg-amber-500 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-bold">
                    PÉRISSABLE
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Statut disponibilité */}
            <View className="absolute top-2 right-2">
              <View
                className={`px-2 py-1 rounded-full ${
                  item.statutIntrant ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    item.statutIntrant ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.statutIntrant ? "DISPONIBLE" : "RUPTURE"}
                </Text>
              </View>
            </View>

            {/* Catégorie */}
            {item.categorieProduit && (
              <View className="absolute bottom-2 left-2">
                <View className="bg-black/70 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs" numberOfLines={1}>
                    {item.categorieProduit.libelleCategorie}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Informations produit */}
          <View className="p-3">
            {/* Nom du produit */}
            <Text
              className="font-bold text-gray-800 text-sm mb-1"
              numberOfLines={2}
              style={{ lineHeight: 16 }}
            >
              {item.nomIntrant || "Nom non disponible"}
            </Text>

            {/* Forme et quantité */}
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600 text-xs" numberOfLines={1}>
                {item.forme?.libelleForme || "N/A"}
              </Text>
              <Text className="text-gray-800 text-xs font-semibold">
                {item.quantiteIntrant || 0} {item.unite || ""}
              </Text>
            </View>

            {/* Prix */}
            <View className="flex-row items-center justify-between">
              <Text className="text-primary text-lg font-bold">
                {formatPrice(item.prixIntrant || 0, item.monnaie)}
              </Text>

              {/* Statistiques */}
              <View className="flex-row items-center space-x-2">
                <View className="flex-row items-center">
                  <Eye size={12} color="#6B7280" />
                  <Text className="text-gray-500 text-xs ml-1">
                    {item.nbreView || 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="bg-white rounded-2xl p-4 -mx-4 mb-6 mt-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Leaf size={24} color="#079C48" className="mr-2" />
            <Text className="text-xl font-bold text-gray-800">
              Intrants Agricoles
            </Text>
          </View>
        </View>
        <View className="h-64 items-center justify-center">
          <ActivityIndicator size="large" color="#079C48" />
          <Text className="text-gray-500 mt-2">Chargement des intrants...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-amber-50 p-4 -mx-4 mb-6 mt-4">
      {/* En-tête avec titre et bouton "Voir plus" */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Leaf size={24} color="#079C48" className="mr-2" />
          <Text className="text-xl font-bold text-gray-800">
            Intrants Agricoles
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/screen/intrant")}
          className="flex-row items-center bg-primary/10 px-3 py-2 rounded-lg"
          activeOpacity={0.7}
        >
          <Text className="text-primary font-semibold text-sm mr-1">
            Voir plus
          </Text>
          <ChevronRight size={16} color="#079C48" />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <Text className="text-gray-600 text-sm mb-4">
        Découvrez notre sélection d'intrants agricoles de qualité pour vos
        cultures
      </Text>

      {/* Liste horizontale des intrants */}
      {displayedIntrants.length > 0 ? (
        <FlatList
          data={displayedIntrants}
          renderItem={renderIntrantCard}
          keyExtractor={(item) => item.idIntrant || Math.random().toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
          decelerationRate="fast"
          snapToAlignment="start"
          snapToInterval={164} // Largeur de la carte (160) + marge (4)
          ListEmptyComponent={
            <View className="h-40 items-center justify-center">
              <Text className="text-gray-500">Aucun intrant disponible</Text>
            </View>
          }
        />
      ) : (
        <View className="items-center justify-center py-8">
          <Package size={48} color="#D1D5DB" />
          <Text className="text-gray-500 mt-3">Aucun intrant disponible</Text>
        </View>
      )}
    </View>
  );
}
