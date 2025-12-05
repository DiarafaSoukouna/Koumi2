import axiosInstance from '@/constants/axiosInstance'
import { CreateIntrantData } from '@/Types/intrant'

export const createIntrant = async (data: CreateIntrantData): Promise<void> => {
    try {
        const formData = new FormData()

        const { image, ...intrantData } = data

        formData.append('intrant', JSON.stringify(intrantData))

        if (image && image instanceof File) {
            formData.append('image', image)
        }

        await axiosInstance.post('/intrant/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        console.log("Intrant créé avec succès")

    } catch (error: any) {
        console.error("Erreur createIntrant:", error)
        throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'intrant')
    }
}