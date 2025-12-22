import { Check, ChevronDown, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomMultiSelectProps {
  label?: string;
  placeholder?: string;
  selectedValues: string[];
  onSelectedValuesChange: (values: string[]) => void;
  items: SelectOption[];
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxSelections?: number;
}

export const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  label,
  placeholder = "Sélectionner...",
  selectedValues,
  onSelectedValuesChange,
  items,
  error,
  helperText,
  disabled = false,
  required = false,
  searchable = false,
  searchPlaceholder = "Rechercher...",
  emptyMessage = "Aucun élément trouvé",
  maxSelections,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const selectedItems = items.filter((item) =>
    selectedValues.includes(item.value)
  );
  const displayText =
    selectedItems.length > 0
      ? `${selectedItems.length} élément(s) sélectionné(s)`
      : placeholder;

  const filteredItems = searchable
    ? items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  const handleSelect = (value: string) => {
    if (disabled) return;

    const isSelected = selectedValues.includes(value);
    let newSelectedValues: string[];

    if (isSelected) {
      newSelectedValues = selectedValues.filter((v) => v !== value);
    } else {
      if (maxSelections && selectedValues.length >= maxSelections) {
        return;
      }
      newSelectedValues = [...selectedValues, value];
    }

    onSelectedValuesChange(newSelectedValues);
  };

  const clearSelection = () => {
    onSelectedValuesChange([]);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchQuery("");
    }
  };

  const getSelectStyle = () => {
    if (disabled) return "bg-gray-100 border-gray-300 opacity-60";
    if (error) return "border-red-300 bg-white";
    if (isOpen) return "border-primary ring-2 ring-primary/20 bg-white";
    return "border-gray-300 bg-white";
  };

  const getButtonStyle = () => {
    let style: any = {
      width: "100%",
      borderRadius: 8,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "space-between" as const,
    };

    if (disabled) {
      style.backgroundColor = "#F1F5F9";
      style.borderColor = "#CBD5E1";
      style.opacity = 0.6;
    } else if (error) {
      style.backgroundColor = "#FFFFFF";
      style.borderColor = "#FCA5A5";
    } else if (isOpen) {
      style.backgroundColor = "#FFFFFF";
      style.borderColor = "#079C48";
      style.shadowColor = "#079C48";
      style.shadowOffset = { width: 0, height: 0 };
      style.shadowOpacity = 0.2;
      style.shadowRadius = 4;
      style.elevation = 2;
    } else {
      style.backgroundColor = "#FFFFFF";
      style.borderColor = "#CBD5E1";
    }

    return style;
  };

  return (
    <View className="mb-4">
      {label && (
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-gray-700 font-medium text-sm">
            {label}
            {required && <Text className="text-red-500"> *</Text>}
          </Text>
          {maxSelections && (
            <Text className="text-gray-500 text-xs">Max: {maxSelections}</Text>
          )}
        </View>
      )}

      <View className="relative">
        {/* Bouton d'ouverture du dropdown */}
        <TouchableOpacity
          style={getButtonStyle()}
          onPress={toggleDropdown}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text
            className={`flex-1 text-base ${
              selectedItems.length > 0 ? "text-gray-800" : "text-gray-500"
            }`}
            numberOfLines={1}
          >
            {displayText}
          </Text>

          <View className="flex-row items-center ml-2">
            {selectedValues.length > 0 && !disabled && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="mr-2"
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <X size={16} color="#000000" />
              </TouchableOpacity>
            )}
            <ChevronDown
              size={20}
              color={disabled ? "#94A3B8" : "#000000"}
              style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
            />
          </View>
        </TouchableOpacity>

        {/* Dropdown in-place (pas de Modal) */}
        {isOpen && (
          <View className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg z-50 shadow-lg mt-1 max-h-64">
            {/* Header local */}
            <View className="p-3 border-b border-gray-100">
              {searchable && (
                <View className="mb-2">
                  <TextInput
                    className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-800"
                    placeholder={searchPlaceholder}
                    placeholderTextColor="#94A3B8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              )}

              {selectedValues.length > 0 && (
                <View className="mt-1">
                  <Text className="text-sm text-gray-600">
                    {selectedValues.length} élément(s) sélectionné(s)
                  </Text>
                </View>
              )}
            </View>

            {/* Liste des options */}
            <ScrollView
              ref={scrollViewRef}
              nestedScrollEnabled={true}
              className="max-h-48"
              showsVerticalScrollIndicator={true}
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isSelected = selectedValues.includes(item.value);
                  return (
                    <TouchableOpacity
                      key={item.value}
                      className={`
                        flex-row items-center justify-between py-3 px-4
                        border-b border-gray-100
                        ${item.disabled ? "opacity-50" : ""}
                        ${isSelected ? "bg-yellow-500/10" : ""}
                      `}
                      onPress={() => !item.disabled && handleSelect(item.value)}
                      disabled={item.disabled}
                    >
                      <View className="flex-row items-center flex-1">
                        {/* Case à cocher */}
                        <View
                          className={`
                            w-5 h-5 border rounded mr-3 items-center justify-center
                            ${
                              isSelected
                                ? "bg-yellow-500 border-yellow-500"
                                : "border-gray-300"
                            }
                          `}
                        >
                          {isSelected && <Check size={12} color="white" />}
                        </View>

                        <Text
                          className={`text-base ${
                            isSelected
                              ? "text-yellow-700 font-medium"
                              : "text-gray-800"
                          }`}
                        >
                          {item.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View className="py-6 items-center">
                  <Text className="text-gray-500">{emptyMessage}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Liste des éléments sélectionnés */}
      {selectedItems.length > 0 && (
        <View className="mt-2 flex-row flex-wrap">
          {selectedItems.map((item) => (
            <View
              key={item.value}
              className="bg-yellow-500/10 border border-yellow-200 rounded-full px-3 py-1.5 mr-2 mb-2 flex-row items-center"
            >
              <Text className="text-yellow-700 text-sm mr-2">{item.label}</Text>
              <TouchableOpacity
                onPress={() => handleSelect(item.value)}
                hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <X size={14} color="#CA8A04" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Messages d'erreur/aide */}
      <View className="mt-1">
        {error ? (
          <Text className="text-red-500 text-xs">{error}</Text>
        ) : helperText ? (
          <Text className="text-gray-500 text-xs">{helperText}</Text>
        ) : null}
      </View>
    </View>
  );
};
