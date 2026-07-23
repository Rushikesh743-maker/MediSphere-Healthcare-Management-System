import { useSyncExternalStore } from "react";
import {
  AppointmentRequest,
  Bill,
  QueueEntry,
  ReceptionDoctor,
  RegisteredPatient,
  doctorsList,
  initialAppointmentRequests,
  initialBills,
  initialQueue,
  initialRegisteredPatients,
} from "./receptionMockData";
import { labActions, onLabTestCompleted } from "./labStore";

// -------- Cross-role record types (shared between dashboards) --------
export interface StoredPrescription {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  date: string;
  diagnosis: string;
  medicines: { name: string; dosage: string; duration: string; instructions: string }[];
  notes?: string;
}

export interface StoredConsultation {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  department: string;
  date: string;
  symptoms?: string;
  diagnosis: string;
  notes?: string;
  plan?: string;
  followUp?: string;
}

export type NotificationRole = "patient" | "doctor" | "reception" | "lab";
export interface AppNotification {
  id: string;
  role: NotificationRole;
  targetId?: string; // e.g. patientId or doctor name
  message: string;
  time: string;
  read: boolean;
}

interface State {
  requests: AppointmentRequest[];
  patients: RegisteredPatient[];
  queue: QueueEntry[];
  bills: Bill[];
  doctors: ReceptionDoctor[];
  prescriptions: StoredPrescription[];
  consultations: StoredConsultation[];
  notifications: AppNotification[];
}

