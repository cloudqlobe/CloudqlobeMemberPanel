import { useContext, useState } from "react";
import Layout from "../../../layout/page";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../../context/AuthContext";
import axiosInstance from "../../../../utils/axiosinstance";

const AddCustomerPage = () => {
  const navigate = useNavigate();
  const { memberDetails } = useContext(AuthContext);
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    companyEmail: "",
    contactPerson: "",
    country: "",
    companyPhone: "",
    address: "",
    companyWebsite: "",
  });

  const [userDetails, setUserDetails] = useState({
    userFirstname: "",
    userLastname: "",
    username: "",
    userEmail: "",
    userMobile: "",
    password: "",
  });

  const [technicalDetails, setTechnicalDetails] = useState({
    accountManager: memberDetails.name,
    supportEmail: "",
    sipPort: "",
    memberId: memberDetails.id,
    switchIps: [{ ip: "", status: "active" }],
  });

  const [leads, setLeads] = useState({
    leadType: "Customer",
    customerType: "Customer",
  })

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // New state for field errors

  const handleChange = (event, category) => {
    const { name, value } = event.target;

    // Clear error when user types in a field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (category === "company") {
      setCompanyDetails({ ...companyDetails, [name]: value });
    } else if (category === "user") {
      setUserDetails({ ...userDetails, [name]: value });
    } else if (category === "technical") {
      setTechnicalDetails({ ...technicalDetails, [name]: value });
    }
  };

  const handleAddIPAddress = () => {
    setTechnicalDetails({
      ...technicalDetails,
      switchIps: [...technicalDetails.switchIps, { ip: "", status: "active" }],
    });
  };

  const handleIPAddressChange = (index, field, value) => {
    const newIPs = [...technicalDetails.switchIps];
    newIPs[index][field] = value;
    setTechnicalDetails({ ...technicalDetails, switchIps: newIPs });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const mergedData = {
        ...companyDetails,
        ...userDetails,
        ...technicalDetails,
        ...leads,
      };

      await axiosInstance.post("api/member/leadMember/NewLead", mergedData);
      navigate("/member/sale/customer");
    } catch (error) {
      console.error("Error adding customer:", error);

      if (error.response) {
        const { data } = error.response;

        // Handle duplicate errors
        if (data?.error === "Duplicate data found" && data?.duplicateFields) {
          const newErrors = {};
          data.duplicateFields.forEach(field => {
            newErrors[field] = `This ${field} already exists`;
          });
          setErrors(newErrors);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render input with error message
  const renderInput = (category, name, placeholder, type = "text", required = true) => {
    const value = category === "company" ? companyDetails[name] :
      category === "user" ? userDetails[name] :
        technicalDetails[name];

    return (
      <div className="mb-4">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e, category)}
          className={`w-full border ${errors[name] ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:ring focus:ring-indigo-200`}
          required={required}
        />
        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-8 text-black text-start">
          Add New Customer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
          {/* Company Details */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-regular text-gray-700 mb-4">
              Company Details
            </h2>
            {renderInput("company", "companyName", "Company Name")}
            {renderInput("company", "companyEmail", "Company Email", "email")}
            {renderInput("company", "contactPerson", "Contact Person")}
            {renderInput("company", "country", "Country")}
            {renderInput("company", "companyPhone", "Company Phone")}
            {renderInput("company", "address", "Address")}
            {renderInput("company", "companyWebsite", "Company Website", "text", false)}
          </div>

          {/* Bottom Section: Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Technical Information */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-regular text-gray-700 mb-4">
                Technical Information
              </h2>
              <div className="mb-4">
                <input
                  disabled
                  type="text"
                  name="accountManager"
                  placeholder="Account Manager"
                  value={technicalDetails.accountManager}
                  onChange={(e) => handleChange(e, "technical")}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-indigo-200"
                />
              </div>
              {renderInput("technical", "supportEmail", "Support Email", "email")}
              {renderInput("technical", "sipPort", "SIP Port", "text", false)}

              <div className="space-y-2">
                {technicalDetails.switchIps.map((ipObj, index) => (
                  <input
                    key={index}
                    type="text"
                    value={ipObj.ip}
                    placeholder="Switch IP"
                    onChange={(e) => handleIPAddressChange(index, "ip", e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-indigo-200"
                  />
                ))}
                <button
                  type="button"
                  onClick={handleAddIPAddress}
                  className="w-full flex items-center justify-center p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mt-2"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add IP Address
                </button>
              </div>
            </div>

            {/* User Information */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-regular text-gray-700 mb-4">
                User Details
              </h2>
              {renderInput("user", "userFirstname", "First Name")}
              {renderInput("user", "userLastname", "Last Name")}
              {renderInput("user", "username", "Username")}
              {renderInput("user", "userEmail", "Email", "email")}
              {renderInput("user", "userMobile", "Mobile Number")}
              {renderInput("user", "password", "Password", "password")}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default AddCustomerPage;