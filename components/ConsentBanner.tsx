import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    checkConsent();
  }, []);

  const checkConsent = async () => {
    const hasConsented = await AsyncStorage.getItem("user_consent");
    if (!hasConsented) {
      setIsVisible(true);
    }
  };

  const handleAgree = async () => {
    await AsyncStorage.setItem("user_consent", "true");
    setIsVisible(false);
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Welcome to WhoDoggy</Text>
          <Text style={styles.text}>
            Before using the app, please review our legal terms. We use your
            camera strictly to scan microchips and veterinary paperwork, and
            your device storage to keep you logged in.
          </Text>

          <View style={styles.linksRow}>
            <Link href="/(legal)/privacy" style={styles.link}>
              Privacy Policy
            </Link>
            <Text style={styles.dot}>•</Text>
            <Link href="/(legal)/terms" style={styles.link}>
              Terms of Service
            </Link>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleAgree}>
            <Text style={styles.buttonText}>I Agree & Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 16,
  },
  linksRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  link: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  dot: {
    marginHorizontal: 8,
    color: "#9CA3AF",
  },
  button: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
