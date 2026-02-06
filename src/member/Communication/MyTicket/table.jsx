
const RequestsTable = ({ activeCategory, filteredRequests, openModal, handlePickupClick }) => {
    return (
        <div className="bg-white p-6 shadow-lg rounded-lg">
            <table className="min-w-full bg-white">
                <thead className="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center">
                    {activeCategory === "Enquiry" && (
                        <tr>
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Company Name</th>
                            <th className="py-2 px-4">Contact Number</th>
                            <th className="py-2 px-4">Email</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Action</th>
                        </tr>
                    )}
                    {activeCategory === "DID Numbers" && (
                        <tr>
                            <th className="py-3 px-4 text-sm font-medium">Name</th>
                            <th className="py-3 px-4 text-sm font-medium">Company</th>
                            <th className="py-3 px-4 text-sm font-medium">Email</th>
                            <th className="py-3 px-4 text-sm font-medium">Country</th>
                            <th className="py-3 px-4 text-sm font-medium">Enquiry Date</th>
                            <th className="py-3 px-4 text-sm font-medium">Status</th>
                            <th className="py-3 px-4 text-sm font-medium">Action</th>
                        </tr>
                    )}
                </thead>

                <tbody>
                    {/* Testing Requests Table */}
                    {activeCategory === "Enquiry" ? (
                        (filteredRequests?.length > 0 ? (
                            filteredRequests.map((data, index) => (
                                <tr key={data?.testId || index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center`}>
                                    <td className="py-2 px-4">{data.name}</td>
                                    <td className="py-2 px-4">{data.companyName}</td>
                                    <td className="py-2 px-4">{data.contactNumber}</td>
                                    <td className="py-2 px-4">{data.email}</td>
                                    <td className="py-2 px-4">{data.status}</td>
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
                                <td colSpan="5" className="text-center py-4">No Enquiry Available</td>
                            </tr>
                        ))
                    ) : null}

                    {/* Trouble Tickets Table */}
                    {activeCategory === "DID Numbers" ? (
                        (filteredRequests?.length > 0 ? (
                            filteredRequests.map((data, index) => (
                                <tr key={data?.id || index} className="hover:bg-gray-100 text-center">
                                    <td className="py-3 px-4">{data.name}</td>
                                    <td className="py-3 px-4">{data.companyName}</td>
                                    <td className="py-3 px-4">{data.email}</td>
                                    <td className="py-3 px-4">{data.country}</td>
                                    <td className="py-3 px-4">{new Date(data.created_at).toLocaleString()}</td>
                                    <td className="py-3 px-4">{data.status}</td>
                                    <td className="py-2 px-4 text-right space-x-2">
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded-lg shadow hover:bg-green-600"
                                            onClick={() => handlePickupClick(data)}
                                        >
                                            Pickup
                                        </button>
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-600"
                                            onClick={() => openModal(data?.id)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No DID Numbers Available</td>
                            </tr>
                        ))
                    ) : null}
                </tbody>
            </table>
        </div>
    );
};

export default RequestsTable;


const ViewPage = ({ isModalOpen, selectedEnquiry, activeCategory, closeModal }) => {
    if (!isModalOpen || !selectedEnquiry) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center">
        {activeCategory === "DID Numbers" ? (
          <div className="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-lg">
            {/* Modal Header with Icon and Close Button */}
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-semibold text-teal-600">DID Enquiry Details</h3>
              <button onClick={closeModal} className="text-gray-500 text-3xl">&times;</button>
            </div>
  
            {/* Enquiry Details */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Contact Number:</span>
                <span className="text-sm text-gray-600">{selectedEnquiry.contactNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Number of Users:</span>
                <span className="text-sm text-gray-600">{selectedEnquiry.noOfUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Number of DIDs:</span>
                <span className="text-sm text-gray-600">{selectedEnquiry.noOfDID}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Time Zone:</span>
                <span className="text-sm text-gray-600">{selectedEnquiry.timeZone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Country:</span>
                <span className="text-sm text-gray-600">{selectedEnquiry.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Enquiry Date:</span>
                <span className="text-sm text-gray-600">
                  {new Date(selectedEnquiry.created_at).toLocaleString()}
                </span>
              </div>
            </div>
  
            {/* Modal Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600" onClick={closeModal}>
                Close
              </button>
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                onClick={() => alert("Further actions can be done here")}
              >
                Take Action
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-2xl w-2/2 h-2/4">
            <div className="flex flex-col space-y-8 h-full">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Enquiry Details</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 text-3xl focus:outline-none">
                  &times;
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-inner flex-grow">
                <p className="text-gray-600 text-lg">
                  <strong>Description:</strong> {selectedEnquiry.notes}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transform transition-transform hover:scale-105 focus:outline-none"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  

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

export {
    ViewPage,
    RequestsTable,
    PickupTable
};