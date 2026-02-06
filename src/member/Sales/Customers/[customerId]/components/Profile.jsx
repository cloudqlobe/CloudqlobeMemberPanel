import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FaUsersGear } from "react-icons/fa6";
import { MdLeaderboard } from "react-icons/md";
import Layout from '../../../../layout/page';
import { BsGraphUpArrow } from "react-icons/bs";
import { User, Mail, Phone, Globe, MapPin, Calendar, Flag, RefreshCw, Briefcase, Users, Link, FileText, ActivityIcon, UploadCloud } from 'lucide-react';
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../../../../utils/axiosinstance";

const ProfileTab = ({ customerId }) => {
  const [leadData, setLeadData] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updatedLeadInfo, setUpdatedLeadInfo] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const response = await axiosInstance.get(`api/customer/${customerId}`);
        const ips = JSON.parse(response.data.customer.switchIps)

        const data = {
          ...response.data.customer,
          switchIps: ips
        }
        setLeadData(data);
      } catch (error) {
        console.error("Error fetching lead details:", error);
        setError("Failed to fetch lead details.");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) fetchLeadData();

    return () => {
      setLeadData(null);
      setError(null);
      setSuccessMessage("");
    };
  }, [customerId]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedLeadInfo({ ...updatedLeadInfo, [name]: value });
    setLeadData({ ...leadData, [name]: value });
  };

  const handleIpChange = (index, newIp) => {
    setLeadData((prev) => ({
      ...prev,
      switchIps: Array.isArray(prev.switchIps)
        ? prev.switchIps.map((ipObj, i) => (i === index ? { ...ipObj, ip: newIp } : ipObj))
        : [],
    }));
  };

  const handleIpStatusChange = (index, newStatus) => {
    setLeadData((prev) => ({
      ...prev,
      switchIps: Array.isArray(prev.switchIps)
        ? prev.switchIps.map((ipObj, i) => (i === index ? { ...ipObj, status: newStatus } : ipObj))
        : [],
    }));
  };

  const handleAddIp = () => {
    const newIp = { ip: "", status: "active" };
    setLeadData((prev) => ({
      ...prev,
      switchIps: [...(prev.switchIps || []), newIp],
    }));
  };

  const handleRemoveIp = (index) => {
    setLeadData((prev) => ({
      ...prev,
      switchIps: prev.switchIps.filter((_, i) => i !== index),
    }));
  };


  // Handle lead update
  const handleUpdateLead = async () => {
    try {
      await axiosInstance.put(`api/member/updateLead/${customerId}`, leadData);
      setSuccessMessage("Lead updated successfully");
      toast.success("Lead updated successfully")
      setUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating lead:', error);

      if (error.response && error.response.status === 400 && error.response.data.duplicateFields) {
        const fields = error.response.data.duplicateFields.join(', ');

        toast.error(`Duplicate values found for: ${fields}`);
      } else {
        toast.error("An unexpected error occurred while updating the lead.");
      }
    }
  };

  const handleStatusChange = async () => {
    try {
      await axiosInstance.put(`api/member/leadStatus/${customerId}`, { leadStatus: newStatus });
      setSuccessMessage("Lead status updated");
      setNewStatus("");
      setLeadData(prev => ({ ...prev, leadStatus: newStatus }));
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update lead status.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <Layout>
      <div className="py-1" >
        <div className=" mx-auto space-y-10" style={{width:"96vw"}}>
          {/* Main Header Container with Grey Background */}
          <div className="bg-white text-gray-500 px-6 py-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              {/* Company Name Section (Left Side) */}
              <div className="flex flex-col items-center space-y-4 w-1/2">
                {/* Icon Container */}
                <div className="bg-indigo-600 text-white square-full p-6 flex items-center justify-center mb-4">
                  <BsGraphUpArrow className="text-5xl" />
                </div>  
                <h1 className="text-4xl text-gray-500 font-default text-center">
                  {leadData?.companyName || "Company Name Not Available"}
                </h1>
              </div>

              {/* Tabs Section (Right Side) */}
              <div className="ml-8 w-3/4 grid grid-cols-2 gap-8">
                {/* Customer ID Tab */}
                <div className="p-6 bg-white rounded-lg shadow-md flex items-center w-full">
                  <FaUsersGear className="text-yellow-500 text-6xl mr-6" />
                  <div className="flex flex-col items-start w-full">
                    <span className="text-sm text-gray-500">Customer ID</span>
                    <p className="text-lg font-default text-black">{leadData?.customerId || "Dummy123"}</p>
                  </div>
                </div>

                {/* Location Tab */}
                <div className="p-6 bg-white rounded-lg shadow-md flex items-center w-full">
                  <FaMapMarkerAlt className="text-blue-500 text-5xl mr-6" />
                  <div className="flex flex-col items-start w-full">
                    <span className="text-sm text-gray-500">Location</span>
                    <p className="text-lg font-default text-black">{leadData?.location || "India"}</p>
                  </div>
                </div>

                {/* Lead Type Tab */}
                <div className="p-6 bg-white rounded-lg shadow-md flex items-center w-full">
                  <MdLeaderboard className="text-orange-500 text-7xl mr-6" />
                  <div className="flex flex-col items-start w-full">
                    <span className="text-sm text-gray-500">Lead Type</span>
                    <p className="text-lg font-default text-black">{leadData?.leadType || "Sales"}</p>
                  </div>
                </div>

                {/* Status Tab */}

                <div className="p-6 bg-white rounded-lg shadow-md flex items-center w-full">
                  {["active", "new"].includes(leadData?.leadStatus) ? (
                    <FaCheckCircle className="text-green-500 text-5xl mr-6" />
                  ) : (
                    <FaTimesCircle className="text-red-500 text-5xl mr-6" />
                  )}
                  <div className="flex flex-col items-start w-full">
                    <span className="text-sm text-gray-500">Lead Status</span>
                    <p className="text-lg font-default text-black">
                      {leadData?.leadStatus || "Active"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
              <p className="font-bold">Success</p>
              <p>{successMessage}</p>
            </div>
          )}


          <div className="bg-white shadow-md rounded-lg p-4 mt-5">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <ActivityIcon className="mr-2 text-blue-600" /> {/* Icon before the title */}
              Lead Actions
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-end mt-6">

                  {/* Update Lead Modal */}
                  {updateModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full h-4/5 overflow-hidden">
                        <h2 className="text-lg font-bold mb-4">Update Lead</h2>
                        <div className="flex h-full">
                          {/* Left Column */}
                          <div className="w-1/2 p-2 overflow-y-auto">
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateLead(); }}>
                              {/* Company Name */}
                              <div className="mb-4">
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input
                                  type="text"
                                  name="companyName"
                                  value={updatedLeadInfo.companyName || leadData?.companyName || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>

                              {/* Contact Person */}
                              <div className="mb-4">
                                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contact Person</label>
                                <input
                                  type="text"
                                  name="contactPerson"
                                  value={updatedLeadInfo.contactPerson || leadData?.contactPerson || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>

                              {/* Company Email */}
                              <div className="mb-4">
                                <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700">Company Email</label>
                                <input
                                  type="email"
                                  name="companyEmail"
                                  value={updatedLeadInfo.companyEmail || leadData?.companyEmail || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>

                              {/* Company Phone */}
                              <div className="mb-4">
                                <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700">Company Phone</label>
                                <input
                                  type="text"
                                  name="companyPhone"
                                  value={updatedLeadInfo.companyPhone || leadData?.companyPhone || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>

                              {/* Address */}
                              <div className="mb-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                  type="text"
                                  name="address"
                                  value={updatedLeadInfo.address || leadData?.address || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>

                              {/* Country */}
                              <div className="mb-4">
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                <input
                                  type="text"
                                  name="country"
                                  value={updatedLeadInfo.country || leadData?.country || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              {/* User First Name */}
                              <div className="mb-4">
                                <label htmlFor="userFirstname" className="block text-sm font-medium text-gray-700">User First Name</label>
                                <input
                                  type="text"
                                  name="userFirstname"
                                  value={updatedLeadInfo.userFirstname || leadData?.userFirstname || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                            </form>
                          </div>

                          {/* Right Column */}
                          <div className="w-1/2 p-2 overflow-y-auto">
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateLead(); }}>

                              {/* User Last Name */}
                              <div className="mb-4">
                                <label htmlFor="userLastname" className="block text-sm font-medium text-gray-700">User Last Name</label>
                                <input
                                  type="text"
                                  name="userLastname"
                                  value={updatedLeadInfo.userLastname || leadData?.userLastname || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>

                              {/* User Email */}
                              <div className="mb-4">
                                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">User Email</label>
                                <input
                                  type="email"
                                  name="userEmail"
                                  value={updatedLeadInfo.userEmail || leadData?.userEmail || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>

                              {/* User Mobile */}
                              <div className="mb-4">
                                <label htmlFor="userMobile" className="block text-sm font-medium text-gray-700">User Mobile</label>
                                <input
                                  type="text"
                                  name="userMobile"
                                  value={updatedLeadInfo.userMobile || leadData?.userMobile || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>

                              {/* Support Email */}
                              <div className="mb-4">
                                <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700">Support Email</label>
                                <input
                                  type="email"
                                  name="supportEmail"
                                  value={updatedLeadInfo.supportEmail || leadData?.supportEmail || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>

                              {/* SIP Port */}
                              <div className="mb-4">
                                <label htmlFor="sipPort" className="block text-sm font-medium text-gray-700">SIP Port</label>
                                <input
                                  type="text"
                                  name="sipPort"
                                  value={updatedLeadInfo.sipPort || leadData?.sipPort || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>

                              {/* Switch IPs */}
                              <div className="mb-4">
                                <label htmlFor="switchIps" className="block text-sm font-medium text-gray-700">Switch IPs</label>
                                {leadData?.switchIps?.map((ipObj, index) => (
                                  <div key={index} className="flex items-center space-x-2 mt-2">
                                    <input
                                      type="text"
                                      value={ipObj?.ip}
                                      name="ip"
                                      onChange={(e) => handleIpChange(index, e.target.value)}
                                      className="w-1/2 border border-gray-300 rounded-md shadow-sm px-2 py-1 bg-gray-100"
                                    />
                                    <select
                                      name={`switchIps[${index}].status`}
                                      value={updatedLeadInfo?.switchIps?.[index]?.status || ipObj?.status}
                                      onChange={(e) => handleIpStatusChange(index, e.target.value)}
                                      className="w-1/2 border border-gray-300 rounded-md shadow-sm px-2 py-1"
                                    >
                                      <option value="active">Active</option>
                                      <option value="inactive">Inactive</option>
                                    </select>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveIp(index)}
                                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={handleAddIp}
                                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                  Add IP
                                </button>
                              </div>


                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setUpdateModalOpen(false)}
                                  className="mr-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                </div>
                <div className="flex justify-between items-center space-x-4 mt-6">
                  {/* Change Status Button on the Left */}
                  <div className="flex items-center space-x-4">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="spem">Spem</option>
                      <option value="inactive">InActive </option>
                      <option value="active">Active </option>
                      <option value="dead">Dead </option>
                      <option value="junk">Junk </option>
                    </select>
                    <button onClick={handleStatusChange} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Change Status
                    </button>
                  </div>

                  {/* Update Details Button on the Right */}
                  <button
                    onClick={() => setUpdateModalOpen(true)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                    <UploadCloud className="mr-2 h-4 w-4" /> {/* Icon inside the button */}
                    Update Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoSection title="Company Information" icon={<Briefcase className="text-orange-500" />}>
              <InfoItem icon={<Globe className="text-blue-500" />} label="Company Name" value={leadData?.companyName || "Not Provided"} />
              <InfoItem icon={<Mail className="text-blue-500" />} label="Company Email" value={leadData?.companyEmail || "Not Provided"} />
              <InfoItem icon={<Phone className="text-blue-500" />} label="Company Phone" value={leadData?.companyPhone || "Not Provided"} />
              <InfoItem icon={<MapPin className="text-blue-500" />} label="Address" value={leadData?.address || "Not Provided"} />
              <InfoItem icon={<Globe className="text-blue-500" />} label="Country" value={leadData?.country || "Not Provided"} />
              <InfoItem
                icon={<Link className="text-blue-500" />}
                label="Website"
                value={
                  leadData?.companyWebsite ? (
                    <a href={`https://${leadData.companyWebsite}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {leadData.companyWebsite}
                    </a>
                  ) : "Not Provided"
                }
              />
            </InfoSection>

            <InfoSection title="Contact Information" icon={<Users className="text-orange-500" />}>
              <InfoItem icon={<User className="text-blue-500" />} label="Contact Person" value={leadData?.contactPerson || "Not Provided"} />
              <InfoItem icon={<User className="text-blue-500" />} label="User First Name" value={leadData?.userFirstname || "Not Provided"} />
              <InfoItem icon={<User className="text-blue-500" />} label="User Last Name" value={leadData?.userLastname || "Not Provided"} />
              <InfoItem icon={<Mail className="text-blue-500" />} label="User Email" value={leadData?.userEmail || "Not Provided"} />
              <InfoItem icon={<Phone className="text-blue-500" />} label="User Mobile" value={leadData?.userMobile || "Not Provided"} />
            </InfoSection>

            <InfoSection title="Lead Details" icon={<Flag className="text-orange-500" />}>
              <InfoItem icon={<Flag className="text-blue-500" />} label="Lead Type" value={leadData?.leadType || "Not Provided"} />
              <InfoItem icon={<Flag className="text-blue-500" />} label="Lead Status" value={leadData?.leadStatus || "Not Provided"} />
              <InfoItem icon={<Flag className="text-blue-500" />} label="Customer Type" value={leadData?.customerType || "Not Provided"} />
              <InfoItem icon={<Flag className="text-blue-500" />} label="Follow Up Status" value={"Not Provided"} />
              <InfoItem icon={<Calendar className="text-blue-500" />} label="Created At" value={leadData?.createdAt ? new Date(leadData.createdAt).toLocaleString() : "Not Provided"} />
            </InfoSection>

            <InfoSection title="Technical Details" icon={<FileText className="text-orange-500" />}>
              <InfoItem icon={<Globe className="text-blue-500" />} label="SIP Port" value={leadData?.sipPort || "Not Provided"} />
              <InfoItem icon={<Mail className="text-blue-500" />} label="Support Email" value={leadData?.supportEmail || "Not Provided"} />
              <InfoItem
                icon={<Globe className="text-blue-500" />}
                label="Switch IPs"
                value={
                  leadData?.switchIps?.length > 0 ? (
                    <div>
                      {leadData.switchIps[0].ip} {/* Show the first IP */}
                      <span
                        className="text-blue-500 cursor-pointer underline pl-4"
                        onClick={() => setShowPopup(true)}
                      >
                        view
                      </span>
                    </div>
                  ) : (
                    "No IPs Available"
                  )
                }
              />
              <InfoItem icon={<FileText className="text-blue-500" />} label="My Rates IDs" value={"No Rates Available"} />
              <InfoItem icon={<FileText className="text-blue-500" />} label="Tickets IDs" value={"No Tickets Available"} />
            </InfoSection>

            {showPopup && (
              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <p className="text-black font-bold mb-2">Switch IPs: </p>
                  <ul className="text-black">
                    {leadData?.switchIps?.map((ip, index) => (
                      <div style={{ display: "flex" }}>
                        <li key={index} className="mb-1">{ip.ip}:</li>
                        <li key={index} className="mb-1">{ip.status}</li>
                      </div>
                    ))}
                  </ul>
                  <button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowPopup(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
};

const InfoSection = ({ title, icon, children }) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h2>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-sm text-gray-900">{value}</div>
    </div>
  </div>
);

export default ProfileTab;