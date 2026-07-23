import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Download, X } from "lucide-react";
import { useLabStore } from "@/lib/labStore";
import { LabTest } from "@/lib/labMockData";

export const Route = createFileRoute("/lab/completed")({
  component: CompletedTests,
});

function CompletedTests() {
  const { tests } = useLabStore();
  const [selected, setSelected] = useState<LabTest | null>(null);
  const completed = tests.filter((t) => t.status === "Completed");

  const download = (t: LabTest) => {
    const content = `MediSphere Laboratory Report
-------------------------------
Report ID: ${t.id}
Patient: ${t.patientName} (${t.patientId})
Test: ${t.test}
Doctor: ${t.doctor}
Completed On: ${t.completedOn ?? "—"}

Result:
${t.result ?? "—"}

Notes:
${t.notes ?? "—"}
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = t.reportFileName ?? `${t.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Completed Tests</h1>
        <p className="text-sm text-slate-500">Reports uploaded to the system.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Test</th>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">View Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {completed.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">No completed reports yet.</td></tr>
            )}
            {completed.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{t.patientName}</td>
                <td className="px-4 py-3 text-slate-700">{t.test}</td>
                <td className="px-4 py-3 text-slate-700">{t.doctor}</td>
                <td className="px-4 py-3 text-slate-700">{t.completedOn ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Completed</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setSelected(t)} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">
                      <Eye className="h-3 w-3" /> Preview
                    </button>
                    <button onClick={() => download(t)} className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">
                      <Download className="h-3 w-3" /> Download
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
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Report — {selected.test}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-700"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 text-sm text-slate-700 space-y-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Report ID: <span className="font-mono">{selected.id}</span></span>
                <span>Date: {selected.completedOn}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Patient</p>
                <p className="font-medium text-slate-900">{selected.patientName} ({selected.patientId})</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Requesting Doctor</p>
                <p className="font-medium text-slate-900">{selected.doctor}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Result</p>
                <p className="font-medium text-slate-900 whitespace-pre-wrap">{selected.result}</p>
                {selected.notes && <p className="text-xs text-slate-600 mt-1">Notes: {selected.notes}</p>}
              </div>
              {selected.reportFileName && (
                <p className="text-xs text-slate-500">Attached file: <span className="font-mono">{selected.reportFileName}</span></p>
              )}
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200">
              <button onClick={() => download(selected)} className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700">
                <Download className="h-3 w-3" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
