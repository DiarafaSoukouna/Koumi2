import axiosInstance from "@/constants/axiosInstance";
import { Vehicule } from "@/Types/transportType";

export const getAllVehicule = async (): Promise<Vehicule[]> => {
    try {
        const { data } = await axiosInstance.get('/vehicule/getAllVehicule')
        return data as Vehicule[]
    } catch (error) {
        console.log('Erreur lors de la récupération des transporteurs:', error)
        throw error
    }
}