import axiosInstance from '../../constants/axiosInstance'

export async function getSpeculations() {
  try {
    const { data } = await axiosInstance.get('/Speculation/getAllSpeculation')
    return data
  } catch (error: any) {
    console.log('Speculation fetch error:', error?.response?.data)
    throw error
  }
}
