import { useMerchant } from '@/context/Merchant';
import { formatDate } from '@/utils/formatters';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    ChevronRight,
    Edit,
    Eye,
    Globe,
    MapPin,
    Navigation,
    Package,
    Phone,
    Share2,
    Store,
    Trash2,
    XCircle,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    Share,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function StoreDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { magasins, deleteMagasin, stocks } = useMerchant();

    const [store, setStore] = useState(null);
    const [storeProducts, setStoreProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id && magasins.length > 0) {
            const foundStore = magasins.find(m => m.idMagasin === id);
            setStore(foundStore || null);

            // Trouver les produits associés à ce magasin
            if (foundStore) {
                const products = stocks.filter(stock => stock.magasin?.idMagasin === foundStore.idMagasin);
                setStoreProducts(products);
            }

            setLoading(false);
        }
    }, [id, magasins, stocks]);

    const handleDelete = async () => {
        Alert.alert(
            'Supprimer le magasin',
            'Êtes-vous sûr de vouloir supprimer ce magasin ? Cette action est irréversible.',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteMagasin(id);
                            router.back();
                        } catch (error: any) {
                            Alert.alert('Erreur', error.message || 'Erreur lors de la suppression');
                        }
                    },
                },
            ]
        );
    };

    const handleShare = async () => {
        if (!store) return;

        try {
            await Share.share({
                title: store.nomMagasin,
                message: `Découvrez ${store.nomMagasin} situé à ${store.localiteMagasin}. Contact: ${store.contactMagasin}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar style="dark" />
                <View className="flex-1 items-center justify-center">
                    <Text>Chargement...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!store) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar style="dark" />
                <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-500">Magasin non trouvé</Text>
                    <TouchableOpacity onPress={() => router.back()} className="mt-4">
                        <Text className="text-primary">Retour</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />

            {/* Header */}
            <View className="bg-white px-4 py-3 border-b border-gray-200">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="p-2 -ml-2 mr-2"
                        >
                            <ArrowLeft size={24} color="#1E293B" />
                        </TouchableOpacity>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
                                {store.nomMagasin}
                            </Text>
                            <Text className="text-gray-500 text-xs" numberOfLines={1}>
                                Code: {store.codeMagasin}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity onPress={handleShare} className="p-2">
                            <Share2 size={20} color="#64748B" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push(`/screen/EditStoreScreen/${store.idMagasin}`)}
                            className="p-2"
                        >
                            <Edit size={20} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Image */}
                <View className="relative">
                    {store.photo ? (
                        <Image
                            source={{ uri: store.photo }}
                            className="w-full h-64"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-64 bg-orange-50 items-center justify-center">
                            <Store size={64} color="#F97316" />
                        </View>
                    )}

                    {/* Badge de statut */}
                    <View className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex-row items-center">
                        {store.statutMagasin ? (
                            <>
                                <CheckCircle size={16} color="#10B981" />
                                <Text className="font-medium text-sm ml-2 text-green-700">Actif</Text>
                            </>
                        ) : (
                            <>
                                <XCircle size={16} color="#EF4444" />
                                <Text className="font-medium text-sm ml-2 text-red-700">Inactif</Text>
                            </>
                        )}
                    </View>
                </View>

                {/* Informations principales */}
                <View className="p-4 bg-white">
                    <Text className="text-2xl font-bold text-gray-800 mb-2">
                        {store.nomMagasin}
                    </Text>

                    <View className="space-y-3">
                        <View className="flex-row items-start">
                            <MapPin size={20} color="#64748B" className="mr-3 mt-0.5" />
                            <View className="flex-1">
                                <Text className="text-gray-600 text-sm">Localisation</Text>
                                <Text className="text-gray-800">{store.localiteMagasin}</Text>
                            </View>
                        </View>

                        {store.contactMagasin && (
                            <View className="flex-row items-center">
                                <Phone size={20} color="#64748B" className="mr-3" />
                                <View className="flex-1">
                                    <Text className="text-gray-600 text-sm">Contact</Text>
                                    <Text className="text-gray-800">{store.contactMagasin}</Text>
                                </View>
                            </View>
                        )}

                        {store.pays && (
                            <View className="flex-row items-center">
                                <Globe size={20} color="#64748B" className="mr-3" />
                                <View className="flex-1">
                                    <Text className="text-gray-600 text-sm">Pays</Text>
                                    <Text className="text-gray-800">{store.pays}</Text>
                                </View>
                            </View>
                        )}

                        {(store.latitude && store.longitude) && (
                            <View className="flex-row items-center">
                                <Navigation size={20} color="#64748B" className="mr-3" />
                                <View className="flex-1">
                                    <Text className="text-gray-600 text-sm">Coordonnées GPS</Text>
                                    <Text className="text-gray-800">{store.latitude}, {store.longitude}</Text>
                                </View>
                            </View>
                        )}

                        <View className="flex-row items-center">
                            <Calendar size={20} color="#64748B" className="mr-3" />
                            <View className="flex-1">
                                <Text className="text-gray-600 text-sm">Date de création</Text>
                                <Text className="text-gray-800">{formatDate(store.dateAjout)}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <Eye size={20} color="#64748B" className="mr-3" />
                            <View className="flex-1">
                                <Text className="text-gray-600 text-sm">Nombre de vues</Text>
                                <Text className="text-gray-800">{store.nbreView || 0}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Produits associés */}
                {storeProducts.length > 0 && (
                    <View className="p-4 bg-white mt-2">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-lg font-bold text-gray-800">Produits du magasin</Text>
                            <Text className="text-primary text-sm font-medium">
                                {storeProducts.length} produit{storeProducts.length !== 1 ? 's' : ''}
                            </Text>
                        </View>

                        <View className="space-y-2">
                            {storeProducts.slice(0, 3).map(product => (
                                <TouchableOpacity
                                    key={product.idStock}
                                    onPress={() => router.push(`/screen/ProductDetailScreen/${product.idStock}`)}
                                    className="flex-row items-center p-2 bg-gray-50 rounded-lg"
                                >
                                    <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center mr-3">
                                        <Package size={18} color="#079C48" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-medium text-gray-800 text-sm" numberOfLines={1}>
                                            {product.nomProduit}
                                        </Text>
                                        <Text className="text-gray-500 text-xs">
                                            Stock: {product.quantiteStock} • {product.prix} F CFA
                                        </Text>
                                    </View>
                                    <ChevronRight size={16} color="#94A3B8" />
                                </TouchableOpacity>
                            ))}

                            {storeProducts.length > 3 && (
                                <TouchableOpacity
                                    onPress={() => router.push(`/screen/ProductsListScreen?magasin=${store.idMagasin}`)}
                                    className="pt-2"
                                >
                                    <Text className="text-primary text-center text-sm font-medium">
                                        Voir tous les produits ({storeProducts.length})
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                {/* Actions */}
                <View className="p-4">
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="flex-row items-center justify-center py-3 border border-red-300 rounded-lg"
                    >
                        <Trash2 size={20} color="#EF4444" className="mr-2" />
                        <Text className="text-red-600 font-medium">Supprimer le magasin</Text>
                    </TouchableOpacity>
                </View>

                {/* Espace pour le padding */}
                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
}