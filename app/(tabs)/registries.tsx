import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

// Define the shape of our PostgreSQL row
type Registry = {
  id: number;
  name: string;
  country: string;
  contact: string; // This holds the URL based on our SQL script
};

export default function RegistriesScreen() {
  const [databases, setDatabases] = useState<Registry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistries();
  }, []);

  async function fetchRegistries() {
    try {
      // Fetch all rows from the 'registries' table and sort alphabetically
      const { data, error } = await supabase
        .from("registries")
        .select("*")
        .order("name");

      if (error) throw error;
      if (data) setDatabases(data);
    } catch (error) {
      console.error("Error fetching registries:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-6">
      <View className="mb-6 px-2">
        <Text className="text-3xl font-bold text-gray-800 mb-2">Databases</Text>
        <Text className="text-gray-500 text-base leading-5">
          WhoDoggy cross-references these approved UK pet registries to locate
          microchip registration details.
        </Text>
      </View>

      {/* Show a loading spinner while Supabase fetches the data */}
      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator size="large" color="#2D89EF" />
          <Text className="text-gray-500 mt-4">
            Connecting to secure database...
          </Text>
        </View>
      ) : (
        <View className="pb-10">
          {databases.map((db) => (
            <TouchableOpacity
              key={db.id}
              className="bg-white p-4 rounded-xl mb-3 flex-row items-center justify-between shadow-sm border border-gray-200"
              onPress={() => Linking.openURL(db.contact)}
            >
              <View className="flex-row items-center flex-1">
                <View className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center mr-4">
                  <FontAwesome name="database" size={18} color="#2D89EF" />
                </View>
                <Text className="text-lg font-semibold text-gray-800 flex-shrink pr-4">
                  {db.name}
                </Text>
              </View>
              <FontAwesome name="external-link" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
