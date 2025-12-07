import ProductCard from '@/components/cards/ProductCard';
import { ChevronRight, Flame } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Product {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    store: string;
    rating: number;
    reviews: number;
    isHot: boolean;
    discount?: number;
    category: string;
}

interface HotProductsListProps {
    products: Product[];
    favorites: number[];
    onProductPress: (product: Product) => void;
    onFavoritePress: (productId: number) => void;
    onAddToCart: (product: Product) => void;
    onSeeAllPress: () => void;
}

export default function HotProductsList({
    products,
    favorites,
    onProductPress,
    onFavoritePress,
    onAddToCart,
    onSeeAllPress,
}: HotProductsListProps) {
    const hotProducts = products.filter(p => p.isHot);

    return (
        <View>
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 bg-orange-400 rounded-xl items-center justify-center">
                        <Flame size={16} color="white" />
                    </View>
                    <Text className="text-lg font-bold text-gray-800">Produits Populaires</Text>
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
                    {hotProducts.map((product) => (
                        <View key={product.id} className="w-40">
                            <ProductCard
                                product={product}
                                isFavorite={favorites.includes(product.id)}
                                onPress={() => onProductPress(product)}
                                onFavoritePress={() => onFavoritePress(product.id)}
                                onAddToCart={() => onAddToCart(product)}
                                compact
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}