import { Magasin } from "./Magasin";
import { CreateMagasinData } from "./merchantType";
import { Stock } from "./Stock";

export interface homeContextType {
    // États pour les données
    magasins: Magasin[]
    stocks: Stock[]

    // États de chargement
    loadingMagasins: boolean
    loadingStocks: boolean

    // États d'erreur
    errorMagasins: string | null
    errorStocks: string | null

    // Fonctions de récupération
    fetchMagasins: () => Promise<void>
    getAllMagasins: () => Promise<void>
    getAllStock: () => Promise<void>

    // Fonction de creation
    createMagasinHandler: (data: CreateMagasinData) => Promise<void>
    updateMagasinHandler: (id: string, data: Partial<CreateMagasinData>) => Promise<void>
    deleteMagasinHandler: (id: string) => Promise<void>

    // Fonctions de mise à jour

    // Fonctions de suppression

    // Réinitialisation des erreurs

}