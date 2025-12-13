import { ChevronDown, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface CustomSelectProps {
    label?: string;
    placeholder?: string;
    value: string;
    onValueChange: (value: string) => void;
    items: SelectOption[];
    error?: string;
    helperText?: string;
    disabled?: boolean;
    required?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    emptyMessage?: string;
    containerClassName?: string;
    labelClassName?: string;
    selectClassName?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    label,
    placeholder = 'Sélectionner...',
    value,
    onValueChange,
    items,
    error,
    helperText,
    disabled = false,
    required = false,
    searchable = false,
    searchPlaceholder = 'Rechercher...',
    emptyMessage = 'Aucun élément trouvé',
    containerClassName = '',
    labelClassName = '',
    selectClassName = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const selectedItem = items.find(item => item.value === value);
    const displayText = selectedItem ? selectedItem.label : placeholder;

    // Filtrage des éléments pour la recherche
    const filteredItems = searchable
        ? items.filter(item =>
            (item.label || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        : items;

    const handleSelect = (itemValue: string) => {
        if (disabled) return;
        onValueChange(itemValue);
        setIsOpen(false);
        setSearchQuery('');
    };

    const clearSelection = () => {
        onValueChange('');
    };

    const getSelectStyle = () => {
        if (disabled) return 'bg-gray-100 border-gray-300 opacity-60';
        if (error) return 'border-red-300 bg-white';
        if (isOpen) return 'border-primary ring-2 ring-primary/20 bg-white';
        return 'border-gray-300 bg-white';
    };

    // Style pour le bouton principal
    const getButtonStyle = () => {
        let style: any = {
            width: '100%',
            borderRadius: 8,
            borderWidth: 1,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'space-between' as const,
        };

        if (disabled) {
            style.backgroundColor = '#F1F5F9';
            style.borderColor = '#CBD5E1';
            style.opacity = 0.6;
        } else if (error) {
            style.backgroundColor = '#FFFFFF';
            style.borderColor = '#FCA5A5';
        } else if (isOpen) {
            style.backgroundColor = '#FFFFFF';
            style.borderColor = '#079C48';
            style.shadowColor = '#079C48';
            style.shadowOffset = { width: 0, height: 0 };
            style.shadowOpacity = 0.2;
            style.shadowRadius = 4;
            style.elevation = 2;
        } else {
            style.backgroundColor = '#FFFFFF';
            style.borderColor = '#CBD5E1';
        }

        return style;
    };

    return (
        <View style={{ marginBottom: 16 }}>
            {label && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: '#374151', fontWeight: '500', fontSize: 14 }}>
                        {label}
                    </Text>
                    {required && (
                        <Text style={{ color: '#EF4444', marginLeft: 4 }}>*</Text>
                    )}
                </View>
            )}

            <View style={{ position: 'relative' }}>
                {/* Bouton du select */}
                <TouchableOpacity
                    style={getButtonStyle()}
                    onPress={() => {
                        if (!disabled) {
                            setIsOpen(!isOpen);
                            setSearchQuery('');
                        }
                    }}
                    activeOpacity={0.7}
                    disabled={disabled}
                >
                    <Text
                        style={{
                            flex: 1,
                            fontSize: 16,
                            color: selectedItem ? '#1F2937' : '#6B7280',
                            opacity: disabled ? 0.6 : 1
                        }}
                        numberOfLines={1}
                    >
                        {displayText}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                        {value && !disabled && (
                            <TouchableOpacity
                                onPress={(e) => {
                                    e.stopPropagation();
                                    clearSelection();
                                }}
                                style={{ marginRight: 8 }}
                                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                            >
                                <X size={16} color="#94A3B8" />
                            </TouchableOpacity>
                        )}
                        <ChevronDown
                            size={20}
                            color={disabled ? '#94A3B8' : '#64748B'}
                            style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
                        />
                    </View>
                </TouchableOpacity>

                {/* Dropdown in-place (no Modal) */}
                {isOpen && (
                    <View
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: '#E2E8F0',
                            borderRadius: 8,
                            padding: 8,
                            zIndex: 1000,
                            elevation: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            marginTop: 4,
                            maxHeight: 300
                        }}
                    >
                        {/* Header local */}
                        {searchable && (
                            <View style={{ marginBottom: 8 }}>
                                <TextInput
                                    style={{
                                        width: '100%',
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        backgroundColor: '#F1F5F9',
                                        borderRadius: 6,
                                        color: '#1E293B',
                                        fontSize: 14,
                                    }}
                                    placeholder={searchPlaceholder}
                                    placeholderTextColor="#94A3B8"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        )}

                        <ScrollView
                            nestedScrollEnabled={true}
                            style={{ maxHeight: 200 }}
                            showsVerticalScrollIndicator={true}
                        >
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 8,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#F8FAFC',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundColor: value === item.value ? '#F0FDF4' : 'transparent',
                                            opacity: item.disabled ? 0.5 : 1
                                        }}
                                        onPress={() => !item.disabled && handleSelect(item.value)}
                                        disabled={item.disabled}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: item.disabled ? '#94A3B8' : (value === item.value ? '#079C48' : '#1E293B'),
                                                fontWeight: value === item.value ? '500' : '400'
                                            }}
                                        >
                                            {item.label}
                                        </Text>
                                        {value === item.value && (
                                            <Text style={{ color: '#079C48', fontWeight: 'bold' }}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={{ padding: 12, alignItems: 'center' }}>
                                    <Text style={{ color: '#64748B', fontSize: 14 }}>{emptyMessage}</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                )}
            </View>

            {/* Messages d'erreur/aide */}
            <View style={{ marginTop: 4 }}>
                {error ? (
                    <Text style={{ color: '#EF4444', fontSize: 12 }}>{error}</Text>
                ) : helperText ? (
                    <Text style={{ color: '#6B7280', fontSize: 12 }}>{helperText}</Text>
                ) : null}
            </View>
        </View>
    );
};

// Version pour les formulaires
export const FormSelect: React.FC<CustomSelectProps> = (props) => {
    return (
        <CustomSelect
            {...props}
        />
    );
};