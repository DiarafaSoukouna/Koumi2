import axiosInstance from "@/constants/axiosInstance";

const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get('/Stock/getAllStocks');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getAllProducts;