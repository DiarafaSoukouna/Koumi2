import axiosInstance from '@/constants/axiosInstance'
import { Stock } from '@/Types/Stock'

const ACTEUR_ID = 'd48lrq5lpgw53adl0yq1'

export const getAllStocksByActeur = async (): Promise<Stock[]> => {
  try {
    const response = await axiosInstance.get(`/Stock/getByActeurs/${ACTEUR_ID}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des stocks')
  }
}