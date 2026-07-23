import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { receptionActions } from "@/lib/receptionStore";

export const Route = createFileRoute("/reception/register")({
  component: RegisterPatientPage,
});

const empty = {
  name: "",
  age: "",
  gender: "Male" as "Male" | "Female" | "Other",
  phone: "",
  email: "",
  address: "",
  bloodGroup: "",
  emergencyContact: "",
};

function RegisterPatientPage() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const set = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.age.trim() || Number(form.age) <= 0) e.age = "Invalid age";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.bloodGroup.trim()) e.bloodGroup = "Required";
    if (!form.emergencyContact.trim()) e.emergencyContact = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const p = receptionActions.registerPatient({
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      bloodGroup: form.bloodGroup.trim(),
      emergencyContact: form.emergencyContact.trim(),
    });
    setSuccess(`Patient ${p.name} registered with ID ${p.id}.`);
    setForm(empty);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Patient Registration</h1>
        <p className="text-sm text-slate-500">Register walk-in patients.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" /> {success}
        </div>
      )}

      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" required error={errors.name}>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={input} />
          </Field>
          <Field label="Age" required error={errors.age}>
            <input type="number" min={0} value={form.age} onChange={(e) => set("age", e.target.value)} className={input} />
          </Field>
          <Field label="Gender">
            <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className={input}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Phone Number" required error={errors.phone}>
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={input} />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={input} />
          </Field>
          <Field label="Blood Group" required error={errors.bloodGroup}>
            <select value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} className={input}>
              <option value="">Select</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Emergency Contact" required error={errors.emergencyContact}>
            <input value={form.emergencyContact} onChange={(e) => set("emergencyContact", e.target.value)} className={input} />
          </Field>
          <Field label="Address" full>
            <textarea rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} className={input} />
          </Field>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setForm(empty)} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Reset
          </button>
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Register Patient
          </button>
        </div>
      </form>
    </div>
  );
}

const input = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500";

function Field({ label, required, error, full, children }: { label: string; required?: boolean; error?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}