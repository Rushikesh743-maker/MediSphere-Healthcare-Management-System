import { useSyncExternalStore } from "react";
import { LabTest, initialLabTests } from "./labMockData";

interface State {
  tests: LabTest[];
}

let state: State = { tests: initialLabTests };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;

export function useLabStore(): State {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  emit();
}

const today = () => new Date().toISOString().slice(0, 10);

let seq = 100;
const nextId = () => `LT${String(++seq).padStart(3, "0")}`;

type CompletionListener = (t: LabTest) => void;
const completionListeners = new Set<CompletionListener>();
export function onLabTestCompleted(fn: CompletionListener) {
  completionListeners.add(fn);
  return () => completionListeners.delete(fn);
}

export const labActions = {
  addLabTest(payload: Omit<LabTest, "id" | "status" | "requestedOn"> & { requestedOn?: string }) {
    const test: LabTest = {
      id: nextId(),
      status: "Pending",
      requestedOn: payload.requestedOn ?? today(),
      ...payload,
    };
    setState({ tests: [test, ...state.tests] });
    return test;
  },
  startTest(id: string) {
    setState({
      tests: state.tests.map((t) =>
        t.id === id ? { ...t, status: "In Progress", startedOn: t.startedOn ?? today() } : t,
      ),
    });
  },
  completeTest(id: string, payload: { result: string; notes?: string; reportFileName?: string }) {
    let completed: LabTest | undefined;
    setState({
      tests: state.tests.map((t) => {
        if (t.id !== id) return t;
        completed = {
          ...t,
          status: "Completed",
          completedOn: today(),
          result: payload.result,
          notes: payload.notes,
          reportFileName: payload.reportFileName ?? `${t.id}_${t.test.replace(/\s+/g, "")}.pdf`,
        };
        return completed;
      }),
    });
    if (completed) completionListeners.forEach((fn) => fn(completed!));
  },
};
