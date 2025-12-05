import axiosInstance from "@/constants/axiosInstance";
import { CreateStockData } from "@/Types/merchantType";

export const updateStock = async (id: string, data: Partial<CreateStockData>): Promise<void> => {
    try {
        const formData = new FormData()

        const { image, ...productData } = data

        const productPayLoad = {
            ...productData,
            idStock: id
        }

        formData.append('stock', JSON.stringify(productPayLoad))

        if (image && image instanceof File) {
            formData.append('image', image)
        }

        await axiosInstance.put(`Stock/updateStock/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        console.log("produit mis a jour avec succes")

    } catch (error: any) {
        console.error("erreur update produit", error)
        throw new Error(error.response?.data?.message || 'Erreur lors de la modification du produit')
    }
}