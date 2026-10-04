import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#2D89EF" }}>
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
            <FontAwesome name="cogs" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
