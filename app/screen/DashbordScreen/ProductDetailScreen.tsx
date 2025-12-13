// app/screens/ProductDetailScreen.tsx
import { Stock } from '@/Types/Stock';
import { useMerchant } from '@/context/Merchant';
import { formatDate } from '@/utils/formatters';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle,
    ChevronRight,
    Edit,
    Eye,
    Globe,
    Info,
    MapPin,
    Package,
    Share2,
    Store,
    Tag,
    Trash2,
    TrendingUp,
    XCircle
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Share,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProductDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { stocks, deleteStock, fetchStocks } = useMerchant();

    const [product, setProduct] = useState<Stock | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id && stocks.length > 0) {
            const foundProduct = stocks.find(p => p.idStock === id);
            setProduct(foundProduct || null);
            setLoading(false);
        }
    }, [id, stocks]);

    const handleDelete = async () => {
        Alert.alert(
            'Supprimer le produit',
            'Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteStock(id as string);
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
        if (!product) return;

        try {
            await Share.share({
                title: product.nomProduit,
                message: `Découvrez ${product.nomProduit} à ${formatCurrency(product.prix)}. Stock: ${product.quantiteStock}`,
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

    if (!product) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar style="dark" />
                <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-500">Produit non trouvé</Text>
                    <TouchableOpacity onPress={() => router.back()} className="mt-4">
                        <Text className="text-primary">Retour</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const getStockStatusColor = (quantity: number) => {
        if (quantity === 0) return 'text-red-500';
        if (quantity < 10) return 'text-yellow-500';
        return 'text-green-500';
    };

    const getStockStatusIcon = (quantity: number) => {
        if (quantity === 0) return XCircle;
        if (quantity < 10) return AlertCircle;
        return CheckCircle;
    };

    const StatusIcon = getStockStatusIcon(product.quantiteStock);

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
                                {product.nomProduit}
                            </Text>
                            <Text className="text-gray-500 text-xs" numberOfLines={1}>
                                Code: {product.codeStock}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity onPress={handleShare} className="p-2">
                            <Share2 size={20} color="#64748B" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push(`/screen/EditProductScreen/${product.idStock}`)}
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
                    {product.photo ? (
                        <Image
                            source={{ uri: product.photo }}
                            className="w-full h-64"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-64 bg-gray-100 items-center justify-center">
                            <Package size={64} color="#9CA3AF" />
                        </View>
                    )}

                    {/* Badge de statut */}
                    <View className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex-row items-center">
                        <StatusIcon size={16} color={getStockStatusColor(product.quantiteStock)} />
                        <Text className={`font-medium text-sm ml-2 ${getStockStatusColor(product.quantiteStock)}`}>
                            {product.quantiteStock === 0 ? 'Rupture' : product.quantiteStock < 10 ? 'Stock faible' : 'En stock'}
                        </Text>
                    </View>
                </View>

                {/* Informations principales */}
                <View className="p-4 bg-white">
                    <Text className="text-2xl font-bold text-gray-800 mb-2">
                        {product.nomProduit}
                    </Text>

                    {product.descriptionStock && (
                        <Text className="text-gray-600 mb-4">{product.descriptionStock}</Text>
                    )}

                    <View className="grid grid-cols-2 gap-4 mb-6">
                        <View>
                            <Text className="text-gray-500 text-sm mb-1">Prix</Text>
                            <Text className="text-3xl font-bold text-primary">
                                {formatCurrency(product.prix)}
                            </Text>
                        </View>

                        <View>
                            <Text className="text-gray-500 text-sm mb-1">Stock disponible</Text>
                            <View className="flex-row items-center">
                                <Text className="text-3xl font-bold text-gray-800 mr-2">
                                    {product.quantiteStock}
                                </Text>
                                <Text className="text-gray-500">
                                    {product.unite?.libUnite}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Statistiques */}
                    <View className="bg-gray-50 rounded-xl p-4 mb-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="font-medium text-gray-800">Statistiques</Text>
                            <TrendingUp size={18} color="#64748B" />
                        </View>

                        <View className="space-y-3">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Eye size={16} color="#64748B" className="mr-2" />
                                    <Text className="text-gray-600">Vues</Text>
                                </View>
                                <Text className="font-medium">{product.nbreView || 0}</Text>
                            </View>

                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Calendar size={16} color="#64748B" className="mr-2" />
                                    <Text className="text-gray-600">Date d'ajout</Text>
                                </View>
                                <Text className="font-medium">{formatDate(product.dateAjout)}</Text>
                            </View>

                            {product.dateModif && (
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <Calendar size={16} color="#64748B" className="mr-2" />
                                        <Text className="text-gray-600">Dernière modification</Text>
                                    </View>
                                    <Text className="font-medium">{formatDate(product.dateModif)}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Détails */}
                <View className="p-4 bg-white mt-2">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Détails du produit</Text>

                    <View className="space-y-4">
                        {product.speculation && (
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Tag size={18} color="#64748B" className="mr-3" />
                                    <Text className="text-gray-600">Type</Text>
                                </View>
                                <Text className="font-medium text-gray-800">{product.speculation.nomSpeculation}</Text>
                            </View>
                        )}

                        {product.typeProduit && (
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Package size={18} color="#64748B" className="mr-3" />
                                    <Text className="text-gray-600">Catégorie</Text>
                                </View>
                                <Text className="font-medium text-gray-800">{product.typeProduit}</Text>
                            </View>
                        )}

                        {product.origineProduit && (
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Globe size={18} color="#64748B" className="mr-3" />
                                    <Text className="text-gray-600">Origine</Text>
                                </View>
                                <Text className="font-medium text-gray-800">{product.origineProduit}</Text>
                            </View>
                        )}

                        {product.formeProduit && (
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Info size={18} color="#64748B" className="mr-3" />
                                    <Text className="text-gray-600">Forme</Text>
                                </View>
                                <Text className="font-medium text-gray-800">{product.formeProduit}</Text>
                            </View>
                        )}

                        {product.pays && (
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <MapPin size={18} color="#64748B" className="mr-3" />
                                    <Text className="text-gray-600">Pays</Text>
                                </View>
                                <Text className="font-medium text-gray-800">{product.pays}</Text>
                            </View>
                        )}

                        {product.zoneProduction && (
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <MapPin size={18} color="#64748B" className="mr-3" />
                                    <Text className="text-gray-600">Zone de production</Text>
                                </View>
                                <Text className="font-medium text-gray-800">{product.zoneProduction.nomZoneProduction}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Magasin */}
                {product.magasin && (
                    <TouchableOpacity
                        onPress={() => router.push(`/screen/StoreDetailScreen/${product.magasin.idMagasin}`)}
                        className="p-4 bg-white mt-2 flex-row items-center justify-between"
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-orange-100 rounded-lg items-center justify-center mr-3">
                                <Store size={20} color="#EA580C" />
                            </View>
                            <View>
                                <Text className="font-medium text-gray-800">Magasin</Text>
                                <Text className="text-gray-500 text-sm">{product.magasin.nomMagasin}</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color="#94A3B8" />
                    </TouchableOpacity>
                )}

                {/* Actions */}
                <View className="p-4">
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="flex-row items-center justify-center py-3 border border-red-300 rounded-lg mb-3"
                    >
                        <Trash2 size={20} color="#EF4444" className="mr-2" />
                        <Text className="text-red-600 font-medium">Supprimer le produit</Text>
                    </TouchableOpacity>
                </View>

                {/* Espace pour le padding */}
                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
}