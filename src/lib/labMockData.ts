export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  doctor: string;
  test: string;
  requestedOn: string;
  priority: "Routine" | "Urgent";
  status: "Pending" | "In Progress" | "Completed";
  startedOn?: string;
  completedOn?: string;
  result?: string;
  notes?: string;
  reportFileName?: string;
}

export const initialLabTests: LabTest[] = [
  { id: "LT001", patientId: "P001", patientName: "Rohan Patel", patientPhone: "+91 98220 11223", patientAge: 34, patientGender: "Male", doctor: "Dr. Ayesha Sharma", test: "HbA1c", requestedOn: "2026-07-08", priority: "Routine", status: "Pending" },
  { id: "LT002", patientId: "P005", patientName: "Vikram Singh", patientPhone: "+91 98333 77889", patientAge: 60, patientGender: "Male", doctor: "Dr. Rajiv Menon", test: "Lipid Profile", requestedOn: "2026-07-07", priority: "Urgent", status: "In Progress", startedOn: "2026-07-08" },
  { id: "LT003", patientId: "P002", patientName: "Meera Iyer", patientPhone: "+91 99001 22334", patientAge: 28, patientGender: "Female", doctor: "Dr. Meera Nathan", test: "MRI Brain", requestedOn: "2026-07-06", priority: "Routine", status: "Pending" },
  { id: "LT004", patientId: "P003", patientName: "Arjun Verma", patientPhone: "+91 98111 44556", patientAge: 45, patientGender: "Male", doctor: "Dr. Ayesha Sharma", test: "Chest X-Ray", requestedOn: "2026-07-05", priority: "Routine", status: "Completed", startedOn: "2026-07-05", completedOn: "2026-07-06", result: "No abnormality detected. Lung fields clear.", notes: "Follow-up in 6 months if symptomatic.", reportFileName: "LT004_ChestXRay.pdf" },
  { id: "LT005", patientId: "P004", patientName: "Sneha Kulkarni", patientPhone: "+91 90000 55667", patientAge: 52, patientGender: "Female", doctor: "Dr. Anil Deshmukh", test: "Vitamin D", requestedOn: "2026-07-09", priority: "Routine", status: "Pending" },
  { id: "LT006", patientId: "P001", patientName: "Rohan Patel", patientPhone: "+91 98220 11223", patientAge: 34, patientGender: "Male", doctor: "Dr. Ayesha Sharma", test: "Complete Blood Count", requestedOn: "2026-05-14", priority: "Routine", status: "Completed", startedOn: "2026-05-14", completedOn: "2026-05-15", result: "All parameters within normal range.", reportFileName: "LT006_CBC.pdf" },
  { id: "LT007", patientId: "P002", patientName: "Meera Iyer", patientPhone: "+91 99001 22334", patientAge: 28, patientGender: "Female", doctor: "Dr. Ayesha Sharma", test: "Thyroid Panel", requestedOn: "2026-07-04", priority: "Urgent", status: "In Progress", startedOn: "2026-07-05" },
];

export const labActivity = [
  { hour: "8 AM", tests: 2 },
  { hour: "10 AM", tests: 5 },
  { hour: "12 PM", tests: 4 },
  { hour: "2 PM", tests: 6 },
  { hour: "4 PM", tests: 3 },
  { hour: "6 PM", tests: 1 },
];

export const labStaffProfile = {
  name: "Karan Mehta",
  employeeId: "LAB-1042",
  department: "Pathology & Diagnostics",
  designation: "Senior Lab Technician",
  email: "karan.mehta@medisphere.com",
  phone: "+91 98765 43210",
  shift: "Morning (8 AM - 4 PM)",
  joinedOn: "2022-06-15",
};
