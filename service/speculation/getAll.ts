import axiosInstance from "@/constants/axiosInstance";
import { Speculation } from "@/Types/merchantType";

export const getAllSpeculations = async (): Promise<Speculation[]> => {
  try {
    const response = await axiosInstance.get("/Speculation/getAllSpeculation");
    console.log("liste des spéculations", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des spéculations:", error);
    throw new Error(
      error.response?.data?.message ||
        "Erreur lors de la récupération des spéculations",
    );
  }
};
