import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  apiRequest,
  getStoredUser,
  logoutRequest,
} from "../api/client";
import { colors } from "../theme/colors";

const logoUri =
  "https://erp.tottechsolutions.com/images/logo.png";
type Workspace = "school" | "clinical";

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
  workspace?: Workspace;
}>;

type User = {
  full_name?: string;
  email?: string;
  username?: string;
  role?: string;
  school_name?: string;
};

type School = {
  id: number | string | null;
  school_name?: string | null;
  schoolName?: string | null;
  school_code?: string | null;
  logoUrl?: string | null;
  school_logo?: string | null;
  logo_url?: string | null;
  aiDisplayName?: string | null;
  aiTagline?: string | null;
  is_all_schools?: boolean;
};

type AcademicYear = {
  id: number | string;
  academic_year?: string | null;
  is_current?: boolean | null;
  is_selected?: boolean;
};

type MenuItem = {
  label: string;
  detail: string;
  icon: string;
  route?: string;
  url?: string;
};

const schoolMenu: MenuItem[] = [
  {
    label: "Dashboard",
    detail: "School command center",
    icon: "OS",
    route: "SchoolHome",
    url: "/",
  },
  {
    label: "Schools",
    detail: "School 360 and setup",
    icon: "SC",
    url: "/schools/list",
  },
  {
    label: "Students",
    detail: "Student 360 and admissions",
    icon: "ST",
    route: "SchoolStudents",
    url: "/students/list",
  },
  {
    label: "Teachers",
    detail: "Teacher 360 and staff",
    icon: "TE",
    url: "/teachers",
  },
  {
    label: "School 360",
    detail: "School profile and governance",
    icon: "S3",
    url: "/schools/list",
  },
  {
    label: "Academics",
    detail: "Classes, exams, homework",
    icon: "AC",
    route: "SchoolAcademics",
    url: "/academics",
  },
  {
    label: "Attendance",
    detail: "Daily and calendar view",
    icon: "AT",
    url: "/attendance/students",
  },
  {
    label: "Homework",
    detail: "Assignments and submissions",
    icon: "HW",
    url: "/academics/homework",
  },
  {
    label: "Question Bank",
    detail: "Reusable question library",
    icon: "QB",
    url: "/academics/question-bank",
  },
  {
    label: "Question Papers",
    detail: "Paper generation and review",
    icon: "QP",
    url: "/academics/question-papers",
  },
  {
    label: "Exams",
    detail: "Schedules and exam setup",
    icon: "EX",
    url: "/academics/exams",
  },
  {
    label: "Exam Schedule",
    detail: "Schedule and paper linkage",
    icon: "ES",
    url: "/academics/exam-schedule",
  },
  {
    label: "Marks Entry",
    detail: "Question-wise marks and AI scoring",
    icon: "ME",
    url: "/academics/marks-entry",
  },
  {
    label: "Finance",
    detail: "Invoices and collections",
    icon: "FI",
    url: "/finance",
  },
  {
    label: "Invoices",
    detail: "Fee invoices and printouts",
    icon: "IN",
    url: "/finance/invoices",
  },
  {
    label: "Payments",
    detail: "Collections and receipts",
    icon: "PM",
    url: "/finance/payments",
  },
  {
    label: "Concessions",
    detail: "Fee waivers and approvals",
    icon: "CN",
    url: "/finance/concessions",
  },
  {
    label: "Expenses",
    detail: "School expense register",
    icon: "EX",
    url: "/finance/expenses",
  },
  {
    label: "Promotion Center",
    detail: "Academic year rollover",
    icon: "PR",
    url: "/promotions",
  },
  {
    label: "Dining",
    detail: "Meals and attendance",
    icon: "DI",
    url: "/dining",
  },
  {
    label: "Transport",
    detail: "Routes and assignment",
    icon: "TR",
    url: "/transport",
  },
  {
    label: "Hostel",
    detail: "Rooms and allocation",
    icon: "HO",
    url: "/hostel",
  },
  {
    label: "Operations",
    detail: "Command center and workflow tools",
    icon: "OP",
    url: "/operations",
  },
  {
    label: "Reports",
    detail: "Analytics and exports",
    icon: "RP",
    url: "/reports",
  },
  {
    label: "Analytics",
    detail: "Principal and executive intelligence",
    icon: "AN",
    url: "/principal-analytics",
  },
  {
    label: "Communication",
    detail: "Messages and announcements",
    icon: "CM",
    url: "/communication",
  },
  {
    label: "PTM",
    detail: "Parent teacher meetings",
    icon: "PT",
    url: "/ptm",
  },
  {
    label: "Complaints",
    detail: "Complaints and suggestions",
    icon: "CS",
    url: "/communication/feedback",
  },
  {
    label: "Suggestions",
    detail: "Feedback and issue tracking",
    icon: "SU",
    url: "/communication/feedback",
  },
  {
    label: "Leave Management",
    detail: "Student and staff leave",
    icon: "LV",
    url: "/hrms/leave-management",
  },
  {
    label: "Payroll",
    detail: "Salary and payslips",
    icon: "PY",
    url: "/hrms/payroll",
  },
  {
    label: "HRMS",
    detail: "Employee operations center",
    icon: "HR",
    url: "/hrms",
  },
  {
    label: "Provident Fund (PF)",
    detail: "EPFO guidance and employee PF fields",
    icon: "PF",
    url: "/hrms/pf",
  },
  {
    label: "User Management",
    detail: "Roles, access and users",
    icon: "UM",
    url: "/settings/users",
  },
  {
    label: "Roles",
    detail: "Role definitions and permissions",
    icon: "RL",
    url: "/settings/roles",
  },
  {
    label: "Permissions",
    detail: "Permission mapping",
    icon: "PS",
    url: "/settings/roles",
  },
  {
    label: "Settings",
    detail: "School setup and configuration",
    icon: "SE",
    url: "/settings",
  },
  {
    label: "School Setup",
    detail: "Branding and profile",
    icon: "SS",
    url: "/school-setup",
  },
  {
    label: "TOTTECH AI",
    detail: "AI command center",
    icon: "AI",
    route: "SchoolAI",
    url: "/ai-command-center",
  },
  {
    label: "SchoolGPT",
    detail: "School assistant",
    icon: "SG",
    url: "/schoolgpt",
  },
  {
    label: "Student 360",
    detail: "Student profile, timeline and intelligence",
    icon: "S3",
    url: "/student-dna",
  },
  {
    label: "Teacher 360",
    detail: "Faculty intelligence and performance",
    icon: "T3",
    url: "/faculty-intelligence",
  },
  {
    label: "War Room",
    detail: "Executive command center",
    icon: "WR",
    route: "WarRoom",
    url: "/war-room",
  },
  {
    label: "AI Insights",
    detail: "School AI insights and predictions",
    icon: "AI",
    url: "/ai-dashboard",
  },
];

