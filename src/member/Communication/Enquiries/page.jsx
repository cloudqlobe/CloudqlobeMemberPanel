import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../layout/page';
import { FaSearch } from 'react-icons/fa';
import { TiStarburst } from "react-icons/ti"; // Import the icon you prefer
import axiosInstance from '../../../utils/axiosinstance';
import { toast, ToastContainer } from "react-toastify";
import AuthContext from '../../../context/AuthContext';

const EnquiryPage = () => {
  const { memberDetails } = useContext(AuthContext)
  const [enquiryData, setEnquiryData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (memberDetails.role === "leadmember") {
          const response = await axiosInstance.get('api/member/enquiry');

          const filteredEnquiry = response.data.enquirys.filter(
            (item) => item.serviceEngineer === "NOC Cloudqlobe"
          );

          setEnquiryData(filteredEnquiry);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [memberDetails?.id, memberDetails.role]);

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
      const enquiryId = id;
      const serviceEngineer = memberDetails.name;

      await axiosInstance.put(`api/member/updateMemberEnquiryId/${memberDetails.id}`, { enquiryId });

      await axiosInstance.put(`api/member/enquiry/${enquiryId}`, { serviceEngineer });

      setEnquiryData((prevEnquiryData) =>
        prevEnquiryData.filter((enquiry) => enquiry.id !== id)
      );
      toast.success("Enquiry picked up successfully!");
    } catch (error) {
      toast.error("Failed to pick up test");
      console.error("Error updating member:", error);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-50 text-gray-800">
        <ToastContainer position="top-right" autoClose={5000} />
        {/* Enquiry Details Heading with Icon */}
        <div className="flex items-center mb-4">
          <FaSearch className="text-blue-500 mr-2" size={24} />
          <h2 className="text-2xl font-bold">Enquiry Details</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-[#005F73]  text-white">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Company Name</th>
                <th className="py-2 px-4">Contact Number</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {enquiryData.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-100 transition duration-200 text-center">
                  <td className="py-2 px-4">{enquiry.name}</td>
                  <td className="py-2 px-4">{enquiry.companyName}</td>
                  <td className="py-2 px-4">{enquiry.contactNumber}</td>
                  <td className="py-2 px-4">{enquiry.email}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => openModal(enquiry.notes)}
                    >
                      View
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handlePickupData(enquiry.id)}
                    >
                      Pickup
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for showing enquiry description only */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center">
            <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-2xl transform transition-transform scale-110 w-2/2 h-2/4">
              <div className="flex flex-col space-y-8 h-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <TiStarburst className="text-yellow-500 mr-3 text-5xl" />
                    Enquiry Details
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-800 text-3xl focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-inner flex-grow">
                  <p className="text-gray-600 text-lg">
                    <strong>Description:</strong> {selectedEnquiry}
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
          </div>
        )}

      </div>
    </Layout>
  );
};

export default EnquiryPage;