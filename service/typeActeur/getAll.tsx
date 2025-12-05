import axiosInstance from "@/constants/axiosInstance";
import { TYPE_ACTEUR_T } from "@/Types";

export default async () => {
    try {
        const { data } = await axiosInstance.get('/typeActeur/read');
        return data as TYPE_ACTEUR_T[];
    } catch (error) {
        return false;
    }
}