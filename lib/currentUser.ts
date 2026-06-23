export function getCurrentUser() {

  if (typeof window === "undefined") {
    return null;
  }

  const user =
    localStorage.getItem(
      "erpUser"
    );

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}
