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
    // 1. Call the secure Postgres function we just created
    const { error } = await supabase.rpc("delete_user");

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    // 2. Sign the user out of the local app
    await supabase.auth.signOut();
  }

  if (session) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <View className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md items-center">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Secure Access Active
          </Text>
          <Text className="text-gray-600 mb-8 font-medium text-center">
            Logged in as: {session.user.email}
          </Text>

          <TouchableOpacity
            onPress={signOut}
            className="bg-blue-600 px-6 py-4 rounded-lg w-full items-center shadow-sm mb-4"
          >
            <Text className="text-white font-bold text-lg">Sign Out</Text>
          </TouchableOpacity>

          {/* App Store Required Deletion Button */}
          <TouchableOpacity
            onPress={confirmDeleteAccount}
            className="border border-red-200 bg-red-50 px-6 py-4 rounded-lg w-full items-center"
          >
            <Text className="text-red-700 font-bold text-lg">
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>

        {message !== "" && (
          <Text className="text-center font-bold mt-4 text-red-600">
            {message}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center bg-gray-50 p-6">
      <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full self-center">
        <Text className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
          Staff Login
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          Authorized veterinary & rescue access only
        </Text>

        <Text className="text-gray-700 font-bold mb-2 ml-1">Email Address</Text>
        <TextInput
          className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 mb-5 text-gray-900 text-base"
          onChangeText={setEmail}
          value={email}
          placeholder="vet@clinic.co.uk"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text className="text-gray-700 font-bold mb-2 ml-1">Password</Text>
        <TextInput
          className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 mb-4 text-gray-900 text-base"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="••••••••"
          autoCapitalize="none"
        />

        {message !== "" && (
          <Text className="text-center font-bold mb-4 text-red-600">
            {message}
          </Text>
        )}

        <TouchableOpacity
          onPress={signInWithEmail}
          disabled={loading}
          className="bg-blue-600 py-4 rounded-xl items-center mb-4 shadow-sm"
        >
          <Text className="text-white font-bold text-lg">
            {loading ? "Processing..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={signUpWithEmail}
          disabled={loading}
          className="py-4 rounded-xl items-center bg-gray-100"
        >
          <Text className="text-gray-700 font-bold text-lg">
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
