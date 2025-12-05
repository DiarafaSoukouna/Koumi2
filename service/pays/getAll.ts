import axiosInstance from "@/constants/axiosInstance";
import { Pays } from "@/Types/pays";

export const getAllPays = async () => {
    try {
        const { data } = await axiosInstance.get('/pays/read');
        return data as Pays[];
    } catch (error) {
        throw error;
    }
}