import { Camera, Image as ImageIcon, Upload, X } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ImagePickerSectionProps {
    imagePreview: string;
    onPickImage: () => Promise<void>;
    onTakePhoto: () => Promise<void>;
    onRemoveImage: () => void;
    title?: string;
    description?: string;
    maxSize?: number; // en MB
    aspectRatio?: [number, number]; // [width, height]
    containerClassName?: string;
}

export const ImagePickerSection: React.FC<ImagePickerSectionProps> = ({
    imagePreview,
    onPickImage,
    onTakePhoto,
    onRemoveImage,
    title = 'Photo',
    description = 'PNG, JPG max 5MB',
    maxSize = 5,
    aspectRatio = [4, 3],
    containerClassName = '',
}) => {
    const [width, height] = aspectRatio;

    return (
        <View className={`mb-4 ${containerClassName}`}>
            <Text className="text-gray-700 font-medium text-sm mb-2">
                {title}
            </Text>

            {imagePreview ? (
                <View className="relative">
                    <Image
                        source={{ uri: imagePreview }}
                        className={`w-full rounded-lg`}
                        style={{
                            aspectRatio: width / height,
                            resizeMode: 'cover'
                        }}
                    />
                    <TouchableOpacity
                        onPress={onRemoveImage}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full items-center justify-center"
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    >
                        <X size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-gray-500 text-xs mt-1 text-center">
                        Touchez pour changer
                    </Text>
                </View>
            ) : (
                <>
                    <TouchableOpacity
                        onPress={onPickImage}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center bg-gray-50 active:bg-gray-100"
                        activeOpacity={0.7}
                    >
                        <ImageIcon size={40} color="#94A3B8" className="mb-2" />
                        <Text className="text-gray-600 text-center">
                            {`Ajouter une ${title.toLowerCase()}\n`}
                            <Text className="text-gray-400 text-xs">
                                {description}
                            </Text>
                        </Text>
                    </TouchableOpacity>

                    <View className="flex-row gap-2 mt-3">
                        <TouchableOpacity
                            onPress={onPickImage}
                            className="flex-1 bg-gray-100 rounded-lg py-2 items-center flex-row justify-center"
                            activeOpacity={0.7}
                        >
                            <Upload size={18} color="#64748B" className="mr-2" />
                            <Text className="text-gray-700 font-medium">Galerie</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onTakePhoto}
                            className="flex-1 bg-primary/10 rounded-lg py-2 items-center flex-row justify-center"
                            activeOpacity={0.7}
                        >
                            <Camera size={18} color="#079C48" className="mr-2" />
                            <Text className="text-primary font-medium">Caméra</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};