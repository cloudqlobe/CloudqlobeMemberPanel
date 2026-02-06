import { useState } from 'react';
import { DollarSign, CreditCard, Clock, CheckCircle, AlertCircle, Send, MessageSquare, Calendar, Search, X } from 'lucide-react';
import Layout from '../../../layout/page';

export default function PayrollPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  const [payrollData, setPayrollData] = useState([
    {
      id: 1,
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      department: 'Sales',
      month: 'November 2025',
      basicSalary: 5000,
      allowances: 1000,
      deductions: 500,
      netSalary: 5500,
      advanceAmount: 1000,
      balanceAmount: 4500,
      transferredAmount: 4500,
      paymentMethod: 'Bank Transfer',
      accountNumber: '****1234',
      transactionId: 'TXN2025110401',
      status: 'Completed',
      paymentDate: '2025-11-04',
      issues: []
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      department: 'Marketing',
      month: 'November 2025',
      basicSalary: 6000,
      allowances: 1500,
      deductions: 600,
      netSalary: 6900,
      advanceAmount: 2000,
      balanceAmount: 4900,
      transferredAmount: 0,
      paymentMethod: 'Bank Transfer',
      accountNumber: '****5678',
      transactionId: 'TXN2025110402',
      status: 'Pending',
      paymentDate: null,
      issues: [
        { date: '2025-11-03', message: 'Amount not received yet. Please check.', reply: 'Payment is scheduled for Nov 5th. Will be processed soon.' }
      ]
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      department: 'Accounts',
      month: 'November 2025',
      basicSalary: 5500,
      allowances: 1200,
      deductions: 400,
      netSalary: 6300,
      advanceAmount: 500,
      balanceAmount: 5800,
      transferredAmount: 5800,
      paymentMethod: 'Cheque',
      accountNumber: 'CHQ-789456',
      transactionId: 'TXN2025110403',
      status: 'Completed',
      paymentDate: '2025-11-02',
      issues: []
    },
    {
      id: 4,
      employeeName: 'Sarah Williams',
      employeeId: 'EMP004',
      department: 'Sales',
      month: 'November 2025',
      basicSalary: 4500,
      allowances: 800,
      deductions: 300,
      netSalary: 5000,
      advanceAmount: 0,
      balanceAmount: 5000,
      transferredAmount: 2500,
      paymentMethod: 'Bank Transfer',
      accountNumber: '****9012',
      transactionId: 'TXN2025110404',
      status: 'Partial',
      paymentDate: '2025-11-01',
      issues: [
        { date: '2025-11-04', message: 'Received only partial amount. Remaining balance pending.', reply: null }
      ]
    }
  ]);

  const stats = {
    totalPayroll: payrollData.reduce((sum, p) => sum + p.netSalary, 0),
    totalTransferred: payrollData.reduce((sum, p) => sum + p.transferredAmount, 0),
    totalPending: payrollData.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.balanceAmount, 0),
    totalAdvances: payrollData.reduce((sum, p) => sum + p.advanceAmount, 0)
  };

  const getFilteredData = () => {
    let filtered = payrollData;
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(p => p.status.toLowerCase() === selectedFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleSendReply = (payrollId) => {
    if (!replyMessage.trim()) return;

    setPayrollData(payrollData.map(p => {
      if (p.id === payrollId && p.issues.length > 0) {
        const updatedIssues = [...p.issues];
        updatedIssues[updatedIssues.length - 1].reply = replyMessage;
        return { ...p, issues: updatedIssues };
      }
      return p;
    }));

    setReplyMessage('');
    setShowReplyModal(false);
    setSelectedTransaction(null);
  };

  const openReplyModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReplyModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'pending':
        return <Clock size={20} className="text-yellow-600" />;
      case 'partial':
        return <AlertCircle size={20} className="text-orange-600" />;
      default:
        return <AlertCircle size={20} className="text-red-600" />;
    }
  };

  const filteredData = getFilteredData();

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Payroll Management</h1>
          <p className="text-gray-600">Manage salary payments and track transaction status</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalPayroll)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Transferred</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalTransferred)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalPending)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CreditCard className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Advances</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalAdvances)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, ID, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'completed', 'pending', 'partial'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
        </div>

        {/* Payroll List */}
        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg">No payroll records found</p>
            </div>
          ) : (
            filteredData.map((payroll) => (
              <div key={payroll.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Employee Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{payroll.employeeName}</h3>
                        <p className="text-sm text-gray-600">{payroll.employeeId} • {payroll.department}</p>
                        <p className="text-sm text-gray-500 mt-1">{payroll.month}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payroll.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payroll.status)}`}>
                          {payroll.status}
                        </span>
                      </div>
                    </div>

                    {/* Salary Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Basic Salary</p>
                        <p className="text-lg font-semibold text-gray-800">{formatCurrency(payroll.basicSalary)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Allowances</p>
                        <p className="text-lg font-semibold text-green-600">+{formatCurrency(payroll.allowances)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Deductions</p>
                        <p className="text-lg font-semibold text-red-600">-{formatCurrency(payroll.deductions)}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                        <p className="text-xs text-gray-600">Net Salary</p>
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(payroll.netSalary)}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Advance Amount</p>
                        <p className="text-lg font-semibold text-purple-600">{formatCurrency(payroll.advanceAmount)}</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Balance Amount</p>
                        <p className="text-lg font-semibold text-orange-600">{formatCurrency(payroll.balanceAmount)}</p>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Transferred Amount</p>
                          <p className="font-semibold text-gray-800">{formatCurrency(payroll.transferredAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Method</p>
                          <p className="font-semibold text-gray-800">{payroll.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Account</p>
                          <p className="font-semibold text-gray-800">{payroll.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Transaction ID</p>
                          <p className="font-semibold text-gray-800">{payroll.transactionId}</p>
                        </div>
                      </div>
                      {payroll.paymentDate && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>Payment Date: {formatDate(payroll.paymentDate)}</span>
                        </div>
                      )}
                    </div>

                    {/* Issues Section */}
                    {payroll.issues.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <MessageSquare size={18} />
                          Recent Communications
                        </h4>
                        <div className="space-y-3">
                          {payroll.issues.map((issue, index) => (
                            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700 mb-1">{issue.message}</p>
                                  <p className="text-xs text-gray-500">{formatDate(issue.date)}</p>
                                  
                                  {issue.reply ? (
                                    <div className="mt-3 bg-white border border-green-200 rounded-lg p-3">
                                      <p className="text-sm font-semibold text-green-700 mb-1">Reply:</p>
                                      <p className="text-sm text-gray-700">{issue.reply}</p>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => openReplyModal(payroll)}
                                      className="mt-3 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    >
                                      <Send size={16} />
                                      Send Reply
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reply Modal */}
        {showReplyModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Reply to Payment Issue</h3>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyMessage('');
                    setSelectedTransaction(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-800 mb-2">{selectedTransaction.employeeName}</p>
                <p className="text-sm text-gray-600 mb-2">Employee ID: {selectedTransaction.employeeId}</p>
                {selectedTransaction.issues.length > 0 && (
                  <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                    <p className="text-sm text-gray-700 font-medium mb-1">Issue:</p>
                    <p className="text-sm text-gray-600">{selectedTransaction.issues[selectedTransaction.issues.length - 1].message}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows="6"
                  placeholder="Enter your response regarding the payment issue..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-blue-800 mb-2">Payment Summary:</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Balance Amount:</span>
                    <span className="ml-2 font-semibold text-gray-800">{formatCurrency(selectedTransaction.balanceAmount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Transferred:</span>
                    <span className="ml-2 font-semibold text-gray-800">{formatCurrency(selectedTransaction.transferredAmount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Advance:</span>
                    <span className="ml-2 font-semibold text-gray-800">{formatCurrency(selectedTransaction.advanceAmount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pending:</span>
                    <span className="ml-2 font-semibold text-orange-600">
                      {formatCurrency(selectedTransaction.balanceAmount - selectedTransaction.transferredAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSendReply(selectedTransaction.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Send size={18} />
                  Send Reply
                </button>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyMessage('');
                    setSelectedTransaction(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
}