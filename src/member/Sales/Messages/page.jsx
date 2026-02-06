import React, { useState, useEffect, useContext } from "react";
import Layout from "../../layout/page";
import { FaReply, FaUserCircle, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import AuthContext from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosinstance";

const SaleMessage = () => {
  const { memberDetails } = useContext(AuthContext);

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  /* ---------------- FETCH ALL MESSAGES ---------------- */
  useEffect(() => {
    fetchMessages();
  }, []);

  /* ---------------- FETCH MESSAGES ---------------- */
  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get("api/member/getSalesMessage");
      const allMessages = res.data;

      // sort by sent_time
      allMessages.sort(
        (a, b) => new Date(a.sent_time) - new Date(b.sent_time)
      );

      setMessages(allMessages);

      const lastMessageMap = new Map();
      const unreadMap = {};

      allMessages.forEach((msg) => {
        const contactRole =
          msg.chat_from === "Sales" ? msg.chat_to : msg.chat_from;

        // last message per contact
        if (
          !lastMessageMap.has(contactRole) ||
          new Date(msg.sent_time) >
            new Date(lastMessageMap.get(contactRole).sent_time)
        ) {
          lastMessageMap.set(contactRole, msg);
        }

        // unread count
        if (msg.read_status === 0 && msg.chat_to === "Sales") {
          unreadMap[contactRole] = (unreadMap[contactRole] || 0) + 1;
        }
      });

      setContacts(
        [...lastMessageMap.keys()].map((role) => ({
          role,
          ...lastMessageMap.get(role),
        }))
      );

      setUnreadCounts(unreadMap);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  /* ---------------- FILTERED CHAT ---------------- */
  const filteredMessages = messages.filter(
    (msg) =>
      selectedContact &&
      (msg.chat_from === selectedContact.role ||
        msg.chat_to === selectedContact.role)
  );

  /* ---------------- MARK AS READ ---------------- */
  const markMessagesAsRead = async (contact) => {
    try {
      await axiosInstance.put("api/member/markAsRead", {
        sender_id: contact.sender_id,
      });

      setUnreadCounts((prev) => ({ ...prev, [contact.role]: 0 }));

      setMessages((prev) =>
        prev.map((msg) =>
          msg.chat_from === contact.role && msg.chat_to === "Sales"
            ? { ...msg, read_status: 1 }
            : msg
        )
      );
    } catch (err) {
      console.error("Read error:", err);
    }
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const payload = {
      sender: memberDetails.name,
      sender_id: memberDetails.id,
      receiver: selectedContact.sender,
      receiver_id: selectedContact.sender_id,
      message: newMessage,
      chat_from: "Sales",
      chat_to: selectedContact.role,
    };

    try {
      const res = await axiosInstance.post(
        "api/member/createMessage",
        payload
      );

      // backend must return inserted row
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  /* ---------------- DELETE CONFIRM ---------------- */
  const confirmMessage = async () => {
    if (!confirmationMessage) return;

    try {
      await axiosInstance.delete(
        `api/member/deleteMessage/${confirmationMessage.id}`
      );

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== confirmationMessage.id)
      );
      setConfirmationMessage(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ===================== UI ===================== */
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-3">
          <h1 className="text-4xl font-bold text-gray-600 mb-3 text-center flex items-center justify-center">
            <MdMessage className="mr-2 text-blue-500" /> Message Box
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* ---------------- CONTACT LIST ---------------- */}
            <div className="bg-white shadow-xl p-4">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                Chats <FaPlus className="ml-2 text-blue-500" />
              </h2>

              <ul>
                {contacts
                  .filter((c) => c.role !== "Sales")
                  .map((contact) => (
                    <li
                      key={contact.role}
                      onClick={() => {
                        setSelectedContact(contact);
                        markMessagesAsRead(contact);
                      }}
                      className="p-3 mb-2 bg-gray-50 hover:bg-blue-100 cursor-pointer flex items-center space-x-3"
                    >
                      <FaUserCircle className="text-3xl text-gray-500" />
                      <div className="flex-1">
                        <h3 className="font-medium">{contact.role}</h3>
                        <p className="text-xs text-gray-500 truncate">
                          {contact.message}
                        </p>
                      </div>
                      {unreadCounts[contact.role] > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCounts[contact.role]}
                        </span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>

            {/* ---------------- CHAT WINDOW ---------------- */}
            <div className="bg-white shadow-xl p-4 lg:col-span-2 flex flex-col h-[600px]">
              {selectedContact ? (
                <>
                  <div className="flex-1 overflow-y-auto bg-gray-50 p-3 rounded mb-2">
                    {filteredMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-3 ${
                          msg.sender_id === memberDetails.id
                            ? "text-right"
                            : ""
                        }`}
                      >
                        <div
                          className={`inline-block p-3 rounded-xl shadow w-3/4 ${
                            msg.sender_id === memberDetails.id
                              ? "bg-green-100 ml-auto"
                              : "bg-blue-100"
                          }`}
                        >
                          <p>{msg.message}</p>
                          <span className="block text-xs text-gray-500 mt-1">
                            {new Date(msg.sent_time).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ---------------- INPUT ---------------- */}
                  <div className="flex space-x-2">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message ${selectedContact.role}...`}
                      className="flex-1 p-3 border rounded"
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-blue-500 text-white px-4 rounded flex items-center"
                    >
                      <FaReply className="mr-1" /> Send
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500">
                  Select a contact to start chatting
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- CONFIRM POPUP ---------------- */}
      {confirmationMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-5 rounded shadow text-center">
            <p>Delete this message?</p>
            <div className="flex justify-center space-x-4 mt-4">
              <FaCheck
                className="text-green-500 text-2xl cursor-pointer"
                onClick={confirmMessage}
              />
              <FaTimes
                className="text-red-500 text-2xl cursor-pointer"
                onClick={() => setConfirmationMessage(null)}
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SaleMessage;
