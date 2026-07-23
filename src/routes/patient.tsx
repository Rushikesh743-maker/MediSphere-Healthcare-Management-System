import { createFileRoute } from "@tanstack/react-router";
import PatientLayout from "@/components/patient/PatientLayout";

export const Route = createFileRoute("/patient")({
  component: PatientLayout,
});