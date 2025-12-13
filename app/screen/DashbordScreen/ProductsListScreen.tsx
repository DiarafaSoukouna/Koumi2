// app/screens/ProductsListScreen.tsx
import { Stock } from '@/Types/Stock';
import { CustomInput } from '@/components/common/CustomInput';
import { FormSelect } from '@/components/common/CustomSelect';
import { useMerchant } from '@/context/Merchant';
import { useRouter } from 'expo-router';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    DollarSign,
    Edit,
    Eye,
    Filter,
    Grid3x3,
    Hash,
    List,
    Package,
    Plus,
    Store,
    Trash2,
    X,
    XCircle
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProductsListScreen() {
    const router = useRouter();
    const {
        stocks,
        loadingStocks,
        fetchStocks,
        deleteStock,
        magasins,
        speculations,
        unites,
        fetchMagasins,
        fetchSpeculations,
        fetchUnites,
    } = useMerchant();

    // États
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Stock[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [selectedProduct, setSelectedProduct] = useState<Stock | null>(null);
    const [showActions, setShowActions] = useState(false);
    const [filters, setFilters] = useState({
        magasin: '',
        speculation: '',
        minPrice: '',
        maxPrice: '',
        minStock: '',
        maxStock: '',
        status: '',
        sortBy: 'dateAjout',
        sortOrder: 'desc',
    });

    // Options pour les filtres
    const magasinOptions = useMemo(() => [
        { value: '', label: 'Tous les magasins' },
        ...magasins.map(m => ({
            value: m.idMagasin,
            label: m.nomMagasin,
        })),
    ], [magasins]);

    const speculationOptions = useMemo(() => [
        { value: '', label: 'Toutes les spéculations' },
        ...speculations.map(s => ({
            value: s.idSpeculation,
            label: s.nomSpeculation,
        })),
    ], [speculations]);

    const statusOptions = [
        { value: '', label: 'Tous les statuts' },
        { value: 'available', label: 'En stock' },
        { value: 'low', label: 'Stock faible' },
        { value: 'out', label: 'Rupture' },
    ];

    const sortOptions = [
        { value: 'dateAjout', label: 'Date d\'ajout' },
        { value: 'nomProduit', label: 'Nom' },
        { value: 'prix', label: 'Prix' },
        { value: 'quantiteStock', label: 'Stock' },
        { value: 'nbreView', label: 'Popularité' },
    ];

    // Charger les données initiales
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchStocks(),
                fetchMagasins(),
                fetchSpeculations(),
                fetchUnites(),
            ]);
        };
        loadData();
    }, []);

    // Filtrer et trier les produits
    useEffect(() => {
        let result = [...stocks];

        // Filtre par recherche textuelle
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(product =>
                product.nomProduit.toLowerCase().includes(query) ||
                product.descriptionStock?.toLowerCase().includes(query) ||
                product.typeProduit?.toLowerCase().includes(query) ||
                product.magasin?.nomMagasin?.toLowerCase().includes(query)
            );
        }

        // Filtre par magasin
        if (filters.magasin) {
            result = result.filter(product =>
                product.magasin?.idMagasin === filters.magasin
            );
        }

        // Filtre par spéculation
        if (filters.speculation) {
            result = result.filter(product =>
                product.speculation?.idSpeculation === filters.speculation
            );
        }

        // Filtre par prix
        if (filters.minPrice) {
            const min = parseFloat(filters.minPrice);
            result = result.filter(product => product.prix >= min);
        }
        if (filters.maxPrice) {
            const max = parseFloat(filters.maxPrice);
            result = result.filter(product => product.prix <= max);
        }

        // Filtre par stock
        if (filters.minStock) {
            const min = parseFloat(filters.minStock);
            result = result.filter(product => product.quantiteStock >= min);
        }
        if (filters.maxStock) {
            const max = parseFloat(filters.maxStock);
            result = result.filter(product => product.quantiteStock <= max);
        }

        // Filtre par statut
        if (filters.status) {
            switch (filters.status) {
                case 'available':
                    result = result.filter(product => product.quantiteStock > 10);
                    break;
                case 'low':
                    result = result.filter(product => product.quantiteStock > 0 && product.quantiteStock <= 10);
                    break;
                case 'out':
                    result = result.filter(product => product.quantiteStock === 0);
                    break;
            }
        }

        // Trier les résultats
        result.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'nomProduit':
                    comparison = a.nomProduit.localeCompare(b.nomProduit);
                    break;
                case 'prix':
                    comparison = a.prix - b.prix;
                    break;
                case 'quantiteStock':
                    comparison = a.quantiteStock - b.quantiteStock;
                    break;
                case 'nbreView':
                    comparison = (a.nbreView || 0) - (b.nbreView || 0);
                    break;
                case 'dateAjout':
                default:
                    comparison = new Date(b.dateAjout).getTime() - new Date(a.dateAjout).getTime();
                    break;
            }

            return filters.sortOrder === 'desc' ? -comparison : comparison;
        });

        setFilteredProducts(result);
    }, [stocks, searchQuery, filters]);

    // Rafraîchir les données
    const refreshData = async () => {
        setRefreshing(true);
        try {
            await fetchStocks();
        } catch (error) {
            console.error('Error refreshing products:', error);
        } finally {
            setRefreshing(false);
        }
    };

    // Supprimer un produit
    const handleDeleteProduct = async (productId: string) => {
        Alert.alert(
            'Confirmation',
            'Êtes-vous sûr de vouloir supprimer ce produit ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteStock(productId);
                            setSelectedProduct(null);
                            setShowActions(false);
                        } catch (error: any) {
                            Alert.alert('Erreur', error.message || 'Erreur lors de la suppression');
                        }
                    },
                },
            ]
        );
    };

    // Obtenir la couleur du statut du stock
    const getStockStatusColor = (quantity: number) => {
        if (quantity === 0) return 'bg-red-100 text-red-700';
        if (quantity < 10) return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    const getStockStatusText = (quantity: number) => {
        if (quantity === 0) return 'Rupture';
        if (quantity < 10) return 'Stock faible';
        return 'En stock';
    };

    const getStockIcon = (quantity: number) => {
        if (quantity === 0) return XCircle;
        if (quantity < 10) return AlertCircle;
        return CheckCircle;
    };

    // Statistiques
    const stats = useMemo(() => {
        const totalProducts = stocks.length;
        const totalValue = stocks.reduce((sum, p) => sum + (p.prix * p.quantiteStock), 0);
        const lowStockProducts = stocks.filter(p => p.quantiteStock > 0 && p.quantiteStock < 10).length;
        const outOfStockProducts = stocks.filter(p => p.quantiteStock === 0).length;
        const totalViews = stocks.reduce((sum, p) => sum + (p.nbreView || 0), 0);

        return {
            totalProducts,
            totalValue,
            lowStockProducts,
            outOfStockProducts,
            totalViews,
        };
    }, [stocks]);

    // Composant Carte de Produit (Vue Grille)
    const ProductGridCard = ({ product }: { product: Stock }) => (
        <TouchableOpacity
            onPress={() => router.push(`/screen/ProductDetailScreen/${product.idStock}`)}
            onLongPress={() => {
                setSelectedProduct(product);
                setShowActions(true);
            }}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 active:opacity-90"
        >
            {/* Image du produit */}
            <View className="relative mb-3">
                {product.photo ? (
                    <Image
                        source={{ uri: product.photo }}
                        className="w-full h-40 rounded-lg"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-40 bg-gray-100 rounded-lg items-center justify-center">
                        <Package size={48} color="#9CA3AF" />
                    </View>
                )}

                {/* Badge de statut */}
                <View className={`absolute top-2 right-2 px-2 py-1 rounded-full ${getStockStatusColor(product.quantiteStock)}`}>
                    <Text className="text-xs font-medium">
                        {getStockStatusText(product.quantiteStock)}
                    </Text>
                </View>
            </View>

            {/* Informations du produit */}
            <View>
                <Text className="font-bold text-gray-800 text-sm mb-1" numberOfLines={1}>
                    {product.nomProduit}
                </Text>

                <Text className="text-gray-500 text-xs mb-2" numberOfLines={2}>
                    {product.descriptionStock || 'Aucune description'}
                </Text>

                <View className="flex-row items-center justify-between">
                    <Text className="text-primary font-bold text-base">
                        {formatCurrency(product.prix)}
                    </Text>
                    <View className="flex-row items-center">
                        <Hash size={12} color="#64748B" />
                        <Text className="text-gray-600 text-xs ml-1">{product.quantiteStock}</Text>
                    </View>
                </View>

                {/* Informations supplémentaires */}
                <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    {product.magasin && (
                        <View className="flex-row items-center">
                            <Store size={10} color="#94A3B8" />
                            <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
                                {product.magasin.nomMagasin}
                            </Text>
                        </View>
                    )}

                    <View className="flex-row items-center">
                        <Eye size={10} color="#94A3B8" />
                        <Text className="text-gray-500 text-xs ml-1">
                            {product.nbreView || 0}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Composant Ligne de Produit (Vue Liste)
    const ProductListCard = ({ product }: { product: Stock }) => {
        const StatusIcon = getStockIcon(product.quantiteStock);

        return (
            <TouchableOpacity
                onPress={() => router.push(`/screen/ProductDetailScreen/${product.idStock}`)}
                onLongPress={() => {
                    setSelectedProduct(product);
                    setShowActions(true);
                }}
                className="bg-white rounded-xl p-3 mb-2 shadow-sm border border-gray-200 active:opacity-90"
            >
                <View className="flex-row">
                    {/* Image */}
                    <View className="w-16 h-16 rounded-lg bg-gray-100 items-center justify-center mr-3">
                        {product.photo ? (
                            <Image
                                source={{ uri: product.photo }}
                                className="w-full h-full rounded-lg"
                                resizeMode="cover"
                            />
                        ) : (
                            <Package size={24} color="#9CA3AF" />
                        )}
                    </View>

                    {/* Informations */}
                    <View className="flex-1">
                        <View className="flex-row items-start justify-between">
                            <View className="flex-1">
                                <Text className="font-bold text-gray-800 text-sm mb-1" numberOfLines={1}>
                                    {product.nomProduit}
                                </Text>
                                <Text className="text-gray-500 text-xs mb-2" numberOfLines={1}>
                                    {product.speculation?.nomSpeculation}
                                </Text>
                            </View>

                            <View className={`px-2 py-1 rounded-full ${getStockStatusColor(product.quantiteStock)}`}>
                                <Text className="text-xs font-medium">
                                    {getStockStatusText(product.quantiteStock)}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between mt-2">
                            <View>
                                <Text className="text-primary font-bold text-base">
                                    {formatCurrency(product.prix)}
                                </Text>
                                <Text className="text-gray-500 text-xs mt-1">
                                    Stock: {product.quantiteStock} {product.unite?.libUnite}
                                </Text>
                            </View>

                            <View className="flex-row items-center space-x-3">
                                {product.magasin && (
                                    <View className="flex-row items-center">
                                        <Store size={12} color="#94A3B8" />
                                        <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
                                            {product.magasin.nomMagasin}
                                        </Text>
                                    </View>
                                )}

                                <View className="flex-row items-center">
                                    <Eye size={12} color="#94A3B8" />
                                    <Text className="text-gray-500 text-xs ml-1">
                                        {product.nbreView || 0}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <Text className="text-gray-400 text-xs mt-2">
                            Ajouté le {formatDate(product.dateAjout)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Modal des actions rapides
    const ActionsModal = () => (
        <Modal
            visible={showActions}
            transparent
            animationType="fade"
            onRequestClose={() => setShowActions(false)}
        >
            <TouchableOpacity
                className="flex-1 bg-black/50 items-center justify-end"
                activeOpacity={1}
                onPress={() => setShowActions(false)}
            >
                <View className="w-full bg-white rounded-t-2xl p-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-bold text-gray-800">Actions</Text>
                        <TouchableOpacity onPress={() => setShowActions(false)}>
                            <X size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    {selectedProduct && (
                        <>
                            <Text className="font-medium text-gray-800 text-sm mb-2">
                                {selectedProduct.nomProduit}
                            </Text>

                            <View className="space-y-2">
                                <TouchableOpacity
                                    className="flex-row items-center p-3 bg-gray-50 rounded-lg"
                                    onPress={() => {
                                        router.push(`/screen/EditProductScreen/${selectedProduct.idStock}`);
                                        setShowActions(false);
                                    }}
                                >
                                    <Edit size={20} color="#3B82F6" className="mr-3" />
                                    <Text className="text-gray-800">Modifier le produit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-row items-center p-3 bg-gray-50 rounded-lg"
                                    onPress={() => {
                                        // Ajouter une action de duplication
                                        setShowActions(false);
                                    }}
                                >
                                    <Package size={20} color="#10B981" className="mr-3" />
                                    <Text className="text-gray-800">Dupliquer le produit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-row items-center p-3 bg-gray-50 rounded-lg"
                                    onPress={() => {
                                        // Voir les détails
                                        router.push(`/screen/ProductDetailScreen/${selectedProduct.idStock}`);
                                        setShowActions(false);
                                    }}
                                >
                                    <Eye size={20} color="#8B5CF6" className="mr-3" />
                                    <Text className="text-gray-800">Voir les détails</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-row items-center p-3 bg-red-50 rounded-lg"
                                    onPress={() => handleDeleteProduct(selectedProduct.idStock)}
                                >
                                    <Trash2 size={20} color="#EF4444" className="mr-3" />
                                    <Text className="text-red-600">Supprimer le produit</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </TouchableOpacity>
        </Modal>
    );

    // Filtres
    const FiltersPanel = () => (
        <Modal
            visible={showFilters}
            transparent
            animationType="slide"
            onRequestClose={() => setShowFilters(false)}
        >
            <View className="flex-1 bg-gray-50">
                <View className="bg-white px-4 py-3 border-b border-gray-200">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-xl font-bold text-gray-800">Filtres</Text>
                        <TouchableOpacity onPress={() => setShowFilters(false)}>
                            <X size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView className="p-4">
                    <View className="space-y-4">
                        {/* Magasin */}
                        <FormSelect
                            label="Magasin"
                            placeholder="Filtrer par magasin"
                            value={filters.magasin}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, magasin: value }))}
                            items={magasinOptions}
                        />

                        {/* Spéculation */}
                        <FormSelect
                            label="Type de produit"
                            placeholder="Filtrer par type"
                            value={filters.speculation}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, speculation: value }))}
                            items={speculationOptions}
                        />

                        {/* Statut */}
                        <FormSelect
                            label="Statut du stock"
                            placeholder="Filtrer par statut"
                            value={filters.status}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                            items={statusOptions}
                        />

                        {/* Prix */}
                        <View>
                            <Text className="text-gray-700 font-medium text-sm mb-2">Prix</Text>
                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <CustomInput
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(value) => setFilters(prev => ({ ...prev, minPrice: value }))}
                                        type="number"
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View className="flex-1">
                                    <CustomInput
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}
                                        type="number"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Stock */}
                        <View>
                            <Text className="text-gray-700 font-medium text-sm mb-2">Stock</Text>
                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <CustomInput
                                        placeholder="Min"
                                        value={filters.minStock}
                                        onChange={(value) => setFilters(prev => ({ ...prev, minStock: value }))}
                                        type="number"
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View className="flex-1">
                                    <CustomInput
                                        placeholder="Max"
                                        value={filters.maxStock}
                                        onChange={(value) => setFilters(prev => ({ ...prev, maxStock: value }))}
                                        type="number"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Tri */}
                        <FormSelect
                            label="Trier par"
                            placeholder="Sélectionnez un critère"
                            value={filters.sortBy}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                            items={sortOptions}
                        />

                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                className={`flex-1 py-3 rounded-lg ${filters.sortOrder === 'asc' ? 'bg-primary' : 'bg-gray-200'}`}
                                onPress={() => setFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
                            >
                                <Text className={`text-center ${filters.sortOrder === 'asc' ? 'text-white' : 'text-gray-600'}`}>
                                    Croissant
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className={`flex-1 py-3 rounded-lg ${filters.sortOrder === 'desc' ? 'bg-primary' : 'bg-gray-200'}`}
                                onPress={() => setFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
                            >
                                <Text className={`text-center ${filters.sortOrder === 'desc' ? 'text-white' : 'text-gray-600'}`}>
                                    Décroissant
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Boutons */}
                        <View className="flex-row gap-3 mt-6">
                            <TouchableOpacity
                                className="flex-1 py-3 bg-gray-200 rounded-lg"
                                onPress={() => {
                                    setFilters({
                                        magasin: '',
                                        speculation: '',
                                        minPrice: '',
                                        maxPrice: '',
                                        minStock: '',
                                        maxStock: '',
                                        status: '',
                                        sortBy: 'dateAjout',
                                        sortOrder: 'desc',
                                    });
                                }}
                            >
                                <Text className="text-center text-gray-800 font-medium">Réinitialiser</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 py-3 bg-primary rounded-lg"
                                onPress={() => setShowFilters(false)}
                            >
                                <Text className="text-center text-white font-medium">Appliquer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );

    if (loadingStocks && !refreshing) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar style="dark" />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#079C48" />
                    <Text className="text-gray-500 mt-4">Chargement des produits...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />

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
                            <Text className="text-xl font-bold text-gray-800">Mes produits</Text>
                            <Text className="text-gray-500 text-xs">
                                {user?.nomActeur || 'Votre stock'} • {stats.totalProducts} produits
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push('/screen/AddProductScreen')}
                        className="bg-primary w-10 h-10 rounded-full items-center justify-center"
                    >
                        <Plus size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Barre de recherche */}
                <View className="flex-row items-center gap-2">
                    <View className="flex-1">
                        <CustomInput
                            placeholder="Rechercher un produit..."
                            value={searchQuery}
                            onChange={setSearchQuery}
                            type="search"
                            containerClassName="mb-0"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => setShowFilters(true)}
                        className="w-12 h-12 bg-white border border-gray-300 rounded-lg items-center justify-center"
                    >
                        <Filter size={20} color="#64748B" />
                        {Object.values(filters).some(filter => filter && filter !== 'dateAjout' && filter !== 'desc') && (
                            <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Statistiques */}
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
                    {/* Statistiques rapides */}
                    <View className="grid grid-cols-2 gap-3 mb-6">
                        <View className="bg-white rounded-xl p-4 border border-gray-200">
                            <View className="flex-row items-center justify-between">
                                <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center">
                                    <Package size={20} color="#079C48" />
                                </View>
                                <View className={`px-2 py-1 rounded-full ${stats.totalProducts > 0 ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                    <Text className={`text-xs font-medium ${stats.totalProducts > 0 ? 'text-green-700' : 'text-gray-700'
                                        }`}>
                                        {stats.totalProducts > 0 ? 'Actif' : 'Vide'}
                                    </Text>
                                </View>
                            </View>
                            <Text className="text-2xl font-bold text-gray-800 mt-2">{stats.totalProducts}</Text>
                            <Text className="text-gray-500 text-sm">Produits totaux</Text>
                        </View>

                        <View className="bg-white rounded-xl p-4 border border-gray-200">
                            <View className="flex-row items-center justify-between">
                                <View className="w-10 h-10 bg-green-100 rounded-lg items-center justify-center">
                                    <DollarSign size={20} color="#10B981" />
                                </View>
                                <View className="px-2 py-1 bg-blue-100 rounded-full">
                                    <Text className="text-xs font-medium text-blue-700">Valeur</Text>
                                </View>
                            </View>
                            <Text className="text-2xl font-bold text-gray-800 mt-2">
                                {formatCurrency(stats.totalValue)}
                            </Text>
                            <Text className="text-gray-500 text-sm">Valeur du stock</Text>
                        </View>
                    </View>

                    {/* Contrôles d'affichage */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-gray-700 font-medium">
                            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
                        </Text>

                        <View className="flex-row items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
                            <TouchableOpacity
                                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary' : ''}`}
                                onPress={() => setViewMode('list')}
                            >
                                <List size={18} color={viewMode === 'list' ? 'white' : '#64748B'} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary' : ''}`}
                                onPress={() => setViewMode('grid')}
                            >
                                <Grid3x3 size={18} color={viewMode === 'grid' ? 'white' : '#64748B'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Liste des produits */}
                    {filteredProducts.length === 0 ? (
                        <View className="items-center justify-center py-12">
                            <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                                <Package size={40} color="#9CA3AF" />
                            </View>
                            <Text className="text-gray-500 text-lg font-medium mb-2">Aucun produit trouvé</Text>
                            <Text className="text-gray-400 text-center mb-6">
                                {searchQuery || Object.values(filters).some(f => f)
                                    ? 'Aucun produit ne correspond à vos critères de recherche.'
                                    : 'Vous n\'avez pas encore ajouté de produit à votre stock.'}
                            </Text>
                            {!searchQuery && !Object.values(filters).some(f => f) && (
                                <TouchableOpacity
                                    onPress={() => router.push('/screen/AddProductScreen')}
                                    className="bg-primary px-6 py-3 rounded-lg"
                                >
                                    <Text className="text-white font-medium">Ajouter mon premier produit</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : viewMode === 'grid' ? (
                        <View className="grid grid-cols-2 gap-3">
                            {filteredProducts.map((product) => (
                                <ProductGridCard key={product.idStock} product={product} />
                            ))}
                        </View>
                    ) : (
                        <View>
                            {filteredProducts.map((product) => (
                                <ProductListCard key={product.idStock} product={product} />
                            ))}
                        </View>
                    )}

                    {/* Espace pour le padding */}
                    <View className="h-24" />
                </View>
            </ScrollView>

            {/* Filtres Panel */}
            <FiltersPanel />

            {/* Actions Modal */}
            <ActionsModal />

            {/* Navigation rapide */}
            <View className="absolute bottom-4 right-4">
                <TouchableOpacity
                    onPress={() => router.push('/screen/AddProductScreen')}
                    className="bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
                >
                    <Plus size={24} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}