import axiosInstance from "@/constants/axiosInstance";
import { Intrant } from "@/Types/consumer";

const getProductsByFiliere = async (libelleFiliere: string): Promise<Intrant[]> => {
  try {
    const response = await axiosInstance.get(
      `/intrant/getAllIntrantByFiliere/${encodeURIComponent(libelleFiliere)}`
    )
    // console.log("Response from getProductsByFiliere:", response)
    return response.data
  } catch (error) {
    throw error
  }
}

export default getProductsByFiliere
