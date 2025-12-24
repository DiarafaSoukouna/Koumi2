import { StatCard } from "@/components/dashboard/StatCard";
import { useAuth } from "@/context/auth";
import { useIntrant } from "@/context/Intrant";
import { useMerchant } from "@/context/Merchant";
import { useTransporteur } from "@/context/Transporteur";
import { formatNumber } from "@/utils/formatters";
import { useRouter } from "expo-router";
import {
  Car,
  Globe,
  Leaf,
  Package,
  PackageOpen,
  Plus,
  Store,
  Warehouse,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const router = useRouter();

  // Contextes
  const merchant = useMerchant();
  const transporteur = useTransporteur();
  const intrant = useIntrant();
  const { user, isInitializing } = useAuth(); // Récupérer l'utilisateur et l'état d'initialisation depuis l'auth

  // États
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Extraire nomActeur et types d'acteur
  const nomActeur = user?.nomActeur || "Utilisateur";
  const typeActeurs = user?.typeActeur || [];

  // Vérifier les types d'acteur
  const isTransporteur = useMemo(() => {
    return typeActeurs.some((type) =>
      type.libelle.toLowerCase().includes("transporteur")
    );
  }, [typeActeurs]);

  const isFournisseur = useMemo(() => {
    return typeActeurs.some((type) =>
      type.libelle.toLowerCase().includes("fournisseur")
    );
  }, [typeActeurs]);

  const isProducteur = useMemo(() => {
    return typeActeurs.some((type) =>
      type.libelle.toLowerCase().includes("producteur")
    );
  }, [typeActeurs]);

  // Obtenir tous les libellés de type d'acteur pour affichage
  const typeActeurLabels = useMemo(() => {
    return typeActeurs.map((t) => t.libelle).join(", ") || "Acteur";
  }, [typeActeurs]);

  // Fonction pour rafraîchir toutes les données
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    setDashboardError(null);

    try {
      const promises = [];

      // Toujours charger les données du marchand (magasins et produits)
      promises.push(merchant.fetchMagasins());
      promises.push(merchant.fetchStocks());

      // Charger les zones de production seulement si l'utilisateur est producteur
      if (isProducteur && merchant.fetchZonesProduction) {
        promises.push(merchant.fetchZonesProduction());
      }

      // Charger les données du transporteur seulement si l'utilisateur est transporteur
      if (isTransporteur && transporteur.fetchVehicules) {
        promises.push(transporteur.fetchVehicules());
      }

      // Charger les données d'intrants seulement si l'utilisateur est fournisseur
      if (isFournisseur && intrant.getAllByActeur) {
        promises.push(intrant.getAllByActeur());
      }

      await Promise.all(promises);
    } catch (error: any) {
      setDashboardError(
        error.message || "Erreur lors du chargement des données"
      );
      console.error("Error refreshing dashboard:", error);
    } finally {
      setRefreshing(false);
    }
  }, [
    merchant,
    transporteur,
    intrant,
    isTransporteur,
    isFournisseur,
    isProducteur,
  ]);

  // Rafraîchir au montage
  useEffect(() => {
    if (!isInitializing) {
      refreshData();
    }
  }, [isInitializing]);

  // Calcul des KPI basé sur les types d'acteur
  const kpis = useMemo(() => {
    const calculateKPIs = () => {
      const totalProducts = merchant.stocks.length;
      const totalStores = merchant.magasins.length;
      const totalZones = isProducteur ? merchant.zonesProduction.length : 0;
      const totalIntrants = isFournisseur
        ? intrant.GetAllIntranByActeur.length
        : 0;
      const totalVehicles = isTransporteur ? transporteur.vehicules.length : 0;

      // Produits par magasin
      const productsPerStore =
        totalStores > 0 ? (totalProducts / totalStores).toFixed(1) : "0";

      return {
        totalProducts,
        totalStores,
        totalZones,
        totalVehicles,
        productsPerStore,
        totalIntrants,
      };
    };

    return calculateKPIs();
  }, [
    merchant.stocks,
    merchant.magasins,
    merchant.zonesProduction,
    transporteur.vehicules,
    intrant.GetAllIntranByActeur,
    isProducteur,
    isFournisseur,
    isTransporteur,
  ]);

  // Gestion du chargement
  const isLoading = useMemo(() => {
    const baseLoading = merchant.loadingMagasins || merchant.loadingStocks;

    if (isProducteur && merchant.loadingZones) return true;
    if (isTransporteur && transporteur.loadingVehicules) return true;
    if (isFournisseur && intrant.loadingByActeur) return true;

    return baseLoading;
  }, [
    merchant,
    transporteur,
    intrant,
    isProducteur,
    isTransporteur,
    isFournisseur,
  ]);

  // Calcul de la largeur des cartes d'actions rapides
  const quickActionWidth = useMemo(() => {
    const screenPadding = 32;
    const gap = 12;
    return (width - screenPadding - gap) / 2;
  }, []);

  // Compter le nombre de cartes KPI à afficher
  const kpiCardsToShow = useMemo(() => {
    let count = 2; // Produits et Magasins sont toujours affichés

    if (isProducteur) count++; // Zones de production
    if (isTransporteur) count++; // Véhicules
    if (isFournisseur) count++; // Intrants agricoles

    return count;
  }, [isProducteur, isTransporteur, isFournisseur]);

  // Compter le nombre de boutons d'actions rapides à afficher
  const quickActionCardsToShow = useMemo(() => {
    let count = 2; // Ajouter un produit et Créer un magasin sont toujours affichés

    if (isProducteur) count++; // Créer une zone
    if (isTransporteur) count++; // Ajouter un véhicule
    if (isFournisseur) count++; // Ajouter un intrant

    return count;
  }, [isProducteur, isTransporteur, isFournisseur]);

  // Afficher l'écran de chargement pendant l'initialisation ou le chargement des données
  if (isInitializing || (isLoading && !refreshing)) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#079C48" />
          <Text className="text-gray-500 mt-4">
            {isInitializing
              ? "Initialisation..."
              : "Chargement du dashboard..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-4 pb-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View>
              <Text className="text-xl font-bold text-gray-800">Dashboard</Text>
              <Text className="text-gray-500 text-xs">
                {nomActeur} • {typeActeurLabels}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
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
        <View className="p-4 space-y-6">
          {/* Section KPI Principaux */}
          <View>
            {/* Grille 2x2 pour les KPI */}
            <View className="flex-row flex-wrap" style={{ gap: 12 }}>
              {/* Produits - Toujours affiché */}
              <View style={{ width: quickActionWidth }}>
                <StatCard
                  title="Produits"
                  value={formatNumber(kpis.totalProducts)}
                  icon={Package}
                  color="#079C48"
                  subtitle={`${kpis.productsPerStore} par magasin`}
                  onPress={() =>
                    router.push(
                      "/screen/DashbordScreen/produits/ProductsListScreen"
                    )
                  }
                />
              </View>

              {/* Magasins - Toujours affiché */}
              <View style={{ width: quickActionWidth }}>
                <StatCard
                  title="Magasins"
                  value={formatNumber(kpis.totalStores)}
                  icon={Store}
                  color="#EA580C"
                  subtitle="Points de vente"
                  onPress={() =>
                    router.push("/screen/DashbordScreen/store/StoresListScreen")
                  }
                />
              </View>

              {/* Zones de production - Seulement pour Producteur */}
              {isProducteur && (
                <View style={{ width: quickActionWidth }}>
                  <StatCard
                    title="Zones de production"
                    value={formatNumber(kpis.totalZones)}
                    icon={Globe}
                    color="#8B5CF6"
                    subtitle="Zones actives"
                    onPress={() =>
                      router.push("/screen/DashbordScreen/zone/ZonesListScreen")
                    }
                  />
                </View>
              )}

              {/* Véhicules - Seulement pour Transporteur */}
              {isTransporteur && (
                <View style={{ width: quickActionWidth }}>
                  <StatCard
                    title="Véhicules"
                    value={formatNumber(kpis.totalVehicles)}
                    icon={Car}
                    color="#3B82F6"
                    subtitle="Disponibles"
                    onPress={() =>
                      router.push("/screen/DashbordScreen/vehicules")
                    }
                  />
                </View>
              )}

              {/* Intrants agricoles - Seulement pour Fournisseur */}
              {isFournisseur && (
                <View style={{ width: quickActionWidth }}>
                  <StatCard
                    title="Intrants agricoles"
                    value={formatNumber(kpis.totalIntrants)}
                    icon={PackageOpen}
                    color="#10B981"
                    subtitle="Disponibles"
                    onPress={() =>
                      router.push("/screen/DashbordScreen/intrants")
                    }
                  />
                </View>
              )}
            </View>

            {/* Message si peu de cartes */}
            {kpiCardsToShow < 3 && (
              <View className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Text className="text-yellow-800 text-sm text-center">
                  Vous avez accès à {kpiCardsToShow} types de ressources.
                  Contactez l'administration pour plus de fonctionnalités.
                </Text>
              </View>
            )}
          </View>

          {/* Section Actions rapides */}
          <View>
            <View className="flex-row items-center justify-between mb-3 pt-3">
              <Text className="text-lg font-bold text-gray-800">
                Actions rapides
              </Text>
            </View>

            {/* Grille 2x2 pour les actions rapides */}
            <View className="flex-row flex-wrap" style={{ gap: 12 }}>
              {/* Ajouter un produit - Toujours affiché */}
              <TouchableOpacity
                onPress={() =>
                  router.push("/screen/DashbordScreen/form/AddProductScreen")
                }
                style={{ width: quickActionWidth }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 items-center justify-center active:opacity-90"
              >
                <View className="w-14 h-14 bg-primary/10 rounded-full items-center justify-center mb-3">
                  <PackageOpen size={24} color="#079C48" />
                </View>
                <Text className="font-medium text-gray-800 text-center text-sm mb-1">
                  Ajouter un produit
                </Text>
                <Text className="text-gray-500 text-xs text-center">
                  Dans votre stock
                </Text>
              </TouchableOpacity>

              {/* Créer un magasin - Toujours affiché */}
              <TouchableOpacity
                onPress={() =>
                  router.push("/screen/DashbordScreen/form/CreateStoreScreen")
                }
                style={{ width: quickActionWidth }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 items-center justify-center active:opacity-90"
              >
                <View className="w-14 h-14 bg-orange-100 rounded-full items-center justify-center mb-3">
                  <Warehouse size={24} color="#EA580C" />
                </View>
                <Text className="font-medium text-gray-800 text-center text-sm mb-1">
                  Créer un magasin
                </Text>
                <Text className="text-gray-500 text-xs text-center">
                  Nouveau point de vente
                </Text>
              </TouchableOpacity>

              {/* Ajouter un véhicule - Seulement pour Transporteur */}
              {isTransporteur && (
                <TouchableOpacity
                  onPress={() =>
                    router.push("/screen/DashbordScreen/form/AddVehicleScreen")
                  }
                  style={{ width: quickActionWidth }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 items-center justify-center active:opacity-90"
                >
                  <View className="w-14 h-14 bg-blue-100 rounded-full items-center justify-center mb-3">
                    <Car size={24} color="#3B82F6" />
                  </View>
                  <Text className="font-medium text-gray-800 text-center text-sm mb-1">
                    Ajouter un véhicule
                  </Text>
                  <Text className="text-gray-500 text-xs text-center">
                    Transport & Livraison
                  </Text>
                </TouchableOpacity>
              )}

              {/* Créer une zone - Seulement pour Producteur */}
              {isProducteur && (
                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      "/screen/DashbordScreen/form/AddProductionZoneScreen"
                    )
                  }
                  style={{ width: quickActionWidth }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 items-center justify-center active:opacity-90"
                >
                  <View className="w-14 h-14 bg-purple-100 rounded-full items-center justify-center mb-3">
                    <Globe size={24} color="#8B5CF6" />
                  </View>
                  <Text className="font-medium text-gray-800 text-center text-sm mb-1">
                    Créer une zone
                  </Text>
                  <Text className="text-gray-500 text-xs text-center">
                    Zone de production
                  </Text>
                </TouchableOpacity>
              )}

              {/* Ajouter un intrant - Seulement pour Fournisseur */}
              {isFournisseur && (
                <TouchableOpacity
                  onPress={() =>
                    router.push("/screen/DashbordScreen/form/AddIntrantScreen")
                  }
                  style={{ width: quickActionWidth }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 items-center justify-center active:opacity-90"
                >
                  <View className="w-14 h-14 bg-green-100 rounded-full items-center justify-center mb-3">
                    <Leaf size={24} color="#10B981" />
                  </View>
                  <Text className="font-medium text-gray-800 text-center text-sm mb-1">
                    Ajouter un intrant
                  </Text>
                  <Text className="text-gray-500 text-xs text-center">
                    Intrants agricoles
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Message si peu de boutons d'action */}
            {quickActionCardsToShow < 3 && (
              <View className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Text className="text-blue-800 text-sm text-center">
                  Actions disponibles selon votre profil :{" "}
                  {quickActionCardsToShow} actions
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bouton flottant pour ajouter un produit - Toujours visible */}
      <TouchableOpacity
        onPress={() =>
          router.push("/screen/DashbordScreen/form/AddProductScreen")
        }
        className="absolute bottom-6 right-6 bg-yellow-500 w-14 h-14 rounded-full items-center justify-center shadow-lg active:opacity-80"
      >
        <Plus size={24} color="black" />
      </TouchableOpacity>

      {/* Afficher les erreurs */}
      {/* {dashboardError && (
        <View className="absolute bottom-24 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <Text className="text-red-700 text-sm text-center">
            {dashboardError}
          </Text>
        </View>
      )} */}
    </SafeAreaView>
  );
}
