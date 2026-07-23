export type Role = "doctor" | "patient" | "reception" | "lab";

export interface AuthUser {
  userId: string;
  role: Role;
  name: string;
}

const KEY = "medisphere_auth";

export const DEMO_CREDS: Record<string, { password: string; user: AuthUser }> = {
  doctor_demo: {
    password: "doctor123",
    user: { userId: "doctor_demo", role: "doctor", name: "Dr.Ruhikesh N" },
  },
  patient_demo: {
    password: "patient123",
    user: { userId: "patient_demo", role: "patient", name: "Rohan Patel" },
  },
  reception_demo: {
    password: "reception123",
    user: { userId: "reception_demo", role: "reception", name: "Priya Nair" },
  },
  lab_demo: {
    password: "lab123",
    user: { userId: "lab_demo", role: "lab", name: "Karan Mehta" },
  },
};

export function login(userId: string, password: string): AuthUser | null {
  const entry = DEMO_CREDS[userId];
  if (!entry || entry.password !== password) return null;
  localStorage.setItem(KEY, JSON.stringify(entry.user));
  return entry.user;
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function redirectPathFor(role: Role): string {
  switch (role) {
    case "doctor":
      return "/doctor";
    case "patient":
      return "/patient";
    case "reception":
      return "/reception";
    case "lab":
      return "/lab";
    default:
      return "/";
  }
}

// Maps a demo login user id to the domain-level record they represent.
export const patientIdForUser: Record<string, string> = {
  patient_demo: "P001",
};

export function currentPatientId(): string {
  const u = getCurrentUser();
  if (!u) return "P001";
  return patientIdForUser[u.userId] ?? "P001";
}