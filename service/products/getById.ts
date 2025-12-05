import axiosInstance from '@/constants/axiosInstance'

export async function getProductById(id: string) {
  const { data } = await axiosInstance.get(`/products/${id}`)
  return data
}
