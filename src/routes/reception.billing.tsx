import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Printer, Plus, X, CheckCircle2 } from "lucide-react";
import { receptionActions, useReceptionStore } from "@/lib/receptionStore";
import type { Bill, PaymentStatus } from "@/lib/receptionMockData";

export const Route = createFileRoute("/reception/billing")({
  component: BillingPage,
});

const statusStyle: Record<PaymentStatus, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  "Partially Paid": "bg-blue-100 text-blue-700",
};

function BillingPage() {
  const { bills, patients } = useReceptionStore();
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<Bill | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const totals = {
    paid: bills.filter((b) => b.status === "Paid").reduce((s, b) => s + b.total, 0),
    pending: bills.filter((b) => b.status === "Pending").reduce((s, b) => s + b.total, 0),
    partial: bills.filter((b) => b.status === "Partially Paid").reduce((s, b) => s + b.total, 0),
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Billing</h1>
          <p className="text-sm text-slate-500">Generate invoices and track payments.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> New Invoice
        </button>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" /> {toast}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Paid" value={`₹ ${totals.paid.toLocaleString()}`} tone="text-green-600" />
        <StatCard label="Pending" value={`₹ ${totals.pending.toLocaleString()}`} tone="text-amber-600" />
        <StatCard label="Partially Paid" value={`₹ ${totals.partial.toLocaleString()}`} tone="text-blue-600" />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bills.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-slate-700">{b.id}</td>
                <td className="px-4 py-3 text-slate-900">{b.patientName}</td>
                <td className="px-4 py-3 text-slate-700">{b.date}</td>
                <td className="px-4 py-3 text-slate-900 font-medium">₹ {b.total.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[b.status]}`}>{b.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setPreview(b)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Printer className="h-3 w-3" /> Preview
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {creating && (
        <NewInvoiceModal
          patientNames={patients.map((p) => p.name)}
          onClose={() => setCreating(false)}
          onCreate={(payload) => {
            const bill = receptionActions.addBill(payload);
            setCreating(false);
            setToast(`Invoice ${bill.id} created.`);
            setTimeout(() => setToast(null), 2500);
          }}
        />
      )}

      {preview && <InvoicePreview bill={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-40 bg-black/40 grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function NewInvoiceModal({ patientNames, onClose, onCreate }: { patientNames: string[]; onClose: () => void; onCreate: (b: Omit<Bill, "id" | "date">) => void }) {
  const [patientName, setPatientName] = useState(patientNames[0] ?? "");
  const [consultation, setConsultation] = useState("500");
  const [labs, setLabs] = useState("0");
  const [other, setOther] = useState("0");
  const [status, setStatus] = useState<PaymentStatus>("Pending");

  const total = Number(consultation || 0) + Number(labs || 0) + Number(other || 0);
  const input = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500";

  return (
    <Modal title="New Invoice" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreate({
            patientName,
            status,
            total,
            items: [
              { label: "Consultation Fee", amount: Number(consultation) },
              ...(Number(labs) > 0 ? [{ label: "Laboratory Charges", amount: Number(labs) }] : []),
              ...(Number(other) > 0 ? [{ label: "Other Charges", amount: Number(other) }] : []),
            ],
          });
        }}
        className="space-y-3"
      >
        <div>
          <label className="text-sm text-slate-700">Patient</label>
          <select value={patientName} onChange={(e) => setPatientName(e.target.value)} className={input}>
            {patientNames.map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="text-sm text-slate-700">Consultation ₹</label><input type="number" min={0} value={consultation} onChange={(e) => setConsultation(e.target.value)} className={input} /></div>
          <div><label className="text-sm text-slate-700">Lab Charges ₹</label><input type="number" min={0} value={labs} onChange={(e) => setLabs(e.target.value)} className={input} /></div>
          <div><label className="text-sm text-slate-700">Other ₹</label><input type="number" min={0} value={other} onChange={(e) => setOther(e.target.value)} className={input} /></div>
        </div>
        <div>
          <label className="text-sm text-slate-700">Payment Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as PaymentStatus)} className={input}>
            <option>Paid</option>
            <option>Pending</option>
            <option>Partially Paid</option>
          </select>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <span className="text-sm text-slate-500">Total</span>
          <span className="text-lg font-semibold text-slate-900">₹ {total.toLocaleString()}</span>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm">Cancel</button>
          <button type="submit" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white">Create Invoice</button>
        </div>
      </form>
    </Modal>
  );
}

function InvoicePreview({ bill, onClose }: { bill: Bill; onClose: () => void }) {
  return (
    <Modal title={`Invoice ${bill.id}`} onClose={onClose}>
      <div className="border border-slate-200 rounded-md p-4 text-sm">
        <div className="flex justify-between border-b border-slate-200 pb-3 mb-3">
          <div>
            <div className="font-semibold text-blue-600">MediSphere Clinic</div>
            <div className="text-xs text-slate-500">MG Road, Pune</div>
          </div>
          <div className="text-right">
            <div className="text-slate-500 text-xs">Invoice</div>
            <div className="font-mono">{bill.id}</div>
            <div className="text-xs text-slate-500">{bill.date}</div>
          </div>
        </div>
        <div className="mb-3">
          <div className="text-slate-500 text-xs">Billed to</div>
          <div className="text-slate-900 font-medium">{bill.patientName}</div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-left border-b border-slate-200">
            <tr><th className="py-1 font-medium">Description</th><th className="py-1 font-medium text-right">Amount</th></tr>
          </thead>
          <tbody>
            {bill.items.map((it, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2 text-slate-700">{it.label}</td>
                <td className="py-2 text-slate-900 text-right">₹ {it.amount.toLocaleString()}</td>
              </tr>
            ))}
            <tr>
              <td className="py-2 font-semibold text-slate-900">Total</td>
              <td className="py-2 text-right font-semibold text-slate-900">₹ {bill.total.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-3 text-xs text-slate-500">Status: <span className="text-slate-900 font-medium">{bill.status}</span></div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button onClick={() => window.print()} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm">
          <Printer className="h-3 w-3" /> Print
        </button>
      </div>
    </Modal>
  );
}