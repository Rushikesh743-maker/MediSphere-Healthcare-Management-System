import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { receptionActions, useReceptionStore } from "@/lib/receptionStore";
import { z } from "zod";

const searchSchema = z.object({ requestId: z.string().optional() });

export const Route = createFileRoute("/reception/schedule")({
  validateSearch: (s) => searchSchema.parse(s),
  component: SchedulePage,
});

const doctorStyle: Record<string, string> = {
  Available: "bg-green-100 text-green-700",
  "In Consultation": "bg-amber-100 text-amber-700",
  Offline: "bg-slate-100 text-slate-600",
};

function SchedulePage() {
  const { requestId } = Route.useSearch();
  const { requests, doctors } = useReceptionStore();
  const pendingRequests = requests.filter((r) => r.status === "Pending");

  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    requestId ?? pendingRequests[0]?.id ?? "",
  );
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const currentRequest = useMemo(
    () => requests.find((r) => r.id === selectedRequestId),
    [requests, selectedRequestId],
  );
  const availableDoctors = doctors.filter((d) => d.status === "Available");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRequest || !doctor || !date || !time) return;
    const token = receptionActions.scheduleAppointment(currentRequest.id, { doctor, date, time });
    setSuccess(`Confirmed! Token #${token} generated for ${currentRequest.patientName}.`);
    setDoctor("");
    setDate("");
    setTime("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Schedule Appointment</h1>
        <p className="text-sm text-slate-500">Assign an available doctor and time to a pending request.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Appointment Request</label>
              <select
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                required
              >
                <option value="">-- Select --</option>
                {pendingRequests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.patientName} — {r.department} ({r.preferredDate})
                  </option>
                ))}
              </select>
            </div>

            {currentRequest && (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <div><span className="text-slate-500">Reason:</span> {currentRequest.reason}</div>
                <div><span className="text-slate-500">Preferred:</span> {currentRequest.preferredDoctor} on {currentRequest.preferredDate}</div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">Assign Doctor (Available only)</label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                required
              >
                <option value="">-- Select --</option>
                {availableDoctors.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} — {d.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Confirm & Generate Token
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Doctor Availability</h2>
          <ul className="mt-3 space-y-2">
            {doctors.map((d) => (
              <li key={d.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="text-slate-900">{d.name}</div>
                  <div className="text-xs text-slate-500">{d.department}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${doctorStyle[d.status]}`}>
                  {d.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}