import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/useSession";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireRole?: "admin" | "user";
};

export function ProtectedRoute({ children, requireRole = "admin" }: ProtectedRouteProps) {
  const { isAuthenticated, role, loading } = useSession();
  const location = useLocation();

  // Debug: inspect guard state in the browser console
  console.log("ProtectedRoute", { isAuthenticated, role, loading, requireRole, pathname: location.pathname });

  if (loading) {
    // Optional: small loader to avoid blank screen during session resolve
    return <div className="p-4 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (requireRole && role !== requireRole) {
    // Optional: show feedback to help diagnose access issue
    return (
      <div className="p-4">
        <p className="text-sm">Access denied. Required role: {requireRole}. Current role: {String(role)}</p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return <>{children}</>;
}
