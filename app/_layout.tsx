import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { StyleSheet } from "react-native-css-interop";

// This manually forces the web browser to accept Tailwind's color scheme classes
if (Platform.OS === "web") {
  // @ts-ignore - The library's typescript definitions are missing this method
  StyleSheet.setFlag("darkMode", "class");
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FDCB58",
        tabBarInactiveTintColor: "#BBD6EF",
        tabBarStyle: {
          backgroundColor: "#3F617E",
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
        headerShown: false,
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
