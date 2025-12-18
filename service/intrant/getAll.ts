import axiosInstance from "@/constants/axiosInstance";
import { Intrant } from "@/Types/intrant";

export const getAllIntrant = async (): Promise<Intrant[]> => {
    try {
        const response = await axiosInstance.get('/intrant/read')
        // console.log("Intrants récupérés avec succès", response.data)
        return response.data
    } catch (error: any) {
        console.error("Erreur get all intrant:", error)
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des intrants')
    }
}
