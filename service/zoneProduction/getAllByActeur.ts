import axiosInstance from "@/constants/axiosInstance";
import { ZoneProduction } from '@/Types/merchantType';


export const getAllZonesByActeur = async (acteurId : string): Promise<ZoneProduction[]> => {
  try {
    if (!acteurId) {
      throw new Error("ID de l'acteur manquant");
    }
    
    const response = await axiosInstance.get(`/ZoneProduction/getAllZonesByActeurs/${acteurId}`)
    return response.data || []
  } catch (error: any) {
    if (error.response?.data?.message?.toLowerCase().includes('aucun zone')) {
      return []
    }
    console.error('Erreur lors de la récupération des zones:', error.response?.data?.message || error.message)
    return []
  }
}

