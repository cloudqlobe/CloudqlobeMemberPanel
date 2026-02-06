import React, { useState } from 'react';
import { Clock, Calendar, Users, FileText, AlertCircle, CheckCircle, Coffee, Briefcase, Home, Shield, Heart, Plane, DollarSign, Award, Bell, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import Layout from '../../../layout/page';

export default function EmployeeInfoPortal() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'attendance', name: 'Attendance & Timing', icon: Clock },
    { id: 'leave', name: 'Leave Policies', icon: Calendar },
    { id: 'benefits', name: 'Benefits', icon: Heart },
    { id: 'payroll', name: 'Payroll', icon: DollarSign },
    { id: 'policies', name: 'Work Policies', icon: FileText },
    { id: 'contact', name: 'Contact HR', icon: Phone },
  ];

  const leaveTypes = [
    { name: 'Annual Leave', days: 15, description: 'Paid vacation days per year', color: 'blue' },
    { name: 'Sick Leave', days: 10, description: 'Medical leave with certificate', color: 'red' },
    { name: 'Casual Leave', days: 7, description: 'Short notice personal leave', color: 'green' },
    { name: 'Maternity Leave', days: 90, description: 'For new mothers', color: 'pink' },
    { name: 'Paternity Leave', days: 7, description: 'For new fathers', color: 'purple' },
    { name: 'Bereavement Leave', days: 5, description: 'Family emergency', color: 'gray' },
  ];

  const benefits = [
    { title: 'Health Insurance', description: 'Comprehensive medical coverage for employee and family', icon: Heart },
    { title: 'Retirement Plan', description: '401(k) with 5% company match', icon: Award },
    { title: 'Professional Development', description: 'Annual training budget of $2,000', icon: Briefcase },
    { title: 'Flexible Hours', description: 'Core hours with flexible start/end times', icon: Clock },
    { title: 'Remote Work', description: '2 days work from home per week', icon: Home },
    { title: 'Wellness Program', description: 'Gym membership and wellness activities', icon: Heart },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">Welcome to the Employee Portal</h2>
        <p className="text-indigo-100">Your one-stop resource for company policies, benefits, and work information</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <Clock className="text-blue-600 mb-2" size={32} />
          <h3 className="font-bold text-gray-800 mb-1">Working Hours</h3>
          <p className="text-2xl font-bold text-blue-600">9:00 AM - 6:00 PM</p>
          <p className="text-sm text-gray-600 mt-1">Monday to Friday</p>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <Calendar className="text-green-600 mb-2" size={32} />
          <h3 className="font-bold text-gray-800 mb-1">Annual Leave</h3>
          <p className="text-2xl font-bold text-green-600">15 Days</p>
          <p className="text-sm text-gray-600 mt-1">Plus public holidays</p>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <Heart className="text-purple-600 mb-2" size={32} />
          <h3 className="font-bold text-gray-800 mb-1">Health Coverage</h3>
          <p className="text-2xl font-bold text-purple-600">Full Family</p>
          <p className="text-sm text-gray-600 mt-1">Medical & dental</p>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
        <div className="flex items-start gap-3">
          <Bell className="text-amber-600 mt-1" size={20} />
          <div>
            <h4 className="font-bold text-amber-800 mb-1">Important Reminder</h4>
            <p className="text-amber-700 text-sm">Don't forget to punch in/out daily and submit leave requests 3 days in advance when possible.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="text-indigo-600" />
          Attendance & Time Punching
        </h2>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Working Hours</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Regular Schedule</h4>
            <div className="space-y-2 text-gray-600">
              <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
              <p><strong>Lunch Break:</strong> 1:00 PM - 2:00 PM</p>
              <p><strong>Total Hours:</strong> 40 hours/week</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Flexible Hours</h4>
            <div className="space-y-2 text-gray-600">
              <p><strong>Core Hours:</strong> 10:00 AM - 4:00 PM (must be present)</p>
              <p><strong>Flexible Start:</strong> 8:00 AM - 10:00 AM</p>
              <p><strong>Flexible End:</strong> 5:00 PM - 7:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Time Punching Procedures</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <h4 className="font-semibold text-gray-800">Punch In</h4>
              <p className="text-gray-600 text-sm">Use the biometric system or mobile app when you arrive. Must punch in before 9:15 AM to avoid being marked late.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <h4 className="font-semibold text-gray-800">Lunch Break</h4>
              <p className="text-gray-600 text-sm">Punch out for lunch and punch back in. Maximum 1-hour break allowed.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <h4 className="font-semibold text-gray-800">Punch Out</h4>
              <p className="text-gray-600 text-sm">Punch out before leaving for the day. Ensure you complete your required hours.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
          <AlertCircle size={20} />
          Attendance Rules
        </h4>
        <ul className="space-y-1 text-red-700 text-sm">
          <li>• Late arrival (after 9:15 AM) more than 3 times/month will be reported</li>
          <li>• Forgot to punch? Submit a manual attendance request to HR by end of day</li>
          <li>• Unauthorized absence may result in salary deduction</li>
          <li>• Half-day is counted if present for less than 5 hours</li>
        </ul>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Overtime Policy</h3>
        <div className="space-y-3 text-gray-600">
          <p><strong>Overtime Rate:</strong> 1.5x regular hourly rate</p>
          <p><strong>Eligibility:</strong> Work beyond 8 hours/day with manager approval</p>
          <p><strong>Compensation:</strong> Paid with next month's salary or compensatory off</p>
          <p><strong>Request Process:</strong> Submit overtime request form before working extra hours</p>
        </div>
      </div>
    </div>
  );

  const renderLeave = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="text-indigo-600" />
          Leave Policies & Entitlements
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {leaveTypes.map((leave, idx) => (
          <div key={idx} className={`bg-${leave.color}-50 border-2 border-${leave.color}-200 rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">{leave.name}</h3>
              <span className={`text-2xl font-bold text-${leave.color}-600`}>{leave.days}</span>
            </div>
            <p className="text-sm text-gray-600">{leave.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Leave Application Process</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800">Step 1: Submit Request</h4>
              <p className="text-gray-600 text-sm">Log into HR portal and submit leave application at least 3 days in advance (except emergencies)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800">Step 2: Manager Approval</h4>
              <p className="text-gray-600 text-sm">Your direct manager will review and approve/reject within 24 hours</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-gray-800">Step 3: Confirmation</h4>
              <p className="text-gray-600 text-sm">You'll receive email confirmation. HR will update your leave balance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Important Leave Rules</h3>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-start gap-2">
            <ChevronRight className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
            <p><strong>Carryover:</strong> Up to 5 unused annual leave days can be carried to next year</p>
          </div>
          <div className="flex items-start gap-2">
            <ChevronRight className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
            <p><strong>Medical Certificate:</strong> Required for sick leave exceeding 2 consecutive days</p>
          </div>
          <div className="flex items-start gap-2">
            <ChevronRight className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
            <p><strong>Advance Notice:</strong> Annual leave requires 1 week notice, casual leave 3 days notice</p>
          </div>
          <div className="flex items-start gap-2">
            <ChevronRight className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
            <p><strong>Peak Periods:</strong> Leave during busy seasons requires special approval</p>
          </div>
          <div className="flex items-start gap-2">
            <ChevronRight className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
            <p><strong>Emergency Leave:</strong> Notify manager immediately and submit form within 24 hours</p>
          </div>
          <div className="flex items-start gap-2">
            <ChevronRight className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
            <p><strong>Unpaid Leave:</strong> Available after exhausting all paid leave, requires HR approval</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="font-bold text-blue-800 mb-2">Public Holidays</h4>
        <p className="text-blue-700 text-sm mb-2">The company observes 12 public holidays per year in addition to your leave entitlement:</p>
        <p className="text-blue-700 text-sm">New Year's Day, Republic Day, Holi, Good Friday, Eid, Independence Day, Dussehra, Diwali, Christmas, and 3 regional holidays</p>
      </div>
    </div>
  );

  const renderBenefits = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Heart className="text-indigo-600" />
          Employee Benefits & Perks
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
              <Icon className="text-indigo-600 mb-3" size={32} />
              <h3 className="font-bold text-gray-800 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Perks</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Coffee className="text-amber-600" size={18} />
              <span>Free coffee, tea & snacks</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Plane className="text-blue-600" size={18} />
              <span>Travel allowance for business trips</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Award className="text-purple-600" size={18} />
              <span>Performance bonuses</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="text-green-600" size={18} />
              <span>Team building activities</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="text-indigo-600" size={18} />
              <span>Life & disability insurance</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Briefcase className="text-red-600" size={18} />
              <span>Laptop & equipment provided</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayroll = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="text-indigo-600" />
          Payroll Information
        </h2>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Salary Payment Schedule</h3>
        <div className="space-y-3 text-gray-600">
          <p><strong>Payment Date:</strong> Last working day of each month</p>
          <p><strong>Payment Method:</strong> Direct bank deposit</p>
          <p><strong>Salary Slip:</strong> Available in HR portal by 1st of following month</p>
          <p><strong>Tax Deduction:</strong> TDS deducted as per Income Tax Act</p>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Salary Components</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded">
            <span className="font-semibold text-gray-700">Basic Salary</span>
            <span className="text-gray-600">40% of CTC</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span className="font-semibold text-gray-700">House Rent Allowance (HRA)</span>
            <span className="text-gray-600">20% of CTC</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
            <span className="font-semibold text-gray-700">Special Allowance</span>
            <span className="text-gray-600">25% of CTC</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-amber-50 rounded">
            <span className="font-semibold text-gray-700">Employer PF Contribution</span>
            <span className="text-gray-600">12% of Basic</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-red-50 rounded">
            <span className="font-semibold text-gray-700">Medical Insurance</span>
            <span className="text-gray-600">3% of CTC</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Deductions</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <ChevronRight className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
            <span><strong>Provident Fund (PF):</strong> 12% of basic salary (mandatory)</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
            <span><strong>Professional Tax:</strong> As per state regulations</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
            <span><strong>Income Tax (TDS):</strong> Based on declared investments</span>
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
            <span><strong>Loan Repayment:</strong> If applicable</span>
          </li>
        </ul>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <h4 className="font-bold text-green-800 mb-2">Annual Increment</h4>
        <p className="text-green-700 text-sm">Performance-based salary review conducted in April each year. Average increment ranges from 8-15% based on performance rating.</p>
      </div>
    </div>
  );

  const renderPolicies = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="text-indigo-600" />
          Company Policies & Code of Conduct
        </h2>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Dress Code</h3>
        <div className="space-y-2 text-gray-600">
          <p><strong>Monday - Thursday:</strong> Business casual attire</p>
          <p><strong>Friday:</strong> Smart casual (jeans allowed)</p>
          <p><strong>Client Meetings:</strong> Formal business attire required</p>
          <p className="text-sm text-gray-500 mt-3">Please maintain professional appearance at all times.</p>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Remote Work Policy</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={18} />
            <span>2 days per week work from home allowed after probation</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={18} />
            <span>Must be available during core hours (10 AM - 4 PM)</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={18} />
            <span>Inform manager at least 1 day in advance</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={18} />
            <span>Maintain same productivity and communication standards</span>
          </li>
        </ul>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Confidentiality & Data Security</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <Shield className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
            <span>All company data is confidential and must not be shared externally</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
            <span>Use only company-approved devices and software</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
            <span>Lock your computer when away from desk</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
            <span>Report any security incidents immediately</span>
          </li>
        </ul>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Workplace Conduct</h3>
        <div className="space-y-3 text-gray-600">
          <p>We maintain a respectful, inclusive workplace. The following are strictly prohibited:</p>
          <ul className="space-y-1 ml-4">
            <li>• Harassment or discrimination of any kind</li>
            <li>• Use of offensive or abusive language</li>
            <li>• Alcohol or drugs on company premises</li>
            <li>• Violence or threatening behavior</li>
            <li>• Theft or misuse of company property</li>
          </ul>
          <p className="text-sm text-gray-500 mt-3">Violations will result in disciplinary action up to termination.</p>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Resignation & Notice Period</h3>
        <div className="space-y-2 text-gray-600">
          <p><strong>Notice Period:</strong> 30 days for employees, 60 days for senior positions</p>
          <p><strong>Early Release:</strong> Possible with mutual agreement and handover completion</p>
          <p><strong>Exit Interview:</strong> Mandatory with HR before final working day</p>
          <p><strong>Full & Final Settlement:</strong> Processed within 45 days of last working day</p>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Phone className="text-indigo-600" />
          Contact HR Department
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">HR Department</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone className="text-indigo-600 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-800">Phone</p>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-indigo-600 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-600">hr@company.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-indigo-600 mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-800">Location</p>
                <p className="text-gray-600">3rd Floor, HR Wing</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Office Hours</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="text-green-600" size={20} />
              <div>
                <p className="font-semibold text-gray-800">Monday - Friday</p>
                <p className="text-gray-600">9:00 AM - 6:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Coffee className="text-green-600" size={20} />
              <div>
                <p className="font-semibold text-gray-800">Lunch Break</p>
                <p className="text-gray-600">1:00 PM - 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">HR Team Members</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              SM
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">Sarah Miller</h4>
              <p className="text-sm text-gray-600">HR Manager</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>sarah.miller@company.com</p>
              <p>Ext: 1234</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              JD
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">James Davis</h4>
              <p className="text-sm text-gray-600">Payroll Specialist</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>james.davis@company.com</p>
              <p>Ext: 1235</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              EP
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">Emma Parker</h4>
              <p className="text-sm text-gray-600">Benefits Coordinator</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>emma.parker@company.com</p>
              <p>Ext: 1236</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="font-bold text-blue-800 mb-2">Quick Tips</h4>
        <ul className="space-y-1 text-blue-700 text-sm">
          <li>• For urgent matters, call the HR hotline directly</li>
          <li>• Non-urgent queries can be submitted via email</li>
          <li>• Anonymous feedback can be submitted through the company portal</li>
          <li>• Walk-in hours: Monday to Friday, 2:00 PM - 5:00 PM</li>
        </ul>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'attendance': return renderAttendance();
      case 'leave': return renderLeave();
      case 'benefits': return renderBenefits();
      case 'payroll': return renderPayroll();
      case 'policies': return renderPolicies();
      case 'contact': return renderContact();
      default: return renderOverview();
    }
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 bg-indigo-600 text-white">
            <h1 className="text-xl font-bold">Employee Portal</h1>
            <p className="text-sm text-indigo-200 mt-1">Information Hub</p>
          </div>
          <nav className="p-4">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    activeSection === section.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderSection()}
        </div>
      </div>
    </div>
    </Layout>
  );
}