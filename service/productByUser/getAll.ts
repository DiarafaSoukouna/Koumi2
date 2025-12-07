import axiosInstance from '@/constants/axiosInstance'
import { Stock } from '@/Types/Stock'


export const getAllStocks = async (): Promise<Stock[]> => {
    try {
        const response = await axiosInstance.get("/Stock/getAllStocks")
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des stocks')
    }
}