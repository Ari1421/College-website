import { useSession } from "@/hooks/useSession";

export function RoleGate({ allow, children }: { allow: "admin" | "user"; children: React.ReactNode }) {
  const { role, loading } = useSession();
  if (loading) return null;
  if (role !== allow) return null;
  return <>{children}</>;
}
