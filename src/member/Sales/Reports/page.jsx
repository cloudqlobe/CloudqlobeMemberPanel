import React, { useState } from "react";
import { FaSearch, FaBullseye, FaChartLine } from "react-icons/fa";
import DashboardLayout from "../../layout/page";
import { FcBarChart } from "react-icons/fc";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesReportPage = () => {
  const [salesData, setSalesData] = useState([
    { id: 1, title: "January Sales", target: 500, achieved: 4500, date: "2025-01-10" },
    { id: 2, title: "February Sales", target: 600, achieved: 5800, date: "2025-02-10" },
    { id: 3, title: "March Sales", target: 700, achieved: 7200, date: "2025-03-10" },
  ]);
  setSalesData();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("Sales Targeted");
setActiveTab('');
  const filteredSales = salesData.filter((sale) =>
    sale.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTarget = salesData.reduce((acc, sale) => acc + sale.target, 0);
  const totalAchieved = salesData.reduce((acc, sale) => acc + sale.achieved, 0);

  const dataBar = {
    labels: salesData.map((sale) => sale.title),
    datasets: [
      {
        label: "Sales Target",
        backgroundColor: "#FDE68A",
        data: salesData.map((sale) => sale.target),
      },
      {
        label: "Achieved Sales",
        backgroundColor: "#3B82F6",
        data: salesData.map((sale) => sale.achieved),
      },
    ],
  };

  const dataPie = {
    labels: ["Active", "Inactive", "New Leads", "Hot", "Junk"],
    datasets: [
      {
        data: [50, 30, 20, 10, 5],
        backgroundColor: ["#3B82F6", "#6EE7B7", "#FDE68A", "#FCA5A5", "#C4B5FD"],
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gradient-to-br from-gray-100 via-blue-50 to-blue-100 text-gray-800">
        <h2 className="text-3xl text-gray-700 font-bold mb-6 flex items-center">
          <FcBarChart className="mr-3 text-4xl" /> Sales Report
        </h2>

        <div className="mb-6 bg-white p-6 rounded-lg shadow-lg flex items-center justify-between space-x-4">
          <div className="flex space-x-4 w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Title"
              className="p-3 border rounded-lg w-[900px] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transform transition-transform hover:scale-105 flex items-center">
              <FaSearch className="mr-2" /> Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            {
              category: "Sales Target",
              icon: <FaBullseye className="text-green-500" />,
              count: totalTarget.toLocaleString(),
            },
            {
              category: "Achieved",
              icon: <FaChartLine className="text-yellow-500" />,
              count: totalAchieved.toLocaleString(),
            },
          ].map(({ category, icon, count }) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-1 bg-white text-gray-800 py-12 px-4 rounded-lg shadow-md transform transition-transform hover:bg-gray-200 hover:scale-105 ${
                activeCategory === category ? "bg-gray-300" : ""
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-5xl">{icon}</span>
                <span className="text-lg">
                  {category} (${count})
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex space-x-4 mb-6">
          <div className="flex-1 bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Customer and Leads Overview
            </h3>
            <div className="flex justify-center items-center" style={{ height: "400px" }}>
              <Pie
                data={dataPie}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                  },
                }}
                style={{ width: "250px", height: "250px" }}
              />
            </div>
          </div>

          <div className="flex-1 bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {activeTab === "Sales Targeted" ? "Sales Targeted Overview" : "Achieved Sales Overview"}
            </h3>
            <div className="flex justify-center" style={{ height: "400px" }}>
              <Bar
                data={dataBar}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
          <table className="min-w-full bg-white">
            <thead className="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center">
              <tr>
                <th className="py-3 px-5">Report No</th>
                <th className="py-3 px-5">Title</th>
                <th className="py-3 px-5">Sales Target</th>
                <th className="py-3 px-5">Achieved Sales</th>
                <th className="py-3 px-5">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, index) => (
                <tr
                  key={sale.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <td className="py-3 px-5">{sale.id}</td>
                  <td className="py-3 px-5">{sale.title}</td>
                  <td className="py-3 px-5">${sale.target.toLocaleString()}</td>
                  <td className="py-3 px-5">${sale.achieved.toLocaleString()}</td>
                  <td className="py-3 px-5">{sale.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesReportPage;
