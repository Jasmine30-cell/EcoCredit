import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface BillingEntry {
  id: number;
  user_id: number;
  energy_type: string;
  units_consumed: number;
  carbon_emissions: number;
  credits_earned: number;
  date: string;
  created_at: string;
}

export default function Billing() {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    energyType: "",
    unitsConsumed: "",
  });

  const [recentUploads, setRecentUploads] = useState<BillingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load billing history on mount
  useEffect(() => {
    if (token) {
      loadBillingHistory();
    }
  }, [token]);

  const loadBillingHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/billing/history", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = (await response.json()) as {
          success: boolean;
          data: BillingEntry[];
        };
        if (data.success) {
          // Sort by date descending and take last 5
          const sorted = data.data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
          setRecentUploads(sorted.slice(0, 5));
        }
      }
    } catch (error) {
      console.error("Failed to load billing history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!user || !token) {
      setMessage({ type: "error", text: "Please sign in to upload data" });
      return;
    }

    if (!formData.energyType || !formData.unitsConsumed || !formData.date) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/billing/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          energy_type: formData.energyType,
          units_consumed: parseFloat(formData.unitsConsumed),
          date: formData.date,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
        data?: BillingEntry;
      };

      if (data.success) {
        setMessage({
          type: "success",
          text: `Data submitted! You earned ${data.data?.credits_earned} credits.`,
        });
        setFormData({
          date: new Date().toISOString().split("T")[0],
          energyType: "",
          unitsConsumed: "",
        });
        // Reload history
        loadBillingHistory();
      } else {
        setMessage({ type: "error", text: data.message || "Failed to submit" });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage({
        type: "error",
        text: "An error occurred during submission",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="bg-gradient-to-r from-eco-green to-eco-blue py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            Upload Billing Data
          </h1>
          <p className="text-white/90">
            Submit your electricity and fuel billing records to calculate your
            carbon footprint
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Form Column */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upload Your Billing Data
              </h2>

              {/* Status Messages */}
              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              {/* Manual Entry Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Energy Type
                  </label>
                  <select
                    name="energyType"
                    value={formData.energyType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green"
                  >
                    <option value="">Select energy type</option>
                    <option value="Electricity (kWh)">Electricity (kWh)</option>
                    <option value="Natural Gas (therms)">
                      Natural Gas (therms)
                    </option>
                    <option value="Fuel Oil (gallons)">
                      Fuel Oil (gallons)
                    </option>
                    <option value="Gasoline (gallons)">
                      Gasoline (gallons)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Units Consumed
                  </label>
                  <input
                    type="number"
                    name="unitsConsumed"
                    placeholder="Enter amount"
                    value={formData.unitsConsumed}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-eco-green text-white font-semibold py-2 rounded-lg hover:bg-eco-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Submit Data
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Column */}
          <div className="space-y-6">
            <div className="bg-eco-green-light rounded-xl p-6">
              <FileText className="w-8 h-8 text-eco-green-dark mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">File Format</h3>
              <p className="text-sm text-gray-700">
                Your billing data should include date, energy type, and
                consumption units.
              </p>
            </div>

            <div className="bg-eco-blue-light rounded-xl p-6">
              <AlertCircle className="w-8 h-8 text-eco-blue-dark mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
              <p className="text-sm text-gray-700">
                Our algorithm converts your consumption data into estimated
                carbon emissions and earns you credits.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-eco-green">
              <h3 className="font-semibold text-gray-900 mb-3">
                Recent Uploads
              </h3>
              {isLoadingHistory ? (
                <p className="text-sm text-gray-600">Loading...</p>
              ) : recentUploads.length > 0 ? (
                <div className="space-y-3">
                  {recentUploads.map((upload) => (
                    <div key={upload.id} className="text-sm">
                      <p className="font-medium text-gray-900">
                        {upload.energy_type}
                      </p>
                      <p className="text-gray-600">
                        {upload.units_consumed} units on{" "}
                        {new Date(upload.date).toLocaleDateString()} • +
                        {upload.credits_earned} credits
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  No uploads yet. Start by submitting your first billing data!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
