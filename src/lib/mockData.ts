export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  vitals: {
    bp: string;
    heartRate: number;
    temperature: number;
    spo2: number;
    weight: number;
    height: number;
  };
  history: {
    date: string;
    doctor: string;
    diagnosis: string;
    notes: string;
  }[];
  labReports: {
    id: string;
    name: string;
    date: string;
    status: "Completed" | "Pending" | "In Progress";
    result?: string;
  }[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  reason: string;
  status: "Waiting" | "In Consultation" | "Completed" | "Follow-up";
}

export interface LabRequest {
  id: string;
  patientName: string;
  test: string;
  requestedOn: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "Routine" | "Urgent";
}

export const patients: Patient[] = [
  {
    id: "P001",
    name: "Rohan Patel",
    age: 34,
    gender: "Male",
    phone: "+91 98220 11223",
    bloodGroup: "B+",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
    vitals: { bp: "138/86", heartRate: 82, temperature: 98.6, spo2: 98, weight: 78, height: 174 },
    history: [
      { date: "2026-05-14", doctor: "Dr. Sharma", diagnosis: "Viral Fever", notes: "Prescribed rest and paracetamol." },
      { date: "2026-02-02", doctor: "Dr. Sharma", diagnosis: "BP Follow-up", notes: "Continue amlodipine 5mg." },
    ],
    labReports: [
      { id: "L101", name: "Complete Blood Count", date: "2026-05-14", status: "Completed", result: "Normal range" },
      { id: "L102", name: "HbA1c", date: "2026-06-20", status: "Pending" },
    ],
  },
  {
    id: "P002",
    name: "Meera Iyer",
    age: 28,
    gender: "Female",
    phone: "+91 99001 22334",
    bloodGroup: "O+",
    allergies: ["Sulfa drugs"],
    conditions: ["Migraine"],
    vitals: { bp: "118/76", heartRate: 74, temperature: 98.4, spo2: 99, weight: 55, height: 162 },
    history: [
      { date: "2026-04-10", doctor: "Dr. Sharma", diagnosis: "Migraine episode", notes: "Sumatriptan prescribed." },
    ],
    labReports: [
      { id: "L201", name: "Thyroid Panel", date: "2026-04-10", status: "Completed", result: "TSH 2.1 (normal)" },
    ],
  },
  {
    id: "P003",
    name: "Arjun Verma",
    age: 45,
    gender: "Male",
    phone: "+91 98111 44556",
    bloodGroup: "A-",
    allergies: [],
    conditions: ["Asthma"],
    vitals: { bp: "126/80", heartRate: 78, temperature: 98.7, spo2: 96, weight: 82, height: 176 },
    history: [
      { date: "2026-06-01", doctor: "Dr. Sharma", diagnosis: "Asthma exacerbation", notes: "Nebulization advised." },
    ],
    labReports: [],
  },
  {
    id: "P004",
    name: "Sneha Kulkarni",
    age: 52,
    gender: "Female",
    phone: "+91 90000 55667",
    bloodGroup: "AB+",
    allergies: ["Latex"],
    conditions: ["Osteoarthritis"],
    vitals: { bp: "132/84", heartRate: 80, temperature: 98.5, spo2: 97, weight: 68, height: 158 },
    history: [
      { date: "2026-03-22", doctor: "Dr. Sharma", diagnosis: "Knee pain", notes: "Physiotherapy referred." },
    ],
    labReports: [
      { id: "L401", name: "Vitamin D", date: "2026-03-22", status: "Completed", result: "Deficient (18 ng/mL)" },
    ],
  },
  {
    id: "P005",
    name: "Vikram Singh",
    age: 60,
    gender: "Male",
    phone: "+91 98333 77889",
    bloodGroup: "B-",
    allergies: ["Aspirin"],
    conditions: ["Coronary artery disease"],
    vitals: { bp: "142/90", heartRate: 88, temperature: 98.8, spo2: 95, weight: 74, height: 170 },
    history: [
      { date: "2026-06-05", doctor: "Dr. Sharma", diagnosis: "Chest discomfort", notes: "ECG normal, continue meds." },
    ],
    labReports: [
      { id: "L501", name: "Lipid Profile", date: "2026-06-05", status: "In Progress" },
    ],
  },
];

export const appointments: Appointment[] = [
  { id: "A1", patientId: "P001", patientName: "Rohan Patel", time: "09:30", reason: "Diabetes follow-up", status: "Waiting" },
  { id: "A2", patientId: "P002", patientName: "Meera Iyer", time: "10:00", reason: "Migraine review", status: "Waiting" },
  { id: "A3", patientId: "P003", patientName: "Arjun Verma", time: "10:30", reason: "Asthma check", status: "In Consultation" },
  { id: "A4", patientId: "P004", patientName: "Sneha Kulkarni", time: "11:15", reason: "Knee pain follow-up", status: "Follow-up" },
  { id: "A5", patientId: "P005", patientName: "Vikram Singh", time: "12:00", reason: "Cardiac review", status: "Waiting" },
  { id: "A6", patientId: "P002", patientName: "Meera Iyer", time: "14:00", reason: "Lab report discussion", status: "Completed" },
];

export const labRequests: LabRequest[] = [
  { id: "LR1", patientName: "Rohan Patel", test: "HbA1c", requestedOn: "2026-07-08", status: "Pending", priority: "Routine" },
  { id: "LR2", patientName: "Vikram Singh", test: "Lipid Profile", requestedOn: "2026-07-07", status: "In Progress", priority: "Urgent" },
  { id: "LR3", patientName: "Meera Iyer", test: "MRI Brain", requestedOn: "2026-07-06", status: "Pending", priority: "Routine" },
  { id: "LR4", patientName: "Arjun Verma", test: "Chest X-Ray", requestedOn: "2026-07-05", status: "Completed", priority: "Routine" },
];

export const weeklyPatientData = [
  { day: "Mon", patients: 18 },
  { day: "Tue", patients: 22 },
  { day: "Wed", patients: 15 },
  { day: "Thu", patients: 25 },
  { day: "Fri", patients: 20 },
  { day: "Sat", patients: 28 },
  { day: "Sun", patients: 10 },
];

export function getPatient(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}