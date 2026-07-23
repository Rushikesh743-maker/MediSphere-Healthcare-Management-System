import { createFileRoute } from "@tanstack/react-router";
import DoctorLayout from "@/components/doctor/DoctorLayout";

export const Route = createFileRoute("/doctor")({
  component: DoctorLayout,
});