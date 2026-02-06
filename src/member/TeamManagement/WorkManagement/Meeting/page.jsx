import React, { useState } from 'react';
import { Calendar, Clock, Users, Video, MapPin, Plus, Trash2, Edit2 } from 'lucide-react';
import Layout from '../../../layout/page';

export default function MeetingManager() {
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: 'Team Standup',
      date: '2025-11-04',
      time: '09:00',
      duration: '30 min',
      type: 'video',
      location: 'Zoom',
      attendees: 5,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Project Review',
      date: '2025-11-04',
      time: '14:00',
      duration: '1 hour',
      type: 'in-person',
      location: 'Conference Room A',
      attendees: 8,
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Client Presentation',
      date: '2025-11-05',
      time: '11:00',
      duration: '2 hours',
      type: 'video',
      location: 'Google Meet',
      attendees: 12,
      status: 'upcoming'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: '30 min',
    type: 'video',
    location: '',
    attendees: 1
  });

  const addMeeting = () => {
    if (newMeeting.title && newMeeting.date && newMeeting.time) {
      setMeetings([...meetings, {
        ...newMeeting,
        id: Date.now(),
        status: 'upcoming'
      }]);
      setNewMeeting({
        title: '',
        date: '',
        time: '',
        duration: '30 min',
        type: 'video',
        location: '',
        attendees: 1
      });
      setShowForm(false);
    }
  };

  const deleteMeeting = (id) => {
    setMeetings(meetings.filter(meeting => meeting.id !== id));
  };

  const getStatusColor = (status) => {
    if (status === 'upcoming') return 'bg-blue-100 text-blue-800';
    if (status === 'completed') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Meetings</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 font-medium"
            >
              <Plus size={20} />
              New Meeting
            </button>
          </div>

          {showForm && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Schedule New Meeting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Meeting Title"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({...newMeeting, duration: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>15 min</option>
                  <option>30 min</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>3 hours</option>
                </select>
                <select
                  value={newMeeting.type}
                  onChange={(e) => setNewMeeting({...newMeeting, type: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="video">Video Call</option>
                  <option value="in-person">In-Person</option>
                </select>
                <input
                  type="text"
                  placeholder="Location/Link"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={addMeeting}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  Save Meeting
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {meetings.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Calendar size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No meetings scheduled</p>
              </div>
            ) : (
              meetings.map(meeting => (
                <div
                  key={meeting.id}
                  className="bg-gradient-to-r from-white to-purple-50 rounded-xl p-6 shadow-md hover:shadow-lg transition border border-purple-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{meeting.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                        {meeting.status.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteMeeting(meeting.id)}
                      className="text-red-500 hover:text-red-700 transition p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={18} className="text-purple-600" />
                      <span className="text-sm">{meeting.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={18} className="text-purple-600" />
                      <span className="text-sm">{meeting.time} ({meeting.duration})</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      {meeting.type === 'video' ? (
                        <Video size={18} className="text-purple-600" />
                      ) : (
                        <MapPin size={18} className="text-purple-600" />
                      )}
                      <span className="text-sm">{meeting.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={18} className="text-purple-600" />
                      <span className="text-sm">{meeting.attendees} attendees</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-purple-100">
                    <button className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center gap-2">
                      <Edit2 size={16} />
                      Edit Meeting
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span className="font-medium">{meetings.length} total meetings</span>
              <span>{meetings.filter(m => m.status === 'upcoming').length} upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}