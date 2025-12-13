// components/dashboard/ProductCard.tsx
import { formatCurrency } from '@/utils/formatters';
import { Eye, Package } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
    product: {
        idStock: string;
        nomProduit: string;
        prix: number;
        quantiteStock: number;
        nbreView?: number;
        dateAjout: string;
        magasin?: {
            nomMagasin: string;
        };
        typeProduit?: string;
    };
    onPress?: (productId: string) => void;
    showStoreName?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onPress,
    showStoreName = false
}) => {
    const handlePress = () => {
        if (onPress) {
            onPress(product.idStock);
        }
    };

    const getStockStatusColor = (quantity: number) => {
        if (quantity === 0) return 'text-red-500';
        if (quantity < 10) return 'text-yellow-500';
        return 'text-green-500';
    };

    const getStockStatusText = (quantity: number) => {
        if (quantity === 0) return 'Rupture';
        if (quantity < 10) return 'Faible';
        return 'Disponible';
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="flex-row items-center p-3 bg-gray-50/50 rounded-xl mb-2 active:opacity-90"
            disabled={!onPress}
        >
            <View className="w-12 h-12 bg-primary/10 rounded-lg items-center justify-center mr-3">
                <Package size={20} color="#079C48" />
            </View>

            <View className="flex-1">
                <Text className="font-medium text-gray-800 text-sm" numberOfLines={1}>
                    {product.nomProduit}
                </Text>

                {showStoreName && product.magasin?.nomMagasin && (
                    <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>
                        {product.magasin.nomMagasin}
                    </Text>
                )}

                {product.typeProduit && (
                    <View className="bg-gray-100 px-2 py-0.5 rounded-full self-start mt-1">
                        <Text className="text-gray-600 text-xs">{product.typeProduit}</Text>
                    </View>
                )}

                <View className="flex-row items-center mt-2">
                    <Text className="text-primary font-bold text-xs">
                        {formatCurrency(product.prix)}
                    </Text>
                    <View className={`ml-3 px-2 py-0.5 rounded-full ${getStockStatusColor(product.quantiteStock).replace('text-', 'bg-')}20`}>
                        <Text className={`text-xs font-medium ${getStockStatusColor(product.quantiteStock)}`}>
                            {getStockStatusText(product.quantiteStock)}
                        </Text>
                    </View>
                    <Text className="text-gray-500 text-xs ml-2">
                        • Stock: {product.quantiteStock}
                    </Text>
                </View>
            </View>

            <View className="items-end">
                <View className="flex-row items-center">
                    <Eye size={12} color="#64748B" />
                    <Text className="text-gray-500 text-xs ml-1">{product.nbreView || 0}</Text>
                </View>
                <Text className="text-gray-400 text-xs mt-1">
                    {new Date(product.dateAjout).toLocaleDateString('fr-FR', {
                        month: 'short',
                        day: 'numeric'
                    })}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

