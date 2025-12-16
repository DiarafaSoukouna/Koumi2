import { Intrant } from "@/Types/intrant";
import { Monnaie } from "@/Types/monnaie";
import { useIntrant } from "@/context/Intrant";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Package,
  Plus,
  Search,
  Trash,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IntrantListScreen() {
  const router = useRouter();
  const {
    intrantList,
    loading,
    error,
    fetchIntrant,
    deleteIntrant,
    loadingByActeur,
    getAllByActeur,
  } = useIntrant();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIntrants, setFilteredIntrants] =
    useState<Intrant[]>(intrantList);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "available" | "expired"
  >("all");

  // Charger les intrants au montage
  useEffect(() => {
    loadIntrants();
  }, []);

  useEffect(() => {
    filterIntrants();
  }, [searchQuery, intrantList, activeFilter]);

  const loadIntrants = async () => {
    try {
      await getAllByActeur();
    } catch (error) {
      console.error("Erreur chargement intrants:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIntrants();
    setRefreshing(false);
  };

  const filterIntrants = () => {
    let filtered = intrantList;

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (intrant: Intrant) =>
          intrant.nomIntrant
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          intrant.codeIntrant
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          intrant.descriptionIntrant
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par statut
    switch (activeFilter) {
      case "available":
        filtered = filtered.filter((intrant: Intrant) => intrant.statutIntrant);
        break;
      case "expired":
        filtered = filtered.filter((intrant: Intrant) => {
          if (!intrant.dateExpiration) return false;
          const expirationDate = new Date(intrant.dateExpiration);
          return expirationDate < new Date();
        });
        break;
      default:
        break;
    }

    setFilteredIntrants(filtered);
  };

  const handleDelete = (id: string, nom: string) => {
    Alert.alert(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer "${nom}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteIntrant(id);
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer l'intrant");
            }
          },
        },
      ]
    );
  };

  const formatPrice = (price: number, monnaie?: Monnaie | null) => {
    const formatted = new Intl.NumberFormat("fr-FR").format(price);
    return monnaie ? `${formatted} ${monnaie.sigle || ""}` : `${formatted}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non défini";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getExpirationStatus = (dateExpiration: string | null) => {
    if (!dateExpiration)
      return {
        color: "bg-gray-100",
        text: "text-gray-600",
        label: "Non défini",
      };

    const expiration = new Date(dateExpiration);
    const today = new Date();
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { color: "bg-red-100", text: "text-red-600", label: "Expiré" };
    if (diffDays <= 30)
      return {
        color: "bg-orange-100",
        text: "text-orange-600",
        label: "Bientôt expiré",
      };
    return { color: "bg-green-100", text: "text-green-600", label: "Valide" };
  };

  const renderIntrantCard = ({ item }: { item: Intrant }) => {
    const expirationStatus = getExpirationStatus(item.dateExpiration);

    return (
      <TouchableOpacity
        onPress={() =>
          router.push(`/screen/DashbordScreen/intrants/${item.idIntrant}`)
        }
        className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-200"
        activeOpacity={0.7}
      >
        <View className="flex-row">
          {/* Image */}
          <View className="mr-4">
            {item.photoIntrant ? (
              <Image
                source={{ uri: item.photoIntrant }}
                className="w-20 h-20 rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <View className="w-20 h-20 bg-gray-100 rounded-lg items-center justify-center">
                <Package size={32} color="#9CA3AF" />
              </View>
            )}
          </View>

          {/* Info */}
          <View className="flex-1">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text
                  className="font-bold text-gray-800 text-base mb-1"
                  numberOfLines={1}
                >
                  {item.nomIntrant}
                </Text>
              </View>

              {/* Menu actions */}
              <TouchableOpacity
                onPress={() => handleDelete(item.idIntrant, item.nomIntrant)}
                className="p-1"
              >
                <Trash size={16} color="#FF0000" />
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View className="flex-row items-center mb-2">
              <View
                className={`px-2 py-1 rounded-full ${expirationStatus.color}`}
              >
                <Text
                  className={`text-xs font-medium ${expirationStatus.text}`}
                >
                  {expirationStatus.label}
                </Text>
              </View>
              <View className="flex-row items-center ml-3">
                <Eye size={12} color="#6B7280" />
                <Text className="text-gray-500 text-xs ml-1">
                  {item.nbreView || 0} vues
                </Text>
              </View>
            </View>

            {/* Prix et quantité */}
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-bold text-primary">
                  Prix: {item.prixIntrant || 0} {item.monnaie?.libelle}
                </Text>
                <Text className="text-gray-600 text-sm">
                  Quantité: {item.quantiteIntrant || 0} {item.unite || "unités"}
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-gray-500 text-xs mb-1">
                  Catégorie: {item.categorieProduit?.libelleCategorie}
                </Text>
                <Text className="text-gray-400 text-xs">
                  Forme: {item.forme?.libelleForme}
                </Text>
              </View>
            </View>

            {/* Date expiration */}
            {item.dateExpiration && (
              <View className="flex-row items-center mt-2 pt-2 border-t border-gray-100">
                <Calendar size={12} color="#9CA3AF" />
                <Text className="text-gray-500 text-xs ml-1">
                  Expire le {formatDate(item.dateExpiration)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loadingByActeur && intrantList.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#079C48" />
          <Text className="text-gray-500 mt-4">Chargement des intrants...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
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
              <Text className="text-2xl font-bold text-gray-800">
                Intrants Agricoles
              </Text>
              <Text className="text-gray-500 text-sm">
                Gestion des intrants de votre exploitation
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push("/screen/DashbordScreen/form/AddIntrantScreen")
            }
            className="bg-yellow-500 p-3 rounded-full"
          >
            <Plus size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Rechercher un intrant..."
            className="flex-1 ml-2 text-gray-800"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text className="text-gray-500">✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filtres */}
      <View className="bg-white border-b border-gray-200">
        <FlatList
          horizontal
          data={[
            { key: "all", label: "Tous", icon: Package },
            // { key: "available", label: "Disponibles", icon: ShoppingCart },
            { key: "expired", label: "Expirés", icon: Calendar },
          ]}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            const Icon = item.icon;
            const isActive = activeFilter === item.key;
            return (
              <TouchableOpacity
                onPress={() => setActiveFilter(item.key as any)}
                className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
                  isActive ? "bg-yellow-500" : "bg-gray-100"
                }`}
              >
                <Icon size={16} color={isActive ? "white" : "#6B7280"} />
                <Text
                  className={`ml-2 font-medium ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Stats */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-800">
              {intrantList.length}
            </Text>
            <Text className="text-gray-500 text-xs">Total intrants</Text>
          </View>
          {/* <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">
              {intrantList.filter((i) => i.statutIntrant).length}
            </Text>
            <Text className="text-gray-500 text-xs">Disponibles</Text>
          </View> */}
          <View className="items-center">
            <Text className="text-2xl font-bold text-red-600">
              {
                intrantList.filter((i) => {
                  if (!i.dateExpiration) return false;
                  return new Date(i.dateExpiration) < new Date();
                }).length
              }
            </Text>
            <Text className="text-gray-500 text-xs">Expirés</Text>
          </View>
        </View>
      </View>

      {/* Liste */}
      <FlatList
        data={filteredIntrants}
        renderItem={renderIntrantCard}
        keyExtractor={(item) => item.idIntrant}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Package size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              Aucun intrant trouvé
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              {searchQuery
                ? "Aucun intrant ne correspond à votre recherche"
                : "Commencez par ajouter votre premier intrant"}
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push("/screen/DashbordScreen/form/AddIntrantScreen")
              }
              className="mt-4 bg-primary px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-medium">Ajouter un intrant</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          filteredIntrants.length > 0 ? (
            <View className="items-center py-4">
              <Text className="text-gray-400 text-sm">
                {filteredIntrants.length} intrant(s) trouvé(s)
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
