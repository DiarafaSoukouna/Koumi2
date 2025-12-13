import axiosInstance from '@/constants/axiosInstance'
import { Magasin } from '@/Types/merchantType'

const ACTEUR_ID = 'd48lrq5lpgw53adl0yq1'

export const getAllMagasinsByActeur = async (): Promise<Magasin[]> => {
  try {
    const response = await axiosInstance.get(`/Magasin/getByActeur/${ACTEUR_ID}`)
    console.log("camara macky", response.data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des magasins')
  }
}