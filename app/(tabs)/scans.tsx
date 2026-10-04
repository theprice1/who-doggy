import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function ScansTab() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // This hook forces the app to refresh the data every time this tab is opened
  useFocusEffect(
    useCallback(() => {
      fetchScans();
    }, []),
  );

  async function fetchScans() {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setSession(session);

    // Only attempt to pull records if the vet is actively logged in
    if (session) {
      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .order("scan_date", { ascending: false }); // Newest scans at the top

      if (!error && data) {
        setScans(data);
      }
    }
    setLoading(false);
  }

  // Security Fallback: What an unauthorized user sees
  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <FontAwesome name="lock" size={48} color="#9ca3af" className="mb-4" />
        <Text className="text-xl font-bold text-gray-900 text-center mb-2">
          Secure Ledger
        </Text>
        <Text className="text-gray-500 text-center">
          Please log in via the Account tab to view your clinic's stray scan
          history.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-6 bg-white border-b border-gray-200">
        <Text className="text-3xl font-extrabold text-gray-900 mb-1">
          Scan Logs
        </Text>
        <Text className="text-gray-500 text-base">
          Historical record of strays processed by your clinic.
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-bold text-gray-900 tracking-wider mb-1">
                  {item.microchip}
                </Text>
                <Text className="text-sm text-gray-500">
                  {new Date(item.scan_date).toLocaleString()}
                </Text>
              </View>
              <FontAwesome name="microchip" size={24} color="#3b82f6" />
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10 font-medium text-lg">
              No strays scanned yet.
            </Text>
          }
        />
      )}
    </View>
  );
}
