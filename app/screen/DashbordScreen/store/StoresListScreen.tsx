import { CustomInput } from '@/components/common/CustomInput';
import { useMerchant } from '@/context/Merchant';
import { Magasin } from '@/Types/merchantType';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Grid3x3,
  List,
  MapPin,
  Phone,
  Plus,
  Store as StoreIcon
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StoresListScreen() {
  const router = useRouter();
  const { magasins, loadingMagasins, fetchMagasins } = useMerchant();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const filteredStores = useMemo(() => {
    let filtered = [...magasins];

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(store =>
        store.nomMagasin.toLowerCase().includes(query) ||
        store.localiteMagasin.toLowerCase().includes(query) ||
        store.contactMagasin?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [magasins, searchQuery]);

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await fetchMagasins();
    } catch (error) {
      console.error('Error refreshing stores:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Composant Carte Magasin (vue grille)
  const StoreGridCard = ({ store }: { store: Magasin }) => (
    <TouchableOpacity
      onPress={() => router.push(`/screen/DashbordScreen/store/StoreDetailScreen/${store.idMagasin}`)}
      className="w-[48%] mb-4"
    >
      <View className="bg-white rounded-2xl p-3 shadow-sm border border-gray-200 active:opacity-90">
        {/* Image du magasin */}
        <View className="relative mb-3">
          {store.photo ? (
            <Image
              source={{ uri: store.photo }}
              className="w-full h-32 rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-32 bg-orange-50 rounded-xl items-center justify-center">
              <StoreIcon size={40} color="#F97316" />
            </View>
          )}
        </View>

        {/* Informations */}
        <View>
          <Text className="font-bold text-gray-800 text-sm mb-1" numberOfLines={1}>
            {store.nomMagasin}
          </Text>

          <View className="flex-row items-center mb-1">
            <MapPin size={12} color="#64748B" />
            <Text className="text-gray-500 text-xs ml-1 flex-1" numberOfLines={1}>
              {store.localiteMagasin}
            </Text>
          </View>

          {store.contactMagasin && (
            <View className="flex-row items-center mb-2">
              <Phone size={12} color="#64748B" />
              <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
                {store.contactMagasin}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Composant Ligne Magasin (vue liste)
  const StoreListCard = ({ store }: { store: Magasin }) => (
    <TouchableOpacity
      onPress={() => router.push(`/screen/StoreDetailScreen/${store.idMagasin}`)}
      className="mb-3"
    >
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 active:opacity-90">
        <View className="flex-row items-center">
          {/* Image */}
          <View className="w-16 h-16 rounded-xl bg-orange-50 items-center justify-center mr-3">
            {store.photo ? (
              <Image
                source={{ uri: store.photo }}
                className="w-full h-full rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <StoreIcon size={24} color="#F97316" />
            )}
          </View>

          {/* Informations */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="font-bold text-gray-800 flex-1" numberOfLines={1}>
                {store.nomMagasin}
              </Text>
            </View>

            <View className="flex-row items-center mb-1">
              <MapPin size={12} color="#64748B" />
              <Text className="text-gray-500 text-xs ml-1 flex-1" numberOfLines={1}>
                {store.localiteMagasin}
              </Text>
            </View>

            <Text className="text-gray-400 text-xs">
              Date d'ajout: {store.dateAjout}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loadingMagasins && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#079C48" />
          <Text className="text-gray-500 mt-4">Chargement des magasins...</Text>
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
              <Text className="text-xl font-bold text-gray-800">Mes magasins</Text>
              <Text className="text-gray-500 text-xs">
                {magasins.length} magasin{magasins.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/screen/DashbordScreen/form/CreateStoreScreen')}
            className="bg-primary w-10 h-10 rounded-full items-center justify-center shadow-sm"
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Barre de recherche et filtres */}
        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <CustomInput
              placeholder="Rechercher un magasin..."
              value={searchQuery}
              onChange={setSearchQuery}
              type="search"
              containerClassName="mb-0"
            />
          </View>
        </View>

        {/* Contrôles */}
        <View className="flex-row items-center justify-between mt-3">
          <TouchableOpacity
            onPress={() => setShowActiveOnly(!showActiveOnly)}
            className={`px-3 py-1.5 rounded-full ${showActiveOnly ? 'bg-primary' : 'bg-gray-200'
              }`}
          >
            <Text className={`text-xs font-medium ${showActiveOnly ? 'text-white' : 'text-gray-700'
              }`}>
              Actifs seulement
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
            <TouchableOpacity
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary' : ''}`}
              onPress={() => setViewMode('grid')}
            >
              <Grid3x3 size={18} color={viewMode === 'grid' ? 'white' : '#64748B'} />
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary' : ''}`}
              onPress={() => setViewMode('list')}
            >
              <List size={18} color={viewMode === 'list' ? 'white' : '#64748B'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Liste des magasins */}
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
        <View className="p-4">
          {filteredStores.length === 0 ? (
            <View className="items-center justify-center py-12">
              <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                <StoreIcon size={40} color="#9CA3AF" />
              </View>
              <Text className="text-gray-500 text-lg font-medium mb-2">Aucun magasin trouvé</Text>
              <Text className="text-gray-400 text-center mb-6">
                {searchQuery || showActiveOnly
                  ? 'Aucun magasin ne correspond à vos critères.'
                  : 'Vous n\'avez pas encore créé de magasin.'}
              </Text>
              {!searchQuery && !showActiveOnly && (
                <TouchableOpacity
                  onPress={() => router.push('/screen/DashbordScreen/form/CreateStoreScreen')}
                  className="bg-primary px-6 py-3 rounded-lg"
                >
                  <Text className="text-white font-medium">Créer mon premier magasin</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : viewMode === 'grid' ? (
            <View className="flex-row flex-wrap justify-between">
              {filteredStores.map((store) => (
                <StoreGridCard key={store.idMagasin} store={store} />
              ))}
            </View>
          ) : (
            <View>
              {filteredStores.map((store) => (
                <StoreListCard key={store.idMagasin} store={store} />
              ))}
            </View>
          )}

          {/* Espace pour le padding */}
          <View className="h-24" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}