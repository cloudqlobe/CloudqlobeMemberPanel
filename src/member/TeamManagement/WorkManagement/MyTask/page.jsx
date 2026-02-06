import { useCallback, useContext, useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Target,
  RefreshCw,
  Play
} from 'lucide-react';
import axiosInstance from '../../../../utils/axiosinstance';
import AuthContext from '../../../../context/AuthContext';
import Layout from '../../../layout/page';

export default function MemberTaskDisplay() {
  const { memberDetails } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [memberInfo, setMemberInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

const fetchMemberTasks = useCallback(async () => {
  try {
    const res = await axiosInstance.get(`/api/member/tasks/${memberDetails.id}`);
    setTasks(res.data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}, [memberDetails.id]);

const fetchMemberInfo = useCallback(async () => {
  try {
    const res = await axiosInstance("/api/admin/sale-members");
    const data = await res.json();
    const member = data.find(m => m.id === memberDetails.id);
    setMemberInfo(member);
  } catch (error) {
    console.error("Error fetching member info:", error);
  }
}, [memberDetails.id]);

useEffect(() => {
  fetchMemberTasks();
  fetchMemberInfo(); // only if you need memberInfo on mount
  const timer = setInterval(() => setCurrentTime(new Date()), 60000);
  return () => clearInterval(timer);
}, [fetchMemberTasks, fetchMemberInfo]);


  const handleUpdateProgress = async (task) => {
    try {
      const statusFlow = ['pending', 'progress', 'complete'];
      const currentStatusIndex = statusFlow.indexOf(task.taskstatus);
      const nextStatus = statusFlow[Math.min(currentStatusIndex + 1, statusFlow.length - 1)];

      const updatedMembers = task.assignedToAll?.map(member => {
        if (member.id === memberDetails.id) {
          return {
            ...member,
            taskstatus: nextStatus,
            solvedTaskNumber: nextStatus === 'complete'
              ? String(Number(member.solvedTaskNumber || '0') + 1)
              : member.solvedTaskNumber
          };
        }
        return member;
      });

      const updatedTask = { ...task, assignedToAll: updatedMembers };
      const { filteredMembers, taskstatus, solvedTaskNumber, ...taskToSend } = updatedTask;

      await axiosInstance.put(`/api/member/tasks/update-progress/${task.id}/${memberDetails.id}`, taskToSend);

      fetchMemberTasks();
      alert(`Task status updated to ${nextStatus} ✅`);

    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task status ❌");
    }
  };


  const calculateTimeRemaining = (deadline) => {
    const now = currentTime;
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;

    if (diff <= 0) {
      return { text: 'Overdue', color: 'text-red-600', urgent: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return {
        text: `${days} day${days > 1 ? 's' : ''} ${hours}h remaining`,
        color: days <= 2 ? 'text-orange-600' : 'text-green-600',
        urgent: days <= 2
      };
    } else {
      return {
        text: `${hours} hour${hours > 1 ? 's' : ''} remaining`,
        color: 'text-red-600',
        urgent: true
      };
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => task.taskstatus === activeTab);
  };

  const getTaskCountByStatus = (status) => {
    return tasks.filter(task => task.taskstatus === status).length;
  };

  const getStatusButton = (task) => {
    const status = task.taskstatus;

    if (status === 'pending') {
      return {
        text: 'Start Progress',
        icon: <Play className="w-4 h-4" />,
        color: 'bg-blue-500 hover:bg-blue-600'
      };
    } else if (status === 'progress') {
      return {
        text: 'Mark Complete',
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'bg-green-500 hover:bg-green-600'
      };
    } else {
      return {
        text: 'Completed',
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'bg-gray-400 cursor-not-allowed',
        disabled: true
      };
    }
  };

  const getTabIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'progress': return <AlertCircle className="w-5 h-5" />;
      case 'complete': return <CheckCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.taskstatus === 'complete').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header with Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Tasks
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {memberInfo?.fullName || 'Team Member'}!
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Progress</p>
              <p className="text-3xl font-bold text-indigo-600">{progressPercentage}%</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Tasks</p>
                  <p className="text-3xl font-bold mt-1">{totalTasks}</p>
                </div>
                <Target className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Pending</p>
                  <p className="text-3xl font-bold mt-1">{getTaskCountByStatus('pending')}</p>
                </div>
                <Clock className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">In Progress</p>
                  <p className="text-3xl font-bold mt-1">{getTaskCountByStatus('progress')}</p>
                </div>
                <TrendingUp className="w-10 h-10 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Completed</p>
                  <p className="text-3xl font-bold mt-1">{completedTasks}</p>
                </div>
                <Award className="w-10 h-10 opacity-80" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{completedTasks} of {totalTasks} tasks completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-6">
          <div className="grid grid-cols-3 gap-2">
            {['pending', 'progress', 'complete'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${activeTab === status
                  ? `bg-gradient-to-r ${status === 'pending'
                    ? 'from-orange-500 to-orange-600'
                    : status === 'progress'
                      ? 'from-purple-500 to-purple-600'
                      : 'from-green-500 to-green-600'
                  } text-white shadow-lg`
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {getTabIcon(status)}
                <span className="capitalize">{status}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${activeTab === status
                    ? 'bg-white text-gray-700'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {getTaskCountByStatus(status)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        {getFilteredTasks().length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No {activeTab} Tasks</h3>
            <p className="text-gray-500">
              {activeTab === 'complete'
                ? 'Keep working to complete more tasks!'
                : `You have no ${activeTab} tasks at the moment`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {getFilteredTasks().map(task => {
              const timeRemaining = calculateTimeRemaining(task.deadline);
              const buttonConfig = getStatusButton(task);

              return (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all border-l-4 border-indigo-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold text-gray-800">{task.title}</h3>
                        <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border-2 ${getPriorityColor(task.priority)}`}>
                          {task.priority?.toUpperCase()}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-gray-600 mb-4">{task.description}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-5 h-5 text-indigo-500" />
                          <div>
                            <p className="text-xs text-gray-500">Assigned Date</p>
                            <p className="font-semibold">{formatDisplayDate(task.assignDate)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="text-xs text-gray-500">Deadline</p>
                            <p className="font-semibold">{formatDisplayDate(task.deadline)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Target className="w-5 h-5 text-purple-500" />
                          <div>
                            <p className="text-xs text-gray-500">Task Count</p>
                            <p className="font-semibold">{task.taskNumber} tasks</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <RefreshCw className={`w-5 h-5 ${timeRemaining.urgent ? 'animate-pulse' : ''} ${timeRemaining.color}`} />
                          <div>
                            <p className="text-xs text-gray-500">Time Remaining</p>
                            <p className={`font-bold ${timeRemaining.color}`}>{timeRemaining.text}</p>
                          </div>
                        </div>
                      </div>

                      {/* Solved Progress */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">Your Progress</span>
                          <span className="text-sm font-bold text-indigo-600">
                            {task.solvedTaskNumber} / {task.taskNumber} completed
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((Number(task.solvedTaskNumber) / Number(task.taskNumber)) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => !buttonConfig.disabled && handleUpdateProgress(task)}
                    disabled={buttonConfig.disabled}
                    className={`w-full ${buttonConfig.color} text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg`}
                  >
                    {buttonConfig.icon}
                    {buttonConfig.text}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
}