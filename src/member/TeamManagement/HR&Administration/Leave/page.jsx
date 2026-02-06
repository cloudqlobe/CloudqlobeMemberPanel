import { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus, X, Trash2 } from 'lucide-react';
import Layout from '../../../layout/page';

export default function LeaveManagementPage() {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Sick Leave',
    reason: '',
    startDate: '',
    endDate: '',
    dayType: 'Full Day',
    contactNumber: ''
  });

  const [leaves, setLeaves] = useState([
    {
      id: 1,
      leaveType: 'Sick Leave',
      reason: 'Medical checkup and treatment',
      startDate: '2025-11-05',
      endDate: '2025-11-06',
      dayType: 'Full Day',
      totalDays: 2,
      status: 'Approved',
      appliedDate: '2025-11-02',
      approvedBy: 'Manager John',
      approvedDate: '2025-11-03',
      contactNumber: '+1 (555) 123-4567'
    },
    {
      id: 2,
      leaveType: 'Casual Leave',
      reason: 'Personal work',
      startDate: '2025-11-10',
      endDate: '2025-11-10',
      dayType: 'Half Day',
      totalDays: 0.5,
      status: 'Pending',
      appliedDate: '2025-11-04',
      approvedBy: null,
      approvedDate: null,
      contactNumber: '+1 (555) 123-4567'
    },
    {
      id: 3,
      leaveType: 'Annual Leave',
      reason: 'Family vacation',
      startDate: '2025-10-15',
      endDate: '2025-10-20',
      dayType: 'Full Day',
      totalDays: 6,
      status: 'Approved',
      appliedDate: '2025-10-01',
      approvedBy: 'Manager John',
      approvedDate: '2025-10-03',
      contactNumber: '+1 (555) 123-4567'
    },
    {
      id: 4,
      leaveType: 'Sick Leave',
      reason: 'Fever and cold',
      startDate: '2025-09-20',
      endDate: '2025-09-21',
      dayType: 'Full Day',
      totalDays: 2,
      status: 'Rejected',
      appliedDate: '2025-09-19',
      approvedBy: 'Manager John',
      approvedDate: '2025-09-19',
      rejectionReason: 'Insufficient sick leave balance',
      contactNumber: '+1 (555) 123-4567'
    }
  ]);

  const leaveBalance = {
    sickLeave: { total: 10, used: 4, remaining: 6 },
    casualLeave: { total: 12, used: 5, remaining: 7 },
    annualLeave: { total: 20, used: 6, remaining: 14 },
    unpaidLeave: { total: 0, used: 0, remaining: 'Unlimited' }
  };

  const calculateDays = (start, end, dayType) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return dayType === 'Half Day' ? 0.5 : diffDays;
  };

  const handleApplyLeave = () => {
    if (!leaveForm.reason || !leaveForm.startDate || !leaveForm.endDate) {
      alert('Please fill all required fields');
      return;
    }

    const totalDays = calculateDays(leaveForm.startDate, leaveForm.endDate, leaveForm.dayType);
    
    const newLeave = {
      id: leaves.length + 1,
      ...leaveForm,
      totalDays,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      approvedBy: null,
      approvedDate: null
    };

    setLeaves([newLeave, ...leaves]);
    setLeaveForm({
      leaveType: 'Sick Leave',
      reason: '',
      startDate: '',
      endDate: '',
      dayType: 'Full Day',
      contactNumber: ''
    });
    setShowApplyForm(false);
  };

  const handleCancelLeave = (id) => {
    const leave = leaves.find(l => l.id === id);
    if (leave && (leave.status === 'Pending' || leave.status === 'Approved')) {
      if (window.confirm('Are you sure you want to cancel this leave request?')) {
        setLeaves(leaves.map(l => 
          l.id === id ? { ...l, status: 'Cancelled' } : l
        ));
      }
    }
  };

  const handleDeleteLeave = (id) => {
    if (window.confirm('Are you sure you want to delete this leave record?')) {
      setLeaves(leaves.filter(l => l.id !== id));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'Pending':
        return <Clock size={20} className="text-yellow-600" />;
      case 'Rejected':
        return <XCircle size={20} className="text-red-600" />;
      case 'Cancelled':
        return <XCircle size={20} className="text-gray-600" />;
      default:
        return <AlertCircle size={20} className="text-gray-600" />;
    }
  };

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const recentLeaves = leaves.slice(0, 5);

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Leave Management</h1>
            <p className="text-gray-600">Apply for leave and track your requests</p>
          </div>
          <button
            onClick={() => setShowApplyForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Apply Leave
          </button>
        </div>

        {/* Leave Balance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Sick Leave</h3>
            <p className="text-2xl font-bold text-gray-800">{leaveBalance.sickLeave.remaining}</p>
            <p className="text-xs text-gray-500 mt-1">
              Used: {leaveBalance.sickLeave.used} / {leaveBalance.sickLeave.total}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Casual Leave</h3>
            <p className="text-2xl font-bold text-gray-800">{leaveBalance.casualLeave.remaining}</p>
            <p className="text-xs text-gray-500 mt-1">
              Used: {leaveBalance.casualLeave.used} / {leaveBalance.casualLeave.total}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Annual Leave</h3>
            <p className="text-2xl font-bold text-gray-800">{leaveBalance.annualLeave.remaining}</p>
            <p className="text-xs text-gray-500 mt-1">
              Used: {leaveBalance.annualLeave.used} / {leaveBalance.annualLeave.total}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Unpaid Leave</h3>
            <p className="text-2xl font-bold text-gray-800">{leaveBalance.unpaidLeave.remaining}</p>
            <p className="text-xs text-gray-500 mt-1">No limits</p>
          </div>
        </div>

        {/* Apply Leave Form Modal */}
        {showApplyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Apply for Leave</h2>
                <button
                  onClick={() => setShowApplyForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={leaveForm.leaveType}
                    onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      min={leaveForm.startDate}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={leaveForm.dayType}
                    onChange={(e) => setLeaveForm({ ...leaveForm, dayType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="Full Day">Full Day</option>
                    <option value="Half Day">Half Day (First Half)</option>
                    <option value="Half Day">Half Day (Second Half)</option>
                  </select>
                </div>

                {leaveForm.startDate && leaveForm.endDate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium">
                      Total Days: {calculateDays(leaveForm.startDate, leaveForm.endDate, leaveForm.dayType)} day(s)
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    rows="4"
                    placeholder="Please provide a reason for your leave..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={leaveForm.contactNumber}
                    onChange={(e) => setLeaveForm({ ...leaveForm, contactNumber: e.target.value })}
                    placeholder="Enter your contact number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleApplyLeave}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Submit Application
                </button>
                <button
                  onClick={() => setShowApplyForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Leaves */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Leave Applications</h2>
              
              {recentLeaves.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500">No leave applications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLeaves.map((leave) => (
                    <div key={leave.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{leave.leaveType}</h3>
                          <p className="text-sm text-gray-600 mt-1">{leave.reason}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(leave.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(leave.status)}`}>
                            {leave.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-600">Start Date</p>
                          <p className="text-sm font-medium text-gray-800">{formatDate(leave.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">End Date</p>
                          <p className="text-sm font-medium text-gray-800">{formatDate(leave.endDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Day Type</p>
                          <p className="text-sm font-medium text-gray-800">{leave.dayType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Total Days</p>
                          <p className="text-sm font-medium text-gray-800">{leave.totalDays} day(s)</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
                        <div>
                          <p>Applied: {formatDate(leave.appliedDate)}</p>
                          {leave.approvedBy && (
                            <p className="mt-1">
                              {leave.status === 'Approved' ? 'Approved' : 'Rejected'} by {leave.approvedBy} on {formatDate(leave.approvedDate)}
                            </p>
                          )}
                          {leave.rejectionReason && (
                            <p className="mt-2 text-red-600 text-xs bg-red-50 p-2 rounded">
                              <strong>Reason:</strong> {leave.rejectionReason}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {(leave.status === 'Pending' || leave.status === 'Approved') && (
                            <button
                              onClick={() => handleCancelLeave(leave.id)}
                              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                          )}
                          {(leave.status === 'Rejected' || leave.status === 'Cancelled') && (
                            <button
                              onClick={() => handleDeleteLeave(leave.id)}
                              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Pending Requests */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-yellow-600" />
                Pending Requests
              </h2>
              
              {pendingLeaves.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingLeaves.map((leave) => (
                    <div key={leave.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-1">{leave.leaveType}</h3>
                      <p className="text-sm text-gray-600 mb-2">{leave.reason}</p>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{formatDate(leave.startDate)}</span>
                        <span>{leave.totalDays} day(s)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Leave Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Approved</span>
                  <span className="text-lg font-bold text-green-600">
                    {leaves.filter(l => l.status === 'Approved').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Pending</span>
                  <span className="text-lg font-bold text-yellow-600">
                    {leaves.filter(l => l.status === 'Pending').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Rejected</span>
                  <span className="text-lg font-bold text-red-600">
                    {leaves.filter(l => l.status === 'Rejected').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Cancelled</span>
                  <span className="text-lg font-bold text-gray-600">
                    {leaves.filter(l => l.status === 'Cancelled').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}