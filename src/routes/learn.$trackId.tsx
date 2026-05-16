import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/learn/$trackId")({
  component: () => <Outlet />,
});
