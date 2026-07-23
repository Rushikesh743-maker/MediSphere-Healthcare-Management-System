import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/doctor/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const user = getCurrentUser();
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-600 text-white grid place-items-center text-2xl font-semibold">
            {user?.name?.[0] ?? "D"}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{user?.name ?? "Doctor"}</p>
            <p className="text-sm text-slate-500">General Physician &middot; MediSphere Clinic</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 text-sm">
          <Row label="User ID" value={user?.userId ?? "-"} />
          <Row label="Role" value="Doctor" />
          <Row label="Email" value="doctor@medisphere.local" />
          <Row label="Phone" value="+91 98000 12345" />
          <Row label="Specialization" value="General Medicine" />
          <Row label="Experience" value="8 years" />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-slate-900">{value}</p>
    </div>
  );
}