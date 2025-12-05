import axiosInstance from "@/constants/axiosInstance";
import { CreateZoneProductionData } from "@/Types/merchantType";

export const updateZoneProduction = async (id: string, data: Partial<CreateZoneProductionData>): Promise<void> => {
  try {
    const formData = new FormData()

    const { image, ...restDataZoneProduction } = data

    const ZoneProductionPayLoad = {
      ...restDataZoneProduction,
      idZoneProduction: id
    }

    formData.append('zone', JSON.stringify(ZoneProductionPayLoad))

    if (image && image instanceof File) {
      formData.append('image', image)
    }

    await axiosInstance.put(`/ZoneProduction/updateZoneProduction/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })

    console.log('zone de production modifier avec succes')

  } catch (error) {
    console.error("error lors de la modification", error)
    throw new Error(error.response?.data?.message || 'Erreur lors de la modification')
  }
}