import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../layout/page';
import { MdOutlineSearch } from 'react-icons/md';
import { TbSquareRoundedFilled } from "react-icons/tb"; // Importing the icon
import axiosInstance from '../../../utils/axiosinstance';
import { toast, ToastContainer } from "react-toastify";
import AuthContext from '../../../context/AuthContext';

const Didnumberenquiery = () => {
  const { memberDetails } = useContext(AuthContext)
  const [didEnquiryData, setDidEnquiryData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        if (memberDetails.role === "leadmember") {
          const response = await axiosInstance.get('api/member/didNumber')
          
          const filteredEnquiry = response.data.didnumbers.filter(
            (item) => item.serviceEngineer === "NOC Cloudqlobe"
          );
          setDidEnquiryData(filteredEnquiry)

        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData()
  }, [memberDetails.id, memberDetails.role])

  const openModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEnquiry(null);
  };

  const handlePickupData = async (id) => {
    try {
      const didId = id;
      const serviceEngineer = memberDetails.name;

      await axiosInstance.put(`api/member/updateMemberDIDId/${memberDetails.id}`, { didId });

      await axiosInstance.put(`api/member/did/${didId}`, { serviceEngineer });

      setDidEnquiryData((prevEnquiryData) =>
        prevEnquiryData.filter((did) => did.id !== id)
      );
      toast.success("DID picked up successfully!");

    } catch (error) {
      toast.error("Failed to pick up");
      console.error("Error updating member:", error);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 text-gray-800">
        <ToastContainer position="top-right" autoClose={5000} />
        {/* Table Heading with Icon */}
        <div className="flex items-center mb-6">
          <MdOutlineSearch className="h-8 w-8 text-teal-500 mr-3" />
          <h2 className="text-3xl font-semibold text-gray-800">DID Enquiries</h2>
        </div>

        {/* Table for DID Enquiries */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-indigo-500 text-white">
              <tr>
                <th className="py-3 px-4 text-sm font-medium">Name</th>
                <th className="py-3 px-4 text-sm font-medium">Company</th>
                <th className="py-3 px-4 text-sm font-medium">Email</th>
                <th className="py-3 px-4 text-sm font-medium">Country</th>
                <th className="py-3 px-4 text-sm font-medium">Enquiry Date</th>
                <th className="py-3 px-4 text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {didEnquiryData?.map((data) => (
                <tr key={data.id} className="hover:bg-gray-100 transition duration-200 text-center">
                  <td className="py-3 px-4">{data.name}</td>
                  <td className="py-3 px-4">{data.companyName}</td>
                  <td className="py-3 px-4">{data.email}</td>
                  <td className="py-3 px-4">{data.country}</td>
                  <td className="py-3 px-4">{new Date(data.created_at).toLocaleString()}</td>
                  <td className="py-3 px-4  space-x-2">
                    <button
                      className="bg-orange-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
                      onClick={() => openModal(data)}
                    >
                      View
                    </button>
                    <button
                      className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
                      onClick={() => handlePickupData(data.id)}
                    >
                      Pickup
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Viewing Enquiry Details */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-lg">
              {/* Modal Header with Icon and Close Button */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <TbSquareRoundedFilled className="h-8 w-8 text-teal-500 mr-3" />
                  <h3 className="text-2xl font-semibold text-teal-600">DID Enquiry Details</h3>
                </div>
                <button onClick={closeModal} className="text-gray-500 text-3xl">&times;</button>
              </div>

              {/* Simplified Enquiry Details */}
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
                  <span className="text-sm text-gray-600">{new Date(selectedEnquiry.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Didnumberenquiery;