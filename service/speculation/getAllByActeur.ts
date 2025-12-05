import axiosInstance from "@/constants/axiosInstance";
import { Speculation } from '@/Types/merchantType';

const ACTEUR_ID = 'd48lrq5lpgw53adl0yq1'

export const getAllSpeculationsByActeur = async (): Promise<Speculation[]> => {
  try {
    const response = await axiosInstance.get(`/Speculation/getAllSpeculationByActeur/${ACTEUR_ID}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des spéculations')
  }
}