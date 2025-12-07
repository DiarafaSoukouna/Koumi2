import ProductCard from '@/components/cards/ProductCard';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Product {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    store: string;
    rating: number;
    reviews: number;
    isHot?: boolean;
    discount?: number;
    category: string;
}

interface AllProductsGridProps {
    products: Product[];
    favorites: number[];
    onProductPress: (product: Product) => void;
    onFavoritePress: (productId: number) => void;
    onAddToCart: (product: Product) => void;
    onSeeAllPress: () => void;
}

export default function AllProductsGrid({
    products,
    favorites,
    onProductPress,
    onFavoritePress,
    onAddToCart,
    onSeeAllPress,
}: AllProductsGridProps) {
    return (
        <View>
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold text-gray-800">Tous les Produits</Text>
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

            <View className="flex-row flex-wrap justify-between">
                {products.slice(0, 4).map((product) => (
                    <View key={product.id} className="w-[48%] mb-3">
                        <ProductCard
                            product={product}
                            isFavorite={favorites.includes(product.id)}
                            onPress={() => onProductPress(product)}
                            onFavoritePress={() => onFavoritePress(product.id)}
                            onAddToCart={() => onAddToCart(product)}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
}