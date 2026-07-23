import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useLabStore } from "@/lib/labStore";

export const Route = createFileRoute("/lab/in-progress")({
  component: InProgressTests,
});

function InProgressTests() {
  const { tests } = useLabStore();
  const navigate = useNavigate();
  const inProgress = tests.filter((t) => t.status === "In Progress");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">In Progress Tests</h1>
        <p className="text-sm text-slate-500">Tests currently being processed by the lab.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Test</th>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Start Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inProgress.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">No tests in progress.</td></tr>
            )}
            {inProgress.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{t.patientName}</td>
                <td className="px-4 py-3 text-slate-700">{t.test}</td>
                <td className="px-4 py-3 text-slate-700">{t.doctor}</td>
                <td className="px-4 py-3 text-slate-700">{t.startedOn ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">In Progress</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate({ to: "/lab/upload", search: { testId: t.id } as any })}
                      className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-3 w-3" /> Complete Test
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
