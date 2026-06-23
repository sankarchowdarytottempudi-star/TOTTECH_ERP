import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../theme/colors";

const logoUri =
  "https://erp.tottechsolutions.com/brand/tottech-ai/logo.png";

type Props = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
};

const dimensions = {
  sm: 34,
  md: 48,
  lg: 64,
};

export default function TottechAIBadge({
  size = "md",
  showText = false,
}: Props) {
  const [failed, setFailed] =
    useState(false);
  const dimension = dimensions[size];

  return (
    <View style={styles.row}>
      {!failed ? (
        <Image
          source={{ uri: logoUri }}
          onError={() => setFailed(true)}
          style={[
            styles.logo,
            {
              width: dimension,
              height: dimension,
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: dimension,
              height: dimension,
            },
          ]}
        >
          <Text style={styles.fallbackText}>
            AI
          </Text>
        </View>
      )}

      {showText ? (
        <View style={styles.copy}>
          <Text style={styles.brand}>
            TOTTECH AI
          </Text>
          <Text style={styles.tagline}>
            Gateway To Innovation
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.goldSoft,
    backgroundColor: colors.navy2,
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.goldSoft,
    backgroundColor: colors.navy2,
  },
  fallbackText: {
    color: colors.goldSoft,
    fontSize: 14,
    fontWeight: "900",
  },
  copy: {
    minWidth: 0,
    flexShrink: 1,
  },
  brand: {
    color: colors.gold,
    fontSize: 17,
    fontWeight: "900",
  },
  tagline: {
    marginTop: 2,
    color: colors.goldSoft,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});
