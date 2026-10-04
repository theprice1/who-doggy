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
      fetchScans(); // Refresh the list to show the new data
    } else {
      alert("Error saving details: " + error.message);
    }
  }

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
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-4">
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  {/* Display the newly added dog details, or a fallback if not edited yet */}
                  <Text className="text-xl font-bold text-gray-900 mb-1">
                    {item.dog_name || "Unknown Dog"}
                  </Text>
                  <Text className="text-base text-gray-600 mb-1">
                    {item.breed || "Unknown Breed"} • {item.microchip}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    Scanned: {new Date(item.scan_date).toLocaleString()}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  className="bg-gray-100 p-3 rounded-full"
                >
                  <FontAwesome name="pencil" size={18} color="#4b5563" />
                </TouchableOpacity>
              </View>

              {/* Status Badge */}
              <View
                className={`self-start px-3 py-1 rounded-full ${
                  item.status === "Reunited"
                    ? "bg-green-100"
                    : item.status === "Transferred"
                      ? "bg-orange-100"
                      : "bg-red-100"
                }`}
              >
                <Text
                  className={`font-bold text-sm ${
                    item.status === "Reunited"
                      ? "text-green-700"
                      : item.status === "Transferred"
                        ? "text-orange-700"
                        : "text-red-700"
                  }`}
                >
                  {item.status || "Stray - Unclaimed"}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10 font-medium text-lg">
              No strays scanned yet.
            </Text>
          }
        />
      )}

      {/* The Edit Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-5/6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-900">
                Update Profile
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome name="times-circle" size={28} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-700 font-bold mb-2 ml-1">
              Dog's Name
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 mb-5 text-gray-900 text-lg"
              onChangeText={setEditName}
              value={editName}
              placeholder="e.g. Buster"
            />

            <Text className="text-gray-700 font-bold mb-2 ml-1">Breed</Text>
            <TextInput
              className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 mb-6 text-gray-900 text-lg"
              onChangeText={setEditBreed}
              value={editBreed}
              placeholder="e.g. Labrador Retriever"
            />

            <Text className="text-gray-700 font-bold mb-3 ml-1">
              Current Status
            </Text>
            <View className="flex-row justify-between mb-8">
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setEditStatus(status)}
                  className={`flex-1 py-3 px-2 rounded-lg mx-1 items-center border ${
                    editStatus === status
                      ? "bg-blue-50 border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-center font-bold text-xs ${
                      editStatus === status ? "text-blue-700" : "text-gray-600"
                    }`}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={saveDogDetails}
              disabled={saving}
              className="bg-blue-600 py-4 rounded-xl items-center shadow-sm"
            >
              <Text className="text-white font-bold text-lg">
                {saving ? "Saving..." : "Save Details"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
