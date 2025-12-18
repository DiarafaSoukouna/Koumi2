import StoreCard from "@/components/cards/StoreCard";
import { Magasin } from "@/Types/Magasin";
import { ChevronRight, Store } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FeaturedStoresListProps {
  stores: Magasin[];
  onStorePress: (store: Magasin) => void;
  onSeeAllPress: () => void;
}

const { width: screenWidth } = Dimensions.get("window");
const STORE_CARD_WIDTH = 260;
const MAX_STORES_TO_SHOW = 7;

export default function FeaturedStoresList({
  stores,
  onStorePress,
  onSeeAllPress,
}: FeaturedStoresListProps) {
  // Limiter à 7 magasins maximum
  const limitedStores = stores.slice(0, MAX_STORES_TO_SHOW);

  const renderStoreItem = ({ item }: { item: Magasin }) => (
    <View style={{ width: STORE_CARD_WIDTH, marginRight: 12 }}>
      <StoreCard store={item} onPress={() => onStorePress(item)} />
    </View>
  );

  return (
    <View>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 bg-orange-600 rounded-xl items-center justify-center">
            <Store size={16} color="white" />
          </View>
          <Text className="text-lg font-bold text-gray-800">
            Magasins Populaires
          </Text>
        </View>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={onSeeAllPress}
        >
          <Text className="text-yellow-500 text-sm font-semibold mr-1">
            Tout voir
          </Text>
          <ChevronRight size={16} color="#eab308" />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={limitedStores}
        renderItem={renderStoreItem}
        keyExtractor={(item) => item.idMagasin}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        snapToInterval={STORE_CARD_WIDTH + 12}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        getItemLayout={(data, index) => ({
          length: STORE_CARD_WIDTH + 12,
          offset: (STORE_CARD_WIDTH + 12) * index,
          index,
        })}
      />
    </View>
  );
}
