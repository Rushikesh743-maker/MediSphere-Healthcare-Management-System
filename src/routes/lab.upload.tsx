import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { useLabStore, labActions } from "@/lib/labStore";

export const Route = createFileRoute("/lab/upload")({
  component: UploadReport,
});

function UploadReport() {
  const { tests } = useLabStore();
  const navigate = useNavigate();
  const eligible = useMemo(() => tests.filter((t) => t.status === "In Progress"), [tests]);

  const [testId, setTestId] = useState("");
  const [result, setResult] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefill = params.get("testId");
    if (prefill && eligible.some((t) => t.id === prefill)) {
      setTestId(prefill);
    } else if (!testId && eligible[0]) {
      setTestId(eligible[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligible.length]);

  const selected = eligible.find((t) => t.id === testId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !result.trim()) return;
    labActions.completeTest(selected.id, {
      result: result.trim(),
      notes: notes.trim() || undefined,
      reportFileName: fileName || undefined,
    });
    setSaved(true);
    setTimeout(() => navigate({ to: "/lab/completed" }), 800);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Upload Report</h1>
        <p className="text-sm text-slate-500">Submit results for an in-progress test.</p>
      </div>

      {eligible.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          No tests are currently in progress. Start a test from the Pending list first.
        </div>
      ) : (
        <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Select Test</label>
            <select
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              {eligible.map((t) => (
                <option key={t.id} value={t.id}>{t.patientName} — {t.test}</option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Patient</p>
                <p className="text-slate-900 font-medium">{selected.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Test</p>
                <p className="text-slate-900 font-medium">{selected.test}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Doctor</p>
                <p className="text-slate-900 font-medium">{selected.doctor}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Test Result</label>
            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              required
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="e.g. HbA1c 6.4% — within target range."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Optional interpretation or follow-up advice."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Report File</label>
            <label className="flex items-center gap-2 border border-dashed border-slate-300 rounded-md px-3 py-4 text-sm text-slate-600 cursor-pointer hover:bg-slate-50">
              <Upload className="h-4 w-4 text-slate-500" />
              <span>{fileName || "Choose a file to attach (mock upload)"}</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3">
            {saved && <span className="text-xs text-green-600">Report submitted.</span>}
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
              Submit Report
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
