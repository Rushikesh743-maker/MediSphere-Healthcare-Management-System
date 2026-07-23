import { createFileRoute } from "@tanstack/react-router";
import { Receipt, CheckCircle2, Clock } from "lucide-react";
import { invoices } from "@/lib/patientMockData";

export const Route = createFileRoute("/patient/billing")({
  component: BillingPage,
});

const statusStyle: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Overdue: "bg-red-100 text-red-700",
};

function BillingPage() {
  const total = invoices.reduce((s, i) => s + i.amount, 0);
  const paid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const pending = total - paid;
  const fmt = (n: number) => "₹ " + n.toLocaleString("en-IN");

  const stats = [
    { label: "Total Bills", value: fmt(total), icon: Receipt, color: "text-blue-600" },
    { label: "Paid Amount", value: fmt(paid), icon: CheckCircle2, color: "text-green-600" },
    { label: "Pending Amount", value: fmt(pending), icon: Clock, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Billing</h1>
        <p className="text-sm text-slate-500">Your invoices and payment history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">{s.label}</p>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice #</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{inv.id}</td>
                <td className="px-4 py-3 text-slate-700">{inv.date}</td>
                <td className="px-4 py-3 text-slate-900">{inv.description}</td>
                <td className="px-4 py-3 text-slate-900">{fmt(inv.amount)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[inv.status]}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50">
                      View
                    </button>
                    {inv.status !== "Paid" && (
                      <button className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">
                        Pay Now
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}