const clinicalMenu: MenuItem[] = [
  {
    label: "Dashboard",
    detail: "Clinical command center",
    icon: "OS",
    route: "ClinicalHome",
    url: "/clinical-services",
  },
  {
    label: "Patients",
    detail: "Registration and Patient 360",
    icon: "PT",
    route: "ClinicalPatients",
    url: "/clinical-services/patients",
  },
  {
    label: "Patient 360",
    detail: "Timeline and patient history",
    icon: "360",
    url: "/clinical-services/patients",
  },
  {
    label: "Clinical Care",
    detail: "OP, IP, ER, ICU and OT",
    icon: "RX",
    route: "ClinicalCare",
    url: "/clinical-services/hms/op",
  },
  {
    label: "OPD",
    detail: "Consultation and follow-up",
    icon: "OP",
    url: "/clinical-services/hms/op",
  },
  {
    label: "IPD",
    detail: "Admission and discharge",
    icon: "IP",
    url: "/clinical-services/ip",
  },
  {
    label: "ICU",
    detail: "Critical care monitoring",
    icon: "IC",
    url: "/clinical-services/icu",
  },
  {
    label: "OT",
    detail: "Operation theatre scheduling",
    icon: "OT",
    url: "/clinical-services/ot",
  },
  {
    label: "IVF & Fertility",
    detail: "Cycles and embryology",
    icon: "IVF",
    route: "ClinicalOperations",
    url: "/clinical-services/ivf",
  },
  {
    label: "Embryology",
    detail: "Embryology workbench",
    icon: "EM",
    url: "/clinical-services/ivf/embryology",
  },
  {
    label: "Laboratory",
    detail: "Orders and results",
    icon: "LB",
    url: "/clinical-services/hms/lab-orders",
  },
  {
    label: "Radiology",
    detail: "Imaging and PACS",
    icon: "RD",
    url: "/clinical-services/radiology",
  },
  {
    label: "Pharmacy",
    detail: "Dispense and inventory",
    icon: "PH",
    url: "/clinical-services/pharmacy",
  },
  {
    label: "Billing",
    detail: "Revenue and claims",
    icon: "BI",
    url: "/clinical-services/billing",
  },
  {
    label: "HRMS",
    detail: "Workforce operations",
    icon: "HR",
    url: "/clinical-services/hrms",
  },
  {
    label: "Provident Fund (PF)",
    detail: "EPFO guidance and employee PF identifiers",
    icon: "PF",
    url: "/clinical-services/hrms/pf",
  },
  {
    label: "Finance",
    detail: "Accounts and collections",
    icon: "FI",
    url: "/clinical-services/finance",
  },
  {
    label: "Inventory",
    detail: "Stock and purchases",
    icon: "IV",
    url: "/clinical-services/inventory",
  },
  {
    label: "TOTTECH AI",
    detail: "Clinical review required",
    icon: "AI",
    route: "ClinicalAI",
    url: "/clinical-services/ai/command-center",
  },
  {
    label: "SchoolGPT",
    detail: "Assistant and knowledge",
    icon: "SG",
    url: "/clinical-services/ai",
  },
  {
    label: "Analytics",
    detail: "CFO, CEO and medical analytics",
    icon: "AN",
    url: "/clinical-services/analytics",
  },
  {
    label: "Security",
    detail: "Users, RBAC and audit",
    icon: "SE",
    url: "/clinical-services/security",
  },
  {
    label: "Reports",
    detail: "Clinical exports and summaries",
    icon: "RP",
    url: "/clinical-services/reports",
  },
];

