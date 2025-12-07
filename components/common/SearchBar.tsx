import { Search } from 'lucide-react-native';
import React from 'react';
import { TextInput, View } from 'react-native';

interface SearchBarProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    onSearch: () => void;
}

export default function SearchBar({
    placeholder,
    value,
    onChangeText,
    onSearch,
}: SearchBarProps) {
    return (
        <View className="px-4 pb-4 bg-white">
            <View className="relative">
                <Search
                    size={20}
                    color="#64748B"
                    style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }}
                />
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#64748B"
                    value={value}
                    onChangeText={onChangeText}
                    onSubmitEditing={onSearch}
                    className="bg-gray-100 pl-10 pr-4 py-3 rounded-xl text-gray-800"
                />
            </View>
        </View>
    );
}