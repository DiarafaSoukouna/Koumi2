import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StatusIndicatorProps {
    icon: LucideIcon;
    color: string;
    bgColor: string;
    text: string;
    count: number;
    onPress?: () => void;
    showChevron?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
    icon: Icon,
    color,
    bgColor,
    text,
    count,
    onPress,
    showChevron = false
}) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            className="flex-row items-center p-3 bg-gray-50 rounded-xl mb-2 active:opacity-90"
            disabled={!onPress}
        >
            <View
                className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                style={{ backgroundColor: bgColor }}
            >
                <Icon size={18} color={color} />
            </View>
            <View className="flex-1">
                <Text className="text-gray-800 text-sm font-medium">{text}</Text>
            </View>
            <View className="flex-row items-center">
                <Text className="text-gray-800 font-bold text-lg mr-2">{count}</Text>
                {showChevron && (
                    <View className="opacity-50">
                        <Icon
                            name="chevron-right"
                            size={16}
                            color="#64748B"
                        />
                    </View>
                )}
            </View>
        </Container>
    );
};