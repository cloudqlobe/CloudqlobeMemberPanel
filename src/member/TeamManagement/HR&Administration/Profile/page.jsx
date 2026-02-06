import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Edit2, Save, X } from 'lucide-react';
import Layout from '../../../layout/page';

export default function MemberProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    membershipType: 'Premium',
    memberSince: '2023-01-15',
    membershipStatus: 'Active',
    renewalDate: '2025-12-15',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 (555) 987-6543'
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-600">{profile.membershipType} Member</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 size={18} />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={18} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User size={20} />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.firstName}
                  onChange={(e) => setTempProfile({ ...tempProfile, firstName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-800 p-2">{profile.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.lastName}
                  onChange={(e) => setTempProfile({ ...tempProfile, lastName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-800 p-2">{profile.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-800 p-2 flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  {profile.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempProfile.phone}
                  onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-800 p-2 flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  {profile.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={tempProfile.dateOfBirth}
                  onChange={(e) => setTempProfile({ ...tempProfile, dateOfBirth: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-800 p-2">
                  {formatDate(profile.dateOfBirth)} ({calculateAge(profile.dateOfBirth)} years)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.address}
                  onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-800 p-2 flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  {profile.address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.city}
                  onChange={(e) => setTempProfile({ ...tempProfile, city: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-800 p-2">{profile.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">State</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.state}
                  onChange={(e) => setTempProfile({ ...tempProfile, state: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-800 p-2">{profile.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">ZIP Code</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.zipCode}
                  onChange={(e) => setTempProfile({ ...tempProfile, zipCode: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-800 p-2">{profile.zipCode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Membership Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard size={20} />
            Membership Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Membership Type</label>
              {isEditing ? (
                <select
                  value={tempProfile.membershipType}
                  onChange={(e) => setTempProfile({ ...tempProfile, membershipType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              ) : (
                <p className="text-gray-800 p-2">{profile.membershipType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <p className="p-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile.membershipStatus === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {profile.membershipStatus}
                </span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
              <p className="text-gray-800 p-2 flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                {formatDate(profile.memberSince)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Renewal Date</label>
              {isEditing ? (
                <input
                  type="date"
                  value={tempProfile.renewalDate}
                  onChange={(e) => setTempProfile({ ...tempProfile, renewalDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-800 p-2 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  {formatDate(profile.renewalDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Contact Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.emergencyContact}
                  onChange={(e) => setTempProfile({ ...tempProfile, emergencyContact: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-800 p-2">{profile.emergencyContact}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Contact Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempProfile.emergencyPhone}
                  onChange={(e) => setTempProfile({ ...tempProfile, emergencyPhone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-800 p-2 flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  {profile.emergencyPhone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}