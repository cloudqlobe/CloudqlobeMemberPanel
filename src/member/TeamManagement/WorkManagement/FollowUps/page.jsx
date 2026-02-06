import { useState } from 'react';
import { Plus, Check, Clock, AlertCircle, Edit2, Trash2, X, Save, Calendar } from 'lucide-react';
import Layout from '../../../layout/page';

export default function FollowupsPage() {
  const [followups, setFollowups] = useState([
    {
      id: 1,
      memberName: 'John Doe',
      subject: 'Membership renewal discussion',
      dueDate: '2025-11-10',
      priority: 'high',
      status: 'pending',
      notes: 'Follow up on membership renewal options',
      createdDate: new Date().toISOString()
    },
    {
      id: 2,
      memberName: 'Jane Smith',
      subject: 'Schedule training session',
      dueDate: '2025-11-06',
      priority: 'medium',
      status: 'pending',
      notes: 'Coordinate availability for personal training',
      createdDate: new Date().toISOString()
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newFollowup, setNewFollowup] = useState({
    memberName: '',
    subject: '',
    dueDate: '',
    priority: 'medium',
    notes: ''
  });

  const addFollowup = () => {
    if (newFollowup.memberName.trim() && newFollowup.subject.trim()) {
      const followup = {
        id: Date.now(),
        ...newFollowup,
        status: 'pending',
        createdDate: new Date().toISOString()
      };
      setFollowups([followup, ...followups]);
      setNewFollowup({
        memberName: '',
        subject: '',
        dueDate: '',
        priority: 'medium',
        notes: ''
      });
      setIsAdding(false);
    }
  };

  const toggleStatus = (id) => {
    setFollowups(followups.map(f => 
      f.id === id 
        ? { ...f, status: f.status === 'pending' ? 'completed' : 'pending' }
        : f
    ));
  };

  const deleteFollowup = (id) => {
    setFollowups(followups.filter(f => f.id !== id));
  };

  const saveEdit = (id, updated) => {
    setFollowups(followups.map(f => 
      f.id === id ? { ...f, ...updated } : f
    ));
    setEditingId(null);
  };

  const getFilteredFollowups = () => {
    if (filter === 'all') return followups;
    if (filter === 'pending') return followups.filter(f => f.status === 'pending');
    if (filter === 'completed') return followups.filter(f => f.status === 'completed');
    if (filter === 'overdue') {
      return followups.filter(f => 
        f.status === 'pending' && f.dueDate && new Date(f.dueDate) < new Date()
      );
    }
    return followups;
  };

  const filteredFollowups = getFilteredFollowups();
  const pendingCount = followups.filter(f => f.status === 'pending').length;
  const overdueCount = followups.filter(f => 
    f.status === 'pending' && f.dueDate && new Date(f.dueDate) < new Date()
  ).length;

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Follow-ups</h1>
          <p className="text-gray-600">Track and manage member interactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Overdue</p>
                <p className="text-2xl font-bold text-gray-800">{overdueCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Check className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {followups.filter(f => f.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-2 mb-6 flex gap-2 overflow-x-auto">
          {['all', 'pending', 'overdue', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Add Follow-up Button */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full mb-6 bg-white border-2 border-dashed border-purple-300 rounded-lg p-4 flex items-center justify-center gap-2 text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-all"
          >
            <Plus size={20} />
            <span className="font-medium">Add New Follow-up</span>
          </button>
        )}

        {/* Add Follow-up Form */}
        {isAdding && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-purple-400">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">New Follow-up</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Member Name"
                value={newFollowup.memberName}
                onChange={(e) => setNewFollowup({ ...newFollowup, memberName: e.target.value })}
                className="p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
              />
              <input
                type="text"
                placeholder="Subject"
                value={newFollowup.subject}
                onChange={(e) => setNewFollowup({ ...newFollowup, subject: e.target.value })}
                className="p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
              />
              <input
                type="date"
                value={newFollowup.dueDate}
                onChange={(e) => setNewFollowup({ ...newFollowup, dueDate: e.target.value })}
                className="p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
              />
              <select
                value={newFollowup.priority}
                onChange={(e) => setNewFollowup({ ...newFollowup, priority: e.target.value })}
                className="p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <textarea
              placeholder="Notes (optional)"
              value={newFollowup.notes}
              onChange={(e) => setNewFollowup({ ...newFollowup, notes: e.target.value })}
              rows="3"
              className="w-full mt-4 p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none resize-none"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={addFollowup}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Save size={18} />
                Save Follow-up
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewFollowup({
                    memberName: '',
                    subject: '',
                    dueDate: '',
                    priority: 'medium',
                    notes: ''
                  });
                }}
                className="flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Follow-ups List */}
        <div className="space-y-4">
          {filteredFollowups.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-xl">No follow-ups found</p>
            </div>
          ) : (
            filteredFollowups.map(followup => (
              <FollowupCard
                key={followup.id}
                followup={followup}
                isEditing={editingId === followup.id}
                onEdit={() => setEditingId(followup.id)}
                onSave={saveEdit}
                onCancel={() => setEditingId(null)}
                onToggle={() => toggleStatus(followup.id)}
                onDelete={() => deleteFollowup(followup.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
    </Layout>
  );
}

function FollowupCard({ followup, isEditing, onEdit, onSave, onCancel, onToggle, onDelete }) {
  const [editData, setEditData] = useState(followup);

  const isOverdue = followup.status === 'pending' && 
    followup.dueDate && 
    new Date(followup.dueDate) < new Date();

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-purple-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={editData.memberName}
            onChange={(e) => setEditData({ ...editData, memberName: e.target.value })}
            className="p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
            placeholder="Member Name"
          />
          <input
            type="text"
            value={editData.subject}
            onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
            className="p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
            placeholder="Subject"
          />
          <input
            type="date"
            value={editData.dueDate}
            onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
            className="p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
          />
          <select
            value={editData.priority}
            onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
            className="p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <textarea
          value={editData.notes}
          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
          rows="3"
          className="w-full mt-4 p-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none resize-none"
          placeholder="Notes"
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onSave(followup.id, editData)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Save size={18} />
            Save
          </button>
          <button
            onClick={() => {
              setEditData(followup);
              onCancel();
            }}
            className="flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${
      followup.status === 'completed' ? 'opacity-60' : ''
    } ${isOverdue ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-xl font-semibold ${
              followup.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
            }`}>
              {followup.memberName}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[followup.priority]}`}>
              {followup.priority.toUpperCase()}
            </span>
            {followup.status === 'completed' && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                COMPLETED
              </span>
            )}
          </div>
          <p className="text-gray-700 font-medium mb-2">{followup.subject}</p>
          {followup.notes && (
            <p className="text-gray-600 text-sm mb-3">{followup.notes}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {isOverdue ? 'Overdue: ' : 'Due: '}
              {formatDate(followup.dueDate)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-colors ${
              followup.status === 'completed'
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={followup.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            <Check size={20} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit follow-up"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete follow-up"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}