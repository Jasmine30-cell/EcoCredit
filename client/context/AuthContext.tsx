import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  carbon_credits: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (
    username: string,
    email: string,
    password: string,
    fullName?: string,
  ) => Promise<{ success: boolean; message?: string }>;
  signin: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setToken(savedToken);
      verifyToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify?: string) => {
    try {
      const authToken = tokenToVerify || token;
      if (!authToken) {
        setIsLoading(false);
        return false;
      }

      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = (await response.json()) as {
          user: User;
          token: string;
        };
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("auth_token", data.token);
        return true;
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth_token");
        return false;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      setUser(null);
      setToken(null);
      localStorage.removeItem("auth_token");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string,
    fullName?: string,
  ) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          fullName,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
        user?: User;
        token?: string;
      };

      if (data.success && data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("auth_token", data.token);
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || "Signup failed",
        };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message: "An error occurred during signup",
      };
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
        user?: User;
        token?: string;
      };

      if (data.success && data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("auth_token", data.token);
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || "Sign in failed",
        };
      }
    } catch (error) {
      console.error("Signin error:", error);
      return {
        success: false,
        message: "An error occurred during sign in",
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("auth_token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        signup,
        signin,
        logout,
        verifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
