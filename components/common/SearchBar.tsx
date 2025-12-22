// components/common/SearchBar.tsx
import { ArrowLeft, Search, X } from "lucide-react-native";
import React from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  onCancel?: () => void;
  onClear?: () => void;
  showCancel?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Rechercher...",
  value,
  onChangeText,
  onSearch,
  onCancel,
  onClear,
  showCancel = false,
}) => {
  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
    Keyboard.dismiss();
  };

  const handleClear = () => {
    onChangeText("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <View className="px-4 py-2 bg-white">
      <View className="flex-row items-center">
        {showCancel && (
          <TouchableOpacity onPress={onCancel} className="mr-2 p-2">
            <ArrowLeft size={24} color="#64748B" />
          </TouchableOpacity>
        )}

        <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={20} color="#64748B" />

          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {value.length > 0 && (
            <TouchableOpacity onPress={handleClear} className="ml-2">
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {showCancel && (
          <TouchableOpacity onPress={onCancel} className="ml-2 px-4 py-2">
            <Text className="text-primary font-medium">Annuler</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchBar;
