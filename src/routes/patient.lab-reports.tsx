import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Eye, X } from "lucide-react";
import { patientLabReports as seedReports, PatientLabReport, patientProfile } from "@/lib/patientMockData";
import { useLabStore } from "@/lib/labStore";
import { currentPatientId } from "@/lib/auth";

export const Route = createFileRoute("/patient/lab-reports")({
  component: LabReportsPage,
});

const statusStyle: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

function LabReportsPage() {
  const [selected, setSelected] = useState<PatientLabReport | null>(null);
  const { tests } = useLabStore();
  const pid = currentPatientId();
  const patientLabReports: PatientLabReport[] = useMemo(() => {
    const dyn: PatientLabReport[] = tests
      .filter((t) => t.patientId === pid)
      .map((t) => ({
        id: t.id,
        test: t.test,
        requestedBy: t.doctor,
        date: t.requestedOn,
        status: t.status,
        result: t.result,
        notes: t.notes,
      }));
    return [...dyn, ...seedReports];
  }, [tests, pid]);

  const download = (r: PatientLabReport) => {
    const content = `MediSphere Laboratory Report
-------------------------------
Report ID: ${r.id}
Patient: ${patientProfile.name} (${patientProfile.id})
Test: ${r.test}
Requested By: ${r.requestedBy}
Date: ${r.date}
Status: ${r.status}

Result: ${r.result ?? "Pending"}
Notes: ${r.notes ?? "—"}
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${r.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Laboratory Reports</h1>
        <p className="text-sm text-slate-500">View and download your lab test reports.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Test Name</th>
              <th className="px-4 py-3 font-medium">Requested By</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">View Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patientLabReports.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{r.test}</td>
                <td className="px-4 py-3 text-slate-700">{r.requestedBy}</td>
                <td className="px-4 py-3 text-slate-700">{r.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      disabled={r.status !== "Completed"}
                      onClick={() => setSelected(r)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Eye className="h-3 w-3" /> Preview
                    </button>
                    <button
                      disabled={r.status !== "Completed"}
                      onClick={() => download(r)}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
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
              <h2 className="text-sm font-semibold text-slate-900">Lab Report — {selected.test}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 text-sm text-slate-700 space-y-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Report ID: <span className="font-mono">{selected.id}</span></span>
                <span>Date: {selected.date}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Patient</p>
                <p className="font-medium text-slate-900">{patientProfile.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Requested By</p>
                <p className="font-medium text-slate-900">{selected.requestedBy}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Result</p>
                <p className="font-medium text-slate-900">{selected.result}</p>
                {selected.notes && <p className="text-xs text-slate-600 mt-1">{selected.notes}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200">
              <button
                onClick={() => download(selected)}
                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
              >
                <Download className="h-3 w-3" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}