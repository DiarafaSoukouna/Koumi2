import Badge from '@/components/common/Badge';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface ActorType {
    id: number;
    name: string;
    icon: string;
    count: number;
}

interface ActorTypesListProps {
    actorTypes: ActorType[];
    onActorTypePress: (type: ActorType) => void;
}

export default function ActorTypesList({
    actorTypes,
    onActorTypePress,
}: ActorTypesListProps) {
    return (
        <View className="bg-amber-50 rounded-2xl p-4 -mx-4 mb-4 mt-4">
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold text-gray-800">Types d'acteurs</Text>
                <TouchableOpacity className="flex-row items-center">
                    <Text className="text-yellow-500 text-sm font-semibold mr-1">
                        Tout voir
                    </Text>
                    <ChevronRight size={16} color="#eab308" />
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-4">
                    {actorTypes.map((type) => {
                        const isStringIcon = typeof type.icon === 'string';

                        return (
                            <TouchableOpacity
                                key={type.id}
                                onPress={() => onActorTypePress(type)}
                                className="items-center min-w-[72px]"
                            >
                                <View className="w-14 h-14 bg-yellow-500 rounded-2xl items-center justify-center shadow-sm">
                                    {isStringIcon ? (
                                        <Text className="text-2xl">{type.icon}</Text>
                                    ) : (
                                        <type.icon size={24} color="black" />
                                    )}
                                </View>
                                <Text className="text-gray-800 text-[11px] text-center mt-2 font-medium">
                                    {type.name}
                                </Text>
                                <Badge variant="secondary" className="mt-1">
                                    {type.count}
                                </Badge>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}