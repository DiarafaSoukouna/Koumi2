// @/components/home/FiliereGridSkeleton.tsx
import React from "react";
import { ScrollView, View } from "react-native";

export default function FiliereGridSkeleton() {
  // Créer 5 éléments de skeleton (même nombre que dans la grille)
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i);

  return (
    <View>
      <View className="flex-row items-center justify-between mb-4">
        <View className="h-6 w-32 bg-gray-200 rounded-lg" />
        <View className="h-4 w-12 bg-gray-200 rounded" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        <View className="flex-row gap-2">
          {skeletonItems.map((index) => (
            <View key={index} className="items-center" style={{ width: 90 }}>
              {/* Cercle pour l'icône */}
              <View className="w-16 h-16 rounded-2xl bg-gray-200 items-center justify-center overflow-hidden">
                <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </View>

              {/* Texte 1 */}
              <View className="mt-3 h-3 w-14 bg-gray-200 rounded overflow-hidden">
                <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </View>

              {/* Texte 2 (optionnel) */}
              <View className="mt-1 h-2 w-10 bg-gray-200 rounded overflow-hidden">
                <View className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
