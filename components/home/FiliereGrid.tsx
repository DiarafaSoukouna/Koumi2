// @/components/home/FiliereGrid.tsx
import { filiereColors, getFiliereIcon } from "@/constants/filiereIcons";
import { Filiere } from "@/Types/Filiere";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface FiliereGridProps {
  filieres: Filiere[];
  onFilierePress: (filiere: Filiere) => void;
}

export default function FiliereGrid({
  filieres,
  onFilierePress,
}: FiliereGridProps) {
  // Obtenir une couleur unique pour chaque filière
  const getFiliereColor = (index: number) => {
    return filiereColors[index % filiereColors.length];
  };

  return (
    <View>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-gray-900">Nos Filières</Text>
        <TouchableOpacity className="flex-row items-center">
          {/* <Text className="text-yellow-600 text-sm font-semibold mr-1">
            Tout voir
          </Text> */}
          {/* <ChevronRight size={18} color="#CA8A04" /> */}
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        <View className="flex-row gap-2">
          {filieres.map((filiere, index) => {
            const { icon: Icon } = getFiliereIcon(filiere.libelleFiliere);
            const backgroundColor = getFiliereColor(index);

            return (
              <TouchableOpacity
                key={filiere.idFiliere}
                onPress={() => onFilierePress(filiere)}
                className="items-center"
                style={{ width: 90 }}
              >
                <View
                  style={{
                    backgroundColor,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                  className="w-16 h-16 rounded-2xl items-center justify-center"
                >
                  <Icon size={28} color="white" />
                </View>
                <Text
                  className="text-gray-800 text-xs text-center mt-3 font-semibold"
                  numberOfLines={2}
                  style={{ lineHeight: 16 }}
                >
                  {filiere.libelleFiliere}
                </Text>
                {/* {filiere.hasAssociation && (
                  <View className="mt-1 px-2 py-0.5 bg-yellow-100 rounded-full">
                    <Text className="text-yellow-800 text-[10px] font-medium">
                      Associations
                    </Text>
                  </View>
                )} */}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
