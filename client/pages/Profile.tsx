import Navigation from "@/components/Navigation";
import {
  User,
  Settings,
  Award,
  TrendingUp,
  Calendar,
  Leaf,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");

  const creditHistory = [
    {
      date: "2024-06-15",
      type: "Recycling",
      amount: 150,
      desc: "Plastic recycling",
    },
    {
      date: "2024-06-10",
      type: "Energy",
      amount: 120,
      desc: "Monthly energy reduction",
    },
    {
      date: "2024-06-05",
      type: "Recycling",
      amount: 75,
      desc: "Paper recycling",
    },
    {
      date: "2024-05-28",
      type: "Challenge",
      amount: 200,
      desc: "30-day challenge",
    },
    {
      date: "2024-05-15",
      type: "Energy",
      amount: 85,
      desc: "Weekly energy savings",
    },
  ];

  const recyclingHistory = [
    {
      date: "2024-06-15",
      type: "Plastic",
      quantity: "12 kg",
      credits: 600,
    },
    {
      date: "2024-06-10",
      type: "E-Waste",
      quantity: "2 kg",
      credits: 400,
    },
    {
      date: "2024-06-05",
      type: "Paper",
      quantity: "8 kg",
      credits: 600,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-eco-green to-eco-blue py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-white/90">
            Manage your account and track your sustainability journey
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex gap-6 items-start">
              <div className="w-24 h-24 rounded-full bg-eco-green/20 flex items-center justify-center">
                <User className="w-12 h-12 text-eco-green" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">You</h2>
                <p className="text-gray-600">Sustainability Enthusiast</p>
                <p className="text-sm text-gray-500 mt-2">
                  Member since March 2024
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 py-2 bg-eco-green text-white rounded-lg hover:bg-eco-green-dark transition-colors font-semibold">
              <Settings className="w-5 h-5" />
              Edit Profile
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Credits</p>
              <p className="text-3xl font-bold text-eco-green">2,450</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Leaderboard Rank</p>
              <p className="text-3xl font-bold text-eco-blue">#7</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">CO₂ Reduced</p>
              <p className="text-3xl font-bold text-eco-green-dark">892 kg</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Sustainability Score</p>
              <p className="text-3xl font-bold text-yellow-500">8.5/10</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "overview"
                ? "text-eco-green border-eco-green"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("credits")}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "credits"
                ? "text-eco-green border-eco-green"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Credit History
          </button>
          <button
            onClick={() => setActiveTab("recycling")}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "recycling"
                ? "text-eco-green border-eco-green"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Recycling History
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Achievements */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Achievements
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    {
                      icon: "🌱",
                      title: "Getting Started",
                      desc: "First submission",
                    },
                    {
                      icon: "♻️",
                      title: "Recycling Champion",
                      desc: "500+ kg recycled",
                    },
                    {
                      icon: "⚡",
                      title: "Energy Saver",
                      desc: "1000 kWh tracked",
                    },
                    {
                      icon: "🏆",
                      title: "Top 10",
                      desc: "Leaderboard top 10",
                    },
                  ].map((achievement, idx) => (
                    <div
                      key={idx}
                      className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {achievement.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sustainability Score */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-eco-green to-eco-green-dark rounded-xl p-8 text-white">
                <TrendingUp className="w-8 h-8 mb-4" />
                <h3 className="text-xl font-bold mb-4">Sustainability Score</h3>
                <div className="text-6xl font-bold mb-2">8.5</div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div
                    className="bg-white h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <p className="text-white/90 text-sm">
                  You're doing amazing! Keep up the great work.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="font-bold text-gray-900 mb-4">
                  Score Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Energy Tracking</span>
                    <span className="font-semibold text-eco-green">8.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Recycling Activity</span>
                    <span className="font-semibold text-eco-green">9.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Community Impact</span>
                    <span className="font-semibold text-eco-green">8.5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "credits" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                Credit History
              </h3>
              <p className="text-gray-600 mt-1">
                Track all your earned carbon credits
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-8 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-4 px-8 font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-4 px-8 font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="text-right py-4 px-8 font-semibold text-gray-700">
                      Credits
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {creditHistory.map((history, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-8 text-gray-700">
                        <Calendar className="w-4 h-4 inline mr-2 text-gray-400" />
                        {history.date}
                      </td>
                      <td className="py-4 px-8">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            history.type === "Energy"
                              ? "bg-eco-blue-light text-eco-blue-dark"
                              : history.type === "Recycling"
                                ? "bg-eco-green-light text-eco-green-dark"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {history.type}
                        </span>
                      </td>
                      <td className="py-4 px-8 text-gray-700">
                        {history.desc}
                      </td>
                      <td className="py-4 px-8 text-right font-bold text-eco-green">
                        +{history.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "recycling" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                Recycling History
              </h3>
              <p className="text-gray-600 mt-1">
                View all your recycling submissions
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-8 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-4 px-8 font-semibold text-gray-700">
                      Waste Type
                    </th>
                    <th className="text-right py-4 px-8 font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="text-right py-4 px-8 font-semibold text-gray-700">
                      Credits
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recyclingHistory.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-8 text-gray-700">{item.date}</td>
                      <td className="py-4 px-8 font-medium text-gray-900">
                        <Trash2 className="w-4 h-4 inline mr-2 text-gray-400" />
                        {item.type}
                      </td>
                      <td className="py-4 px-8 text-right text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-8 text-right font-bold text-eco-green">
                        +{item.credits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
