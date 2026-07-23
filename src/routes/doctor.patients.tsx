import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { patients } from "@/lib/mockData";

export const Route = createFileRoute("/doctor/patients")({
  component: PatientsLayout,
});

function PatientsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/doctor/patients") return <Outlet />;
  return <PatientsList />;
}

function PatientsList() {
  const [q, setQ] = useState("");
  const list = patients.filter((p) =>
    (p.name + p.id + p.phone).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-semibold text-slate-900">Patients</h1>
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, ID or phone..."
            className="rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Age / Gender</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Conditions</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-slate-700">{p.id}</td>
                <td className="px-4 py-3 text-slate-900">{p.name}</td>
                <td className="px-4 py-3 text-slate-700">{p.age} / {p.gender}</td>
                <td className="px-4 py-3 text-slate-700">{p.phone}</td>
                <td className="px-4 py-3 text-slate-700">{p.conditions.join(", ") || "-"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/doctor/patients/$id"
                    params={{ id: p.id }}
                    className="text-blue-600 text-xs hover:underline"
                  >
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}