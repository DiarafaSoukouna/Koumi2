import ProductCard from '@/components/cards/ProductCard';
import { Stock } from '@/Types/Stock';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AllProductsGridProps {
    products: Stock[];
    favorites: number[];
    onProductPress: (product: any) => void;
    onFavoritePress: (productId: number) => void;
    // onAddToCart: (product: Stock) => void;
    onSeeAllPress: () => void;
}

export default function AllProductsGrid({
    products,
    favorites,
    onProductPress,
    onFavoritePress,
    // onAddToCart,
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
                {products.map((stock) => (
                    <View key={stock.idStock} className="w-[48%] mb-3">
                        <ProductCard
                            product={{
                                id: parseInt(stock.idStock) || Math.floor(Math.random() * 1000),
                                name: stock.nomProduit,
                                price: stock.prix,
                                image: stock.photo,
                                store: stock.magasin?.nomMagasin || "Magasin",
                                reviews: stock.nbreView,
                                category: stock.typeProduit
                            }}
                            isFavorite={favorites.includes(parseInt(stock.idStock))}
                            onPress={() => onProductPress(stock)}
                            onFavoritePress={() => onFavoritePress(parseInt(stock.idStock))}
                        // onAddToCart={() => onAddToCart(stock)}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
}
