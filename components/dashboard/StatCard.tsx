import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = '#079C48',
  subtitle,
  onPress
}) => (
  <TouchableOpacity className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 min-h-[120px]"
    onPress={onPress}>
    <View className="flex-row items-center mb-3">
      <View className="w-10 h-10 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: `${color}15` }}>
        <Icon size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text className="font-bold text-gray-800 text-xl">
          {value}
        </Text>
        <Text className="text-gray-500 text-sm">{title}</Text>
      </View>
    </View>
    {subtitle && (
      <Text className="text-gray-400 text-xs mt-1">{subtitle}</Text>
    )}
  </TouchableOpacity>
);