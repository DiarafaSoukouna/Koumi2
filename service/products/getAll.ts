import axiosInstance from "@/constants/axiosInstance";

const getAllProducts = async (page: number = 0, size: number = 10) => {
  try {
    const response = await axiosInstance.get(`/Stock/listeStock?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getAllProducts;