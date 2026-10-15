import { ScrollView, StyleSheet, Text } from "react-native";
import LegalSection from "../../components/LegalSection";

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.lastUpdated}>Last Updated: October 2026</Text>

      <LegalSection title="1. Acceptance of Terms">
        By creating an account or using WhoDoggy, you agree to these Terms of
        Service. If you do not agree, please do not use the application.
      </LegalSection>

      <LegalSection title="2. Purpose of the App">
        WhoDoggy is designed to assist in scanning and cataloging microchip
        barcodes and veterinary records. The data provided through the app is
        for organizational purposes and should not replace official veterinary
        documentation or professional medical advice.
      </LegalSection>

      <LegalSection title="3. User Accounts">
        You are responsible for maintaining the confidentiality of your login
        credentials. You must notify us immediately of any unauthorized use of
        your account.
      </LegalSection>

      <LegalSection title="4. Account Termination">
        We reserve the right to suspend or terminate your account if you violate
        these terms, engage in abusive behavior, or attempt to manipulate the
        application's backend infrastructure.
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