let state: State = {
  requests: initialAppointmentRequests,
  patients: initialRegisteredPatients,
  queue: initialQueue,
  bills: initialBills,
  doctors: doctorsList,
  prescriptions: [],
  consultations: [],
  notifications: [],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;

export function useReceptionStore(): State {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  emit();
}

const today = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function pushNotification(n: Omit<AppNotification, "id" | "time" | "read">) {
  const notif: AppNotification = {
    ...n,
    id: `N${Date.now()}${Math.floor(Math.random() * 1000)}`,
    time: nowTime(),
    read: false,
  };
  setState({ notifications: [notif, ...state.notifications] });
}

// When a lab test completes, notify the requesting doctor and the patient.
onLabTestCompleted((t) => {
  pushNotification({
    role: "patient",
    targetId: t.patientId,
    message: `Lab report ready: ${t.test}`,
  });
  pushNotification({
    role: "doctor",
    targetId: t.doctor,
    message: `Lab result received for ${t.patientName} (${t.test}).`,
  });
});

export const receptionActions = {
  updateRequestStatus(id: string, status: "Confirmed" | "Rejected") {
    setState({
      requests: state.requests.map((r) => (r.id === id ? { ...r, status } : r)),
    });
  },
  scheduleAppointment(
    id: string,
    payload: { doctor: string; date: string; time: string },
  ) {
    const nextToken = Math.max(0, ...state.queue.map((q) => q.token)) + 1;
    let updatedReq: AppointmentRequest | undefined;
    const requests = state.requests.map((r) => {
      if (r.id !== id) return r;
      updatedReq = {
        ...r,
        status: "Confirmed",
        assignedDoctor: payload.doctor,
        scheduledDate: payload.date,
        scheduledTime: payload.time,
        tokenNumber: nextToken,
      };
      return updatedReq;
    });
    const queue: QueueEntry[] = updatedReq
      ? [
          ...state.queue,
          {
            id: `Q${Date.now()}`,
            token: nextToken,
            patientName: updatedReq.patientName,
            doctor: payload.doctor,
            time: payload.time,
            status: "Waiting",
          },
        ]
      : state.queue;
    setState({ requests, queue });
    if (updatedReq) {
      pushNotification({
        role: "patient",
        targetId: updatedReq.patientId,
        message: `Appointment confirmed with ${payload.doctor} on ${payload.date} at ${payload.time} (Token #${nextToken}).`,
      });
      pushNotification({
        role: "doctor",
        targetId: payload.doctor,
        message: `New appointment scheduled: ${updatedReq.patientName} at ${payload.time}.`,
      });
    }
    return nextToken;
  },
  submitPatientRequest(payload: {
    patientId: string;
    patientName: string;
    department: string;
    preferredDoctor: string;
    preferredDate: string;
    reason: string;
    priority: "Normal" | "Urgent";
    notes?: string;
  }) {
    const seq = state.requests.length + 1;
    const req: AppointmentRequest = {
      id: `AR${String(seq).padStart(3, "0")}${Date.now().toString().slice(-3)}`,
      patientId: payload.patientId,
      patientName: payload.patientName,
      department: payload.department,
      preferredDoctor: payload.preferredDoctor || "Any available",
      preferredDate: payload.preferredDate,
      reason: payload.reason,
      priority: payload.priority,
      status: "Pending",
    };
    setState({ requests: [req, ...state.requests] });
    pushNotification({
      role: "reception",
      message: `New appointment request from ${payload.patientName} (${payload.department}).`,
    });
    return req;
  },
  registerPatient(p: Omit<RegisteredPatient, "id" | "registeredOn">) {
    const seq = state.patients.length + 1;
    const id = `P${String(seq).padStart(3, "0")}`;
    const newPatient: RegisteredPatient = {
      ...p,
      id,
      registeredOn: today(),
    };
    setState({ patients: [newPatient, ...state.patients] });
    return newPatient;
  },
  updatePatient(id: string, patch: Partial<RegisteredPatient>) {
    setState({
      patients: state.patients.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  },
  updateQueueStatus(id: string, status: QueueEntry["status"]) {
    setState({
      queue: state.queue.map((q) => (q.id === id ? { ...q, status } : q)),
    });
  },
  addBill(bill: Omit<Bill, "id" | "date">) {
    const seq = state.bills.length + 1;
    const newBill: Bill = {
      ...bill,
      id: `INV-2026-${String(1000 + seq).padStart(4, "0")}`,
      date: today(),
    };
    setState({ bills: [newBill, ...state.bills] });
    return newBill;
  },
  updateDoctorStatus(id: string, status: ReceptionDoctor["status"]) {
    setState({
      doctors: state.doctors.map((d) => (d.id === id ? { ...d, status } : d)),
    });
  },
  completeConsultation(payload: {
    patientId: string;
    patientName: string;
    patientPhone?: string;
    patientAge?: number;
    patientGender?: "Male" | "Female" | "Other";
    doctor: string;
    department?: string;
    symptoms?: string;
    diagnosis: string;
    notes?: string;
    plan?: string;
    followUp?: string;
    medicines: { name: string; dosage: string; duration: string; instructions: string }[];
    labTests: string[];
  }) {
    const date = today();
    const cleanedMeds = payload.medicines.filter((m) => m.name.trim());

    const rx: StoredPrescription | null = cleanedMeds.length
      ? {
          id: `RX${Date.now()}`,
          patientId: payload.patientId,
          patientName: payload.patientName,
          doctor: payload.doctor,
          date,
          diagnosis: payload.diagnosis || "Consultation",
          medicines: cleanedMeds,
          notes: payload.notes,
        }
      : null;

    const consult: StoredConsultation = {
      id: `C${Date.now()}`,
      patientId: payload.patientId,
      patientName: payload.patientName,
      doctor: payload.doctor,
      department: payload.department ?? "General Medicine",
      date,
      symptoms: payload.symptoms,
      diagnosis: payload.diagnosis || "Consultation",
      notes: payload.notes,
      plan: payload.plan,
      followUp: payload.followUp,
    };

    setState({
      prescriptions: rx ? [rx, ...state.prescriptions] : state.prescriptions,
      consultations: [consult, ...state.consultations],
      queue: state.queue.map((q) =>
        q.patientName === payload.patientName && q.doctor === payload.doctor && q.status !== "Completed"
          ? { ...q, status: "Completed" }
          : q,
      ),
    });

    // Fire lab requests through the lab store.
    payload.labTests
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((test) => {
        labActions.addLabTest({
          patientId: payload.patientId,
          patientName: payload.patientName,
          patientPhone: payload.patientPhone ?? "",
          patientAge: payload.patientAge ?? 0,
          patientGender: payload.patientGender ?? "Male",
          doctor: payload.doctor,
          test,
          priority: "Routine",
        });
      });

    // Notifications for the other roles.
    if (rx) {
      pushNotification({
        role: "patient",
        targetId: payload.patientId,
        message: `New prescription from ${payload.doctor}: ${payload.diagnosis}.`,
      });
    }
    pushNotification({
      role: "patient",
      targetId: payload.patientId,
      message: `Consultation completed with ${payload.doctor}.`,
    });
    if (payload.labTests.length) {
      pushNotification({
        role: "lab",
        message: `${payload.labTests.length} new test(s) ordered by ${payload.doctor} for ${payload.patientName}.`,
      });
    }
  },
  markNotificationsRead(role: NotificationRole, targetId?: string) {
    setState({
      notifications: state.notifications.map((n) =>
        n.role === role && (!targetId || n.targetId === targetId || !n.targetId)
          ? { ...n, read: true }
          : n,
      ),
    });
  },
};

// -------- Selectors --------
export function selectNotificationsFor(
  s: State,
  role: NotificationRole,
  targetId?: string,
): AppNotification[] {
  return s.notifications.filter(
    (n) => n.role === role && (!targetId || !n.targetId || n.targetId === targetId),
  );
}