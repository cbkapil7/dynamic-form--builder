import { api } from "./api";

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (e) {
    console.log("Logout error", e);
  }

  localStorage.removeItem("token");
 window.location.replace("/login");
};