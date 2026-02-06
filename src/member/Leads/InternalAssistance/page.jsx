import React, { useContext, useState } from "react";
import Layout from "../../layout/page";
import {
  FaComments,
  FaChartLine,
  FaHeadset,
  FaBriefcase,
} from "react-icons/fa";
import { FaReact } from "react-icons/fa6";
import { SiGraphql } from "react-icons/si";
import AuthContext from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosinstance";

/* ================= CATEGORIES ================= */
const categories = [
  { id: 1, name: "Sales", icon: FaChartLine, description: "Assistance with sales-related queries." },
  { id: 2, name: "Marketing", icon: SiGraphql, description: "Get help with marketing generation or management." },
  { id: 3, name: "Accounts", icon: FaBriefcase, description: "Support for account and billing issues." },
  { id: 4, name: "Support", icon: FaHeadset, description: "Technical support and customer service." },
  { id: 5, name: "Carriers", icon: FaComments, description: "Queries related to carriers and partnerships." },
  { id: 6, name: "Software Assistance", icon: FaReact, description: "Queries related to software." },
];

const InternalAssistance = () => {
  const { memberDetails } = useContext(AuthContext);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState("");

  /* ================= HANDLE CATEGORY CLICK ================= */
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setMessage("");
  };

  /* ================= SEND MESSAGE ================= */
  const handleSendMessage = async () => {
    if (!memberDetails || !memberDetails.id || !message.trim() || !selectedCategory) {
      return;
    }

    const payload = {
      sender: memberDetails.name,
      sender_id: memberDetails.id,
      receiver: "Cloudqlobe Team",
      receiver_id: selectedCategory.name, // department-based
      message: message,
      chat_from: "Marketing",
      chat_to: selectedCategory.name,
    };

    try {
      await axiosInstance.post("api/member/createMessage", payload);
      setMessage("");
      alert("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Internal Assistance
          </h1>

          {/* ================= CATEGORY LIST ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`bg-white shadow-lg rounded-lg p-6 cursor-pointer transform transition duration-300 hover:scale-105 ${
                  selectedCategory?.name === category.name
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <category.icon className="text-blue-500 text-5xl" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-700">
                      {category.name}
                    </h2>
                    <p className="text-gray-500">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= MESSAGE BOX ================= */}
          {selectedCategory && (
            <div className="mt-10 p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800">
                Message {selectedCategory.name}
              </h2>
              <p className="text-gray-600 mt-2">
                {selectedCategory.description}
              </p>

              <div className="mt-4">
                <textarea
                  rows="4"
                  placeholder={`Type your message for ${selectedCategory.name}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={handleSendMessage}
                  className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Send Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InternalAssistance;
