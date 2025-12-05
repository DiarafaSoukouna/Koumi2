import axiosInstance from "@/constants/axiosInstance";
import { CreateVehiculeData } from "@/Types/transportType";

export const createVehicule = async (data: CreateVehiculeData): Promise<void> => {
    try {
        const formaData = new FormData()
        const { image, ...restData } = data
        formaData.append("vehicule", JSON.stringify(restData))

        if (image && image instanceof File) {
            formaData.append("image", image)
        }

        const response = await axiosInstance.post("/vehicule/create?vehicule", formaData)
        console.log('response', response)
    } catch (error) {
        console.error('error creation', error)
        throw error
    }
}