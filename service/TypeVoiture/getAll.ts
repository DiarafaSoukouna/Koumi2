import axiosInstance from "@/constants/axiosInstance";
import { TypeVoiture } from "@/Types/TypeVoiture";

export const getAllTypeVoiture = async (): Promise<TypeVoiture[]> => {
    try {
        const response = await axiosInstance.get('/TypeVoiture/read')
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des types de voiture')
    }
}
