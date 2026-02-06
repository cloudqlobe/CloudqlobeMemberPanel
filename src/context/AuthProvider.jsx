import { useState } from "react";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";

const AuthProvider = ({ children }) => {
  const [memberDetails, setMemberDetails] = useState(() => {
    const savedToken = sessionStorage.getItem("MemberAuthToken");
    if (savedToken) {
      try {
        return jwtDecode(savedToken); // decode JWT on refresh
      } catch {
        return { role: "", name: "", email: "", id: "" };
      }
    }
    return { role: "", name: "", email: "", id: "" };
  });

  const updateMemberDetails = (token) => {
    try {
      const decoded = jwtDecode(token);
      setMemberDetails(decoded);
      sessionStorage.setItem("MemberAuthToken", token); // ✅ store raw token
    } catch {
      console.error("Invalid token");
    }
  };

  const clearMemberDetails = () => {
    setMemberDetails({ role: "", name: "", email: "", id: "" });
    sessionStorage.removeItem("MemberAuthToken");
  };

  return (
    <AuthContext.Provider value={{ memberDetails, updateMemberDetails, clearMemberDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
