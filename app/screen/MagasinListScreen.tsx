import { Magasin } from "@/Types/Magasin";
import MagasinListSkeleton from "@/components/MagasinListSkeleton";
import { useHome } from "@/context/HomeContext";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Grid3x3,
  List,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Store,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 40) / 2;

export default function MagasinListScreen() {
  const router = useRouter();
  const { magasins, loadingMagasins, errorMagasins, getAllMagasins } =
    useHome();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getAllMagasins();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllMagasins();
    setRefreshing(false);
  };

  const filteredMagasins = magasins.filter((magasin) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      magasin.nomMagasin.toLowerCase().includes(query) ||
      magasin.localiteMagasin.toLowerCase().includes(query) ||
      magasin.acteur?.nomActeur.toLowerCase().includes(query)
    );
  });

  const handleMagasinPress = (magasin: Magasin) => {
    router.push({
      pathname: "/screen/StoreDetailScreen",
      params: { Magasin: JSON.stringify(magasin) },
    });
  };

  const MagasinGridCard = ({ magasin }: { magasin: Magasin }) => (
    <TouchableOpacity
      onPress={() => handleMagasinPress(magasin)}
      className="mb-4"
      style={{ width: ITEM_WIDTH }}
    >
      {/* Card Container */}
      <View className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Image avec badge */}
        <View className="relative h-36">
          <Image
            source={{
              uri:
                magasin.photo ||
                "https://via.placeholder.com/200x150/079C48/FFFFFF?text=Magasin",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Badge Vérifié */}
          {magasin.statutMagasin && (
            <View className="absolute top-2 right-2">
              <View className="bg-green-500 px-2 py-1 rounded-full flex-row items-center">
                <ShieldCheck size={10} color="white" />
                <Text className="text-green-500 text-xs ml-1">✓</Text>
              </View>
            </View>
          )}

          {/* Overlay gradient */}
          <View className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent" />
        </View>

        {/* Content */}
        <View className="p-3">
          {/* Nom et type */}
          <Text
            className="font-bold text-gray-800 text-sm mb-1"
            numberOfLines={1}
          >
            {magasin.nomMagasin}
          </Text>

          {/* Type d'acteur */}
          {magasin.acteur?.typeActeur?.[0] && (
            <View className="flex-row items-center mb-2">
              <Text className="text-primary text-xs font-medium bg-primary/10 px-2 py-1 rounded-full">
                {magasin.acteur.typeActeur[0].libelle}
              </Text>
            </View>
          )}

          {/* Localisation */}
          <View className="flex-row items-center mb-2">
            <MapPin size={12} color="#64748B" />
            <Text
              className="text-gray-500 text-xs ml-1 flex-1"
              numberOfLines={1}
            >
              {magasin.localiteMagasin}
            </Text>
          </View>

          {/* Statistiques */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text className="text-gray-800 text-xs font-medium ml-1">
                {Math.floor(magasin.nbreView / 100) || 4.5}
              </Text>
            </View>

            <View className="bg-gray-100 px-2 py-0.5 rounded-full">
              <Text className="text-gray-500 text-xs">
                {magasin.nbreView || 0} vues
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const MagasinListCard = ({ magasin }: { magasin: Magasin }) => (
    <TouchableOpacity
      onPress={() => handleMagasinPress(magasin)}
      className="mb-3"
    >
      <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <View className="flex-row items-center">
          {/* Image */}
          <Image
            source={{
              uri:
                magasin.photo ||
                "https://via.placeholder.com/80/079C48/FFFFFF?text=" +
                  magasin.nomMagasin.charAt(0),
            }}
            className="w-16 h-16 rounded-xl mr-3"
            resizeMode="cover"
          />

          {/* Infos */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text
                className="font-bold text-gray-800 text-base"
                numberOfLines={1}
              >
                {magasin.nomMagasin}
              </Text>
              {magasin.statutMagasin && (
                <ShieldCheck size={14} color="#079C48" />
              )}
            </View>

            {magasin.acteur?.typeActeur?.[0] && (
              <Text className="text-primary text-xs font-medium mt-1">
                {magasin.acteur.typeActeur[0].libelle}
              </Text>
            )}

            <View className="flex-row items-center mt-1">
              <MapPin size={12} color="#64748B" />
              <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
                {magasin.localiteMagasin}, {magasin.niveau1Pays?.nomN1}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center">
                <Star size={12} color="#F59E0B" fill="#F59E0B" />
                <Text className="text-gray-800 text-xs font-medium ml-1">
                  {Math.floor(magasin.nbreView / 100) || 4.5}
                </Text>
              </View>

              <Text className="text-gray-400 text-xs">
                {magasin.nbreView || 0} vues
              </Text>
            </View>
          </View>

          <ChevronRight size={16} color="#64748B" className="ml-2" />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loadingMagasins && !refreshing) {
    return <MagasinListSkeleton />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* <StatusBar style="dark" /> */}

      {/* Header */}
      <View className="bg-white px-4 pt-4 pb-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800">Magasins</Text>
              <Text className="text-gray-500 text-xs">
                {filteredMagasins.length} magasins disponibles
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => setViewMode("grid")}
              className={`p-2 rounded-xl ${
                viewMode === "grid" ? "bg-primary/10" : ""
              }`}
            >
              <Grid3x3
                size={20}
                color={viewMode === "grid" ? "#079C48" : "#64748B"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode("list")}
              className={`p-2 rounded-xl ${
                viewMode === "list" ? "bg-primary/10" : ""
              }`}
            >
              <List
                size={20}
                color={viewMode === "list" ? "#079C48" : "#64748B"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="relative">
          <Search
            size={20}
            color="#64748B"
            style={{ position: "absolute", left: 12, top: 12, zIndex: 1 }}
          />
          <TextInput
            placeholder="Rechercher un magasin..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-gray-100 pl-10 pr-4 py-3 rounded-xl text-gray-800"
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#079C48"]}
            tintColor="#079C48"
          />
        }
      >
        {errorMagasins ? (
          <View className="flex-1 items-center justify-center p-8">
            <View className="bg-red-50 rounded-2xl p-6 items-center">
              <Text className="text-red-600 font-medium mb-2">
                Erreur de chargement
              </Text>
              <Text className="text-gray-600 text-center mb-4">
                {errorMagasins}
              </Text>
              <TouchableOpacity
                onPress={() => getAllMagasins()}
                className="bg-primary px-6 py-2 rounded-full"
              >
                <Text className="text-white font-medium">Réessayer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : filteredMagasins.length === 0 ? (
          <View className="flex-1 items-center justify-center p-8">
            <View className="items-center">
              <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Store size={48} color="#94A3B8" />
              </View>
              <Text className="text-xl font-bold text-gray-800 mb-2">
                Aucun magasin trouvé
              </Text>
              <Text className="text-gray-500 text-center mb-6">
                {searchQuery
                  ? `Aucun résultat pour "${searchQuery}"`
                  : "Aucun magasin disponible pour le moment"}
              </Text>
              {searchQuery && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  className="bg-primary px-6 py-3 rounded-full"
                >
                  <Text className="text-white font-medium">
                    Voir tous les magasins
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : viewMode === "grid" ? (
          <View className="p-4">
            <View className="flex-row flex-wrap justify-between">
              {filteredMagasins.map((magasin) => (
                <MagasinGridCard key={magasin.idMagasin} magasin={magasin} />
              ))}
            </View>
          </View>
        ) : (
          <View className="p-4">
            {filteredMagasins.map((magasin) => (
              <MagasinListCard key={magasin.idMagasin} magasin={magasin} />
            ))}
          </View>
        )}

        {/* Espace pour le bottom padding */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
