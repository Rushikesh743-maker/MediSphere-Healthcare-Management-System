import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Pill, FlaskConical, CheckCircle2, FileText } from "lucide-react";
import { patientAppointments, prescriptions, patientLabReports } from "@/lib/patientMockData";

export const Route = createFileRoute("/patient/")({
  component: PatientDashboard,
});

function PatientDashboard() {
  const upcoming = patientAppointments
    .filter((a) => a.status === "Confirmed")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const pendingRequests = patientAppointments.filter((a) => a.status === "Pending").length;
  const activeRx = prescriptions.length;
  const recentLabs = patientLabReports.filter((l) => l.status === "Completed").length;

  const stats = [
    {
      label: "Upcoming Appointment",
      value: upcoming ? `${upcoming.date} · ${upcoming.time ?? "TBD"}` : "None",
      icon: CalendarDays,
      color: "text-blue-600",
    },
    { label: "Pending Requests", value: pendingRequests, icon: ClipboardList, color: "text-amber-600" },
    { label: "Active Prescriptions", value: activeRx, icon: Pill, color: "text-green-600" },
    { label: "Recent Lab Reports", value: recentLabs, icon: FlaskConical, color: "text-purple-600" },
  ];

  const activity = [
    ...patientAppointments.slice(0, 3).map((a) => ({
      icon: CalendarDays,
      title: `Appointment with ${a.doctor}`,
      meta: `${a.department} · ${a.date}${a.time ? " · " + a.time : ""}`,
      status: a.status,
    })),
    ...prescriptions.slice(0, 2).map((p) => ({
      icon: Pill,
      title: `Prescription from ${p.doctor}`,
      meta: `${p.diagnosis} · ${p.date}`,
      status: "Issued",
    })),
    ...patientLabReports.slice(0, 2).map((l) => ({
      icon: FileText,
      title: `${l.test} report`,
      meta: `Requested by ${l.requestedBy} · ${l.date}`,
      status: l.status,
    })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Here is a quick summary of your health activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">{s.label}</p>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Recent Activity</h2>
            <Link to="/patient/appointments" className="text-xs text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-slate-100">
            {activity.map((a, i) => (
              <li key={i} className="py-3 flex items-start gap-3">
                <div className="h-8 w-8 rounded-md bg-slate-100 grid place-items-center text-slate-600">
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{a.title}</p>
                  <p className="text-xs text-slate-500">{a.meta}</p>
                </div>
                <span className="text-xs text-slate-500">{a.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Quick Actions</h2>
          <div className="mt-3 space-y-2">
            <Link
              to="/patient/request-appointment"
              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Request Appointment <CalendarDays className="h-4 w-4 text-blue-600" />
            </Link>
            <Link
              to="/patient/prescriptions"
              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              View Prescriptions <Pill className="h-4 w-4 text-green-600" />
            </Link>
            <Link
              to="/patient/lab-reports"
              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Lab Reports <FlaskConical className="h-4 w-4 text-purple-600" />
            </Link>
            <Link
              to="/patient/billing"
              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Billing <CheckCircle2 className="h-4 w-4 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}