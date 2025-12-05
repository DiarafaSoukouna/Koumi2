import axiosInstance from "@/constants/axiosInstance";

const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get('Categorie/allCategorie');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getAllCategories;