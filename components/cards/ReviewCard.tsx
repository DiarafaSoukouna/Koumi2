import { Flag, Star, ThumbsUp } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ReviewCardProps {
    review: {
        id: number;
        author?: string;
        user?: string;
        rating: number;
        comment: string;
        date: string;
        avatar: string;
        helpful?: number;
    };
    onHelpfulPress: () => void;
    onReportPress: () => void;
}

export default function ReviewCard({ review, onHelpfulPress, onReportPress }: ReviewCardProps) {
    const author = review.author || review.user;

    return (
        <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center gap-3">
                    <Image
                        source={{ uri: review.avatar }}
                        className="w-10 h-10 rounded-full"
                        resizeMode="cover"
                    />
                    <View>
                        <Text className="font-medium text-gray-800 text-sm">{author}</Text>
                        <Text className="text-gray-500 text-xs">{review.date}</Text>
                    </View>
                </View>

                <View className="flex-row gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                            key={i}
                            size={12}
                            color={i <= review.rating ? "#F59E0B" : "#D1D5DB"}
                            fill={i <= review.rating ? "#F59E0B" : "transparent"}
                        />
                    ))}
                </View>
            </View>

            <Text className="text-gray-600 text-sm leading-relaxed mb-3">{review.comment}</Text>

            <View className="flex-row items-center justify-between">
                {review.helpful !== undefined && (
                    <TouchableOpacity
                        onPress={onHelpfulPress}
                        className="flex-row items-center gap-1"
                    >
                        <ThumbsUp size={14} color="#64748B" />
                        <Text className="text-gray-500 text-xs">Utile ({review.helpful})</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={onReportPress}
                    className="flex-row items-center gap-1"
                >
                    <Flag size={14} color="#64748B" />
                    <Text className="text-gray-500 text-xs">Signaler</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}