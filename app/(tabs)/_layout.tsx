import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FDCB58", // Brand Yellow for the active tab
        tabBarInactiveTintColor: "#BBD6EF", // Brand Light Blue for inactive tabs
        tabBarStyle: {
          backgroundColor: "#3F617E", // Brand Dark Blue background
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false, // Hides default OS header since we built custom UI headers on the pages
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Lookup",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      />

      {/* Note: If you fully deleted the registries.tsx file earlier, you can safely remove this block! */}
      <Tabs.Screen
        name="registries"
        options={{
          title: "Databases",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="database" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="scans"
        options={{
          title: "Scan Logs",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="paw" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="shield" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
