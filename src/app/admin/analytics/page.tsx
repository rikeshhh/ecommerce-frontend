"use client";

import { useEffect, useState, useMemo } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  orderStatus: {
    Pending: number;
    Shipped: number;
    Cancelled: number;
  };
  revenueByDate: { _id: string; total: number }[];
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get<AnalyticsData>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analytics`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeRange },
        }
      );
      setAnalyticsData(response.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const orderStatusData = useMemo(
    () => ({
      labels: ["Pending", "Shipped", "Cancelled"],
      datasets: [
        {
          label: "Orders",
          data: [
            analyticsData?.orderStatus.Pending || 0,
            analyticsData?.orderStatus.Shipped || 0,
            analyticsData?.orderStatus.Cancelled || 0,
          ],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#FF6384AA", "#36A2EBAA", "#FFCE56AA"],
          borderWidth: 1,
          borderColor: "#fff",
        },
      ],
    }),
    [analyticsData]
  );

  const revenueTrendData = useMemo(
    () => ({
      labels: analyticsData?.revenueByDate.map((d) => d._id) || [],
      datasets: [
        {
          label: "Revenue",
          data: analyticsData?.revenueByDate.map((d) => d.total) || [],
          borderColor: "#36A2EB",
          fill: false,
          tension: 0.3,
        },
      ],
    }),
    [analyticsData]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
        <Button onClick={fetchAnalytics} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!analyticsData) {
    return <div className="text-center p-4">No data available.</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as "7d" | "30d" | "all")}
          className="border rounded-md p-2 bg-background text-foreground"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie
              data={orderStatusData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const total = context.dataset.data.reduce(
                          (a, b) => a + b,
                          0
                        );
                        const value = context.raw as number;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={revenueTrendData}
              options={{
                responsive: true,
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { position: "top" } },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
