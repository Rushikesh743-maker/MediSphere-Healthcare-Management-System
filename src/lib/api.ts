import axios from "axios";

// Central Axios instance. When the Spring Boot backend is ready,
// point VITE_API_BASE_URL to it (e.g. http://localhost:8080/api).
export const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const raw = typeof window !== "undefined" ? localStorage.getItem("medisphere_auth") : null;
  if (raw) {
    try {
      const user = JSON.parse(raw);
      config.headers = config.headers ?? {};
      (config.headers as any)["X-User-Id"] = user.userId;
      (config.headers as any)["X-User-Role"] = user.role;
    } catch {
      // ignore
    }
  }
  return config;
});

// Placeholder endpoint wrappers — swap the mock bodies for real calls later.
export const doctorApi = {
  getAppointments: () => Promise.resolve([]),
  getPatient: (id: string) => Promise.resolve({ id }),
  saveConsultation: (payload: unknown) => Promise.resolve(payload),
};