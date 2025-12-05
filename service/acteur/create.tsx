import axiosInstance from "@/constants/axiosInstance";

export default async ({

}) => {
    try {
        const { data } = await axiosInstance.postForm('/acteur/create');
        return data;
    } catch (error) {
        return false;
    }
}