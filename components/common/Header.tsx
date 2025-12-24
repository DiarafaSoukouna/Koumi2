import { useAuth } from "@/context/auth";
import { Bell, LogIn, User } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title?: string;
  location?: string;
  cartCount?: number;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onConnecterPress?: () => void;
  onLocationPress?: () => void;
}

export default function Header({
  title = "KOUMI",
  location = "Yaoundé, Cameroun",
  cartCount = 0,
  notificationCount = 0,
  onNotificationPress = () => {},
  onConnecterPress = () => {},
  onLocationPress = () => {},
}: HeaderProps) {
  const { user, isInitializing } = useAuth();

  // Fonction pour tronquer le nom de manière sécurisée
  const getTruncatedName = () => {
    // Pendant le chargement initial
    if (isInitializing) {
      return "Chargement...";
    }

    // Si pas d'utilisateur
    if (!user) {
      return title;
    }

    // Récupérer le nom complet
    const fullName = user.nomActeur || user.username || "Utilisateur";

    // Si le nom est trop long, tronquer à 5 caractères + "..."
    if (fullName.length > 10) {
      return fullName.substring(0, 10) + "...";
    }

    return fullName;
  };

  return (
    <View className="bg-gradient-to-b from-white to-orange-50 px-4 pt-4 pb-3 border-b border-orange-100">
      {/* Ligne supérieure avec logo et notifications */}
      <View className="flex-row items-center justify-between mb-3">
        {/* Logo et titre */}
        <View className="flex-row items-center">
          <View className="bg-gradient-to-br from-white to-orange-50 p-3 rounded-2xl shadow-md shadow-orange-100 border border-orange-100">
            <Image
              source={require("@/assets/images/logoKoumi.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
              className="rounded-lg"
            />
          </View>
          <View className="ml-3">
            <Text className="text-2xl font-bold text-gray-900">
              {getTruncatedName()}
            </Text>
          </View>
        </View>

        {/* Icônes de droite - Affichage conditionnel selon la connexion */}
        <View className="flex-row items-center">
          {user ? (
            // Utilisateur connecté : afficher notifications + profil
            <>
              {/* Bouton Notification */}
              <TouchableOpacity
                onPress={onNotificationPress}
                className="relative mr-3"
                activeOpacity={0.7}
              >
                <View className="bg-white p-2.5 rounded-xl shadow-sm shadow-orange-100 border border-orange-100">
                  <Bell size={22} color="#374151" />
                </View>
                {notificationCount > 0 && (
                  <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center border border-white">
                    <Text className="text-white text-xs font-bold">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Bouton Profil */}
              <TouchableOpacity
                onPress={onConnecterPress}
                className="p-2.5 rounded-xl shadow-sm border bg-gradient-to-r from-orange-100 to-yellow-50 border-orange-200"
                activeOpacity={0.7}
              >
                <User size={22} color="#EA580C" />
                <View className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 border-2 border-white" />
              </TouchableOpacity>
            </>
          ) : (
            // Utilisateur non connecté : afficher uniquement le bouton "Se connecter"
            <TouchableOpacity
              onPress={onConnecterPress}
              className="flex-row items-center bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 rounded-xl shadow-sm border border-orange-400"
              activeOpacity={0.7}
            >
              <LogIn size={20} color="white" className="mr-2" />
              <Text className="text-white font-medium text-sm">
                Se connecter
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Badge Panier (optionnel, seulement si utilisateur connecté) */}
      {user && cartCount > 0 && (
        <View className="absolute top-14 right-16 z-10">
          <View className="bg-orange-500 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">
              {cartCount > 9 ? "9+" : cartCount}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
