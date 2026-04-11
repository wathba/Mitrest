import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }: any) {
  const { isAuthenticated } = useSelector((state: any) => state.account);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}