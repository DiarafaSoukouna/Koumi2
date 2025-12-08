import StoreCard from '@/components/cards/StoreCard';
import { Magasin } from '@/Types/Magasin';
import { ChevronRight, Store } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';


interface FeaturedStoresListProps {
    stores: Magasin[];
    onStorePress: (store: Magasin) => void;
    onSeeAllPress: () => void;
}

export default function FeaturedStoresList({
    stores,
    onStorePress,
    onSeeAllPress,
}: FeaturedStoresListProps) {
    return (
        <View>
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 bg-orange-600 rounded-xl items-center justify-center">
                        <Store size={16} color="white" />
                    </View>
                    <Text className="text-lg font-bold text-gray-800">Magasins Populaires</Text>
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

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3 pb-2">
                    {stores.map((store) => (
                        <View key={store.idMagasin} className="w-64">
                            <StoreCard
                                store={store}
                                onPress={() => onStorePress(store)}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}