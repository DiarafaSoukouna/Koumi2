import { Magasin } from "./Magasin";

export interface homeContextType {
    // États pour les données
    magasins: Magasin[]

    // États de chargement
    loadingMagasins: boolean

    // États d'erreur
    errorMagasins: string | null

    // Fonctions de récupération
    fetchMagasins: () => Promise<void>

    // Fonction de creation

    // Fonctions de mise à jour

    // Fonctions de suppression

    // Réinitialisation des erreurs

}