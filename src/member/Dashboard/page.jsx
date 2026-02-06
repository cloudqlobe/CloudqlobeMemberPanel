import React, { useContext, useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import { LuTarget } from "react-icons/lu";
import { SiLightning } from "react-icons/si";
import { GiWallet } from "react-icons/gi";
import { Area, XAxis, YAxis, CartesianGrid } from "recharts";

import {
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Layout from "../layout/page";
import AuthContext from "../../context/AuthContext";
import { useLoader } from "../../context/LoaderContext/page";
import axiosInstance from "../../utils/axiosinstance";

// Pie Chart Data
const pieData = [
  { name: 'Achieved', value: 75, color: '#22c55e' }, // Green
  { name: 'Pending', value: 25, color: '#ef4444' },  // Red
];


const handleCountrySearch = (query) => {
  // Filter or search logic here
};


// Growth data for the new tabbed graph
const growthStats = {
  leads: [
    { name: "Apr 1", value: 132 },
    { name: "Apr 5", value: 134 },
    { name: "Apr 10", value: 130 },
    { name: "Apr 15", value: 136 },
    { name: "Apr 20", value: 133 },
    { name: "Apr 25", value: 138 },
    { name: "Apr 30", value: 135 },
    { name: "May 5", value: 139 },
    { name: "May 10", value: 137 },
    { name: "May 15", value: 143 },
    { name: "May 20", value: 140 },
    { name: "May 25", value: 144 },
    { name: "May 30", value: 142 },
  ],
  customers: [
    { name: "Apr 1", value: 80 },
    { name: "Apr 5", value: 82 },
    { name: "Apr 10", value: 79 },
    { name: "Apr 15", value: 85 },
    { name: "Apr 20", value: 81 },
    { name: "Apr 25", value: 87 },
    { name: "Apr 30", value: 83 },
    { name: "May 5", value: 88 },
    { name: "May 10", value: 84 },
    { name: "May 15", value: 90 },
    { name: "May 20", value: 86 },
    { name: "May 25", value: 91 },
    { name: "May 30", value: 89 },
    { name: "Apr 1", value: 80 },
    { name: "Apr 5", value: 82 },
    { name: "Apr 10", value: 79 },
    { name: "Apr 15", value: 85 },
    { name: "Apr 20", value: 81 },
    { name: "Apr 25", value: 87 },
    { name: "Apr 30", value: 83 },
    { name: "May 5", value: 88 },
    { name: "May 10", value: 84 },
    { name: "May 15", value: 90 },
    { name: "May 20", value: 86 },
    { name: "May 25", value: 91 },
    { name: "May 30", value: 89 },
  ],
  carriers: [
    { name: "Apr 1", value: 60 },
    { name: "Apr 5", value: 62 },
    { name: "Apr 10", value: 59 },
    { name: "Apr 15", value: 65 },
    { name: "Apr 20", value: 61 },
    { name: "Apr 25", value: 67 },
    { name: "Apr 30", value: 63 },
    { name: "May 5", value: 68 },
    { name: "May 10", value: 64 },
    { name: "May 15", value: 70 },
    { name: "May 20", value: 66 },
    { name: "May 25", value: 71 },
    { name: "May 30", value: 69 },

  ],
};


const MemberDashboard = () => {
  const { memberDetails } = useContext(AuthContext);
  const { setIsLoading } = useLoader();
const [activeLeads, setActiveLeads] = useState([]);
const [activeCustomers, setActiveCustomers] = useState([]);
const [activeCarriers, setActiveCarriers] = useState([]);

  useEffect(() => {
const fetchCustomers = async () => {
  setIsLoading(true);
  try {
    let data = [];

    if (
      memberDetails.role === "salemember" ||
      memberDetails.role === "leadmember"
    ) {
      const response = await axiosInstance.get(
        `api/member/lead/${memberDetails.id}`
      );
      data = response.data.customer || [];
    }

    // ✅ FILTERING
    const leads = data.filter(
      (item) =>
        item.customerStatus === "active" &&
        item.leadType === "New lead"
    );

    const customers = data.filter(
      (item) =>
        item.customerStatus === "active" &&
        item.leadType === "Customer"
    );

    const carriers = data.filter(
      (item) =>
        item.customerStatus === "active" &&
        item.leadType === "Carrier"
    );

    // ✅ SET STATE
    setActiveLeads(leads);
    setActiveCustomers(customers);
    setActiveCarriers(carriers);

  } catch (error) {
    console.error("Error fetching customers:", error);
  } finally {
    setIsLoading(false);
  }
};


    if (memberDetails?.id) {
      fetchCustomers();
    }
  }, [memberDetails.id, memberDetails.role, setIsLoading]);

  if (!memberDetails || !memberDetails.id) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500 text-lg">You are not authorized to view this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white p-6">
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <StatCard
            title="Total Sales"
            description="Total Profit revenue"
            icon={<LuTarget size={48} className="text-white" />}
            iconBg="bg-[#457B9D]"
            color="bg-white text-[#E63946] border border-[#FECACA]"
            tabData={[
              { label: "Total", value: "0" },
              { label: "Monthly", value: "0" },
              { label: "Weekly", value: "0" },
            ]}
          />
          <StatCard
            title="Net Profit"
            description="Joined this month"
            icon={<SiLightning size={48} className="text-white" />}
            iconBg="bg-[#2A9D8F]"
            color="bg-white text-[#2A9D8F] border border-[#C0EDEA]"
            tabData={[
              { label: "Total", value: "0" },
              { label: "Monthly", value: "0" },
              { label: "Weekly", value: "0" },
            ]}
          />
          <StatCard
            title="Agent Wallet"
            description="Your Active Wallet"
            icon={<GiWallet size={48} className="text-white" />}
            iconBg="bg-red-500"
            color="bg-white text-[#457B9D] border border-[#CFE7F0]"
            tabData={[
              { label: "Total", value: "0" },
              { label: "Monthly", value: "0" },
              { label: "Weekly", value: "0" },
            ]}
          />
        </div>

        {/* Bottom Section */}
        <div className="flex gap-6 overflow-x-auto">
          <div className="flex flex-col gap-6 min-w-[calc(280px*4+48px)]">
            <div className="flex gap-4">
<MiniCard
  title="Active Leads"
  borderColor="border-orange-400"
  tabs={[
    { label: "Weekly", value: activeLeads.length },
    { label: "Monthly", value: activeLeads.length },
    { label: "Total", value: activeLeads.length },
  ]}
  growthData={growthStats.leads}
/>

<MiniCard
  title="Active Customers"
  borderColor="border-blue-400"
  tabs={[
    { label: "Weekly", value: activeCustomers.length },
    { label: "Monthly", value: activeCustomers.length },
    { label: "Total", value: activeCustomers.length },
  ]}
  growthData={growthStats.customers}
/>

<MiniCard
  title="Active Carriers"
  borderColor="border-green-400"
  tabs={[
    { label: "Local", value: activeCarriers.length },
    { label: "Global", value: activeCarriers.length },
    { label: "Total", value: activeCarriers.length },
  ]}
  growthData={growthStats.carriers}
/>

              <div className="min-w-[580px] border border-orange-400 squared-2xl p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-orange-700">Search</h3>
                <p className="text-sm text-gray-600 mb-3">Connecting continents</p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search by country..."
                    className="w-full p-2 text-sm border squared-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                    onChange={(e) => handleCountrySearch(e.target.value)}
                  />
                  <button
                    onClick={() => console.log("Search clicked")}
                    className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
                  >
                    Search
                  </button>
                </div>
              </div>

            </div>




            {/* New Tabbed Growth Chart Section */}
            <GrowthTabChart />
          </div>

          {/* Pie Chart Section */}
          <div className="rounded-lg p-6 min-w-[580px] h-[450px] bg-white border border-gray-300 flex flex-col items-center justify-center mt-[195px] ml-[-350px] shadow-md">
            <p className="text-xl font-semibold text-gray-800 text-center mb-4">
              Target Achievement Overview
            </p>
            <PieChart width={400} height={300}> {/* Increased chart size */}
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={130}   // Increased outer radius
                innerRadius={70}    // Increased inner radius
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) =>
                  ` ${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={40} />
            </PieChart>
          </div>
        </div>
      </div>
    </Layout>

  );
};

// StatCard Component
const StatCard = ({ title, description, icon, iconBg, color, tabData }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div
      className={`relative squared-lg p-6 flex justify-between items-center h-[230px] shadow-sm hover:shadow-md transition-shadow duration-300 ${color}`}
    >
      <div className="absolute top-4 right-4 bg-white rounded-lg border border-gray-300 shadow-sm flex gap-2 p-1 px-3 z-10">
        {tabData.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`text-xs font-medium px-3 py-1 rounded ${activeTab === index
              ? "text-orange-600"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="w-[55%] flex flex-col justify-center h-full">
        <div className="flex items-center gap-4 mt-[30px]">
          <div
            className={`rounded-full w-20 h-20 flex items-center justify-center ${iconBg}`}
          >
            {icon}
          </div>
          <div>
            <p className="text-lg font-semibold">{title}</p>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
      <div className="w-[40%] flex items-center justify-center h-full mt-[30px]">
        <div className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-3 squared-xl">
          <DollarSign size={18} className="text-green-500" />
          <span className="text-3xl font-default tracking-wide">
            {tabData[activeTab].value}
          </span>
        </div>
      </div>
    </div>
  );
};

// MiniCard Component with optional LineChart
const MiniCard = ({ title, tabs, borderColor, growthData }) => {
  return (
    <div
      className={`squared-lg p-4 flex flex-col items-center justify-center h-[170px] min-w-[280px] border ${borderColor} bg-white`}
    >
      <p className="text-base font-semibold text-gray-700 text-center">{title}</p>
      <h2 className="text-2xl font-bold text-gray-900 mt-2 text-center">
        {tabs[0].value}
      </h2>

    </div>
  );
};

// New Component: GrowthTabChart


const GrowthTabChart = () => {
  const [tab, setTab] = React.useState("leads");

  return (
    <div className="bg-white max-w-[870px] border border-gray-300 rounded-lg p-4">
      {/* Tabs */}
      <div className="flex gap-4 mb-3 justify-center">
        {["leads", "customers", "carriers"].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm rounded ${tab === key ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
          >
            {`Active ${key.charAt(0).toUpperCase() + key.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Top Stats */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Active {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </h2>
          <div className="text-sm text-gray-500">
            2.5K <span className="mx-1 text-gray-400">→</span> 3.1K
          </div>
        </div>
        <div className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full font-medium">
          +5.4%
        </div>
      </div>

      {/* Jagged Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={growthStats[tab]}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="jaggedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            domain={["dataMin - 2", "dataMax + 2"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
              color: "#111827",
            }}
            labelStyle={{ color: "#6b7280" }}
            cursor={{ stroke: "#22c55e", strokeWidth: 1 }}
          />

          <Area
            type="linear" // Jagged line
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#jaggedFill)"
            dot={false}
            strokeLinejoin="miter"
            strokeLinecap="square"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};


export default MemberDashboard;