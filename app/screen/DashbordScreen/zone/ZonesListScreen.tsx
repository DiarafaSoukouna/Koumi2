// app/screens/ZonesListScreen.tsx
import { CustomInput } from "@/components/common/CustomInput";
import { useMerchant } from "@/context/Merchant";
import { ZoneProduction } from "@/Types/merchantType";
import { useRouter } from "expo-router";
import { ArrowLeft, Globe, MapPin, Plus } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
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

export default function ZonesListScreen() {
  const router = useRouter();
  const { zonesProduction, loadingZones, fetchZonesProduction } = useMerchant();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredZones = useMemo(() => {
    if (!searchQuery) return zonesProduction;

    const query = searchQuery.toLowerCase();
    return zonesProduction.filter((zone) =>
      zone.nomZoneProduction.toLowerCase().includes(query)
    );
  }, [zonesProduction, searchQuery]);

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await fetchZonesProduction();
    } catch (error) {
      console.error("Error refreshing zones:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Composant Carte Zone (vue grille)
  const ZoneGridCard = ({ zone }: { zone: ZoneProduction }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/screen/DashbordScreen/zone/ZoneDetailScreen",
          params: { id: zone.idZoneProduction },
        })
      }
      className="bg-white rounded-2xl p-3 shadow-sm border border-gray-200 active:opacity-90 w-[48%] mb-4"
    >
      <View>
        {/* Image de la zone */}
        <View className="relative mb-3">
          {zone.photoZone ? (
            <Image
              source={{ uri: zone.photoZone }}
              className="w-full h-32 rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-32 bg-blue-50 rounded-xl items-center justify-center">
              <Globe size={40} color="#3B82F6" />
            </View>
          )}
        </View>

        {/* Informations */}
        <View>
          <Text
            className="font-bold text-gray-800 text-sm mb-2"
            numberOfLines={2}
          >
            {zone.nomZoneProduction}
          </Text>

          {zone.latitude && zone.longitude && (
            <View className="flex-row items-center mb-2">
              <MapPin size={12} color="#64748B" />
              <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
                {zone.latitude.slice(0, 8)}, {zone.longitude.slice(0, 8)}
              </Text>
            </View>
          )}

          <Text className="text-gray-400 text-xs">
            Ajouté le{" "}
            {new Date(zone.dateAjout).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  if (loadingZones && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#079C48" />
          <Text className="text-gray-500 mt-4">Chargement des zones...</Text>
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
              <Text className="text-xl font-bold text-gray-800">
                Zones de production
              </Text>
              <Text className="text-gray-500 text-xs">
                {zonesProduction.length} zone
                {zonesProduction.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push("/screen/DashbordScreen/form/AddProductionZoneScreen")
            }
            className="bg-yellow-500 w-10 h-10 rounded-full items-center justify-center shadow-sm"
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <CustomInput
              placeholder="Rechercher une zone..."
              value={searchQuery}
              onChange={setSearchQuery}
              type="search"
              containerClassName="mb-0"
            />
          </View>
        </View>
      </View>

      {/* Liste des zones */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            colors={["#079C48"]}
            tintColor="#079C48"
          />
        }
      >
        <View className="p-4">
          {filteredZones.length === 0 ? (
            <View className="items-center justify-center py-12">
              <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Globe size={40} color="#9CA3AF" />
              </View>
              <Text className="text-gray-500 text-lg font-medium mb-2">
                Aucune zone trouvée
              </Text>
              <Text className="text-gray-400 text-center mb-6">
                {searchQuery
                  ? "Aucune zone ne correspond à votre recherche."
                  : "Vous n'avez pas encore créé de zone de production."}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      "/screen/DashbordScreen/form/AddProductionZoneScreen"
                    )
                  }
                  className="bg-primary px-6 py-3 rounded-lg"
                >
                  <Text className="text-black font-medium">
                    Créer ma première zone
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {filteredZones.map((zone) => (
                <ZoneGridCard key={zone.idZoneProduction} zone={zone} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
