import axiosInstance from '../../constants/axiosInstance'

export async function getTypesActeurs() {
  try {
    const { data } = await axiosInstance.get('/typeActeur/read')
    return data
  } catch (error: any) {
    console.log('Types Acteurs fetch error:', error?.response?.data)
    throw error
  }
}
