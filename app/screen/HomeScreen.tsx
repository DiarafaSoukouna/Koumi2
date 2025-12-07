// app/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';


// Données
import Header from '@/components/common/Header';
import SearchBar from '@/components/common/SearchBar';
import ActorTypesList from '@/components/home/ActorTypesList';
import AllProductsGrid from '@/components/home/AllProductsGrid';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedStoresList from '@/components/home/FeaturedStoresList';
import HotProductsList from '@/components/home/HotProductsList';
import PromotionCarousel from '@/components/home/PromotionCarousel';
import QuickActions from '@/components/home/QuickActions';
import {
    acteurTypes,
    allProducts,
    categories,
    featuredStores,
    hotProducts,
    promotions,
    quickActions
} from '@/constants/data';
import { router } from 'expo-router';

export default function HomeScreen() {
    const [currentPage, setCurrentPage] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<number[]>([1, 2]);
    const [cart, setCart] = useState<any[]>([]);

    const handleProductPress = (product: any) => {
        console.log('Product pressed:', product);
        // Navigation vers détail produit
    };

    const handleStorePress = (store: any) => {
        router.push('/screen/StoreDetailScreen');
    };

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

            {/* Header avec recherche */}
            <Header
                title="KOUMI"
                location="Yaoundé, Cameroun"
                cartCount={cart.length}
                notificationCount={3}
                onCartPress={() => console.log('Cart pressed')}
                onNotificationPress={() => console.log('Notification pressed')}
            />

            <SearchBar
                placeholder="Rechercher produits, magasins..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSearch={() => console.log('Search:', searchQuery)}
            />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                <View className="px-4 py-4 space-y-6">

                    {/* Carousel des promotions */}
                    <PromotionCarousel
                        promotions={promotions}
                        onPromotionPress={(promo) => console.log('Promotion:', promo)}
                    />

                    {/* Grille des catégories */}
                    <CategoryGrid
                        categories={categories}
                        onCategoryPress={(category) => console.log('Category:', category)}
                    />

                    {/* Liste des types d'acteurs */}
                    <ActorTypesList
                        actorTypes={acteurTypes}
                        onActorTypePress={(type) => console.log('Actor type:', type)}
                    />


                    {/* Magasins populaires */}
                    <FeaturedStoresList
                        stores={featuredStores}
                        onStorePress={handleStorePress}
                        onSeeAllPress={() => router.push('/screen/StoreDetailScreen')}
                    />

                    {/* Produits populaires */}
                    <HotProductsList
                        products={hotProducts}
                        favorites={favorites}
                        onProductPress={handleProductPress}
                        onFavoritePress={toggleFavorite}
                        onAddToCart={addToCart}
                        onSeeAllPress={() => console.log('See all hot products')}
                    />

                    {/* Tous les produits */}
                    <AllProductsGrid
                        products={allProducts}
                        favorites={favorites}
                        onProductPress={handleProductPress}
                        onFavoritePress={toggleFavorite}
                        onAddToCart={addToCart}
                        onSeeAllPress={() => console.log('See all products')}
                    />

                    {/* Actions rapides */}
                    <QuickActions
                        actions={quickActions}
                        onActionPress={(action) => console.log('Action:', action)}
                    />

                </View>
            </ScrollView>

            {/* Navigation inférieure */}
            {/* <BottomNav
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      /> */}
        </SafeAreaView>
    );
}