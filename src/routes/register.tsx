import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "patient",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "Full name is required (min 3 chars).";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!/^\+?\d[\d\s-]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSuccess(true);
    setTimeout(() => navigate({ to: "/login" }), 1200);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <header className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-semibold">
            <Activity className="h-6 w-6" />
            MediSphere
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-md px-6 py-12">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Create an account</h1>
          <p className="mt-1 text-sm text-slate-600">Register to use MediSphere.</p>

          {success ? (
            <div className="mt-6 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              Registration successful. Redirecting to login...
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              {[
                { k: "name", label: "Full Name", type: "text" },
                { k: "email", label: "Email", type: "email" },
                { k: "phone", label: "Phone", type: "text" },
              ].map(({ k, label, type }) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-slate-700">{label}</label>
                  <input
                    type={type}
                    value={(form as any)[k]}
                    onChange={(e) => update(k, e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-slate-700">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => update("role", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="reception">Receptionist</option>
                  <option value="lab">Laboratory</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => update("confirm", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Register
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}