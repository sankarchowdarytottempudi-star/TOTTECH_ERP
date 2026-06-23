import React, {
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";

import type { RootStackParamList } from "../../App";
import {
  API_BASE_URL,
  getStoredCookie,
} from "../api/client";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "WebView"
>;

export default function WebViewScreen({
  route,
}: Props) {
  const [cookie, setCookie] =
    useState<string | null>(null);
  const [loading, setLoading] =
    useState(true);
  const url = route.params.url.startsWith(
    "http"
  )
    ? route.params.url
    : `${API_BASE_URL}${route.params.url}`;

  useEffect(() => {
    getStoredCookie()
      .then(setCookie)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          color={colors.gold}
        />
        <Text style={styles.loadingText}>
          Opening {route.params.title}...
        </Text>
      </View>
    );
  }

  return (
    <WebView
      source={{
        uri: url,
        headers: cookie
          ? {
              Cookie: cookie,
            }
          : undefined,
      }}
      sharedCookiesEnabled
      thirdPartyCookiesEnabled
      startInLoadingState
      renderLoading={() => (
        <View style={styles.webLoading}>
          <ActivityIndicator
            color={colors.gold}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.bg,
  },
  loadingText: {
    color: colors.text,
    fontWeight: "900",
  },
  webLoading: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
});
