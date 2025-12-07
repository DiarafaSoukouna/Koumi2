import Badge from '@/components/common/Badge';
import { Heart, Plus, Star } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
    product: {
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
    };
    isFavorite: boolean;
    onPress: () => void;
    onFavoritePress: () => void;
    onAddToCart: () => void;
    compact?: boolean;
}

export default function ProductCard({
    product,
    isFavorite,
    onPress,
    onFavoritePress,
    onAddToCart,
    compact = false,
}: ProductCardProps) {
    const {
        name,
        price,
        oldPrice,
        image,
        store,
        rating,
        reviews,
        isHot,
        discount,
        category,
    } = product;

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${compact ? 'w-40' : 'w-full'
                }`}
        >
            <View className="relative">
                <Image
                    source={{ uri: image }}
                    className={`w-full ${compact ? 'h-32' : 'h-40'}`}
                    resizeMode="cover"
                />

                {/* Badges */}
                <View className="absolute top-2 left-2">
                    {discount ? (
                        <Badge variant="destructive">-{discount}%</Badge>
                    ) : isHot ? (
                        <Badge variant="secondary" className="flex-row items-center">
                            <Text className="text-white text-xs">🔥 HOT</Text>
                        </Badge>
                    ) : null}
                </View>

                {/* Bouton favori */}
                <TouchableOpacity
                    onPress={(e) => {
                        e.stopPropagation();
                        onFavoritePress();
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full items-center justify-center"
                >
                    <Heart
                        size={16}
                        color={isFavorite ? '#EF4444' : '#64748B'}
                        fill={isFavorite ? '#EF4444' : 'transparent'}
                    />
                </TouchableOpacity>

                {/* Badge catégorie */}
                <View className="absolute bottom-2 left-2">
                    <Badge>{category}</Badge>
                </View>
            </View>

            <View className="p-3">
                <Text
                    className="font-bold text-gray-800 mb-1"
                    numberOfLines={2}
                    style={{ fontSize: compact ? 12 : 14 }}
                >
                    {name}
                </Text>
                <Text className="text-gray-500 text-xs mb-2" numberOfLines={1}>
                    {store}
                </Text>

                {/* Note et avis */}
                <View className="flex-row items-center mb-2">
                    <Star size={12} color="#22C55E" fill="#22C55E" />
                    <Text className="text-gray-800 text-xs font-medium ml-1">
                        {rating}
                    </Text>
                    <Text className="text-gray-500 text-xs ml-1">
                        ({reviews})
                    </Text>
                </View>

                {/* Prix et bouton panier */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-baseline">
                        <Text className="text-green-500 font-bold">
                            {price.toLocaleString()} F
                        </Text>
                        {oldPrice && (
                            <Text className="text-gray-400 text-sm line-through ml-2">
                                {oldPrice.toLocaleString()} F
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={(e) => {
                            e.stopPropagation();
                            onAddToCart();
                        }}
                        className="w-8 h-8 bg-green-500 rounded-full items-center justify-center"
                    >
                        <Plus size={16} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}