import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import {
  BarChart3,
  Leaf,
  Zap,
  Trash2,
  TrendingUp,
  Lightbulb,
  Droplet,
  Wind,
  Loader,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string | null;
    carbon_credits: number;
  };
  stats: {
    totalConsumption: number;
    totalEmissions: number;
    totalCredits: number;
    recyclingContributions: number;
  };
  monthlyData: Array<{
    month: string;
    emissions: number;
    credits: number;
  }>;
  recentUploads: Array<{
    id: number;
    energy_type: string;
    units_consumed: number;
    date: string;
  }>;
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // demo analytics so graph always renders
  const [analytics] = useState({
    emissions: [
      { month: "Oct", emissions: 180 },
      { month: "Nov", emissions: 150 },
      { month: "Dec", emissions: 120 },
      { month: "Jan", emissions: 90 },
    ],
    credits: [
      { month: "Oct", credits: 50 },
      { month: "Nov", credits: 120 },
      { month: "Dec", credits: 260 },
      { month: "Jan", credits: 400 },
    ],
  });

  useEffect(() => {
    if (token) loadDashboard();
  }, [token]);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/billing/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) setDashboardData(data.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-eco-green" />
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="bg-gradient-to-r from-eco-green to-eco-blue py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white">
            Your Sustainability Dashboard
          </h1>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">

        {/* ===== Analytics Graphs (added safely) ===== */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">
            Monthly Analytics
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            <div>
              <h3 className="font-semibold mb-4">
                Carbon Emission Trend
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={analytics.emissions}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="font-semibold mb-4">
                Carbon Credits Earned
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={analytics.credits}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="credits"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
