// app/screen/filiere/[libelle].tsx
import ProductCard from "@/components/cards/ProductCard";
import { useHome } from "@/context/HomeContext";
import { Filiere } from "@/Types/Filiere";
import { Stock } from "@/Types/Stock";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  ChevronRight,
  Grid,
  List,
  MapPin,
  Store,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FiliereDetailScreen() {
  const { libelle, idFiliere } = useLocalSearchParams<{
    libelle: string;
    idFiliere?: string;
  }>();

  const decodedLibelle = decodeURIComponent(libelle || "");

  const {
    getAllByfillierer,
    stocksByFiliere,
    loadingStocksByFiliere,
    errorStocksByFiliere,
    fillieres,
  } = useHome();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"default" | "price" | "name">("default");
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentFiliere, setCurrentFiliere] = useState<Filiere | null>(null);

  // Trouver la filière actuelle pour avoir plus de détails
  useEffect(() => {
    if (idFiliere && fillieres.length > 0) {
      const filiere = fillieres.find((f) => f.idFiliere === idFiliere);
      setCurrentFiliere(filiere || null);
    }
  }, [idFiliere, fillieres]);

  useEffect(() => {
    if (decodedLibelle) {
      loadStocks();
    }
  }, [decodedLibelle]);

  const loadStocks = async () => {
    try {
      await getAllByfillierer(decodedLibelle);
    } catch (error) {
      console.error("Erreur lors du chargement des stocks:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStocks();
    setRefreshing(false);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProductPress = (stock: Stock) => {
    router.push({
      pathname: "/screen/ProductDetailScreen",
      params: { stock: JSON.stringify(stock) },
    });
  };

  const handleStorePress = (magasinId: string) => {
    // Trouver le magasin dans les stocks
    const stock = stocksByFiliere.find(
      (s) => s.magasin?.idMagasin === magasinId
    );
    if (stock?.magasin) {
      router.push({
        pathname: "/screen/StoreDetailScreen",
        params: { Magasin: JSON.stringify(stock.magasin) },
      });
    }
  };

  // Trier les produits
  const sortedStocks = [...stocksByFiliere].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.prix - b.prix;
      case "name":
        return a.nomProduit.localeCompare(b.nomProduit);
      default:
        return 0;
    }
  });

  // Grouper par magasin pour la vue liste
  const storesMap = new Map();
  stocksByFiliere.forEach((stock) => {
    const storeId = stock.magasin?.idMagasin;
    if (storeId) {
      if (!storesMap.has(storeId)) {
        storesMap.set(storeId, {
          store: stock.magasin,
          products: [],
        });
      }
      storesMap.get(storeId).products.push(stock);
    }
  });

  const storesArray = Array.from(storesMap.values());

  // Compter les statistiques
  const stats = {
    totalProducts: stocksByFiliere.length,
    totalStores: storesArray.length,
    averagePrice:
      stocksByFiliere.length > 0
        ? stocksByFiliere.reduce((sum, stock) => sum + stock.prix, 0) /
          stocksByFiliere.length
        : 0,
    minPrice:
      stocksByFiliere.length > 0
        ? Math.min(...stocksByFiliere.map((s) => s.prix))
        : 0,
    maxPrice:
      stocksByFiliere.length > 0
        ? Math.max(...stocksByFiliere.map((s) => s.prix))
        : 0,
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>

        <Text
          className="text-lg font-bold text-gray-800 flex-1 px-4"
          numberOfLines={1}
        >
          {decodedLibelle}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Contrôles de vue et tri */}
        <View className="bg-white px-4 py-3 mt-2 flex-row justify-between items-center">
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => setSortBy("default")}
              className={`px-3 py-1 rounded-full ${
                sortBy === "default" ? "bg-yellow-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm ${
                  sortBy === "default" ? "text-white" : "text-gray-600"
                }`}
              >
                Tous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSortBy("price")}
              className={`px-3 py-1 rounded-full ${
                sortBy === "price" ? "bg-yellow-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm ${
                  sortBy === "price" ? "text-white" : "text-gray-600"
                }`}
              >
                Prix
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSortBy("name")}
              className={`px-3 py-1 rounded-full ${
                sortBy === "name" ? "bg-yellow-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm ${
                  sortBy === "name" ? "text-white" : "text-gray-600"
                }`}
              >
                Nom
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid" ? "bg-gray-100" : ""
              }`}
            >
              <Grid
                size={20}
                color={viewMode === "grid" ? "#3B82F6" : "#6B7280"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list" ? "bg-gray-100" : ""
              }`}
            >
              <List
                size={20}
                color={viewMode === "list" ? "#3B82F6" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {loadingStocksByFiliere ? (
          <View className="py-10">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-center text-gray-500 mt-4">
              Chargement des produits...
            </Text>
          </View>
        ) : errorStocksByFiliere ? (
          <View className="py-10 px-4">
            <Text className="text-red-500 text-center">
              Erreur: {errorStocksByFiliere}
            </Text>
            <TouchableOpacity
              onPress={loadStocks}
              className="mt-4 bg-yellow-500 py-2 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">
                Réessayer
              </Text>
            </TouchableOpacity>
          </View>
        ) : stocksByFiliere.length === 0 ? (
          <View className="py-10 px-4">
            <View className="bg-gray-100 rounded-2xl p-8 items-center">
              <Store size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg font-medium mt-4">
                Aucun produit disponible
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Cette filière ne contient aucun produit pour le moment
              </Text>
            </View>
          </View>
        ) : viewMode === "grid" ? (
          // Vue Grille
          <View className="px-4 py-4">
            {/* <Text className="text-lg font-bold text-gray-800 mb-3">
              Produits ({stats.totalProducts})
            </Text> */}

            <View className="flex-row flex-wrap justify-between">
              {sortedStocks.map((stock) => {
                const productId =
                  parseInt(stock.idStock) || Math.floor(Math.random() * 1000);

                return (
                  <View key={stock.idStock} className="w-[48%] mb-4">
                    <ProductCard
                      product={{
                        id: productId,
                        name: stock.nomProduit,
                        price: stock.prix,
                        image: stock.photo,
                        store: stock.magasin?.nomMagasin || "Magasin",
                        reviews: stock.nbreView,
                        category: stock.typeProduit,
                      }}
                      isFavorite={favorites.includes(productId)}
                      onPress={() => handleProductPress(stock)}
                      onFavoritePress={() => toggleFavorite(productId)}
                      compact={false}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          // Vue Liste par magasin
          <View className="px-4 py-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Magasins ({stats.totalStores})
            </Text>

            {storesArray.map((storeData, storeIndex) => (
              <View
                key={storeData.store?.idMagasin || storeIndex}
                className="mb-6"
              >
                {/* En-tête du magasin */}
                <TouchableOpacity
                  onPress={() =>
                    handleStorePress(storeData.store?.idMagasin || "")
                  }
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      {storeData.store?.logo ? (
                        <Image
                          source={{ uri: storeData.store.logo }}
                          className="w-12 h-12 rounded-lg mr-3"
                        />
                      ) : (
                        <View className="w-12 h-12 bg-blue-100 rounded-lg items-center justify-center mr-3">
                          <Store size={24} color="#3B82F6" />
                        </View>
                      )}
                      <View className="flex-1">
                        <Text className="font-bold text-gray-900">
                          {storeData.store?.nomMagasin || "Magasin"}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <MapPin size={14} color="#6B7280" />
                          <Text className="text-gray-500 text-xs ml-1">
                            {storeData.store?.localisationMagasin ||
                              "Localisation inconnue"}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>

                {/* Produits du magasin */}
                <View className="ml-2">
                  {/* <Text className="text-gray-500 text-sm mb-2">
                    {storeData.products.length} produit(s) disponible(s)
                  </Text> */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row space-x-3">
                      {storeData.products.map((stock) => {
                        const productId =
                          parseInt(stock.idStock) ||
                          Math.floor(Math.random() * 1000);

                        return (
                          <View key={stock.idStock} style={{ width: 160 }}>
                            <ProductCard
                              product={{
                                id: productId,
                                name: stock.nomProduit,
                                price: stock.prix,
                                image: stock.photo,
                                store: stock.magasin?.nomMagasin || "Magasin",
                                reviews: stock.nbreView,
                                category: stock.typeProduit,
                              }}
                              isFavorite={favorites.includes(productId)}
                              onPress={() => handleProductPress(stock)}
                              onFavoritePress={() => toggleFavorite(productId)}
                              compact={true}
                            />
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
