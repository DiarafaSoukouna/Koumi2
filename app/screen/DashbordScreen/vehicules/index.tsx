import { CustomInput } from "@/components/common/CustomInput";
import { useTransporteur } from "@/context/Transporteur";
import { Vehicule } from "@/Types/transportType";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Car,
  CheckCircle,
  Gauge,
  MapPin,
  Plus,
  XCircle,
} from "lucide-react-native";
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

export default function VehiclesListScreen() {
  const router = useRouter();
  const { vehicules, loadingVehicules, fetchVehicules } = useTransporteur();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredVehicles = useMemo(() => {
    let filtered = [...vehicules];

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.nomVehicule.toLowerCase().includes(query) ||
          vehicle.codeVehicule.toLowerCase().includes(query) ||
          vehicle.localisation.toLowerCase().includes(query)
      );
    }

    // Filtre par disponibilité
    if (showAvailableOnly) {
      filtered = filtered.filter((vehicle) => vehicle.statutVehicule);
    }

    return filtered;
  }, [vehicules, searchQuery, showAvailableOnly]);

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await fetchVehicules();
    } catch (error) {
      console.error("Error refreshing vehicles:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Composant Carte Véhicule (vue grille)
  const VehicleGridCard = ({ vehicle }: { vehicle: Vehicule }) => (
    <TouchableOpacity
      onPress={() => {
        console.log(vehicle);
        router.push({
          pathname: "/screen/DashbordScreen/vehicules/[id]",
          params: { id: vehicle.idVehicule },
        });
      }}
      className="bg-white rounded-2xl p-3 shadow-sm border border-gray-200 active:opacity-90 w-[48%] mb-4"
    >
      <View>
        {/* Image du véhicule */}
        <View className="relative mb-3">
          {vehicle.photoVehicule ? (
            <Image
              source={{ uri: vehicle.photoVehicule }}
              className="w-full h-32 rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-32 bg-indigo-50 rounded-xl items-center justify-center">
              <Car size={40} color="#4F46E5" />
            </View>
          )}

          {/* Badge de statut */}
          <View
            className={`absolute top-2 right-2 px-2 py-1 rounded-full ${
              vehicle.statutVehicule ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {vehicle.statutVehicule ? (
              <CheckCircle size={12} color="#10B981" />
            ) : (
              <XCircle size={12} color="#EF4444" />
            )}
          </View>
        </View>

        {/* Informations */}
        <View>
          <Text
            className="font-bold text-gray-800 text-sm mb-1"
            numberOfLines={1}
          >
            {vehicle.nomVehicule}
          </Text>

          <View className="flex-row items-center mb-1">
            <Gauge size={12} color="#64748B" />
            <Text className="text-gray-500 text-xs ml-1">
              {vehicle.nbKilometrage.toLocaleString()} km
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <MapPin size={12} color="#64748B" />
            <Text
              className="text-gray-500 text-xs ml-1 flex-1"
              numberOfLines={1}
            >
              {vehicle.localisation}
            </Text>
          </View>

          <Text className="text-gray-400 text-xs">
            {vehicle.typeVoiture?.nom || "Non spécifié"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loadingVehicules && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#079C48" />
          <Text className="text-gray-500 mt-4">
            Chargement des véhicules...
          </Text>
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
                Mes véhicules
              </Text>
              <Text className="text-gray-500 text-xs">
                {vehicules.length} véhicule{vehicules.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push("/screen/DashbordScreen/form/AddVehicleScreen")
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
              placeholder="Rechercher un véhicule..."
              value={searchQuery}
              onChange={setSearchQuery}
              type="search"
              containerClassName="mb-0"
            />
          </View>
        </View>
      </View>

      {/* Liste des véhicules */}
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
          {filteredVehicles.length === 0 ? (
            <View className="items-center justify-center py-12">
              <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Car size={40} color="#9CA3AF" />
              </View>
              <Text className="text-gray-500 text-lg font-medium mb-2">
                Aucun véhicule trouvé
              </Text>
              <Text className="text-gray-400 text-center mb-6">
                {searchQuery || showAvailableOnly
                  ? "Aucun véhicule ne correspond à vos critères."
                  : "Vous n'avez pas encore ajouté de véhicule."}
              </Text>
              {!searchQuery && !showAvailableOnly && (
                <TouchableOpacity
                  onPress={() =>
                    router.push("/screen/DashbordScreen/form/AddVehicleScreen")
                  }
                  className="bg-primary px-6 py-3 rounded-lg"
                >
                  <Text className="text-white font-medium">
                    Ajouter mon premier véhicule
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {filteredVehicles.map((vehicle) => (
                <VehicleGridCard key={vehicle.idVehicule} vehicle={vehicle} />
              ))}
            </View>
          )}
          {/* Espace pour le padding */}
          {/* <View className="h-24" /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
