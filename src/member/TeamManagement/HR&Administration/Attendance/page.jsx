import { useState, useEffect, useContext } from 'react';
import { Clock, Calendar, LogIn, LogOut, Award, AlertCircle, TrendingUp, CheckCircle, Coffee } from 'lucide-react';
import Layout from '../../../layout/page';
import axiosInstance from '../../../../utils/axiosinstance';
import AuthContext from '../../../../context/AuthContext';

export default function AttendancePage() {
  const { memberDetails } = useContext(AuthContext);
  const memberId = memberDetails.id
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('november');

  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [monthlyStats, setMonthlyStats] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    leaves: 0,
    halfDays: 0,
    totalHours: 0,
    avgHours: 0,
    onTimeRate: 0,
  });

useEffect(() => {
  const timer = setInterval(() => setCurrentTime(new Date()), 1000);

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceRecords.find(r => r.date === today);

  if (todayRecord && todayRecord.punchIn && !todayRecord.punchOut) {
    setIsPunchedIn(true);
    setTodayAttendance(todayRecord);
  }

  return () => clearInterval(timer);
}, [attendanceRecords]);


useEffect(() => {
  const fetchTodayAttendance = async () => {
    try {
      const res = await axiosInstance.get(`api/member/teamManagement/attendance/today/${memberId}`);
      if (res.data.success && res.data.today) {
        setTodayAttendance(res.data.today);
        setIsPunchedIn(res.data.today.punchIn && !res.data.today.punchOut);
      }
    } catch (error) {
      console.error("Error fetching today's attendance", error);
    }
  };

  fetchTodayAttendance();
}, [memberId]);


  useEffect(() => {
    const fetchMonthlyAttendance = async () => {
      try {
        const res = await axiosInstance.get(`api/member/teamManagement/attendance/monthly/${memberId}/${selectedMonth}`);

        if (res.data.success) {
          const records = res.data.records;
          setAttendanceRecords(records);

          // ---- Calculate Monthly Stats ----
          let present = 0;
          let absent = 0;
          let leaves = 0;
          let halfDays = 0;
          let totalHours = 0;
          let onTime = 0;

          records.forEach(r => {
            if (r.status === "Present") present++;
            if (r.status === "Absent") absent++;
            if (r.status === "Leave") leaves++;
            if (r.status === "Half Day") halfDays++;

            // Calculate hours if exists
            if (r.totalHours) {
              const [h, m] = r.totalHours.replace("h", "").replace("m", "").split(" ").map(Number);
              totalHours += h + m / 60;
            }

            // On-time example rule: punchIn before 10:00 AM
            if (r.punchIn) {
              const punchTime = new Date(`2000-01-01 ${r.punchIn}`);
              const limit = new Date(`2000-01-01 10:00 AM`);
              if (punchTime <= limit) onTime++;
            }
          });

          const avgHours = records.length ? (totalHours / records.length).toFixed(1) : 0;

          setMonthlyStats({
            totalDays: records.length,
            present,
            absent,
            leaves,
            halfDays,
            totalHours: Math.round(totalHours),
            avgHours,
            onTimeRate: records.length ? Math.round((onTime / records.length) * 100) : 0,
          });
        }


      } catch (error) {
        console.error("Error fetching monthly attendance", error);
      }
    };

    fetchMonthlyAttendance();
}, [memberId, selectedMonth]);


  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCurrentDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePunchIn = async () => {
    try {
      const res = await axiosInstance.post("api/member/teamManagement/attendance/punch-in", { memberId });

      if (res.data.success) {
        setTodayAttendance(res.data.record);
        setIsPunchedIn(true);
        setAttendanceRecords([res.data.record, ...attendanceRecords]);
      }
    } catch (error) {
      console.error("Punch in failed", error);
    }
  };


  const handlePunchOut = async () => {
    try {
      const res = await axiosInstance.post("api/member/teamManagement/attendance/punch-out", { memberId });

      if (res.data.success) {
        const updated = res.data.record;
        setTodayAttendance(updated);
        setIsPunchedIn(false);

        // Update table
        const newList = attendanceRecords.map(r =>
          r.id === updated.id ? updated : r
        );
        setAttendanceRecords(newList);
      }
    } catch (error) {
      console.error("Punch out failed", error);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      case 'Leave':
        return 'bg-blue-100 text-blue-800';
      case 'Half Day':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'Absent':
        return <AlertCircle size={18} className="text-red-600" />;
      case 'Leave':
        return <Coffee size={18} className="text-blue-600" />;
      case 'Half Day':
        return <Clock size={18} className="text-orange-600" />;
      default:
        return <Clock size={18} className="text-gray-600" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Attendance</h1>
            <p className="text-gray-600">Track your daily attendance and work hours</p>
          </div>

          {/* Current Time & Punch Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 mb-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm opacity-90 mb-2">{getCurrentDate()}</p>
                <p className="text-5xl font-bold mb-2">{formatTime(currentTime)}</p>
                {todayAttendance && todayAttendance.punchIn && (
                  <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-4">
                    <p className="text-sm mb-1">Punch In Time</p>
                    <p className="text-2xl font-bold">{todayAttendance.punchIn}</p>
                    {todayAttendance.punchOut && (
                      <>
                        <p className="text-sm mt-3 mb-1">Punch Out Time</p>
                        <p className="text-2xl font-bold">{todayAttendance.punchOut}</p>
                        <p className="text-sm mt-3 mb-1">Total Working Hours</p>
                        <p className="text-xl font-bold text-green-300">{todayAttendance.totalHours}</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {!isPunchedIn ? (
                  <button
                    onClick={handlePunchIn}
                    className="flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg"
                  >
                    <LogIn size={28} />
                    Punch In
                  </button>
                ) : (
                  <button
                    onClick={handlePunchOut}
                    className="flex items-center gap-3 bg-red-500 text-white px-8 py-4 rounded-lg hover:bg-red-600 transition-colors font-bold text-lg shadow-lg"
                  >
                    <LogOut size={28} />
                    Punch Out
                  </button>
                )}
                <p className="text-center text-sm opacity-90">
                  {isPunchedIn ? 'Click to punch out' : 'Start your work day'}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col items-center">
                <Calendar className="text-blue-600 mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-800">{monthlyStats.totalDays}</p>
                <p className="text-xs text-gray-600 text-center">Total Days</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col items-center">
                <CheckCircle className="text-green-600 mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-800">{monthlyStats.present}</p>
                <p className="text-xs text-gray-600 text-center">Present</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col items-center">
                <AlertCircle className="text-red-600 mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-800">{monthlyStats.absent}</p>
                <p className="text-xs text-gray-600 text-center">Absent</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col items-center">
                <Coffee className="text-blue-600 mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-800">{monthlyStats.leaves}</p>
                <p className="text-xs text-gray-600 text-center">Leaves</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col items-center">
                <Clock className="text-orange-600 mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-800">{monthlyStats.halfDays}</p>
                <p className="text-xs text-gray-600 text-center">Half Days</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col items-center">
                <TrendingUp className="text-purple-600 mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-800">{monthlyStats.totalHours}</p>
                <p className="text-xs text-gray-600 text-center">Total Hours</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col items-center">
                <Clock className="text-indigo-600 mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-800">{monthlyStats.avgHours}</p>
                <p className="text-xs text-gray-600 text-center">Avg Hours</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col items-center">
                <Award className="text-yellow-600 mb-2" size={24} />
                <p className="text-2xl font-bold text-gray-800">{monthlyStats.onTimeRate}%</p>
                <p className="text-xs text-gray-600 text-center">On Time</p>
              </div>
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Attendance History</h2>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="2025-11">November 2025</option>
                <option value="10">October 2025</option>
                <option value="09">September 2025</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Punch In</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Punch Out</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Hours</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-800">{formatDate(record.date)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {record.punchIn ? (
                          <div className="flex items-center gap-2">
                            <LogIn size={16} className="text-green-600" />
                            <span className="text-gray-800">{record.punchIn}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {record.punchOut ? (
                          <div className="flex items-center gap-2">
                            <LogOut size={16} className="text-red-600" />
                            <span className="text-gray-800">{record.punchOut}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${record.totalHours !== '0h 0m' ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                          {record.totalHours}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                            {record.status}
                            {record.leaveType && ` (${record.leaveType})`}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {attendanceRecords.length === 0 && (
              <div className="text-center py-12">
                <Clock className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">No attendance records found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}