
import axiosInstance from "@/constants/axiosInstance";

const getAllStocksByFiliere = async (libelleFiliere: string) => {
  try {
    const response = await axiosInstance.get(`/Stock/getAllStocksByFiliere/${libelleFiliere}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getAllStocksByFiliere;