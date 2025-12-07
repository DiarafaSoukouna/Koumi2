import { TYPE_ACTEUR_T } from ".";
import { Magasin } from "./Magasin";
import { Stock } from "./Stock";

export interface homeContextType {
    // États pour les données
    magasins: Magasin[]
    stocks: Stock[]
    typeActeur: TYPE_ACTEUR_T[]

    // États de chargement
    loadingMagasins: boolean
    loadingStocks: boolean
    loadingTypeActeur: boolean

    // États d'erreur
    errorMagasins: string | null
    errorStocks: string | null
    errorTypeActeur: string | null

    // Fonctions de récupération
    getAllMagasins: () => Promise<void>
    getAllStock: () => Promise<void>
    getAllTypeActeurs: () => Promise<void>

    // Fonction de creation

    // Fonctions de mise à jour

    // Fonctions de suppression

    // Réinitialisation des erreurs

    clearErrors: () => void

}