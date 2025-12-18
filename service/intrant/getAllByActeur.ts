import axiosInstance from "@/constants/axiosInstance";
import { Intrant } from "@/Types/intrant";

const ACTEUR_ID = 'd48lrq5lpgw53adl0yq1'

export const getAllIntrantByActeur = async (): Promise<Intrant[]> => {
    try {
        const response = await axiosInstance.get(`/intrant/getByActeur/${ACTEUR_ID}`)
        return response.data
    } catch (error: any) {
        console.error("Erreur get all intrant:", error)
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des intrants')
    }
}