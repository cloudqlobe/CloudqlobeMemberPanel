import { useEffect, useState, useCallback } from "react";
// import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosinstance";

const useAuth = (role = "user") => {
  const [authState, setAuthState] = useState({
    isAuthenticated: null,
    isLoading: true,
    userRole: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/auth/${role}/auth/check`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const { token, tokenName } = response.data;

        if (token && tokenName) {
          const existingToken = sessionStorage.getItem(tokenName);

          if (!existingToken) {
            sessionStorage.setItem(tokenName, token);
            window.location.reload(); // reload once
            return;
          }
        }

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userRole: role,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userRole: null,
        });
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userRole: null,
      });

      if (error.response?.status !== 401) {
        // toast.error(
        //   error.response?.data?.message || "Authentication error"
        // );
      }
    }
  }, [role]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return authState;
};

export default useAuth;
