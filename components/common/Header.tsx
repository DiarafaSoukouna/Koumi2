import { Bell, User } from "lucide-react-native";
import React from "react";
import { Image, View } from "react-native"; // Ajoutez Image ici
import IconButton from "./IconButton";

interface HeaderProps {
  title: string;
  location: string;
  cartCount: number;
  notificationCount: number;
  onNotificationPress: () => void;
  onConnecterPress: () => void;
}

export default function Header({
  title,
  location,
  cartCount,
  notificationCount,
  onNotificationPress,
  onConnecterPress,
}: HeaderProps) {
  return (
    <View className="bg-white px-4 pt-4 pb-3 border-b border-gray-200">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-16 h-16 rounded-xl items-center justify-center mr-2 overflow-hidden">
            <Image
              source={require("@/assets/images/logoKoumi.png")}
              style={{ width: 48, height: 48, tintColor: "black" }}
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="flex-row items-center">
          <IconButton
            icon={Bell}
            badgeCount={notificationCount}
            onPress={onNotificationPress}
            color="#64748B"
          />
          <IconButton icon={User} onPress={onConnecterPress} color="#64748B" />
        </View>
      </View>
    </View>
  );
}
