import { TYPE_ACTEUR_T } from ".";
import { Filiere } from "./Filiere";
import { Magasin } from "./Magasin";
import { Stock } from "./Stock";

export interface homeContextType {
    // États pour les données
    magasins: Magasin[]
    stocks: Stock[]
    typeActeur: TYPE_ACTEUR_T[]
    fillieres: Filiere[]
    stocksByFiliere: Stock[]

    // États de chargement
    loadingMagasins: boolean
    loadingStocks: boolean
    loadingTypeActeur: boolean
    loadingFillieres: boolean
    loadingStocksByFiliere: boolean

    // États d'erreur
    errorMagasins: string | null
    errorStocks: string | null
    errorTypeActeur: string | null
    errorFillieres: string | null
    errorStocksByFiliere: string | null

    // Fonctions de récupération
    getAllMagasins: () => Promise<void>
    getAllStock: () => Promise<void>
    getAllTypeActeurs: () => Promise<void>
    getAllFillieres: () => Promise<void>
    getAllByfillierer: () => Promise<void>

    // Fonction de creation

    // Fonctions de mise à jour

    // Fonctions de suppression

    // Réinitialisation des erreurs

    clearErrors: () => void

}