import React, { useState, useEffect, useRef, useContext } from "react";
import { SlCalender } from "react-icons/sl";
import { LuCircleDollarSign } from "react-icons/lu";
import { IoMdSend } from "react-icons/io";
import { AiFillInteraction } from "react-icons/ai";
import { FaClipboardList, FaEnvelope, FaTags, FaRegCalendarAlt, FaClock } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import AuthContext from "../../../../../context/AuthContext";
import axiosInstance from "../../../../../utils/axiosinstance";

const FollowUpTab = ({ customerId }) => {
  const { memberDetails } = useContext(AuthContext);
  const [followups, setFollowups] = useState([]);
  const [noteData, setNoteData] = useState([]);
  const [customerData, setCustomerData] = useState();
  const [newFollowUp, setNewFollowUp] = useState({
    customerId: customerId,
    companyId: '',
    companyName: '',
    followupDescription: '',
    followupMethod: "call",
    followupStatus: "Pending",
    followupCategory: "Carrier",
    followupTime: '',
    followupDate: '',
    memberId: memberDetails.id
  });
  const [quickNote, setQuickNote] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const followUpRef = useRef(null);

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const response = await axiosInstance.get(`api/member/customerfollowups/${customerId}`);
        const noteResponse = await axiosInstance.get(`api/member/customernotes/${customerId}`);
        const customerResponse = await axiosInstance.get(`api/customer/${customerId}`);

        setFollowups(response.data.followups);
        setNoteData(noteResponse.data.notes);
        setCustomerData(customerResponse.data.customer);

        setNewFollowUp((prev) => ({
          ...prev,
          companyName: customerResponse.data.customer.companyName,
          companyId: customerResponse.data.customer.customerId,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollow();
  }, [customerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFollowUp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFollowUp = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("api/member/createcustomerfollowups", newFollowUp);
      setFollowups((prev) => [...prev, newFollowUp]);
      setNewFollowUp({
        customerId: customerId,
        companyName: customerData.companyName,
        companyId: customerData.customerId,
        followupDescription: "",
        followupMethod: "",
        followupCategory: "",
        followupTime: "",
        followupDate: "",
        memberId: memberDetails.id
      });
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error saving follow-up:", error);
      toast.error("Failed to save follow-up. Please try again.");
    }
  };

  const handleQuickNoteSubmit = async () => {
    if (!quickNote.trim()) return;

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().slice(0, 5);

    const NoteData = {
      userId: customerId,
      note: quickNote,
      time: timeStr,
      date: dateStr,
      memberId: memberDetails.id
    };

    try {
      await axiosInstance.post("api/member/createcustomernotes", NoteData);
      setNoteData((prev) => [...prev, NoteData]);
      setQuickNote("");
      toast.success("Note added successfully.");
    } catch (error) {
      console.error("Error saving quick note:", error);
      toast.error("Failed to save note. Please try again.");
    }
  };

  const handleClockButtonClick = () => {
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  // Merge and sort notes and followups
  const mergedEntries = [
    ...followups.map(f => ({ ...f, type: "followup" })),
    ...noteData.map(n => ({ ...n, type: "note" }))
  ].sort((a, b) => {
    const dateA = new Date((a.date || a.followupDate) + "T" + (a.time || a.followupTime));
    const dateB = new Date((b.date || b.followupDate) + "T" + (b.time || b.followupTime));
    return dateA - dateB;
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-1/2 p-6 flex items-center justify-center">
        <img
          src="/member/adminlLeadFollowUp.jpg"
          alt="Follow-up Illustration"
          className="w-full h-auto"
        />
      </div>

      <div className="w-1/2 bg-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-500 flex items-center">
            <LuCircleDollarSign className="text-orange-300 mr-2 text-5xl" />
            {customerData?.companyName}
          </h2>
          <button
            onClick={handleClockButtonClick}
            className="text-blue-500 p-3 rounded-lg flex items-center justify-center"
          >
            <SlCalender className="mr-2 text-4xl" />
          </button>
        </div>

        <div className="bg-white rounded-lg overflow-hidden flex-grow flex flex-col-reverse mb-8 shadow-sm">
          <div className="p-6 space-y-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
            {mergedEntries.length > 0 ? (
              mergedEntries.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className={`flex-grow p-5 rounded-lg ${entry.type === 'note' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                    <div className="flex items-center space-x-2">
                      {entry.type === "note" ? (
                        <FaClipboardList className="text-yellow-600 text-lg" />
                      ) : (
                        <LuCircleDollarSign className="text-indigo-600 text-lg" />
                      )}
                      <p className="font-medium text-gray-800">
                        {entry.type === 'note' ? entry.note : entry.followupDescription}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      <span>{new Date(entry.date || entry.followupDate).toLocaleDateString()} </span>
                      <span>{entry.time || entry.followupTime}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No notes or follow-ups available</div>
            )}
            <div ref={followUpRef}></div>
          </div>
        </div>

        {isFormVisible && (
          <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center z-10">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <AiFillInteraction className="text-blue-500 mr-3 text-5xl" />
                Follow-Up Information
              </h3>
              <form className="space-y-4" onSubmit={handleAddFollowUp}>
                <div className="flex items-center space-x-4">
                  <div className="w-1/2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaClipboardList className="mr-2 text-lg" />
                      Follow-Up Description
                    </label>
                    <input
                      name="followupDescription"
                      type="text"
                      className="p-3 border rounded-lg w-full"
                      placeholder="Enter description"
                      value={newFollowUp.followupDescription}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaEnvelope className="mr-2 text-lg" />
                      Follow-Up Method
                    </label>
                    <select
                      name="followupMethod"
                      className="p-3 border rounded-lg w-full"
                      value={newFollowUp.followupMethod}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Method</option>
                      <option value="email">Email</option>
                      <option value="call">Call</option>
                      <option value="chat">Chat</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-1/2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaTags className="mr-2 text-lg" />
                      Follow-Up Category
                    </label>
                    <select
                      name="followupCategory"
                      className="p-3 border rounded-lg w-full"
                      value={newFollowUp.followupCategory}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Category</option>
                      <option value="Lead">Lead</option>
                      <option value="Sales">Sales</option>
                      <option value="Carrier">Carrier</option>
                      <option value="Account">Account</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaRegCalendarAlt className="mr-2 text-lg" />
                      Date
                    </label>
                    <input
                      name="followupDate"
                      type="date"
                      className="p-3 border rounded-lg w-full"
                      value={newFollowUp.followupDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex justify-center items-center space-x-4">
                  <div className="w-1/2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaClock className="mr-2 text-lg" />
                      Time
                    </label>
                    <input
                      name="followupTime"
                      type="time"
                      className="p-3 border rounded-lg w-full"
                      value={newFollowUp.followupTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="submit"
                    className="bg-orange-500 text-white py-2 px-5 rounded-lg"
                  >
                    Add Follow-Up
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white py-2 px-5 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4 mt-6">
          <textarea
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="Type your note..."
            className="flex-grow h-12 p-4 bg-white rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            onClick={handleQuickNoteSubmit}
            className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full shadow-md hover:from-green-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-transform transform hover:scale-110 flex items-center justify-center"
          >
            <IoMdSend className="text-xl" />
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FollowUpTab;
