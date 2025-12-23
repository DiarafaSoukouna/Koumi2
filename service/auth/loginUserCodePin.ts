import axiosInstance from "@/constants/axiosInstance";
import { loginType } from "@/Types/authtype";

export const loginUserCodePin = async (data: loginType): Promise<any> => {
    try {
        // Pour un GET, on utilise l'objet 'params' pour les Query Parameters
        const response = await axiosInstance.get("/acteur/pinLogin", {
            params: {
                codeActeur: data.codeActeur,
                password: data.password
            }
        });

        console.log("Login réussi", response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur login:", error);
        throw error;
    }
};