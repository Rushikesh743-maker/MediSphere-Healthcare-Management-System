import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { receptionProfile } from "@/lib/receptionMockData";

export const Route = createFileRoute("/reception/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [profile, setProfile] = useState(receptionProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const input = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500";

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-500">Manage your account information.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" /> Profile updated.
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="h-14 w-14 rounded-full bg-blue-600 text-white grid place-items-center text-lg font-semibold">
            {profile.name.split(" ")[0][0]}
          </div>
          <div>
            <div className="text-slate-900 font-semibold">{profile.name}</div>
            <div className="text-sm text-slate-500">{profile.role}</div>
            <div className="text-xs text-slate-400">Joined {profile.joinedOn}</div>
          </div>
        </div>

        {!editing ? (
          <div className="mt-4 space-y-2 text-sm">
            <Row label="User ID" value={profile.id} />
            <Row label="Phone" value={profile.phone} />
            <Row label="Email" value={profile.email} />
            <Row label="Address" value={profile.address} />
            <div className="pt-3">
              <button
                onClick={() => setEditing(true)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={save} className="mt-4 space-y-3">
            <div><label className="text-sm text-slate-700">Phone</label><input className={input} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
            <div><label className="text-sm text-slate-700">Email</label><input className={input} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
            <div><label className="text-sm text-slate-700">Address</label><textarea rows={2} className={input} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(false)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm">Cancel</button>
              <button type="submit" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white">Save</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-2 last:border-none">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-900 text-right">{value}</dd>
    </div>
  );
}