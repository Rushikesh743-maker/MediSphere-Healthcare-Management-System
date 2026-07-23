import { createFileRoute } from "@tanstack/react-router";
import LabLayout from "@/components/lab/LabLayout";

export const Route = createFileRoute("/lab")({
  component: LabLayout,
});
