import {
    Crown,
    Factory,
    Fish, Leaf,
    ShoppingBag,
    Sparkles,
    Sprout,
    Store,
    Truck
} from 'lucide-react-native';

export const promotions = [
    {
        id: 1,
        title: "la Reine Lalli",
        subtitle: "La Reine des neige",
        bgColor: '#EA580C',
        icon: 'Zap' as const,
        image: 'https://via.placeholder.com/100',
    },
    {
        id: 2,
        title: "Nouveautés",
        subtitle: "Découvrez",
        bgColor: '#22C55E',
        icon: 'Sparkles' as const,
        image: 'https://via.placeholder.com/100',
    },
    {
        id: 3,
        title: "Livraison Gratuite",
        subtitle: "Dès 20 000 FCFA",
        bgColor: '#8B5CF6', // violet
        icon: 'Truck' as const,
        image: 'https://via.placeholder.com/100',
    },
];

export const categories = [
    {
        id: 1,
        name: "Produits de pêche",
        icon: Fish,
        color: '#079C48', // vert
        count: 245,
    },
    {
        id: 2,
        name: "Produits PFNL",
        icon: Leaf,
        color: '#079C48', // orange foncé
        count: 128,
    },
    {
        id: 3,
        name: "Projets GDTE",
        icon: Sprout,
        color: '#079C48', // orange faible
        count: 87,
    },
    {
        id: 4,
        name: "Produits FACI",
        icon: Factory,
        color: '#079C48', // violet
        count: 156,
    },
];

export const acteurTypes = [
    { id: 1, name: "Banque de géniteurs", icon: Crown, count: 12 },
    { id: 2, name: "Écloseries", icon: Sparkles, count: 28 },
    { id: 3, name: "Producteurs", icon: Fish, count: 85 },
    { id: 4, name: "Transformateurs", icon: Factory, count: 45 },
    { id: 5, name: "Poissonneries", icon: Store, count: 67 },
    { id: 6, name: "Points de vente", icon: ShoppingBag, count: 120 },
    { id: 7, name: "Fournisseurs", icon: Truck, count: 38 },
];

export const hotProducts = [
    {
        id: 1,
        name: "Tilapia Frais Premium",
        price: 4500,
        oldPrice: 5500,
        image: "https://via.placeholder.com/150/22C55E/FFFFFF?text=Tilapia",
        store: "Pêcherie du Lac",
        rating: 4.8,
        reviews: 124,
        isHot: true,
        discount: 18,
        category: "Pêche",
    },
    {
        id: 2,
        name: "Alevins de Clarias",
        price: 150,
        image: "https://via.placeholder.com/150/EA580C/FFFFFF?text=Alevins",
        store: "Écloserie Moderne",
        rating: 4.9,
        reviews: 89,
        isHot: true,
        category: "Écloserie",
    },
    {
        id: 3,
        name: "Poisson Fumé Artisanal",
        price: 8000,
        oldPrice: 9500,
        image: "https://via.placeholder.com/150/FB923C/FFFFFF?text=Fumé",
        store: "Fumoir Tradition",
        rating: 4.7,
        reviews: 256,
        isHot: true,
        discount: 16,
        category: "Transformé",
    },
];

export const featuredStores = [
    {
        id: 1,
        name: "Pêcherie du Lac",
        type: "Producteur",
        image: "https://via.placeholder.com/280x112/22C55E/FFFFFF?text=Pêche",
        rating: 4.8,
        reviews: 342,
        products: 45,
        isVerified: true,
        location: "Yaoundé",
    },
    {
        id: 2,
        name: "Écloserie Moderne",
        type: "Écloserie",
        image: "https://via.placeholder.com/280x112/EA580C/FFFFFF?text=Écloserie",
        rating: 4.9,
        reviews: 189,
        products: 28,
        isVerified: true,
        location: "Douala",
    },
    {
        id: 3,
        name: "Fumoir Tradition",
        type: "Transformateur",
        image: "https://via.placeholder.com/280x112/FB923C/FFFFFF?text=Fumoir",
        rating: 4.7,
        reviews: 456,
        products: 32,
        isVerified: true,
        location: "Kribi",
    },
];

export const allProducts = [
    ...hotProducts,
    {
        id: 4,
        name: "Aliments Flottants 5kg",
        price: 12000,
        image: "https://via.placeholder.com/150/8B5CF6/FFFFFF?text=Aliment",
        store: "AquaSupply Pro",
        rating: 4.6,
        reviews: 78,
        category: "Intrants",
    },
    {
        id: 5,
        name: "Miel de Forêt Bio",
        price: 6500,
        image: "https://via.placeholder.com/150/22C55E/FFFFFF?text=Miel",
        store: "PFNL Nature",
        rating: 4.9,
        reviews: 312,
        isHot: true,
        category: "PFNL",
    },
    {
        id: 6,
        name: "Huile de Palme Rouge",
        price: 3500,
        oldPrice: 4000,
        image: "https://via.placeholder.com/150/EA580C/FFFFFF?text=Huile",
        store: "Coopérative Locale",
        rating: 4.5,
        reviews: 167,
        discount: 12,
        category: "PFNL",
    },
];

export const quickActions = [
    { id: 1, icon: 'Percent' as const, label: "Promos", color: "#EF4444" },
    { id: 2, icon: 'TrendingUp' as const, label: "Tendances", color: "#8B5CF6" },
    { id: 3, icon: 'Truck' as const, label: "Livraison", color: "#EA580C" },
    { id: 4, icon: 'HelpCircle' as const, label: "Aide", color: "#64748B" },
];