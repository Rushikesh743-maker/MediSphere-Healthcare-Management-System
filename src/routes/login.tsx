import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Activity } from "lucide-react";
import { login, redirectPathFor, DEMO_CREDS } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(userId.trim(), password);
    if (!user) {
      setError("Invalid User ID or password.");
      return;
    }
    if (!remember) {
      // still stored in localStorage — clear on tab close
      sessionStorage.setItem("medisphere_session_only", "1");
    }
    navigate({ to: redirectPathFor(user.role) });
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
          <h1 className="text-xl font-semibold text-slate-900">Login</h1>
          <p className="mt-1 text-sm text-slate-600">Access your MediSphere account.</p>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="doctor_demo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-800">Demo Credentials</h2>
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-1">Role</th>
                <th className="pb-1">User ID</th>
                <th className="pb-1">Password</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {Object.entries(DEMO_CREDS).map(([id, { password, user }]) => (
                <tr key={id} className="border-t border-slate-200">
                  <td className="py-1 capitalize">{user.role}</td>
                  <td className="py-1 font-mono">{id}</td>
                  <td className="py-1 font-mono">{password}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-slate-500">
            Only the Doctor dashboard is implemented in Phase 1. Other roles will land on the home page.
          </p>
        </div>
      </div>
    </div>
  );
}