import axiosInstance from '@/constants/axiosInstance'
import { CreateMagasinData } from '@/Types/merchantType'

export const createMagasin = async (data: CreateMagasinData): Promise<void> => {
  try {
    const formData = new FormData

    const { image, ...restData } = data

    formData.append('magasin', JSON.stringify(restData))

    if (image && image instanceof File) {
      formData.append('image', image)
    }
    // console.log('donne avant envoie', 2, null, JSON.stringify(formData))
    const response =
      await axiosInstance.post("/Magasin/addMagasin", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    // console.log('Mack', response)
    console.log("magzin creer avec succes")

  } catch (error) {
    console.error(" Erreur creer Magasin:", error)
    throw new Error(error.response?.data?.message || 'Erreur lors de la création du Magazin')
  }
}