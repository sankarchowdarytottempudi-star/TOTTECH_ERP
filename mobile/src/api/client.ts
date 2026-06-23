export const API_BASE_URL =
  "https://erp.tottechsolutions.com";

import AsyncStorage from "@react-native-async-storage/async-storage";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
};

type LoginPayload = {
  success: boolean;
  project?: string;
  projectType?: string;
  redirectTo?: string;
  user: {
    id: number;
    full_name?: string;
    email?: string;
    username?: string;
    role?: string;
    school_id?: number | null;
    school_name?: string;
    permissions?: string[];
    project?: string;
    projectType?: string;
    redirectTo?: string;
  };
};

const COOKIE_KEY =
  "tottech_one_cookie";
const USER_KEY =
  "tottech_one_user";

function compactCookie(
  value: string | null
) {
  if (!value) {
    return "";
  }

  return value
    .split(",")
    .map((part) => part.split(";")[0])
    .filter((part) =>
      part.includes("=")
    )
    .join("; ");
}

async function persistResponseCookie(
  response: Response
) {
  const setCookie =
    response.headers.get("set-cookie");
  const nextCookie =
    compactCookie(setCookie);

  if (nextCookie) {
    await AsyncStorage.setItem(
      COOKIE_KEY,
      nextCookie
    );
  }
}

export async function loginRequest(
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: "include",
    }
  );
  const payload = (await response
    .json()
    .catch(() => null)) as
    | LoginPayload
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      payload && "error" in payload
        ? payload.error ||
            "Login failed"
        : "Login failed"
    );
  }

  await persistResponseCookie(response);

  if (
    payload &&
    "user" in payload
  ) {
    await AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify(payload.user)
    );
  }

  return payload as LoginPayload;
}

export async function getStoredUser() {
  const raw =
    await AsyncStorage.getItem(
      USER_KEY
    );

  return raw ? JSON.parse(raw) : null;
}

export async function getStoredCookie() {
  return AsyncStorage.getItem(
    COOKIE_KEY
  );
}

export async function logoutRequest() {
  await AsyncStorage.multiRemove([
    COOKIE_KEY,
    USER_KEY,
  ]);
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const cookie =
    await AsyncStorage.getItem(
      COOKIE_KEY
    );
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookie
          ? {
              Cookie: cookie,
            }
          : {}),
        ...(options.token
          ? {
              Authorization: `Bearer ${options.token}`,
            }
          : {}),
      },
      body:
        options.body === undefined
          ? undefined
          : JSON.stringify(options.body),
      credentials: "include",
    }
  );
  const payload = await response
    .json()
    .catch(() => null);

  await persistResponseCookie(response);

  if (!response.ok) {
    throw new Error(
      payload?.error ||
        payload?.message ||
        `Request failed: ${response.status}`
    );
  }

  return payload as T;
}
