import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1").replace(/\/$/, "");

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    // Keep a useful fallback if the server responds without JSON.
  }

  if (!response.ok) {
    const error = new Error(payload.error?.message || "Something went wrong. Please try again.");
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadSession() {
      try {
        let response;
        try {
          response = await apiRequest("/auth/me");
        } catch (error) {
          if (error.status !== 401) throw error;
          await apiRequest("/auth/refresh", { method: "POST" });
          response = await apiRequest("/auth/me");
        }

        if (isActive) setCurrentUser(response.user);
      } catch {
        if (isActive) setCurrentUser(null);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadSession();
    return () => {
      isActive = false;
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setCurrentUser(response.user);
    return response;
  }, []);

  const signUp = useCallback(async ({ displayName, email, password }) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ displayName, email, password }),
    });
  }, []);

  const verifyEmail = useCallback(async (token) => {
    const query = new URLSearchParams({ token });
    return apiRequest(`/auth/verify-email?${query.toString()}`);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      setCurrentUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      isLoading,
      signIn,
      signUp,
      signOut,
      verifyEmail,
    }),
    [currentUser, isLoading, signIn, signOut, signUp, verifyEmail],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
