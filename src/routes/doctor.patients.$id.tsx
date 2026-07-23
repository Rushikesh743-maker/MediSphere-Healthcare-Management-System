import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Play } from "lucide-react";
import { getPatient } from "@/lib/mockData";

export const Route = createFileRoute("/doctor/patients/$id")({
  component: PatientDetailPage,
});

const tabs = ["Overview", "Medical History", "Allergies", "Previous Consultations", "Vital Signs", "Laboratory Reports"] as const;
type Tab = (typeof tabs)[number];

function PatientDetailPage() {
  const { id } = Route.useParams();
  const patient = getPatient(id);
  const [tab, setTab] = useState<Tab>("Overview");

  if (!patient) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
        Patient not found.{" "}
        <Link to="/doctor/patients" className="text-blue-600 hover:underline">Back to patients</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link to="/doctor/patients" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" /> Back to Patients
        </Link>
        <Link
          to="/doctor/consultation/$id"
          params={{ id: patient.id }}
          className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
        >
          <Play className="h-3 w-3" /> Start Consultation
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-blue-600 text-white grid place-items-center text-xl font-semibold">
            {patient.name[0]}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{patient.name}</h1>
            <p className="text-sm text-slate-500">
              {patient.id} &middot; {patient.age} yrs &middot; {patient.gender} &middot; {patient.bloodGroup} &middot; {patient.phone}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm border-b-2 -mb-px ${
                  tab === t
                    ? "border-blue-600 text-blue-600 font-medium"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 text-sm text-slate-700">
          {tab === "Overview" && (
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Blood Group" value={patient.bloodGroup} />
              <InfoRow label="Phone" value={patient.phone} />
              <InfoRow label="Conditions" value={patient.conditions.join(", ") || "None"} />
              <InfoRow label="Allergies" value={patient.allergies.join(", ") || "None"} />
            </div>
          )}

          {tab === "Medical History" && (
            <ul className="space-y-2">
              {patient.conditions.length === 0 && <li className="text-slate-500">No known conditions.</li>}
              {patient.conditions.map((c) => (
                <li key={c} className="rounded-md border border-slate-200 px-3 py-2">{c}</li>
              ))}
            </ul>
          )}

          {tab === "Allergies" && (
            <ul className="space-y-2">
              {patient.allergies.length === 0 && <li className="text-slate-500">No known allergies.</li>}
              {patient.allergies.map((a) => (
                <li key={a} className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2">{a}</li>
              ))}
            </ul>
          )}

          {tab === "Previous Consultations" && (
            <ul className="divide-y divide-slate-100">
              {patient.history.map((h, i) => (
                <li key={i} className="py-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-900">{h.diagnosis}</span>
                    <span className="text-xs text-slate-500">{h.date}</span>
                  </div>
                  <p className="text-xs text-slate-500">{h.doctor}</p>
                  <p className="mt-1 text-sm">{h.notes}</p>
                </li>
              ))}
            </ul>
          )}

          {tab === "Vital Signs" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Vital label="Blood Pressure" value={patient.vitals.bp + " mmHg"} />
              <Vital label="Heart Rate" value={patient.vitals.heartRate + " bpm"} />
              <Vital label="Temperature" value={patient.vitals.temperature + " °F"} />
              <Vital label="SpO2" value={patient.vitals.spo2 + " %"} />
              <Vital label="Weight" value={patient.vitals.weight + " kg"} />
              <Vital label="Height" value={patient.vitals.height + " cm"} />
            </div>
          )}

          {tab === "Laboratory Reports" && (
            <ul className="divide-y divide-slate-100">
              {patient.labReports.length === 0 && <li className="py-3 text-slate-500">No lab reports.</li>}
              {patient.labReports.map((r) => (
                <li key={r.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.date} &middot; {r.result ?? "Result pending"}</p>
                  </div>
                  <span className={`self-start text-xs px-2 py-0.5 rounded-full ${
                    r.status === "Completed" ? "bg-green-100 text-green-700" :
                    r.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-slate-900">{value}</p>
    </div>
  );
}

function Vital({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}