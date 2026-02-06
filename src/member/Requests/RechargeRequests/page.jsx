import React, { useCallback, useContext, useEffect, useState } from 'react';
import Layout from '../../layout/page';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaFilter } from 'react-icons/fa';
import { RiApps2Line } from "react-icons/ri";
import { toast } from 'react-toastify';
import AuthContext from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosinstance';

const RechargerequestPage = () => {
  const { memberDetails } = useContext(AuthContext);
  const [allPayments, setAllPayments] = useState([]);  // Stores original data
  const [payments, setPayments] = useState([]);  // Stores filtered data
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  // Function to fetch data
const fetchData = useCallback(async () => {
  try {
    const response = await axiosInstance.get(
      `api/member/getTransactionsByMemberId/${memberDetails.id}`
    );

    if (response.data.success) {
      let data = response.data.transaction;

      // ✅ FIXED role condition
      if (
        memberDetails.role === 'accountmember' ||
        memberDetails.role === 'salemember'
      ) {
        data = data.filter(
          item => item.serviceEngineer === 'NOC CloudQlobe'
        );
      }

      setAllPayments(data);
      setPayments(data);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}, [memberDetails.id, memberDetails.role]);


  // Fetch data when the component mounts
useEffect(() => {
  fetchData();
}, [fetchData]);

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === 'All') {
      setPayments(allPayments);
    } else {
      setPayments(allPayments.filter(payment => payment.transactionStatus === selectedFilter));
    }
  };


  const handlePickupData = async (rechargeId) => {
    try {
      const serviceEngineer = memberDetails.name;

      const response1 = await axiosInstance.put(`api/member/updateMemberTransactionId/${memberDetails.id}`, { rechargeId });
      const response2 = await axiosInstance.put(`api/member/updateTransaction/${rechargeId}`, { serviceEngineer });

      if (response1.data.success || response2.data.success) {
        toast.success("Pickup To Myticket successfully");

        setAllPayments((prevPayments) => {
          const updatedPayments = prevPayments.filter((data) => data._id !== rechargeId);

          // Re-apply current filter after update
          if (filter === 'All') {
            setPayments(updatedPayments);
          } else {
            setPayments(updatedPayments.filter(payment => payment.transactionStatus === filter));
          }

          return updatedPayments;
        });

      }
    } catch (error) {
      console.error("Error updating admin member:", error);
    }
  };


  // Apply filter without losing original data
  const handleFilterApply = () => {
    if (filter === 'All') {
      setPayments(allPayments); // Reset to original
    } else {
      setPayments(allPayments.filter(payment => payment.transactionStatus === filter));
    }
  };

  return (
    <Layout>
      <div className="p-6 text-gray-600">
        <h2 className="text-3xl font-semibold flex items-center mb-4">
          <RiApps2Line className="mr-2 text-yellow-500 text-5xl" />
          Recharge Requests
        </h2>

        <div className="flex justify-between items-center mb-4">
          <button
            className="px-4 py-2 bg-green-500 text-white flex items-center rounded-md"
            onClick={() => navigate('/member/recharge')}
          >
            <FaPlusCircle className="mr-2" />
            Add Payment
          </button>
          <div className="flex items-center">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="p-2 border rounded-md bg-white mr-2"
            >
              <option value="All">All</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
            </select>
            <button
              onClick={handleFilterApply}
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
              <th className="p-2">Customer ID</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Payment Time</th>
              <th className="p-2">Reference No</th>
              <th className="p-2">Account Agent</th>
              <th className="p-2">Status</th>
              {["account"].includes(memberDetails.role) && (
                <th className="p-2">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id} className="bg-gray-100">
                <td className="p-2">{payment?.customerId}</td>
                <td className="p-2">${payment.amount}</td>
                <td className="p-2">{new Date(payment.dateAndTime).toLocaleString()}</td>
                <td className="p-2">{payment.referenceNo}</td>
                <td className="p-2">{payment.accountAgent}</td>
                <td className="p-2">{payment.transactionStatus}</td>

                {["account"].includes(memberDetails.role) && (
                  <td className="p-2 text-right">
                    <div className="flex justify-end">
                      <button
                        className="px-4 py-2 w-36 bg-blue-500 text-white flex items-center justify-center rounded-md"
                        onClick={() => handlePickupData(payment._id)}
                      >
                        <FaPlusCircle className="mr-2" />
                        Pickup
                      </button>
                    </div>
                  </td>
                )}

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default RechargerequestPage;
