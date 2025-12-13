// components/dashboard/StoreCard.tsx
import { CheckCircle, Eye, MapPin, Store, XCircle } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StoreCardProps {
    store: {
        idMagasin: string;
        nomMagasin: string;
        localiteMagasin: string;
        nbreView?: number;
        codeMagasin: string;
        statutMagasin?: boolean;
        descriptionMagasin?: string;
        contactMagasin?: string;
    };
    onPress?: (storeId: string) => void;
    productCount?: number;
    showStatus?: boolean;
}

export const StoreCard: React.FC<StoreCardProps> = ({
    store,
    onPress,
    productCount,
    showStatus = false
}) => {
    const handlePress = () => {
        if (onPress) {
            onPress(store.idMagasin);
        }
    };

    const getStatusColor = (status: boolean) => {
        return status ? 'text-green-500' : 'text-red-500';
    };

    const getStatusBgColor = (status: boolean) => {
        return status ? 'bg-green-100' : 'bg-red-100';
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="flex-row items-center p-3 bg-gray-50/50 rounded-xl mb-2 active:opacity-90"
            disabled={!onPress}
        >
            <View className="w-12 h-12 bg-orange-100 rounded-lg items-center justify-center mr-3 relative">
                <Store size={20} color="#EA580C" />

                {showStatus && store.statutMagasin !== undefined && (
                    <View className={`absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center ${getStatusBgColor(store.statutMagasin)}`}>
                        {store.statutMagasin ? (
                            <CheckCircle size={10} color="#10B981" />
                        ) : (
                            <XCircle size={10} color="#EF4444" />
                        )}
                    </View>
                )}
            </View>

            <View className="flex-1">
                <View className="flex-row items-center">
                    <Text className="font-medium text-gray-800 text-sm flex-1" numberOfLines={1}>
                        {store.nomMagasin}
                    </Text>

                    {productCount !== undefined && (
                        <View className="bg-primary/10 px-2 py-0.5 rounded-full ml-2">
                            <Text className="text-primary text-xs font-medium">{productCount}</Text>
                        </View>
                    )}
                </View>

                <View className="flex-row items-center mt-1">
                    <MapPin size={12} color="#64748B" />
                    <Text className="text-gray-500 text-xs ml-1 flex-1" numberOfLines={1}>
                        {store.localiteMagasin}
                    </Text>
                </View>

                {store.contactMagasin && (
                    <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>
                        📞 {store.contactMagasin}
                    </Text>
                )}

                {store.descriptionMagasin && (
                    <Text className="text-gray-400 text-xs mt-1" numberOfLines={2}>
                        {store.descriptionMagasin}
                    </Text>
                )}
            </View>

            <View className="items-end">
                <View className="flex-row items-center">
                    <Eye size={12} color="#64748B" />
                    <Text className="text-gray-500 text-xs ml-1">{store.nbreView || 0}</Text>
                </View>
                <Text className="text-gray-400 text-xs mt-1">
                    Code: {store.codeMagasin}
                </Text>

                {showStatus && store.statutMagasin !== undefined && (
                    <View className={`mt-1 px-2 py-0.5 rounded-full ${getStatusBgColor(store.statutMagasin)}`}>
                        <Text className={`text-xs font-medium ${getStatusColor(store.statutMagasin)}`}>
                            {store.statutMagasin ? 'Actif' : 'Inactif'}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

// Version simplifiée pour le dashboard
export const StoreCardSimple: React.FC<StoreCardProps> = ({
    store,
    onPress
}) => {
    const handlePress = () => {
        if (onPress) {
            onPress(store.idMagasin);
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="flex-row items-center p-3 bg-gray-50/50 rounded-xl mb-2 active:opacity-90"
            disabled={!onPress}
        >
            <View className="w-12 h-12 bg-orange-100 rounded-lg items-center justify-center mr-3">
                <Store size={20} color="#EA580C" />
            </View>
            <View className="flex-1">
                <Text className="font-medium text-gray-800 text-sm" numberOfLines={1}>
                    {store.nomMagasin}
                </Text>
                <View className="flex-row items-center mt-1">
                    <MapPin size={12} color="#64748B" />
                    <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
                        {store.localiteMagasin}
                    </Text>
                </View>
            </View>
            <View className="items-end">
                <View className="flex-row items-center">
                    <Eye size={12} color="#64748B" />
                    <Text className="text-gray-500 text-xs ml-1">{store.nbreView || 0}</Text>
                </View>
                <Text className="text-gray-400 text-xs mt-1">
                    Code: {store.codeMagasin}
                </Text>
            </View>
        </TouchableOpacity>
    );
};