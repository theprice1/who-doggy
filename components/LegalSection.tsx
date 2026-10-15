import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface LegalSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>
        {typeof children === "string" ? (
          <Text style={styles.text}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  content: {
    flexDirection: "column",
    gap: 8,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4B5563",
  },
});
