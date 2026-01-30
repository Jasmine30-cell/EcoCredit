import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Trophy, Medal, Star, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LeaderboardUser {
  rank: number;
  id: number;
  username: string;
  full_name: string | null;
  credits: number;
  reduction: number;
  badge: "gold" | "silver" | "bronze" | null;
}

interface LeaderboardStats {
  totalUsers: number;
  totalCredits: number;
  totalReduction: number;
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("overall");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    totalUsers: 0,
    totalCredits: 0,
    totalReduction: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/leaderboard");
      const data = (await response.json()) as {
        success: boolean;
        data: LeaderboardUser[];
        stats: LeaderboardStats;
      };

      if (data.success) {
        setLeaderboardData(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeIcon = (badge: string | null) => {
    switch (badge) {
      case "gold":
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case "silver":
        return <Medal className="w-6 h-6 text-gray-400" />;
      case "bronze":
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="bg-gradient-to-r from-eco-blue to-eco-green py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-white/90">
            See who's making the biggest impact on sustainability
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter and Stats */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex gap-4">
            <button
              onClick={() => setTimeframe("monthly")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                timeframe === "monthly"
                  ? "bg-eco-green text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeframe("overall")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                timeframe === "overall"
                  ? "bg-eco-green text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All Time
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-eco-green">
                {isLoading ? "-" : stats.totalUsers}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">Total Credits</p>
              <p className="text-2xl font-bold text-eco-blue">
                {isLoading ? "-" : stats.totalCredits.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">CO₂ Reduced</p>
              <p className="text-2xl font-bold text-eco-green-dark">
                {isLoading
                  ? "-"
                  : `${stats.totalReduction.toLocaleString()} kg`}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-eco-green" />
          </div>
        ) : (
          <>
            {/* Top 3 Featured */}
            {leaderboardData.slice(0, 3).length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {leaderboardData.slice(0, 3).map((userData) => (
                  <div
                    key={userData.id}
                    className={`rounded-xl p-8 text-center relative overflow-hidden ${
                      userData.rank === 1
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white"
                        : userData.rank === 2
                          ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                          : "bg-gradient-to-br from-orange-400 to-orange-500 text-white"
                    }`}
                  >
                    <div className="absolute top-4 right-4">
                      {getBadgeIcon(userData.badge)}
                    </div>
                    <div className="mb-4">
                      <p className="text-5xl font-bold">#{userData.rank}</p>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      {userData.username}
                    </h3>
                    <div className="space-y-2 text-white/90">
                      <p className="text-3xl font-bold">
                        {userData.credits.toLocaleString()} Credits
                      </p>
                      <p>
                        {userData.reduction.toLocaleString()} kg CO₂ Reduced
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Full Leaderboard */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 w-20">
                        Rank
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">
                        Username
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        Credits
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        CO₂ Reduction
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 w-20">
                        Badge
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.length > 0 ? (
                      leaderboardData.map((userData) => (
                        <tr
                          key={userData.id}
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            user?.id === userData.id ? "bg-eco-green-light" : ""
                          }`}
                        >
                          <td className="py-4 px-6">
                            <span
                              className={`text-lg font-bold ${
                                user?.id === userData.id
                                  ? "text-eco-green-dark"
                                  : "text-gray-900"
                              }`}
                            >
                              #{userData.rank}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-eco-green/20 flex items-center justify-center">
                                <span className="text-eco-green font-semibold text-sm">
                                  {userData.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span
                                className={`font-medium ${
                                  user?.id === userData.id
                                    ? "text-eco-green-dark"
                                    : "text-gray-900"
                                }`}
                              >
                                {userData.username}
                                {user?.id === userData.id && (
                                  <span className="text-xs text-eco-green-dark ml-2">
                                    (You)
                                  </span>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="text-lg font-bold text-eco-green">
                              {userData.credits.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right text-gray-700">
                            {userData.reduction.toLocaleString()} kg
                          </td>
                          <td className="py-4 px-6">
                            {userData.badge ? (
                              <div className="flex justify-center">
                                {getBadgeIcon(userData.badge)}
                              </div>
                            ) : userData.rank <= 10 ? (
                              <Star className="w-5 h-5 text-gray-300" />
                            ) : null}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 px-6 text-center">
                          <p className="text-gray-600">
                            No users yet. Be the first to join!
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-eco-green rounded-xl p-8 text-white">
                <Trophy className="w-8 h-8 mb-4" />
                <h3 className="text-2xl font-bold mb-3">How Rankings Work</h3>
                <p className="text-white/90">
                  Users are ranked based on their total carbon credits earned
                  from energy conservation, recycling activities, and
                  sustainability achievements. More credits = higher ranking!
                </p>
              </div>

              <div className="bg-eco-blue rounded-xl p-8 text-white">
                <Star className="w-8 h-8 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Earn More Credits</h3>
                <p className="text-white/90">
                  Climb the leaderboard by tracking your energy usage, recycling
                  more, and completing sustainability challenges. Each action
                  brings you closer to the top!
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
