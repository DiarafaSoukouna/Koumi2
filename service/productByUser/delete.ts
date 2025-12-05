import axiosInstance from "@/constants/axiosInstance"

export const deleteStock = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/Stock/deleteStocks/${id}`)
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du stock')
  }
}