import axiosInstance from "@/constants/axiosInstance";
import { CreateVehiculeData } from "@/Types/transportType";

export const updatedTransporteur = async (id: string, data: Partial<CreateVehiculeData>): Promise<void> => {

    try {
        const formData = new FormData()
        const { image, ...restData } = data
        const payload = {
            ...restData,
            idVehicule: id
        }
        formData.append("vehicule", JSON.stringify(payload))

        if (image && image instanceof File) {
            formData.append("image", image)
        }

        await axiosInstance.put(`/vehicule/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
    } catch (error) {
        console.error('error update', error)
        throw error
    }
}