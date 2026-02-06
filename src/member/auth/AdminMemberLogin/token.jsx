import React, { useContext, useState } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";

const MemberTokenVerification = () => {
  const location = useLocation();
  const department = location.state?.selectDepartment;
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const { updateMemberDetails } = useContext(AuthContext);

const handleVerify = async () => {
  if (token.length !== 6) {
    toast.error("Please enter a 6-digit token");
    return;
  }

  const memberId = sessionStorage.getItem("pendingMemberId");
  if (!memberId && !department) {
    toast.error("Session expired. Please login again.");
    navigate("/member/signin");
    return;
  }

  try {
    const res = await axiosInstance.post(
      "/api/member/verify-token",
      { token, memberId, department },
      { withCredentials: true }
    );

    const { memberData } = res.data; // ✅ This is the JWT token from backend

    // ✅ Store raw token
    sessionStorage.setItem("MemberAuthToken", memberData);
    sessionStorage.removeItem("pendingMemberId");

    // ✅ Decode & update context
    updateMemberDetails(memberData);

    toast.success("Token verified. Welcome!");
    navigate("/member/dashboard");
  } catch (err) {
    console.log(err);

    const status = err?.response?.status;
    if (status === 410) {
      toast.error("Token expired. Please login again.");
    } else if (status === 401) {
      toast.error("Invalid token. Please try again.");
    } else {
      toast.error("Something went wrong. Please try again later.");
    }
    sessionStorage.removeItem("pendingMemberId");
    navigate("/member/signin");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Enter Your 6-Digit Login Token
        </h2>
        <input
          type="text"
          maxLength={6}
          placeholder="******"
          className="border border-gray-300 rounded w-full px-4 py-3 text-center text-lg tracking-widest font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={token}
          onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))} // Only allow numbers
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded text-lg font-medium"
          onClick={handleVerify}
        >
          Verify Token
        </button>
      </div>
    </div>
  );
};

export default MemberTokenVerification;