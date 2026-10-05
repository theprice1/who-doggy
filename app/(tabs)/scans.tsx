import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function ScansTab() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Modal State for Editing Dogs
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingScan, setEditingScan] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editBreed, setEditBreed] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const statusOptions = ["Stray - Unclaimed", "Reunited", "Transferred"];

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

    if (session) {
      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .order("scan_date", { ascending: false });

      if (!error && data) setScans(data);
    }
    setLoading(false);
  }

  function openEditModal(scan: any) {
    setEditingScan(scan);
    setEditName(scan.dog_name || "");
    setEditBreed(scan.breed || "");
    setEditStatus(scan.status || "Stray - Unclaimed");
    setModalVisible(true);
  }

  async function saveDogDetails() {
    setSaving(true);
    const { error } = await supabase
      .from("scans")
      .update({
        dog_name: editName,
        breed: editBreed,
        status: editStatus,
      })
      .eq("id", editingScan.id);

    setSaving(false);

    if (!error) {
      setModalVisible(false);
      fetchScans();
    } else {
      alert("Error saving details: " + error.message);
    }
  }

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <FontAwesome name="lock" size={56} color="#3F617E" className="mb-4" />
        <Text className="text-2xl font-black text-brand-darkblue text-center mb-2">
          Secure Ledger
        </Text>
        <Text className="text-gray-500 text-center font-medium leading-relaxed">
          Please log in via the Account tab to view your clinic's stray scan
          history.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-6 bg-white border-b-2 border-brand-lightblue pb-6">
        <Text className="text-3xl font-black text-brand-darkblue mb-1 mt-4">
          Scan Logs
        </Text>
        <Text className="text-gray-500 text-base font-medium">
          Historical record of strays processed by your clinic.
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3F617E" />
        </View>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-brand-lightblue mb-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 pr-4">
                  <Text className="text-xl font-black text-brand-darkblue mb-1">
                    {item.dog_name || "Unknown Dog"}
                  </Text>
                  <Text className="text-sm font-bold text-gray-500 mb-1">
                    {item.breed || "Unknown Breed"} • {item.microchip}
                  </Text>
                  <Text className="text-xs font-bold text-gray-400">
                    Scanned: {new Date(item.scan_date).toLocaleString()}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  className="bg-brand-lightblue/20 p-3 rounded-full border border-brand-lightblue"
                >
                  <FontAwesome name="pencil" size={18} color="#3F617E" />
                </TouchableOpacity>
              </View>

              {/* Status Badge */}
              <View
                className={`self-start px-4 py-1.5 rounded-full border ${
                  item.status === "Reunited"
                    ? "bg-emerald-50 border-emerald-200"
                    : item.status === "Transferred"
                      ? "bg-brand-gold/10 border-brand-gold/30"
                      : "bg-rose-50 border-rose-200"
                }`}
              >
                <Text
                  className={`font-black text-xs uppercase tracking-wider ${
                    item.status === "Reunited"
                      ? "text-emerald-700"
                      : item.status === "Transferred"
                        ? "text-brand-gold"
                        : "text-rose-700"
                  }`}
                >
                  {item.status || "Stray - Unclaimed"}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center mt-12">
              <FontAwesome
                name="folder-open-o"
                size={48}
                color="#BBD6EF"
                className="mb-4"
              />
              <Text className="text-center text-brand-darkblue font-bold text-lg">
                No strays scanned yet.
              </Text>
              <Text className="text-center text-gray-500 mt-2">
                Use the Lookup tab to scan a microchip.
              </Text>
            </View>
          }
        />
      )}

      {/* The Edit Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white rounded-t-3xl p-6 h-5/6 border-t-4 border-brand-yellow">
            <View className="flex-row justify-between items-center mb-8 mt-2">
              <Text className="text-2xl font-black text-brand-darkblue">
                Update Profile
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-100 p-2 rounded-full"
              >
                <FontAwesome name="times" size={20} color="#3F617E" />
              </TouchableOpacity>
            </View>

            <Text className="text-brand-darkblue font-bold mb-2 ml-1 text-sm tracking-widest uppercase">
              Dog's Name
            </Text>
            <TextInput
              className="bg-gray-50 border border-brand-lightblue rounded-xl px-4 py-4 mb-6 text-brand-darkblue font-bold text-lg"
              onChangeText={setEditName}
              value={editName}
              placeholder="e.g. Buster"
              placeholderTextColor="#9ca3af"
            />

            <Text className="text-brand-darkblue font-bold mb-2 ml-1 text-sm tracking-widest uppercase">
              Breed
            </Text>
            <TextInput
              className="bg-gray-50 border border-brand-lightblue rounded-xl px-4 py-4 mb-8 text-brand-darkblue font-bold text-lg"
              onChangeText={setEditBreed}
              value={editBreed}
              placeholder="e.g. Labrador Retriever"
              placeholderTextColor="#9ca3af"
            />

            <Text className="text-brand-darkblue font-bold mb-3 ml-1 text-sm tracking-widest uppercase">
              Current Status
            </Text>
            <View className="flex-row justify-between mb-8">
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setEditStatus(status)}
                  className={`flex-1 py-4 px-1 rounded-xl mx-1 items-center border-2 ${
                    editStatus === status
                      ? "bg-brand-darkblue border-brand-darkblue shadow-sm"
                      : "bg-white border-brand-lightblue"
                  }`}
                >
                  <Text
                    className={`text-center font-bold text-xs ${
                      editStatus === status
                        ? "text-white"
                        : "text-brand-darkblue"
                    }`}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-1 justify-end pb-8">
              <TouchableOpacity
                onPress={saveDogDetails}
                disabled={saving}
                className="bg-brand-yellow py-4 rounded-xl items-center shadow-sm"
              >
                <Text className="text-brand-dark font-black text-lg">
                  {saving ? "SAVING..." : "SAVE DETAILS"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
