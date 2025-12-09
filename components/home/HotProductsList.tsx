import ProductCard from '@/components/cards/ProductCard';
import { Stock } from '@/Types/Stock';
import { ChevronRight, Flame } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface HotProductsListProps {
    products: Stock[];
    favorites: number[];
    onProductPress: (product: any) => void;
    onFavoritePress: (productId: number) => void;
    // onAddToCart: (product: Stock) => void;
    onSeeAllPress: () => void;
}

export default function HotProductsList({
    products,
    favorites,
    onProductPress,
    onFavoritePress,
    // onAddToCart,
    onSeeAllPress,
}: HotProductsListProps) {
    const hotProducts = products.sort((a, b) => b.nbreView - a.nbreView).slice(0, 5);

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
                    {hotProducts.map((stock) => (
                        <View key={stock.idStock} className="w-40">
                            <ProductCard
                                product={{
                                    id: parseInt(stock.idStock) || Math.floor(Math.random() * 1000), // Fallback if idStock is not number
                                    name: stock.nomProduit,
                                    price: stock.prix,
                                    image: stock.photo,
                                    store: stock.magasin?.nomMagasin || "Magasin",
                                    reviews: stock.nbreView,
                                    isHot: true,
                                    category: stock.typeProduit
                                }}
                                isFavorite={favorites.includes(parseInt(stock.idStock))}
                                onPress={() => onProductPress(stock)}
                                onFavoritePress={() => onFavoritePress(parseInt(stock.idStock))}
                                // onAddToCart={() => onAddToCart(stock)}
                                compact
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
