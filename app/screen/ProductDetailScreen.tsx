import { StatusBar } from 'expo-status-bar';
import {
    ArrowLeft,
    Check,
    ChevronRight,
    Heart,
    MapPin,
    MessageCircle,
    Minus,
    Package,
    Plus,
    Share2,
    Shield,
    ShoppingCart,
    Star,
    Truck
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

// Types
interface ProductDetailScreenProps {
    productId: string;
    onBack: () => void;
    onStorePress: () => void;
    onRelatedProductPress: (product: any) => void;
}

const productData = {
    id: "1",
    name: "Tilapia Frais Premium",
    description: "Tilapia de qualité supérieure, élevé dans nos fermes aquacoles certifiées. Poisson frais du jour, riche en protéines et en oméga-3. Idéal pour grillades, braisé ou sauce.",
    price: 4500,
    unit: "kg",
    minOrder: 1,
    maxOrder: 100,
    stock: 250,
    rating: 4.8,
    reviews: 124,
    sold: 1547,
    images: [
        "https://via.placeholder.com/400x300/22C55E/FFFFFF?text=Tilapia",
        "https://via.placeholder.com/400x300/EA580C/FFFFFF?text=Poisson",
        "https://via.placeholder.com/400x300/FB923C/FFFFFF?text=Frais",
    ],
    seller: {
        id: "1",
        name: "Ferme Aquacole Mbanga",
        avatar: "https://via.placeholder.com/60/22C55E/FFFFFF?text=FM",
        rating: 4.9,
        verified: true,
        location: "Douala, Cameroun",
        responseTime: "< 1 heure",
    },
    specifications: [
        { label: "Origine", value: "Cameroun" },
        { label: "Type", value: "Tilapia Nilotica" },
        { label: "Poids moyen", value: "300-500g" },
        { label: "Conservation", value: "Frais / Congelé" },
        { label: "Mode d'élevage", value: "Aquaculture responsable" },
        { label: "Certification", value: "Normes locales" },
    ],
    delivery: {
        available: true,
        fee: 1500,
        estimatedTime: "24-48h",
        freeAbove: 50000,
    },
    warranty: "Garantie de fraîcheur 24h",
};

const relatedProducts = [
    { id: "2", name: "Carpe Commune", price: 3200, image: "https://via.placeholder.com/150/EA580C/FFFFFF?text=Carpe", rating: 4.7, category: "Poisson" },
    { id: "3", name: "Poisson Chat", price: 5000, image: "https://via.placeholder.com/150/FB923C/FFFFFF?text=Chat", rating: 4.6, category: "Poisson" },
    { id: "4", name: "Silure", price: 4000, image: "https://via.placeholder.com/150/8B5CF6/FFFFFF?text=Silure", rating: 4.5, category: "Poisson" },
    { id: "5", name: "Crevettes", price: 8500, image: "https://via.placeholder.com/150/22C55E/FFFFFF?text=Crevette", rating: 4.8, category: "Fruits de mer" },
];

const reviews = [
    {
        id: 1,
        user: "Marie K.",
        rating: 5,
        comment: "Excellent produit, très frais! Le poisson était parfait pour notre repas en famille.",
        date: "Il y a 2 jours",
        avatar: "https://via.placeholder.com/40/22C55E/FFFFFF?text=MK",
        helpful: 12,
    },
    {
        id: 2,
        user: "Paul M.",
        rating: 4,
        comment: "Bonne qualité, livraison rapide. Je recommande ce vendeur.",
        date: "Il y a 1 semaine",
        avatar: "https://via.placeholder.com/40/EA580C/FFFFFF?text=PM",
        helpful: 5,
    },
    {
        id: 3,
        user: "Sophie D.",
        rating: 5,
        comment: "Produit de qualité supérieure, très satisfaite de mon achat.",
        date: "Il y a 3 jours",
        avatar: "https://via.placeholder.com/40/FB923C/FFFFFF?text=SD",
        helpful: 8,
    },
];

export default function ProductDetailScreen({
    productId,
    onBack,
    onStorePress,
    onRelatedProductPress
}: ProductDetailScreenProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favorites, setFavorites] = useState<number[]>([2, 3]);
    const [cart, setCart] = useState<any[]>([]);

    const totalPrice = productData.price * quantity;

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

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />

            {/* Header fixe */}
            <View className="absolute top-0 left-0 right-0 z-10 bg-white/95 px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
                <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
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

                    <TouchableOpacity className="p-2">
                        <Share2 size={20} color="#64748B" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Images du produit */}
                <View className="relative">
                    <Image
                        source={{ uri: productData.images[selectedImage] }}
                        className="w-full h-72"
                        resizeMode="cover"
                    />

                    <Badge className="absolute top-4 left-4 bg-green-500">
                        <Text className="text-white text-xs">Top Vente</Text>
                    </Badge>

                    {/* Indicateurs d'images */}
                    <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                        {productData.images.map((_, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => setSelectedImage(idx)}
                                className={`w-2 h-2 rounded-full ${selectedImage === idx ? 'bg-white w-6' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </View>
                </View>

                {/* Informations produit */}
                <View className="px-4 py-4 space-y-4">
                    {/* Titre et note */}
                    <View>
                        <View className="flex-row items-start justify-between">
                            <View className="flex-1">
                                <Text className="text-xl font-bold text-gray-800">{productData.name}</Text>
                                <View className="flex-row items-center gap-2 mt-1">
                                    <View className="flex-row items-center gap-1">
                                        <Star size={16} color="#F59E0B" fill="#F59E0B" />
                                        <Text className="font-medium text-sm text-gray-800">{productData.rating}</Text>
                                    </View>
                                    <Text className="text-gray-500 text-sm">({productData.reviews} avis)</Text>
                                    <Text className="text-gray-500 text-sm">• {productData.sold} vendus</Text>
                                </View>
                            </View>
                        </View>

                        {/* Prix */}
                        <View className="mt-3">
                            <Text className="text-3xl font-bold text-green-500">
                                {productData.price.toLocaleString()}
                            </Text>
                            <Text className="text-lg text-gray-500 ml-1">FCFA/{productData.unit}</Text>
                        </View>
                    </View>

                    {/* Sélecteur de quantité */}
                    <View className="bg-gray-50 rounded-2xl p-4">
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="font-medium text-gray-800">Quantité</Text>
                                <Text className="text-gray-500 text-xs">
                                    Stock: {productData.stock} {productData.unit}
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
                                    onPress={() => setQuantity(Math.min(productData.maxOrder, quantity + 1))}
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
                        <Text className="text-gray-600 text-sm leading-relaxed">{productData.description}</Text>
                    </View>

                    {/* Caractéristiques */}
                    <View>
                        <Text className="font-semibold text-gray-800 mb-2">Caractéristiques</Text>
                        <View className="bg-gray-50 rounded-2xl divide-y divide-gray-200">
                            {productData.specifications.map((spec, idx) => (
                                <View key={idx} className="flex-row items-center justify-between p-3">
                                    <Text className="text-gray-500 text-sm">{spec.label}</Text>
                                    <Text className="text-gray-800 text-sm font-medium">{spec.value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Livraison */}
                    <View className="bg-gray-50 rounded-2xl p-4">
                        <Text className="font-semibold text-gray-800 mb-3">Livraison</Text>

                        <View className="space-y-2">
                            <View className="flex-row items-center gap-3">
                                <Truck size={20} color="#22C55E" />
                                <View>
                                    <Text className="text-sm font-medium text-gray-800">Livraison disponible</Text>
                                    <Text className="text-gray-500 text-xs">
                                        {productData.delivery.fee.toLocaleString()} FCFA • {productData.delivery.estimatedTime}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-center gap-3">
                                <Shield size={20} color="#10B981" />
                                <Text className="text-sm text-gray-800">
                                    Gratuite dès {productData.delivery.freeAbove.toLocaleString()} FCFA
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-3">
                                <Package size={20} color="#8B5CF6" />
                                <Text className="text-sm text-gray-800">{productData.warranty}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Informations vendeur */}
                    <View className="bg-gray-50 rounded-2xl p-4">
                        <TouchableOpacity onPress={onStorePress}>
                            <View className="flex-row items-center gap-3">
                                <Image
                                    source={{ uri: productData.seller.avatar }}
                                    className="w-14 h-14 rounded-xl"
                                    resizeMode="cover"
                                />

                                <View className="flex-1">
                                    <View className="flex-row items-center gap-2">
                                        <Text className="font-semibold text-gray-800">{productData.seller.name}</Text>
                                        {productData.seller.verified && (
                                            <Badge className="bg-green-100">
                                                <View className="flex-row items-center gap-1">
                                                    <Check size={12} color="#059669" />
                                                    <Text className="text-green-700 text-xs">Vérifié</Text>
                                                </View>
                                            </Badge>
                                        )}
                                    </View>

                                    <View className="flex-row items-center gap-2 mt-1">
                                        <MapPin size={12} color="#64748B" />
                                        <Text className="text-gray-500 text-xs">{productData.seller.location}</Text>
                                    </View>

                                    <View className="flex-row items-center gap-2 mt-1">
                                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                                        <Text className="text-gray-800 text-xs font-medium">{productData.seller.rating}</Text>
                                        <Text className="text-gray-500 text-xs">• Répond {productData.seller.responseTime}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity className="w-10 h-10 border border-primary rounded-xl items-center justify-center">
                                    <MessageCircle size={20} color="#22C55E" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Avis clients */}
                    <View>
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="font-semibold text-gray-800">Avis clients</Text>
                            <TouchableOpacity className="flex-row items-center">
                                <Text className="text-primary text-xs font-semibold mr-1">Voir tout</Text>
                                <ChevronRight size={16} color="#22C55E" />
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-3">
                            {reviews.slice(0, 2).map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    onHelpfulPress={() => console.log('Helpful:', review.id)}
                                    onReportPress={() => console.log('Report:', review.id)}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Produits similaires */}
                    <View>
                        <Text className="font-semibold text-gray-800 mb-3">Produits similaires</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex-row gap-3 pb-2">
                                {relatedProducts.map((product) => (
                                    <View key={product.id} className="w-40">
                                        <ProductCard
                                            product={product}
                                            isFavorite={favorites.includes(parseInt(product.id))}
                                            onPress={() => onRelatedProductPress(product)}
                                            onFavoritePress={() => toggleFavorite(parseInt(product.id))}
                                            onAddToCart={() => addToCart(product)}
                                            compact
                                        />
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

            {/* Barre fixe en bas */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <View className="flex-row items-center gap-3">
                    <View className="flex-1">
                        <Text className="text-gray-500 text-xs">Total</Text>
                        <Text className="text-2xl font-bold text-green-500">{totalPrice.toLocaleString()} FCFA</Text>
                    </View>

                    <TouchableOpacity className="flex-1 bg-primary py-3 rounded-xl items-center flex-row justify-center gap-2">
                        <ShoppingCart size={20} color="white" />
                        <Text className="text-white font-bold text-lg">Ajouter au panier</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}