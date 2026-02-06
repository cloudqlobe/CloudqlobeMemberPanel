import React, { useCallback, useContext, useEffect, useState } from 'react';
import Layout from '../../layout/page';
import { FaPlusCircle } from 'react-icons/fa';
import { BsBullseye } from "react-icons/bs";
import { FaChevronDown } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosinstance';

const OverdraftRequestPage = () => {
  const { memberDetails } = useContext(AuthContext);
  const [overdraftRequests, setOverdraftRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filter, setFilter] = useState({
    status: 'All',
    searchTerm: '',
    clientType: 'All',
    reason: 'All'
  });
  const [showAddOverdraftModal, setShowAddOverdraftModal] = useState(false);
  const [newOverdraft, setNewOverdraft] = useState({ 
    customerId: '', 
    accountManager: '', 
    clientType: '', 
    reason: '', 
    amount: '', 
    status: 'Pending',
    companyName: ''
  });
  const [companies, setCompanies] = useState([]);
  const [companyInput, setCompanyInput] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`api/member/getAllOverdraft`);
        if (response.data.success) {
          let overdraft = response.data.overdraft;

          setOverdraftRequests(overdraft);
          setFilteredRequests(overdraft);
        }
      } catch (error) {
        console.error('Error fetching overdraft data:', error);
      }
    };
    fetchData();
  }, [memberDetails.id]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get('api/member/fetchCustomerId');
        setCompanies(response.data.customers);
      } catch (err) {
        console.error(err.message);
        toast.error("Failed to load companies");
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (companyInput.trim() === "") {
      setFilteredCompanies([]);
      setShowDropdown(false);
      return;
    }

    const filtered = companies.filter(company =>
      company.companyName.toLowerCase().includes(companyInput.toLowerCase())
    );
    setFilteredCompanies(filtered);
    setShowDropdown(filtered.length > 0);
  }, [companyInput, companies]);


const applyFilters = useCallback(() => {
  let filtered = [...overdraftRequests];

  if (filter.status !== 'All') {
    filtered = filtered.filter(r => r.status === filter.status);
  }

  if (filter.clientType !== 'All') {
    filtered = filtered.filter(r => r.clientType === filter.clientType);
  }

  if (filter.reason !== 'All') {
    filtered = filtered.filter(r => r.reason === filter.reason);
  }

  if (filter.searchTerm) {
    const term = filter.searchTerm.toLowerCase();
    filtered = filtered.filter(r =>
      (r.companyName && r.companyName.toLowerCase().includes(term)) ||
      (r.accountManager && r.accountManager.toLowerCase().includes(term)) ||
      (r.reason && r.reason.toLowerCase().includes(term)) ||
      (r.amount && r.amount.toString().includes(term))
    );
  }

  setFilteredRequests(filtered);
}, [filter, overdraftRequests]);

