import { createFileRoute } from "@tanstack/react-router";
import { medicalRecords } from "@/lib/patientMockData";
import { useReceptionStore } from "@/lib/receptionStore";
import { currentPatientId } from "@/lib/auth";

export const Route = createFileRoute("/patient/medical-records")({
  component: MedicalRecordsPage,
});

function MedicalRecordsPage() {
  const { diagnoses, allergies, vaccinations, vitals, consultations: seedConsults } = medicalRecords;
  const { consultations: dynConsults } = useReceptionStore();
  const pid = currentPatientId();
  const consultations = [
    ...dynConsults
      .filter((c) => c.patientId === pid)
      .map((c) => ({
        date: c.date,
        doctor: c.doctor,
        department: c.department,
        diagnosis: c.diagnosis,
        notes: c.notes ?? "",
      })),
    ...seedConsults,
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Medical Records</h1>
        <p className="text-sm text-slate-500">Your complete health record on file.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Previous Diagnoses</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {diagnoses.map((d) => (
              <li key={d.condition} className="py-2 flex justify-between text-sm">
                <div>
                  <p className="text-slate-900">{d.condition}</p>
                  <p className="text-xs text-slate-500">{d.doctor}</p>
                </div>
                <span className="text-slate-500 text-xs">Since {d.since}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Allergies</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {allergies.length === 0 && <p className="text-sm text-slate-500">No known allergies.</p>}
            {allergies.map((a) => (
              <span key={a} className="rounded-full bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 text-xs">
                {a}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Vital Signs</h2>
          <p className="text-xs text-slate-500">Last updated {vitals.updatedOn}</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
            <Vital label="Blood Pressure" value={vitals.bp} />
            <Vital label="Heart Rate" value={`${vitals.heartRate} bpm`} />
            <Vital label="Temperature" value={`${vitals.temperature} °F`} />
            <Vital label="SpO₂" value={`${vitals.spo2}%`} />
            <Vital label="Weight" value={`${vitals.weight} kg`} />
            <Vital label="Height" value={`${vitals.height} cm`} />
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Vaccination History</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {vaccinations.map((v) => (
              <li key={v.name} className="py-2 flex justify-between text-sm">
                <span className="text-slate-800">{v.name}</span>
                <span className="text-slate-500 text-xs">{v.date}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-800">Consultation History</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Diagnosis</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {consultations.map((c) => (
              <tr key={c.date + c.doctor}>
                <td className="px-4 py-3 text-slate-700">{c.date}</td>
                <td className="px-4 py-3 text-slate-900">{c.doctor}</td>
                <td className="px-4 py-3 text-slate-700">{c.department}</td>
                <td className="px-4 py-3 text-slate-700">{c.diagnosis}</td>
                <td className="px-4 py-3 text-slate-500">{c.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Vital({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 p-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}