import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bot, Save, Plus, Trash2, Sparkles } from "lucide-react";
import { getPatient } from "@/lib/mockData";
import { receptionActions } from "@/lib/receptionStore";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/doctor/consultation/$id")({
  component: ConsultationPage,
});

const aiActions = [
  "Summarize Patient History",
  "Suggest Conditions",
  "Recommend Lab Tests",
  "Drug Interaction Check",
  "Generate Consultation Notes",
  "Draft Prescription",
];

const mockAiResponses: Record<string, string> = {
  "Summarize Patient History":
    "Patient has a history of hypertension and Type 2 diabetes. Regular follow-ups; medications well tolerated. Last HbA1c pending.",
  "Suggest Conditions":
    "Based on symptoms and vitals, consider: 1) Uncontrolled hypertension, 2) Diabetic neuropathy, 3) Anxiety-related tachycardia.",
  "Recommend Lab Tests":
    "Suggested tests: HbA1c, Fasting Lipid Profile, Serum Creatinine, Urine Microalbumin.",
  "Drug Interaction Check":
    "No major interactions detected between current medications. Monitor potassium if adding ACE inhibitor.",
  "Generate Consultation Notes":
    "Chief complaint: routine review. Findings stable. Continue current regimen. Recheck labs in 3 months.",
  "Draft Prescription":
    "1) Amlodipine 5mg - once daily.\n2) Metformin 500mg - twice daily after meals.\n3) Multivitamin - once daily.",
};

const inputCls =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
const textareaCls = inputCls + " resize-y";

function ConsultationPage() {
  const { id } = Route.useParams();
  const patient = getPatient(id);

  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [plan, setPlan] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [medicines, setMedicines] = useState<{ name: string; dose: string; freq: string }[]>([
    { name: "", dose: "", freq: "" },
  ]);
  const [labs, setLabs] = useState<string[]>([]);
  const [labInput, setLabInput] = useState("");

  const [aiOpen, setAiOpen] = useState(true);
  const [aiOutput, setAiOutput] = useState<{ action: string; text: string } | null>(null);
  const [saved, setSaved] = useState(false);

  if (!patient) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
        Patient not found.{" "}
        <Link to="/doctor/appointments" className="text-blue-600 hover:underline">Back</Link>
      </div>
    );
  }

  const addMed = () => setMedicines((m) => [...m, { name: "", dose: "", freq: "" }]);
  const rmMed = (i: number) => setMedicines((m) => m.filter((_, idx) => idx !== i));
  const updateMed = (i: number, k: string, v: string) =>
    setMedicines((m) => m.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  const addLab = () => {
    if (labInput.trim()) {
      setLabs((l) => [...l, labInput.trim()]);
      setLabInput("");
    }
  };

  const save = () => {
    const user = getCurrentUser();
    receptionActions.completeConsultation({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      patientAge: patient.age,
      patientGender: patient.gender,
      doctor: user?.name ?? "Dr.Ruhikesh N",
      department: "General Medicine",
      symptoms,
      diagnosis,
      notes,
      plan,
      followUp,
      medicines: medicines
        .filter((m) => m.name.trim())
        .map((m) => ({
          name: m.name,
          dosage: m.dose,
          duration: "",
          instructions: m.freq,
        })),
      labTests: labs,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Link
            to="/doctor/appointments"
            className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <button
            onClick={() => setAiOpen((o) => !o)}
            className="lg:hidden inline-flex items-center gap-1 rounded-md border border-blue-600 px-3 py-1.5 text-xs text-blue-600"
          >
            <Bot className="h-4 w-4" /> {aiOpen ? "Hide" : "Show"} AI Assistant
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-blue-600 text-white grid place-items-center font-semibold">
            {patient.name[0]}
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900">{patient.name}</p>
            <p className="text-xs text-slate-500">
              {patient.id} &middot; {patient.age} yrs &middot; {patient.gender} &middot; Allergies:{" "}
              {patient.allergies.join(", ") || "None"}
            </p>
          </div>
          <Link
            to="/doctor/patients/$id"
            params={{ id: patient.id }}
            className="text-xs text-blue-600 hover:underline"
          >
            Full record
          </Link>
        </div>

        <Field label="Symptoms">
          <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3} className={textareaCls} />
        </Field>

        <Field label="Diagnosis">
          <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className={inputCls} />
        </Field>

        <Field label="Clinical Notes">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={textareaCls} />
        </Field>

        <Field label="Treatment Plan">
          <textarea value={plan} onChange={(e) => setPlan(e.target.value)} rows={2} className={textareaCls} />
        </Field>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Medicines</h3>
            <button
              onClick={addMed}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <Plus className="h-3 w-3" /> Add medicine
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {medicines.map((m, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input placeholder="Name" value={m.name} onChange={(e) => updateMed(i, "name", e.target.value)} className={`col-span-5 ${inputCls}`} />
                <input placeholder="Dose" value={m.dose} onChange={(e) => updateMed(i, "dose", e.target.value)} className={`col-span-3 ${inputCls}`} />
                <input placeholder="Frequency" value={m.freq} onChange={(e) => updateMed(i, "freq", e.target.value)} className={`col-span-3 ${inputCls}`} />
                <button onClick={() => rmMed(i)} className="col-span-1 text-slate-400 hover:text-red-600 justify-self-end" aria-label="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Request Laboratory Tests</h3>
          <div className="mt-3 flex gap-2">
            <input
              value={labInput}
              onChange={(e) => setLabInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLab(); } }}
              placeholder="e.g. Complete Blood Count"
              className={`flex-1 ${inputCls}`}
            />
            <button onClick={addLab} className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700">
              Add
            </button>
          </div>
          {labs.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {labs.map((l, i) => (
                <li key={i} className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs">
                  {l}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Field label="Schedule Follow-up">
          <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className={inputCls} />
        </Field>

        <div className="flex items-center gap-3">
          <button onClick={save} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Save className="h-4 w-4" /> Save Consultation
          </button>
          {saved && <span className="text-sm text-green-600">Saved (mock).</span>}
        </div>
      </div>

      {aiOpen && (
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-20 h-fit">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-800">AI Assistant</h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">Mock AI actions to help during consultation.</p>

          <div className="mt-3 space-y-2">
            {aiActions.map((a) => (
              <button
                key={a}
                onClick={() => setAiOutput({ action: a, text: mockAiResponses[a] })}
                className="w-full text-left inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:border-blue-200"
              >
                <Sparkles className="h-3 w-3 text-blue-600" />
                {a}
              </button>
            ))}
          </div>

          {aiOutput && (
            <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs font-semibold text-blue-800">{aiOutput.action}</p>
              <p className="mt-1 text-xs text-slate-700 whitespace-pre-line">{aiOutput.text}</p>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <label className="block text-sm font-semibold text-slate-800 mb-2">{label}</label>
      {children}
    </div>
  );
}