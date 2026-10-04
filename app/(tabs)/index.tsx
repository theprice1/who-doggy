import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Session } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function LookupTab() {
  const [session, setSession] = useState<Session | null>(null);
  const [chip, setChip] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [registry, setRegistry] = useState<any>(null);

  // Check authentication status
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  async function handleSearch() {
    setMessage("");
    setRegistry(null);

    // Security Check
    if (!session) {
      setMessage("You must be logged in on the Account tab to search.");
      return;
    }

    // Validation Check (Must be exactly 15 digits)
    if (chip.length !== 15 || !/^\d+$/.test(chip)) {
      setMessage("Error: Microchip must be exactly 15 digits.");
      return;
    }

    setLoading(true);
    const prefix = chip.substring(0, 3); // Extract the manufacturer code

    // 1. Query the routing engine
    const { data, error } = await supabase
      .from("registries")
      .select("*")
      .contains("prefix_codes", JSON.stringify([prefix]))
      .maybeSingle();

    if (error || !data) {
      setMessage(`No database found for prefix ${prefix}.`);
      setLoading(false);
      return;
    }

    setRegistry(data);

    // 2. Silently log the scan for stray tracking
    await supabase
      .from("scans")
      .insert([{ vet_id: session.user.id, microchip: chip }]);

    setLoading(false);
  }

  async function openRegistry() {
    if (registry?.lookup_url) {
      await WebBrowser.openBrowserAsync(registry.lookup_url);
    }
  }

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="mb-8">
        <Text className="text-3xl font-extrabold text-gray-900 mb-2">
          Microchip Lookup
        </Text>
        <Text className="text-gray-500 text-base">
          Enter a 15-digit microchip number to cross-reference UK databases.
        </Text>
      </View>

      <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <Text className="text-gray-700 font-bold mb-2 ml-1">
          Microchip Number
        </Text>
        <TextInput
          className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 mb-4 text-gray-900 text-lg"
          onChangeText={setChip}
          value={chip}
          placeholder="e.g. 981020000000000"
          keyboardType="number-pad"
          maxLength={15}
        />

        <TouchableOpacity
          onPress={handleSearch}
          disabled={loading}
          className={`${loading ? "bg-blue-400" : "bg-blue-600"} py-4 rounded-xl flex-row justify-center items-center shadow-sm`}
        >
          <FontAwesome name="search" size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold text-lg ml-2">
            {loading ? "Searching..." : "Search Registries"}
          </Text>
        </TouchableOpacity>

        {/* Status Messages */}
        {message !== "" && (
          <Text className="text-center font-bold mt-4 text-red-600">
            {message}
          </Text>
        )}
      </View>

      {/* Success Result Card */}
      {registry && (
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-green-200">
          <View className="flex-row items-center mb-4">
            <FontAwesome name="check-circle" size={24} color="#16a34a" />
            <Text className="text-xl font-bold text-gray-900 ml-2">
              Match Found
            </Text>
          </View>

          <Text className="text-gray-600 mb-1">
            Prefix {chip.substring(0, 3)} is registered to:
          </Text>
          <Text className="text-2xl font-extrabold text-gray-900 mb-6">
            {registry.name}
          </Text>

          <TouchableOpacity
            onPress={openRegistry}
            className="bg-green-600 py-4 rounded-xl items-center shadow-sm"
          >
            <Text className="text-white font-bold text-lg">
              Open {registry.name}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
