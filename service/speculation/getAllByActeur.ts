import axiosInstance from "@/constants/axiosInstance";
import { Speculation } from '@/Types/merchantType';

export const getAllSpeculationsByActeur = async (acteurId : string): Promise<Speculation[]> => {
  try {
    if (!acteurId) {
      throw new Error("ID de l'acteur manquant");
    }
    
    const response = await axiosInstance.get(`/Speculation/getAllSpeculationByActeur/${acteurId}`)
    return response.data || []
  } catch (error: any) {
    if (error.response?.data?.message?.toLowerCase().includes('aucun speculation')) {
      return []
    }
    console.error('Erreur lors de la récupération des speculations:', error.response?.data?.message || error.message)
    return []
  }
}
