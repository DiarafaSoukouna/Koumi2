// app/screens/StoreDetailScreen.tsx
import { StatusBar } from 'expo-status-bar';
import {
    ArrowLeft,
    ChevronRight,
    Clock,
    Heart,
    MapPin,
    MessageCircle,
    Package,
    Phone,
    Share2,
    ShieldCheck,
    Star,
    Users
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Composants réutilisables
import ProductCard from '@/components/cards/ProductCard';
import ReviewCard from '@/components/cards/ReviewCard';
import Badge from '@/components/common/Badge';
import { router, Tabs } from 'expo-router';

// Types
interface StoreDetailScreenProps {
    storeId: string;
    onBack: () => void;
    onProductPress: (product: any) => void;
}

const storeData = {
    id: "1",
    name: "Ferme Aquacole Mbanga",
    type: "Producteur",
    description: "Spécialisée dans l'élevage de tilapia et de carpes depuis 2015. Nous fournissons des poissons frais de haute qualité aux particuliers et professionnels.",
    rating: 4.8,
    reviews: 124,
    image: "https://via.placeholder.com/400x200/22C55E/FFFFFF?text=Ferme",
    verified: true,
    location: "Douala, Littoral",
    phone: "+237 6XX XXX XXX",
    hours: "Lun-Sam: 7h-18h",
    memberSince: "2020",
    totalSales: 1847,
    responseRate: "98%",
    responseTime: "< 1 heure",
};

const products = [
    { id: 1, name: "Tilapia Frais", price: 3500, unit: "kg", image: "https://via.placeholder.com/150/22C55E/FFFFFF?text=Tilapia", rating: 4.8, category: "Poisson" },
    { id: 2, name: "Carpe Commune", price: 3000, unit: "kg", image: "https://via.placeholder.com/150/EA580C/FFFFFF?text=Carpe", rating: 4.7, category: "Poisson" },
    { id: 3, name: "Poisson Chat", price: 4000, unit: "kg", image: "https://via.placeholder.com/150/FB923C/FFFFFF?text=Chat", rating: 4.9, category: "Poisson" },
    { id: 4, name: "Silure", price: 4500, unit: "kg", image: "https://via.placeholder.com/150/8B5CF6/FFFFFF?text=Silure", rating: 4.6, category: "Poisson" },
    { id: 5, name: "Alevins Tilapia", price: 200, unit: "pièce", image: "https://via.placeholder.com/150/22C55E/FFFFFF?text=Alevin", rating: 4.8, category: "Alevins" },
    { id: 6, name: "Aliment Flottant", price: 12000, unit: "sac 25kg", image: "https://via.placeholder.com/150/EA580C/FFFFFF?text=Aliment", rating: 4.5, category: "Intrant" },
];

const reviews = [
    {
        id: 1,
        author: "Marie K.",
        rating: 5,
        date: "Il y a 2 jours",
        comment: "Excellent produit, très frais. Livraison rapide!",
        avatar: "https://via.placeholder.com/40/22C55E/FFFFFF?text=MK",
    },
    {
        id: 2,
        author: "Paul M.",
        rating: 4,
        date: "Il y a 1 semaine",
        comment: "Bonne qualité, je recommande.",
        avatar: "https://via.placeholder.com/40/EA580C/FFFFFF?text=PM",
    },
    {
        id: 3,
        author: "Sophie D.",
        rating: 5,
        date: "Il y a 3 jours",
        comment: "Service impeccable, produits frais et prix compétitifs.",
        avatar: "https://via.placeholder.com/40/FB923C/FFFFFF?text=SD",
    },
];

export default function StoreDetailScreen({ storeId, onBack, onProductPress }: StoreDetailScreenProps) {
    const [favorites, setFavorites] = useState<number[]>([1, 2]);
    const [cart, setCart] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'about'>('products');

    const toggleFavorite = (productId: number) => {
        setFavorites(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const addToCart = (product: any) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const tabs = [
        { id: 'products', label: `Produits (${products.length})` },
        { id: 'reviews', label: `Avis (${reviews.length})` },
        { id: 'about', label: 'À propos' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return (
                    <View className="grid grid-cols-2 gap-3 mt-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isFavorite={favorites.includes(product.id)}
                                onPress={() => router.push("/screen/ProductDetailScreen")}
                                onFavoritePress={() => toggleFavorite(product.id)}
                                onAddToCart={() => addToCart(product)}
                            />
                        ))}
                    </View>
                );

            case 'reviews':
                return (
                    <View className="mt-4 space-y-4">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                onHelpfulPress={() => console.log('Helpful:', review.id)}
                                onReportPress={() => console.log('Report:', review.id)}
                            />
                        ))}
                        <TouchableOpacity className="items-center py-3 border-t border-gray-200 mt-4">
                            <Text className="text-primary font-semibold">Voir tous les avis</Text>
                            <ChevronRight size={16} color="#22C55E" />
                        </TouchableOpacity>
                    </View>
                );

            case 'about':
                return (
                    <View className="mt-4 space-y-4">
                        <View className="bg-gray-50 rounded-2xl p-4">
                            <Text className="font-bold text-gray-800 mb-2">Description</Text>
                            <Text className="text-gray-600 text-sm leading-relaxed">
                                {storeData.description}
                            </Text>
                        </View>

                        <View className="bg-gray-50 rounded-2xl p-4">
                            <Text className="font-bold text-gray-800 mb-3">Informations</Text>

                            <View className="space-y-3">
                                <View className="flex-row items-center">
                                    <Clock size={16} color="#64748B" />
                                    <Text className="text-gray-600 text-sm ml-2 flex-1">Horaires</Text>
                                    <Text className="text-gray-800 text-sm font-medium">{storeData.hours}</Text>
                                </View>

                                <View className="flex-row items-center">
                                    <Users size={16} color="#64748B" />
                                    <Text className="text-gray-600 text-sm ml-2 flex-1">Membre depuis</Text>
                                    <Text className="text-gray-800 text-sm font-medium">{storeData.memberSince}</Text>
                                </View>

                                <View className="flex-row items-center">
                                    <Package size={16} color="#64748B" />
                                    <Text className="text-gray-600 text-sm ml-2 flex-1">Ventes totales</Text>
                                    <Text className="text-gray-800 text-sm font-medium">{storeData.totalSales}</Text>
                                </View>

                                <View className="flex-row items-center">
                                    <MessageCircle size={16} color="#64748B" />
                                    <Text className="text-gray-600 text-sm ml-2 flex-1">Taux de réponse</Text>
                                    <Text className="text-gray-800 text-sm font-medium">{storeData.responseRate}</Text>
                                </View>

                                <View className="flex-row items-center">
                                    <Clock size={16} color="#64748B" />
                                    <Text className="text-gray-600 text-sm ml-2 flex-1">Délai de réponse</Text>
                                    <Text className="text-gray-800 text-sm font-medium">{storeData.responseTime}</Text>
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
                    <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
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
                        source={{ uri: storeData.image }}
                        className="w-full h-48"
                        resizeMode="cover"
                    />

                    {/* Overlay pour le nom */}
                    <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <View className="flex-row items-center gap-2 mb-1">
                            {storeData.verified && (
                                <Badge className="bg-green-500">
                                    <View className="flex-row items-center gap-1">
                                        <ShieldCheck size={12} color="white" />
                                        <Text className="text-white text-xs">Vérifié</Text>
                                    </View>
                                </Badge>
                            )}
                            <Badge variant="secondary" className="bg-orange-500">
                                <Text className="text-white text-xs">{storeData.type}</Text>
                            </Badge>
                        </View>
                        <Text className="text-xl font-bold text-white">{storeData.name}</Text>
                    </View>
                </View>

                {/* Statistiques rapides */}
                <View className="px-4 -mt-6">
                    <View className="bg-white rounded-2xl shadow-lg p-4">
                        <View className="flex-row items-center justify-around">
                            <View className="items-center">
                                <View className="flex-row items-center gap-1">
                                    <Star size={16} color="#F59E0B" fill="#F59E0B" />
                                    <Text className="font-bold text-gray-800">{storeData.rating}</Text>
                                </View>
                                <Text className="text-gray-500 text-xs">{storeData.reviews} avis</Text>
                            </View>

                            <View className="items-center">
                                <Text className="font-bold text-gray-800">{storeData.totalSales}</Text>
                                <Text className="text-gray-500 text-xs">Ventes</Text>
                            </View>

                            <View className="items-center">
                                <Text className="font-bold text-gray-800">{storeData.responseRate}</Text>
                                <Text className="text-gray-500 text-xs">Réponse</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Informations de contact */}
                <View className="px-4 mt-4 space-y-3">
                    <View className="flex-row items-center gap-2">
                        <MapPin size={16} color="#22C55E" />
                        <Text className="text-gray-800 text-sm">{storeData.location}</Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                        <Phone size={16} color="#22C55E" />
                        <Text className="text-gray-800 text-sm">{storeData.phone}</Text>
                    </View>
                </View>

                {/* Boutons d'action */}
                <View className="px-4 mt-4 flex-row gap-3">
                    <TouchableOpacity className="flex-1 bg-primary py-3 rounded-xl items-center flex-row justify-center gap-2">
                        <Phone size={16} color="white" />
                        <Text className="text-white font-semibold">Appeler</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-1 border border-primary py-3 rounded-xl items-center flex-row justify-center gap-2">
                        <MessageCircle size={16} color="#22C55E" />
                        <Text className="text-primary font-semibold">Message</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View className="mt-6 px-4">
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {renderContent()}
                </View>

                {/* Espace pour le bottom padding */}
                <View className="h-24" />
            </ScrollView>

            {/* Bottom Bar pour ajouter au panier */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <TouchableOpacity className="bg-primary py-3 rounded-xl items-center">
                    <Text className="text-white font-bold text-lg">Visiter la boutique</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}