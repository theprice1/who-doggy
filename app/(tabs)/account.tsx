import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function SystemTab() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function signInWithEmail() {
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMessage(`Error: ${error.message}`);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else if (data.session == null) {
      setMessage("Account created! You can now sign in.");
    }
    setLoading(false);
  }

  async function signOut() {
    setMessage("");
    const { error } = await supabase.auth.signOut();
    if (error) setMessage(`Error: ${error.message}`);
  }

  async function confirmDeleteAccount() {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your clinic account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: executeDeletion,
        },
      ],
    );
  }

  async function executeDeletion() {
    setMessage("Deleting account...");
    const { error } = await supabase.rpc("delete_user");

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    await supabase.auth.signOut();
  }

  // --- AUTHENTICATED STATE (LOGGED IN) ---
  if (session) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <View className="bg-white p-8 rounded-3xl shadow-sm border-2 border-brand-lightblue w-full max-w-md items-center">
          <FontAwesome
            name="shield"
            size={48}
            color="#3F617E"
            className="mb-4"
          />
          <Text className="text-2xl font-black text-brand-darkblue mb-2 text-center">
            Secure Access Active
          </Text>
          <Text className="text-gray-500 mb-8 font-bold text-center">
            Logged in as:{"\n"}
            <Text className="text-brand-darkblue">{session.user.email}</Text>
          </Text>

          <TouchableOpacity
            onPress={signOut}
            className="bg-brand-darkblue px-6 py-4 rounded-xl w-full items-center shadow-sm mb-4"
          >
            <Text className="text-white font-black text-lg uppercase tracking-widest">
              Sign Out
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={confirmDeleteAccount}
            className="border-2 border-rose-200 bg-rose-50 px-6 py-4 rounded-xl w-full items-center"
          >
            <Text className="text-rose-700 font-bold text-lg">
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>

        {message !== "" && (
          <Text className="text-center font-bold mt-6 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {message}
          </Text>
        )}
      </View>
    );
  }

  // --- UNAUTHENTICATED STATE (LOGGED OUT) ---
  return (
    <View className="flex-1 justify-center bg-gray-50 p-6">
      <View className="bg-white p-8 rounded-3xl shadow-sm border-2 border-brand-lightblue max-w-md w-full self-center">
        <View className="items-center mb-6">
          <FontAwesome
            name="stethoscope"
            size={42}
            color="#FDCB58"
            className="mb-3"
          />
          <Text className="text-3xl font-black text-brand-darkblue mb-2 text-center">
            Staff Login
          </Text>
          <Text className="text-gray-500 text-center font-medium">
            Authorized veterinary & rescue access only
          </Text>
        </View>

        <Text className="text-brand-darkblue font-bold mb-2 ml-1 text-sm tracking-widest uppercase">
          Email Address
        </Text>
        <TextInput
          className="bg-gray-50 border-2 border-brand-lightblue rounded-xl px-4 py-4 mb-5 text-brand-darkblue font-bold text-lg"
          onChangeText={setEmail}
          value={email}
          placeholder="vet@clinic.co.uk"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text className="text-brand-darkblue font-bold mb-2 ml-1 text-sm tracking-widest uppercase">
          Password
        </Text>
        <TextInput
          className="bg-gray-50 border-2 border-brand-lightblue rounded-xl px-4 py-4 mb-6 text-brand-darkblue font-bold text-lg"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
        />

        {message !== "" && (
          <Text className="text-center font-bold mb-6 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {message}
          </Text>
        )}

        <TouchableOpacity
          onPress={signInWithEmail}
          disabled={loading}
          className="bg-brand-yellow py-4 rounded-xl items-center mb-4 shadow-sm"
        >
          <Text className="text-brand-dark font-black text-lg uppercase tracking-wider">
            {loading ? "PROCESSING..." : "SIGN IN"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={signUpWithEmail}
          disabled={loading}
          className="py-4 rounded-xl items-center bg-brand-lightblue/20 border-2 border-brand-lightblue"
        >
          <Text className="text-brand-darkblue font-black text-lg uppercase tracking-wider">
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
