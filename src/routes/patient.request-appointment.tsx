import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { departments, doctorsByDepartment } from "@/lib/patientMockData";
import { receptionActions } from "@/lib/receptionStore";
import { currentPatientId } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/patient/request-appointment")({
  component: RequestAppointmentPage,
});

function RequestAppointmentPage() {
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState<"Normal" | "Urgent">("Normal");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const doctors = department ? doctorsByDepartment[department] ?? [] : [];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = getCurrentUser();
    const req = receptionActions.submitPatientRequest({
      patientId: currentPatientId(),
      patientName: user?.name ?? "Patient",
      department,
      preferredDoctor: doctor,
      preferredDate: date,
      reason,
      priority,
      notes,
    });
    setSubmitted(req.id);
  };

  const reset = () => {
    setDepartment("");
    setDoctor("");
    setDate("");
    setReason("");
    setPriority("Normal");
    setNotes("");
    setSubmitted(null);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Request Appointment</h1>
        <p className="text-sm text-slate-500">
          Submit a request — the receptionist will confirm a time and notify you.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-green-800">Request submitted</h2>
              <p className="text-sm text-green-700 mt-1">
                Your appointment request <span className="font-mono">{submitted}</span> has been created
                with status <b>Pending</b>. You will receive a confirmation once the receptionist
                assigns a time.
              </p>
              <button
                onClick={reset}
                className="mt-4 rounded-md border border-green-300 bg-white px-3 py-1.5 text-xs text-green-700 hover:bg-green-100"
              >
                Submit another request
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Department</label>
              <select
                required
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setDoctor("");
                }}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Preferred Doctor (Optional)</label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                disabled={!department}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
              >
                <option value="">Any available</option>
                {doctors.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Preferred Date</label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "Normal" | "Urgent")}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option>Normal</option>
                <option>Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Reason for Visit</label>
            <input
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Persistent cough, follow-up review"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Additional Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any information the doctor should know beforehand"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      )}
    </div>
  );
}