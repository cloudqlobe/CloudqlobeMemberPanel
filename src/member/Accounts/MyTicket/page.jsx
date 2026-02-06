import React, { useContext, useEffect, useState } from "react";
import { FaMoneyCheckAlt, FaTasks, FaCogs } from "react-icons/fa";
import DashboardLayout from "../../layout/page";
import { FcElectroDevices } from "react-icons/fc";
import { SiTask } from "react-icons/si";
import { HiChartSquareBar } from "react-icons/hi";
import { ImBooks } from "react-icons/im";
import { PickupTable, RequestsTable, ViewTable } from "./table";
import axiosInstance from "../../../utils/axiosinstance";
import AuthContext from "../../../context/AuthContext";

const AccountsMyTicket = () => {
  const { memberDetails } = useContext(AuthContext);
  // const [requests, setRequests] = useState([]);
  const [recharge, setRecharge] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [overdraft, setOverdraft] = useState([]);
  const [privateRate, setPrivateRate] = useState([]);
  const [ratesData, setRatesData] = useState([]);
  const [cliRatesData, setCliRatesData] = useState([]);

  const [activeCategory, setActiveCategory] = useState("All");
  // const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    priority: "",
    status: "",
    companyName: ""
  });
  
  const [newStatus, setNewStatus] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!memberDetails?.id) return;

      try {
        const memberDataResponse = await axiosInstance.get(`api/member/account/${memberDetails.id}`);
        const vendorDataResponse = await axiosInstance.get(`api/member/getAllVendor`);
        const rechargeRequestResponse = await axiosInstance.get(`api/member/getAllTransactions`);
        const privateRateResponse = await axiosInstance.get(`api/member/test_privateRate`);
        const ratesResponse = await axiosInstance.get("api/member/private_ccrates");
        const cliRatesResponse = await axiosInstance.get(`api/member/private_clirates`);
        const overdraftDataResponse = await axiosInstance.get(`api/member/getAllOverdraft`);

        const recharge_ids = JSON.parse(memberDataResponse.data.member.recharge_ids || '[]');
        const vendor_ids = JSON.parse(memberDataResponse.data.member.vendor_ids || '[]');
        const privateRate_ids = JSON.parse(memberDataResponse.data.member.privateRateId || '[]');
        const overdraftId = JSON.parse(memberDataResponse.data.member.overdraftId || '[]');

        const member = {
          ...memberDataResponse.data.member,
          recharge_ids: recharge_ids,
          vendor_ids: vendor_ids,
          privateRateId: privateRate_ids,
          overdraftId: overdraftId
        };

        const rechargeRequestData = rechargeRequestResponse.data.transaction || [];
        const vendorData = vendorDataResponse.data.vendor || [];
        const privateRateData = privateRateResponse.data.rate || [];
        const overdraftData = overdraftDataResponse.data.overdraft || [];
        
        const filterRechargeRequest = member?.recharge_ids
          .map((id) => rechargeRequestData.find(ticket => ticket._id === id.rechargeId))
          .filter(item => item !== undefined);
      
        const filter = member?.vendor_ids
          .map((id) => vendorData.find(data => data.id === id.vendorId))
          .filter(item => item !== undefined);
      
        const filterPrivateRate = member?.privateRateId
          .map((id) => privateRateData.find(data => data._id === id.privateRateId))
          .filter(item => item !== undefined);
      
        const filterOverdraft = member?.overdraftId
          .map((id) => overdraftData.find(data => data._id === id.overdraftId))
          .filter(item => item !== undefined);

        setOverdraft(filterOverdraft)
        setRecharge(filterRechargeRequest)
        setVendor(filter)
        setPrivateRate(filterPrivateRate)
        setCliRatesData(cliRatesResponse.data.clirate)
        setRatesData(ratesResponse.data.ccrate);
        
        // Set initial requests to all
        // setRequests([
        //   ...(filterRechargeRequest || []).filter(item => item !== undefined),
        //   ...(filter || []).filter(item => item !== undefined),
        //   ...(filterPrivateRate || []).filter(item => item !== undefined),
        //   ...(filterOverdraft || []).filter(item => item !== undefined)
        // ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [memberDetails?.id]);

  const handlePickupClick = (test) => {
    if (test.category === "Recharge Request") {
      setNewStatus(test.transactionStatus);
      setSelectedTest(test)
    } else if (test.category === "Vendor Payment") {
      setNewStatus(test.status);
      setSelectedTest(test)
    } else if (test.category === "Private Rate") {
      setNewStatus(test.status);
      setSelectedTest(test)
    } else if (test.category === "Overdraft") {
      setNewStatus(test.status);
      setSelectedTest(test)
    }
    setShowPickupModal(true);
  };

  const handleCancel = () => {
    setShowPickupModal(false);
  };

  const handleUpdateStatus = async () => {
    if (selectedTest.category === 'Recharge Request') {
       await axiosInstance.put(`api/member/updateTransationStatus/${selectedTest?._id}`, { transactionStatus: newStatus });
      // setRequests(prevRequests =>
      //   prevRequests.map(test =>
      //     test._id === selectedTest._id ? { ...test, transactionStatus: newStatus } : test
      //   )
      // );
    } else if (selectedTest.category === 'Vendor Payment') {
      await axiosInstance.put(`api/member/updateVendorStatus/${selectedTest?.id}`, { transactionStatus: newStatus });
      // setRequests(prevRequests =>
      //   prevRequests.map(ticket =>
      //     ticket.id === selectedTest.id ? { ...ticket, status: newStatus } : ticket
      //   )
      // );
    } else if (selectedTest.category === 'Private Rate') {
      await axiosInstance.put(`api/member/updatePrivateRateStatus/${selectedTest?._id}`, { status: newStatus });
      // setRequests(prevRequests =>
      //   prevRequests.map(ticket =>
      //     ticket._id === selectedTest._id ? { ...ticket, status: newStatus } : ticket
      //   )
      // );
    } else if (selectedTest.category === 'Overdraft') {
      await axiosInstance.put(`api/member/updateOverdraftStatus/${selectedTest?._id}`, { status: newStatus });
      // setRequests(prevRequests =>
      //   prevRequests.map(ticket =>
      //     ticket._id === selectedTest._id ? { ...ticket, status: newStatus } : ticket
      //   )
      // );
    }
    setShowPickupModal(false);
  };

  const openModal = (request) => {
    const rateId = JSON.parse(request.rateId)
    const selectedTest = {
      ...request,
      rateId: rateId
    }

    if (selectedTest && Array.isArray(selectedTest.rateId)) {
      const rateIds = selectedTest.rateId?.map((rate) => rate);

      const filteredRates =
        selectedTest.service_category === "CCPrivateRate Routes"
          ? ratesData.filter((rate) => rateIds.includes(rate._id))
          : cliRatesData.filter((rate) => rateIds.includes(rate._id));

      setSelectedRequest({
        service_category: selectedTest.service_category,
        filteredRates: filteredRates
      });
      setIsModalOpen(true);
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filteredData = [];
    
    // First filter by active category (from tabs)
    if (activeCategory === 'Recharge Request') {
      filteredData = [...recharge].filter(item => item !== undefined);
    } else if (activeCategory === 'Vendor Payment') {
      filteredData = [...vendor].filter(item => item !== undefined);
    } else if (activeCategory === 'Private Rate') {
      filteredData = [...privateRate].filter(item => item !== undefined);
    } else if (activeCategory === 'Overdraft') {
      filteredData = [...overdraft].filter(item => item !== undefined);
    } else if (activeCategory === 'All') {
      filteredData = [
        ...(recharge || []).filter(item => item !== undefined),
        ...(vendor || []).filter(item => item !== undefined),
        ...(privateRate || []).filter(item => item !== undefined),
        ...(overdraft || []).filter(item => item !== undefined)
      ];
    }
    
    // Apply additional filters
    if (filters.category) {
      filteredData = filteredData.filter(request => request.category === filters.category);
    }
    
    if (filters.status) {
      filteredData = filteredData.filter(request => {
        if (request.category === 'Recharge Request') {
          return request.transactionStatus === filters.status;
        }
        return request.status === filters.status;
      });
    }
    
    if (filters.priority && activeCategory === 'Overdraft') {
      filteredData = filteredData.filter(request => request.priority === filters.priority);
    }
    
    if (filters.companyName) {
      filteredData = filteredData.filter(request => 
        request.companyName?.toLowerCase().includes(filters.companyName.toLowerCase()) ||
        request.company_name?.toLowerCase().includes(filters.companyName.toLowerCase())
      );
    }
    
    
    return filteredData;
  };

  const filterByCategory = (category) => {    
    setActiveCategory(category);
    setFilters(prev => ({ ...prev, category: "" })); // Reset category filter when changing tabs
  };

  const filteredRequests = applyFilters();

  const categoryCounts = {
    All: [
      ...(recharge || []).filter(item => item !== undefined),
      ...(vendor || []).filter(item => item !== undefined),
      ...(privateRate || []).filter(item => item !== undefined),
      ...(overdraft || []).filter(item => item !== undefined)
    ].length,
    "Recharge Request": recharge?.filter(r => r).length || 0,
    "Vendor Payment": vendor?.filter(r => r).length || 0,
    "Overdraft": overdraft?.filter(r => r).length || 0,
    "Private Rate": privateRate?.filter(r => r).length || 0,
    "Special Tasks": 0,
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gradient-to-br from-gray-100 via-blue-50 to-blue-100 text-gray-800">
        <h2 className="text-3xl text-gray-700 font-bold mb-6 flex items-center">
          <FcElectroDevices className="mr-3 text-4xl" /> Requests Management
        </h2>

        {/* Search Area with Filters */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Search and Filter Requests</h3>
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              value={filters.companyName}
              onChange={handleFilterChange}
              name="companyName"
              placeholder="Search by Company Name"
              className="p-3 border rounded-lg flex-1 min-w-[200px] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="p-3 border rounded shadow-lg flex-1 min-w-[200px]"
            >
              <option value="">All Categories</option>
              <option value="Recharge Request">Recharge Request</option>
              <option value="Vendor Payment">Vendor Payment</option>
              <option value="Overdraft">Overdraft</option>
              <option value="Private Rate">Private Rate</option>
            </select>
            
            {activeCategory === "Overdraft" && (
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="p-3 border rounded shadow-lg flex-1 min-w-[200px]"
              >
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
             )}
            
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="p-3 border rounded shadow-lg flex-1 min-w-[200px]"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
            
            <button
              onClick={() => setFilters({
                category: "",
                priority: "",
                status: "",
                companyName: ""
              })}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transform transition-transform hover:scale-105 flex items-center"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { category: "All", icon: <HiChartSquareBar className="text-blue-600" />, count: categoryCounts["All"] },
            { category: "Recharge Request", icon: <SiTask className="text-green-500" />, count: categoryCounts["Recharge Request"] },
            { category: "Vendor Payment", icon: <FaMoneyCheckAlt className="text-yellow-500" />, count: categoryCounts["Vendor Payment"] },
            { category: "Overdraft", icon: <FaCogs className="text-orange-500" />, count: categoryCounts["Overdraft"] },
            { category: "Private Rate", icon: <ImBooks className="text-purple-600" />, count: categoryCounts["Private Rate"] },
            { category: "Special Tasks", icon: <FaTasks className="text-red-500" />, count: categoryCounts["Special Tasks"] },
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

        <RequestsTable
          activeCategory={activeCategory}
          filteredRequests={filteredRequests}
          handlePickupClick={handlePickupClick}
          handleViewClick={openModal}
        />

        <PickupTable
          handleCancel={handleCancel}
          handleUpdateStatus={handleUpdateStatus}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          showPickupModal={showPickupModal}
        />

        <ViewTable
          showViewModal={isModalOpen}
          setShowViewModal={setIsModalOpen}
          selectedRequest={selectedRequest}
        />
      </div>
    </DashboardLayout>
  );
};

export default AccountsMyTicket;