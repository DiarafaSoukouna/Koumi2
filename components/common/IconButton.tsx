import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface IconButtonProps {
    icon: LucideIcon;
    badgeCount?: number;
    onPress: () => void;
    color?: string;
    size?: number;
}

export default function IconButton({
    icon: Icon,
    badgeCount = 0,
    onPress,
    color = '#64748B',
    size = 24,
}: IconButtonProps) {
    return (
        <TouchableOpacity
            className="relative p-2"
            onPress={onPress}
        >
            <Icon size={size} color={color} />
            {badgeCount > 0 && (
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">{badgeCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}