import axiosInstance from "@/constants/axiosInstance";

const getAllMagasin = async () => {
    try {
        const response = await axiosInstance.get('/Magasin/getAllMagagin');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default getAllMagasin;