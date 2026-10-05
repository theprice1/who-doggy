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

  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

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
    handleSearch(data);
  };

  async function openBrowser(url: string) {
    await WebBrowser.openBrowserAsync(url);
  }

  if (isScanning) {
    if (!permission) return <View />;
    if (!permission.granted) {
      return (
        <View className="flex-1 justify-center items-center bg-brand-dark p-6">
          <Text className="text-white text-center mb-6 text-lg font-bold">
            We need camera access to scan microchip barcodes.
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="bg-brand-yellow px-6 py-4 rounded-xl mb-4 w-full items-center"
          >
            <Text className="text-brand-dark font-extrabold text-lg">
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

            <View className="flex-1 justify-center items-center">
              <View className="w-72 h-40 border-4 border-brand-yellow rounded-xl bg-transparent opacity-80" />
            </View>

            <TouchableOpacity
              onPress={() => setIsScanning(false)}
              className="bg-white py-4 rounded-xl items-center shadow-lg mb-8"
            >
              <Text className="text-brand-dark font-extrabold text-lg">
                Cancel Scan
              </Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="mb-8 mt-4">
        <Text className="text-3xl font-black text-brand-darkblue mb-2">
          Microchip Lookup
        </Text>
        <Text className="text-gray-500 text-base font-medium">
          Scan a barcode or enter a 15-digit number to cross-reference UK
          databases.
        </Text>
      </View>

      <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <TouchableOpacity
          onPress={() => setIsScanning(true)}
          className="bg-brand-yellow py-4 rounded-xl flex-row justify-center items-center shadow-sm mb-6"
        >
          <FontAwesome
            name="qrcode"
            size={24}
            color="#1e293b"
            className="mr-3"
          />
          <Text className="text-brand-dark font-extrabold text-xl">
            Scan Barcode
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-gray-400 font-bold text-xs tracking-widest">
            OR ENTER MANUALLY
          </Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        <TextInput
          className="bg-gray-50 border border-brand-lightblue rounded-xl px-4 py-4 mb-4 text-brand-darkblue text-xl text-center tracking-widest font-black"
          onChangeText={setChip}
          value={chip}
          placeholder="15-DIGIT NUMBER"
          keyboardType="number-pad"
          maxLength={15}
        />

        <TouchableOpacity
          onPress={() => handleSearch()}
          disabled={loading}
          className={`${loading ? "bg-brand-darkblue/70" : "bg-brand-darkblue"} py-4 rounded-xl flex-row justify-center items-center shadow-sm`}
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

      {registry && (
        <View className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-500">
          <View className="flex-row items-center mb-4">
            <FontAwesome name="check-circle" size={28} color="#22c55e" />
            <Text className="text-xl font-black text-brand-dark ml-2">
              Primary Match Found
            </Text>
          </View>

          <Text className="text-gray-600 mb-1 font-medium">
            Prefix {chip.substring(0, 3)} defaults to:
          </Text>
          <Text className="text-3xl font-black text-brand-darkblue mb-6">
            {registry.name}
          </Text>

          <TouchableOpacity
            onPress={() => openBrowser(registry.lookup_url)}
            className="bg-green-500 py-4 rounded-xl items-center shadow-sm mb-3"
          >
            <Text className="text-white font-black text-lg">
              Open {registry.name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openBrowser("https://www.check-a-chip.co.uk")}
            className="py-3 rounded-xl items-center border-2 border-brand-lightblue bg-brand-lightblue/20"
          >
            <Text className="text-brand-darkblue font-bold">
              Not there? Search all UK Registries
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {searchAttempted && !registry && !loading && (
        <View className="bg-white p-6 rounded-2xl shadow-sm border-2 border-brand-gold">
          <View className="flex-row items-center mb-4">
            <FontAwesome name="exclamation-circle" size={28} color="#CFA037" />
            <Text className="text-xl font-black text-brand-dark ml-2">
              Prefix Unmapped
            </Text>
          </View>

          <Text className="text-gray-600 mb-6 font-medium leading-relaxed">
            We don't have a direct link for prefix {chip.substring(0, 3)}.
            Please use the UK-wide Check-a-Chip portal.
          </Text>

          <TouchableOpacity
            onPress={() => openBrowser("https://www.check-a-chip.co.uk")}
            className="bg-brand-gold py-4 rounded-xl items-center shadow-sm"
          >
            <Text className="text-white font-black text-lg">
              Open Check-a-Chip
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
