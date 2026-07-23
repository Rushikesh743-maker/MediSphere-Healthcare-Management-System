export type RequestPriority = "Normal" | "Urgent";
export type RequestStatus = "Pending" | "Confirmed" | "Rejected";
export type DoctorStatus = "Available" | "In Consultation" | "Offline";
export type QueueStatus = "Waiting" | "Called" | "In Consultation" | "Completed";
export type PaymentStatus = "Paid" | "Pending" | "Partially Paid";

export interface AppointmentRequest {
  id: string;
  patientName: string;
  patientId?: string;
  department: string;
  preferredDoctor: string;
  preferredDate: string;
  reason: string;
  priority: RequestPriority;
  status: RequestStatus;
  assignedDoctor?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  tokenNumber?: number;
}

export interface ReceptionDoctor {
  id: string;
  name: string;
  department: string;
  status: DoctorStatus;
}

export interface RegisteredPatient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  registeredOn: string;
}

export interface QueueEntry {
  id: string;
  token: number;
  patientName: string;
  doctor: string;
  time: string;
  status: QueueStatus;
}

export interface BillItem {
  label: string;
  amount: number;
}

export interface Bill {
  id: string;
  patientName: string;
  date: string;
  items: BillItem[];
  total: number;
  status: PaymentStatus;
}

export const doctorsList: ReceptionDoctor[] = [
  { id: "D01", name: "Dr. Ayesha Sharma", department: "General Medicine", status: "Available" },
  { id: "D02", name: "Dr. Ramesh Iyer", department: "General Medicine", status: "In Consultation" },
  { id: "D03", name: "Dr. Rajiv Menon", department: "Cardiology", status: "Available" },
  { id: "D04", name: "Dr. Sanjana Kapoor", department: "Cardiology", status: "Offline" },
  { id: "D05", name: "Dr. Kavita Rao", department: "Dermatology", status: "Available" },
  { id: "D06", name: "Dr. Anil Deshmukh", department: "Orthopedics", status: "In Consultation" },
  { id: "D07", name: "Dr. Priya Sundar", department: "Pediatrics", status: "Available" },
  { id: "D08", name: "Dr. Farhan Qureshi", department: "ENT", status: "Offline" },
  { id: "D09", name: "Dr. Meera Nathan", department: "Neurology", status: "Available" },
];

export const initialAppointmentRequests: AppointmentRequest[] = [
  {
    id: "AR001",
    patientName: "Rohan Patel",
    patientId: "P001",
    department: "General Medicine",
    preferredDoctor: "Dr. Ayesha Sharma",
    preferredDate: "2026-07-21",
    reason: "Diabetes follow-up",
    priority: "Normal",
    status: "Confirmed",
    assignedDoctor: "Dr. Ayesha Sharma",
    scheduledDate: "2026-07-21",
    scheduledTime: "09:30",
    tokenNumber: 1,
  },
  {
    id: "AR002",
    patientName: "Meera Iyer",
    patientId: "P002",
    department: "Neurology",
    preferredDoctor: "Dr. Meera Nathan",
    preferredDate: "2026-07-16",
    reason: "Migraine consultation",
    priority: "Urgent",
    status: "Pending",
  },
  {
    id: "AR003",
    patientName: "Vikram Singh",
    patientId: "P005",
    department: "Cardiology",
    preferredDoctor: "Dr. Rajiv Menon",
    preferredDate: "2026-07-14",
    reason: "Chest discomfort review",
    priority: "Urgent",
    status: "Pending",
  },
  {
    id: "AR004",
    patientName: "Arjun Verma",
    patientId: "P003",
    department: "General Medicine",
    preferredDoctor: "Dr. Ramesh Iyer",
    preferredDate: "2026-07-18",
    reason: "Asthma review",
    priority: "Normal",
    status: "Pending",
  },
  {
    id: "AR005",
    patientName: "Sneha Kulkarni",
    patientId: "P004",
    department: "Orthopedics",
    preferredDoctor: "Dr. Anil Deshmukh",
    preferredDate: "2026-07-12",
    reason: "Knee pain follow-up",
    priority: "Normal",
    status: "Confirmed",
    assignedDoctor: "Dr. Anil Deshmukh",
    scheduledDate: "2026-07-12",
    scheduledTime: "11:30",
    tokenNumber: 3,
  },
  {
    id: "AR006",
    patientName: "Arjun Verma",
    patientId: "P003",
    department: "General Medicine",
    preferredDoctor: "Dr. Ayesha Sharma",
    preferredDate: "2026-07-21",
    reason: "Asthma follow-up",
    priority: "Normal",
    status: "Confirmed",
    assignedDoctor: "Dr. Ayesha Sharma",
    scheduledDate: "2026-07-21",
    scheduledTime: "10:30",
    tokenNumber: 6,
  },
  {
    id: "AR007",
    patientName: "Meera Iyer",
    patientId: "P002",
    department: "General Medicine",
    preferredDoctor: "Dr. Ayesha Sharma",
    preferredDate: "2026-07-21",
    reason: "Lab report discussion",
    priority: "Normal",
    status: "Confirmed",
    assignedDoctor: "Dr. Ayesha Sharma",
    scheduledDate: "2026-07-21",
    scheduledTime: "11:15",
    tokenNumber: 7,
  },
];

