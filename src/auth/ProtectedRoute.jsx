// AuthRoutes.jsx
import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";
import LoadingAnimation from "../components/LoadingPage";

export const MemberRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth('member');

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingAnimation/></div>;
  }

  return isAuthenticated ? children : <Navigate to="/member/signin" replace />;
};
