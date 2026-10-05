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
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6 bg-white border-b-2 border-brand-lightblue pb-6">
        <Text className="text-3xl font-black text-brand-darkblue mb-1 mt-4">
          Databases
        </Text>
        <Text className="text-gray-500 text-base font-medium">
          WhoDoggy cross-references these approved UK pet registries to locate
          microchip registration details.
        </Text>
      </View>

      {/* Show a loading spinner while Supabase fetches the data */}
      {loading ? (
        <View className="py-12 items-center">
          <ActivityIndicator size="large" color="#3F617E" />
          <Text className="text-brand-darkblue font-bold mt-4 tracking-widest uppercase text-sm">
            Syncing Registries...
          </Text>
        </View>
      ) : (
        <View className="p-4 pb-10 mt-2">
          {databases.map((db) => (
            <TouchableOpacity
              key={db.id}
              className="bg-white p-4 rounded-2xl mb-3 flex-row items-center justify-between shadow-sm border border-brand-lightblue"
              onPress={() => Linking.openURL(db.contact)}
            >
              <View className="flex-row items-center flex-1">
                <View className="bg-brand-lightblue/20 border border-brand-lightblue w-12 h-12 rounded-full items-center justify-center mr-4">
                  <FontAwesome name="database" size={18} color="#3F617E" />
                </View>
                <Text className="text-lg font-black text-brand-darkblue flex-shrink pr-4">
                  {db.name}
                </Text>
              </View>

              <View className="bg-gray-50 p-2.5 rounded-full border border-gray-100">
                <FontAwesome name="external-link" size={14} color="#CFA037" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
