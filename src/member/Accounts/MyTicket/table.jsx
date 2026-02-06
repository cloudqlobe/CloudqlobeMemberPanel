import React from "react";
import { FaPlusCircle, FaTimes } from 'react-icons/fa';

const RequestsTable = ({ activeCategory, filteredRequests, handlePickupClick, handleViewClick }) => {
    return (
        <div className="bg-white p-6 shadow-lg rounded-lg">
            <table className="min-w-full bg-white">
                <thead className="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center">
                    {activeCategory === "Recharge Request" && (
                        <tr>
                            <th className="p-2">Company Name</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Payment Time</th>
                            <th className="p-2">Reference No</th>
                            <th className="p-2">Account Agent</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Action</th>
                        </tr>
                    )}
                    {activeCategory === "Vendor Payment" && (
                        <tr>
                            <th className="p-2">Carrier ID</th>
                            <th className="p-2">Account Manager</th>
                            <th className="p-2">Service Category</th>
                            <th className="p-2">Account Associate</th>
                            <th className="p-2">Carrier Type</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Action</th>
                        </tr>
                    )}
                    {activeCategory === "Private Rate" && (
                        <tr>
                            <th className="p-2">Carrier ID</th>
                            <th className="p-2">Account Manager</th>
                            <th className="p-2">Service Category</th>
                            <th className="p-2">Account Associate</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    )}
                    {activeCategory === "Overdraft" && (
                        <tr>
                            <th className="p-2">Customer ID</th>
                            <th className="p-2">Account Manager</th>
                            <th className="p-2">Client Type</th>
                            <th className="p-2">Reason</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Action</th>
                        </tr>
                    )}
                </thead>
                <tbody>
                    {activeCategory === "Recharge Request" &&
                        filteredRequests.map((payment, index) => (
                            <tr key={index} className="bg-gray-100">
                                <td className="p-2">{payment?.companyName}</td>
                                <td className="p-2">${payment.amount}</td>
                                <td className="p-2">{new Date(payment.dateAndTime).toLocaleString()}</td>
                                <td className="p-2">{payment.referenceNo}</td>
                                <td className="p-2">{payment.accountAgent}</td>
                                <td className="p-2">{payment.transactionStatus}</td>
                                <td className="p-2 text-right">
                                    <div className="flex justify-end">
                                        <button

                                            className="px-4 py-2 w-36 bg-blue-500 text-white flex items-center justify-center rounded-md"
                                            onClick={() => handlePickupClick(payment)} // Pass the payment data
                                        >
                                            <FaPlusCircle className="mr-2" />
                                            Pickup
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                    {activeCategory === "Vendor Payment" &&

                        filteredRequests.map((request, index) => (
                            <tr key={request._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                <td className="p-2">{request.carrierId}</td>
                                <td className="p-2 text-center">{request.accountManager}</td>
                                <td className="p-2 text-center">{request.serviceCategory}</td>
                                <td className="p-2">{request.accountAssociate}</td>
                                <td className="p-2">{request.carrierType}</td>
                                <td className="p-2">{request.status}</td>
                                <td className="p-2 text-right flex justify-end space-x-2">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white flex items-center rounded-md"
                                        onClick={() => handlePickupClick(request)} // Pass the payment data
                                    >
                                        Pickup
                                    </button>
                                </td>
                            </tr>
                        ))
                    }

                    {activeCategory === "Private Rate" &&

                        filteredRequests.map((request, index) => (
                            <tr key={request.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                <td className="p-2">{request.companyId}</td>
                                <td className="p-2">{request.account_manager}</td>
                                <td className="p-2">{request.service_category}</td>
                                <td className="p-2">{request.account_associate}</td>
                                <td className="p-2">{request.status}</td>
                                <td className="p-2 flex justify-end space-x-2">
                                    <button
                                        onClick={() => handleViewClick(request)}
                                        className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handlePickupClick(request)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                    >
                                        Pickup
                                    </button>
                                </td>
                            </tr>
                        ))
                    }

                    {activeCategory === "Overdraft" &&
                        filteredRequests.map(request => (
                            <tr key={request._id} className="bg-gray-100">
                                <td className="p-2">{request.customerId}</td>
                                <td className="p-2">{request.accountManager}</td>
                                <td className="p-2">{request.clientType}</td>
                                <td className="p-2">{request.reason}</td>
                                <td className="p-2">${request.amount}</td>
                                <td className="p-2">{request.status}</td>
                                <td className="p-2 text-right">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handlePickupClick(request)}
                                            className="px-4 py-2 w-36 bg-blue-500 text-white flex items-center justify-center rounded-md"
                                        >
                                            <FaPlusCircle className="mr-2" />
                                            Pickup
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
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

const ViewTable = ({ showViewModal, setShowViewModal, selectedRequest }) => {

    return (
        <>
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
                            <button
                                className={`px-4 py-2 rounded-md bg-blue-400 text-white`}
                            >
                                {selectedRequest.service_category === "CCPrivateRate Routes" ? "CC Routes" : "CLI Routes"}
                            </button>
                        </div>

                        {selectedRequest.service_category === "CCPrivateRate Routes" && selectedRequest.filteredRates?.length > 0 && (
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

                        {selectedRequest.service_category === "CLIPrivateRate Routes" && selectedRequest.filteredRates?.length > 0 && (
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

                        {(!selectedRequest.filteredRates || selectedRequest.filteredRates.length === 0) && (
                            <div className="text-center py-4">
                                No rates found for this selection.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export {
    RequestsTable,
    PickupTable,
    ViewTable
};