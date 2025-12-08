import React from 'react';
import { Text, View } from 'react-native';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
}

const variantStyles = {
    default: 'bg-green-500',
    secondary: 'bg-orange-500',
    destructive: 'bg-red-500',
    outline: 'bg-transparent border border-gray-300',
};

const textColors = {
    default: 'text-white',
    secondary: 'text-white',
    destructive: 'text-white',
    outline: 'text-gray-700',
};

export default function Badge({
    children,
    variant = 'default',
    className = '',
}: BadgeProps) {
    return (
        <View
            className={`px-2 py-1 rounded-full items-center justify-center ${variantStyles[variant]} ${className}`}
        >
            <Text className={`text-xs font-bold ${textColors[variant]}`}>
                {children}
            </Text>
        </View>
    );
}