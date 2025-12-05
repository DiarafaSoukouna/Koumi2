import axiosInstance from "@/constants/axiosInstance";
import { Vehicule } from "@/Types/transportType";

const ACTEUR_ID = 'd48lrq5lpgw53adl0yq1'

export const getAllVehiculeByActeur = async (): Promise<Vehicule[]> => {
    try {
        const response = await axiosInstance.get(`vehicule/getByActeur/${ACTEUR_ID}`)
        return response.data
    } catch (error) {
        console.log('Erreur lors de la récupération des transporteurs par acteur:', error)
        throw error
    }
}