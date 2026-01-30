import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Billing", href: "/billing" },
    { label: "Recycling", href: "/recycling" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Profile", href: "/profile" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-eco-green-light sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Leaf className="w-7 h-7 text-eco-green transition-transform group-hover:rotate-12" />
            <span className="text-xl font-bold text-eco-green-dark hidden sm:inline">
              EcoCredit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                {navItems.slice(1, -1).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-gray-700 hover:text-eco-green font-medium transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            ) : (
              <Link
                to="/"
                className="text-gray-700 hover:text-eco-green font-medium transition-colors duration-200"
              >
                Home
              </Link>
            )}

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-eco-green-light text-eco-green rounded-lg hover:bg-eco-green-light/80 transition-colors duration-200 font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-eco-green text-white flex items-center justify-center text-xs font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  {user.username}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/signin"
                  className="px-4 py-2 text-eco-green border border-eco-green rounded-lg hover:bg-eco-green-light transition-colors duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-eco-green text-white rounded-lg hover:bg-eco-green-dark transition-colors duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">
                    {user?.username}
                  </p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                {navItems.slice(1, -1).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-eco-green-light rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-eco-green-light rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="block px-4 py-2 text-gray-700 hover:bg-eco-green-light rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/signin"
                  className="block px-4 py-2 text-gray-700 hover:bg-eco-green-light rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 bg-eco-green text-white rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
