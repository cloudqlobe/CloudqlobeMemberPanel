import React, { useState, useEffect, useContext } from "react";
import Layout from "../../layout/page";
import { FaReply, FaUserCircle, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import AuthContext from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosinstance";

const CarriersMessage = () => {
  const { memberDetails } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      markMessagesAsRead(selectedContact)
      fetchMessages();
    }
  }, [selectedContact]);

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get("api/member/getCarriersMessage");
      const allMessages = res.data;
      setMessages(allMessages);

      const uniqueRoles = new Map(); // Map to store unique roles and last messages
      const unreadCountsMap = {}; // Track unread message counts

      allMessages.forEach((msg) => {
        const contactRole = msg.chat_from === "Carriers" ? msg.chat_to : msg.chat_from;

        // Store the last message per contact
        if (!uniqueRoles.has(contactRole) || new Date(msg.timestamp) > new Date(uniqueRoles.get(contactRole).timestamp)) {
          uniqueRoles.set(contactRole, msg);
        }

        // Count unread messages
        if (!msg.read_status && msg.chat_to === "Carriers") {
          unreadCountsMap[contactRole] = (unreadCountsMap[contactRole] || 0) + 1;
        }
      });

      setContacts([...uniqueRoles.keys()].map((role) => ({ role: role, ...uniqueRoles.get(role) })));
      setUnreadCounts(unreadCountsMap);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };


  const filteredMessages = messages.filter(
    (msg) =>
      selectedContact &&
      (msg.chat_from === selectedContact.role || msg.chat_to === selectedContact.role)
  );

  const markMessagesAsRead = async (contactId) => {
    const id = contactId.sender_id

    try {
      await axiosInstance.put("api/member/markAsRead", { id });
      setUnreadCounts((prev) => ({ ...prev, [contactId.role]: 0 }));
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const openReplyModal = (msg) => {
    setReplyToMessage(msg);
    setReplyMessage("");
    setIsReplying(true);
  };

  const openConfirmationPopup = (msg) => {
    if (msg.chat_from === "Carriers") {
      setConfirmationMessage(msg);
    }
  };

  const confirmMessage = async () => {
    if (!confirmationMessage) return;
    try {
      await axiosInstance.delete(`api/member/deleteMessage/${confirmationMessage.id}`);
      setMessages(messages.filter((msg) => msg.id !== confirmationMessage.id));
      setConfirmationMessage(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender: memberDetails.name,
      sender_id: memberDetails.id,
      receiver: selectedContact.sender,
      receiver_id: selectedContact.id,
      message: newMessage,
      chat_from: "Carriers",
      chat_to: selectedContact.role,
      timestamp: new Date().toISOString(), // Add system timestamp
    };

    try {
      await axiosInstance.post("api/member/createMessage", messageData);

      setMessages([...messages, messageData]); // Update UI
      setNewMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendReply = async () => {
    if (!replyMessage.trim() || !replyToMessage) return;

    const replyData = {
      receiver: memberDetails.name,
      receiver_id: memberDetails.id,
      reply_of_message: replyMessage,
      reply_timestamp: new Date().toISOString(),
      message_id: replyToMessage.id,
    };

    try {
      await axiosInstance.put("api/member/messageReply", replyData);
      setMessages(
        messages.map((msg) =>
          msg.id === replyToMessage.id ? { ...msg, reply_of_message: replyMessage, reply_timestamp: replyData.reply_timestamp } : msg
        )
      );
      setIsReplying(false);
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-3">
          <h1 className="text-4xl font-bold text-gray-600 mb-3 text-center flex items-center justify-center">
            <MdMessage className="mr-2 text-blue-500" /> Message Box
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white shadow-2xl p-4 lg:col-span-1">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3 flex items-center">
                Chats <FaPlus className="ml-2 text-blue-500 cursor-pointer" title="Add Contact" />
              </h2>
              <ul>
                {contacts.length > 0 ? (
                  contacts
                    .filter((contacts) => contacts.role !== "Carriers")
                    .map((contact) => (
                      <li
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className={`p-3 mb-2 bg-gray-50 hover:bg-blue-100 cursor-pointer flex items-center space-x-3 ${selectedContact?.id === contact.id ? "bg-blue-200" : ""}`}
                      >
                        <FaUserCircle className="text-gray-500 text-3xl" />
                        <div className="flex-1" onClick={() => markMessagesAsRead(contact)}>
                          <h3 className="font-medium text-gray-800">{contact.role}</h3>
                          <p className="text-sm text-gray-500">{contact.message}</p>
                        </div>
                        {unreadCounts[contact.role] > 0 && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">{unreadCounts[contact.role]}</span>
                        )}
                      </li>
                    ))
                ) : (
                  <p className="text-gray-500">No roles available</p>
                )}
              </ul>
            </div>

            <div className="bg-white shadow-2xl p-4 lg:col-span-2 flex flex-col h-[600px]">
              {selectedContact ? (
                <>
                  <div className="flex-1 bg-gray-50 p-3 rounded-2xl mb-2 overflow-y-auto">
                    {filteredMessages.map((msg, index) => (
                      <div key={index} className={`mb-2 ${msg.sender_id === memberDetails.id ? "text-right" : ""}`}>
                        <div className={`p-3 rounded-2xl shadow-md w-3/4 ${msg.sender_id === memberDetails.id ? "ml-auto bg-green-100" : "bg-blue-100"}`}>
                          <p>{msg.message}</p>
                          {msg.reply_of_message && <p className="text-xs text-gray-700 mt-1">Reply: {msg.reply_of_message}</p>}
                          {!msg.reply_of_message && msg.chat_to === "Carriers" && (<FaReply className="text-gray-600 cursor-pointer mt-1" onClick={() => openReplyModal(msg)} />)}
                          {msg.reply_of_message && msg.chat_from === "Carriers" && (
                            <button className="bg-yellow-500 text-white px-2 py-1 mt-2" onClick={() => openConfirmationPopup(msg)}>Confirm Reply</button>
                          )}
                        </div>
                        <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }} className=" space-x-2">
                    <input
                      rows="2"
                      placeholder={`Message ${selectedContact?.role}...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      style={{ height: "48px" }}
                      onClick={sendMessage}
                      className="bg-blue-500 text-white py-2 px-3 shadow-lg transform transition-transform hover:scale-105 flex items-center"
                    >
                      <FaReply className="mr-1" /> Send
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500">Select a contact to start chatting.</p>
              )}
            </div>
            {/* Input Field */}

          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {isReplying && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-xl mb-3">Reply to: {replyToMessage.message}</h2>
            <textarea className="border w-full p-2" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)}></textarea>
            <button className="bg-blue-500 text-white px-4 py-2 mt-3" onClick={sendReply}>Send Reply</button>
          </div>
        </div>
      )}

      {confirmationMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <p>Is this message correct?</p>
            <div className="flex justify-center space-x-4 mt-3">
              <FaCheck className="text-green-500 text-2xl cursor-pointer" onClick={confirmMessage} />
              <FaTimes className="text-red-500 text-2xl cursor-pointer" onClick={() => setConfirmationMessage(null)} />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CarriersMessage;