useEffect(() => {
  applyFilters();
}, [applyFilters]);



  const handleCompanySelect = (company) => {
    setCompanyInput(company.companyName);
    setNewOverdraft({
      ...newOverdraft,
      customerId: company.id,
      companyName: company.companyName
    });
    setShowDropdown(false);
    setFocusedIndex(-1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setFilter(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOverdraft({ ...newOverdraft, [name]: value });
  };

  const handleAddOverdraft = async () => {
    if (!newOverdraft.customerId) {
      toast.error("Please select a company");
      return;
    }

    try {
      await axiosInstance.post('api/member/createOverdraft', newOverdraft);
      toast.success('Overdraft Added Successfully');
      setOverdraftRequests(prev => [...prev, newOverdraft]);
      setNewOverdraft({
        customerId: '', 
        accountManager: '', 
        clientType: '', 
        reason: '', 
        amount: '', 
        status: 'Pending',
        companyName: ''
      });
      setCompanyInput("");
      setShowAddOverdraftModal(false);
    } catch (error) {
      console.error('Error creating overdraft:', error);
      toast.error('Failed to add overdraft');
    }
  };

  const handleCancel = () => {
    setShowAddOverdraftModal(false);
    setCompanyInput("");
  };

  const handlePickupClick = async (overdraftId) => {
    try {
      const serviceEngineer = memberDetails.name;
      const response1 = await axiosInstance.put(`api/member/updateMemberOverdraftId/${memberDetails.id}`, { overdraftId });
      const response2 = await axiosInstance.put(`api/member/updateOverdraft/${overdraftId}`, { serviceEngineer });

      if (response1.data.success || response2.data.success) {
        toast.success("Pickup To Myticket successfully");
        setOverdraftRequests(prev => prev.filter(data => data._id !== overdraftId));
      }
    } catch (error) {
      console.error("Error updating member member:", error);
    }
  };

  return (
    <Layout>
      <div className="p-6 text-gray-600">
        <h2 className="text-3xl font-semibold flex items-center mb-4">
          <BsBullseye className="mr-2 text-yellow-500 text-5xl" />
          Overdraft Requests
        </h2>

        {/* Add Overdraft Button */}
        <button
          onClick={() => setShowAddOverdraftModal(true)}
          className="px-4 py-2 bg-green-500 text-white flex items-center rounded-md mb-4"
        >
          <FaPlusCircle className="mr-2" />
          Add Overdraft
        </button>

        {/* Filter Controls - Maintained original layout */}
        <div className="flex justify-between mb-4 items-center">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search..."
              value={filter.searchTerm}
              onChange={handleSearchChange}
              className="p-2 border rounded-md"
            />
            <select
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="p-2 border rounded-md"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
            <select
              name="clientType"
              value={filter.clientType}
              onChange={handleFilterChange}
              className="p-2 border rounded-md"
            >
              <option value="All">All Client Types</option>
              <option value="New">New</option>
              <option value="Existing">Existing</option>
            </select>
            <select
              name="reason"
              value={filter.reason}
              onChange={handleFilterChange}
              className="p-2 border rounded-md"
            >
              <option value="All">All Reasons</option>
              <option value="Test">Test overdraft</option>
              <option value="Emergency">Emergency</option>
              <option value="Management Approved">Management Approved</option>
            </select>
          </div>
          <button
            onClick={() => setFilter({
              status: 'All',
              searchTerm: '',
              clientType: 'All',
              reason: 'All'
            })}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Reset
          </button>
        </div>

        {/* Overdraft Table - Original design maintained */}
        <table className="min-w-full border-collapse mb-6">
          <thead className="bg-[#005F73] text-white">
            <tr>
              <th className="p-2">Company Name</th>
              <th className="p-2">Account Manager</th>
              <th className="p-2">Client Type</th>
              <th className="p-2">Reason</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(request => (
              <tr key={request._id} className="bg-gray-100">
                <td className="p-2">{request.companyName || request.customerId}</td>
                <td className="p-2">{request.accountManager}</td>
                <td className="p-2">{request.clientType}</td>
                <td className="p-2">{request.reason}</td>
                <td className="p-2">${request.amount}</td>
                <td className="p-2">{request.status}</td>
                <td className="p-2 text-right">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handlePickupClick(request._id)}
                      className="px-4 py-2 w-36 bg-blue-500 text-white flex items-center justify-center rounded-md"
                    >
                      <FaPlusCircle className="mr-2" />
                      Pickup
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Overdraft Modal - Original design maintained */}
        {showAddOverdraftModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white rounded-md p-6 w-1/3">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaPlusCircle className="mr-2 text-green-500" />
                Add Overdraft
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyInput}
                    onChange={(e) => {
                      setCompanyInput(e.target.value);
                      setFocusedIndex(-1);
                    }}
                    placeholder="Search company..."
                    onFocus={() => companyInput && setShowDropdown(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setFocusedIndex((prev) => (prev + 1) % filteredCompanies.length);
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setFocusedIndex((prev) => (prev - 1 + filteredCompanies.length) % filteredCompanies.length);
                      } else if (e.key === 'Enter' && focusedIndex >= 0) {
                        e.preventDefault();
                        handleCompanySelect(filteredCompanies[focusedIndex]);
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-700">
                    <FaChevronDown className="text-blue-500" />
                  </div>
                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredCompanies.map((company, index) => (
                        <div
                          key={company.id}
                          className={`p-3 cursor-pointer hover:bg-gray-100 ${index === focusedIndex ? 'bg-gray-100' : ''}`}
                          onClick={() => handleCompanySelect(company)}
                          onMouseEnter={() => setFocusedIndex(index)}
                        >
                          {company.companyName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Manager</label>
                <input
                  name="accountManager"
                  value={newOverdraft.accountManager}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Type</label>
                <select
                  name="clientType"
                  value={newOverdraft.clientType}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md w-full"
                >
                  <option value="">Select Client Type</option>
                  <option value="New">New</option>
                  <option value="Existing">Existing</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <select
                  name="reason"
                  value={newOverdraft.reason}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md w-full"
                >
                  <option value="">Select Reason</option>
                  <option value="Test">Test overdraft</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Management Approved">Management Approved</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  name="amount"
                  type="number"
                  value={newOverdraft.amount}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md w-full"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOverdraft}
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                  Add Overdraft
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </Layout>
  );
};

export default OverdraftRequestPage;