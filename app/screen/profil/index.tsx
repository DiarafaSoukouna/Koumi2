import { useAuth } from "@/context/auth";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Building,
  Mail,
  MapPin,
  Phone,
  Shield,
  User as UserIcon,
} from "lucide-react-native";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilPage() {
  const { user, logout } = useAuth();

  // Si pas d'utilisateur connecté
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-6 py-12">
          {/* Icône principale */}
          <View className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl items-center justify-center mb-8">
            <AntDesign name="user" size={32} color="black" />
          </View>

          {/* Titre principal */}
          <Text className="text-3xl font-bold text-gray-800 text-center mb-4 px-8 leading-tight">
            Aucun utilisateur
          </Text>
          <Text className="text-3xl font-bold text-gray-800 text-center mb-2 px-8 leading-tight">
            connecté
          </Text>

          {/* Sous-titre */}
          <Text className="text-lg text-gray-500 text-center mb-8 px-12 leading-relaxed">
            Connectez-vous pour accéder à votre profil et gérer vos informations
          </Text>

          {/* Boutons d'action */}
          <View className="w-full max-w-sm space-y-3">
            <Pressable
              className="bg-gradient-to-r from-orange-500 to-orange-600 py-4 px-6 rounded-2xl items-center"
              onPress={() => router.push("/screen/(auth)/login")}
            >
              <Text className="text-black font-semibold text-lg">
                Se connecter
              </Text>
            </Pressable>

            <Pressable
              className="bg-white/80 border-2 border-orange-200 py-4 px-6 rounded-2xl items-center shadow-md backdrop-blur-sm"
              onPress={() => router.push("/screen/(auth)/register")}
            >
              <Text className="text-orange-600 font-semibold text-lg">
                Créer un compte
              </Text>
            </Pressable>
          </View>

          {/* Animation décorative */}
          <View className="absolute top-20 left-8 w-20 h-20 bg-orange-200/50 rounded-full blur-xl" />
          <View className="absolute bottom-32 right-12 w-24 h-24 bg-blue-200/30 rounded-full blur-xl" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        {/* <View className="w-full flex flex-row justify-between items-center px-5 py-3">
          <Pressable
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
            onPress={() => console.log("Retour")}
          >
            <ChevronLeft size={22} color="#374151" />
          </Pressable>
          <Text className="text-lg font-semibold text-gray-800">
            Mon Profil
          </Text>
          <Pressable
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
            onPress={() => console.log("Paramètres")}
          >
            <Settings size={22} color="#374151" />
          </Pressable>
        </View> */}

        {/* Avatar et nom */}
        {/* Section Types d'acteur - Améliorée */}
        <View className="items-center mt-4">
          <View className="w-28 h-28 rounded-full overflow-hidden border-4 border-orange-400 shadow-lg bg-orange-100 items-center justify-center">
            {user.logoActeur ? (
              <Image
                source={{ uri: user.logoActeur }}
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
            ) : (
              <UserIcon size={60} color="#f97316" />
            )}
          </View>
          <Text className="text-2xl font-bold text-gray-800 mt-4">
            {user.nomActeur || "Utilisateur"}
          </Text>

          {/* AFFICHAGE DE TOUS LES TYPES D'ACTEURS */}
          {user.typeActeur && user.typeActeur.length > 0 ? (
            <View className="flex-row flex-wrap justify-center gap-2 mt-3 max-w-xs">
              {user.typeActeur.map((type, index) => (
                <View
                  key={index}
                  className={`
            px-4 py-2 rounded-full border
            ${
              index % 3 === 0
                ? "bg-orange-50 border-orange-200"
                : index % 3 === 1
                  ? "bg-green-50 border-green-200"
                  : "bg-blue-50 border-blue-200"
            }
          `}
                >
                  <Text
                    className={`
            font-medium text-sm
            ${
              index % 3 === 0
                ? "text-orange-700"
                : index % 3 === 1
                  ? "text-green-700"
                  : "text-blue-700"
            }
          `}
                  >
                    {type.libelle}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-gray-100 px-4 py-2 rounded-full mt-3">
              <Text className="text-gray-600 font-medium">
                Aucun type défini
              </Text>
            </View>
          )}

          {user.codeActeur && (
            <View className="bg-gray-100 px-4 py-2 rounded-full mt-3">
              <Text className="text-gray-600 text-sm">
                Code: {user.codeActeur}
              </Text>
            </View>
          )}
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
            {/* Email */}
            <View className="flex flex-row items-center mb-4">
              <View className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4">
                <Mail size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-xs text-gray-400">Email</Text>
                <Text className="text-gray-700">
                  {user.emailActeur || "Non spécifié"}
                </Text>
              </View>
            </View>

            {/* Téléphone */}
            <View className="flex flex-row items-center mb-4">
              <View className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4">
                <Phone size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-xs text-gray-400">Téléphone</Text>
                <Text className="text-gray-700">
                  {user.telephoneActeur || "Non spécifié"}
                </Text>
              </View>
            </View>

            {/* WhatsApp (si disponible) */}
            {user.whatsAppActeur && (
              <View className="flex flex-row items-center mb-4">
                <View className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-4">
                  <Phone size={20} color="#10B981" />
                </View>
                <View>
                  <Text className="text-xs text-gray-400">WhatsApp</Text>
                  <Text className="text-gray-700">{user.whatsAppActeur}</Text>
                </View>
              </View>
            )}

            {/* Adresse */}
            <View className="flex flex-row items-center mb-4">
              <View className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4">
                <MapPin size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-xs text-gray-400">Adresse</Text>
                <Text className="text-gray-700">
                  {user.adresseActeur || "Non spécifié"}
                </Text>
              </View>
            </View>

            {/* Localité */}
            <View className="flex flex-row items-center mb-4">
              <View className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4">
                <Building size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-xs text-gray-400">Localité</Text>
                <Text className="text-gray-700">
                  {user.localiteActeur && user.niveau3PaysActeur
                    ? `${user.localiteActeur}, ${user.niveau3PaysActeur}`
                    : "Non spécifié"}
                </Text>
              </View>
            </View>

            {/* Username */}
            <View className="flex flex-row items-center">
              <View className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mr-4">
                <UserIcon size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-xs text-gray-400">Username</Text>
                <Text className="text-gray-700">
                  @{user.username || "utilisateur"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Spéculations */}
        {user.speculation && user.speculation.length > 0 && (
          <View className="mx-5 mt-8">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Spécialisations
            </Text>
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <View className="flex-row flex-wrap">
                {user.speculation.map((spec, index) => (
                  <View
                    key={index}
                    className="bg-orange-50 px-3 py-2 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-orange-700 text-sm">
                      {spec.nomSpeculation}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Informations système */}
        <View className="mx-5 mt-8 mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Informations système
          </Text>
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex flex-row items-center mb-4">
              <View className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                <Shield size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-400">Statut du compte</Text>
                <Text className="text-gray-700">
                  {user.statutActeur ? "Actif" : "Inactif"}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  user.statutActeur ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <Text
                  className={`text-xs ${
                    user.statutActeur ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {user.statutActeur ? "✓ Actif" : "✗ Inactif"}
                </Text>
              </View>
            </View>

            <View className="flex flex-row items-center mb-4">
              <View className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mr-4">
                <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
              </View>
              <View>
                <Text className="text-xs text-gray-400">
                  Date d'inscription
                </Text>
                <Text className="text-gray-700">
                  {user.dateAjout
                    ? new Date(user.dateAjout).toLocaleDateString("fr-FR")
                    : "Non spécifié"}
                </Text>
              </View>
            </View>

            {user.dateModif && (
              <View className="flex flex-row items-center">
                <View className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-4">
                  <Ionicons name="time-outline" size={20} color="#6B7280" />
                </View>
                <View>
                  <Text className="text-xs text-gray-400">
                    Dernière modification
                  </Text>
                  <Text className="text-gray-700">
                    {new Date(user.dateModif).toLocaleDateString("fr-FR")}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Bouton de déconnexion */}
        <View className="mx-5">
          <TouchableOpacity
            className="bg-red-50 border border-red-200 rounded-2xl py-4 flex items-center justify-center"
            onPress={() => logout()}
          >
            <Text className="text-red-600 font-semibold">Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
