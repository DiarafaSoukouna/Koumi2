import axiosInstance from '@/constants/axiosInstance'
import { CreateStockData } from '@/Types/merchantType'

export const createStock = async (data: CreateStockData): Promise<void> => {
  try {
    const formData = new FormData()

    const { image, ...stockData } = data

    formData.append('stock', JSON.stringify(stockData))

    if (image && image instanceof File) {
      formData.append('image', image)
    }

    await axiosInstance.post('/Stock/addStock', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log(" Stock créé avec succès")

  } catch (error: any) {
    console.error(" Erreur createStock:", error)
    throw new Error(error.response?.data?.message || 'Erreur lors de la création du stock')
  }
}