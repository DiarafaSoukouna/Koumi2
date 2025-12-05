import axiosInstance from "@/constants/axiosInstance";
import { ZoneProduction } from '@/Types/merchantType';

const ACTEUR_ID = 'd48lrq5lpgw53adl0yq1'

export const getAllZonesByActeur = async (): Promise<ZoneProduction[]> => {
  try {
    const response = await axiosInstance.get(`/ZoneProduction/getAllZonesByActeurs/${ACTEUR_ID}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des zones de production')
  }
}