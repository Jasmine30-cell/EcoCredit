import Navigation from "@/components/Navigation";
import { Leaf, Award, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { submitRecycling, fetchRecyclingData } from "../lib/api";

export default function Recycling() {
  const wasteTypes = [
    { type: "plastic", icon: Trash2, credits: 50, unit: "kg" },
    { type: "paper", icon: Leaf, credits: 75, unit: "kg" },
    { type: "glass", icon: Award, credits: 60, unit: "kg" },
    { type: "metal", icon: Trash2, credits: 85, unit: "kg" },
    { type: "ewaste", icon: Leaf, credits: 200, unit: "kg" },
    { type: "organic", icon: Award, credits: 40, unit: "kg" },
  ];

  const [selectedType, setSelectedType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dashboardData, setDashboardData] = useState({
    total: 0,
    history: [],
  });

  const currentUser = { id: "user1" };

  // load saved data
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchRecyclingData(currentUser.id);
      setDashboardData(data);
    };
    loadData();
  }, []);

  // submit handler
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED"); // ✅ debug

    if (!selectedType || !quantity) {
      console.log("Missing values");
      return;
    }

    await submitRecycling({
      userId: currentUser.id,
      wasteType: selectedType,
      quantity: Number(quantity),
    });

    const updated = await fetchRecyclingData(currentUser.id);
    setDashboardData(updated);

    setQuantity("");
    setSelectedType("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="bg-gradient-to-r from-eco-blue to-eco-green py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            Recycling Submissions
          </h1>
          <p className="text-white/90">
            Log your recycling activities and earn carbon credits
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">

          {/* FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Submit Recycling Activity
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Waste type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Waste Type
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wasteTypes.map((waste) => (
                      <button
                        key={waste.type}
                        type="button"
                        onClick={() => setSelectedType(waste.type)}
                        className={`p-4 border-2 rounded-lg text-center transition-all
                          ${
                            selectedType === waste.type
                              ? "border-eco-green bg-eco-green-light"
                              : "border-gray-200 hover:border-eco-green hover:bg-eco-green-light"
                          }`}
                      >
                        <waste.icon className="w-6 h-6 mx-auto mb-2" />
                        <p className="font-semibold text-sm capitalize">
                          {waste.type}
                        </p>
                        <p className="text-xs text-eco-green mt-1">
                          +{waste.credits}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* ✅ IMPORTANT */}
                <button
                  type="submit"
                  className="w-full bg-eco-green text-white py-2 rounded-lg"
                >
                  Submit Recycling
                </button>

              </form>
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-6">
            <div className="bg-eco-green rounded-xl p-6 text-white">
              <Leaf className="w-8 h-8 mb-4" />
              <h3>Credits Earned</h3>
              <p className="text-4xl font-bold">
                {dashboardData.total || 0}
              </p>
            </div>
          </div>

        </div>

        {/* HISTORY */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">
            Your Recent Submissions
          </h2>

          <table className="w-full">
            <tbody>
              {dashboardData.history.map((row: any, idx: number) => (
                <tr key={idx}>
                  <td>{row.created_at}</td>
                  <td>{row.waste_type}</td>
                  <td>{row.quantity} kg</td>
                  <td>+{row.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
