import axiosInstance from "@/constants/axiosInstance";

export const deleteTransporteur = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/vehicule/delete/${id}`)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du transporteur')
  }
}