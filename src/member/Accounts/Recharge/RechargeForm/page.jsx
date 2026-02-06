import { useState, useEffect, useContext } from 'react';
import { FaCalendarAlt, FaMoneyBillAlt, FaFileUpload, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { BiSolidUser } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../../../layout/page';
import AuthContext from '../../../../context/AuthContext';
import axiosInstance from '../../../../utils/axiosinstance';

const RechargeForm = () => {
  const { memberDetails } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [transactionTime, setTransactionTime] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [accountAgent, setAccountAgent] = useState('');
  const [customerID, setCustomerId] = useState('');
  const [image, setImage] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyInput, setCompanyInput] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

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
  }, [memberDetails.id]);

  useEffect(() => {
    if (!companyInput || companyInput.trim() === "") {
      setFilteredCompanies(companies); // Show all companies when empty
      setShowDropdown(false); // But keep hidden initially
      return;
    }

    const filtered = companies.filter(company => {
      const customerId = company.customerId || "";
      return (
        customerId.toLowerCase().includes(companyInput.toLowerCase())
      );
    });
    setFilteredCompanies(filtered);
    setShowDropdown(true); // Always show dropdown when typing
  }, [companyInput, companies]);

  const handleCompanySelect = (company) => {
    setCompanyInput(`${company.customerId || ""}`);
    setCustomerId(company.id || "");
    setShowDropdown(false);
    setFocusedIndex(-1);
  };

  const handleFileChange = (img) => {
    const selectedImage = img.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerID) {
      toast.error("Please select a company");
      return;
    }

    const formattedDate = new Date(transactionTime).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const fromData = new FormData();
    fromData.append('amount', amount);
    fromData.append('dateAndTime', formattedDate);
    fromData.append('referenceNo', referenceNo);
    fromData.append('accountAgent', accountAgent);
    fromData.append('UserId', customerID);
    fromData.append('image', image);
    fromData.append('customerId', companyInput);
    fromData.append('memberId', memberDetails.id);

    try {
      const response = await axiosInstance.post('api/member/Transactions', fromData);
      if (response.status === 201) {
        toast.success("Recharge Successful!");
        setAmount('');
        setTransactionTime('');
        setReferenceNo('');
        setAccountAgent('');
        setCustomerId('');
        setCompanyInput('');
        setImage(null);
      } else {
        toast.error('Failed to add Transaction');
      }
    } catch (error) {
      console.error('Error uploading Transactions', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit transaction");
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-offwhite flex items-center justify-center px-1">
        <div className="flex w-full max-w-[90rem] bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Left Side Image Section */}
          <div className="w-1/2 bg-offwhite hidden lg:flex items-center justify-center">
            <img
              src="/member/Accountsrecharge.avif"
              alt="Recharge form illustration"
              className="w-3/4 h-auto object-cover mt-9"
            />
          </div>

          {/* Right Side Form Section */}
          <div className="w-full lg:w-1/2 p-10 bg-white">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
              <FaMoneyBillAlt className="mr-3 text-blue-500 text-4xl" /> Recharge Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name Search Section */}
              <div className="flex items-center space-x-4 relative">
                <BiSolidUser className="text-gray-600 text-2xl" />
                <div className="w-full relative">
                  <input
                    type="text"
                    value={companyInput}
                    onChange={(e) => {
                      setCompanyInput(e.target.value);
                      setFocusedIndex(-1);
                      setShowDropdown(true); // Show dropdown when typing
                    }}
                    placeholder="Search by customer ID ..."
                    onFocus={() => setShowDropdown(true)} // Show dropdown when focused
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Hide with delay
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setFocusedIndex(prev =>
                          prev < filteredCompanies.length - 1 ? prev + 1 : 0
                        );
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setFocusedIndex(prev =>
                          prev > 0 ? prev - 1 : filteredCompanies.length - 1
                        );
                      } else if (e.key === 'Enter' && focusedIndex >= 0) {
                        e.preventDefault();
                        handleCompanySelect(filteredCompanies[focusedIndex]);
                      }
                    }}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-700">
                    <FaChevronDown className="text-blue-500" />
                  </div>
                  {showDropdown && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredCompanies.length > 0 ? (
                        filteredCompanies.map((company, index) => (
                          <div
                            key={company.id}
                            className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors ${index === focusedIndex ? 'bg-gray-100' : ''
                              }`}
                            onClick={() => handleCompanySelect(company)}
                            onMouseEnter={() => setFocusedIndex(index)}
                          >
                            <div className="font-medium text-gray-900">
                              {company.customerId || "No Customer ID"}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-gray-500">No matching companies found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <input type="hidden" value={customerID} />

              {/* Amount */}
              <div className="flex items-center space-x-4">
                <FaMoneyBillAlt className="text-gray-600 text-2xl" />
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Transaction Time */}
              <div className="flex items-center space-x-4">
                <FaCalendarAlt className="text-gray-600 text-2xl" />
                <input
                  type="datetime-local"
                  value={transactionTime}
                  onChange={(e) => setTransactionTime(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Reference No */}
              <div className="flex items-center space-x-4">
                <FaFileUpload className="text-gray-600 text-2xl" />
                <input
                  type="text"
                  placeholder="Enter Reference No"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Account Agent */}
              <div className="flex items-center space-x-4">
                <FaUserCircle className="text-gray-600 text-2xl" />
                <input
                  type="text"
                  placeholder="Enter Account Agent"
                  value={accountAgent}
                  onChange={(e) => setAccountAgent(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Screenshot Upload */}
              <div className="flex items-center space-x-4">
                <FaFileUpload className="text-gray-600 text-2xl" />
                <div className="flex flex-col w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </Layout>
  );
};

export default RechargeForm;