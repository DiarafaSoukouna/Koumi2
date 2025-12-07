import {
    Factory,
    Fish, Leaf,
    Sprout
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
