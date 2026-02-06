import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../layout/page";
import { AiOutlineFolderOpen, AiOutlineCheckCircle } from "react-icons/ai";
import { MdOutlineReportProblem, MdOutlineTaskAlt } from "react-icons/md";
import { BsGraphUp, BsTools } from "react-icons/bs";
import { RiTaskFill } from "react-icons/ri";
import { PickupTable, RequestsTable, TroubleTicketView, VeiwPage } from "./table";
import AuthContext from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosinstance";

const SupportMyticket = () => {
  const { memberDetails } = useContext(AuthContext);
  // const [requests, setRequests] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filters, setFilters] = useState({
    category: "",
    priority: "",
    status: "",
    companyName: ""
  });
  const [testData, setTestData] = useState([]);
  const [ratesData, setRatesData] = useState([]);
  const [cliRatesData, setCliRatesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [troubleTicket, setTroubleTicket] = useState([]);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!memberDetails?.id) return;

      try {
        const memberDataResponse = await axiosInstance.get(`api/member/support/${memberDetails.id}`);
        const testDataResponse = await axiosInstance.get(`api/member/tests`);
        const ratesResponse = await axiosInstance.get("api/admin/ccrates");
        const cliRatesResponse = await axiosInstance.get(`api/admin/clirates`);
        const troubleTicketResponse = await axiosInstance.get(`api/member/troubleticket`);
        
        const troubleTicketData = troubleTicketResponse?.data.troubletickets || [];
        const ticketId = JSON.parse(memberDataResponse.data.member.troubleTicketId || "[]");
        
        const member = {
          ...memberDataResponse.data.member,
          troubleTicketId: ticketId
        };

        const filterTroubleTicket = (member.troubleTicketId || []).map((id) =>
          troubleTicketData.find((ticket) => ticket.id === id.troubleTicketId)
        ).filter(Boolean);

        setTroubleTicket(filterTroubleTicket);
        // setRequests(filterTroubleTicket);

        const testId = JSON.parse(memberDataResponse.data.member.testingDataId || "[]");
        const memberData = {
          ...memberDataResponse.data.member,
          testingDataId: testId
        };

        const testData = testDataResponse?.data.testData || [];
        const filter = memberData.testingDataId?.map((id) => {
          const matchedTest = testData.find((test) => test.id === id.testId);
          if (matchedTest && matchedTest.rateId) {
            try {
              matchedTest.rateId = JSON.parse(matchedTest.rateId);
            } catch (error) {
              matchedTest.rateId = [];
            }
          }
          return matchedTest;
        }).filter(Boolean);

        setTestData(filter);
        setRatesData(ratesResponse.data.ccrates);
        setCliRatesData(cliRatesResponse.data.clirates);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [memberDetails?.id]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filterByCategory = (category) => {
    if (category === 'Testing Requests') {
      // setRequests(testData);
    } else if (category === 'Trouble Tickets') {
      // setRequests(troubleTicket);
    } else if (category === 'All') {
      // setRequests([...troubleTicket, ...testData]);
    }
    setActiveCategory(category);
    // Reset filters when changing category
    setFilters({
      category: "",
      priority: "",
      status: "",
      companyName: ""
    });
  };

  const applyFilters = () => {
    let filteredData = [];
    
    // First filter by active category
    if (activeCategory === 'Testing Requests') {
      filteredData = [...testData];
    } else if (activeCategory === 'Trouble Tickets') {
      filteredData = [...troubleTicket];
    } else {
      filteredData = [...troubleTicket, ...testData];
    }
    
    // Apply additional filters
    if (filters.category) {
      filteredData = filteredData.filter(request => request.category === filters.category);
    }
    
    if (filters.status) {
      filteredData = filteredData.filter(request => {
        if (request.category === 'Testing Requests') {
          return request.testStatus === filters.status;
        }
        return request.status === filters.status;
      });
    }
    
    // Priority filter only for Trouble Tickets
    if (filters.priority && (activeCategory === 'Trouble Tickets' || filters.category === 'Trouble Tickets')) {
      filteredData = filteredData.filter(request => request.priority === filters.priority);
    }
    
    if (filters.companyName) {
      filteredData = filteredData.filter(request => 
        request.companyName?.toLowerCase().includes(filters.companyName.toLowerCase())
      );
    }
    
    return filteredData;
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      priority: "",
      status: "",
      companyName: ""
    });
  };

  const openModal = (testId) => {
    const selectedTest = testData.find((test) => test.id === testId);
    if (selectedTest && Array.isArray(selectedTest.rateId)) {
      const rateIds = selectedTest.rateId?.map((rate) => rate._id);
      const filteredRates =
        selectedTest.rateType === "CCRate"
          ? ratesData.filter((rate) => rateIds.includes(rate._id))
          : cliRatesData.filter((rate) => rateIds.includes(rate._id));

      setSelectedRate(filteredRates);
      setIsModalOpen(true);
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRate(null);
  };

  const handlePickupClick = (test) => {
    if (test.category === 'Testing Requests') {
      setNewStatus(test.testStatus);
    } else if (test.category === 'Trouble Tickets') {
      setNewStatus(test.status);
    }
    
    setSelectedTest(test);
    setShowPickupModal(true);
  };

  const handleCancel = () => {
    setShowPickupModal(false);
  };

  const handleUpdateStatus = async () => {
    
    try {
      if (selectedTest.category === 'Testing Requests') {
        await axiosInstance.put(`api/member/teststatus/${selectedTest?.id}`, { newStatus });
        setTestData(prev => 
          prev.map(test =>
            test.id === selectedTest.id ? { ...test, testStatus: newStatus } : test
          )
        );
      } else if (selectedTest.category === 'Trouble Tickets') {
        await axiosInstance.put(`api/member/troubleticketstatus/${selectedTest?.id}`, { status: newStatus });
        setTroubleTicket(prev => 
          prev.map(ticket =>
            ticket.id === selectedTest.id ? { ...ticket, status: newStatus } : ticket
          )
        );
      }
      
      // Update the combined requests view
      // setRequests(prev => 
      //   prev.map(item => {
      //     if (item.id === selectedTest.id) {
      //       return { 
      //         ...item, 
      //         status: newStatus, 
      //         testStatus: newStatus 
      //       };
      //     }
      //     return item;
      //   })
      // );
      
      setShowPickupModal(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredRequests = applyFilters();

  const categoryCounts = {
    All: (troubleTicket?.length || 0) + (testData?.length || 0),
    "Live Tickets": troubleTicket?.filter(t => t.status === 'Open').length || 0,
    "Solved Tickets": troubleTicket?.filter(t => t.status === 'Closed').length || 0,
    "Trouble Tickets": troubleTicket?.length || 0,
    "Testing Requests": testData?.length || 0,
    "Special Tasks": 0,
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
          <div className="flex flex-wrap gap-4">
            
            <input
              type="text"
              name="companyName"
              value={filters.companyName}
              onChange={handleFilterChange}
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
              <option value="Testing Requests">Testing Requests</option>
              <option value="Trouble Tickets">Trouble Tickets</option>
            </select>
            
            {/* Priority filter - only shown for Trouble Tickets */}
            {(activeCategory === "Trouble Tickets" || filters.category === "Trouble Tickets") && (
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
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
            
            <button
              onClick={resetFilters}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transform transition-transform hover:scale-105 flex items-center"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { category: "All", icon: <BsGraphUp className="text-blue-600" />, count: categoryCounts["All"] },
            { category: "Live Tickets", icon: <MdOutlineTaskAlt className="text-green-500" />, count: categoryCounts["Live Tickets"] },
            { category: "Solved Tickets", icon: <AiOutlineCheckCircle className="text-yellow-500" />, count: categoryCounts["Solved Tickets"] },
            { category: "Trouble Tickets", icon: <MdOutlineReportProblem className="text-orange-500" />, count: categoryCounts["Trouble Tickets"] },
            { category: "Testing Requests", icon: <BsTools className="text-purple-600" />, count: categoryCounts["Testing Requests"] },
            { category: "Special Tasks", icon: <RiTaskFill className="text-red-500" />, count: categoryCounts["Special Tasks"] },
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
          openModal={openModal}
          handlePickupClick={handlePickupClick}
          handleViewTicket={handleViewTicket}
        />

        <VeiwPage
          isModalOpen={isModalOpen}
          selectedRate={selectedRate}
          closeModal={closeModal}
        />
        
        <TroubleTicketView
          showModal={showTicketModal}
          setShowModal={setShowTicketModal}
          ticket={selectedTicket}
        />

        <PickupTable
          handleCancel={handleCancel}
          handleUpdateStatus={handleUpdateStatus}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          showPickupModal={showPickupModal}
        />
      </div>
    </DashboardLayout>
  );
};

export default SupportMyticket;