export type SchoolBrandingSource = {
  id?: number | null;
  school_name?: string | null;
  school_code?: string | null;
  logo_url?: string | null;
  school_logo?: string | null;
  favicon_url?: string | null;
  school_favicon?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  principal_name?: string | null;
  principal_contact?: string | null;
  owner_name?: string | null;
  owner_contact?: string | null;
  subscription_plan?: string | null;
  subscription_status?: string | null;
  ai_branding_name?: string | null;
  is_active?: boolean | null;
  is_all_schools?: boolean | null;
};

export const PLATFORM_BRANDING = {
  id: null,
  school_name: "TOTTECH ONE Platform",
  school_code: "PLATFORM",
  logo_url: "/images/logo.png",
  school_logo: "/images/logo.png",
  favicon_url: "/images/logo.png",
  school_favicon: "/images/logo.png",
  primary_color: "#04142E",
  secondary_color: "#D4AF37",
  ai_branding_name: "TOTTECH AI",
  is_platform: true,
  is_all_schools: true,
};

const text = (
  value: unknown,
  fallback = ""
) => {
  const output = String(value ?? "").trim();

  return output || fallback;
};

export function normalizeSchoolBranding(
  school: SchoolBrandingSource | null | undefined,
  options: {
    platformMode?: boolean;
  } = {}
) {
  if (
    options.platformMode ||
    !school ||
    school.is_all_schools
  ) {
    return {
      ...PLATFORM_BRANDING,
      product: "TOTTECH ONE",
      tagline: "Gateway To Learning",
      aiProduct: "TOTTECH AI",
      aiTagline: "Gateway To Innovation",
      aiDisplayName: "TOTTECH AI",
      assistantName: "TOTTECH AI",
      schoolName:
        school?.school_name ||
        PLATFORM_BRANDING.school_name,
      schoolCode:
        school?.school_code ||
        PLATFORM_BRANDING.school_code,
      logoUrl: PLATFORM_BRANDING.logo_url,
      faviconUrl:
        PLATFORM_BRANDING.favicon_url,
      primaryColor:
        PLATFORM_BRANDING.primary_color,
      secondaryColor:
        PLATFORM_BRANDING.secondary_color,
    };
  }

  const schoolName = text(
    school.school_name,
    "School/College"
  );
  const logoUrl =
    text(school.school_logo) ||
    text(school.logo_url) ||
    "/images/logo.png";
  const faviconUrl =
    text(school.school_favicon) ||
    text(school.favicon_url) ||
    logoUrl;
  const primaryColor = text(
    school.primary_color,
    "#04142E"
  );
  const secondaryColor = text(
    school.secondary_color,
    "#D4AF37"
  );
  const aiDisplayName = text(
    school.ai_branding_name,
    `${schoolName} Assistant`
  );

  return {
    ...school,
    product: schoolName,
    tagline: "School/College Operating System",
    aiProduct: aiDisplayName,
    aiTagline: "School/College Copilot",
    aiDisplayName,
    assistantName: aiDisplayName,
    schoolName,
    schoolCode: text(school.school_code),
    logoUrl,
    faviconUrl,
    primaryColor,
    secondaryColor,
    is_platform: false,
    is_all_schools: false,
  };
}
