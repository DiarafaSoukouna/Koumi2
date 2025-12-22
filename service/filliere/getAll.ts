import axiosInstance from "@/constants/axiosInstance"
import { Filiere } from "@/Types/Filiere"

export const getAllFilliere = async (): Promise<Filiere[]> => {
  try {
    const response = await axiosInstance.get('/Filiere/getAllFiliere/')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des filieres')
  }
}   