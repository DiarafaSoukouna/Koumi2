import { Bell, Fish, MapPin, ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import IconButton from './IconButton';

interface HeaderProps {
    title: string;
    location: string;
    cartCount: number;
    notificationCount: number;
    onCartPress: () => void;
    onNotificationPress: () => void;
}

export default function Header({
    title,
    location,
    cartCount,
    notificationCount,
    onCartPress,
    onNotificationPress,
}: HeaderProps) {
    return (
        <View className="bg-white px-4 pt-4 pb-3 border-b border-gray-200">
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-green-500 rounded-xl items-center justify-center mr-2">
                        <Fish size={24} color="white" />
                    </View>
                    <View>
                        <Text className="text-lg font-bold text-gray-800">{title}</Text>
                        <View className="flex-row items-center">
                            <MapPin size={12} color="#64748B" />
                            <Text className="text-gray-500 text-xs ml-1">{location}</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row items-center">
                    <IconButton
                        icon={Bell}
                        badgeCount={notificationCount}
                        onPress={onNotificationPress}
                        color="#64748B"
                    />
                    <IconButton
                        icon={ShoppingCart}
                        badgeCount={cartCount}
                        onPress={onCartPress}
                        color="#64748B"
                    />
                </View>
            </View>
        </View>
    );
}