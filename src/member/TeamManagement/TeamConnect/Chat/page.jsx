import React, { useState } from 'react';
import { Send, Plus, Hash, Lock, Users, Settings, Bell, Search, Paperclip, Smile, MoreVertical, Video, Phone, UserPlus, Crown, Shield, User, X, Check } from 'lucide-react';
import Layout from '../../../layout/page';

const TeamChatApp = () => {
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [message, setMessage] = useState('');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [userRole, setUserRole] = useState('admin');
  
  const [channels] = useState([
    { id: 'general', name: 'general', type: 'public', unread: 0 },
    { id: 'dev-team', name: 'dev-team', type: 'public', unread: 3 },
    { id: 'design', name: 'design', type: 'public', unread: 0 },
    { id: 'leadership', name: 'leadership', type: 'private', unread: 1 },
  ]);

  const [members] = useState([
    { id: 1, name: 'Sarah Chen', role: 'superadmin', status: 'online', avatar: 'SC' },
    { id: 2, name: 'Mike Johnson', role: 'admin', status: 'online', avatar: 'MJ' },
    { id: 3, name: 'Emma Wilson', role: 'member', status: 'away', avatar: 'EW' },
    { id: 4, name: 'James Lee', role: 'member', status: 'offline', avatar: 'JL' },
    { id: 5, name: 'Lisa Park', role: 'member', status: 'online', avatar: 'LP' },
  ]);

  const [messages] = useState([
    {
      id: 1,
      user: 'Sarah Chen',
      avatar: 'SC',
      role: 'superadmin',
      content: 'Hey team! Just pushed the latest updates to the main branch. Please review when you get a chance.',
      time: '10:30 AM',
      reactions: { '👍': 3, '🎉': 1 }
    },
    {
      id: 2,
      user: 'Mike Johnson',
      avatar: 'MJ',
      role: 'admin',
      content: 'Looking good! I\'ll start testing the new features this afternoon.',
      time: '10:35 AM',
      reactions: { '👍': 2 }
    },
    {
      id: 3,
      user: 'Emma Wilson',
      avatar: 'EW',
      role: 'member',
      content: 'Can someone help me with the authentication flow? I\'m getting a 401 error.',
      time: '11:15 AM',
      reactions: {}
    },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      // Message sending logic here
      setMessage('');
      setUserRole();
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'superadmin') return <Crown className="w-3 h-3 text-yellow-500" />;
    if (role === 'admin') return <Shield className="w-3 h-3 text-blue-500" />;
    return null;
  };

  const getStatusColor = (status) => {
    if (status === 'online') return 'bg-green-500';
    if (status === 'away') return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <Layout>
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-purple-50 text-gray-900">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Project Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TeamHub Pro
            </h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search channels..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Channels</h3>
            {(userRole === 'admin' || userRole === 'superadmin') && (
              <button className="p-1 hover:bg-gray-100 rounded transition-all">
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
          
          {channels.map(channel => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`w-full flex items-center justify-between p-2 mb-1 rounded-lg transition-all ${
                selectedChannel === channel.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {channel.type === 'private' ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Hash className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{channel.name}</span>
              </div>
              {channel.unread > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {channel.unread}
                </span>
              )}
            </button>
          ))}

          {/* Team Members */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Team Members</h3>
              <button 
                onClick={() => setShowMemberModal(true)}
                className="p-1 hover:bg-gray-100 rounded transition-all"
              >
                <UserPlus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {members.map(member => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all mb-1 cursor-pointer"
              >
<div className="relative">
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 
    flex items-center justify-center font-semibold text-xs">
    {member.avatar}
  </div>

  <div
    className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(
      member.status
    )} rounded-full border-2 border-white`}
  />
</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium truncate text-gray-900">{member.name}</span>
                    {getRoleBadge(member.role)}
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-purple-600" />
            <div>
              <h2 className="font-semibold text-gray-900">{selectedChannel}</h2>
              <p className="text-xs text-gray-500">
                {members.filter(m => m.status === 'online').length} members online
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <Users className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map(msg => (
            <div key={msg.id} className="group hover:bg-white p-3 rounded-lg transition-all">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-semibold flex-shrink-0 text-white">
                  {msg.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{msg.user}</span>
                    {getRoleBadge(msg.role)}
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{msg.content}</p>
                  {Object.keys(msg.reactions).length > 0 && (
                    <div className="flex gap-2">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-sm transition-all border border-gray-200"
                        >
                          <span>{emoji}</span>
                          <span className="text-xs text-gray-600">{count}</span>
                        </button>
                      ))}
                      <button className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-sm transition-all opacity-0 group-hover:opacity-100 border border-gray-200">
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg border border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
            <div className="flex items-center gap-2 p-3">
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-all">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
placeholder={`Message #${selectedChannel}`}
                className="flex-1 bg-transparent outline-none text-gray-900"
              />
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-all">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={sendMessage}
                className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Team Member</h3>
              <button
                onClick={() => setShowMemberModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Role</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all border border-gray-200">
                    <input type="radio" name="role" value="member" defaultChecked className="text-purple-600" />
                    <User className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Member</div>
                      <div className="text-xs text-gray-500">Can view and participate in channels</div>
                    </div>
                  </label>
                  
                  {(userRole === 'admin' || userRole === 'superadmin') && (
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all border border-gray-200">
                      <input type="radio" name="role" value="admin" className="text-purple-600" />
                      <Shield className="w-4 h-4 text-blue-500" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Admin</div>
                        <div className="text-xs text-gray-500">Can manage channels and members</div>
                      </div>
                    </label>
                  )}
                  
                  {userRole === 'superadmin' && (
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all border border-gray-200">
                      <input type="radio" name="role" value="superadmin" className="text-purple-600" />
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Super Admin</div>
                        <div className="text-xs text-gray-500">Full access to all features</div>
                      </div>
                    </label>
                  )}
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-white shadow-lg">
                <Check className="w-5 h-5" />
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default TeamChatApp;