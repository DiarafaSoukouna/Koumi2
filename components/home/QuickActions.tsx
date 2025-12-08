import { HelpCircle, Percent, TrendingUp, Truck } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const iconMap = {
    Percent,
    TrendingUp,
    Truck,
    HelpCircle,
};

interface QuickAction {
    id: number;
    icon: keyof typeof iconMap;
    label: string;
    color: string;
}

interface QuickActionsProps {
    actions: QuickAction[];
    onActionPress: (action: QuickAction) => void;
}

export default function QuickActions({
    actions,
    onActionPress,
}: QuickActionsProps) {
    return (
        <View className="bg-gray-100 rounded-2xl p-4">
            <Text className="text-base font-bold text-gray-800 mb-3">
                Actions Rapides
            </Text>

            <View className="grid grid-cols-4 gap-3">
                {actions.map((action) => {
                    const Icon = iconMap[action.icon];

                    return (
                        <TouchableOpacity
                            key={action.id}
                            onPress={() => onActionPress(action)}
                            className="items-center gap-2"
                        >
                            <View
                                style={{ backgroundColor: action.color }}
                                className="w-12 h-12 rounded-2xl items-center justify-center shadow-sm"
                            >
                                <Icon size={20} color="white" />
                            </View>
                            <Text className="text-gray-800 text-xs font-medium">
                                {action.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}