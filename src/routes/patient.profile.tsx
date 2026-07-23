import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { patientProfile } from "@/lib/patientMockData";

export const Route = createFileRoute("/patient/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [contact, setContact] = useState({
    phone: patientProfile.phone,
    email: patientProfile.email,
    address: patientProfile.address,
  });
  const [draft, setDraft] = useState(contact);

  const startEdit = () => {
    setDraft(contact);
    setEditing(true);
  };
  const save = () => {
    setContact(draft);
    setEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500">Manage your personal and contact information.</p>
        </div>
        {!editing ? (
          <button
            onClick={startEdit}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <X className="h-3 w-3" /> Cancel
            </button>
            <button
              onClick={save}
              className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              <Save className="h-3 w-3" /> Save
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-blue-600 text-white grid place-items-center text-lg font-semibold">
              {patientProfile.name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{patientProfile.name}</p>
              <p className="text-xs text-slate-500">
                {patientProfile.age} yrs · {patientProfile.gender}
              </p>
              <p className="text-xs text-slate-500">Patient ID: {patientProfile.id}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Date of Birth" value={patientProfile.dob} />
            <Row label="Blood Group" value={patientProfile.bloodGroup} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-800">Contact Information</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2 text-sm">
            <Field
              label="Phone"
              value={contact.phone}
              editing={editing}
              onChange={(v) => setDraft({ ...draft, phone: v })}
              draftValue={draft.phone}
            />
            <Field
              label="Email"
              value={contact.email}
              editing={editing}
              onChange={(v) => setDraft({ ...draft, email: v })}
              draftValue={draft.email}
            />
            <div className="md:col-span-2">
              <Field
                label="Address"
                value={contact.address}
                editing={editing}
                onChange={(v) => setDraft({ ...draft, address: v })}
                draftValue={draft.address}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Emergency Contact</h2>
          <div className="mt-3 space-y-2 text-sm">
            <Row label="Name" value={patientProfile.emergencyContact.name} />
            <Row label="Relation" value={patientProfile.emergencyContact.relation} />
            <Row label="Phone" value={patientProfile.emergencyContact.phone} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-800">Insurance Information</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2 text-sm">
            <Row label="Provider" value={patientProfile.insurance.provider} />
            <Row label="Policy Number" value={patientProfile.insurance.policyNumber} />
            <Row label="Valid Till" value={patientProfile.insurance.validTill} />
            <Row label="Sum Insured" value={patientProfile.insurance.sumInsured} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 font-medium">{value}</span>
    </div>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
  draftValue,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  draftValue: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      {editing ? (
        <input
          value={draftValue}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
        />
      ) : (
        <p className="text-slate-900 font-medium">{value}</p>
      )}
    </div>
  );
}