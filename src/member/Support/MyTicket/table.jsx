import React, { useState } from "react";
import { SiBitcomet } from "react-icons/si";
import { FaTimes } from 'react-icons/fa';

const RequestsTable = ({ activeCategory, filteredRequests, openModal, handlePickupClick, handleViewTicket }) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center">
          {activeCategory === "Testing Requests" && (
            <tr>
              <th className="py-2 px-4">Customer ID</th>
              <th className="py-2 px-4">Company Name</th>
              <th className="py-2 px-4">Service Engineer</th>
              <th className="py-2 px-4 text-center">Status</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          )}
          {activeCategory === "Trouble Tickets" && (
            <tr>
              <th className="border px-5 py-3 text-left">Customer ID</th>
              <th className="border px-5 py-3 text-left">Account Manager</th>
              <th className="border px-5 py-3 text-left">Issues</th>
              <th className="border px-5 py-3 text-left">Support Engineer</th>
              <th className="border px-5 py-3 text-left">Status</th>
              <th className="border px-5 py-3 text-left">Priority</th>
              <th className="border px-5 py-3 text-left">Actions</th>
            </tr>
          )}
        </thead>

        <tbody>
          {/* Testing Requests Table */}
          {activeCategory === "Testing Requests" ? (
            (filteredRequests?.length > 0 ? (
              filteredRequests.map((data, index) => (
                <tr key={data?.testId || index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center`}>
                  <td className="py-2 px-4">{data?.companyId || "N/A"}</td>
                  <td className="py-2 px-4">{data?.companyName || "N/A"}</td>
                  <td className="py-2 px-4">{data?.serviceEngineer || "NOC CloudQlobe"}</td>
                  <td className="py-2 px-4">{data?.testStatus || "N/A"}</td>
                  <td className="py-2 px-4 text-right">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
                      onClick={() => openModal(data?.id)}
                    >
                      View
                    </button>
                    <button
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                      onClick={() => handlePickupClick(data)}
                    >
                      Pickup
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No Testing Requests Available</td>
              </tr>
            ))
          ) : null}

          {/* Trouble Tickets Table */}
          {activeCategory === "Trouble Tickets" ? (
            (filteredRequests?.length > 0 ? (
              filteredRequests.map((data, index) => (
                <tr key={data?.id || index} className="hover:bg-gray-100">
                  <td className="border px-6 py-3">{data?.companyId || "N/A"}</td>
                  <td className="border px-6 py-3">{data?.accountManager || "N/A"}</td>
                  <td className="border px-6 py-3">{data?.ticketCategory || "N/A"}</td>
                  <td className="border px-6 py-3">{data?.supportEngineer || "N/A"}</td>
                  <td className="border px-6 py-3">{data?.status || "N/A"}</td>
                  <td className="border px-6 py-3">{data?.ticketPriority || "N/A"}</td>
                  <td className="border px-6 py-3 space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-lg shadow hover:bg-green-600"
                      onClick={() => handlePickupClick(data)}
                    >
                      Pickup
                    </button>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-600"
                      onClick={() => handleViewTicket(data)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">No Trouble Tickets Available</td>
              </tr>
            ))
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

const VeiwPage = ({ isModalOpen, selectedRate, closeModal }) => {
  return (
    <>
      {isModalOpen && selectedRate && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-2/3'>
            <div className='flex justify-between items-center mb-4'>
              <div className='flex items-center'>
                <SiBitcomet className='h-6 w-6 text-orange-500 mr-2' />
                <h3 className='text-xl font-default'>
                  Details for {selectedRate.companyName}
                </h3>
              </div>
              <button onClick={closeModal} className='text-gray-500 text-2xl'>
                &times;
              </button>
            </div>
            <div className='max-w-screen-xl mx-auto p-5'>
              <div className='min-w-full bg-white shadow-md rounded-lg'>
                <table className='min-w-full bg-white'>
                  <thead className='bg-indigo-500 text-white'>
                    <tr>
                      <th className='py-2 px-6 text-sm'>Country Code</th>
                      <th className='py-2 px-6 text-sm'>Country</th>
                      <th className='py-2 px-6 text-sm'>Price</th>
                      <th className='py-2 px-6 text-sm'>Description</th>
                      <th className='py-2 px-6 text-sm'>Profile</th>
                      <th className='py-2 px-6 text-sm'>Status</th>
                      <th className='py-2 px-6 text-sm'>Test Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {selectedRate.map((customer, customerIndex) => (
                      <tr
                        key={`${customer._id}-${customer._id}-${customerIndex}`}
                        className={
                          customerIndex % 2 === 0 ? "bg-white" : "bg-gray-100"
                        }>
                        <td className='py-2 px-6 text-sm'>
                          {customer?.countryCode || "N/A"}
                        </td>
                        <td className='py-2 px-6 text-sm'>
                          {customer?.country || "N/A"}
                        </td>
                        <td className='py-2 px-6 text-sm'>
                          {customer?.rate || "N/A"}
                        </td>
                        <td className='py-2 px-6 text-sm'>
                          {customer?.qualityDescription || "N/A"}
                        </td>
                        <td className='py-2 px-6 text-sm'>
                          {customer?.profile || "N/A"}
                        </td>
                        <td className='py-2 px-6 text-sm'>
                          {customer?.status || "N/A"}
                        </td>
                        <td className='py-2 px-6 text-sm'>
                          {customer?.testStatus || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      )}
    </>
  )
}

const PickupTable = ({ showPickupModal, handleCancel, handleUpdateStatus, newStatus, setNewStatus }) => {
  return (
    <>
      {showPickupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white rounded-md p-6 w-1/3">
            <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Change Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="p-2 border rounded-md w-full"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-black rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
const TroubleTicketView = ({
  showModal,
  setShowModal,
  ticket,
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(ticket?.status || '');
setIsUpdatingStatus();
  return (
    <>
      {showModal && ticket && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <FaTimes className="text-2xl" />
            </button>

            <h3 className="text-2xl font-bold mb-6 text-blue-700 border-b pb-2">
              Trouble Ticket Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-700 mb-3">Ticket Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Ticket ID</p>
                      <p className="font-medium">{ticket.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      {isUpdatingStatus ? (
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="border rounded p-1 w-full"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Process">Process</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      ) : (
                        <p className={`font-medium ${ticket.status === 'Completed' ? 'text-green-600' :
                            ticket.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                          {ticket.status}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{ticket.ticketCategory}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Priority</p>
                      <p className={`font-medium ${ticket.ticketPriority === 'high' ? 'text-red-600' :
                          ticket.ticketPriority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                        {ticket.ticketPriority}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created At</p>
                      <p className="font-medium">{new Date(ticket.ticketTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">{new Date(ticket.lastUpdated).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-700 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer ID</p>
                      <p className="font-medium">{ticket.customerId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company ID</p>
                      <p className="font-medium">{ticket.companyId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Manager</p>
                      <p className="font-medium">{ticket.accountManager}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Support Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-700 mb-3">Support Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Support Engineer</p>
                      <p className="font-medium">{ticket.supportEngineer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Follow-up Method</p>
                      <p className="font-medium capitalize">{ticket.followUpMethod}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-700 mb-3">Ticket Description</h4>
                  <div className="bg-white p-3 rounded border border-gray-200 min-h-32">
                    {ticket.ticketDescription || "No description provided"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export {
  VeiwPage,
  RequestsTable,
  PickupTable,
  TroubleTicketView
};