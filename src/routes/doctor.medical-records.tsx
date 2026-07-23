import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { patients } from "@/lib/mockData";

export const Route = createFileRoute("/doctor/medical-records")({
  component: MedicalRecordsPage,
});

function MedicalRecordsPage() {
  const records = patients.flatMap((p) =>
    p.history.map((h) => ({ ...h, patientId: p.id, patientName: p.name })),
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Medical Records</h1>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
        {records.map((r, i) => (
          <div key={i} className="p-4 flex items-start gap-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="font-medium text-slate-900">{r.diagnosis}</p>
                <span className="text-xs text-slate-500">{r.date}</span>
              </div>
              <p className="text-xs text-slate-500">
                <Link
                  to="/doctor/patients/$id"
                  params={{ id: r.patientId }}
                  className="text-blue-600 hover:underline"
                >
                  {r.patientName}
                </Link>{" "}
                &middot; {r.doctor}
              </p>
              <p className="mt-1 text-sm text-slate-700">{r.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}