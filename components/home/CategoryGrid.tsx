import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Category {
    id: number;
    name: string;
    icon: React.ComponentType<any>;
    color: string;
    count: number;
}

interface CategoryGridProps {
    categories: Category[];
    onCategoryPress: (category: Category) => void;
}

export default function CategoryGrid({
    categories,
    onCategoryPress,
}: CategoryGridProps) {
    return (
        <View>
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold text-gray-800">Catégories</Text>
                <TouchableOpacity className="flex-row items-center">
                    <Text className="text-yellow-500 text-sm font-semibold mr-1">
                        Tout voir
                    </Text>
                    <ChevronRight size={16} color="#eab308" />
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <TouchableOpacity
                                key={category.id}
                                onPress={() => onCategoryPress(category)}
                                className="items-center min-w-[80px]"
                            >
                                <View
                                    style={{ backgroundColor: category.color }}
                                    className="w-16 h-16 rounded-2xl items-center justify-center shadow-sm"
                                >
                                    <Icon size={28} color="white" />
                                </View>
                                <Text className="text-gray-800 text-xs text-center mt-2 font-medium">
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}