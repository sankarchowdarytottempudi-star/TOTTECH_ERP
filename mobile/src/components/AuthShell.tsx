import React, {
  PropsWithChildren,
} from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../theme/colors";

const logoUri =
  "https://erp.tottechsolutions.com/images/logo.png";

export default function AuthShell({
  children,
}: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brandCard}>
            <Image
              source={{ uri: logoUri }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>
              TOTTECH ONE
            </Text>
            <Text style={styles.title}>
              Unified Platform Login
            </Text>
            <Text style={styles.subtitle}>
              TOTTECH ONE users open the school ERP. Clinical users open Clinical Services.
            </Text>
          </View>
          <View style={styles.formCard}>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 18,
    gap: 18,
  },
  brandCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.black,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 140,
    height: 106,
  },
  brandName: {
    color: colors.gold,
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0,
  },
  title: {
    marginTop: 8,
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
  },
});
