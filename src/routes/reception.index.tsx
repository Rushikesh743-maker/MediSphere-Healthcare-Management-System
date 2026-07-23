import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Users, Stethoscope } from "lucide-react";
import { useReceptionStore } from "@/lib/receptionStore";

export const Route = createFileRoute("/reception/")({
  component: ReceptionDashboard,
});

const priorityStyle: Record<string, string> = {
  Normal: "bg-slate-100 text-slate-700",
  Urgent: "bg-red-100 text-red-700",
};

const queueStyle: Record<string, string> = {
  Waiting: "bg-amber-100 text-amber-700",
  Called: "bg-blue-100 text-blue-700",
  "In Consultation": "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
};

const doctorStyle: Record<string, string> = {
  Available: "bg-green-100 text-green-700",
  "In Consultation": "bg-amber-100 text-amber-700",
  Offline: "bg-slate-100 text-slate-600",
};

function ReceptionDashboard() {
  const { requests, queue, doctors } = useReceptionStore();
  const todayAppts = requests.filter((r) => r.status === "Confirmed").length;
  const pending = requests.filter((r) => r.status === "Pending").length;
  const waiting = queue.filter((q) => q.status === "Waiting" || q.status === "Called").length;
  const available = doctors.filter((d) => d.status === "Available").length;

  const stats = [
    { label: "Today's Appointments", value: todayAppts, icon: CalendarDays, color: "text-blue-600" },
    { label: "Pending Requests", value: pending, icon: ClipboardList, color: "text-amber-600" },
    { label: "Waiting Patients", value: waiting, icon: Users, color: "text-purple-600" },
    { label: "Doctors Available", value: available, icon: Stethoscope, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Front-desk overview for today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">{s.label}</p>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Recent Appointment Requests</h2>
            <Link to="/reception/requests" className="text-xs text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-slate-100">
            {requests.slice(0, 5).map((r) => (
              <li key={r.id} className="py-2 flex items-center justify-between text-sm">
                <div>
                  <div className="text-slate-900">{r.patientName}</div>
                  <div className="text-xs text-slate-500">{r.department} · {r.preferredDate}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyle[r.priority]}`}>
                  {r.priority}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Today's Queue</h2>
            <Link to="/reception/queue" className="text-xs text-blue-600 hover:underline">
              Manage
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-slate-100">
            {queue.slice(0, 5).map((q) => (
              <li key={q.id} className="py-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-md bg-slate-100 grid place-items-center text-xs font-semibold text-slate-700">
                    {q.token}
                  </span>
                  <div>
                    <div className="text-slate-900">{q.patientName}</div>
                    <div className="text-xs text-slate-500">{q.doctor} · {q.time}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${queueStyle[q.status]}`}>
                  {q.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Doctor Availability</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-md border border-slate-200 p-3">
              <div>
                <div className="text-sm text-slate-900">{d.name}</div>
                <div className="text-xs text-slate-500">{d.department}</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${doctorStyle[d.status]}`}>
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}