export const initialRegisteredPatients: RegisteredPatient[] = [
  {
    id: "P001",
    name: "Rohan Patel",
    age: 34,
    gender: "Male",
    phone: "+91 98220 11223",
    email: "rohan.patel@example.com",
    address: "Baner Road, Pune",
    bloodGroup: "B+",
    emergencyContact: "+91 98220 44556",
    registeredOn: "2025-01-14",
  },
  {
    id: "P002",
    name: "Meera Iyer",
    age: 28,
    gender: "Female",
    phone: "+91 99001 22334",
    email: "meera.iyer@example.com",
    address: "Koramangala, Bengaluru",
    bloodGroup: "O+",
    emergencyContact: "+91 99001 55667",
    registeredOn: "2025-03-02",
  },
  {
    id: "P003",
    name: "Arjun Verma",
    age: 45,
    gender: "Male",
    phone: "+91 98111 44556",
    email: "arjun.verma@example.com",
    address: "Sector 21, Noida",
    bloodGroup: "A-",
    emergencyContact: "+91 98111 77889",
    registeredOn: "2024-11-20",
  },
  {
    id: "P004",
    name: "Sneha Kulkarni",
    age: 52,
    gender: "Female",
    phone: "+91 90000 55667",
    email: "sneha.k@example.com",
    address: "Kothrud, Pune",
    bloodGroup: "AB+",
    emergencyContact: "+91 90000 88991",
    registeredOn: "2024-08-05",
  },
  {
    id: "P005",
    name: "Vikram Singh",
    age: 60,
    gender: "Male",
    phone: "+91 98333 77889",
    email: "vikram.s@example.com",
    address: "Civil Lines, Jaipur",
    bloodGroup: "B-",
    emergencyContact: "+91 98333 11220",
    registeredOn: "2024-06-19",
  },
];

export const initialQueue: QueueEntry[] = [
  { id: "Q1", token: 1, patientName: "Rohan Patel", doctor: "Dr. Ayesha Sharma", time: "09:30", status: "In Consultation" },
  { id: "Q2", token: 2, patientName: "Meera Iyer", doctor: "Dr. Meera Nathan", time: "10:00", status: "Waiting" },
  { id: "Q3", token: 3, patientName: "Sneha Kulkarni", doctor: "Dr. Anil Deshmukh", time: "11:30", status: "Called" },
  { id: "Q4", token: 4, patientName: "Vikram Singh", doctor: "Dr. Rajiv Menon", time: "12:00", status: "Waiting" },
  { id: "Q5", token: 5, patientName: "Arjun Verma", doctor: "Dr. Ramesh Iyer", time: "12:30", status: "Waiting" },
];

export const initialBills: Bill[] = [
  {
    id: "INV-2026-1001",
    patientName: "Rohan Patel",
    date: "2026-07-10",
    items: [
      { label: "Consultation Fee", amount: 800 },
      { label: "Laboratory (HbA1c)", amount: 650 },
    ],
    total: 1450,
    status: "Paid",
  },
  {
    id: "INV-2026-1002",
    patientName: "Vikram Singh",
    date: "2026-07-11",
    items: [
      { label: "Consultation Fee", amount: 1000 },
      { label: "Laboratory (Lipid Profile)", amount: 1200 },
      { label: "ECG", amount: 500 },
    ],
    total: 2700,
    status: "Pending",
  },
  {
    id: "INV-2026-1003",
    patientName: "Meera Iyer",
    date: "2026-07-11",
    items: [
      { label: "Consultation Fee", amount: 800 },
    ],
    total: 800,
    status: "Partially Paid",
  },
];

export const receptionProfile = {
  id: "reception_demo",
  name: "Priya Nair",
  role: "Front-Desk Receptionist",
  phone: "+91 98765 43210",
  email: "priya.nair@medisphere.example",
  address: "MediSphere Clinic, MG Road, Pune",
  joinedOn: "2023-09-01",
};