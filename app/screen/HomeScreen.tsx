import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import Header from "@/components/common/Header";
import SearchBar from "@/components/common/SearchBar";
import ActorTypesList from "@/components/home/ActorTypesList";
import AllProductsGrid from "@/components/home/AllProductsGrid";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedStoresList from "@/components/home/FeaturedStoresList";
import HotProductsList from "@/components/home/HotProductsList";
import PromotionCarousel from "@/components/home/PromotionCarousel";
import { categories, promotions } from "@/constants/data";
import { useHome } from "@/context/HomeContext";
import { Magasin } from "@/Types/Magasin";
import { Stock } from "@/Types/Stock";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const {
    magasins,
    getAllMagasins,
    stocks,
    getAllStock,
    typeActeur,
    getAllTypeActeurs,
  } = useHome();
  const [currentPage, setCurrentPage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([1, 2]);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    getAllMagasins();
    getAllStock();
    getAllTypeActeurs();
  }, []);

  const handleProductPress = (stock: Stock) => {
    router.push({
      pathname: "/screen/ProductDetailScreen",
      params: { stock: JSON.stringify(stock) },
    });
  };

  const handleStorePress = (Magasin: Magasin) => {
    router.push({
      pathname: "/screen/StoreDetailScreen",
      params: { Magasin: JSON.stringify(Magasin) },
    });
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // const addToCart = (product: any) => {
  //     const existing = cart.find(item => item.id === product.id);
  //     if (existing) {
  //         setCart(cart.map(item =>
  //             item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
  //         ));
  //     } else {
  //         setCart([...cart, { ...product, quantity: 1 }]);
  //     }
  // };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="KOUMI"
        location="Yaoundé, Cameroun"
        cartCount={cart.length}
        notificationCount={3}
        // onCartPress={() => console.log('Cart pressed')}
        onNotificationPress={() => console.log("Notification pressed")}
      />

      <SearchBar
        placeholder="Rechercher produits, magasins..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={() => console.log("Search:", searchQuery)}
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
            onPromotionPress={(promo) => console.log("Promotion:", promo)}
          />

          {/* Grille des catégories */}
          <CategoryGrid
            categories={categories}
            onCategoryPress={(category) => console.log("Category:", category)}
          />

          {/* Liste des types d'acteurs */}
          <ActorTypesList
            actorTypes={typeActeur}
            onActorTypePress={(type) => console.log("Actor type:", type)}
          />
          {/* Magasins populaires */}
          <FeaturedStoresList
            stores={magasins}
            onStorePress={handleStorePress}
            onSeeAllPress={() => console.log("See all stores")}
          />

          {/* Produits populaires */}
          <HotProductsList
            products={stocks}
            favorites={favorites}
            onProductPress={handleProductPress}
            onFavoritePress={toggleFavorite}
            // onAddToCart={addToCart}
            onSeeAllPress={() => console.log("See all hot products")}
          />

          {/* Tous les produits */}
          <AllProductsGrid
            products={stocks}
            favorites={favorites}
            onProductPress={handleProductPress}
            onFavoritePress={toggleFavorite}
            // onAddToCart={addToCart}
            onSeeAllPress={() => console.log("See all products")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
