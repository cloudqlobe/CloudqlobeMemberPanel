import { useState } from 'react';
import { TrendingUp, Target, DollarSign, Users, Award, ChevronDown, ChevronUp, Plus, X, ShoppingCart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import Layout from '../../../layout/page';

export default function StaffPerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState(null);

  // Performance data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, target: 50000 },
    { month: 'Feb', revenue: 52000, target: 50000 },
    { month: 'Mar', revenue: 48000, target: 50000 },
    { month: 'Apr', revenue: 61000, target: 55000 }
  ];

  const weeklyPerformance = [
    { day: 'Mon', calls: 35, sales: 8, leads: 12 },
    { day: 'Tue', calls: 42, sales: 10, leads: 15 },
    { day: 'Wed', calls: 38, sales: 7, leads: 11 },
    { day: 'Thu', calls: 45, sales: 12, leads: 18 },
    { day: 'Fri', calls: 40, sales: 9, leads: 14 },
    { day: 'Sat', calls: 28, sales: 6, leads: 9 },
    { day: 'Sun', calls: 15, sales: 3, leads: 5 }
  ];

  const productSales = [
    { name: 'Mobile Plans', value: 45, color: '#3b82f6' },
    { name: 'Broadband', value: 30, color: '#10b981' },
    { name: 'Enterprise', value: 15, color: '#f59e0b' },
    { name: 'Accessories', value: 10, color: '#8b5cf6' }
  ];

  const departmentMetrics = [
    { dept: 'Sales', current: 156, previous: 142, unit: 'deals' },
    { dept: 'Marketing', current: 8500, previous: 7200, unit: 'leads' },
    { dept: 'Accounts', current: 98.5, previous: 96.2, unit: '%' }
  ];

  // Goals and achievements
  const [goals, setGoals] = useState([
    { id: 1, title: 'Quarterly Sales Target', current: 156000, target: 200000, unit: '$', deadline: '2025-12-31', status: 'active' },
    { id: 2, title: 'New Customer Acquisition', current: 45, target: 60, unit: 'customers', deadline: '2025-11-30', status: 'active' },
    { id: 3, title: 'Customer Satisfaction Score', current: 4.2, target: 4.5, unit: '/5', deadline: '2025-12-15', status: 'active' }
  ]);

  const achievements = [
    { id: 1, title: 'Top Performer', icon: '🏆', date: '2025-10-15', description: 'Achieved highest sales in Q3 2025' },
    { id: 2, title: 'Customer Champion', icon: '⭐', date: '2025-09-20', description: '95%+ satisfaction rating for 3 months' },
    { id: 3, title: 'Deal Closer', icon: '💼', date: '2025-08-10', description: 'Closed 10+ enterprise deals' }
  ];

  const recentActivities = [
    {
      id: 1,
      date: '2025-11-03',
      type: 'Sales Activity',
      summary: '12 calls, 3 deals closed',
      details: [
        { item: 'Enterprise Plan - ABC Corp', value: '$15,000', status: 'Closed' },
        { item: 'Mobile Bundle - John Smith', value: '$850', status: 'Closed' },
        { item: 'Broadband - Tech Solutions', value: '$2,400', status: 'Closed' },
        { item: 'Follow-ups completed', value: '8', status: 'Done' }
      ],
      notes: 'Excellent day with strong conversion rate'
    },
    {
      id: 2,
      date: '2025-11-01',
      type: 'Marketing Campaign',
      summary: 'Email campaign, 250 leads generated',
      details: [
        { item: 'Emails Sent', value: '5,000', status: 'Complete' },
        { item: 'Open Rate', value: '32%', status: 'Above Target' },
        { item: 'Click-through Rate', value: '8.5%', status: 'Above Target' },
        { item: 'Qualified Leads', value: '250', status: 'Delivered' }
      ],
      notes: 'Campaign performance exceeded expectations'
    }
  ];

  const stats = {
    totalRevenue: 206000,
    totalDeals: 156,
    customerBase: 842,
    avgDealSize: 1320,
    conversionRate: 24.5
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Performance Dashboard</h1>
          <p className="text-gray-600">Track your performance metrics and achievements</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-2">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-2">
                <ShoppingCart className="text-blue-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalDeals}</p>
              <p className="text-sm text-gray-600">Deals Closed</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-3 rounded-full mb-2">
                <Users className="text-purple-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.customerBase}</p>
              <p className="text-sm text-gray-600">Customers</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 p-3 rounded-full mb-2">
                <Target className="text-orange-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.avgDealSize)}</p>
              <p className="text-sm text-gray-600">Avg Deal Size</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col items-center">
              <div className="bg-red-100 p-3 rounded-full mb-2">
                <TrendingUp className="text-red-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.conversionRate}%</p>
              <p className="text-sm text-gray-600">Conversion</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Progress Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Revenue Performance</h2>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="Revenue" />
                  <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Activity Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Activity</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calls" fill="#3b82f6" name="Calls Made" />
                  <Bar dataKey="sales" fill="#10b981" name="Sales Closed" />
                  <Bar dataKey="leads" fill="#f59e0b" name="Leads Generated" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Department Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Department Performance</h2>
              <div className="space-y-4">
                {departmentMetrics.map((item, index) => {
                  const improvement = item.current - item.previous;
                  const improvementPercent = ((improvement / item.previous) * 100).toFixed(1);
                  return (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">{item.dept}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-800">
                            {item.unit === '$' ? formatCurrency(item.current) : `${item.current} ${item.unit}`}
                          </span>
                          <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                            +{improvementPercent}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((item.current / (item.current * 1.2)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">{activity.type}</h3>
                        <p className="text-sm text-gray-600">{formatDate(activity.date)} • {activity.summary}</p>
                      </div>
                      {expandedActivity === activity.id ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    {expandedActivity === activity.id && (
                      <div className="mt-4 pt-4 border-t-2 border-gray-200">
                        <div className="space-y-3">
                          {activity.details.map((detail, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                              <span className="font-medium text-gray-700">{detail.item}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-800 font-semibold">{detail.value}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  detail.status.includes('Closed') || detail.status.includes('Complete') || detail.status.includes('Above') 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {detail.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {activity.notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded">
                            <p className="text-sm text-gray-700"><strong>Notes:</strong> {activity.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Sales Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Sales by Product</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={productSales}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productSales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {productSales.map((product, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: product.color }}></div>
                      <span className="text-gray-700">{product.name}</span>
                    </div>
                    <span className="font-medium text-gray-800">{product.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Target size={22} />
                  Goals
                </h2>
                <button
                  onClick={() => setShowAddGoal(!showAddGoal)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showAddGoal ? <X size={18} /> : <Plus size={18} />}
                </button>
              </div>
              
              {showAddGoal && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">Add goal form would go here</p>
                </div>
              )}

              <div className="space-y-4">
                {goals.map((goal) => {
                  const progress = getProgressPercentage(goal.current, goal.target);
                  return (
                    <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                          <p className="text-sm text-gray-600">Due: {formatDate(goal.deadline)}</p>
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">
                            {goal.unit === '$' ? formatCurrency(goal.current) : goal.current}
                            {' / '}
                            {goal.unit === '$' ? formatCurrency(goal.target) : goal.target} {goal.unit !== '$' && goal.unit}
                          </span>
                          <span className="font-medium text-gray-800">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award size={22} />
                Achievements
              </h2>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(achievement.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Key Metrics</h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Customer Retention</span>
                    <span className="font-bold text-gray-800">94.5%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+2.3% from last month</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Lead Response Time</span>
                    <span className="font-bold text-gray-800">2.5 hrs</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">15% faster than target</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Customer Satisfaction</span>
                    <span className="font-bold text-gray-800">4.2/5.0</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Based on 156 reviews</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Upsell Rate</span>
                    <span className="font-bold text-gray-800">18.5%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Above industry average</p>
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