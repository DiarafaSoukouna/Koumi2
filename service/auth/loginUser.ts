import axiosInstance from "@/constants/axiosInstance";
import { loginType } from "@/Types/authtype";

export const loginUser = async (data: loginType): Promise<any> => {
  try {
    // Envoyer les données en JSON, pas en FormData
    const response = await axiosInstance.post("/auth/login", {
      username: data.username,
      password: data.password
    });
    
    console.log("Login réussi", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur login:", error);
    throw error;
  }
};