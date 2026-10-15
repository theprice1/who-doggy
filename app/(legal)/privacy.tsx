import { ScrollView, StyleSheet, Text } from "react-native";
import LegalSection from "../../components/LegalSection";

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.lastUpdated}>Last Updated: October 2026</Text>

      <LegalSection title="1. Introduction">
        Welcome to WhoDoggy. We are committed to protecting your personal data
        and respecting your privacy in accordance with UK GDPR. This policy
        explains how we collect, use, and safeguard your information.
      </LegalSection>

      <LegalSection title="2. Camera & Audio Access">
        WhoDoggy requests camera access strictly for the purpose of scanning
        veterinary paperwork and microchip barcodes.
        {"\n\n"}
        Images captured by the camera are processed directly on your device. We
        do not secretly record, upload, or store raw photographs on our servers.
        Audio permissions are required by the underlying camera software but are
        not actively recorded or used by WhoDoggy.
      </LegalSection>

      <LegalSection title="3. Data Storage & Supabase">
        To provide account synchronization and database lookups, your profile
        data and scan histories are stored securely using Supabase. Supabase
        acts as our data processor and complies with strict cloud security
        protocols. Your passwords are cryptographically hashed and cannot be
        read by our team.
      </LegalSection>

      <LegalSection title="4. Local Storage (Cookies)">
        As a native mobile application, WhoDoggy does not use traditional web
        "cookies." However, we do utilize your device's secure local storage to
        cache authentication tokens. This keeps you logged in between sessions
        and ensures the app functions smoothly in areas with poor internet
        connectivity.
      </LegalSection>

      <LegalSection title="5. Your Rights">
        Under UK GDPR, you have the right to access, rectify, or erase your
        personal data. You may delete your account and all associated data at
        any time from the app settings, or by contacting our support team.
      </LegalSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    fontStyle: "italic",
  },
});
