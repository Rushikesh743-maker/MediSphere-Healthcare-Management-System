import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Eye, X, Printer } from "lucide-react";
import { prescriptions as seedPrescriptions, Prescription, patientProfile } from "@/lib/patientMockData";
import { useReceptionStore } from "@/lib/receptionStore";
import { currentPatientId } from "@/lib/auth";

export const Route = createFileRoute("/patient/prescriptions")({
  component: PrescriptionsPage,
});

function PrescriptionsPage() {
  const [selected, setSelected] = useState<Prescription | null>(null);
  const { prescriptions: dynamicRx } = useReceptionStore();
  const pid = currentPatientId();
  const prescriptions: Prescription[] = useMemo(() => {
    const dyn: Prescription[] = dynamicRx
      .filter((d) => d.patientId === pid)
      .map((d) => ({
        id: d.id,
        doctor: d.doctor,
        date: d.date,
        diagnosis: d.diagnosis,
        medicines: d.medicines,
        notes: d.notes,
      }));
    return [...dyn, ...seedPrescriptions];
  }, [dynamicRx, pid]);

  const download = (rx: Prescription) => {
    const content = `MediSphere Prescription
----------------------------
Rx ID: ${rx.id}
Patient: ${patientProfile.name} (${patientProfile.id})
Doctor: ${rx.doctor}
Date: ${rx.date}
Diagnosis: ${rx.diagnosis}

Medicines:
${rx.medicines.map((m, i) => `${i + 1}. ${m.name} — ${m.dosage} — ${m.duration} (${m.instructions})`).join("\n")}

Notes: ${rx.notes ?? "—"}
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${rx.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Prescriptions</h1>
        <p className="text-sm text-slate-500">Prescriptions issued by your doctors.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {prescriptions.map((rx) => (
          <div key={rx.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{rx.doctor}</p>
                <p className="text-xs text-slate-500">
                  {rx.date} · <span className="font-mono">{rx.id}</span>
                </p>
              </div>
              <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 text-xs">
                {rx.medicines.length} medicines
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{rx.diagnosis}</p>

            <ul className="mt-3 space-y-1 text-sm text-slate-700">
              {rx.medicines.slice(0, 2).map((m) => (
                <li key={m.name} className="flex justify-between">
                  <span>{m.name}</span>
                  <span className="text-slate-500">{m.dosage} · {m.duration}</span>
                </li>
              ))}
              {rx.medicines.length > 2 && (
                <li className="text-xs text-slate-500">+ {rx.medicines.length - 2} more</li>
              )}
            </ul>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelected(rx)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                <Eye className="h-3 w-3" /> View
              </button>
              <button
                onClick={() => download(rx)}
                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
              >
                <Download className="h-3 w-3" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 grid place-items-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Prescription {selected.id}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-sm text-slate-700">
              <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-3">
                <div>
                  <p className="text-base font-semibold text-blue-600">MediSphere Clinic</p>
                  <p className="text-xs text-slate-500">Prescription slip</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p>Date: {selected.date}</p>
                  <p>Rx: {selected.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500">Patient</p>
                  <p className="font-medium text-slate-900">{patientProfile.name} ({patientProfile.age}/{patientProfile.gender[0]})</p>
                </div>
                <div>
                  <p className="text-slate-500">Doctor</p>
                  <p className="font-medium text-slate-900">{selected.doctor}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500">Diagnosis</p>
                <p className="font-medium text-slate-900">{selected.diagnosis}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Medicines</p>
                <table className="w-full text-xs border border-slate-200 rounded">
                  <thead className="bg-slate-50 text-slate-600 text-left">
                    <tr>
                      <th className="px-2 py-1.5 font-medium">Medicine</th>
                      <th className="px-2 py-1.5 font-medium">Dosage</th>
                      <th className="px-2 py-1.5 font-medium">Duration</th>
                      <th className="px-2 py-1.5 font-medium">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selected.medicines.map((m) => (
                      <tr key={m.name}>
                        <td className="px-2 py-1.5">{m.name}</td>
                        <td className="px-2 py-1.5">{m.dosage}</td>
                        <td className="px-2 py-1.5">{m.duration}</td>
                        <td className="px-2 py-1.5 text-slate-600">{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selected.notes && (
                <div>
                  <p className="text-xs text-slate-500">Notes</p>
                  <p>{selected.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
              >
                <Printer className="h-3 w-3" /> Print
              </button>
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