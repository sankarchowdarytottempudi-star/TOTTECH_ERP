import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../App";
import ModuleCard from "../components/ModuleCard";
import ScreenShell from "../components/ScreenShell";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Enterprise"
>;

const modules: Array<{
  title: string;
  route?: keyof RootStackParamList;
}> = [
  {
    title: "Finance",
    route: "Finance",
  },
  {
    title: "Concessions",
    route: "Concessions",
  },
  {
    title: "Transport",
    route: "Transport",
  },
  {
    title: "Hostel",
    route: "Hostel",
  },
  {
    title: "Dining",
    route: "Dining",
  },
  {
    title: "Parent Portal",
    route: "Notifications",
  },
  {
    title: "Notifications",
    route: "Notifications",
  },
  {
    title: "User Management",
    route: "UserManagement",
  },
  {
    title: "Subscription Management",
    route: "Platform",
  },
  {
    title: "Plan Management",
    route: "Platform",
  },
  {
    title: "Usage Metering",
    route: "FinanceDrilldown",
  },
];

export default function EnterpriseModuleScreens({
  navigation,
}: Props) {
  const navigateTo = (
    route: keyof RootStackParamList
  ) => {
    navigation.navigate(route as never);
  };

  return (
    <ScreenShell
      title="Enterprise"
      subtitle="Commercial SaaS and school operations modules."
    >
      {modules.map((module) => (
        <ModuleCard
          key={module.title}
          title={module.title}
          detail="Feature access is governed by database-driven permissions and feature flags."
          onPress={
            module.route
              ? () =>
                  navigateTo(module.route!)
              : undefined
          }
        />
      ))}
    </ScreenShell>
  );
}
