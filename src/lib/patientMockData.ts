export interface PatientAppointment {
  id: string;
  doctor: string;
  department: string;
  date: string;
  time: string | null;
  reason: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

export interface Prescription {
  id: string;
  doctor: string;
  date: string;
  diagnosis: string;
  medicines: { name: string; dosage: string; duration: string; instructions: string }[];
  notes?: string;
}

export interface PatientLabReport {
  id: string;
  test: string;
  requestedBy: string;
  date: string;
  status: "Pending" | "In Progress" | "Completed";
  result?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
}

export const patientProfile = {
  id: "P001",
  name: "Rohan Patel",
  age: 34,
  gender: "Male",
  dob: "1991-08-12",
  bloodGroup: "B+",
  phone: "+91 98220 11223",
  email: "rohan.patel@example.com",
  address: "12, Silver Oak Apartments, Baner Road, Pune, MH 411045",
  emergencyContact: { name: "Neha Patel", relation: "Spouse", phone: "+91 98220 44556" },
  insurance: {
    provider: "Star Health Insurance",
    policyNumber: "SH-2026-778234",
    validTill: "2027-03-31",
    sumInsured: "₹ 5,00,000",
  },
};

export const patientAppointments: PatientAppointment[] = [
  {
    id: "PA001",
    doctor: "Dr. Ayesha Sharma",
    department: "General Medicine",
    date: "2026-07-15",
    time: "10:30",
    reason: "Diabetes follow-up",
    status: "Confirmed",
  },
  {
    id: "PA002",
    doctor: "Dr. Rajiv Menon",
    department: "Cardiology",
    date: "2026-07-20",
    time: null,
    reason: "Chest discomfort review",
    status: "Pending",
  },
  {
    id: "PA003",
    doctor: "Dr. Ayesha Sharma",
    department: "General Medicine",
    date: "2026-06-10",
    time: "11:00",
    reason: "Viral fever",
    status: "Completed",
  },
  {
    id: "PA004",
    doctor: "Dr. Kavita Rao",
    department: "Dermatology",
    date: "2026-05-22",
    time: "16:00",
    reason: "Skin allergy",
    status: "Cancelled",
  },
];

export const prescriptions: Prescription[] = [
  {
    id: "RX1001",
    doctor: "Dr. Ayesha Sharma",
    date: "2026-06-10",
    diagnosis: "Type 2 Diabetes — routine review",
    medicines: [
      { name: "Metformin 500mg", dosage: "1-0-1", duration: "30 days", instructions: "After meals" },
      { name: "Glimepiride 1mg", dosage: "1-0-0", duration: "30 days", instructions: "Before breakfast" },
    ],
    notes: "Monitor fasting sugar weekly. Follow-up in 4 weeks.",
  },
  {
    id: "RX1002",
    doctor: "Dr. Ayesha Sharma",
    date: "2026-05-14",
    diagnosis: "Viral fever",
    medicines: [
      { name: "Paracetamol 650mg", dosage: "1-1-1", duration: "5 days", instructions: "After meals" },
      { name: "Cetirizine 10mg", dosage: "0-0-1", duration: "5 days", instructions: "At bedtime" },
    ],
    notes: "Adequate rest and hydration.",
  },
  {
    id: "RX1003",
    doctor: "Dr. Rajiv Menon",
    date: "2026-02-02",
    diagnosis: "Hypertension",
    medicines: [
      { name: "Amlodipine 5mg", dosage: "1-0-0", duration: "60 days", instructions: "Morning, empty stomach" },
    ],
  },
];

export const patientLabReports: PatientLabReport[] = [
  {
    id: "LR2001",
    test: "HbA1c",
    requestedBy: "Dr. Ayesha Sharma",
    date: "2026-06-20",
    status: "Completed",
    result: "6.8% (target <7%)",
    notes: "Well controlled. Continue current regimen.",
  },
  {
    id: "LR2002",
    test: "Complete Blood Count",
    requestedBy: "Dr. Ayesha Sharma",
    date: "2026-05-14",
    status: "Completed",
    result: "All values within normal range.",
  },
  {
    id: "LR2003",
    test: "Lipid Profile",
    requestedBy: "Dr. Rajiv Menon",
    date: "2026-07-05",
    status: "In Progress",
  },
  {
    id: "LR2004",
    test: "Vitamin D",
    requestedBy: "Dr. Ayesha Sharma",
    date: "2026-07-09",
    status: "Pending",
  },
];

export const invoices: Invoice[] = [
  { id: "INV-2026-0421", date: "2026-06-10", description: "Consultation — General Medicine", amount: 800, status: "Paid" },
  { id: "INV-2026-0435", date: "2026-06-20", description: "HbA1c Lab Test", amount: 650, status: "Paid" },
  { id: "INV-2026-0512", date: "2026-07-05", description: "Lipid Profile", amount: 1200, status: "Pending" },
  { id: "INV-2026-0521", date: "2026-07-09", description: "Vitamin D Test", amount: 900, status: "Pending" },
  { id: "INV-2026-0301", date: "2026-05-14", description: "Consultation + CBC", amount: 1450, status: "Paid" },
];

export const medicalRecords = {
  diagnoses: [
    { condition: "Type 2 Diabetes", since: "2023-04-11", doctor: "Dr. Ayesha Sharma" },
    { condition: "Hypertension", since: "2022-11-02", doctor: "Dr. Rajiv Menon" },
  ],
  allergies: ["Penicillin", "Peanuts"],
  vaccinations: [
    { name: "COVID-19 Booster", date: "2025-11-20" },
    { name: "Influenza (Annual)", date: "2025-10-04" },
    { name: "Tetanus", date: "2022-06-18" },
  ],
  vitals: {
    bp: "132/84",
    heartRate: 78,
    temperature: 98.6,
    spo2: 98,
    weight: 78,
    height: 174,
    updatedOn: "2026-06-10",
  },
  consultations: [
    { date: "2026-06-10", doctor: "Dr. Ayesha Sharma", department: "General Medicine", diagnosis: "Diabetes follow-up", notes: "Continue Metformin, review in 4 weeks." },
    { date: "2026-05-14", doctor: "Dr. Ayesha Sharma", department: "General Medicine", diagnosis: "Viral fever", notes: "Symptomatic treatment prescribed." },
    { date: "2026-02-02", doctor: "Dr. Rajiv Menon", department: "Cardiology", diagnosis: "BP follow-up", notes: "Amlodipine continued." },
  ],
};

export const departments = [
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Pediatrics",
  "ENT",
  "Neurology",
  "Gynaecology",
];

export const doctorsByDepartment: Record<string, string[]> = {
  "General Medicine": ["Dr. Ayesha Sharma", "Dr. Ramesh Iyer"],
  Cardiology: ["Dr. Rajiv Menon", "Dr. Sanjana Kapoor"],
  Dermatology: ["Dr. Kavita Rao"],
  Orthopedics: ["Dr. Anil Deshmukh"],
  Pediatrics: ["Dr. Priya Sundar"],
  ENT: ["Dr. Farhan Qureshi"],
  Neurology: ["Dr. Meera Nathan"],
  Gynaecology: ["Dr. Sneha Kulkarni"],
};