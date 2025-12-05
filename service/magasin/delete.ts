import axiosInstance from "@/constants/axiosInstance"

export const deleteMagasin = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/Magasin/delete/${id}`)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du magasin')
  }
}