import { Bell, MapPin, User } from "lucide-react-native";
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
            <Text className="text-2xl font-bold text-gray-900">{title}</Text>
            <TouchableOpacity
              onPress={onLocationPress}
              className="flex-row items-center mt-1"
              activeOpacity={0.7}
            >
              <MapPin size={14} color="#EA580C" />
              <Text className="text-orange-600 text-sm ml-1 font-medium">
                {location}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Icônes de droite */}
        <View className="flex-row items-center space-x-3 gap-4">
          {/* Bouton Notification */}
          <TouchableOpacity
            onPress={onNotificationPress}
            className="relative"
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

          {/* Bouton Connexion/Profil */}
          <TouchableOpacity
            onPress={onConnecterPress}
            className="bg-gradient-to-r from-orange-100 to-yellow-50 p-2.5 rounded-xl shadow-sm shadow-orange-100 border border-orange-200"
            activeOpacity={0.7}
          >
            <User size={22} color="#EA580C" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Badge Panier (optionnel si vous avez un panier) */}
      {cartCount > 0 && (
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
