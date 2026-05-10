export type AuthUser = {
  id: number;
  name: string;
  email?: string;
  phone: string;
  role: string;
  sub_role?: string;
};

export const authStore = {
  get user(): AuthUser | null {
  const raw = localStorage.getItem("user");

  if (!raw || raw === "undefined") return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
},

  login(token: string, user: AuthUser) {
  if (!token || !user) return;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
},

  logout() {
    localStorage.clear();
  },
};
