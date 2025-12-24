import axiosInstance from '@/constants/axiosInstance';
import { Magasin } from '@/Types/merchantType';


export const getAllMagasinsByActeur = async (acteurId: string): Promise<Magasin[]> => {
  try {
    if (!acteurId) {
      throw new Error("ID de l'acteur manquant");
    }
    
    const response = await axiosInstance.get(`/Magasin/getByActeur/${acteurId}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des magasins')
  }
} 