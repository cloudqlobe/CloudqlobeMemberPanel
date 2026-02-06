import React, { useContext, useEffect, useState, useRef } from 'react';
import Layout from '../../layout/page';
import { FaReply, FaUserCircle, FaCircle, FaPlus, FaEllipsisV, FaCheck, FaCheckDouble } from 'react-icons/fa';
import AuthContext from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosinstance';

const ChatPanel = () => {
  const { memberDetails } = useContext(AuthContext);
  const [selectedContact, setSelectedContact] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages, selectedContact]);
  

useEffect(() => {
  const processContactsAndUnreads = (messagesData) => {
    const uniqueContacts = {};
    const counts = {};
    
    messagesData.forEach(msg => {
      if (msg.sender_type === 'user' && msg.customer_id && !uniqueContacts[msg.customer_id]) {
        uniqueContacts[msg.customer_id] = {
          id: msg.customer_id,
          name: msg.customer_name || 'Unknown',
          lastMessage: msg.message,
          time: msg.sending_time,
          formattedTime: formatTime(msg.sending_time),
          avatar: `https://i.pravatar.cc/100?u=${msg.customer_id}`,
          online: false,
          latestMessageTime: new Date(msg.sending_time).getTime(),
          hasUnread: msg.status === 'sent' && msg.sender_type === 'user'
        };
      } else if (msg.sender_type === 'user' && msg.customer_id) {
        const currentTime = new Date(msg.sending_time).getTime();
        if (currentTime > uniqueContacts[msg.customer_id].latestMessageTime) {
          uniqueContacts[msg.customer_id].lastMessage = msg.message;
          uniqueContacts[msg.customer_id].time = msg.sending_time;
          uniqueContacts[msg.customer_id].formattedTime = formatTime(msg.sending_time);
          uniqueContacts[msg.customer_id].latestMessageTime = currentTime;
          uniqueContacts[msg.customer_id].hasUnread = msg.status === 'sent' && msg.sender_type === 'user';
        }
      }

      if (msg.sender_type === 'user' && msg.status === 'sent') {
        counts[msg.customer_id] = (counts[msg.customer_id] || 0) + 1;
      }
    });

    const sortedContacts = Object.values(uniqueContacts).sort((a, b) => b.latestMessageTime - a.latestMessageTime);
    setContacts(sortedContacts);
    setUnreadCounts(counts);

    if (!selectedContact && sortedContacts.length > 0) {
      setSelectedContact(sortedContacts[0]);
      markMessagesAsRead(sortedContacts[0].id);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('api/member/chat/messages');
      const messagesData = response.data.chatbot_messages || [];
      setMessages(messagesData);
      processContactsAndUnreads(messagesData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  fetchData();
  const interval = setInterval(fetchData, 30000);
  return () => clearInterval(interval);

}, [selectedContact]);


  const markMessagesAsRead = async (contactId) => {
    
    try {
      // Update local state first
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.customer_id === contactId && 
          msg.status === 'sent' && 
          msg.sender_type === 'user'
            ? { ...msg, status: 'read' }
            : msg
        )
      );
      
      // Update unread counts
      setUnreadCounts(prev => {
        const newCounts = { ...prev };
        delete newCounts[contactId];
        return newCounts;
      });
      
      // API call to update status
      await axiosInstance.patch('api/member/chat/messages/read', {
        customer_id: contactId,
        status:"read"
      });
      
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach(msg => {
      const date = formatDate(msg.sending_time);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(msg);
    });
    return grouped;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedContact) return;
    
    try {
      const newMessage = {
        customer_id: selectedContact.id,
        message: inputMessage,
        customer_name: selectedContact.name,
        sender_id: memberDetails?.id || 'member',
        sender_type: 'agent', // Set sender_type to agent for  messages
      };

      // Optimistic update
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');

      // Send to API
      await axiosInstance.post('api/member/chat/create', newMessage);
      
      // Refresh messages
      const response = await axiosInstance.get('api/member/chat/messages');
      setMessages(response.data.chatbot_messages || []);
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

    const renderMessage = (message) => {
      const isAgent = message.sender_type === 'agent';
      return (
        <div 
          key={message._id} 
          className={`flex mb-4 ${isAgent ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex max-w-xs lg:max-w-md ${isAgent ? 'flex-row-reverse' : ''}`}>
            {!isAgent && (
              <img 
                src={`https://i.pravatar.cc/100?u=${message.customer_id}`} 
                alt={message.customer_name} 
                className="w-8 h-8 rounded-full mr-2 mt-1" 
              />
            )}
            <div>
              <div 
                className={`p-3 rounded-lg ${isAgent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                <p>{message.message}</p>
              </div>
              <div className={`text-xs text-gray-500 mt-1 flex items-center ${isAgent ? 'justify-end' : 'justify-start'}`}>
                <span>{formatTime(message.sending_time)}</span>
                {isAgent && (
                  <span className="ml-1">
                    {message.status === 'read' ? (
                      <FaCheckDouble className="text-blue-300 inline" />
                    ) : message.status === 'delivered' ? (
                      <FaCheckDouble className="text-gray-400 inline" />
                    ) : (
                      <FaCheck className="text-gray-400 inline" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

  const getContactMessages = (contactId) => {
    return messages
      .filter(msg => msg.customer_id === contactId)
      .sort((a, b) => new Date(a.sending_time) - new Date(b.sending_time));
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    markMessagesAsRead(contact.id);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Chat Panel</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contacts List */}
            <div className="bg-white shadow-lg rounded-lg p-6 lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                Contacts
                <FaPlus className="ml-2 text-blue-500 cursor-pointer" title="Add Contact" />
              </h2>
              <ul>
                {contacts.map((contact) => (
                  <li
                    key={contact.id}
                    onClick={() => handleContactSelect(contact)}
                    className={`p-4 mb-4 bg-gray-50 hover:bg-blue-100 rounded-lg cursor-pointer flex items-center space-x-4 ${selectedContact?.id === contact.id ? 'bg-blue-100' : ''}`}
                  >
                    <div className="relative">
                      <img src={contact.avatar} alt={contact.name} className="w-16 h-16 rounded-full" />
                      <FaCircle className={`absolute bottom-0 right-0 text-sm ${contact.online ? 'text-green-500' : 'text-gray-400'}`} />
                      {unreadCounts[contact.id] > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCounts[contact.id]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-800">{contact.name}</h3>
                        <span className="text-xs text-gray-500">{contact.formattedTime}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chat Section */}
            <div className="bg-white shadow-lg rounded-lg p-6 lg:col-span-2 flex flex-col h-[500px]">
             {selectedContact ? (
                <>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <div className="flex items-center">
                      <img 
                        src={selectedContact.avatar} 
                        alt={selectedContact.name} 
                        className="w-12 h-12 rounded-full mr-4" 
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                          {selectedContact.name}
                          <FaCircle className={`ml-2 text-xs ${selectedContact.online ? 'text-green-500' : 'text-gray-400'}`} />
                        </h2>
                        <p className="text-sm text-gray-500">
                          {selectedContact.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <FaEllipsisV 
                        className="text-gray-500 cursor-pointer hover:text-gray-700" 
                        onClick={toggleMenu} 
                      />
                      {menuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <ul className="text-sm text-gray-700">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Archive</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Pin to Bar</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 mb-4">
                    {Object.entries(groupMessagesByDate(getContactMessages(selectedContact.id))).map(([date, dateMessages]) => (
                      <div key={date} className="mb-6">
                        <div className="text-center text-xs text-gray-500 mb-4">
                          {date}
                        </div>
                        {dateMessages.map(renderMessage)}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="mt-auto pt-4 border-t">
                    <div className="flex items-center space-x-3">
                      <textarea
                        rows="2"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={`Message ${selectedContact.name}...`}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-5 rounded-lg transition duration-300 flex items-center"
                      >
                        <FaReply className="mr-2" /> Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center flex-1 flex items-center justify-center">
                  <FaUserCircle className="text-gray-300 text-6xl mb-4" />
                  <p className="text-gray-500">Select a contact to start chatting.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPanel;