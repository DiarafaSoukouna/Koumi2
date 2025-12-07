import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

interface Tab {
    id: string;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row border-b border-gray-200"
        >
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    onPress={() => onTabChange(tab.id)}
                    className={`px-4 py-3 border-b-2 ${activeTab === tab.id
                            ? 'border-primary'
                            : 'border-transparent'
                        }`}
                >
                    <Text className={`font-medium ${activeTab === tab.id
                            ? 'text-primary'
                            : 'text-gray-500'
                        }`}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}