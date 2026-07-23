import { createFileRoute, Link } from "@tanstack/react-router";
import { FlaskConical, Loader2, CheckCircle2, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useLabStore } from "@/lib/labStore";
import { labActivity } from "@/lib/labMockData";

export const Route = createFileRoute("/lab/")({
  component: LabDashboard,
});

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-md grid place-items-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function LabDashboard() {
  const { tests } = useLabStore();
  const pending = tests.filter((t) => t.status === "Pending");
  const inProgress = tests.filter((t) => t.status === "In Progress");
  const completed = tests.filter((t) => t.status === "Completed");
  const uploaded = completed.filter((t) => t.reportFileName).length;
  const recent = [...tests]
    .sort((a, b) => b.requestedOn.localeCompare(a.requestedOn))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Laboratory Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of today's laboratory work.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FlaskConical} label="Pending Tests" value={pending.length} color="bg-amber-100 text-amber-700" />
        <StatCard icon={Loader2} label="Tests In Progress" value={inProgress.length} color="bg-blue-100 text-blue-700" />
        <StatCard icon={CheckCircle2} label="Completed Tests" value={completed.length} color="bg-green-100 text-green-700" />
        <StatCard icon={FileText} label="Reports Uploaded" value={uploaded} color="bg-indigo-100 text-indigo-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Today's Laboratory Activity</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={labActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="tests" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">Recent Test Requests</h2>
            <Link to="/lab/pending" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <ul className="space-y-3">
            {recent.map((t) => (
              <li key={t.id} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-900 font-medium">{t.patientName}</span>
                  <span className="text-xs text-slate-500">{t.requestedOn}</span>
                </div>
                <div className="text-xs text-slate-500">{t.test} • {t.doctor}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
