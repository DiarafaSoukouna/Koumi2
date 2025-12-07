import { Sparkles, Truck, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const iconMap = {
    Zap,
    Sparkles,
    Truck,
};

interface Promotion {
    id: number;
    title: string;
    subtitle: string;
    bgColor: string;
    icon: keyof typeof iconMap;
    image: string;
}

interface PromotionCarouselProps {
    promotions: Promotion[];
    onPromotionPress: (promotion: Promotion) => void;
}

export default function PromotionCarousel({
    promotions,
    onPromotionPress,
}: PromotionCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / 280);
                    setActiveIndex(index);
                }}
            >
                {promotions.map((promo) => {
                    const Icon = iconMap[promo.icon];

                    return (
                        <TouchableOpacity
                            key={promo.id}
                            onPress={() => onPromotionPress(promo)}
                            className="mr-3"
                            style={{ width: 280 }}
                        >
                            <View
                                style={{ backgroundColor: promo.bgColor }}
                                className="rounded-2xl p-4 min-h-[120px] shadow-md"
                            >
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                        <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center mb-2">
                                            <Icon size={20} color="white" />
                                        </View>
                                        <Text className="text-white text-lg font-bold mb-1">
                                            {promo.title}
                                        </Text>
                                        <Text className="text-white/90 text-sm">
                                            {promo.subtitle}
                                        </Text>
                                        <TouchableOpacity className="bg-white px-3 py-1.5 rounded-full mt-2 self-start">
                                            <Text className="text-orange-600 text-xs font-bold">
                                                Découvrir
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Image
                                        source={{ uri: promo.image }}
                                        className="w-20 h-20 rounded-full opacity-20"
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View className="flex-row justify-center gap-2 mt-3">
                {promotions.map((_, index) => (
                    <View
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === activeIndex ? 'bg-green-500 w-4' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </View>
        </View>
    );
}