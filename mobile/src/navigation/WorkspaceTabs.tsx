import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreen from "../screens/DashboardScreen";
import StudentsScreen from "../screens/StudentsScreen";
import AcademicsScreen from "../screens/AcademicsScreen";
import OperationalScreens from "../screens/OperationalScreens";
import {
  AICommandCenterScreen,
} from "../screens/ApkRecoveredScreens";
import {
  ClinicalAIScreen,
  ClinicalCareScreen,
  ClinicalHomeScreen,
  ClinicalOperationsScreen,
  ClinicalPatientsScreen,
} from "../screens/ClinicalMobileWorkspaceScreens";
import { colors } from "../theme/colors";

export type SchoolTabParamList = {
  SchoolHome: undefined;
  SchoolStudents: undefined;
  SchoolAcademics: undefined;
  SchoolOperations: undefined;
  SchoolAI: undefined;
};

export type ClinicalTabParamList = {
  ClinicalHome: undefined;
  ClinicalPatients: undefined;
  ClinicalCare: undefined;
  ClinicalOperations: undefined;
  ClinicalAI: undefined;
};

const SchoolTabs =
  createBottomTabNavigator<SchoolTabParamList>();
const ClinicalTabs =
  createBottomTabNavigator<ClinicalTabParamList>();

const schoolLabels: Record<
  keyof SchoolTabParamList,
  {
    label: string;
    icon: string;
  }
> = {
  SchoolHome: {
    label: "Home",
    icon: "OS",
  },
  SchoolStudents: {
    label: "Students",
    icon: "360",
  },
  SchoolAcademics: {
    label: "Academics",
    icon: "AC",
  },
  SchoolOperations: {
    label: "Ops",
    icon: "OP",
  },
  SchoolAI: {
    label: "AI",
    icon: "AI",
  },
};

const clinicalLabels: Record<
  keyof ClinicalTabParamList,
  {
    label: string;
    icon: string;
  }
> = {
  ClinicalHome: {
    label: "Home",
    icon: "OS",
  },
  ClinicalPatients: {
    label: "Patients",
    icon: "PT",
  },
  ClinicalCare: {
    label: "Care",
    icon: "RX",
  },
  ClinicalOperations: {
    label: "Ops",
    icon: "IVF",
  },
  ClinicalAI: {
    label: "AI",
    icon: "AI",
  },
};

function TabIcon({
  focused,
  icon,
}: {
  focused: boolean;
  icon: string;
}) {
  return (
    <View
      style={[
        styles.iconPill,
        focused && styles.iconPillActive,
      ]}
    >
      <Text
        style={[
          styles.iconText,
          focused && styles.iconTextActive,
        ]}
      >
        {icon}
      </Text>
    </View>
  );
}

function schoolOptions(routeName: keyof SchoolTabParamList) {
  const meta = schoolLabels[routeName];
  return {
    title: meta.label,
    tabBarLabel: meta.label,
    tabBarIcon: ({
      focused,
    }: {
      focused: boolean;
    }) => (
      <TabIcon
        focused={focused}
        icon={meta.icon}
      />
    ),
  };
}

function clinicalOptions(
  routeName: keyof ClinicalTabParamList
) {
  const meta = clinicalLabels[routeName];
  return {
    title: meta.label,
    tabBarLabel: meta.label,
    tabBarIcon: ({
      focused,
    }: {
      focused: boolean;
    }) => (
      <TabIcon
        focused={focused}
        icon={meta.icon}
      />
    ),
  };
}

export function SchoolWorkspaceTabs() {
  return (
    <SchoolTabs.Navigator
      initialRouteName="SchoolHome"
      screenOptions={workspaceTabOptions}
    >
      <SchoolTabs.Screen
        name="SchoolHome"
        component={DashboardScreen as React.ComponentType<any>}
        options={schoolOptions("SchoolHome")}
      />
      <SchoolTabs.Screen
        name="SchoolStudents"
        component={StudentsScreen as React.ComponentType<any>}
        options={schoolOptions("SchoolStudents")}
      />
      <SchoolTabs.Screen
        name="SchoolAcademics"
        component={AcademicsScreen as React.ComponentType<any>}
        options={schoolOptions("SchoolAcademics")}
      />
      <SchoolTabs.Screen
        name="SchoolOperations"
        component={OperationalScreens as React.ComponentType<any>}
        options={schoolOptions("SchoolOperations")}
      />
      <SchoolTabs.Screen
        name="SchoolAI"
        component={AICommandCenterScreen as React.ComponentType<any>}
        options={schoolOptions("SchoolAI")}
      />
    </SchoolTabs.Navigator>
  );
}

export function ClinicalWorkspaceTabs() {
  return (
    <ClinicalTabs.Navigator
      initialRouteName="ClinicalHome"
      screenOptions={workspaceTabOptions}
    >
      <ClinicalTabs.Screen
        name="ClinicalHome"
        component={ClinicalHomeScreen}
        options={clinicalOptions("ClinicalHome")}
      />
      <ClinicalTabs.Screen
        name="ClinicalPatients"
        component={ClinicalPatientsScreen}
        options={clinicalOptions("ClinicalPatients")}
      />
      <ClinicalTabs.Screen
        name="ClinicalCare"
        component={ClinicalCareScreen}
        options={clinicalOptions("ClinicalCare")}
      />
      <ClinicalTabs.Screen
        name="ClinicalOperations"
        component={ClinicalOperationsScreen}
        options={clinicalOptions("ClinicalOperations")}
      />
      <ClinicalTabs.Screen
        name="ClinicalAI"
        component={ClinicalAIScreen}
        options={clinicalOptions("ClinicalAI")}
      />
    </ClinicalTabs.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    minHeight: 76,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(242,209,138,0.34)",
    backgroundColor: colors.black,
    shadowColor: colors.shadow,
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: -8,
    },
    elevation: 18,
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "900",
  },
  iconPill: {
    minWidth: 36,
    minHeight: 28,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  iconPillActive: {
    borderColor: colors.goldSoft,
    backgroundColor: "rgba(242,209,138,0.16)",
  },
  iconText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 10,
    fontWeight: "900",
  },
  iconTextActive: {
    color: colors.goldSoft,
  },
});

const workspaceTabOptions = {
  headerShown: false,
  tabBarStyle: styles.tabBar,
  tabBarItemStyle: styles.tabItem,
  tabBarActiveTintColor: colors.goldSoft,
  tabBarInactiveTintColor: "rgba(255,255,255,0.62)",
  tabBarLabelStyle: styles.tabLabel,
};
