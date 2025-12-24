// @/components/home/AllProductsGridSkeleton.tsx
import React from "react";
import { View } from "react-native";

export default function AllProductsGridSkeleton() {
  const gridProducts = Array.from({ length: 8 }, (_, i) => i);

  return (
    <View>
      {/* En-tête skeleton */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="h-6 w-32 bg-gray-200 rounded-lg overflow-hidden">
          <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </View>
        <View className="h-6 w-16 bg-gray-200 rounded-lg overflow-hidden">
          <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </View>
      </View>

      {/* Grille skeleton */}
      <View className="flex-row flex-wrap justify-between">
        {gridProducts.map((_, index) => (
          <View key={index} className="w-[48%] mb-3">
            <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <View className="relative">
                <View className="w-full h-40 bg-gray-200 overflow-hidden">
                  <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </View>
              </View>

              <View className="p-3">
                <View className="h-4 w-28 bg-gray-200 rounded mb-2 overflow-hidden">
                  <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </View>
                <View className="h-3 w-20 bg-gray-200 rounded mb-3 overflow-hidden">
                  <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="h-5 w-16 bg-gray-200 rounded overflow-hidden">
                    <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </View>
                  <View className="h-4 w-4 bg-gray-200 rounded-full overflow-hidden">
                    <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
