import axiosInstance from "@/constants/axiosInstance";
import { UpdateIntrantData } from "@/Types/intrant";

export const updateIntrant = async (id: string, data: Partial<UpdateIntrantData>): Promise<void> => {
    try {
        const formData = new FormData()

        const { image, ...intrantData } = data

        const intrantPayLoad = {
            ...intrantData,
            idIntrant: id
        }

        formData.append('intrant', JSON.stringify(intrantPayLoad))

        if (image && image instanceof File) {
            formData.append('image', image)
        }

        await axiosInstance.put(`/intrant/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        console.log("Intrant mis à jour avec succès")

    } catch (error: any) {
        console.error("Erreur update intrant:", error)
        throw new Error(error.response?.data?.message || 'Erreur lors de la modification de l\'intrant')
    }
}