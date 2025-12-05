import axiosInstance from '@/constants/axiosInstance'
import { CreateMagasinData } from '@/Types/merchantType'

export const updateMagasin = async (id: string, data: Partial<CreateMagasinData>): Promise<void> => {
  try {
    const formData = new FormData()

    const { photo, ...magasinData } = data

    const magasinPayload = {
      ...magasinData,
      idMagasin: id
    }

    formData.append('magasin', JSON.stringify(magasinPayload))

    if (photo && photo instanceof File) {
      formData.append('photo', photo)
    }

    await axiosInstance.put(`/Magasin/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log(" Magasin mis à jour avec succès")

  } catch (error: any) {
    console.error(" Erreur updateMagasin:", error)
    throw new Error(error.response?.data?.message || 'Erreur lors de la modification du magasin')
  }
}