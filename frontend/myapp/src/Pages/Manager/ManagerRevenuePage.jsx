import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  DollarSign,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";
import "./ManagerRevenuePage.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const RevenueAnalytics = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [startDate, setStartDate] = useState("01/01/2023");
  const [endDate, setEndDate] = useState("1/1/2026");
  const [year, setYear] = useState(2025);
  const [summaryData, setSummaryData] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [planData, setPlanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummaryData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5254/api/Revenue/summary?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );
      if (!response.ok) throw new Error("Failed to fetch summary data");
      const data = await response.json();
      setSummaryData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchDailyData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5254/api/Revenue/daily?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );
      if (!response.ok) throw new Error("Failed to fetch daily data");
      const data = await response.json();
      setDailyData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5254/api/Revenue/monthly/${year}`
      );
      if (!response.ok) throw new Error("Failed to fetch monthly data");
      const data = await response.json();
      setMonthlyData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchPlanData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5254/api/Revenue/by-plan?startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );
      if (!response.ok) throw new Error("Failed to fetch plan data");
      const data = await response.json();
      setPlanData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchSummaryData(),
      fetchDailyData(),
      fetchMonthlyData(),
      fetchPlanData(),
    ]).finally(() => setLoading(false));
  }, [startDate, endDate, year]);
  useEffect(() => {
    if (activeTab === "monthly") {
      setLoading(true);
      fetchMonthlyData().finally(() => setLoading(false));
    }
  }, [year, activeTab]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const tabs = [
    { id: "summary", label: "Summary", icon: DollarSign },
    { id: "daily", label: "Daily Revenue", icon: BarChart2 },
    { id: "monthly", label: "Monthly Revenue", icon: Calendar },
    { id: "plans", label: "Revenue by Plan", icon: PieChartIcon },
  ];

  return (
    <div className="container">
      <div className="card">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="input-group">
          {activeTab !== "monthly" && (
            <>
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">Error: {error}</div>}

        {activeTab === "summary" && summaryData && (
          <div className="chart-container">
            <div className="grid">
              <div className="card fade-in">
                <div className="card-header">Total Revenue</div>
                <div className="card-value">
                  ${summaryData.totalRevenue.toLocaleString()}
                </div>
              </div>
              <div className="card slide-up">
                <div className="card-header">Total Transactions</div>
                <div className="card-value">
                  {summaryData.totalTransactions}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "daily" && (
          <div className="chart-container">
            <LineChart width={800} height={400} data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) => Math.round(value).toLocaleString()}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => Math.round(value).toLocaleString()}
              />
              <Tooltip labelFormatter={formatDate} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="amount"
                stroke="rgba(46, 204, 113, 0.9)"
                name="Revenue"
                
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="transactionCount"
                stroke="rgba(33, 150, 243, 0.9)"
                name="Transactions"
              />
            </LineChart>
          </div>
        )}
        {activeTab === "monthly" && (
          <div className="chart-container">
            <div className="input-group">
              <label>Năm</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
            <BarChart width={800} height={500} data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => Math.round(value).toLocaleString()}
              />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="amount"
                fill="rgba(0, 177, 106, 0.9)"
                name="Doanh thu"
              />
              <Bar
                yAxisId="right"
                dataKey="transactionCount"
                fill="rgba(33, 150, 243, 0.9)"
                name="Số giao dịch"
              />
            </BarChart>
          </div>
        )}

        {activeTab === "plans" && (
          <div className="chart-container pie-chart-colors">
            <PieChart width={600} height={400}>
              <Pie
                data={planData}
                dataKey="amount"
                nameKey="planName"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={(entry) =>
                  `${entry.planName}: $${entry.amount.toLocaleString()}`
                }
              >
                {planData.map((entry, index) => (
                  <Cell key={`cell-${index}`} className={`cell-${index}`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalytics;
