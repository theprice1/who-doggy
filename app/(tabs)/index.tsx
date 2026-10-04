import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Session } from "@supabase/supabase-js";
import { CameraView, useCameraPermissions } from "expo-camera";
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
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Camera State
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  // Updated to accept an override chip string for instant camera searches
  async function handleSearch(overrideChip?: string) {
    const searchChip = overrideChip || chip;
    setMessage("");
    setRegistry(null);
    setSearchAttempted(false);

    if (!session) {
      setMessage("You must be logged in on the Account tab to search.");
      return;
    }

    if (searchChip.length !== 15 || !/^\d+$/.test(searchChip)) {
      setMessage("Error: Microchip must be exactly 15 digits.");
      return;
    }

    setLoading(true);
    setSearchAttempted(true);
    const prefix = searchChip.substring(0, 3);

    const { data: registryData } = await supabase
      .from("registries")
      .select("*")
      .contains("prefix_codes", JSON.stringify([prefix]))
      .maybeSingle();

    if (registryData) setRegistry(registryData);

    const { data: dogData } = await supabase
      .from("mock_registry_data")
      .select("*")
      .eq("microchip", searchChip)
      .maybeSingle();

    await supabase.from("scans").insert([
      {
        vet_id: session.user.id,
        microchip: searchChip,
        dog_name: dogData ? dogData.dog_name : "Unknown Dog",
        breed: dogData ? dogData.breed : "Unknown Breed",
        status: dogData
          ? dogData.owner_status === "Reported Missing"
            ? "Stray - Unclaimed"
            : "Reunited"
          : "Stray - Unclaimed",
      },
    ]);

    setLoading(false);
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setChip(data);
    setIsScanning(false);
    handleSearch(data); // Auto-trigger the search
  };

  async function openBrowser(url: string) {
    await WebBrowser.openBrowserAsync(url);
  }

  // Render the Camera UI if active
  if (isScanning) {
    if (!permission) return <View />;
    if (!permission.granted) {
      return (
        <View className="flex-1 justify-center items-center bg-gray-900 p-6">
          <Text className="text-white text-center mb-6 text-lg font-bold">
            We need camera access to scan microchip barcodes.
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="bg-blue-600 px-6 py-4 rounded-xl mb-4 w-full items-center"
          >
            <Text className="text-white font-bold text-lg">
              Grant Permission
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsScanning(false)}
            className="py-4"
          >
            <Text className="text-gray-400 font-bold text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="flex-1">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View className="flex-1 bg-black/40 justify-between p-6 pb-12">
            <Text className="text-white text-center font-bold text-2xl mt-16 drop-shadow-md">
              Point at Microchip Barcode
            </Text>

            {/* A visual targeting box to help the user align the barcode */}
            <View className="flex-1 justify-center items-center">
              <View className="w-72 h-40 border-4 border-green-400 rounded-xl bg-transparent opacity-70" />
            </View>

            <TouchableOpacity
              onPress={() => setIsScanning(false)}
              className="bg-white py-4 rounded-xl items-center shadow-lg mb-8"
            >
              <Text className="text-gray-900 font-extrabold text-lg">
                Cancel Scan
              </Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  // Render Standard Lookup UI
  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="mb-8 mt-4">
        <Text className="text-3xl font-extrabold text-gray-900 mb-2">
          Microchip Lookup
        </Text>
        <Text className="text-gray-500 text-base">
          Scan a barcode or enter a 15-digit number to cross-reference UK
          databases.
        </Text>
      </View>

      <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        {/* New Hardware Scan Button */}
        <TouchableOpacity
          onPress={() => setIsScanning(true)}
          className="bg-gray-900 py-4 rounded-xl flex-row justify-center items-center shadow-sm mb-6"
        >
          <FontAwesome name="qrcode" size={22} color="white" className="mr-2" />
          <Text className="text-white font-bold text-lg ml-2">
            Scan Barcode
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-gray-400 font-bold">
            OR ENTER MANUALLY
          </Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        <TextInput
          className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 mb-4 text-gray-900 text-lg text-center tracking-widest font-bold"
          onChangeText={setChip}
          value={chip}
          placeholder="15-DIGIT NUMBER"
          keyboardType="number-pad"
          maxLength={15}
        />

        <TouchableOpacity
          onPress={() => handleSearch()}
          disabled={loading}
          className={`${loading ? "bg-blue-400" : "bg-blue-600"} py-4 rounded-xl flex-row justify-center items-center shadow-sm`}
        >
          <FontAwesome name="search" size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold text-lg ml-2">
            {loading ? "Searching..." : "Search Registries"}
          </Text>
        </TouchableOpacity>

        {message !== "" && (
          <Text className="text-center font-bold mt-4 text-red-600">
            {message}
          </Text>
        )}
      </View>

      {/* Scenario A: Direct Match */}
      {registry && (
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-green-200">
          <View className="flex-row items-center mb-4">
            <FontAwesome name="check-circle" size={24} color="#16a34a" />
            <Text className="text-xl font-bold text-gray-900 ml-2">
              Primary Match Found
            </Text>
          </View>

          <Text className="text-gray-600 mb-1">
            Prefix {chip.substring(0, 3)} defaults to:
          </Text>
          <Text className="text-2xl font-extrabold text-gray-900 mb-6">
            {registry.name}
          </Text>

          <TouchableOpacity
            onPress={() => openBrowser(registry.lookup_url)}
            className="bg-green-600 py-4 rounded-xl items-center shadow-sm mb-3"
          >
            <Text className="text-white font-bold text-lg">
              Open {registry.name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openBrowser("https://www.check-a-chip.co.uk")}
            className="py-3 rounded-xl items-center border border-gray-300"
          >
            <Text className="text-gray-700 font-bold">
              Not there? Search all UK Registries
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Scenario B: Unrecognized Prefix */}
      {searchAttempted && !registry && !loading && (
        <View className="bg-white p-6 rounded-2xl shadow-sm border border-orange-200">
          <View className="flex-row items-center mb-4">
            <FontAwesome name="exclamation-circle" size={24} color="#ea580c" />
            <Text className="text-xl font-bold text-gray-900 ml-2">
              Prefix Unmapped
            </Text>
          </View>

          <Text className="text-gray-600 mb-6">
            We don't have a direct link for prefix {chip.substring(0, 3)}.
            Please use the UK-wide Check-a-Chip portal.
          </Text>

          <TouchableOpacity
            onPress={() => openBrowser("https://www.check-a-chip.co.uk")}
            className="bg-orange-600 py-4 rounded-xl items-center shadow-sm"
          >
            <Text className="text-white font-bold text-lg">
              Open Check-a-Chip
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
