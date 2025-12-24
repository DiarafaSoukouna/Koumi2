import axiosInstance from '@/constants/axiosInstance';
import { Stock } from '@/Types/Stock';


export const getAllStocksByActeur = async (acteurId: string): Promise<Stock[]> => {
  try {
    if (!acteurId) {
      throw new Error("ID de l'acteur manquant");
    }
    
    const response = await axiosInstance.get(`/Stock/getByActeurs/${acteurId}`)
    return response.data || []
  } catch (error: any) {
    if (error.response?.data?.message?.toLowerCase().includes('aucun stock')) {
      return []
    }
    console.error('Erreur lors de la récupération des stocks:', error.response?.data?.message || error.message)
    return []
  }
}