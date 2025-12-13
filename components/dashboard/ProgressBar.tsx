import React from 'react';
import { Text, View } from 'react-native';

interface ProgressBarProps {
    percentage: number;
    color?: string;
    label: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    percentage,
    color = '#079C48',
    label
}) => (
    <View className="mb-3">
        <View className="flex-row items-center justify-between mb-1">
            <Text className="text-gray-600 text-sm">{label}</Text>
            <Text className="text-gray-800 font-medium">{percentage}%</Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full rounded-full" style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: color
            }} />
        </View>
    </View>
);