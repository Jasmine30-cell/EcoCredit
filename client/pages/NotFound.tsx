import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flexlex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-lg">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-2xl font-semibold text-gray-800 mb-3">
            Page not found
          </p>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist. It might have been moved
            or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-eco-green text-white rounded-lg hover:bg-eco-green-dark transition-colors font-semibold"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-eco-green text-eco-green rounded-lg hover:bg-eco-green-light transition-colors font-semibold"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
