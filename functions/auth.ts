import AsyncStorage from '@react-native-async-storage/async-storage'
import axiosInstance from '../constants/axiosInstance'

export interface loginType {
  username: string
  password: string
}
export interface RegisterValues {
  nomActeur: string
  username: string
  adresseActeur: string
  telephoneActeur: string
  niveau3PaysActeur: string
  localiteActeur: string
  password: string
  speculation: {
    idSpeculation: string
  }[]
  typeActeur: {
    idTypeActeur: string
  }[]
}
export async function loginUser(data: loginType) {
  try {
    const response = await axiosInstance.post('/auth/pinLogin', data)

    if (response.data) {
      await AsyncStorage.setItem('userAuth', 'true')
      await AsyncStorage.setItem('userData', JSON.stringify(response.data))
    }

    return response.data
  } catch (error: any) {
    console.log('Login error:', error?.response?.data)
  }
}
export async function logoutUser() {
  try {
    await AsyncStorage.removeItem('userAuth')
    await AsyncStorage.removeItem('userData')
  } catch (error) {
    throw error
  }
}
export async function register(data: RegisterValues) {
  try {
    const response = await axiosInstance.post('/acteur/create', data)
    if (response.data) {
      await AsyncStorage.setItem('userAuth', 'true')
      await AsyncStorage.setItem('userData', JSON.stringify(response.data))
    }
    return response.data
  } catch (error) {
    throw error
  }
}
export async function registerUser(data: RegisterValues) {
  try {
    const response = await axiosInstance.post(`/acteur/create?acteur=${data}`)
    if (response.data) {
      await AsyncStorage.setItem('userAuth', 'true')
      await AsyncStorage.setItem('userData', JSON.stringify(response.data))
    }
    return response.data
  } catch (error) {
    throw error
  }
}
