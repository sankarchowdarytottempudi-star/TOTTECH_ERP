import React, { useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../App";
import {
  Field,
  PrimaryButton,
  StatusMessage,
} from "../components/FormControls";
import AuthShell from "../components/AuthShell";
import TottechAIBadge from "../components/TottechAIBadge";
import { loginRequest } from "../api/client";
import {
  resolveMobileWorkspace,
  routeForWorkspace,
} from "../lib/projectRouting";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen({
  navigation,
}: Props) {
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [message, setMessage] =
    useState("");

  const login = async () => {
    try {
      setLoading(true);
      setMessage("");
      const payload = await loginRequest(
        email.trim(),
        password
      );
      const workspace =
        resolveMobileWorkspace(
          email,
          payload
        );
      const route =
        routeForWorkspace(workspace);

      if (route === "ClinicalWorkspace") {
        navigation.replace(
          "ClinicalWorkspace",
          {
            lockedToClinical: true,
          }
        );
      } else {
        navigation.replace("SchoolWorkspace");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <View style={styles.form}>
        <Field
          label="Username / Email"
          value={email}
          placeholder="Username or email"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <Field
          label="Password"
          value={password}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
        />
        {message ? (
          <StatusMessage
            tone="error"
            message={message}
          />
        ) : null}
        <PrimaryButton
          label="Sign in"
          loading={loading}
          disabled={!email || !password}
          onPress={login}
        />
      </View>
      <View style={styles.ai}>
        <TottechAIBadge
          size="md"
          showText
        />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  ai: {
    marginTop: 16,
    alignItems: "center",
  },
});
