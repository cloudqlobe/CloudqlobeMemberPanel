import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Import icons
import { GrSupport } from "react-icons/gr";
import axiosInstance from "../../../../../utils/axiosinstance";

const SupportTab = ({ customerId }) => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "pending", "inProgress", "resolved"

  useEffect(() => {
    const fetchTroubleTicket = async () => {
      try {
        const response = await axiosInstance.get(`api/member/troubleticket/${customerId}`);
        const TroubleTicket = response?.data.troubletickets || []
        setSupportRequests(TroubleTicket)
        setFilteredRequests(TroubleTicket);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching troubleTicket:", error);
      }
    };
    fetchTroubleTicket();
  }, [customerId]);

  useEffect(() => {
    // Apply filter based on status
    if (filter === "all") {
      setFilteredRequests(supportRequests);
    } else {
      setFilteredRequests(supportRequests.filter(request => request.status.toLowerCase() === filter));
    }
  }, [filter, supportRequests]);

  const getTimeAgo = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
  };



  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <GrSupport className="mr-3 text-5xl text-yellow-500" /> Support Requests
      </h2>

      {/* Filter buttons */}
      <div className="flex mb-4">
        <button
          className={`py-2 px-4 mr-2 rounded ${filter === "all" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("all")}
        >
          All Tickets
        </button>
        <button
          className={`py-2 px-4 mr-2 rounded ${filter === "Pending" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("Pending")}
        >
          Pending
        </button>
        <button
          className={`py-2 px-4 mr-2 rounded ${filter === "process" ? "bg-red-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("process")}
        >
          In Progress
        </button>
        <button
          className={`py-2 px-4 rounded ${filter === "completed" ? "bg-green-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("completed")}
        >
          Resolved
        </button>
      </div>

      {/* Support Requests Table */}
      <table className="min-w-full border-collapse">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="px-4 py-2">Customer ID</th>
            <th className="px-4 py-2">Account Manager</th>
            <th className="px-4 py-2">Issues</th>
            <th className="px-4 py-2">Support Engineer</th>
            <th className="px-4 py-2">Estimated Time</th>
            <th className="px-4 py-2">Priority</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request, index) => (
            <tr
              key={request.id}
              className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
            >
              <td className="px-4 py-2">{request.customerId}</td>
              <td className="px-4 py-2">{request.accountManager}</td>
              <td className="px-4 py-2">{request.ticketDescription}</td>
              <td className="px-4 py-2">{request.supportEngineer}</td>
              <td className="px-4 py-2">{getTimeAgo(request.ticketTime, request.lastUpdated)}</td>
              <td className="px-4 py-2">{request.ticketPriority}</td>
              <td className="px-4 py-2 flex items-center">
                {request.status === "Pending" ? (
                  <FaTimesCircle className="text-red-500 mr-2 " />
                ) : request.status === "Process" ? (
                  <FaTimesCircle className="text-yellow-500 mr-2" />
                ) : (
                  <FaCheckCircle className="text-green-500 mr-2" />
                )}
                {request.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupportTab;