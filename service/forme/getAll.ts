import axiosInstance from "@/constants/axiosInstance"
import { Forme } from "@/Types/forme"

export const getAllForme = async (): Promise<Forme[]> => {
    try {
        const response = await axiosInstance.get('/formeproduit/getAllForme/')
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des formes')
    }
}