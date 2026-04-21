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
    return raw ? JSON.parse(raw) : null;
  },

  login(token: string, user: AuthUser) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout() {
    localStorage.clear();
  },
};
