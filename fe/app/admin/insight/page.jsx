"use client";

import { useState, useEffect } from "react";
import PageHeader from "../../components/admin/PageHeader";
import { useUser } from "../../components/providers/UserProvider";
import { HiCash, HiUserGroup, HiOfficeBuilding, HiClock } from "react-icons/hi";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function InsightPage() {
  const { user } = useUser();
  const [timeRange, setTimeRange] = useState("weekly"); // weekly, monthly, yearly

  // Mock data for statistics
  const mockStats = {
    totalRevenue: "$12,845.50",
    totalUsers: "865",
    totalLots: "12",
    averageTime: "1h 23m",
  };

  // Mock data for revenue chart
  const revenueData = {
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [1200, 1500, 1300, 1700, 2100, 1800, 1400],
    },
    monthly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [5800, 6700, 7300, 7800],
    },
    yearly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [10200, 11500, 12300, 12700, 14100, 15800, 16400, 16900, 17300, 18100, 18800, 20400],
    },
  };

  // Mock data for parking lot occupancy
  const occupancyData = {
    labels: ["Central Lot", "Downtown Plaza", "East Wing", "North Terminal", "South Gate", "West Avenue"],
    data: [85, 65, 72, 90, 45, 60],
  };

  // Mock data for popular times
  const popularTimesData = {
    labels: ["6am-9am", "9am-12pm", "12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],
    data: [75, 45, 30, 42, 85, 20],
  };
  // Mock data for vehicle type usage 
  const vehicleUsageData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Cars",
        data: [120, 132, 141, 138, 145, 170, 155],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Bikes",
        data: [65, 59, 80, 75, 72, 85, 93],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      }
    ]
  };
  
  // Mock data for parking duration distribution
  const parkingDurationData = {
    labels: ["< 1 hour", "1-2 hours", "2-4 hours", "4-8 hours", "8+ hours"],
    datasets: [
      {
        label: "Cars",
        data: [15, 25, 35, 20, 5],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Bikes",
        data: [35, 30, 20, 10, 5],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      }
    ]
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div className="p-6">
      <PageHeader title="Analytics & Insights" />

      {/* Time range selector */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => handleTimeRangeChange("weekly")}
          className={`px-4 py-2 rounded ${
            timeRange === "weekly" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => handleTimeRangeChange("monthly")}
          className={`px-4 py-2 rounded ${
            timeRange === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => handleTimeRangeChange("yearly")}
          className={`px-4 py-2 rounded ${
            timeRange === "yearly" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value={mockStats.totalRevenue}
          icon={<HiCash className="text-green-500" size={24} />}
        />
        <StatCard
          title="Registered Users"
          value={mockStats.totalUsers}
          icon={<HiUserGroup className="text-blue-500" size={24} />}
        />
        <StatCard
          title="Parking Lots"
          value={mockStats.totalLots}
          icon={<HiOfficeBuilding className="text-purple-500" size={24} />}
        />
        <StatCard
          title="Avg. Parking Time"
          value={mockStats.averageTime}
          icon={<HiClock className="text-orange-500" size={24} />}
        />
      </div>      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <div className="h-[350px]">
            <Bar
              data={{
                labels: revenueData[timeRange].labels,
                datasets: [
                  {
                    label: "Revenue ($)",
                    data: revenueData[timeRange].data,
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>        {/* Occupancy chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Parking Lot Occupancy (%)</h2>
          <div className="h-[350px]">
            <Bar
              data={{
                labels: occupancyData.labels,
                datasets: [
                  {
                    label: "Occupancy (%)",
                    data: occupancyData.data,
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">        {/* Popular times */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Popular Parking Times</h2>
          <div className="h-[350px]">
            <Line
              data={{
                labels: popularTimesData.labels,
                datasets: [
                  {
                    label: "Occupancy (%)",
                    data: popularTimesData.data,
                    borderColor: "rgba(255, 99, 132, 0.7)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </div>        {/* Parking Duration Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Parking Duration Distribution</h2>
          <div className="h-[350px]">
            <Bar
              data={parkingDurationData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Percentage of Total (%)'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Duration'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${context.raw}%`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>      </div>

      {/* Additional Charts */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Additional Insights</h2>
        <div className="grid grid-cols-1 gap-6">
          {/* Vehicle Usage Comparison */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Weekly Vehicle Type Usage</h2>
            <div className="h-[350px]">
              <Bar
                data={vehicleUsageData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of Vehicles'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: "top",
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat card component
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <h3 className="text-sm text-gray-600">{title}</h3>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}