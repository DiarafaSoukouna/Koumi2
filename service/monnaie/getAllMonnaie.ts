import axiosInstance from "@/constants/axiosInstance"
import { Monnaie } from "@/Types/monnaie"

export const getAllMonnaie = async (): Promise<Monnaie[]> => {
  try {
    const response = await axiosInstance.get('/Monnaie/getAllMonnaie')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des monnaies')
  }
}   