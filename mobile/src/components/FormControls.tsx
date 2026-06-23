import React, {
  PropsWithChildren,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "../theme/colors";

export type Option = {
  label: string;
  value: string;
  detail?: string;
};

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad";
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor="#8a98aa"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={
          multiline ? "top" : "center"
        }
      />
    </View>
  );
}

export function SelectList({
  label,
  value,
  options,
  onChange,
  emptyLabel = "No options",
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  emptyLabel?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
      </Text>
      {options.length === 0 ? (
        <Text style={styles.emptyText}>
          {emptyLabel}
        </Text>
      ) : (
        <View style={styles.optionWrap}>
          {options.map((option) => {
            const active =
              option.value === value;

            return (
              <Pressable
                key={option.value}
                onPress={() =>
                  onChange(option.value)
                }
                style={[
                  styles.option,
                  active &&
                    styles.optionActive,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    active &&
                      styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {option.detail ? (
                  <Text
                    style={[
                      styles.optionDetail,
                      active &&
                        styles.optionDetailActive,
                    ]}
                  >
                    {option.detail}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        (disabled || loading) &&
          styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.secondaryButton}
    >
      <Text
        style={styles.secondaryButtonText}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function StatusMessage({
  message,
  tone = "info",
}: {
  message: string;
  tone?: "info" | "success" | "error";
}) {
  const color =
    tone === "error"
      ? colors.danger
      : tone === "success"
      ? colors.goldDeep
      : colors.text;

  return (
    <View
      style={[
        styles.messageBox,
        tone === "error" &&
          styles.messageError,
        tone === "success" &&
          styles.messageSuccess,
      ]}
    >
      <Text
        style={[
          styles.message,
          { color },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

export function Panel({
  children,
}: PropsWithChildren) {
  return (
    <View style={styles.panel}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    width: "100%",
    gap: 6,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  multiline: {
    minHeight: 116,
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    maxWidth: "100%",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionActive: {
    borderColor: colors.gold,
    backgroundColor: colors.black,
  },
  optionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  optionTextActive: {
    color: colors.goldSoft,
  },
  optionDetail: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
  },
  optionDetailActive: {
    color: colors.goldSoft,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
  },
  button: {
    width: "100%",
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.surfaceWarm,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "900",
  },
  message: {
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 19,
  },
  messageBox: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.surfaceWarm,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  messageError: {
    borderColor: colors.danger,
    backgroundColor: "#fff5ef",
  },
  messageSuccess: {
    borderColor: colors.borderWarm,
    backgroundColor: colors.goldPale,
  },
  panel: {
    gap: 13,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 3,
  },
});