export default function ScreenShell({
  title,
  subtitle,
  workspace = "school",
  children,
}: Props) {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 760;
  const isClinical =
    workspace === "clinical";
  const opacity = useRef(
    new Animated.Value(0)
  ).current;
  const translateY = useRef(
    new Animated.Value(10)
  ).current;

  const [drawerOpen, setDrawerOpen] =
    useState(false);
  const [chooser, setChooser] = useState<
    "school" | "year" | null
  >(null);
  const [user, setUser] =
    useState<User | null>(null);
  const [schools, setSchools] =
    useState<School[]>([]);
  const [academicYears, setAcademicYears] =
    useState<AcademicYear[]>([]);
  const [selectedSchool, setSelectedSchool] =
    useState<School | null>(null);
  const [selectedYear, setSelectedYear] =
    useState<AcademicYear | null>(null);

  const loadContext = useCallback(async () => {
    const stored = await getStoredUser();
    setUser(stored);

    if (isClinical) {
      setSelectedSchool({
        id: "clinical",
        school_name:
          "TOTTECH Clinical Services",
        school_code: "CS",
      });
      setSelectedYear({
        id: "live",
        academic_year: "Live Clinical",
      });
      return;
    }

    try {
      const [schoolRows, currentSchool, years] =
        await Promise.all([
          apiRequest<School[]>("/api/schools"),
          apiRequest<School>(
            "/api/my-school-branding"
          ),
          apiRequest<AcademicYear[]>(
            "/api/academic-years?include_all=true"
          ),
        ]);

      const rows = Array.isArray(schoolRows)
        ? schoolRows
        : [];
      const yearRows = Array.isArray(years)
        ? years
        : [];

      setSchools(rows);
      setAcademicYears(yearRows);
      setSelectedSchool(
        currentSchool?.is_all_schools
          ? {
              ...currentSchool,
              id: "all",
              school_name: "All Schools",
            }
          : currentSchool ||
              rows[0] ||
              null
      );
      setSelectedYear(
        yearRows.find((year) => year.is_selected) ||
          yearRows.find((year) => year.is_current) ||
          yearRows[0] ||
          null
      );
    } catch {
      setSelectedSchool({
        id: "context",
        school_name:
          stored?.school_name || "School Context",
      });
      setAcademicYears([]);
    }
  }, [isClinical]);

  useEffect(() => {
    void Promise.resolve().then(loadContext);
  }, [loadContext]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const menu = isClinical
    ? clinicalMenu
    : schoolMenu;
  const schoolLabel =
    selectedSchool?.schoolName ||
    selectedSchool?.school_name ||
    user?.school_name ||
    (isClinical
      ? "Clinical Services"
      : "Select School");
  const yearLabel =
    selectedYear?.academic_year ||
    (isClinical
      ? "Live Clinical"
      : "Academic Year");
  const userName =
    user?.full_name ||
    user?.email ||
    user?.username ||
    "User";
  const brandLogo =
    selectedSchool?.logoUrl ||
    selectedSchool?.school_logo ||
    selectedSchool?.logo_url ||
    logoUri;
  const brandName = isClinical
    ? "Clinical Services"
    : schoolLabel;
  const aiName =
    selectedSchool?.aiDisplayName ||
    (isClinical
      ? "Clinical AI"
      : `${schoolLabel} Assistant`);
  const aiTagline =
    selectedSchool?.aiTagline ||
    (isClinical
      ? "Clinical Review Required"
      : "School Copilot");

  const goTo = (item: MenuItem) => {
    setDrawerOpen(false);
    if (item.url) {
      navigation.navigate("WebView", {
        title: item.label,
        url: item.url,
      });
      return;
    }

    if (item.route) {
      navigation.navigate(item.route as never);
    }
  };

  const switchSchool = async (
    school: School
  ) => {
    if (isClinical) {
      return;
    }

    const schoolId =
      school.id === null ? "all" : school.id;
    setSelectedSchool(school);
    setChooser(null);
    await apiRequest("/api/switch-school", {
      method: "POST",
      body: {
        schoolId,
      },
    });
    await loadContext();
  };

  const switchYear = async (
    year: AcademicYear
  ) => {
    if (isClinical) {
      return;
    }

    setSelectedYear(year);
    setChooser(null);
    await apiRequest(
      "/api/switch-academic-year",
      {
        method: "POST",
        body: {
          academicYearId: year.id,
        },
      }
    );
    await loadContext();
  };

  const logout = async () => {
    await logoutRequest();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Login",
        },
      ],
    });
  };

  const sidebar = (
    <Sidebar
      menu={menu}
      userName={userName}
      role={user?.role}
      workspace={workspace}
      brandLogo={brandLogo}
      brandName={brandName}
      aiName={aiName}
      aiTagline={aiTagline}
      onNavigate={goTo}
      onLogout={logout}
    />
  );

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
        <View style={styles.shell}>
          <Header
            isClinical={isClinical}
            isTablet={isTablet}
            title={title}
            schoolLabel={schoolLabel}
            yearLabel={yearLabel}
            userName={userName}
            role={user?.role}
            brandLogo={brandLogo}
            brandName={brandName}
            onMenu={() => setDrawerOpen(true)}
            onChooseSchool={() =>
              !isClinical &&
              setChooser("school")
            }
            onChooseYear={() =>
              !isClinical && setChooser("year")
            }
            onLogout={logout}
          />

          <View style={styles.workspace}>
            {isTablet ? (
              <View style={styles.sidebarDesktop}>
                {sidebar}
              </View>
            ) : null}

            <ScrollView
              style={styles.pageScroll}
              contentContainerStyle={[
                styles.content,
                isTablet &&
                  styles.contentTablet,
              ]}
              horizontal={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.pageHeader}>
                <Text style={styles.eyebrow}>
                  {isClinical
                    ? "Clinical Workspace"
                    : "Executive Workspace"}
                </Text>
                <Text style={styles.title}>
                  {title}
                </Text>
                {subtitle ? (
                  <Text style={styles.subtitle}>
                    {subtitle}
                  </Text>
                ) : null}
              </View>
              <Animated.View
                style={[
                  styles.body,
                  {
                    opacity,
                    transform: [
                      { translateY },
                    ],
                  },
                ]}
              >
                {children}
              </Animated.View>
            </ScrollView>
          </View>
        </View>

        <Modal
          transparent
          visible={drawerOpen && !isTablet}
          animationType="fade"
          onRequestClose={() =>
            setDrawerOpen(false)
          }
        >
          <View style={styles.overlay}>
            <Pressable
              style={styles.scrim}
              onPress={() =>
                setDrawerOpen(false)
              }
            />
            <View style={styles.drawer}>
              {sidebar}
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          visible={chooser !== null}
          animationType="fade"
          onRequestClose={() => setChooser(null)}
        >
          <View style={styles.chooserOverlay}>
            <Pressable
              style={styles.scrim}
              onPress={() => setChooser(null)}
            />
            <View style={styles.chooserCard}>
              <Text style={styles.chooserTitle}>
                {chooser === "school"
                  ? "Select School"
                  : "Select Academic Year"}
              </Text>
              <ScrollView
                style={styles.chooserList}
                contentContainerStyle={{
                  gap: 8,
                }}
              >
                {chooser === "school" ? (
                  <>
                    {user?.role === "SUPER_ADMIN" ? (
                      <Choice
                        label="All Schools"
                        detail="Show records across every school"
                        active={
                          selectedSchool?.id === "all"
                        }
                        onPress={() =>
                          switchSchool({
                            id: "all",
                            school_name:
                              "All Schools",
                            school_code: "ALL",
                          })
                        }
                      />
                    ) : null}
                    {schools.map((school) => (
                      <Choice
                        key={String(school.id)}
                        label={
                          school.school_name ||
                          `School ${school.id}`
                        }
                        detail={
                          school.school_code ||
                          "School context"
                        }
                        active={
                          String(
                            selectedSchool?.id
                          ) === String(school.id)
                        }
                        onPress={() =>
                          switchSchool(school)
                        }
                      />
                    ))}
                  </>
                ) : (
                  academicYears.map((year) => (
                    <Choice
                      key={String(year.id)}
                      label={
                        year.academic_year ||
                        `Year ${year.id}`
                      }
                      detail={
                        year.is_current
                          ? "Current year"
                          : "Historical context"
                      }
                      active={
                        String(selectedYear?.id) ===
                        String(year.id)
                      }
                      onPress={() =>
                        switchYear(year)
                      }
                    />
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Header({
  isClinical,
  isTablet,
  title,
  schoolLabel,
  yearLabel,
  userName,
  role,
  brandLogo,
  brandName,
  onMenu,
  onChooseSchool,
  onChooseYear,
  onLogout,
}: {
  isClinical: boolean;
  isTablet: boolean;
  title: string;
  schoolLabel: string;
  yearLabel: string;
  userName: string;
  role?: string;
  brandLogo: string;
  brandName: string;
  onMenu: () => void;
  onChooseSchool: () => void;
  onChooseYear: () => void;
  onLogout: () => void;
}) {
  return (
    <View style={styles.headerBar}>
      <View style={styles.headerTop}>
        {!isTablet ? (
          <Pressable
            style={styles.menuButton}
            onPress={onMenu}
          >
            <Text style={styles.menuIcon}>
              MENU
            </Text>
          </Pressable>
        ) : null}
        <View style={styles.headerBrand}>
          <Image
            source={{ uri: brandLogo }}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.headerNameBlock}>
            <Text style={styles.headerBrandName}>
              {brandName}
            </Text>
            <Text
              numberOfLines={1}
              style={styles.headerSchoolName}
            >
              {schoolLabel}
            </Text>
          </View>
        </View>
        <Pressable
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contextScroller}
      >
        <ContextButton
          label="Academic Year"
          value={yearLabel}
          onPress={onChooseYear}
          disabled={isClinical}
        />
        <ContextButton
          label={
            isClinical
              ? "Hospital"
              : "School"
          }
          value={schoolLabel}
          onPress={onChooseSchool}
          disabled={isClinical}
        />
        <View style={styles.healthPill}>
          <Text style={styles.healthLabel}>
            Health
          </Text>
          <Text style={styles.healthValue}>
            87
          </Text>
        </View>
        <View style={styles.userPill}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName
                .trim()
                .slice(0, 1)
                .toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.userCopy}>
            <Text
              numberOfLines={1}
              style={styles.userName}
            >
              {userName}
            </Text>
            <Text
              numberOfLines={1}
              style={styles.userRole}
            >
              {role || "USER"}
            </Text>
          </View>
        </View>
        <View style={styles.titlePill}>
          <Text style={styles.titlePillLabel}>
            {isClinical
              ? "Clinical"
              : "School ERP"}
          </Text>
          <Text
            numberOfLines={1}
            style={styles.titlePillValue}
          >
            {title}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ContextButton({
  label,
  value,
  onPress,
  disabled,
}: {
  label: string;
  value: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.contextButton,
        pressed &&
          !disabled &&
          styles.contextButtonPressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.contextLabel}>
        {label}
      </Text>
      <Text
        numberOfLines={1}
        style={styles.contextValue}
      >
        {value}
      </Text>
    </Pressable>
  );
}

function Sidebar({
  menu,
  userName,
  role,
  workspace,
  brandLogo,
  brandName,
  aiName,
  aiTagline,
  onNavigate,
  onLogout,
}: {
  menu: MenuItem[];
  userName: string;
  role?: string;
  workspace: Workspace;
  brandLogo: string;
  brandName: string;
  aiName: string;
  aiTagline: string;
  onNavigate: (item: MenuItem) => void;
  onLogout: () => void;
}) {
  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarBrandCard}>
        <Image
          source={{ uri: brandLogo }}
          style={styles.sidebarLogo}
          resizeMode="contain"
        />
        <Text style={styles.sidebarBrandName}>
          {brandName}
        </Text>
      </View>
      <View style={styles.workspaceCard}>
        <Text style={styles.workspaceLabel}>
          Workspace
        </Text>
        <Text
          numberOfLines={1}
          style={styles.workspaceUser}
        >
          {userName}
        </Text>
        <Text style={styles.workspaceRole}>
          {role || "USER"}
        </Text>
      </View>
      <ScrollView
        style={styles.sidebarMenu}
        contentContainerStyle={{
          gap: 8,
          paddingBottom: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        {menu.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => onNavigate(item)}
            style={({ pressed }) => [
              styles.navItem,
              pressed && styles.navItemPressed,
            ]}
          >
            <View style={styles.navIcon}>
              <Text style={styles.navIconText}>
                {item.icon}
              </Text>
            </View>
            <View style={styles.navCopy}>
              <Text style={styles.navLabel}>
                {item.label}
              </Text>
              <Text
                numberOfLines={1}
                style={styles.navDetail}
              >
                {item.detail}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable
        style={styles.aiBanner}
        onPress={() =>
          onNavigate(
            workspace === "clinical"
              ? clinicalMenu[
                  clinicalMenu.length - 2
                ]
              : schoolMenu[
                  schoolMenu.length - 2
                ]
          )
        }
      >
        <Text style={styles.aiIcon}>AI</Text>
        <View style={styles.aiCopy}>
          <Text style={styles.aiTitle}>
            Ask {aiName}
          </Text>
          <Text
            numberOfLines={1}
            style={styles.aiSubtitle}
          >
            {aiTagline}
          </Text>
        </View>
      </Pressable>
      <Pressable
        style={styles.sidebarLogout}
        onPress={onLogout}
      >
        <Text style={styles.sidebarLogoutText}>
          Logout
        </Text>
      </Pressable>
    </View>
  );
}

function Choice({
  label,
  detail,
  active,
  onPress,
}: {
  label: string;
  detail: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.choice,
        active && styles.choiceActive,
      ]}
    >
      <Text style={styles.choiceLabel}>
        {label}
      </Text>
      <Text style={styles.choiceDetail}>
        {detail}
      </Text>
    </Pressable>
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
  shell: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerBar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 10,
  },
  headerTop: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuButton: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.black,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    color: colors.goldSoft,
    fontSize: 10,
    fontWeight: "900",
  },
  headerBrand: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLogo: {
    width: 54,
    height: 48,
    borderRadius: 11,
  },
  headerNameBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  headerBrandName: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0,
  },
  headerSchoolName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
  },
  logoutButton: {
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSoft,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
  },
  contextScroller: {
    gap: 8,
    paddingRight: 8,
  },
  contextButton: {
    width: 170,
    minHeight: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  contextButtonPressed: {
    borderColor: colors.gold,
    backgroundColor: colors.goldPale,
  },
  contextLabel: {
    color: colors.muted,
    fontSize: 9.5,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  contextValue: {
    marginTop: 3,
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  healthPill: {
    minWidth: 84,
    minHeight: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.goldPale,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  healthLabel: {
    color: colors.goldDeep,
    fontSize: 9.5,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  healthValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  userPill: {
    width: 188,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSoft,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: "900",
  },
  userCopy: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
  },
  userRole: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "900",
  },
  titlePill: {
    width: 180,
    minHeight: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  titlePillLabel: {
    color: colors.goldDeep,
    fontSize: 9.5,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  titlePillValue: {
    marginTop: 3,
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
  },
  workspace: {
    flex: 1,
    flexDirection: "row",
    minHeight: 0,
  },
  sidebarDesktop: {
    width: 306,
    borderRightWidth: 1,
    borderRightColor: "rgba(242,209,138,0.18)",
    backgroundColor: colors.black,
  },
  pageScroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 16,
    gap: 16,
  },
  contentTablet: {
    padding: 18,
  },
  pageHeader: {
    gap: 4,
  },
  eyebrow: {
    color: colors.goldDeep,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
  body: {
    gap: 14,
  },
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  chooserOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.42)",
  },
  drawer: {
    width: 318,
    maxWidth: "84%",
    backgroundColor: colors.black,
  },
  sidebar: {
    flex: 1,
    backgroundColor: colors.black,
    padding: 14,
    gap: 12,
  },
  sidebarBrandCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(242,209,138,0.14)",
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 14,
    alignItems: "center",
    gap: 5,
  },
  sidebarLogo: {
    width: 152,
    height: 112,
  },
  sidebarBrandName: {
    color: colors.gold,
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 0,
    textAlign: "center",
  },
  workspaceCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 13,
  },
  workspaceLabel: {
    color: colors.goldSoft,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  workspaceUser: {
    marginTop: 6,
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },
  workspaceRole: {
    marginTop: 2,
    color: "rgba(255,255,255,0.78)",
    fontSize: 11,
    fontWeight: "900",
  },
  sidebarMenu: {
    flex: 1,
  },
  navItem: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  navItemPressed: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  navIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(242,209,138,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  navIconText: {
    color: colors.goldSoft,
    fontSize: 10,
    fontWeight: "900",
  },
  navCopy: {
    flex: 1,
    minWidth: 0,
  },
  navLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
  },
  navDetail: {
    marginTop: 2,
    color: "rgba(255,255,255,0.62)",
    fontSize: 10.5,
    fontWeight: "700",
  },
  aiBanner: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: "rgba(212,175,55,0.13)",
    padding: 12,
  },
  aiIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gold,
    color: colors.goldSoft,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 11,
    fontWeight: "900",
  },
  aiCopy: {
    flex: 1,
    minWidth: 0,
  },
  aiTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
  },
  aiSubtitle: {
    marginTop: 2,
    color: colors.goldSoft,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  sidebarLogout: {
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    padding: 12,
    alignItems: "center",
  },
  sidebarLogoutText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
  },
  chooserCard: {
    maxHeight: "70%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.surface,
    padding: 18,
    gap: 14,
  },
  chooserTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  chooserList: {
    maxHeight: 420,
  },
  choice: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSoft,
    padding: 14,
  },
  choiceActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldPale,
  },
  choiceLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  choiceDetail: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
});
