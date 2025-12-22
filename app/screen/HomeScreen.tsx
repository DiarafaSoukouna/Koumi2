import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import Header from "@/components/common/Header";
import SearchBar from "@/components/common/SearchBar";
import AllProductsGrid from "@/components/home/AllProductsGrid";
import FeaturedStoresList from "@/components/home/FeaturedStoresList";
import FiliereGrid from "@/components/home/FiliereGrid";
import HotProductsList from "@/components/home/HotProductsList";
import IntrantsPreviewList from "@/components/home/IntrantsPreviewList";
import PromotionCarousel from "@/components/home/PromotionCarousel";
import { promotions } from "@/constants/data";
import { useHome } from "@/context/HomeContext";
import { useIntrant } from "@/context/Intrant";
import { Intrant } from "@/Types/consumer";
import { Filiere } from "@/Types/Filiere";
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
    getAllFillieres,
    loadingFillieres,
    fillieres,
  } = useHome();

  const { GetAllintrantList, loading, fetchIntrant } = useIntrant();

  const [currentPage, setCurrentPage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([1, 2]);
  const [cart, setCart] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    getAllMagasins();
    getAllStock();
    getAllTypeActeurs();
    fetchIntrant();
    getAllFillieres();
  }, []);

  // Fonction pour gérer la recherche
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearchActive(true);
    }
  };

  // Fonction pour annuler la recherche
  const handleCancelSearch = () => {
    setSearchQuery("");
    setIsSearchActive(false);
  };

  // Fonction pour effacer le texte de recherche
  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchActive(false);
  };

  // Filtrer les données en fonction de la recherche
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        stocks: [],
        magasins: [],
        intrants: [],
        filieres: [],
      };
    }

    const query = searchQuery.toLowerCase().trim();

    return {
      stocks: stocks.filter((stock) =>
        stock.descriptionStock?.toLowerCase().includes(query)
      ),
      magasins: magasins.filter((magasin) =>
        magasin.nomMagasin?.toLowerCase().includes(query)
      ),
      intrants: GetAllintrantList.filter(
        (intrant) =>
          intrant.nomIntrant?.toLowerCase().includes(query) ||
          intrant.descriptionIntrant?.toLowerCase().includes(query)
      ),
      filieres: fillieres.filter((filiere) =>
        filiere.libelleFiliere?.toLowerCase().includes(query)
      ),
    };
  }, [searchQuery, stocks, magasins, GetAllintrantList, fillieres]);

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

  const handleIntrantPress = (intrant: Intrant) => {
    router.push({
      pathname: "/screen/intrant/[id]",
      params: { id: intrant.idIntrant },
    });
  };

  const handleFilierePress = (filiere: Filiere) => {
    router.push({
      pathname: "/screen/filiere/[libelle]",
      params: {
        libelle: encodeURIComponent(filiere.libelleFiliere),
        idFiliere: filiere.idFiliere,
      },
    });
  };

  // Rendu des résultats de recherche
  const renderSearchResults = () => {
    const hasResults =
      filteredData.stocks.length > 0 ||
      filteredData.magasins.length > 0 ||
      filteredData.intrants.length > 0 ||
      filteredData.filieres.length > 0;

    return (
      <View className="space-y-6">
        {/* <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-gray-800">
            Résultats pour "{searchQuery}"
          </Text>
          <Text className="text-gray-500">
            {filteredData.stocks.length +
              filteredData.magasins.length +
              filteredData.intrants.length +
              filteredData.filieres.length}{" "}
            résultat(s)
          </Text>
        </View> */}

        {!hasResults ? (
          <View className="py-10 items-center">
            <Text className="text-gray-500 text-lg mb-2">
              Aucun résultat trouvé
            </Text>
            <Text className="text-gray-400 text-center">
              Essayez d'autres mots-clés ou vérifiez l'orthographe
            </Text>
          </View>
        ) : (
          <>
            {/* Produits */}
            {filteredData.stocks.length > 0 && (
              <View>
                <Text className="text-md font-semibold text-gray-700 mb-3">
                  Produits ({filteredData.stocks.length})
                </Text>
                <AllProductsGrid
                  products={filteredData.stocks}
                  favorites={favorites}
                  onProductPress={handleProductPress}
                  onFavoritePress={toggleFavorite}
                />
              </View>
            )}

            {/* Magasins */}
            {filteredData.magasins.length > 0 && (
              <View>
                <Text className="text-md font-semibold text-gray-700 mb-3">
                  Magasins ({filteredData.magasins.length})
                </Text>
                <FeaturedStoresList
                  stores={filteredData.magasins}
                  onStorePress={handleStorePress}
                />
              </View>
            )}

            {/* Intrants */}
            {filteredData.intrants.length > 0 && (
              <View>
                <Text className="text-md font-semibold text-gray-700 mb-3">
                  Intrants ({filteredData.intrants.length})
                </Text>
                <IntrantsPreviewList
                  intrants={filteredData.intrants}
                  onPressItem={handleIntrantPress}
                />
              </View>
            )}

            {/* Filières */}
            {filteredData.filieres.length > 0 && (
              <View>
                <Text className="text-md font-semibold text-gray-700 mb-3">
                  Filières ({filteredData.filieres.length})
                </Text>
                <FiliereGrid
                  filieres={filteredData.filieres}
                  onFilierePress={handleFilierePress}
                />
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  // Rendu normal (sans recherche)
  const renderNormalView = () => (
    <>
      {/* Carousel des promotions */}
      <PromotionCarousel
        promotions={promotions}
        onPromotionPress={(promo) => console.log("Promotion:", promo)}
      />

      {/* Grille des filières */}
      {loadingFillieres ? (
        <View className="py-4">
          <Text className="text-center text-gray-500">
            Chargement des filières...
          </Text>
        </View>
      ) : fillieres.length > 0 ? (
        <FiliereGrid filieres={fillieres} onFilierePress={handleFilierePress} />
      ) : (
        <View className="py-4">
          <Text className="text-center text-gray-500">
            Aucune filière disponible
          </Text>
        </View>
      )}

      <IntrantsPreviewList
        intrants={GetAllintrantList}
        onPressItem={handleIntrantPress}
      />

      {/* Magasins populaires */}
      <FeaturedStoresList
        stores={magasins}
        onStorePress={handleStorePress}
        onSeeAllPress={() => router.push("/(tabs)/Magasin")}
      />

      {/* Produits populaires */}
      <HotProductsList
        products={stocks}
        favorites={favorites}
        onProductPress={handleProductPress}
        onFavoritePress={toggleFavorite}
        onSeeAllPress={() => console.log("See all hot products")}
      />

      {/* Tous les produits */}
      <AllProductsGrid
        products={stocks}
        favorites={favorites}
        onProductPress={handleProductPress}
        onFavoritePress={toggleFavorite}
        onSeeAllPress={() => console.log("See all products")}
      />
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        // title="KOUMI"
        // location="Yaoundé, Cameroun"
        // cartCount={cart.length}
        notificationCount={3}
        onNotificationPress={() => console.log("Notification")}
        onConnecterPress={() => router.push("/screen/(auth)/login")}
      />

      <SearchBar
        placeholder="Rechercher produits, magasins..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={handleSearch}
        onCancel={handleCancelSearch}
        onClear={handleClearSearch}
        showCancel={isSearchActive}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View className="px-4 py-4 space-y-6">
          {searchQuery.trim() ? renderSearchResults() : renderNormalView()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
