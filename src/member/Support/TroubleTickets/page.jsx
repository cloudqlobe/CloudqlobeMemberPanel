import { useState, useEffect, useContext } from 'react';
import Layout from '../../layout/page';
import { FaPlus, FaServicestack } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosinstance';

const TroubleTicket = () => {
  const navigate = useNavigate();
  const { memberDetails } = useContext(AuthContext)
  const [troubleTicket, setTroubleTicket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch TroubleTicket data
  useEffect(() => {
    const fetchTroubleTicket = async () => {
      try {
        const response = await axiosInstance.get(`api/member/getTroubleTicketByMemberId/${memberDetails.id}`);
        if (memberDetails.role === 'supportmember' || memberDetails.role === 'salemember') {
          const TroubleTicket = response.data.troubletickets.filter(ticket => ticket.supportEngineer === 'NOC CloudQlobe')
          setTroubleTicket(TroubleTicket);
        }
      } catch (error) {
        console.error("Error fetching troubleTicket:", error);
        toast.error('Failed to fetch trouble tickets');
      }
    };
    fetchTroubleTicket();
}, [memberDetails.id, memberDetails.role]);

  // Filter Trouble Ticket data
  const filteredTickets = troubleTicket.filter((item) =>
    (filterStatus === 'All' || item.status.toLowerCase() === filterStatus.toLowerCase()) &&
    (item.ticketCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerId?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalTickets = troubleTicket.length;
  const liveTickets = troubleTicket.filter((ticket) => ticket.status.toLowerCase() === 'In Progress').length;

  const handlePickupData = async (troubleTicketId) => {
    try {
      setLoading(true);
      const supportEngineer = memberDetails.name;

      // Update the ticket on the server
      await axiosInstance.put(`api/member/updateMemberTicket/${memberDetails.id}`, { troubleTicketId });
      await axiosInstance.put(`api/member/troubleticket/${troubleTicketId}`, { supportEngineer });

      // Update the local state to remove the picked up ticket
      setTroubleTicket(prevTickets =>
        prevTickets.filter(ticket => ticket.id !== troubleTicketId)
      );

      toast.success('Ticket picked up successfully!');
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error('Failed to pick up ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8 text-gray-900 min-h-screen">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <FaServicestack className="text-6xl text-orange-500" />
            <h2 className="text-4xl text-gray-600">Trouble Tickets</h2>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="flex justify-between mb-6">
          <div className="flex-1 mr-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <h3 className="text-lg font-semibold">Total Tickets</h3>
            <p className="text-4xl font-bold mt-2">{totalTickets}</p>
          </div>
          <div className="flex-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <h3 className="text-lg font-semibold">Live Tickets</h3>
            <p className="text-4xl font-bold mt-2">{liveTickets}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex items-center space-x-4">
            <input
              type="text"
              className="px-4 py-2 rounded-lg border shadow w-64 focus:outline-none"
              placeholder="Search by issue or customerId..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="px-4 py-2 rounded-lg border shadow focus:outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 flex items-center"
              onClick={() => navigate('/member/support/createTickets')}
            >
              <FaPlus className="mr-2" /> Create Ticket
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-yellow-300">
                <th className="border px-5 py-3 text-left">Customer ID</th>
                <th className="border px-5 py-3 text-left">Account Manager</th>
                <th className="border px-5 py-3 text-left">Issues</th>
                <th className="border px-5 py-3 text-left">Support Engineer</th>
                <th className="border px-5 py-3 text-left">Status</th>
                <th className="border px-5 py-3 text-left">Priority</th>
                {["supportmember"].includes(memberDetails.role) && (
                  <th className="border px-5 py-3 text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-600">
                    Loading...
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-600">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  return (
                    <tr key={ticket.id} className="hover:bg-gray-100">
                      <td className="border px-6 py-3">{ticket.customerId || 'N/A'}</td>
                      <td className="border px-6 py-3">{ticket.accountManager || 'N/A'}</td>
                      <td className="border px-6 py-3">{ticket.ticketCategory || 'N/A'}</td>
                      <td className="border px-6 py-3">{ticket.supportEngineer || 'N/A'}</td>
                      <td className="border px-6 py-3">{ticket.status || 'N/A'}</td>
                      <td className="border px-6 py-3">{ticket.ticketPriority || 'N/A'}</td>
                      {["supportmember"].includes(memberDetails.role) && (
                        <td className="border px-6 py-3 space-x-2">
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded-lg shadow hover:bg-green-600 disabled:bg-gray-400"
                            onClick={() => handlePickupData(ticket.id)}
                            disabled={loading}
                          >
                            {loading ? 'Processing...' : 'Pickup'}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default TroubleTicket;