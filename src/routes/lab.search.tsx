import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLabStore } from "@/lib/labStore";

export const Route = createFileRoute("/lab/search")({
  component: PatientSearch,
});

function PatientSearch() {
  const { tests } = useLabStore();
  const [query, setQuery] = useState("");

  const patients = useMemo(() => {
    const map = new Map<string, { id: string; name: string; phone: string; age: number; gender: string; testCount: number; lastTest?: string }>();
    tests.forEach((t) => {
      const existing = map.get(t.patientId);
      if (existing) {
        existing.testCount += 1;
        if (!existing.lastTest || t.requestedOn > existing.lastTest) existing.lastTest = t.requestedOn;
      } else {
        map.set(t.patientId, {
          id: t.patientId,
          name: t.patientName,
          phone: t.patientPhone,
          age: t.patientAge,
          gender: t.patientGender,
          testCount: 1,
          lastTest: t.requestedOn,
        });
      }
    });
    return Array.from(map.values());
  }, [tests]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? patients.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q),
      )
    : patients;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Patient Search</h1>
        <p className="text-sm text-slate-500">Look up patients by name, ID, or phone number.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, patient ID or phone..."
          className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Patient ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Age / Gender</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Tests</th>
              <th className="px-4 py-3 font-medium">Last Requested</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">No patients found.</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-slate-700">{p.id}</td>
                <td className="px-4 py-3 text-slate-900">{p.name}</td>
                <td className="px-4 py-3 text-slate-700">{p.age} / {p.gender}</td>
                <td className="px-4 py-3 text-slate-700">{p.phone}</td>
                <td className="px-4 py-3 text-slate-700">{p.testCount}</td>
                <td className="px-4 py-3 text-slate-700">{p.lastTest ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
