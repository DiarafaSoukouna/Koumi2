'use client'

import type React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'
import { useEffect, useState } from 'react'
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScrollingPage from './scrolling'

export default function Page() {
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched')

        if (alreadyLaunched === null) {
          setIsFirstTime(true)
          await AsyncStorage.setItem('alreadyLaunched', 'true')
        } else {
          setIsFirstTime(false)
        }

        setLoading(false)
      } catch (e) {
        console.log(e)
      }
    }

    checkFirstTime()
  }, [])

  if (loading) return null

  return (
    <View className="flex-1 bg-white">
      {isFirstTime ? <ScrollingPage /> : <LoginPage />}
    </View>
  )
}

const LoginPage = () => {
  const [valuesConnect, setValuesConnect] = useState({
    phone: '',
    password: '',
  })
  const [valuesRegister, setValuesRegister] = useState({
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    accountType: '',
    password: '',
    confirmPassword: '',
  })
  const [isRegistering, setIsRegistering] = useState(false)

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-orange-50 to-white">
      <ScrollView className="flex-1 px-6 ">
        {/* Header avec logo centré */}
        <View className="items-center mb-8">
          <View className="bg-white p-4 rounded-3xl shadow-lg shadow-orange-200">
            <Image
              source={require('@/assets/images/logo.png')}
              style={{ width: 140, height: 88 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-2xl font-bold mt-6 text-gray-800 text-center">
            Bienvenue sur Koumi 👋
          </Text>
        </View>

        {/* Formulaire */}
        <View className="flex-1">
          {isRegistering ? (
            <RegisterInputs
              values={valuesRegister}
              setValues={setValuesRegister}
            />
          ) : (
            <LoginInputs values={valuesConnect} setValues={setValuesConnect} />
          )}
        </View>

        {/* Boutons */}
        <View className="mt-5">
          <TouchableOpacity
            className="bg-orange-500 py-4 rounded-2xl shadow-lg shadow-orange-300"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-lg font-bold">
              {isRegistering ? 'Créer mon compte' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsRegistering(!isRegistering)}
            className="bg-gray-100 py-4 rounded-2xl mt-3 border border-gray-200"
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 text-center text-lg font-semibold">
              {isRegistering ? "J'ai déjà un compte" : 'Créer un compte'}
            </Text>
          </TouchableOpacity>

          {!isRegistering && (
            <TouchableOpacity className="mt-4" activeOpacity={0.7}>
              <Text className="text-orange-500 text-center text-base font-medium">
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

interface LoginValues {
  phone: string
  password: string
}

interface LoginInputsProps {
  values: LoginValues
  setValues: React.Dispatch<React.SetStateAction<LoginValues>>
}

const LoginInputs: React.FC<LoginInputsProps> = ({ values, setValues }) => {
  return (
    <View className="gap-4">
      <View>
        <Text className="text-gray-600 font-medium mb-2 ml-1">Téléphone</Text>
        <TextInput
          placeholder="Entrez votre numéro"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={values.phone}
          onChangeText={(text) => setValues({ ...values, phone: text })}
          className="bg-white border-2 border-gray-100 p-4 rounded-xl text-base text-gray-800"
          style={{ fontSize: 16 }}
        />
      </View>

      <View>
        <Text className="text-gray-600 font-medium mb-2 ml-1">
          Mot de passe
        </Text>
        <TextInput
          placeholder="Entrez votre mot de passe"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={values.password}
          onChangeText={(text) => setValues({ ...values, password: text })}
          className="bg-white border-2 border-gray-100 p-4 rounded-xl text-base text-gray-800"
          style={{ fontSize: 16 }}
        />
      </View>
    </View>
  )
}

interface RegisterValues {
  lastName: string
  firstName: string
  phone: string
  email: string
  accountType: string
  password: string
  confirmPassword: string
}

interface RegisterInputsProps {
  values: RegisterValues
  setValues: React.Dispatch<React.SetStateAction<RegisterValues>>
}

const RegisterInputs: React.FC<RegisterInputsProps> = ({
  values,
  setValues,
}) => {
  return (
    <View className="gap-3">
      {/* Nom et Prénom côte à côte */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Text className="text-gray-600 font-medium mb-2 ml-1">Nom</Text>
          <TextInput
            placeholder="Votre nom"
            placeholderTextColor="#9CA3AF"
            value={values.lastName}
            onChangeText={(text) => setValues({ ...values, lastName: text })}
            className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
            style={{ fontSize: 16 }}
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-600 font-medium mb-2 ml-1">Prénom</Text>
          <TextInput
            placeholder="Votre prénom"
            placeholderTextColor="#9CA3AF"
            value={values.firstName}
            onChangeText={(text) => setValues({ ...values, firstName: text })}
            className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
            style={{ fontSize: 16 }}
          />
        </View>
      </View>

      <View>
        <Text className="text-gray-600 font-medium mb-2 ml-1">Téléphone</Text>
        <TextInput
          placeholder="Numéro de téléphone"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={values.phone}
          onChangeText={(text) => setValues({ ...values, phone: text })}
          className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
          style={{ fontSize: 16 }}
        />
      </View>

      <View>
        <Text className="text-gray-600 font-medium mb-2 ml-1">Email</Text>
        <TextInput
          placeholder="votre@email.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={values.email}
          onChangeText={(text) => setValues({ ...values, email: text })}
          className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
          style={{ fontSize: 16 }}
        />
      </View>

      <View>
        <Text className="text-gray-600 font-medium mb-2 ml-1">
          Type de compte
        </Text>
        <View className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden">
          <Picker
            selectedValue={values.accountType}
            onValueChange={(itemValue) =>
              setValues({ ...values, accountType: itemValue })
            }
            style={{ height: 50 }}
          >
            <Picker.Item
              label="Sélectionnez un type"
              value=""
              color="#9CA3AF"
            />
            <Picker.Item label="🌾 Producteur" value="producer" />
            <Picker.Item label="⚙️ Transformateur" value="transformer" />
            <Picker.Item label="🏪 Magasin" value="store" />
          </Picker>
        </View>
      </View>

      <View>
        <Text className="text-gray-600 font-medium mb-2 ml-1">
          Mot de passe
        </Text>
        <TextInput
          placeholder="Créez un mot de passe"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={values.password}
          onChangeText={(text) => setValues({ ...values, password: text })}
          className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
          style={{ fontSize: 16 }}
        />
      </View>

      <View>
        <Text className="text-gray-600 font-medium mb-2 ml-1">
          Confirmation
        </Text>
        <TextInput
          placeholder="Confirmez le mot de passe"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={values.confirmPassword}
          onChangeText={(text) =>
            setValues({ ...values, confirmPassword: text })
          }
          className="bg-white border-2 border-gray-100 p-4 rounded-xl text-gray-800"
          style={{ fontSize: 16 }}
        />
      </View>
    </View>
  )
}
