import { useState } from 'react';
import { Bell, Check, X, MessageSquare, Clock, User, Calendar, FileText, AlertCircle, Send, Eye, Filter } from 'lucide-react';

export default function AdminNotificationPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'Leave Request',
      from: 'John Doe',
      fromId: 'EMP001',
      department: 'Sales',
      subject: 'Sick Leave Request',
      message: 'Requesting 2 days sick leave due to fever and cold. Need medical attention.',
      leaveDetails: {
        leaveType: 'Sick Leave',
        startDate: '2025-11-05',
        endDate: '2025-11-06',
        totalDays: 2,
        dayType: 'Full Day',
        reason: 'Medical checkup and treatment required'
      },
      timestamp: '2025-11-04 09:30 AM',
      status: 'Pending',
      priority: 'High',
      response: null,
      role: 'Team Admin'
    },
    {
      id: 2,
      type: 'Payroll Issue',
      from: 'Jane Smith',
      fromId: 'EMP002',
      department: 'Marketing',
      subject: 'Partial Salary Payment',
      message: 'I received only partial salary amount this month. Expected $6,900 but received only $4,900. Please check the transaction.',
      payrollDetails: {
        expectedAmount: 6900,
        receivedAmount: 4900,
        month: 'November 2025',
        transactionId: 'TXN2025110402'
      },
      timestamp: '2025-11-04 10:15 AM',
      status: 'Pending',
      priority: 'High',
      response: null,
      role: 'Super Admin'
    },
    {
      id: 3,
      type: 'Attendance Issue',
      from: 'Mike Johnson',
      fromId: 'EMP003',
      department: 'Accounts',
      subject: 'Forgot to Punch Out',
      message: 'Yesterday I forgot to punch out at 6 PM. Please update my attendance record.',
      attendanceDetails: {
        date: '2025-11-03',
        punchIn: '09:00 AM',
        punchOut: null,
        actualPunchOut: '06:00 PM'
      },
      timestamp: '2025-11-04 08:45 AM',
      status: 'Accepted',
      priority: 'Medium',
      response: 'Attendance updated successfully. Your punch out time has been recorded as 6:00 PM.',
      respondedBy: 'Admin Sarah',
      respondedAt: '2025-11-04 09:00 AM',
      role: 'Team Admin'
    },
    {
      id: 4,
      type: 'Leave Request',
      from: 'Sarah Williams',
      fromId: 'EMP004',
      department: 'Sales',
      subject: 'Annual Leave Request',
      message: 'Requesting annual leave for family vacation',
      leaveDetails: {
        leaveType: 'Annual Leave',
        startDate: '2025-11-15',
        endDate: '2025-11-20',
        totalDays: 6,
        dayType: 'Full Day',
        reason: 'Family vacation to Hawaii'
      },
      timestamp: '2025-11-03 02:30 PM',
      status: 'Declined',
      priority: 'Low',
      response: 'Sorry, we have multiple team members on leave during this period. Please choose alternative dates.',
      respondedBy: 'Admin Sarah',
      respondedAt: '2025-11-03 03:15 PM',
      role: 'Team Admin'
    },
    {
      id: 5,
      type: 'Performance Review',
      from: 'Alex Brown',
      fromId: 'EMP005',
      department: 'Sales',
      subject: 'Monthly Performance Review Request',
      message: 'Requesting review of monthly performance metrics and feedback discussion.',
      timestamp: '2025-11-04 11:00 AM',
      status: 'Pending',
      priority: 'Medium',
      response: null,
      role: 'Team Admin'
    },
    {
      id: 6,
      type: 'Document Request',
      from: 'Emily Davis',
      fromId: 'EMP006',
      department: 'HR',
      subject: 'Experience Letter Request',
      message: 'Need experience letter for visa application. Required urgently.',
      timestamp: '2025-11-04 01:20 PM',
      status: 'Accepted',
      priority: 'High',
      response: 'Your experience letter has been generated and sent to your email. Please check.',
      respondedBy: 'HR Manager',
      respondedAt: '2025-11-04 02:00 PM',
      role: 'Super Admin'
    }
  ]);

  const stats = {
    total: notifications.length,
    pending: notifications.filter(n => n.status === 'Pending').length,
    accepted: notifications.filter(n => n.status === 'Accepted').length,
    declined: notifications.filter(n => n.status === 'Declined').length
  };

  const handleAccept = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId 
        ? { ...n, status: 'Accepted', respondedBy: 'Current Admin', respondedAt: new Date().toLocaleString() }
        : n
    ));
    if (showDetailsModal) {
      setSelectedNotification(prev => ({ ...prev, status: 'Accepted' }));
    }
  };

  const handleDecline = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId 
        ? { ...n, status: 'Declined', respondedBy: 'Current Admin', respondedAt: new Date().toLocaleString() }
        : n
    ));
    if (showDetailsModal) {
      setSelectedNotification(prev => ({ ...prev, status: 'Declined' }));
    }
  };

  const handleSendResponse = (notificationId) => {
    if (!responseMessage.trim()) return;

    setNotifications(notifications.map(n => 
      n.id === notificationId 
        ? { 
            ...n, 
            response: responseMessage, 
            respondedBy: 'Current Admin',
            respondedAt: new Date().toLocaleString()
          }
        : n
    ));

    setResponseMessage('');
    setShowResponseModal(false);
    setSelectedNotification(null);
  };

  const openResponseModal = (notification) => {
    setSelectedNotification(notification);
    setShowResponseModal(true);
  };

  const openDetailsModal = (notification) => {
    setSelectedNotification(notification);
    setShowDetailsModal(true);
  };

  const getFilteredNotifications = () => {
    if (selectedFilter === 'all') return notifications;
    return notifications.filter(n => n.status.toLowerCase() === selectedFilter);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Leave Request':
        return <Calendar className="text-blue-600" size={20} />;
      case 'Payroll Issue':
        return <AlertCircle className="text-red-600" size={20} />;
      case 'Attendance Issue':
        return <Clock className="text-orange-600" size={20} />;
      case 'Performance Review':
        return <FileText className="text-purple-600" size={20} />;
      case 'Document Request':
        return <FileText className="text-green-600" size={20} />;
      default:
        return <Bell className="text-gray-600" size={20} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Notifications</h1>
          <p className="text-gray-600">Manage and respond to staff notifications and requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <Bell className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <Check className="text-green-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-800">{stats.accepted}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
            <div className="flex items-center gap-3">
              <X className="text-red-600" size={24} />
              <div>
                <p className="text-sm text-gray-600">Declined</p>
                <p className="text-2xl font-bold text-gray-800">{stats.declined}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="text-gray-600" size={20} />
            {['all', 'pending', 'accepted', 'declined'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Bell className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div key={notification.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Left Section - Icon & Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{notification.subject}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                              <User size={14} />
                              <span>{notification.from} ({notification.fromId})</span>
                              <span>•</span>
                              <span>{notification.department}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                              {notification.status}
                            </span>
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Type: {notification.type}</p>
                          <p className="text-sm text-gray-700">{notification.message}</p>
                        </div>

                        {/* Additional Details */}
                        {notification.leaveDetails && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm">
                            <p className="font-semibold text-gray-700 mb-2">Leave Details:</p>
                            <div className="grid grid-cols-2 gap-2">
                              <p><span className="text-gray-600">Type:</span> {notification.leaveDetails.leaveType}</p>
                              <p><span className="text-gray-600">Days:</span> {notification.leaveDetails.totalDays}</p>
                              <p><span className="text-gray-600">From:</span> {formatDate(notification.leaveDetails.startDate)}</p>
                              <p><span className="text-gray-600">To:</span> {formatDate(notification.leaveDetails.endDate)}</p>
                            </div>
                          </div>
                        )}

                        {notification.payrollDetails && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm">
                            <p className="font-semibold text-gray-700 mb-2">Payroll Details:</p>
                            <div className="grid grid-cols-2 gap-2">
                              <p><span className="text-gray-600">Expected:</span> ${notification.payrollDetails.expectedAmount}</p>
                              <p><span className="text-gray-600">Received:</span> ${notification.payrollDetails.receivedAmount}</p>
                              <p><span className="text-gray-600">Month:</span> {notification.payrollDetails.month}</p>
                              <p><span className="text-gray-600">Transaction:</span> {notification.payrollDetails.transactionId}</p>
                            </div>
                          </div>
                        )}

                        {notification.response && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                            <p className="text-sm font-semibold text-green-800 mb-1">Response:</p>
                            <p className="text-sm text-gray-700">{notification.response}</p>
                            <p className="text-xs text-gray-600 mt-2">
                              By {notification.respondedBy} • {notification.respondedAt}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={14} />
                          <span>{notification.timestamp}</span>
                          <span>•</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            {notification.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <button
                      onClick={() => openDetailsModal(notification)}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    {notification.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleAccept(notification.id)}
                          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <Check size={16} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(notification.id)}
                          className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <X size={16} />
                          Decline
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => openResponseModal(notification)}
                      className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      <MessageSquare size={16} />
                      Respond
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Response Modal */}
        {showResponseModal && selectedNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Send Response</h3>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseMessage('');
                    setSelectedNotification(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(selectedNotification.type)}
                  <h4 className="font-semibold text-gray-800">{selectedNotification.subject}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">From: {selectedNotification.from} ({selectedNotification.fromId})</p>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <p className="text-sm text-gray-700">{selectedNotification.message}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows="6"
                  placeholder="Type your response here..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSendResponse(selectedNotification.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Send size={18} />
                  Send Response
                </button>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseMessage('');
                    setSelectedNotification(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 my-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Notification Details</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedNotification(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    {getTypeIcon(selectedNotification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{selectedNotification.subject}</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedNotification.status)}`}>
                        {selectedNotification.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedNotification.priority)}`}>
                        {selectedNotification.priority} Priority
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {selectedNotification.role}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><span className="text-gray-600">From:</span> <strong>{selectedNotification.from}</strong></p>
                      <p><span className="text-gray-600">Employee ID:</span> <strong>{selectedNotification.fromId}</strong></p>
                      <p><span className="text-gray-600">Department:</span> <strong>{selectedNotification.department}</strong></p>
                      <p><span className="text-gray-600">Time:</span> <strong>{selectedNotification.timestamp}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Type: {selectedNotification.type}</p>
                  <p className="text-gray-700">{selectedNotification.message}</p>
                </div>

                {selectedNotification.leaveDetails && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-bold text-gray-800 mb-3">Leave Information</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Leave Type</p>
                        <p className="font-semibold text-gray-800">{selectedNotification.leaveDetails.leaveType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Total Days</p>
                        <p className="font-semibold text-gray-800">{selectedNotification.leaveDetails.totalDays} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Start Date</p>
                        <p className="font-semibold text-gray-800">{formatDate(selectedNotification.leaveDetails.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">End Date</p>
                        <p className="font-semibold text-gray-800">{formatDate(selectedNotification.leaveDetails.endDate)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-600 mb-1">Reason</p>
                        <p className="text-gray-800">{selectedNotification.leaveDetails.reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedNotification.payrollDetails && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-bold text-gray-800 mb-3">Payroll Information</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Expected Amount</p>
                        <p className="font-semibold text-green-600">${selectedNotification.payrollDetails.expectedAmount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Received Amount</p>
                        <p className="font-semibold text-red-600">${selectedNotification.payrollDetails.receivedAmount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Month</p>
                        <p className="font-semibold text-gray-800">{selectedNotification.payrollDetails.month}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Transaction ID</p>
                        <p className="font-semibold text-gray-800">{selectedNotification.payrollDetails.transactionId}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedNotification.response && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-bold text-green-800 mb-2">Response</h5>
                    <p className="text-gray-700 mb-2">{selectedNotification.response}</p>
                    <p className="text-xs text-gray-600">
                      Responded by {selectedNotification.respondedBy} on {selectedNotification.respondedAt}
                    </p>
                  </div>
                )}

                {selectedNotification.status === 'Pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        handleAccept(selectedNotification.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <Check size={18} />
                      Accept Request
                    </button>
                    <button
                      onClick={() => {
                        handleDecline(selectedNotification.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <X size={18} />
                      Decline Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
        </div>
  )}