import { StatusBar } from 'expo-status-bar';
import {
    ArrowLeft,
    Heart,
    MapPin,
    MessageCircle,
    Minus,
    Plus,
    ShoppingCart,
    Star
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Badge from '@/components/common/Badge';
import { Stock } from '@/Types/Stock';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ProductDetailScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState<Stock | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    React.useEffect(() => {
        if (params.stock) {
            try {
                const productData = typeof params.stock === 'string'
                    ? JSON.parse(params.stock)
                    : params.stock;
                setProduct(productData);
            } catch (e) {
                console.error("Error parsing product data:", e);
            }
        }
    }, [params.stock]);

    if (!product) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }

    const totalPrice = product.prix * quantity;
    const maxQuantity = product.quantiteStock || 100;

    const openWhatsApp = () => {
        if (!product.acteur?.whatsAppActeur) {
            Alert.alert("Erreur", "Numéro WhatsApp non disponible")
            return
        }

        const phone = product.acteur.whatsAppActeur.replace(/\s+/g, "").replace("+", "")
        const monnaie = product.monnaie?.libelle || 'FCFA'

        const message = `Bonjour, j'aimerais commander :\n\n📦 Produit : ${product.nomProduit}\n📊 Quantité : ${quantity} ${product.unite?.nomUnite || 'unité(s)'}\n💰 Montant total : ${totalPrice.toLocaleString()} ${monnaie}\n\nMerci !`

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

        Linking.openURL(url).catch(() => {
            Alert.alert("Erreur", "Impossible d'ouvrir WhatsApp")
        })
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />

            {/* Header fixe */}
            <View className="absolute top-0 left-0 right-0 z-10 bg-white/95 px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <ArrowLeft size={24} color="#1E293B" />
                </TouchableOpacity>

                <Text className="font-semibold text-gray-800">Détails produit</Text>

                <View className="flex-row gap-2">
                    <TouchableOpacity
                        onPress={() => setIsFavorite(!isFavorite)}
                        className="p-2"
                    >
                        <Heart
                            size={20}
                            color={isFavorite ? "#EF4444" : "#64748B"}
                            fill={isFavorite ? "#EF4444" : "transparent"}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Image du produit */}
                <View className="relative">
                    <Image
                        source={{ uri: product.photo || "https://via.placeholder.com/400x300" }}
                        className="w-full h-72"
                        resizeMode="cover"
                    />

                    {product.statutSotck && (
                        <Badge className="absolute top-4 left-4 bg-green-500">
                            <Text className="text-white text-xs">Disponible</Text>
                        </Badge>
                    )}
                </View>

                {/* Informations produit */}
                <View className="px-4 py-4 space-y-4">
                    {/* Titre et note */}
                    <View>
                        <View className="flex-row items-start justify-between">
                            <View className="flex-1">
                                <Text className="text-xl font-bold text-gray-800">{product.nomProduit}</Text>
                                <View className="flex-row items-center gap-2 mt-1">
                                    <View className="flex-row items-center gap-1">
                                        <Star size={16} color="#F59E0B" fill="#F59E0B" />
                                        <Text className="font-medium text-sm text-gray-800">{product.nbreView || 0}</Text>
                                    </View>
                                    <Text className="text-gray-500 text-sm">vues</Text>
                                </View>
                            </View>
                        </View>

                        {/* Prix */}
                        <View className="mt-3">
                            <Text className="text-3xl font-bold text-green-500">
                                {product.prix.toLocaleString()}
                            </Text>
                            <Text className="text-lg text-gray-500 ml-1">{product.monnaie?.libelle || 'FCFA'}/{product.unite?.nomUnite || 'unité'}</Text>
                        </View>
                    </View>

                    {/* Sélecteur de quantité */}
                    <View className="bg-gray-50 rounded-2xl p-4">
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="font-medium text-gray-800">Quantité</Text>
                                <Text className="text-gray-500 text-xs">
                                    Stock: {product.quantiteStock} {product.unite?.nomUnite || 'unités'}
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-3">
                                <TouchableOpacity
                                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 border border-gray-300 rounded-xl items-center justify-center"
                                >
                                    <Minus size={16} color="#64748B" />
                                </TouchableOpacity>

                                <Text className="w-12 text-center font-bold text-lg text-gray-800">{quantity}</Text>

                                <TouchableOpacity
                                    onPress={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                                    className="w-10 h-10 border border-gray-300 rounded-xl items-center justify-center"
                                >
                                    <Plus size={16} color="#64748B" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Description */}
                    <View>
                        <Text className="font-semibold text-gray-800 mb-2">Description</Text>
                        <Text className="text-gray-600 text-sm leading-relaxed">
                            {product.descriptionStock || `${product.nomProduit} - Produit de qualité disponible dans notre boutique.`}
                        </Text>
                    </View>

                    {/* Caractéristiques */}
                    <View>
                        <Text className="font-semibold text-gray-800 mb-2">Caractéristiques</Text>
                        <View className="bg-gray-50 rounded-2xl divide-y divide-gray-200">
                            <View className="flex-row items-center justify-between p-3">
                                <Text className="text-gray-500 text-sm">Type</Text>
                                <Text className="text-gray-800 text-sm font-medium">{product.typeProduit}</Text>
                            </View>
                            <View className="flex-row items-center justify-between p-3">
                                <Text className="text-gray-500 text-sm">Origine</Text>
                                <Text className="text-gray-800 text-sm font-medium">{product.origineProduit}</Text>
                            </View>
                            {product.formeProduit && (
                                <View className="flex-row items-center justify-between p-3">
                                    <Text className="text-gray-500 text-sm">Forme</Text>
                                    <Text className="text-gray-800 text-sm font-medium">{product.formeProduit}</Text>
                                </View>
                            )}
                            {product.speculation && (
                                <View className="flex-row items-center justify-between p-3">
                                    <Text className="text-gray-500 text-sm">Spéculation</Text>
                                    <Text className="text-gray-800 text-sm font-medium">{product.speculation.nomSpeculation}</Text>
                                </View>
                            )}
                            {product.pays && (
                                <View className="flex-row items-center justify-between p-3">
                                    <Text className="text-gray-500 text-sm">Pays</Text>
                                    <Text className="text-gray-800 text-sm font-medium">{product.pays}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Zone de production */}
                    {product.zoneProduction && (
                        <View className="bg-green-50 rounded-2xl p-4">
                            <Text className="font-semibold text-gray-800 mb-3">Zone de Production</Text>
                            <View className="space-y-2">
                                <View className="flex-row items-center gap-3">
                                    <MapPin size={20} color="#22C55E" />
                                    <View>
                                        <Text className="text-sm font-medium text-gray-800">{product.zoneProduction.nomZoneProduction}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Informations vendeur/magasin */}
                    {product.magasin && (
                        <View className="bg-gray-50 rounded-2xl p-4">
                            <TouchableOpacity onPress={() => router.push({
                                pathname: "/screen/StoreDetailScreen",
                                params: { Magasin: JSON.stringify(product.magasin) }
                            })}>
                                <View className="flex-row items-center gap-3">
                                    <Image
                                        source={{ uri: product.magasin.photo || "https://via.placeholder.com/60" }}
                                        className="w-14 h-14 rounded-xl"
                                        resizeMode="cover"
                                    />

                                    <View className="flex-1">
                                        <Text className="font-semibold text-gray-800">{product.magasin.nomMagasin}</Text>

                                        <View className="flex-row items-center gap-2 mt-1">
                                            <MapPin size={12} color="#64748B" />
                                            <Text className="text-gray-500 text-xs">{product.magasin.localiteMagasin}</Text>
                                        </View>

                                        {product.acteur && (
                                            <Text className="text-gray-500 text-xs mt-1">
                                                Par {product.acteur.nomActeur}
                                            </Text>
                                        )}
                                    </View>

                                    <TouchableOpacity className="w-10 h-10 border border-primary rounded-xl items-center justify-center">
                                        <MessageCircle size={20} color="#22C55E" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Barre fixe en bas */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <View className="flex-row items-center gap-3">
                    <View className="flex-1">
                        <Text className="text-gray-500 text-xs">Total</Text>
                        <Text className="text-2xl font-bold text-green-500">{totalPrice.toLocaleString()} {product.monnaie?.libelle || 'FCFA'}</Text>
                    </View>

                    <TouchableOpacity onPress={openWhatsApp} className="flex-1 bg-primary py-3 rounded-xl items-center flex-row justify-center gap-2">
                        <ShoppingCart size={20} color="black" />
                        <Text className="text-black font-bold text-lg">contacter le vendeur</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}