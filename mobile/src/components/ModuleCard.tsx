import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../theme/colors";

type Props = {
  title: string;
  value?: string | number;
  detail?: string;
  onPress?: () => void;
  badge?: React.ReactNode;
  featured?: boolean;
};

export default function ModuleCard({
  title,
  value,
  detail,
  onPress,
  badge,
  featured = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
          styles.card,
          featured && styles.featured,
          pressed && styles.pressed,
        ]}
    >
      <View
        style={[
          styles.accent,
          featured &&
            styles.accentFeatured,
        ]}
      />
      {badge ? (
        <View style={styles.badge}>
          {badge}
        </View>
      ) : null}
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {detail ? (
          <Text style={styles.detail}>
            {detail}
          </Text>
        ) : null}
      </View>
      {value !== undefined ? (
        <View style={styles.valuePill}>
          <Text style={styles.value}>
            {value}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 92,
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },
  featured: {
    borderColor: colors.borderWarm,
    backgroundColor: colors.surfaceWarm,
  },
  pressed: {
    opacity: 0.86,
    transform: [
      {
        scale: 0.992,
      },
    ],
  },
  accent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.black,
  },
  accentFeatured: {
    backgroundColor: colors.gold,
  },
  badge: {
    marginTop: 2,
    marginBottom: 1,
  },
  copy: {
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 16.5,
    fontWeight: "900",
    lineHeight: 22,
  },
  detail: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  valuePill: {
    alignSelf: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.goldPale,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  value: {
    color: colors.goldDeep,
    fontSize: 20,
    fontWeight: "900",
  },
});
