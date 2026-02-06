import { useState, useEffect, useContext } from "react";
import { Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import Layout from "../../../layout/page";
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from "../../../../context/AuthContext";
import axiosInstance from "../../../../utils/axiosinstance";

const CreateTroubleTicket = () => {
  const { memberDetails } = useContext(AuthContext)
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ticketDetails, setTicketDetails] = useState({
    customerId: "",
    UserId: "",
    memberId: memberDetails.id,
    accountManager: memberDetails.name,
    ticketCategory: "service",
    ticketDescription: "",
    followUpMethod: "call",
    status: "Pending",
    ticketPriority: 'Low',
    ticketTime: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get('api/member/fetchCustomerId');
        setCustomers(response.data.customers);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to load customers");
      }
    };
    fetchCustomers();
  }, []);

  // Filter customers based on search input
  useEffect(() => {
    if (!searchInput || searchInput.trim() === "") {
      setFilteredCustomers([]);
      setShowDropdown(false);
      return;
    }

    const searchTerm = searchInput.toLowerCase();
    const filtered = customers.filter(customer => {
      const customerId = customer.customerId?.toLowerCase() || "";
      return customerId.includes(searchTerm);
    });

    setFilteredCustomers(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchInput, customers]);

  const handleCustomerSelect = (customer) => {
    setSearchInput(`${customer.customerId}`);
    setTicketDetails(prev => ({
      ...prev,
      customerId: customer.customerId,
      UserId: customer.id,
      memberId: memberDetails.id,
      accountManager: memberDetails.name,
    }));
    setShowDropdown(false);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "api/member/createMember/customerTroubleTicket",
        ticketDetails
      );

      if (response.status === 201) {
        toast.success("Ticket created successfully!");
        setTimeout(() => navigate(-1), 1500);
      } else {
        toast.error("Failed to create ticket");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Error creating ticket";
      toast.error(errorMsg);
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading customers: {error}
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Create New Ticket</h2>

          {/* Customer Search Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <label className="block mb-3 font-semibold text-gray-700">
              Search Customer
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowForm(false);
                }}
                placeholder="Search by Customer ID ..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />

              {/* Customer Dropdown */}
              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        <div className="font-medium text-gray-900">
                          {customer.customerId}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500 text-center">
                      No matching customers found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Ticket Form (shown after customer selection) */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-700">Ticket Category</label>
                <select
                  name="ticketCategory"
                  value={ticketDetails.ticketCategory}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="service">Service Issue</option>
                  <option value="account">Account Issue</option>
                  <option value="other">Other Issue</option>
                  <option value="sale">Sales Issue</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-700">Description</label>
                <textarea
                  name="ticketDescription"
                  value={ticketDetails.ticketDescription}
                  onChange={handleInputChange}
                  placeholder="Describe the issue in detail..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Follow-up Method</label>
                  <select
                    name="followUpMethod"
                    value={ticketDetails.followUpMethod}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="chat">Chat</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Priority</label>
                  <select
                    name="ticketPriority"
                    value={ticketDetails.ticketPriority}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              >
                Create Ticket
              </button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
};

export default CreateTroubleTicket;