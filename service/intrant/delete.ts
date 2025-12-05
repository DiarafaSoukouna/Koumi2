import axiosInstance from "@/constants/axiosInstance";

export const deleteIntrant = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/intrant/delete/${id}`)
        console.log("Intrant supprimé avec succès")
    } catch (error: any) {
        console.error("Erreur delete intrant:", error)
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'intrant')
    }
}