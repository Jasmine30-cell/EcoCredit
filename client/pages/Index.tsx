import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Leaf,
  BarChart3,
  Zap,
  Trash2,
  Trophy,
  Users,
  ArrowRight,
} from "lucide-react";

export default function Index() {
  const { isAuthenticated } = useAuth();
  const features = [
    {
      icon: BarChart3,
      title: "Track Emissions",
      description:
        "Monitor your electricity and fuel usage with detailed analytics",
    },
    {
      icon: Zap,
      title: "Earn Credits",
      description: "Convert reduction activities into valuable carbon credits",
    },
    {
      icon: Trash2,
      title: "Recycling Rewards",
      description: "Get credited for recycling and waste reduction initiatives",
    },
    {
      icon: Trophy,
      title: "Compete & Win",
      description: "Climb the leaderboard and inspire your community",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Background decorative elements */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-eco-green-light rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-eco-blue-light rounded-full opacity-10 blur-3xl"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Leaf className="w-10 h-10 text-eco-green" />
                <span className="text-eco-green font-bold text-lg">
                  EcoCredit
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Track Your Impact. Earn Carbon Credits. Build a Sustainable
                Future.
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your sustainability efforts into measurable carbon
                credits. Monitor your environmental impact, track emission
                reductions, and join a community of eco-conscious individuals
                making real change.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/signup"}
                  className="inline-flex items-center justify-center px-8 py-3 bg-eco-green text-white rounded-lg hover:bg-eco-green-dark transition-colors duration-200 font-semibold group"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-eco-green text-eco-green rounded-lg hover:bg-eco-green-light transition-colors duration-200 font-semibold"
                >
                  Learn More
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-eco-green">1000+</div>
                  <p className="text-gray-600">Active Users</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-eco-blue">5M+</div>
                  <p className="text-gray-600">Credits Issued</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-eco-green-dark">
                    50K+
                  </div>
                  <p className="text-gray-600">Tons CO₂ Saved</p>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative hidden md:block">
              <div className="bg-gradient-to-br from-eco-green-light to-eco-blue-light rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Your Sustainability Score
                    </h3>
                    <Leaf className="w-6 h-6 text-eco-green" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Carbon Credits
                        </span>
                        <span className="text-sm font-bold text-eco-green">
                          2,450
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-eco-green h-2 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Monthly Target
                        </span>
                        <span className="text-sm font-bold text-eco-blue">
                          65%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-eco-blue h-2 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Everything you need to track, measure, and celebrate your
            environmental impact
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-eco-green-light rounded-lg p-4 w-fit mb-6">
                    <Icon className="w-8 h-8 text-eco-green-dark" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">
            How Billing Data Becomes Carbon Credits
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                number: "1",
                title: "Upload Data",
                description: "Submit your electricity and fuel billing records",
              },
              {
                number: "2",
                title: "Calculate Emissions",
                description:
                  "Our algorithm estimates your carbon footprint accurately",
              },
              {
                number: "3",
                title: "Track Reductions",
                description: "Monitor your progress as you reduce consumption",
              },
              {
                number: "4",
                title: "Earn Credits",
                description: "Receive carbon credits and climb the leaderboard",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-eco-green text-white flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  {index < 3 && (
                    <ArrowRight className="w-6 h-6 text-eco-green-light hidden md:block absolute -right-6 top-4" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-eco-green to-eco-blue py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {isAuthenticated
              ? "Continue tracking your environmental impact and earn more carbon credits"
              : "Join thousands of users tracking their environmental impact and earning carbon credits"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-eco-green rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold group"
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Tracking Now"}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            {!isAuthenticated && (
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors duration-200 font-semibold"
              >
                Learn More
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-6 h-6 text-eco-green" />
                <span className="font-bold text-white">EcoCredit</span>
              </div>
              <p className="text-sm">
                Making sustainability measurable and rewarding.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/dashboard" className="hover:text-eco-green">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="hover:text-eco-green">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link to="/billing" className="hover:text-eco-green">
                    Upload Data
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-eco-green">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-eco-green">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-eco-green">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-eco-green">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-eco-green">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-eco-green">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>
              © 2024 EcoCredit. All rights reserved. Making the planet greener,
              one credit at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
