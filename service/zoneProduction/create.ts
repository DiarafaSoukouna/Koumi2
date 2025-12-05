import axiosInstance from "@/constants/axiosInstance";
import { CreateZoneProductionData } from "@/Types/merchantType";

export const createZoneProduction = async (data: CreateZoneProductionData): Promise<void> => {

  try {
    const formData = new FormData()

    const { image, ...RestDatazonPro } = data

    formData.append('zone', JSON.stringify(RestDatazonPro))

    if (image && image instanceof File) {
      formData.append('image', image)
    }
    console.log("donne ", formData)
    await axiosInstance.post('/ZoneProduction/addZoneProduction', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })

    console.log('zone de production creer avec succes')

  } catch (error) {
    console.error(" error lors des la creation ", error)
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de la zone')
  }

}