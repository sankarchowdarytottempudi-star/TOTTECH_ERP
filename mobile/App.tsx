import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import StudentsScreen from "./src/screens/StudentsScreen";
import TeachersScreen from "./src/screens/TeachersScreen";
import AttendanceScreen from "./src/screens/AttendanceScreen";
import AcademicsScreen from "./src/screens/AcademicsScreen";
import EnterpriseModuleScreens from "./src/screens/EnterpriseModuleScreens";
import OperationalScreens from "./src/screens/OperationalScreens";
import DiningScreen from "./src/screens/DiningScreen";
import HostelScreen from "./src/screens/HostelScreen";
import TransportScreen from "./src/screens/TransportScreen";
import WebViewScreen from "./src/screens/WebViewScreen";
import {
  ClinicalWorkspaceTabs,
  SchoolWorkspaceTabs,
} from "./src/navigation/WorkspaceTabs";
import {
  AdmissionsScreen,
  AICommandCenterScreen,
  AuditCenterScreen,
  AutomationEngineScreen,
  ConcessionsScreen,
  FinanceDrilldownScreen,
  FinanceScreen,
  GovernanceScreen,
  ImportCenterScreen,
  KnowledgeBaseScreen,
  NotificationsScreen,
  ObservabilityScreen,
  OnboardingScreen,
  PlatformScreen,
  ProfileScreen,
  RecordDetailScreen,
  ReportsScreen,
  SchoolManagementScreen,
  SettingsScreen,
  StudentDetailScreen,
  TimetableScreen,
  UserManagementScreen,
  WarRoomScreen,
  WorkflowBuilderScreen,
} from "./src/screens/ApkRecoveredScreens";

export type RootStackParamList = {
  Login: undefined;
  SchoolWorkspace: undefined;
  ClinicalWorkspace:
    | {
        lockedToClinical?: boolean;
      }
    | undefined;
  Dashboard: undefined;
  Students: undefined;
  Teachers: undefined;
  Attendance: undefined;
  Marks: undefined;
  Enterprise: undefined;
  Operations: undefined;
  Academics: undefined;
  Admissions: undefined;
  AICommandCenter: undefined;
  AuditCenter: undefined;
  AutomationEngine: undefined;
  Concessions: undefined;
  Dining: undefined;
  Exams: undefined;
  Finance: undefined;
  FinanceDrilldown: undefined;
  Governance: undefined;
  Hostel: undefined;
  Homework: undefined;
  ImportCenter: undefined;
  KnowledgeBase: undefined;
  Notifications: undefined;
  Observability: undefined;
  Onboarding: undefined;
  Platform: undefined;
  Profile: undefined;
  RecordDetail: undefined;
  Reports: undefined;
  SchoolManagement: undefined;
  Settings: undefined;
  StudentDetail: undefined;
  Timetable: undefined;
  Transport: undefined;
  UserManagement: undefined;
  WarRoom: undefined;
  WorkflowBuilder: undefined;
  WebView: {
    title: string;
    url: string;
  };
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#080705",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "900",
          },
          contentStyle: {
            backgroundColor: "#f7f3ea",
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SchoolWorkspace"
          component={SchoolWorkspaceTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ClinicalWorkspace"
          component={ClinicalWorkspaceTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: "TOTTECH Platform" }}
        />
        <Stack.Screen
          name="Students"
          component={StudentsScreen}
        />
        <Stack.Screen
          name="Teachers"
          component={TeachersScreen}
        />
        <Stack.Screen
          name="Attendance"
          component={AttendanceScreen}
        />
        <Stack.Screen
          name="Marks"
          component={AcademicsScreen}
        />
        <Stack.Screen
          name="Enterprise"
          component={EnterpriseModuleScreens}
        />
        <Stack.Screen
          name="Operations"
          component={OperationalScreens}
        />
        <Stack.Screen
          name="Academics"
          component={AcademicsScreen}
        />
        <Stack.Screen
          name="Admissions"
          component={AdmissionsScreen}
        />
        <Stack.Screen
          name="AICommandCenter"
          component={AICommandCenterScreen}
          options={{ title: "AI Command Center" }}
        />
        <Stack.Screen
          name="AuditCenter"
          component={AuditCenterScreen}
          options={{ title: "Audit Center" }}
        />
        <Stack.Screen
          name="AutomationEngine"
          component={AutomationEngineScreen}
          options={{ title: "Automation" }}
        />
        <Stack.Screen
          name="Concessions"
          component={ConcessionsScreen}
        />
        <Stack.Screen
          name="Dining"
          component={DiningScreen}
        />
        <Stack.Screen
          name="Exams"
          component={AcademicsScreen}
        />
        <Stack.Screen
          name="Finance"
          component={FinanceScreen}
        />
        <Stack.Screen
          name="FinanceDrilldown"
          component={FinanceDrilldownScreen}
          options={{ title: "Finance Drilldown" }}
        />
        <Stack.Screen
          name="Governance"
          component={GovernanceScreen}
        />
        <Stack.Screen
          name="Hostel"
          component={HostelScreen}
        />
        <Stack.Screen
          name="Homework"
          component={AcademicsScreen}
        />
        <Stack.Screen
          name="ImportCenter"
          component={ImportCenterScreen}
          options={{ title: "Import Center" }}
        />
        <Stack.Screen
          name="KnowledgeBase"
          component={KnowledgeBaseScreen}
          options={{ title: "Knowledge Base" }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
        />
        <Stack.Screen
          name="Observability"
          component={ObservabilityScreen}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
        />
        <Stack.Screen
          name="Platform"
          component={PlatformScreen}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
        />
        <Stack.Screen
          name="RecordDetail"
          component={RecordDetailScreen}
          options={{ title: "Record Detail" }}
        />
        <Stack.Screen
          name="Reports"
          component={ReportsScreen}
        />
        <Stack.Screen
          name="SchoolManagement"
          component={SchoolManagementScreen}
          options={{ title: "Schools" }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />
        <Stack.Screen
          name="StudentDetail"
          component={StudentDetailScreen}
          options={{ title: "Student 360" }}
        />
        <Stack.Screen
          name="Timetable"
          component={TimetableScreen}
        />
        <Stack.Screen
          name="Transport"
          component={TransportScreen}
        />
        <Stack.Screen
          name="UserManagement"
          component={UserManagementScreen}
          options={{ title: "Users" }}
        />
        <Stack.Screen
          name="WarRoom"
          component={WarRoomScreen}
          options={{ title: "War Room" }}
        />
        <Stack.Screen
          name="WorkflowBuilder"
          component={WorkflowBuilderScreen}
          options={{ title: "Workflow Builder" }}
        />
        <Stack.Screen
          name="WebView"
          component={WebViewScreen}
          options={({ route }) => ({
            title: route.params.title,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
