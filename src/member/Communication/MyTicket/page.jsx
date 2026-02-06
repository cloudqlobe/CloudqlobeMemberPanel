import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../layout/page";
import { AiOutlineFolderOpen, AiOutlineCheckCircle } from "react-icons/ai";
import { MdOutlineTaskAlt } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { PickupTable, RequestsTable, ViewPage } from "./table";
import AuthContext from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosinstance";

const CommunicationMyTicket = () => {
  const { memberDetails } = useContext(AuthContext);
  const [allRequests, setAllRequests] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ 
    category: "", 
    priority: "", 
    status: "" 
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!memberDetails?.id) return;
      setIsLoading(true);

      try {
        const role = memberDetails.role;
        const [memberDataResponse, response, didresponse] = await Promise.all([
          axiosInstance.get(`api/member/${role}/${memberDetails.id}`),
          axiosInstance.get('api/member/enquiry'),
          axiosInstance.get('api/member/didNumber')
        ]);

        const EnquiryData = response?.data.enquirys || [];
        const DIDData = didresponse?.data.didnumbers || [];

        const enquiryIds = JSON.parse(memberDataResponse.data.member.enquiry_ids || '[]');
        const didIds = JSON.parse(memberDataResponse.data.member.did_enquirie_ids || '[]');

        const filterEnquiry = enquiryIds.map((item) =>
          EnquiryData.find((enquiry) => enquiry.id === item.enquiryId)
        ).filter(Boolean);

        const filterDID = didIds.map((item) =>
          DIDData.find((enquiry) => enquiry.id === item.didId)
        ).filter(Boolean);

        setAllRequests([...filterEnquiry, ...filterDID]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [memberDetails?.id, memberDetails.role]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filterByCategory = (category) => {
    setActiveCategory(category);
  };

  const openModal = (id) => {
    const selectedItem = allRequests.find((item) => item.id === id);
    setSelectedView(selectedItem);
    if (selectedItem) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedView(null);
  };

  const handlePickupClick = (data) => {
    setNewStatus(data.status);
    setSelectedTest(data);
    setShowPickupModal(true);
  };

  const handleCancel = () => {
    setShowPickupModal(false);
  };

  const handleUpdateStatus = async () => {
    try {
      setIsLoading(true);
      if (selectedTest.category === 'Enquiry') {
        await axiosInstance.put(`api/member/updateEnquiryStatus/${selectedTest?.id}`, { newStatus });
      } else if (selectedTest.category === 'DID Numbers') {
        await axiosInstance.put(`api/member/updateDidStatus/${selectedTest?.id}`, { newStatus });
      }
      
      // Update the local state
      setAllRequests(prevRequests =>
        prevRequests.map(item =>
          item.id === selectedTest.id ? { ...item, status: newStatus } : item
        )
      );
      
      setShowPickupModal(false);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = allRequests.filter((request) => {
    // Category filter
    const matchesCategory = activeCategory === "All" || 
      (activeCategory === "Enquiry" && request.category === "Enquiry") ||
      (activeCategory === "DID Numbers" && request.category === "DID Numbers");
    
    // Additional filters
    const matchesFilters = 
      (!filters.category || request.category === filters.category) &&
      (!filters.status || request.status === filters.status) &&
      (!filters.priority || request.priority === filters.priority);
    
    // Search term
    const matchesSearch = !searchTerm || 
      (request.companyName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesFilters && matchesSearch;
  });

  const categoryCounts = {
    "All": allRequests.length,
    "Enquiry": allRequests.filter(r => r.category === "Enquiry").length,
    "DID Numbers": allRequests.filter(r => r.category === "DID Numbers").length,
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gradient-to-br from-gray-100 via-blue-50 to-blue-100 text-gray-800">
        <h2 className="text-3xl text-gray-700 font-bold mb-6 flex items-center">
          <AiOutlineFolderOpen className="mr-3 text-4xl" /> Ticket Management
        </h2>

        {/* Search Area with Filters */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Search and Filter Requests</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Company Name"
              className="p-3 border rounded-lg w-1/4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="p-3 border rounded shadow-lg w-1/4"
            >
              <option value="">All Categories</option>
              <option value="Enquiry">Enquiry</option>
              <option value="DID Numbers">DID Numbers</option>
            </select>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="p-3 border rounded shadow-lg w-1/4"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { category: "All", icon: <BsGraphUp className="text-blue-600" />, count: categoryCounts["All"] },
            { category: "Enquiry", icon: <MdOutlineTaskAlt className="text-green-500" />, count: categoryCounts["Enquiry"] },
            { category: "DID Numbers", icon: <AiOutlineCheckCircle className="text-yellow-500" />, count: categoryCounts["DID Numbers"] },
          ].map(({ category, icon, count }) => (
            <button
              key={category}
              onClick={() => filterByCategory(category)}
              className={`flex-1 bg-white text-gray-800 py-12 px-4 rounded-lg shadow-md transform transition-transform hover:bg-gray-200 hover:scale-105 ${
                activeCategory === category ? "bg-gray-300" : ""
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-5xl">{icon}</span>
                <span className="text-lg">{category} ({count})</span>
              </div>
            </button>
          ))}
        </div>

        {/* Requests Table */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading requests...</p>
          </div>
        ) : (
          <RequestsTable
            activeCategory={activeCategory}
            filteredRequests={filteredRequests}
            openModal={openModal}
            handlePickupClick={handlePickupClick}
          />
        )}
      </div>

      <ViewPage
        isModalOpen={isModalOpen}
        selectedEnquiry={selectedView}
        activeCategory={activeCategory}
        closeModal={closeModal}
      />

      <PickupTable
        handleCancel={handleCancel}
        handleUpdateStatus={handleUpdateStatus}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        showPickupModal={showPickupModal}
      />
    </DashboardLayout>
  );
};

export default CommunicationMyTicket;