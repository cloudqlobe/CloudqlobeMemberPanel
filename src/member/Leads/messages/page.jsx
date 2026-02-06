import React, { useState, useEffect, useContext } from "react";
import Layout from "../../layout/page";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import AuthContext from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosinstance";

const LeadMessage = () => {
  const { memberDetails } = useContext(AuthContext);

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      markMessagesAsRead(selectedContact);
    }
  }, [selectedContact]);

  /* ================= FETCH MESSAGES ================= */
  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get("api/member/getSalesMessage");
      const allMessages = res.data;
      setMessages(allMessages);

      const uniqueRoles = new Map();
      const unreadMap = {};

      allMessages.forEach((msg) => {
        const role =
          msg.chat_from === "Marketing" ? msg.chat_to : msg.chat_from;

        // Last message per role
        if (
          !uniqueRoles.has(role) ||
          new Date(msg.timestamp) >
            new Date(uniqueRoles.get(role).timestamp)
        ) {
          uniqueRoles.set(role, msg);
        }

        // Unread count
        if (!msg.read_status && msg.chat_to === "Marketing") {
          unreadMap[role] = (unreadMap[role] || 0) + 1;
        }
      });

      setContacts(
        [...uniqueRoles.keys()].map((role) => ({
          role,
          ...uniqueRoles.get(role),
        }))
      );
      setUnreadCounts(unreadMap);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  /* ================= FILTERED CHAT ================= */
  const filteredMessages = messages.filter(
    (msg) =>
      selectedContact &&
      (msg.chat_from === selectedContact.role ||
        msg.chat_to === selectedContact.role)
  );

  /* ================= MARK AS READ ================= */
  const markMessagesAsRead = async (contact) => {
    try {
      await axiosInstance.put("api/member/markAsRead", {
        id: contact.sender_id,
      });

      setUnreadCounts((prev) => ({
        ...prev,
        [contact.role]: 0,
      }));
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const messageData = {
      sender: memberDetails.name,
      sender_id: memberDetails.id,
      receiver: selectedContact.sender,
      receiver_id: selectedContact.sender_id,
      message: newMessage,
      chat_from: "Marketing",
      chat_to: selectedContact.role,
    };

    try {
      const res = await axiosInstance.post(
        "api/member/createMessage",
        messageData
      );

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-3">
          <h1 className="text-4xl font-bold text-gray-600 mb-4 text-center flex items-center justify-center">
            <MdMessage className="mr-2 text-blue-500" />
            Message Box
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* ================= CONTACT LIST ================= */}
            <div className="bg-white shadow-2xl p-4">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3 flex items-center">
                Chats
                <FaPlus className="ml-2 text-blue-500 cursor-pointer" />
              </h2>

              <ul>
                {contacts.length > 0 ? (
                  contacts
                    .filter((c) => c.role !== "Marketing")
                    .map((contact) => (
                      <li
                        key={contact.role}
                        onClick={() => setSelectedContact(contact)}
                        className={`p-3 mb-2 bg-gray-50 hover:bg-blue-100 cursor-pointer flex items-center space-x-3 ${
                          selectedContact?.role === contact.role
                            ? "bg-blue-200"
                            : ""
                        }`}
                      >
                        <FaUserCircle className="text-gray-500 text-3xl" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {contact.role}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {contact.message}
                          </p>
                        </div>
                        {unreadCounts[contact.role] > 0 && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                            {unreadCounts[contact.role]}
                          </span>
                        )}
                      </li>
                    ))
                ) : (
                  <p className="text-gray-500">No chats available</p>
                )}
              </ul>
            </div>

            {/* ================= CHAT WINDOW ================= */}
            <div className="bg-white shadow-2xl p-4 lg:col-span-2 flex flex-col h-[600px]">
              {selectedContact ? (
                <>
                  <div className="flex-1 bg-gray-50 p-3 rounded-xl mb-2 overflow-y-auto">
                    {filteredMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-2 ${
                          msg.sender_id === memberDetails.id
                            ? "text-right"
                            : ""
                        }`}
                      >
                        <div
                          className={`inline-block p-3 rounded-2xl shadow-md max-w-[75%] ${
                            msg.sender_id === memberDetails.id
                              ? "bg-green-100 ml-auto"
                              : "bg-blue-100"
                          }`}
                        >
                          <p>{msg.message}</p>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ================= INPUT ================= */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder={`Message ${selectedContact.role}...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-blue-500 text-white px-4 py-2 shadow-lg hover:scale-105 transition"
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 mt-20">
                  Select a contact to start chatting
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeadMessage;
