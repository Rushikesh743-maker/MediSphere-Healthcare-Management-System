import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Play, X } from "lucide-react";
import { useLabStore, labActions } from "@/lib/labStore";
import { LabTest } from "@/lib/labMockData";

export const Route = createFileRoute("/lab/pending")({
  component: PendingTests,
});

function PendingTests() {
  const { tests } = useLabStore();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<LabTest | null>(null);
  const pending = tests.filter((t) => t.status === "Pending");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Pending Tests</h1>
        <p className="text-sm text-slate-500">Laboratory requests waiting to be started.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Test</th>
              <th className="px-4 py-3 font-medium">Requested</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pending.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-500">No pending tests.</td></tr>
            )}
            {pending.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{t.patientName}</td>
                <td className="px-4 py-3 text-slate-700">{t.doctor}</td>
                <td className="px-4 py-3 text-slate-700">{t.test}</td>
                <td className="px-4 py-3 text-slate-700">{t.requestedOn}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${t.priority === "Urgent" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
                    {t.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Pending</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setSelected(t)} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">
                      <Eye className="h-3 w-3" /> Details
                    </button>
                    <button
                      onClick={() => { labActions.startTest(t.id); navigate({ to: "/lab/in-progress" }); }}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      <Play className="h-3 w-3" /> Start Test
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 grid place-items-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Test Details</h2>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-2 text-sm">
              <p><span className="text-slate-500">Request ID:</span> <span className="font-mono">{selected.id}</span></p>
              <p><span className="text-slate-500">Patient:</span> {selected.patientName} ({selected.patientId})</p>
              <p><span className="text-slate-500">Age/Gender:</span> {selected.patientAge} / {selected.patientGender}</p>
              <p><span className="text-slate-500">Phone:</span> {selected.patientPhone}</p>
              <p><span className="text-slate-500">Doctor:</span> {selected.doctor}</p>
              <p><span className="text-slate-500">Test:</span> {selected.test}</p>
              <p><span className="text-slate-500">Requested On:</span> {selected.requestedOn}</p>
              <p><span className="text-slate-500">Priority:</span> {selected.priority}</p>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200">
              <button onClick={() => setSelected(null)} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">Close</button>
              <button
                onClick={() => { labActions.startTest(selected.id); setSelected(null); navigate({ to: "/lab/in-progress" }); }}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
              >Start Test</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
