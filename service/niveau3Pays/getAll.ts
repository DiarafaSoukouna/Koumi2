import axiosInstance from "@/constants/axiosInstance"
import { Niveau3Pays } from "@/Types/Niveau3Pays"

export const getAllNiveau3Pays = async () => {
    try {
        const { data } = await axiosInstance.get('/nivveau3Pays/read')
        return data as Niveau3Pays[]
    } catch (error) {
        console.error('Erreur lors de la récupération des pays:', error)
        throw error
    }
}