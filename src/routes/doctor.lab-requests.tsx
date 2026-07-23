import { createFileRoute } from "@tanstack/react-router";
import { useLabStore } from "@/lib/labStore";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/doctor/lab-requests")({
  component: LabRequestsPage,
});

const statusStyle: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

function LabRequestsPage() {
  const { tests } = useLabStore();
  const user = getCurrentUser();
  const doctorName = user?.name ?? "Dr.Ruhikesh N";
  const labRequests = tests.filter((t) => t.doctor === doctorName);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Lab Requests</h1>
        <p className="text-sm text-slate-500">Tests you have ordered — updates live as the lab processes them.</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Test</th>
              <th className="px-4 py-3 font-medium">Requested On</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {labRequests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  No lab requests yet. Order tests from a consultation.
                </td>
              </tr>
            )}
            {labRequests.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-slate-700">{r.id}</td>
                <td className="px-4 py-3 text-slate-900">{r.patientName}</td>
                <td className="px-4 py-3 text-slate-700">{r.test}</td>
                <td className="px-4 py-3 text-slate-700">{r.requestedOn}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.priority === "Urgent" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                    {r.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                  {r.result ?? <span className="text-slate-400 italic">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}