import React, { useState } from 'react';
import { Calendar, Plus, X, Clock, Plane, Flag } from 'lucide-react';

const InteractiveCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // International Holidays 2024
  const holidays = {
    '2024-11-28': 'Thanksgiving Day',
    '2024-12-25': 'Christmas Day',
    '2024-12-31': 'New Year\'s Eve',
    '2025-1-1': 'New Year\'s Day',
    '2025-1-26': 'Republic Day (India)',
    '2025-2-14': 'Valentine\'s Day',
    '2025-3-17': 'St. Patrick\'s Day',
    '2025-4-18': 'Good Friday',
    '2025-5-1': 'Labour Day',
    '2025-7-4': 'Independence Day (USA)',
    '2025-10-31': 'Halloween',
    '2025-11-27': 'Thanksgiving Day',
    '2025-12-25': 'Christmas Day'
  };

  const [leaveForm, setLeaveForm] = useState({
    date: '',
    type: 'full',
    description: ''
  });

  const [taskForm, setTaskForm] = useState({
    date: '',
    description: ''
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${month + 1}-${day}`;
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  const getHoliday = (day) => {
    const key = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    return holidays[key];
  };

  const getLeave = (day) => {
    const key = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    return leaves.find(l => l.date === key);
  };

  const getTask = (day) => {
    const key = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    return tasks.find(t => t.date === key);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddLeave = () => {
    if (leaveForm.date && leaveForm.description) {
      setLeaves([...leaves, { ...leaveForm, id: Date.now() }]);
      setLeaveForm({ date: '', type: 'full', description: '' });
    }
  };

  const handleAddTask = () => {
    if (taskForm.date && taskForm.description) {
      setTasks([...tasks, { ...taskForm, id: Date.now() }]);
      setTaskForm({ date: '', description: '' });
    }
  };

  const handleDateClick = (day) => {
    const key = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    const holiday = getHoliday(day);
    const leave = getLeave(day);
    const task = getTask(day);

    if (holiday || leave || task) {
      setModalData({ date: key, holiday, leave, task, day });
      setShowModal(true);
    }
  };

  const handleDeleteLeave = (id) => {
    setLeaves(leaves.filter(l => l.id !== id));
    setShowModal(false);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    setShowModal(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const holiday = getHoliday(day);
      const leave = getLeave(day);
      const task = getTask(day);
      const isCurrentDay = isToday(day);

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-24 border border-gray-200 p-2 cursor-pointer transition-all hover:shadow-lg relative group
            ${isCurrentDay ? 'bg-blue-50 border-blue-400' : 'bg-white hover:bg-gray-50'}
            ${holiday ? 'bg-red-50' : ''}
            ${leave ? 'bg-yellow-50' : ''}`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-semibold ${isCurrentDay ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            <div className="flex gap-1">
              {holiday && <Flag size={12} className="text-red-500" />}
              {leave && <Plane size={12} className="text-orange-500" />}
              {task && <Clock size={12} className="text-purple-500" />}
            </div>
          </div>

          {/* Tooltip */}
          {holiday && (
            <div className="absolute top-8 left-0 right-0 bg-gray-900 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              🎉 {holiday}
            </div>
          )}

          {/* Leave indicator */}
          {leave && (
            <div className="mt-1">
              <span className="text-xs bg-orange-200 text-orange-800 px-1 rounded">
                {leave.type === 'full' ? 'Full Day' : 'Half Day'}
              </span>
            </div>
          )}

          {/* Task indicator */}
          {task && (
            <div className="mt-1">
              <span className="text-xs bg-purple-200 text-purple-800 px-1 rounded truncate block">
                Deadline
              </span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-indigo-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Previous
              </button>
              <button
                onClick={handleNextMonth}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Next
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Flag size={16} className="text-red-500" />
              <span className="text-sm text-gray-600">Holiday</span>
            </div>
            <div className="flex items-center gap-2">
              <Plane size={16} className="text-orange-500" />
              <span className="text-sm text-gray-600">Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-purple-500" />
              <span className="text-sm text-gray-600">Task Deadline</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="h-12 flex items-center justify-center bg-indigo-600 text-white font-semibold">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>

          {/* Forms Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Leave Form */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Plane size={24} className="text-orange-600" />
                  Add Leave
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={leaveForm.date}
                    onChange={(e) => setLeaveForm({ ...leaveForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                  <select
                    value={leaveForm.type}
                    onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="full">Full Day</option>
                    <option value="half">Half Day</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={leaveForm.description}
                    onChange={(e) => setLeaveForm({ ...leaveForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Reason for leave..."
                  />
                </div>
                
                <button
                  onClick={handleAddLeave}
                  className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Leave
                </button>
              </div>
            </div>

            {/* Task Deadline Form */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Clock size={24} className="text-purple-600" />
                  Add Task Deadline
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={taskForm.date}
                    onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="3"
                    placeholder="What needs to be done..."
                  />
                </div>
                
                <button
                  onClick={handleAddTask}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {monthNames[currentDate.getMonth()]} {modalData.day}, {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {modalData.holiday && (
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Flag size={20} className="text-red-600" />
                    <h4 className="font-semibold text-red-800">Holiday</h4>
                  </div>
                  <p className="text-gray-700">{modalData.holiday}</p>
                </div>
              )}

              {modalData.leave && (
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Plane size={20} className="text-orange-600" />
                      <h4 className="font-semibold text-orange-800">
                        Leave ({modalData.leave.type === 'full' ? 'Full Day' : 'Half Day'})
                      </h4>
                    </div>
                    <button
                      onClick={() => handleDeleteLeave(modalData.leave.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-gray-700">{modalData.leave.description}</p>
                </div>
              )}

              {modalData.task && (
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Task Deadline</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(modalData.task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-gray-700">{modalData.task.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCalendar;