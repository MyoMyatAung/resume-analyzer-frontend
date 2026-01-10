import PublicHeader from "@/components/layout/PublicHeader";
import { VerifyEmail } from "@/pages/VerifyEmail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/verify-email/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    email: (search.email as string) || undefined,
  }),
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <VerifyEmail />
    </div>
  );
}
