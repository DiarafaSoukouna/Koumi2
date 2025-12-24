import React from "react";
import { FlatList, View } from "react-native";

export default function IntrantsPreviewListSkeleton() {
  // Créer 5 cartes skeleton (comme dans l'UI réelle)
  const skeletonCards = Array.from({ length: 5 }, (_, i) => i);

  const renderSkeletonCard = () => (
    <View className="w-40 mr-4">
      {/* Carte produit skeleton */}
      <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Image skeleton */}
        <View className="w-full h-32 bg-gray-200 relative overflow-hidden">
          <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </View>

        {/* Informations produit skeleton */}
        <View className="p-3">
          {/* Nom du produit */}
          <View className="h-4 w-28 bg-gray-200 rounded mb-2 overflow-hidden">
            <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </View>
          <View className="h-3 w-20 bg-gray-200 rounded mb-3 overflow-hidden">
            <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </View>

          {/* Forme et quantité */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="h-3 w-14 bg-gray-200 rounded overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>
            <View className="h-3 w-12 bg-gray-200 rounded overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>
          </View>

          {/* Prix */}
          <View className="flex-row items-center justify-between">
            <View className="h-5 w-16 bg-gray-200 rounded overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>
            <View className="h-3 w-8 bg-gray-200 rounded overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="bg-amber-50 p-4 -mx-4 mb-6 mt-4">
      {/* En-tête skeleton */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-6 h-6 bg-gray-200 rounded-full mr-2 overflow-hidden">
            <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </View>
          <View className="h-6 w-40 bg-gray-200 rounded-lg overflow-hidden">
            <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </View>
        </View>

        <View className="h-8 w-20 bg-gray-200 rounded-lg overflow-hidden">
          <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </View>
      </View>

      {/* Description skeleton */}
      <View className="h-4 w-full bg-gray-200 rounded mb-4 overflow-hidden">
        <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </View>
      <View className="h-4 w-3/4 bg-gray-200 rounded mb-6 overflow-hidden">
        <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </View>

      {/* Liste horizontale skeleton */}
      <FlatList
        data={skeletonCards}
        renderItem={renderSkeletonCard}
        keyExtractor={(item) => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={164}
      />
    </View>
  );
}
