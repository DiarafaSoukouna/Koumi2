import axiosInstance from "@/constants/axiosInstance"
import { Niveau1Pays } from "@/Types/magasinTypes"

export const getAllNiveau1Pays = async () => {
    try {
        const { data } = await axiosInstance.get('/niveau1Pays/read')
        return data as Niveau1Pays[]
    } catch (error) {
        console.error('Erreur lors de la récupération des pays:', error)
        throw error
    }
}