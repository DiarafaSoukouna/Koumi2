import { useMerchant } from "@/context/Merchant";
import { Stock } from "@/Types/Stock";
import { formatNumber } from "@/utils/formatters";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Filter,
  Grid,
  List,
  Package,
  Search,
  SortAsc,
  SortDesc,
  Store,
  Tag,
  TrendingUp,
  X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Composant de carte produit (mode grille)
const ProductGridCard = ({
  product,
  onPress,
}: {
  product: Stock;
  onPress: (id: string) => void;
}) => (
  <TouchableOpacity
    onPress={() => onPress(product.idStock)}
    className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 mb-3 mx-1"
    style={{ width: "48%" }}
  >
    {/* Image du produit */}
    <View className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-primary/10 items-center justify-center">
      {product.photo ? (
        <Image
          source={{ uri: product.photo }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <Package size={40} color="#079C48" />
      )}
    </View>

    {/* Informations */}
    <View className="flex-1">
      <Text
        className="font-semibold text-gray-800 text-sm mb-1"
        numberOfLines={1}
      >
        {product.nomProduit}
      </Text>

      {/* Magasin */}
      {product.magasin && (
        <View className="flex-row items-center mb-1">
          <Store size={12} color="#64748B" />
          <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
            {product.magasin.nomMagasin}
          </Text>
        </View>
      )}

      {/* Prix */}
      <Text className="text-primary font-bold text-base mb-2">
        {formatNumber(product.prix)} F CFA
      </Text>

      {/* Stock et type */}
      <View className="flex-row items-center justify-between">
        <View className="bg-gray-100 px-2 py-1 rounded">
          <Text className="text-gray-700 text-xs">
            Stock: {formatNumber(product.quantiteStock)}
          </Text>
        </View>
        {product.typeProduit && (
          <View className="bg-blue-100 px-2 py-1 rounded">
            <Text className="text-blue-700 text-xs">{product.typeProduit}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

// Composant de ligne produit (mode liste)
const ProductListCard = ({
  product,
  onPress,
}: {
  product: Stock;
  onPress: (id: string) => void;
}) => (
  <TouchableOpacity
    onPress={() => onPress(product.idStock)}
    className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100 mx-4"
  >
    <View className="flex-row items-center">
      {/* Image */}
      <View className="w-16 h-16 rounded-lg overflow-hidden mr-4 bg-primary/10 items-center justify-center">
        {product.photo ? (
          <Image
            source={{ uri: product.photo }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Package size={24} color="#079C48" />
        )}
      </View>

      {/* Informations */}
      <View className="flex-1">
        <Text
          className="font-semibold text-gray-800 text-sm mb-1"
          numberOfLines={1}
        >
          {product.nomProduit}
        </Text>

        <View className="flex-row items-center mb-1">
          <Store size={12} color="#64748B" />
          <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
            {product.magasin?.nomMagasin || "Magasin non spécifié"}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-primary font-bold text-base">
            {formatNumber(product.prix)} F CFA
          </Text>
          <View className="flex-row items-center">
            <Text className="text-gray-700 text-sm mr-3">
              Stock: {formatNumber(product.quantiteStock)}
            </Text>
            {product.typeProduit && (
              <View className="bg-blue-100 px-2 py-1 rounded">
                <Text className="text-blue-700 text-xs">
                  {product.typeProduit}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default function ProductsListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { magasinId, magasinName } = params;

  const { stocks, magasins, loadingStocks, fetchStocks } = useMerchant();

  // États
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMagasin, setSelectedMagasin] = useState<string | null>(
    magasinId || null
  );
  const [selectedMagasinName, setSelectedMagasinName] = useState<string | null>(
    magasinName || null
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock" | "date">(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showMagasinSelector, setShowMagasinSelector] = useState(false);

  // États pour les filtres en cours de modification (non appliqués immédiatement)
  const [tempSortBy, setTempSortBy] = useState(sortBy);
  const [tempSortOrder, setTempSortOrder] = useState(sortOrder);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [tempSelectedMagasin, setTempSelectedMagasin] =
    useState(selectedMagasin);
  const [tempSelectedMagasinName, setTempSelectedMagasinName] =
    useState(selectedMagasinName);

  // Initialiser le magasin si passé en paramètre
  useEffect(() => {
    if (magasinId && magasinName) {
      setSelectedMagasin(magasinId as string);
      setSelectedMagasinName(magasinName as string);
      setTempSelectedMagasin(magasinId as string);
      setTempSelectedMagasinName(magasinName as string);
    }
  }, [magasinId, magasinName]);

  // Initialiser les filtres temporaires quand le modal s'ouvre
  useEffect(() => {
    if (showFilterModal) {
      setTempSortBy(sortBy);
      setTempSortOrder(sortOrder);
      setTempPriceRange(priceRange);
      setTempSelectedMagasin(selectedMagasin);
      setTempSelectedMagasinName(selectedMagasinName);
    }
  }, [showFilterModal]);

  // Fonction de rafraîchissement
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchStocks();
    } catch (error) {
      console.error("Erreur lors du rafraîchissement:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Filtrer les produits
  const filteredProducts = useMemo(() => {
    let filtered = [...stocks];

    // Filtre par magasin
    if (selectedMagasin) {
      filtered = filtered.filter(
        (product) =>
          product.magasin && product.magasin.idMagasin === selectedMagasin
      );
    }

    // Filtre par recherche
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.nomProduit.toLowerCase().includes(query) ||
          product.typeProduit?.toLowerCase().includes(query) ||
          product.descriptionStock?.toLowerCase().includes(query) ||
          product.speculation?.nomSpeculation.toLowerCase().includes(query)
      );
    }

    // Filtre par prix
    if (priceRange.min !== "") {
      const min = parseFloat(priceRange.min);
      if (!isNaN(min)) {
        filtered = filtered.filter((product) => product.prix >= min);
      }
    }
    if (priceRange.max !== "") {
      const max = parseFloat(priceRange.max);
      if (!isNaN(max)) {
        filtered = filtered.filter((product) => product.prix <= max);
      }
    }

    // Tri
    filtered.sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case "name":
          compareA = a.nomProduit.toLowerCase();
          compareB = b.nomProduit.toLowerCase();
          break;
        case "price":
          compareA = a.prix;
          compareB = b.prix;
          break;
        case "stock":
          compareA = a.quantiteStock;
          compareB = b.quantiteStock;
          break;
        case "date":
          compareA = new Date(a.dateAjout || "").getTime();
          compareB = new Date(b.dateAjout || "").getTime();
          break;
        default:
          compareA = a.nomProduit.toLowerCase();
          compareB = b.nomProduit.toLowerCase();
      }

      if (sortOrder === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    return filtered;
  }, [stocks, selectedMagasin, searchQuery, priceRange, sortBy, sortOrder]);

  // Appliquer les filtres depuis le modal
  const applyFilters = () => {
    setSortBy(tempSortBy);
    setSortOrder(tempSortOrder);
    setPriceRange(tempPriceRange);
    if (tempSelectedMagasin !== selectedMagasin) {
      setSelectedMagasin(tempSelectedMagasin);
      setSelectedMagasinName(tempSelectedMagasinName);
    }
    setShowFilterModal(false);
  };

  // Annuler les modifications des filtres
  const cancelFilters = () => {
    setShowFilterModal(false);
  };

  // Obtenir le nombre de produits par magasin
  const getProductCountByMagasin = (magasinId: string) => {
    return stocks.filter(
      (product) => product.magasin && product.magasin.idMagasin === magasinId
    ).length;
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSelectedMagasin(magasinId || null);
    setSelectedMagasinName(magasinName || null);
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    setSortBy("name");
    setSortOrder("asc");
    setTempSortBy("name");
    setTempSortOrder("asc");
    setTempPriceRange({ min: "", max: "" });
    setTempSelectedMagasin(magasinId || null);
    setTempSelectedMagasinName(magasinName || null);
    setShowFilterModal(false);
  };

  // Navigation vers le détail du produit
  const navigateToProductDetail = (productId: string) => {
    router.push({
      pathname: "/screen/DashbordScreen/produits/[id]",
      params: { id: productId },
    });
  };

  // Navigation vers le détail du magasin
  const navigateToMagasinDetail = (magasinId: string) => {
    router.push({
      pathname: "/screen/DashbordScreen/StoreDetailScreen",
      params: { id: magasinId },
    });
  };

  // Afficher les statistiques
  const getStats = () => {
    const totalProducts = filteredProducts.length;
    const totalValue = filteredProducts.reduce(
      (sum, product) => sum + product.prix * product.quantiteStock,
      0
    );
    const avgPrice =
      totalProducts > 0
        ? totalValue /
          filteredProducts.reduce((sum, p) => sum + p.quantiteStock, 0)
        : 0;
    const totalStock = filteredProducts.reduce(
      (sum, product) => sum + product.quantiteStock,
      0
    );

    return { totalProducts, totalValue, avgPrice, totalStock };
  };

  const stats = getStats();

  // Header avec filtres
  const renderHeader = () => (
    <View className="bg-white px-4 py-3 border-b border-gray-200">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2 mr-2"
          >
            <ArrowLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
              {selectedMagasinName || "Tous les produits"}
            </Text>
            <Text className="text-gray-500 text-sm">
              {filteredProducts.length} produit
              {filteredProducts.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="p-2"
          >
            {viewMode === "grid" ? (
              <List size={20} color="#64748B" />
            ) : (
              <Grid size={20} color="#64748B" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            className="p-2"
          >
            <Filter size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Barre de recherche */}
      <View className="mb-3">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={20} color="#94A3B8" />
          <TextInput
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-gray-800"
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtre par magasin */}
      <TouchableOpacity
        onPress={() => setShowMagasinSelector(true)}
        className="flex-row items-center justify-between bg-primary/10 p-3 rounded-lg"
      >
        <View className="flex-row items-center">
          <Store size={18} color="#079C48" className="mr-2" />
          <View>
            <Text className="text-gray-600 text-xs">Magasin</Text>
            <Text className="text-gray-800 font-medium">
              {selectedMagasinName || "Tous les magasins"}
            </Text>
          </View>
        </View>
        <ChevronDown size={18} color="#64748B" />
      </TouchableOpacity>
    </View>
  );

  // Statistiques rapides
  const renderStatsBar = () => (
    <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm border border-gray-100">
      <Text className="text-gray-800 font-bold mb-3">Statistiques</Text>
      <View className="flex-row justify-between">
        <View className="items-center">
          <Text className="text-2xl font-bold text-primary">
            {stats.totalProducts}
          </Text>
          <Text className="text-gray-600 text-xs">Produits</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-primary">
            {formatNumber(stats.totalStock)}
          </Text>
          <Text className="text-gray-600 text-xs">Stock total</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-primary">
            {formatNumber(stats.totalValue)}
          </Text>
          <Text className="text-gray-600 text-xs">Valeur totale</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-primary">
            {formatNumber(stats.avgPrice)}
          </Text>
          <Text className="text-gray-600 text-xs">Prix moyen</Text>
        </View>
      </View>
    </View>
  );

  // Modal de sélection du magasin
  const renderMagasinSelectorModal = () => (
    <Modal
      visible={showMagasinSelector}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowMagasinSelector(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-3/4">
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Sélectionner un magasin
              </Text>
              <TouchableOpacity onPress={() => setShowMagasinSelector(false)}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                setSelectedMagasin(null);
                setSelectedMagasinName(null);
                setShowMagasinSelector(false);
              }}
              className={`flex-row items-center p-4 rounded-lg mb-2 ${
                !selectedMagasin
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-gray-50"
              }`}
            >
              <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center mr-3">
                <Store size={20} color="#079C48" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">
                  Tous les magasins
                </Text>
                <Text className="text-gray-500 text-sm">
                  {stocks.length} produits
                </Text>
              </View>
              {!selectedMagasin && <ChevronUp size={20} color="#079C48" />}
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
            {magasins.map((magasin) => {
              const productCount = getProductCountByMagasin(magasin.idMagasin);
              return (
                <TouchableOpacity
                  key={magasin.idMagasin}
                  onPress={() => {
                    setSelectedMagasin(magasin.idMagasin);
                    setSelectedMagasinName(magasin.nomMagasin);
                    setShowMagasinSelector(false);
                  }}
                  className={`flex-row items-center p-4 rounded-lg mb-3 ${
                    selectedMagasin === magasin.idMagasin
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-gray-50"
                  }`}
                >
                  <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                    <Store size={20} color="#079C48" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-gray-800">
                      {magasin.nomMagasin}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {magasin.localiteMagasin}
                    </Text>
                    <Text className="text-primary text-xs font-medium mt-1">
                      {productCount} produit{productCount !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  {selectedMagasin === magasin.idMagasin && (
                    <ChevronUp size={20} color="#079C48" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Modal de filtres avancés
  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-3/4">
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Filtres avancés
              </Text>
              <TouchableOpacity onPress={cancelFilters}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-full"
              >
                <Text className="text-gray-700">Tout effacer</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
            {/* Tri */}
            <View className="mb-6">
              <Text className="text-gray-800 font-bold mb-3">Trier par</Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  { key: "name", label: "Nom", icon: Tag },
                  { key: "price", label: "Prix", icon: DollarSign },
                  { key: "stock", label: "Stock", icon: TrendingUp },
                  { key: "date", label: "Date", icon: Calendar },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => {
                      if (tempSortBy === item.key) {
                        setTempSortOrder(
                          tempSortOrder === "asc" ? "desc" : "asc"
                        );
                      } else {
                        setTempSortBy(item.key as any);
                        setTempSortOrder("asc");
                      }
                    }}
                    className={`flex-row items-center px-4 py-2 rounded-full ${
                      tempSortBy === item.key
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-gray-100"
                    }`}
                  >
                    <item.icon
                      size={16}
                      color={tempSortBy === item.key ? "#079C48" : "#64748B"}
                      className="mr-2"
                    />
                    <Text
                      className={
                        tempSortBy === item.key
                          ? "text-primary font-medium"
                          : "text-gray-700"
                      }
                    >
                      {item.label}
                    </Text>
                    {tempSortBy === item.key &&
                      (tempSortOrder === "asc" ? (
                        <SortAsc size={16} color="#079C48" className="ml-1" />
                      ) : (
                        <SortDesc size={16} color="#079C48" className="ml-1" />
                      ))}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Prix */}
            {/* <View className="mb-6">
              <Text className="text-gray-800 font-bold mb-3">Prix (F CFA)</Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-gray-600 text-sm mb-1">Min</Text>
                  <TextInput
                    placeholder="Min"
                    value={tempPriceRange.min}
                    onChangeText={(text) =>
                      setTempPriceRange({ ...tempPriceRange, min: text })
                    }
                    keyboardType="numeric"
                    className="bg-gray-100 rounded-lg px-3 py-2 text-gray-800"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-600 text-sm mb-1">Max</Text>
                  <TextInput
                    placeholder="Max"
                    value={tempPriceRange.max}
                    onChangeText={(text) =>
                      setTempPriceRange({ ...tempPriceRange, max: text })
                    }
                    keyboardType="numeric"
                    className="bg-gray-100 rounded-lg px-3 py-2 text-gray-800"
                  />
                </View>
              </View>
            </View> */}

            {/* Magasins populaires */}
            <View className="mb-6">
              <Text className="text-gray-800 font-bold mb-3">
                Magasins populaires
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="pb-2"
              >
                <TouchableOpacity
                  onPress={() => {
                    setTempSelectedMagasin(null);
                    setTempSelectedMagasinName(null);
                  }}
                  className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
                    tempSelectedMagasin === null
                      ? "bg-yellow-500 border border-yellow-500"
                      : "bg-yellow-500"
                  }`}
                >
                  <Store
                    size={14}
                    color={tempSelectedMagasin === null ? "#FFFFFF" : "#64748B"}
                    className="mr-1"
                  />
                  <Text
                    className={
                      tempSelectedMagasin === null
                        ? "text-white text-xs"
                        : "text-gray-700 text-xs"
                    }
                  >
                    Tous ({stocks.length})
                  </Text>
                </TouchableOpacity>

                {magasins
                  .filter((m) => getProductCountByMagasin(m.idMagasin) > 0)
                  .slice(0, 5)
                  .map((magasin) => (
                    <TouchableOpacity
                      key={magasin.idMagasin}
                      onPress={() => {
                        setTempSelectedMagasin(magasin.idMagasin);
                        setTempSelectedMagasinName(magasin.nomMagasin);
                      }}
                      className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
                        tempSelectedMagasin === magasin.idMagasin
                          ? "bg-yellow-500 border border-yellow-500"
                          : "bg-gray-100"
                      }`}
                    >
                      <Store
                        size={14}
                        color={
                          tempSelectedMagasin === magasin.idMagasin
                            ? "#FFFFFF"
                            : "#64748B"
                        }
                        className="mr-1"
                      />
                      <Text
                        className={
                          tempSelectedMagasin === magasin.idMagasin
                            ? "text-white text-xs"
                            : "text-gray-700 text-xs"
                        }
                      >
                        {magasin.nomMagasin} (
                        {getProductCountByMagasin(magasin.idMagasin)})
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>

            {/* Actions */}
            <View className="flex-row gap-3 mb-8">
              <TouchableOpacity
                onPress={cancelFilters}
                className="flex-1 py-3 border border-gray-300 rounded-xl"
              >
                <Text className="text-gray-700 text-center font-medium">
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFilters}
                className="flex-1 py-3 bg-yellow-500 rounded-xl"
              >
                <Text className="text-white text-center font-medium">
                  Appliquer
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Message vide
  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20 px-4">
      <Package size={64} color="#CBD5E1" />
      <Text className="text-gray-400 mt-4 text-lg">Aucun produit trouvé</Text>
      <Text className="text-gray-400 text-center mt-2">
        {selectedMagasin
          ? "Ce magasin n'a pas de produits correspondant à vos critères"
          : "Aucun produit ne correspond à vos critères de recherche"}
      </Text>
      <TouchableOpacity
        onPress={resetFilters}
        className="mt-6 px-6 py-3 bg-primary rounded-full"
      >
        <Text className="text-white font-medium">
          Réinitialiser les filtres
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Utiliser deux FlatList différents pour éviter l'erreur numColumns
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {renderHeader()}

      {filteredProducts.length > 0 && renderStatsBar()}

      {/* Liste des produits - version conditionnelle pour éviter l'erreur numColumns */}
      {viewMode === "grid" ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.idStock}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductGridCard product={item} onPress={navigateToProductDetail} />
          )}
          ListEmptyComponent={renderEmptyState()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#079C48"]}
            />
          }
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingTop: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          key="grid-view" // Clé fixe pour la vue grille
        />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.idStock}
          renderItem={({ item }) => (
            <ProductListCard product={item} onPress={navigateToProductDetail} />
          )}
          ListEmptyComponent={renderEmptyState()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#079C48"]}
            />
          }
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          key="list-view" // Clé fixe pour la vue liste
        />
      )}

      {/* Bouton d'action flottant */}
      <TouchableOpacity
        onPress={() =>
          router.push("/screen/DashbordScreen/form/AddProductScreen")
        }
        className="absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <Package size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modals */}
      {renderMagasinSelectorModal()}
      {renderFilterModal()}
    </SafeAreaView>
  );
}
