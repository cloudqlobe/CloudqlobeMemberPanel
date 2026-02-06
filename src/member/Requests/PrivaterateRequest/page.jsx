import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../layout/page';
import { FaFilter, FaTimes} from 'react-icons/fa';
import { LuBadgeDollarSign } from "react-icons/lu";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosinstance';

const PrivateRateRequestPage = () => {

  const { memberDetails } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [privateRatesData, setPrivateRatesData] = useState([]);
  const [privateCliRatesData, setPrivateCliRatesData] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRatesAndTests = async () => {

      try {
        const [testsResponse, privateRatesResponse, privateCliRatesResponse] =
          await Promise.all([
            axiosInstance.get("api/member/test_privateRate"),
            axiosInstance.get("api/member/private_ccrates"),
            axiosInstance.get("api/member/private_clirates"),
          ]);

        const tests = testsResponse.data?.rate || [];
        const privateRatesData = privateRatesResponse.data?.ccrate || [];
        const privateCliRatesData = privateCliRatesResponse.data?.clirate || [];

        const parsedRates = tests.map(test => ({
          ...test,
          rateId: safeJsonParse(test.rateId)
        }));

        setRequests(parsedRates);
        setPrivateRatesData(privateRatesData);
        setPrivateCliRatesData(privateCliRatesData);

      } catch (error) {
        console.error('Error fetching rates or tests:', error);
      }
    };
    fetchRatesAndTests();
  }, []);

  const safeJsonParse = (str) => {
    try {
      return str ? JSON.parse(str) : [];
    } catch (e) {
      console.error("Invalid JSON format:", str);
      return [];
    }
  };

  const handleViewClick = (testId) => {
    const selectedTest = requests.find((test) => test._id === testId);

    if (selectedTest && Array.isArray(selectedTest.rateId)) {
      const rateIds = selectedTest.rateId.map((rate) => rate);

      let filteredRates = [];

      if (selectedTest.service_category === "CCPrivateRate Routes") {
        filteredRates = privateRatesData.filter((rate) => rateIds.includes(rate._id));
      } else if (selectedTest.service_category === "CLIPrivateRate Routes") {
        filteredRates = privateCliRatesData.filter((rate) => rateIds.includes(rate._id));
      }

      setSelectedRequest({ ...selectedTest, filteredRates });
      setShowViewModal(true);
    }
  };



  const handlePickupClick = async (privateRateId) => {
    try {
      const account_associate = memberDetails.name;

      const response1 = await axiosInstance.put(`api/member/updateMemberPrivateRateId/${memberDetails.id}`, { privateRateId });

      const response2 = await axiosInstance.put(`api/member/updatePrivateRate/${privateRateId}`, { account_associate });
      if (response1.data.success || response2.data.success) {
        toast.success("Pickup To Myticket successfully");

        setRequests((prevRequests) => {
          const updatedPayments = prevRequests.filter((data) => data._id !== privateRateId);
          return updatedPayments;
        });
      }
    } catch (error) {
      console.error("Error updating member member:", error);
    }
  };

  const handleFilterChange = (e) => setFilterStatus(e.target.value);

  const filteredRequests = filterStatus === 'All' ? requests : requests.filter((request) => request.status === filterStatus);

  return (
    <Layout>
      <div className="p-6 text-gray-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <LuBadgeDollarSign className="mr-2 text-yellow-500 text-5xl" />
            <h2 className="text-3xl font-semibold">Private Rate Requests</h2>
          </div>
        </div>

        <div className="flex justify-end items-center mb-6">
          <div className="flex items-center">
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="p-2 border rounded-md bg-white mr-2"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
            <button
              className="px-4 py-2 bg-orange-500 text-white flex items-center rounded-md"
            >
              <FaFilter className="mr-2" />
              Filter
            </button>
          </div>
        </div>

        <table className="min-w-full border-collapse mb-6">
          <thead className="bg-[#005F73] text-white">
            <tr>
              <th className="p-2">Carrier ID</th>
              <th className="p-2">Account Manager</th>
              <th className="p-2">Service Category</th>
              <th className="p-2">Account Associate</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request, index) => (
              <tr key={request.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                <td className="p-2">{request.companyId}</td>
                <td className="p-2">{request.account_manager}</td>
                <td className="p-2">{request.service_category}</td>
                <td className="p-2">{request.account_associate}</td>
                <td className="p-2">{request.status}</td>
                <td className="p-2 flex justify-end space-x-2">
                  <button
                    onClick={() => handleViewClick(request._id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handlePickupClick(request._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Pickup
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showViewModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white rounded-md p-6 w-2/3 relative">
              <button
                onClick={() => setShowViewModal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                <FaTimes className="text-2xl" />
              </button>

              <h3 className="text-lg font-semibold mb-4">Rates Details</h3>
              <div className="flex mb-4">
                {
                  selectedRequest.service_category === "CCPrivateRate Routes" ? (
                    <button
                      className={`px-4 py-2 rounded-md bg-blue-400 text-white`}
                    >
                      CC Routes
                    </button>
                  ) : (
                    <button
                      className={`px-4 py-2 rounded-md bg-blue-400 text-white`}
                    >
                      CLI Routes
                    </button>
                  )
                }
              </div>

              {selectedRequest.service_category === 'CCPrivateRate Routes' && selectedRequest && selectedRequest?.filteredRates.length > 0 && (
                <table className="w-full border-collapse mb-6">
                  <thead className="bg-yellow-500 text-white">
                  <tr>
                      <th className="p-2">Country Code</th>
                      <th className="p-2">Country Name</th>
                      <th className="p-2">Quality Description</th>
                      <th className="p-2">Profile</th>
                      <th className="p-2">Rate</th>
                      <th className="p-2">status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.filteredRates.map((rate) => (
                      <tr key={rate._id} className="bg-white text-center">
                        <td className="p-2">{rate.countryCode}</td>
                        <td className="p-2">{rate.country}</td>
                        <td className="p-2">{rate.qualityDescription}</td>
                        <td className="p-2">{rate.profile}</td>
                        <td className="p-2">{rate.rate}</td>
                        <td className="p-2">{rate.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedRequest.service_category === 'CLIPrivateRate Routes' && selectedRequest && selectedRequest?.filteredRates.length > 0 && (
                <table className="w-full border-collapse">
                  <thead className="bg-yellow-500 text-white">
                  <tr>
                      <th className="p-2">Country Code</th>
                      <th className="p-2">Country Name</th>
                      <th className="p-2">Quality Description</th>
                      <th className="p-2">RTP</th>
                      <th className="p-2">ASR</th>
                      <th className="p-2">ACD</th>
                      <th className="p-2">Rate</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.filteredRates.map((rate) => (
                      <tr key={rate._id} className="bg-white text-center">
                        <td className="p-2">{rate.countryCode}</td>
                        <td className="p-2">{rate.country}</td>
                        <td className="p-2">{rate.qualityDescription}</td>
                        <td className="p-2">{rate.rtp}</td>
                        <td className="p-2">{rate.asr}</td>
                        <td className="p-2">{rate.acd}</td>
                        <td className="p-2">{rate.rate}</td>
                        <td className="p-2">{rate.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </div>
          </div>
        )}
        <ToastContainer/>
      </div>
    </Layout>
  );
};

export default PrivateRateRequestPage;