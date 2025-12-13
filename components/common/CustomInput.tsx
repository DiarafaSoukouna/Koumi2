import { AlertCircle, Eye, EyeOff, Search } from 'lucide-react-native';
import React from 'react';
import {
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View
} from 'react-native';

interface CustomInputProps extends Omit<TextInputProps, 'onChange'> {
    label?: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    helperText?: string;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    type?: 'text' | 'password' | 'email' | 'number' | 'phone' | 'search';
    disabled?: boolean;
    required?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    error,
    helperText,
    iconLeft,
    iconRight,
    type = 'text',
    disabled = false,
    required = false,
    containerClassName = '',
    labelClassName = '',
    inputClassName = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const getKeyboardType = () => {
        switch (type) {
            case 'email': return 'email-address';
            case 'number': return 'numeric';
            case 'phone': return 'phone-pad';
            default: return 'default';
        }
    };

    const isPassword = type === 'password';
    const isSearch = type === 'search';
    const showEyeIcon = isPassword && value.length > 0;

    return (
        <View className={`mb-4 ${containerClassName}`}>
            {label && (
                <View className="flex-row items-center mb-2">
                    <Text className={`text-gray-700 font-medium text-sm ${labelClassName}`}>
                        {label}
                    </Text>
                    {required && (
                        <Text className="text-red-500 ml-1">*</Text>
                    )}
                </View>
            )}

            <View className={`relative ${isSearch ? 'rounded-full' : 'rounded-lg'}`}>
                {/* Left Icon */}
                {iconLeft || isSearch ? (
                    <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
                        {isSearch ? (
                            <Search size={20} color="#94A3B8" />
                        ) : (
                            iconLeft
                        )}
                    </View>
                ) : null}

                {/* Input */}
                <TextInput
                    className={`
            w-full 
            ${isSearch ? 'rounded-full' : 'rounded-lg'}
            border 
            ${error ? 'border-red-300' : isFocused ? 'border-primary' : 'border-gray-300'}
            bg-white
            ${disabled ? 'bg-gray-100 text-gray-500' : 'text-gray-800'}
            px-4 py-3
            ${iconLeft || isSearch ? 'pl-10' : ''}
            ${iconRight || showEyeIcon ? 'pr-10' : ''}
            text-base
            ${disabled ? 'opacity-60' : ''}
            ${inputClassName}
          `}
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={isPassword && !showPassword}
                    keyboardType={getKeyboardType()}
                    editable={!disabled}
                    autoCapitalize="none"
                    autoCorrect={false}
                    {...props}
                />

                {/* Right Icons */}
                <View className="absolute right-3 top-0 bottom-0 justify-center z-10">
                    {showEyeIcon ? (
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        >
                            {showPassword ? (
                                <EyeOff size={20} color="#64748B" />
                            ) : (
                                <Eye size={20} color="#64748B" />
                            )}
                        </TouchableOpacity>
                    ) : iconRight ? (
                        iconRight
                    ) : error ? (
                        <AlertCircle size={20} color="#EF4444" />
                    ) : null}
                </View>
            </View>

            {/* Error & Helper Text */}
            <View className="mt-1">
                {error ? (
                    <Text className="text-red-500 text-xs flex-row items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {error}
                    </Text>
                ) : helperText ? (
                    <Text className="text-gray-500 text-xs">{helperText}</Text>
                ) : null}
            </View>
        </View>
    );
};

// Version pour les formulaires de création
export const FormInput: React.FC<CustomInputProps> = (props) => {
    return (
        <CustomInput
            containerClassName="w-full"
            inputClassName="border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            labelClassName="font-semibold text-gray-800"
            {...props}
        />
    );
};