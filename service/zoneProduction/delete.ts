import axiosInstance from "@/constants/axiosInstance";

export const deleteZoneProduction = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/ZoneProduction/deleteZones/${id}`)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la zone de production')
  }
}