import { createFileRoute } from "@tanstack/react-router";
import ReceptionLayout from "@/components/reception/ReceptionLayout";

export const Route = createFileRoute("/reception")({
  component: ReceptionLayout,
});