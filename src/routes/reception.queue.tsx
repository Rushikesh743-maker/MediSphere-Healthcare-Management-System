import { createFileRoute } from "@tanstack/react-router";
import { receptionActions, useReceptionStore } from "@/lib/receptionStore";
import type { QueueStatus } from "@/lib/receptionMockData";

export const Route = createFileRoute("/reception/queue")({
  component: QueuePage,
});

const statusOptions: QueueStatus[] = ["Waiting", "Called", "In Consultation", "Completed"];

const statusStyle: Record<QueueStatus, string> = {
  Waiting: "bg-amber-100 text-amber-700 border-amber-200",
  Called: "bg-blue-100 text-blue-700 border-blue-200",
  "In Consultation": "bg-purple-100 text-purple-700 border-purple-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
};

function QueuePage() {
  const { queue } = useReceptionStore();
  const sorted = [...queue].sort((a, b) => a.token - b.token);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Queue Management</h1>
        <p className="text-sm text-slate-500">Track and update today's patient queue.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Token</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className="inline-grid h-8 w-8 place-items-center rounded-md bg-slate-100 text-sm font-semibold text-slate-700">
                    {q.token}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-900">{q.patientName}</td>
                <td className="px-4 py-3 text-slate-700">{q.doctor}</td>
                <td className="px-4 py-3 text-slate-700">{q.time}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyle[q.status]}`}>
                    {q.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <select
                      value={q.status}
                      onChange={(e) => receptionActions.updateQueueStatus(q.id, e.target.value as QueueStatus)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs outline-none focus:border-blue-500"
                    >
                      {statusOptions.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Queue is empty.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}