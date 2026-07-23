import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { patientAppointments, PatientAppointment } from "@/lib/patientMockData";
import { useReceptionStore } from "@/lib/receptionStore";
import { currentPatientId } from "@/lib/auth";

export const Route = createFileRoute("/patient/appointments")({
  component: PatientAppointmentsPage,
});

const statusStyle: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function PatientAppointmentsPage() {
  const [query, setQuery] = useState("");
  const { requests } = useReceptionStore();
  const pid = currentPatientId();

  const combined: PatientAppointment[] = useMemo(() => {
    const fromStore: PatientAppointment[] = requests
      .filter((r) => r.patientId === pid)
      .map((r) => ({
        id: r.id,
        doctor: r.assignedDoctor ?? r.preferredDoctor,
        department: r.department,
        date: r.scheduledDate ?? r.preferredDate,
        time: r.scheduledTime ?? null,
        reason: r.reason,
        status:
          r.status === "Rejected"
            ? "Cancelled"
            : r.status === "Confirmed"
            ? "Confirmed"
            : "Pending",
      }));
    // Include historical seeded appointments (past visits) that aren't in the store.
    const historical = patientAppointments.filter((a) => a.status === "Completed" || a.status === "Cancelled");
    return [...fromStore, ...historical];
  }, [requests, pid]);

  const filtered = combined.filter(
    (a) =>
      a.doctor.toLowerCase().includes(query.toLowerCase()) ||
      a.department.toLowerCase().includes(query.toLowerCase()) ||
      a.reason.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold text-slate-900">My Appointments</h1>
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Search doctor, department..."
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{a.doctor}</td>
                <td className="px-4 py-3 text-slate-700">{a.department}</td>
                <td className="px-4 py-3 text-slate-700">{a.date}</td>
                <td className="px-4 py-3 text-slate-700">
                  {a.time ?? <span className="text-slate-400 italic">Not Assigned</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[a.status]}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {(a.status === "Pending" || a.status === "Confirmed") && (
                      <button className="inline-flex items-center gap-1 rounded-md border border-red-200 text-red-600 px-2 py-1 text-xs hover:bg-red-50">
                        <X className="h-3 w-3" /> Cancel
                      </button>
                    )}
                    <button className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}