import { StatusBar } from 'expo-status-bar';
import {
    ArrowLeft,
    Heart,
    MapPin,
    MessageCircle,
    Phone,
    Share2,
    ShieldCheck,
    Star
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { Magasin } from '@/Types/Magasin';
import { Stock } from '@/Types/Stock';
import ProductCard from '@/components/cards/ProductCard';
import Badge from '@/components/common/Badge';
import Tabs from '@/components/common/Tabs';
import { getAllStocksByActeur } from '@/service/productByUser/getAllByActeur';
import { useLocalSearchParams, useRouter } from 'expo-router';


export default function StoreDetailScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [store, setStore] = useState<Magasin | null>(null);
    const [products, setProducts] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'about'>('products');

    useEffect(() => {
        if (params.Magasin) {
            try {
                const magasinData = typeof params.Magasin === 'string'
                    ? JSON.parse(params.Magasin)
                    : params.Magasin;
                setStore(magasinData);

                if (magasinData.acteur?.idActeur) {
                    fetchProducts(magasinData.acteur.idActeur);
                }
            } catch (e) {
                console.error("Error parsing store data:", e);
                setLoading(false);
            }
        }
    }, [params.Magasin]);

    const fetchProducts = async (acteurId: string) => {
        try {
            setLoading(true);
            const data = await getAllStocksByActeur(acteurId);
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (productId: string) => {
        setFavorites(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const addToCart = (product: Stock) => {
        console.log("Add to cart:", product.nomProduit);
    };

    if (!store) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }

    const tabs = [
        { id: 'products', label: `Produits (${products.length})` },
        { id: 'reviews', label: `Avis (0)` },
        { id: 'about', label: 'À propos' },
    ];

    const handleTabChange = (tabId: string) => {
        if (tabId === 'products' || tabId === 'reviews' || tabId === 'about') {
            setActiveTab(tabId);
        }
    };

    const openWhatsApp = () => {
        if (!store.acteur?.whatsAppActeur) {
            Alert.alert("Erreur", "Numéro WhatsApp non disponible")
            return
        }

        const phone = store.acteur.whatsAppActeur.replace(/\s+/g, "").replace("+", "")
        const message = `Bonjour, je suis intéressé par votre magasin : ${store.nomMagasin}`

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

        Linking.openURL(url).catch(() => {
            Alert.alert("Erreur", "Impossible d'ouvrir WhatsApp")
        })
    }

    const openPhone = () => {
        if (!store.acteur?.telephoneActeur) {
            Alert.alert("Erreur", "Numéro de téléphone non disponible")
            return
        }

        const phone = store.acteur.telephoneActeur.replace(/\s+/g, "")
        const url = `tel:${phone}`

        Linking.openURL(url).catch(() => {
            Alert.alert("Erreur", "Impossible de composer le numéro")
        })
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return (
                    <View className="grid grid-cols-2 gap-3 mt-4">
                        {products.map((stock) => (
                            <ProductCard
                                key={stock.idStock}
                                product={{
                                    id: parseInt(stock.idStock) || Math.random(),
                                    name: stock.nomProduit,
                                    price: stock.prix,
                                    image: stock.photo,
                                    store: store.nomMagasin,
                                    reviews: stock.nbreView,
                                    category: stock.typeProduit
                                }}
                                isFavorite={favorites.includes(stock.idStock)}
                                onPress={() => router.push({
                                    pathname: "/screen/ProductDetailScreen",
                                    params: { stock: JSON.stringify(stock) }
                                })}
                                onFavoritePress={() => toggleFavorite(stock.idStock)}
                            // onAddToCart={() => addToCart(stock)}
                            />
                        ))}
                        {products.length === 0 && !loading && (
                            <Text className="text-center text-gray-500 py-8 col-span-2">Aucun produit disponible</Text>
                        )}
                        {loading && (
                            <Text className="text-center text-gray-500 py-8 col-span-2">Chargement des produits...</Text>
                        )}
                    </View>
                );

            case 'reviews':
                return (
                    <View className="mt-4 space-y-4">
                        <Text className="text-center text-gray-500 py-8">Aucun avis pour le moment</Text>
                    </View>
                );
            case 'about':
                return (
                    <View className="mt-6 space-y-6">
                        {/* Header avec dégradé */}
                        <View className="bg-gradient-to-r from-primary/10 to-orange-100 rounded-2xl p-5">
                            <View className="flex-row items-start gap-3">
                                <View className="w-12 h-12 bg-white rounded-xl items-center justify-center shadow-sm">
                                    <Text className="text-primary text-xl">🏪</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xl font-bold text-gray-800 mb-1">À propos du magasin</Text>
                                    <Text className="text-gray-600 text-sm">
                                        Découvrez toutes les informations concernant {store.nomMagasin}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Carte de présentation */}
                        <View className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                            <View className="flex-row items-center gap-3 mb-4">
                                <View className="w-10 h-10 bg-gradient-to-br from-primary to-green-400 rounded-xl items-center justify-center shadow-sm">
                                    <MapPin size={20} color="white" />
                                </View>
                                <View>
                                    <Text className="text-gray-800 font-bold">Localisation</Text>
                                    <Text className="text-gray-500 text-xs">Informations de base</Text>
                                </View>
                            </View>

                            <View className="space-y-4">
                                <View className="flex-row items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl">
                                    <View className="w-8 h-8 bg-white rounded-lg items-center justify-center shadow-sm">
                                        <Text className="text-blue-600">📍</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-500 text-xs">Adresse</Text>
                                        <Text className="text-gray-800 font-medium">{store.localiteMagasin}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl">
                                    <View className="w-8 h-8 bg-white rounded-lg items-center justify-center shadow-sm">
                                        <Text className="text-purple-600">🏙️</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-500 text-xs">Région</Text>
                                        <Text className="text-gray-800 font-medium">{store.niveau1Pays?.nomN1 || "Non spécifiée"}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl">
                                    <View className="w-8 h-8 bg-white rounded-lg items-center justify-center shadow-sm">
                                        <Text className="text-red-600">🌍</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-500 text-xs">Pays</Text>
                                        <Text className="text-gray-800 font-medium">{store.pays}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Propriétaire avec carte élégante */}
                        {store.acteur && (
                            <View className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                                <View className="flex-row items-center justify-between mb-4">
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-400 rounded-xl items-center justify-center shadow-sm">
                                            <Text className="text-white text-sm">👑</Text>
                                        </View>
                                        <View>
                                            <Text className="text-gray-800 font-bold">Propriétaire</Text>
                                            <Text className="text-gray-500 text-xs">Informations du créateur</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Avatar et nom */}
                                <View className="flex-row items-center gap-4 mb-6 p-3 bg-gradient-to-r from-indigo-50 to-purple-50/50 rounded-xl">
                                    <Image
                                        source={{ uri: store.acteur.photoSiegeActeur || store.acteur.logoActeur || "https://via.placeholder.com/80/079C48/FFFFFF?text=" + store.acteur.nomActeur.charAt(0) }}
                                        className="w-16 h-16 rounded-xl border-4 border-white shadow-md"
                                    />
                                    <View className="flex-1">
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Text className="text-gray-800 font-bold text-lg">{store.acteur.nomActeur}</Text>
                                            {store.acteur.statutActeur && (
                                                <View className="bg-gradient-to-r from-green-500 to-emerald-400 px-2 py-1 rounded-full">
                                                    <Text className="text-white text-xs font-bold">✓ Vérifié</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text className="text-gray-500 text-sm">{store.acteur.emailActeur}</Text>
                                    </View>
                                </View>

                                {/* Tags de spécialisation */}
                                {store.acteur.typeActeur && store.acteur.typeActeur.length > 0 && (
                                    <View className="mb-4">
                                        <Text className="text-gray-600 text-sm font-medium mb-3">Types d'activité</Text>
                                        <View className="flex-row flex-wrap gap-2">
                                            {store.acteur.typeActeur.map((type, index) => (
                                                <View
                                                    key={type.idTypeActeur}
                                                    className={`px-4 py-2 rounded-full shadow-sm ${index % 3 === 0 ? 'bg-primary/10' :
                                                        index % 3 === 1 ? 'bg-orange-100' :
                                                            'bg-purple-100'
                                                        }`}
                                                >
                                                    <Text className={`text-sm font-medium ${index % 3 === 0 ? 'text-primary' :
                                                        index % 3 === 1 ? 'text-orange-700' :
                                                            'text-purple-700'
                                                        }`}>
                                                        {type.libelle}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {/* Spéculations avec icônes */}
                                {store.acteur.speculation && store.acteur.speculation.length > 0 && (
                                    <View>
                                        <Text className="text-gray-600 text-sm font-medium mb-3">Domaines d'expertise</Text>
                                        <View className="space-y-2">
                                            {store.acteur.speculation.map((spec) => (
                                                <View key={spec.idSpeculation} className="flex-row items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                    <View className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg items-center justify-center">
                                                        <Text className="text-orange-600">🌱</Text>
                                                    </View>
                                                    <View className="flex-1">
                                                        <Text className="text-gray-800 font-medium">{spec.nomSpeculation}</Text>
                                                        <Text className="text-gray-500 text-xs" numberOfLines={1}>
                                                            {spec.descriptionSpeculation || "Spécialisation en " + spec.nomSpeculation}
                                                        </Text>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {/* Bouton WhatsApp */}
                                {store.acteur.whatsAppActeur && (
                                    <TouchableOpacity onPress={() => openWhatsApp()} className="mt-4 bg-gradient-to-r from-green-500 to-emerald-400 p-4 rounded-xl flex-row items-center justify-between shadow-md active:opacity-90">
                                        <View className="flex-row items-center gap-3">
                                            <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
                                                <Text className="text-white text-lg">💬</Text>
                                            </View>
                                            <View>
                                                <Text className="text-gray-800 font-bold">Contacter sur WhatsApp</Text>
                                                <Text className="text-gray-800/80 text-xs">{store.acteur.whatsAppActeur}</Text>
                                            </View>
                                        </View>
                                        <Text className="text-gray-800 font-bold">→</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {/* Statistiques en grille moderne */}
                        <View className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                            <Text className="text-gray-800 font-bold mb-4">Statistiques</Text>
                            <View className="grid grid-cols-2 gap-3">
                                <View className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                                    <Text className="text-gray-500 text-xs mb-1">Code magasin</Text>
                                    <Text className="text-blue-600 font-bold text-lg">{store.codeMagasin}</Text>
                                </View>

                                <View className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                                    <Text className="text-gray-500 text-xs mb-1">Statut</Text>
                                    <View className="flex-row items-center gap-2">
                                        <View className={`w-3 h-3 rounded-full ${store.statutMagasin ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        <Text className="text-green-700 font-bold">
                                            {store.statutMagasin ? 'Actif' : 'Inactif'}
                                        </Text>
                                    </View>
                                </View>

                                <View className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                                    <Text className="text-gray-500 text-xs mb-1">Date d'ajout</Text>
                                    <Text className="text-purple-600 font-bold">
                                        {new Date(store.dateAjout).toLocaleDateString('fr-FR')}
                                    </Text>
                                </View>

                                <View className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                                    <Text className="text-gray-500 text-xs mb-1">Vues totales</Text>
                                    <View className="flex-row items-center gap-1">
                                        <Text className="text-orange-600 font-bold text-lg">{store.nbreView || 0}</Text>
                                        <Text className="text-orange-500 text-xs">visites</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />

            {/* Header personnalisé */}
            <View className="bg-white px-4 pt-4 pb-3 border-b border-gray-200">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                        <ArrowLeft size={24} color="#1E293B" />
                    </TouchableOpacity>

                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity className="p-2">
                            <Heart size={20} color="#64748B" />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-2">
                            <Share2 size={20} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image du magasin */}
                <View className="relative">
                    <Image
                        source={{ uri: store.photo || "https://via.placeholder.com/400x200/22C55E/FFFFFF?text=Magasin" }}
                        className="w-full h-48"
                        resizeMode="cover"
                    />

                    {/* Overlay pour le nom */}
                    <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <View className="flex-row items-center gap-2 mb-1">
                            {store.statutMagasin && (
                                <Badge className="bg-green-500">
                                    <View className="flex-row items-center gap-1">
                                        <ShieldCheck size={12} color="white" />
                                        <Text className="text-white text-xs">Vérifié</Text>
                                    </View>
                                </Badge>
                            )}
                            {store.acteur?.typeActeur && store.acteur.typeActeur.length > 0 && (
                                <Badge variant="secondary" className="bg-orange-500">
                                    <Text className="text-white text-xs">{store.acteur.typeActeur[0].libelle}</Text>
                                </Badge>
                            )}
                        </View>
                        <Text className="text-xl font-bold text-white">{store.nomMagasin}</Text>
                    </View>
                </View>

                {/* Statistiques rapides */}
                <View className="px-4 -mt-6">
                    <View className="bg-white rounded-2xl shadow-lg p-4">
                        <View className="flex-row items-center justify-around">
                            <View className="items-center">
                                <View className="flex-row items-center gap-1">
                                    <Star size={16} color="#F59E0B" fill="#F59E0B" />
                                    <Text className="font-bold text-gray-800">{store.nbreView || 0}</Text>
                                </View>
                                <Text className="text-gray-500 text-xs">Vues</Text>
                            </View>

                            <View className="items-center">
                                <Text className="font-bold text-gray-800">{products.length}</Text>
                                <Text className="text-gray-500 text-xs">Produits</Text>
                            </View>

                            <View className="items-center">
                                <Text className="font-bold text-gray-800">Code</Text>
                                <Text className="text-gray-500 text-xs">{store.codeMagasin}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Informations de contact */}
                <View className="px-4 mt-4 space-y-3">
                    <View className="flex-row items-center gap-2">
                        <MapPin size={16} color="#22C55E" />
                        <Text className="text-gray-800 text-sm">{store.localiteMagasin}, {store.niveau1Pays?.nomN1}</Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                        <Phone size={16} color="#22C55E" />
                        <Text className="text-gray-800 text-sm">{store.contactMagasin}</Text>
                    </View>
                </View>

                {/* Boutons d'action */}
                <View className="px-4 mt-4 flex-row gap-3">
                    <TouchableOpacity onPress={openPhone} className="flex-1 border border-primary bg-primary py-3 rounded-xl items-center flex-row justify-center gap-2">
                        <Phone size={16} color="black" />
                        <Text className="text-black font-semibold">Appeler</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openWhatsApp} className="flex-1 border border-primary py-3 rounded-xl items-center flex-row justify-center gap-2">
                        <MessageCircle size={16} color="black" />
                        <Text className="text-black font-semibold">Message</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View className="mt-6 px-4">
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />

                    {renderContent()}
                </View>

                {/* Espace pour le bottom padding */}
                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
}