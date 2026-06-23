import React from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";

const links = [
  {
    title: "Open Website",
    detail:
      "Launch the corporate website for Tottempudi Software Solutions.",
    url: "https://tottechsolutions.com",
  },
  {
    title: "TOTTECH ONE",
    detail:
      "Explore the school and enterprise management platform.",
    url: "https://tottechsolutions.com/products/tottech-one",
  },
  {
    title: "Clinical Services",
    detail:
      "Explore the hospital, IVF and healthcare management platform.",
    url: "https://tottechsolutions.com/products/tottech-clinical-services",
  },
  {
    title: "Services",
    detail:
      "View custom software, AI, cloud, mobile and integration services.",
    url: "https://tottechsolutions.com/services",
  },
  {
    title: "Contact TOTTECH",
    detail:
      "Send an inquiry or request a consultation.",
    url: "https://tottechsolutions.com/contact",
  },
];

export default function CorporateApp() {
  const open = (url: string) => {
    void Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            Tottempudi Software Solutions
          </Text>
          <Text style={styles.title}>
            TOTTECH Solutions
          </Text>
          <Text style={styles.subtitle}>
            Empowering Organizations Through Intelligent Technology
          </Text>
        </View>

        <View style={styles.grid}>
          {links.map((link) => (
            <Pressable
              key={link.title}
              onPress={() => open(link.url)}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cardTitle}>
                {link.title}
              </Text>
              <Text style={styles.cardText}>
                {link.detail}
              </Text>
              <Text style={styles.cardAction}>
                Open →
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F3EA",
  },
  page: {
    gap: 18,
    padding: 18,
  },
  hero: {
    gap: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.48)",
    backgroundColor: "#080705",
    padding: 22,
  },
  eyebrow: {
    color: "#D4AF37",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  subtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "700",
  },
  grid: {
    gap: 12,
  },
  card: {
    gap: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(11,20,36,0.12)",
    backgroundColor: "#FFFFFF",
    padding: 18,
    shadowColor: "#0A182C",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 5,
  },
  pressed: {
    opacity: 0.86,
    transform: [
      {
        scale: 0.992,
      },
    ],
  },
  cardTitle: {
    color: "#07111F",
    fontSize: 18,
    fontWeight: "900",
  },
  cardText: {
    color: "#58677B",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "650",
  },
  cardAction: {
    color: "#8A6500",
    fontSize: 13,
    fontWeight: "900",
  },
});
