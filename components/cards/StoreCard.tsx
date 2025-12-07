import { Magasin } from '@/Types/Magasin';
import { MapPin, Star, Verified } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface StoreCardProps {
    store: Magasin;
    onPress: () => void;
}

export default function StoreCard({ store, onPress }: StoreCardProps) {
    const magasin = store;

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
            {/* Image avec overlay */}
            <View className="relative h-28">
                <Image
                    source={{ uri: magasin.photo }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Informations sur l'image */}
                <View className="absolute bottom-3 left-3 right-3">
                    <View className="flex-row items-center gap-2">
                        <Text className="font-bold text-white text-sm flex-1">
                            {magasin.nomMagasin}
                        </Text>
                        {<Verified size={16} color="#22C55E" />}
                    </View>
                    {/* <Text className="text-white/80 text-xs">{magasin.acteur.typeActeur}</Text> */}
                </View>
            </View>

            {/* Détails du magasin */}
            <View className="p-3">
                <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                        <Star size={14} color="#22C55E" fill="#22C55E" />
                        <Text className="font-bold text-gray-800 text-sm ml-1">
                            {magasin.nbreView}
                        </Text>
                        <Text className="text-gray-500 text-xs ml-1">
                            ({magasin.nbreView} avis)
                        </Text>
                    </View>

                    {/* <Badge variant="secondary" className="bg-orange-500/10">
                        <Text className="text-orange-600 text-xs">{products} produits</Text>
                    </Badge> */}
                </View>

                {/* Localisation */}
                <View className="flex-row items-center gap-1">
                    <MapPin size={12} color="#64748B" />
                    <Text className="text-gray-500 text-xs">{magasin.localiteMagasin}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}