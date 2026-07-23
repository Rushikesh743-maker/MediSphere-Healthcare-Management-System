import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Eye, CalendarPlus } from "lucide-react";
import { receptionActions, useReceptionStore } from "@/lib/receptionStore";
import type { AppointmentRequest } from "@/lib/receptionMockData";

export const Route = createFileRoute("/reception/requests")({
  component: RequestsPage,
});

const statusStyle: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};
const priorityStyle: Record<string, string> = {
  Normal: "bg-slate-100 text-slate-700",
  Urgent: "bg-red-100 text-red-700",
};

function RequestsPage() {
  const { requests } = useReceptionStore();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<AppointmentRequest | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Appointment Requests</h1>
        <p className="text-sm text-slate-500">Review, approve, or schedule patient requests.</p>
      </div>

      {toast && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {toast}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Preferred Doctor</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{r.patientName}</td>
                <td className="px-4 py-3 text-slate-700">{r.department}</td>
                <td className="px-4 py-3 text-slate-700">{r.preferredDoctor}</td>
                <td className="px-4 py-3 text-slate-700">{r.preferredDate}</td>
                <td className="px-4 py-3 text-slate-700">{r.reason}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyle[r.priority]}`}>
                    {r.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2 flex-wrap">
                    <button
                      onClick={() => setSelected(r)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="h-3 w-3" /> View
                    </button>
                    {r.status === "Pending" && (
                      <>
                        <button
                          onClick={() => {
                            receptionActions.updateRequestStatus(r.id, "Confirmed");
                            showToast(`Approved request for ${r.patientName}.`);
                          }}
                          className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                        >
                          <Check className="h-3 w-3" /> Approve
                        </button>
                        <button
                          onClick={() => {
                            receptionActions.updateRequestStatus(r.id, "Rejected");
                            showToast(`Rejected request for ${r.patientName}.`);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
                        >
                          <X className="h-3 w-3" /> Reject
                        </button>
                        <button
                          onClick={() => navigate({ to: "/reception/schedule", search: { requestId: r.id } as never })}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                        >
                          <CalendarPlus className="h-3 w-3" /> Schedule
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 bg-black/40 grid place-items-center p-4" onClick={() => setSelected(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Request Details</h2>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Patient" value={selected.patientName} />
              <Row label="Department" value={selected.department} />
              <Row label="Preferred Doctor" value={selected.preferredDoctor} />
              <Row label="Preferred Date" value={selected.preferredDate} />
              <Row label="Reason" value={selected.reason} />
              <Row label="Priority" value={selected.priority} />
              <Row label="Status" value={selected.status} />
              {selected.assignedDoctor && <Row label="Assigned Doctor" value={selected.assignedDoctor} />}
              {selected.scheduledDate && <Row label="Scheduled" value={`${selected.scheduledDate} ${selected.scheduledTime}`} />}
              {selected.tokenNumber != null && <Row label="Token" value={String(selected.tokenNumber)} />}
            </dl>
          </div>
        </div>
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