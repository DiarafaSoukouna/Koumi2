import { CustomInput } from "@/components/common/CustomInput";
import { useIntrant } from "@/context/Intrant";
import { CategorieProduit } from "@/Types/CategorieProduits";
import { Forme } from "@/Types/forme";
import { Intrant } from "@/Types/intrant";
import { Monnaie } from "@/Types/monnaie";
import { useRouter } from "expo-router";
import { ArrowLeft, Filter, Grid, List, Package, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IntrantListScreen() {
  const router = useRouter();
  const {
    GetAllintrantList,
    loading,
    fetchIntrant,
    categories,
    formes,
    fetchCategories,
    fetchFormes,
  } = useIntrant();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedForme, setSelectedForme] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "price" | "name">("date");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const itemsPerPage = 10;

  const flatListRef = useRef<FlatList<Intrant>>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchFormes();
  }, []);

  const loadData = async () => {
    try {
      await fetchIntrant();
    } catch (error) {
      console.error("Erreur chargement intrants:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterIntrant = (intrant: Intrant): boolean => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName =
        intrant.nomIntrant?.toLowerCase().includes(query) ?? false;
      const matchesCode =
        intrant.codeIntrant?.toLowerCase().includes(query) ?? false;
      const matchesDescription =
        intrant.descriptionIntrant?.toLowerCase().includes(query) ?? false;

      if (!matchesName && !matchesCode && !matchesDescription) {
        return false;
      }
    }

    if (
      selectedCategory &&
      intrant.categorieProduit?.idCategorieProduit !== selectedCategory
    ) {
      return false;
    }

    if (selectedForme && intrant.forme?.idForme !== selectedForme) {
      return false;
    }

    return true;
  };

  const sortIntrants = (a: Intrant, b: Intrant): number => {
    switch (sortBy) {
      case "price":
        return (a.prixIntrant || 0) - (b.prixIntrant || 0);
      case "name":
        return (a.nomIntrant || "").localeCompare(b.nomIntrant || "");
      case "date":
      default:
        const dateA = a.dateAjout ? new Date(a.dateAjout).getTime() : 0;
        const dateB = b.dateAjout ? new Date(b.dateAjout).getTime() : 0;
        return dateB - dateA;
    }
  };

  const filteredIntrants =
    GetAllintrantList.filter(filterIntrant).sort(sortIntrants);

  const paginatedIntrants = filteredIntrants.slice(0, page * itemsPerPage);

  const loadMore = () => {
    if (!loadingMore && paginatedIntrants.length < filteredIntrants.length) {
      setLoadingMore(true);
      setTimeout(() => {
        setPage((prev) => prev + 1);
        setLoadingMore(false);
      }, 500);
    }
  };

  const formatPrice = (
    price: number | undefined,
    monnaie?: Monnaie | null
  ): string => {
    if (!price) return "Non spécifié";
    const formatted = new Intl.NumberFormat("fr-FR").format(price);
    return monnaie ? `${formatted} ${monnaie.libelle || ""}` : `${formatted}`;
  };

  const handleNavigation = (item: Intrant) => {
    console.log("Navigation vers intrant:", item.idIntrant, item.nomIntrant);
    router.push({
      pathname: "/screen/intrant/[id]",
      params: { id: item.idIntrant },
    });
  };

  const renderGridItem = ({ item }: { item: Intrant }) => (
    <TouchableOpacity
      onPress={() => handleNavigation(item)}
      className="w-1/2 p-2"
      activeOpacity={0.8}
    >
      <View className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <View className="w-full h-40 bg-gray-100 relative">
          {item.photoIntrant ? (
            <Image
              source={{ uri: item.photoIntrant }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Package size={32} color="#9CA3AF" />
            </View>
          )}

          <View
            className={`absolute top-2 right-2 px-2 py-1 rounded-full ${
              item.statutIntrant ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                item.statutIntrant ? "text-green-600" : "text-red-600"
              }`}
            >
              {item.statutIntrant ? "✔" : "✘"}
            </Text>
          </View>
        </View>

        <View className="p-3">
          <Text
            className="font-bold text-gray-800 text-sm mb-1"
            numberOfLines={2}
          >
            {item.nomIntrant || "Sans nom"}
          </Text>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-600 text-xs">
              {item.categorieProduit?.libelleCategorie || "Non catégorisé"}
            </Text>
            <Text className="text-gray-800 text-xs">
              {item.quantiteIntrant || 0} {item.unite || ""}
            </Text>
          </View>

          <Text className="text-primary text-lg font-bold">
            {formatPrice(item.prixIntrant, item.monnaie)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListItem = ({ item }: { item: Intrant }) => (
    <TouchableOpacity
      onPress={() => handleNavigation(item)}
      className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
      activeOpacity={0.8}
    >
      <View className="flex-row">
        <View className="w-20 h-20 bg-gray-100 rounded-lg mr-3 overflow-hidden">
          {item.photoIntrant ? (
            <Image
              source={{ uri: item.photoIntrant }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Package size={24} color="#9CA3AF" />
            </View>
          )}
        </View>

        <View className="flex-1">
          <Text className="font-bold text-gray-800 text-base mb-1">
            {item.nomIntrant || "Sans nom"}
          </Text>

          <View className="flex-row items-center mb-2">
            <Text className="text-gray-600 text-sm mr-3">
              {item.categorieProduit?.libelleCategorie || "Non catégorisé"}
            </Text>
            <Text className="text-gray-800 text-sm">
              {item.forme?.libelleForme || ""}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-primary text-xl font-bold">
              {formatPrice(item.prixIntrant, item.monnaie)}
            </Text>

            <View className="flex-row items-center">
              <Text className="text-gray-600 text-sm mr-2">
                {item.quantiteIntrant || 0} {item.unite || ""}
              </Text>
              <View
                className={`w-3 h-3 rounded-full ${
                  item.statutIntrant ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className="bg-white pb-4">
      <View className="px-4">
        {(selectedCategory || selectedForme || searchQuery) && (
          <View className="flex-row flex-wrap gap-2 mb-3">
            {searchQuery && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                className="flex-row items-center bg-gray-200 px-3 py-1 rounded-full"
              >
                <Text className="text-gray-700 text-sm">"{searchQuery}"</Text>
                <X size={14} color="#6B7280" className="ml-1" />
              </TouchableOpacity>
            )}

            {selectedCategory && (
              <TouchableOpacity
                onPress={() => setSelectedCategory(null)}
                className="flex-row items-center bg-primary/20 px-3 py-1 rounded-full"
              >
                <Text className="text-primary text-sm">
                  {categories.find(
                    (c) => c.idCategorieProduit === selectedCategory
                  )?.libelleCategorie || "Catégorie"}
                </Text>
                <X size={14} color="#079C48" className="ml-1" />
              </TouchableOpacity>
            )}

            {selectedForme && (
              <TouchableOpacity
                onPress={() => setSelectedForme(null)}
                className="flex-row items-center bg-amber-100 px-3 py-1 rounded-full"
              >
                <Text className="text-amber-800 text-sm">
                  {formes.find((f) => f.idForme === selectedForme)
                    ?.libelleForme || "Forme"}
                </Text>
                <X size={14} color="#D97706" className="ml-1" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View className="bg-gray-50 rounded-xl p-3 mb-4">
          <View className="flex-row justify-between">
            <Text className="text-gray-700 font-medium">
              {filteredIntrants.length} intrant
              {filteredIntrants.length !== 1 ? "s" : ""} trouvé
              {filteredIntrants.length !== 1 ? "s" : ""}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory(null);
                setSelectedForme(null);
                setSearchQuery("");
              }}
            >
              <Text className="text-primary text-sm">Réinitialiser</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#079C48" />
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View className="items-center justify-center py-10 px-4">
      <Package size={64} color="#D1D5DB" />
      <Text className="text-gray-500 text-lg font-medium mt-4">
        Aucun intrant trouvé
      </Text>
      <Text className="text-gray-400 text-center mt-2">
        {searchQuery || selectedCategory || selectedForme
          ? "Aucun intrant ne correspond à vos critères"
          : "Aucun intrant disponible pour le moment"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-2 mr-2"
            >
              <ArrowLeft size={24} color="#1E293B" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-gray-800">
                Intrants Agricoles
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className="flex-row items-center bg-primary/10 px-3 py-2 rounded-lg"
          >
            <Filter size={16} color="#079C48" />
            <Text className="text-primary font-medium ml-2">Filtrer</Text>
            {(selectedCategory || selectedForme) && (
              <View className="w-2 h-2 bg-red-500 rounded-full ml-2" />
            )}
          </TouchableOpacity>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setViewMode("grid")}
              className={`p-2 rounded-l-lg ${
                viewMode === "grid" ? "bg-gray-200" : "bg-gray-100"
              }`}
            >
              <Grid
                size={20}
                color={viewMode === "grid" ? "#079C48" : "#6B7280"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode("list")}
              className={`p-2 rounded-r-lg ${
                viewMode === "list" ? "bg-gray-200" : "bg-gray-100"
              }`}
            >
              <List
                size={20}
                color={viewMode === "list" ? "#079C48" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <CustomInput
              placeholder="Rechercher un intrant..."
              value={searchQuery}
              onChange={setSearchQuery}
              type="search"
              containerClassName="mb-0"
            />
          </View>
        </View>
      </View>

      <FlatList<Intrant>
        ref={flatListRef}
        data={paginatedIntrants}
        renderItem={viewMode === "grid" ? renderGridItem : renderListItem}
        keyExtractor={(item) => item.idIntrant}
        numColumns={viewMode === "grid" ? 2 : 1}
        key={viewMode === "grid" ? "grid" : "list"}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-3/4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Filtrer les intrants
              </Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-3">Trier par</Text>
              <View className="flex-row space-x-2">
                {[
                  { key: "date" as const, label: "Plus récent" },
                  { key: "price" as const, label: "Prix" },
                  { key: "name" as const, label: "Nom" },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => setSortBy(option.key)}
                    className={`px-4 py-2 rounded-full ${
                      sortBy === option.key ? "bg-primary" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={
                        sortBy === option.key
                          ? "text-white font-medium"
                          : "text-gray-700"
                      }
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-3">Catégories</Text>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  onPress={() => setSelectedCategory(null)}
                  className={`px-3 py-2 rounded-full ${
                    !selectedCategory ? "bg-primary" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={
                      !selectedCategory
                        ? "text-white font-medium"
                        : "text-gray-700"
                    }
                  >
                    Toutes
                  </Text>
                </TouchableOpacity>

                {categories.map((category: CategorieProduit) => (
                  <TouchableOpacity
                    key={category.idCategorieProduit}
                    onPress={() =>
                      setSelectedCategory(category.idCategorieProduit)
                    }
                    className={`px-3 py-2 rounded-full ${
                      selectedCategory === category.idCategorieProduit
                        ? "bg-primary"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={
                        selectedCategory === category.idCategorieProduit
                          ? "text-white font-medium"
                          : "text-gray-700"
                      }
                    >
                      {category.libelleCategorie}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-gray-700 font-medium mb-3">Formes</Text>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  onPress={() => setSelectedForme(null)}
                  className={`px-3 py-2 rounded-full ${
                    !selectedForme ? "bg-amber-500" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={
                      !selectedForme
                        ? "text-white font-medium"
                        : "text-gray-700"
                    }
                  >
                    Toutes
                  </Text>
                </TouchableOpacity>

                {formes.map((forme: Forme) => (
                  <TouchableOpacity
                    key={forme.idForme}
                    onPress={() => setSelectedForme(forme.idForme)}
                    className={`px-3 py-2 rounded-full ${
                      selectedForme === forme.idForme
                        ? "bg-amber-500"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={
                        selectedForme === forme.idForme
                          ? "text-white font-medium"
                          : "text-gray-700"
                      }
                    >
                      {forme.libelleForme}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory(null);
                  setSelectedForme(null);
                  setSortBy("date");
                }}
                className="flex-1 bg-gray-200 py-4 rounded-xl items-center"
              >
                <Text className="text-gray-700 font-medium">Réinitialiser</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowFilters(false)}
                className="flex-1 bg-primary py-4 rounded-xl items-center"
              >
                <Text className="text-white font-medium">Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
