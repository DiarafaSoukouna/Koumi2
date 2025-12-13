// Types/dashboardTypes.ts
import { Stock } from './Stock';
import { Magasin } from './merchantType';

export interface DashboardProduct extends Omit<Stock, 'magasin'> {
    magasin?: {
        idMagasin: string;
        nomMagasin: string;
    };
}

export interface DashboardStore extends Omit<Magasin, 'acteur' | 'niveau1Pays'> {
    productCount?: number;
}

export interface KPIStats {
    totalProducts: number;
    totalStores: number;
    totalZones: number;
    totalVehicles: number;
    totalRevenue: number;
    totalViews: number;
    productsPerStore: string;
    lowStockProducts: number;
    outOfStockProducts: number;
    inStockProducts: number;
    activeStores: number;
    topProducts: DashboardProduct[];
    storesByProductCount: Array<DashboardStore & { productCount: number }>;
}