import axiosInstance from "@/constants/axiosInstance";
import { Unite } from "@/Types/Unite";

export const getAllUnite = async () => {
    try {
        const { data } = await axiosInstance.get('/Unite/getAllUnite');
        return data as Unite[];
    } catch (error) {
        throw error;
    }
}