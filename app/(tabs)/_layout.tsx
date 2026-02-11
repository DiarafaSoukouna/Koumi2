import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#e7bb1d",
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistical"
        options={{
          title: "Statistique",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="bar-chart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Magasin"
        options={{
          title: "Magasin",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="storefront" color={color} />
          ),
        }}
      />
      {/* profile */}
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
