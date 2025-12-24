import axiosInstance from "@/constants/axiosInstance";
import { Vehicule } from "@/Types/transportType";

export const getAllVehiculeByActeur = async (acteurId : string): Promise<Vehicule[]> => {
  try {
    if (!acteurId) {
      throw new Error("ID de l'acteur manquant");
    }
    
    const response = await axiosInstance.get(`/vehicule/getByActeur/${acteurId}`)
    return response.data || []
  } catch (error: any) {
    if (error.response?.data?.message?.toLowerCase().includes('aucun vehicule')) {
      return []
    }
    console.error('Erreur lors de la récupération des vehicules:', error.response?.data?.message || error.message)
    return []
  }
}
