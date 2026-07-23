import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save } from "lucide-react";
import { labStaffProfile } from "@/lib/labMockData";

export const Route = createFileRoute("/lab/profile")({
  component: LabProfile,
});

function LabProfile() {
  const [profile, setProfile] = useState(labStaffProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const field = (label: string, key: keyof typeof profile, editable = true) => (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      {editing && editable ? (
        <input
          value={profile[key] as string}
          onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      ) : (
        <p className="text-sm text-slate-900">{profile[key] as string}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500">Laboratory staff information.</p>
      </div>

      <form onSubmit={save} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="h-14 w-14 rounded-full bg-blue-600 text-white grid place-items-center text-lg font-semibold">
            {profile.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
          </div>
          <div>
            <p className="text-slate-900 font-semibold">{profile.name}</p>
            <p className="text-xs text-slate-500">{profile.designation} • {profile.department}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("Full Name", "name")}
          {field("Employee ID", "employeeId", false)}
          {field("Department", "department")}
          {field("Designation", "designation")}
          {field("Email", "email")}
          {field("Phone", "phone")}
          {field("Shift", "shift")}
          {field("Joined On", "joinedOn", false)}
        </div>

        <div className="flex items-center justify-end gap-3">
          {saved && <span className="text-xs text-green-600">Saved.</span>}
          {editing ? (
            <>
              <button type="button" onClick={() => { setProfile(labStaffProfile); setEditing(false); }} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"><Save className="h-3 w-3" /> Save</button>
            </>
          ) : (
            <button type="button" onClick={() => setEditing(true)} className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">Edit Profile</button>
          )}
        </div>
      </form>
    </div>
  );
}
