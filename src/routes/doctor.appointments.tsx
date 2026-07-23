import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Eye, Play } from "lucide-react";
import { useReceptionStore } from "@/lib/receptionStore";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/doctor/appointments")({
  component: AppointmentsPage,
});

const statusStyle: Record<string, string> = {
  Waiting: "bg-amber-100 text-amber-700",
  "In Consultation": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Called: "bg-purple-100 text-purple-700",
};

function AppointmentsPage() {
  const [query, setQuery] = useState("");
  const { requests, queue } = useReceptionStore();
  const user = getCurrentUser();
  const doctorName = user?.name ?? "Dr. Ayesha Sharma";

  const appts = useMemo(() => {
    const mine = requests.filter(
      (r) => r.status === "Confirmed" && r.assignedDoctor === doctorName && r.patientId,
    );
    return mine.map((r) => {
      const q = queue.find(
        (q) => q.patientName === r.patientName && q.doctor === doctorName,
      );
      return {
        id: r.id,
        patientId: r.patientId!,
        patientName: r.patientName,
        time: r.scheduledTime ?? "—",
        reason: r.reason,
        status: q?.status ?? "Waiting",
        token: r.tokenNumber,
      };
    });
  }, [requests, queue, doctorName]);

  const filtered = appts.filter(
    (a) =>
      a.patientName.toLowerCase().includes(query.toLowerCase()) ||
      a.reason.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold text-slate-900">Appointments</h1>
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Search patient or reason..."
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">
                  {a.patientName}
                  {a.token != null && (
                    <span className="ml-2 text-xs text-slate-500">#{a.token}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-700">{a.time}</td>
                <td className="px-4 py-3 text-slate-700">{a.reason}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[a.status] ?? "bg-slate-100 text-slate-700"}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to="/doctor/patients/$id"
                      params={{ id: a.patientId }}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="h-3 w-3" /> View Patient
                    </Link>
                    <Link
                      to="/doctor/consultation/$id"
                      params={{ id: a.patientId }}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      <Play className="h-3 w-3" /> Start Consultation
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No appointments match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}