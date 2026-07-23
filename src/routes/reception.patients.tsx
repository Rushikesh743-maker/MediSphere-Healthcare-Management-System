import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Eye, Pencil, X } from "lucide-react";
import { receptionActions, useReceptionStore } from "@/lib/receptionStore";
import type { RegisteredPatient } from "@/lib/receptionMockData";

export const Route = createFileRoute("/reception/patients")({
  component: PatientDirectory,
});

function PatientDirectory() {
  const { patients } = useReceptionStore();
  const [query, setQuery] = useState("");
  const [bloodFilter, setBloodFilter] = useState("");
  const [view, setView] = useState<RegisteredPatient | null>(null);
  const [edit, setEdit] = useState<RegisteredPatient | null>(null);

  const filtered = useMemo(
    () =>
      patients.filter((p) => {
        const q = query.toLowerCase();
        const matchesQ = !q || p.name.toLowerCase().includes(q) || p.phone.includes(q) || p.id.toLowerCase().includes(q);
        const matchesB = !bloodFilter || p.bloodGroup === bloodFilter;
        return matchesQ && matchesB;
      }),
    [patients, query, bloodFilter],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-slate-900">Patient Directory</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Search name, phone, ID..."
            />
          </div>
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Blood Groups</option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Patient ID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">Blood Group</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-slate-700">{p.id}</td>
                <td className="px-4 py-3 text-slate-900">{p.name}</td>
                <td className="px-4 py-3 text-slate-700">{p.phone}</td>
                <td className="px-4 py-3 text-slate-700">{p.age}</td>
                <td className="px-4 py-3 text-slate-700">{p.bloodGroup}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setView(p)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="h-3 w-3" /> View
                    </button>
                    <button
                      onClick={() => setEdit(p)}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No patients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {view && (
        <Modal onClose={() => setView(null)} title="Patient Details">
          <dl className="space-y-2 text-sm">
            <Row label="Patient ID" value={view.id} />
            <Row label="Name" value={view.name} />
            <Row label="Age" value={String(view.age)} />
            <Row label="Gender" value={view.gender} />
            <Row label="Phone" value={view.phone} />
            <Row label="Email" value={view.email || "—"} />
            <Row label="Address" value={view.address || "—"} />
            <Row label="Blood Group" value={view.bloodGroup} />
            <Row label="Emergency Contact" value={view.emergencyContact} />
            <Row label="Registered On" value={view.registeredOn} />
          </dl>
        </Modal>
      )}

      {edit && (
        <EditModal patient={edit} onClose={() => setEdit(null)} onSave={(patch) => {
          receptionActions.updatePatient(edit.id, patch);
          setEdit(null);
        }} />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-900 text-right">{value}</dd>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 bg-black/40 grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EditModal({ patient, onClose, onSave }: { patient: RegisteredPatient; onClose: () => void; onSave: (p: Partial<RegisteredPatient>) => void }) {
  const [form, setForm] = useState(patient);
  const input = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500";
  return (
    <Modal title="Edit Patient" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-3">
        <div><label className="text-sm text-slate-700">Name</label><input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm text-slate-700">Age</label><input type="number" className={input} value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} /></div>
          <div><label className="text-sm text-slate-700">Blood Group</label><input className={input} value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} /></div>
        </div>
        <div><label className="text-sm text-slate-700">Phone</label><input className={input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><label className="text-sm text-slate-700">Email</label><input className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="text-sm text-slate-700">Address</label><textarea className={input} rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <div><label className="text-sm text-slate-700">Emergency Contact</label><input className={input} value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} /></div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm">Cancel</button>
          <button type="submit" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white">Save</button>
        </div>
      </form>
    </Modal>
  );
}