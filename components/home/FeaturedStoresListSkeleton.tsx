// @/components/home/FeaturedStoresListSkeleton.tsx
import React from "react";
import { FlatList, View } from "react-native";

const STORE_CARD_WIDTH = 260;
const MAX_STORES_TO_SHOW = 5;

export default function FeaturedStoresListSkeleton() {
  const skeletonStores = Array.from(
    { length: MAX_STORES_TO_SHOW },
    (_, i) => i
  );

  const renderSkeletonStore = () => (
    <View style={{ width: STORE_CARD_WIDTH, marginRight: 12 }}>
      <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Image skeleton */}
        <View className="relative h-28 bg-gray-200 overflow-hidden">
          <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </View>

        {/* Détails skeleton */}
        <View className="p-3">
          <View className="flex-row items-center justify-between mb-2">
            <View className="h-4 w-32 bg-gray-200 rounded overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>
            <View className="h-4 w-12 bg-gray-200 rounded overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </View>
          </View>

          <View className="h-3 w-24 bg-gray-200 rounded overflow-hidden">
            <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View>
      {/* En-tête skeleton */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 bg-gray-200 rounded-xl overflow-hidden">
            <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </View>
          <View className="h-6 w-40 bg-gray-200 rounded-lg overflow-hidden">
            <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </View>
        </View>
        <View className="h-6 w-16 bg-gray-200 rounded-lg overflow-hidden">
          <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </View>
      </View>

      {/* Liste horizontale skeleton */}
      <FlatList
        horizontal
        data={skeletonStores}
        renderItem={renderSkeletonStore}
        keyExtractor={(item) => item.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        snapToInterval={STORE_CARD_WIDTH + 12}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
      />
    </View>
  );
}
