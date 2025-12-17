import { Ionicons } from '@expo/vector-icons'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const magasins = [
  {
    id: 1,
    nom: 'Boulangerie du Coin',
    adresse: '12 Rue du Pain, Paris',
    image: require('@/assets/images/poissons.jpg'),
  },
  {
    id: 2,
    nom: 'Librairie Centrale',
    adresse: '45 Avenue des Livres, Lyon',
    image: require('@/assets/images/icon.png'),
  },
  {
    id: 3,
    nom: 'Fleuriste Jardin',
    adresse: '8 Place des Fleurs, Marseille',
    image: require('@/assets/images/magasin.jpg'),
  },
]

export default function ProfilPage() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="w-full flex flex-row justify-between items-center px-5 py-3">
          <Pressable className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Ionicons name="chevron-back" size={22} color="#374151" />
          </Pressable>
          <Text className="text-lg font-semibold text-gray-800">
            Mon Profil
          </Text>
          <Pressable className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Ionicons name="settings-outline" size={22} color="#374151" />
          </Pressable>
        </View>

        {/* Avatar et nom */}
        <View className="items-center mt-4">
          <View className="w-28 h-28 rounded-full overflow-hidden border-4 border-orange-400 shadow-lg">
            <Image
              source={require('@/assets/images/magasin.jpg')}
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mt-4">
            Diarafa Soukouna
          </Text>
          <View className="bg-orange-100 px-4 py-1 rounded-full mt-2">
            <Text className="text-orange-600 font-medium">Commerçant</Text>
          </View>
        </View>

        {/* Informations personnelles */}
        <View className="mx-5 mt-8">
          <View className="flex flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-800">
              Informations personnelles
            </Text>
            <Pressable className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
              <Ionicons name="create-outline" size={18} color="#f97316" />
            </Pressable>
          </View>
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex flex-row items-center mb-4">
              <View className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4">
                <Ionicons name="mail-outline" size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-xs text-gray-400">Email</Text>
                <Text className="text-gray-700">
                  diarafasoukouna@example.com
                </Text>
              </View>
            </View>
            <View className="flex flex-row items-center mb-4">
              <View className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4">
                <Ionicons name="call-outline" size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-xs text-gray-400">Téléphone</Text>
                <Text className="text-gray-700">+33 6 12 34 56 78</Text>
              </View>
            </View>
            <View className="flex flex-row items-center mb-4">
              <View className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4">
                <Ionicons name="location-outline" size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-xs text-gray-400">Adresse</Text>
                <Text className="text-gray-700">
                  123 Rue Exemple, Ville, Pays
                </Text>
              </View>
            </View>
            <View className="flex flex-row items-center">
              <View className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4">
                <Ionicons name="person-outline" size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-xs text-gray-400">Username</Text>
                <Text className="text-gray-700">@diarafasoukouna</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mes magasins */}
        <View className="mt-8 mb-8">
          <View className="flex flex-row justify-between items-center px-5 mb-4">
            <Text className="text-lg font-semibold text-gray-800">
              Mes magasins
            </Text>
            <Pressable className="flex flex-row items-center">
              <Text className="text-orange-500 font-medium mr-1">Ajouter</Text>
              <Ionicons name="add-circle" size={20} color="#f97316" />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {magasins.map((magasin) => (
              <Pressable
                key={magasin.id}
                className="w-56 bg-white rounded-2xl shadow-sm mr-4 overflow-hidden"
              >
                {/* Image du magasin */}
                <View className="w-full h-32">
                  <Image
                    source={magasin.image}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                    }}
                  />
                </View>

                {/* Infos du magasin */}
                <View className="p-3">
                  <Text
                    className="text-base font-semibold text-gray-800"
                    numberOfLines={1}
                  >
                    {magasin.nom}
                  </Text>
                  <View className="flex flex-row items-center mt-1">
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#9ca3af"
                    />
                    <Text
                      className="text-xs text-gray-400 ml-1"
                      numberOfLines={1}
                    >
                      {magasin.adresse}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}

            {/* Bouton ajouter un magasin */}
            <Pressable className="w-56 h-48 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
              <View className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <Ionicons name="add" size={24} color="#f97316" />
              </View>
              <Text className="text-sm text-gray-500 font-medium">
                Ajouter un magasin
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
