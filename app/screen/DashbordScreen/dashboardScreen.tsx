import { ProductCard } from '@/components/dashboard/ProductCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { useMerchant } from '@/context/Merchant';
import { useTransporteur } from '@/context/Transporteur';
import { formatNumber } from '@/utils/formatters';
import { useRouter } from 'expo-router';
import {
  Car,
  ChevronRight,
  Globe,
  Package,
  PackageOpen,
  Plus,
  Store,
  Warehouse
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();

  // Contextes
  const merchant = useMerchant();
  const transporteur = useTransporteur();

  // États
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Récupérer l'utilisateur depuis le contexte d'authentification si disponible
  const user = useMemo(() => {
    // Si vous avez un contexte d'authentification, utilisez-le ici
    // Par exemple: const { user } = useAuth();

    // TEMPORAIRE: Utiliser un ID utilisateur codé en dur pour le développement
    return {
      idActeur: 'd48lrq5lpgw53adl0yq1',
      nomActeur: 'Macky', // Ou récupérer depuis une API si possible, sinon valeur par défaut
      typeActeur: [{ libelle: 'Marchand' }],
      // Ajouter d'autres champs si nécessaire
    };
  }, []);

  // Extraire nomActeur et typeActeur
  const nomActeur = user?.nomActeur || 'Utilisateur';
  const typeActeur = user?.typeActeur?.[0]?.libelle || 'Acteur';

  // Vérifier si l'utilisateur est transporteur
  const isTransporteur = useMemo(() => {
    const libelle = user?.typeActeur?.[0]?.libelle;
    return libelle ? libelle.toLowerCase().includes('transport') : false;
  }, [user]);

  // Fonction pour rafraîchir toutes les données
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    setDashboardError(null);

    try {
      const promises = [];

      // Toujours charger les données du marchand
      promises.push(merchant.fetchMagasins());
      promises.push(merchant.fetchStocks());
      promises.push(merchant.fetchZonesProduction());

      // Charger les données du transporteur seulement si l'utilisateur est transporteur
      if (isTransporteur && transporteur.fetchVehicules) {
        promises.push(transporteur.fetchVehicules());
      }

      await Promise.all(promises);
    } catch (error: any) {
      setDashboardError(error.message || 'Erreur lors du chargement des données');
      console.error('Error refreshing dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  }, [merchant, transporteur, isTransporteur]);

  // Rafraîchir au montage
  useEffect(() => {
    refreshData();
  }, []);

  // Calcul des KPI simplifié
  const kpis = useMemo(() => {
    const calculateKPIs = () => {
      const totalProducts = merchant.stocks.length;
      const totalStores = merchant.magasins.length;
      const totalZones = merchant.zonesProduction.length;

      // Véhicules du marchand + transporteur (si applicable)
      const totalVehicles = merchant.vehicules.length +
        (isTransporteur ? transporteur.vehicules.length : 0);

      // Produits par magasin
      const productsPerStore = totalStores > 0
        ? (totalProducts / totalStores).toFixed(1)
        : '0';

      return {
        totalProducts,
        totalStores,
        totalZones,
        totalVehicles,
        productsPerStore,
      };
    };

    return calculateKPIs();
  }, [merchant.stocks, merchant.magasins, merchant.zonesProduction, merchant.vehicules, transporteur.vehicules, isTransporteur]);

  // Gestion du chargement
  const isLoading = useMemo(() => {
    return merchant.loadingMagasins ||
      merchant.loadingStocks ||
      merchant.loadingZones ||
      (isTransporteur && transporteur.loadingVehicules);
  }, [merchant, transporteur, isTransporteur]);

  // Calcul de la largeur des cartes d'actions rapides
  const quickActionWidth = useMemo(() => {
    const screenPadding = 32; // 4 * 8 (px-4 = 16px de chaque côté)
    const gap = 12; // gap-3 = 12px
    return (width - screenPadding - gap) / 2;
  }, []);

  // Afficher l'écran de chargement
  if (isLoading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#079C48" />
          <Text className="text-gray-500 mt-4">Chargement du dashboard...</Text>
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
                {nomActeur} • {typeActeur}
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
            colors={['#079C48']}
            tintColor="#079C48"
          />
        }
      >
        <View className="p-4 space-y-6">

          {/* Section KPI Principaux */}
          <View>
            {/* Grille 2x2 pour les KPI */}
            <View className="flex-row flex-wrap" style={{ gap: 12 }}>
              <View style={{ width: quickActionWidth }}>
                <StatCard
                  title="Produits"
                  value={formatNumber(kpis.totalProducts)}
                  icon={Package}
                  color="#079C48"
                  subtitle={`${kpis.productsPerStore} par magasin`}
                />
              </View>

              <View style={{ width: quickActionWidth }}>
                <StatCard
                  title="Magasins"
                  value={formatNumber(kpis.totalStores)}
                  icon={Store}
                  color="#EA580C"
                  subtitle="Points de vente"
                  onPress={() => router.push('/screen/DashbordScreen/store/StoresListScreen')}
                />
              </View>

              <View style={{ width: quickActionWidth }}>
                <StatCard
                  title="Zones de production"
                  value={formatNumber(kpis.totalZones)}
                  icon={Globe}
                  color="#8B5CF6"
                  subtitle="Zones actives"
                />
              </View>

              <View style={{ width: quickActionWidth }}>
                <StatCard
                  title="Véhicules"
                  value={formatNumber(kpis.totalVehicles)}
                  icon={Car}
                  color="#3B82F6"
                  subtitle="Disponibles"
                />
              </View>
            </View>
          </View>

          {/* Section Actions rapides */}
          <View>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-800">Actions rapides</Text>
            </View>

            {/* Grille 2x2 pour les actions rapides */}
            <View className="flex-row flex-wrap" style={{ gap: 12 }}>
              {/* Ajouter un produit */}
              <TouchableOpacity
                onPress={() => router.push('/screen/DashbordScreen/form/AddProductScreen')}
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

              {/* Créer un magasin */}
              <TouchableOpacity
                onPress={() => router.push('/screen/DashbordScreen/form/CreateStoreScreen')}
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

              {/* Ajouter un véhicule */}
              <TouchableOpacity
                onPress={() => router.push('/screen/DashbordScreen/form/AddVehicleScreen')}
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

              {/* Créer une zone */}
              <TouchableOpacity
                onPress={() => router.push('/screen/DashbordScreen/form/AddProductionZoneScreen')}
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
            </View>
          </View>

          {/* Section Produits récents */}
          {merchant.stocks.length > 0 && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-800">Produits récents</Text>
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => router.push('/screen/DashbordScreen/ProductsListScreen')}
                >
                  <Text className="text-orange-500 text-sm font-medium">Voir tous</Text>
                  <ChevronRight size={16} color="#079C48" />
                </TouchableOpacity>
              </View>

              <View className="space-y-2">
                {merchant.stocks.slice(0, 3).map((stock) => (
                  <ProductCard key={stock.idStock} product={stock} />
                ))}
              </View>
            </View>
          )}

          {/* Espace pour le bottom padding */}
          <View className="h-20" />
        </View>
      </ScrollView>

      {/* Bouton d'action flottant */}
      <TouchableOpacity
        onPress={() => router.push('/screen/DashbordScreen/form/AddProductScreen')}
        className="absolute bottom-6 right-6 bg-orange-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <Plus size={24} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}