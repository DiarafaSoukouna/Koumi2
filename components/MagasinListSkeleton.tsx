// @/components/magasin/MagasinListSkeleton.tsx
import React from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 40) / 2;

export default function MagasinListSkeleton() {
  // Créer 6 éléments pour la grille
  const skeletonItems = Array.from({ length: 6 }, (_, i) => i);

  const MagasinGridSkeleton = () => (
    <View className="mb-4" style={{ width: ITEM_WIDTH }}>
      <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Image skeleton */}
        <View className="relative h-36 bg-gray-200 overflow-hidden">
          <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </View>

        {/* Content skeleton */}
        <View className="p-3">
          <View className="h-4 w-24 bg-gray-200 rounded mb-2 overflow-hidden">
            <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </View>

          {/* Type skeleton */}
          <View className="h-3 w-16 bg-gray-200 rounded mb-2 overflow-hidden">
            <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </View>

          {/* Localisation skeleton */}
          <View className="h-3 w-20 bg-gray-200 rounded mb-3 overflow-hidden">
            <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </View>

          {/* Statistiques skeleton */}
          <View className="flex-row items-center justify-between">
            <View className="h-3 w-12 bg-gray-200 rounded overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>
            <View className="h-3 w-10 bg-gray-200 rounded overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const MagasinListSkeleton = () => (
    <View className="mb-3">
      <View className="bg-white rounded-2xl border border-gray-100 p-4">
        <View className="flex-row items-center">
          {/* Image skeleton */}
          <View className="w-16 h-16 rounded-xl bg-gray-200 mr-3 overflow-hidden">
            <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </View>

          {/* Infos skeleton */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-2">
              <View className="h-4 w-32 bg-gray-200 rounded overflow-hidden">
                <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </View>
              <View className="w-4 h-4 bg-gray-200 rounded overflow-hidden">
                <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </View>
            </View>

            <View className="h-3 w-20 bg-gray-200 rounded mb-2 overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>

            <View className="h-3 w-36 bg-gray-200 rounded mb-3 overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="h-3 w-12 bg-gray-200 rounded overflow-hidden">
                <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </View>
              <View className="h-3 w-10 bg-gray-200 rounded overflow-hidden">
                <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </View>
            </View>
          </View>

          <View className="ml-2 w-4 h-4 bg-gray-200 rounded overflow-hidden">
            <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header skeleton */}
      <View className="bg-white px-4 pt-4 pb-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <View className="h-6 w-32 bg-gray-200 rounded-lg mb-1 overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>
            <View className="h-3 w-40 bg-gray-200 rounded overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>
          </View>

          {/* Boutons de vue skeleton */}
          <View className="flex-row items-center gap-2">
            <View className="w-10 h-10 bg-gray-200 rounded-xl overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>
            <View className="w-10 h-10 bg-gray-200 rounded-xl overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>
          </View>
        </View>

        {/* Search Bar skeleton */}
        <View className="h-12 bg-gray-200 rounded-xl overflow-hidden">
          <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </View>
      </View>

      {/* Content skeleton */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Mode grille par défaut pour le skeleton */}
          <View className="flex-row flex-wrap justify-between">
            {skeletonItems.map((item) => (
              <MagasinGridSkeleton key={item} />
            ))}
          </View>
        </View>

        {/* Espace pour le bottom padding */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
