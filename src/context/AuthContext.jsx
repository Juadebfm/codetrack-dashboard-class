import { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { getMockData } from "../services/mockDataService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [mockUsers, setMockUsers] = useState(() => getMockData().mock_auth_users);
  const [currentUser, setCurrentUser] = useState(null);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      signIn(email, password) {
        const matchingUser = mockUsers.find(
          (user) =>
            user.email.toLowerCase() === email.trim().toLowerCase() &&
            user.password === password,
        );

        if (!matchingUser) {
          return {
            success: false,
            message: "That email or password doesn't look right.",
          };
        }

        setCurrentUser(matchingUser);

        return { success: true, user: matchingUser };
      },
      signUp({ displayName, email, password }) {
        const emailInUse = mockUsers.some(
          (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
        );

        if (emailInUse) {
          return {
            success: false,
            message: "An account with that email already exists.",
          };
        }

        const newUser = {
          id: crypto.randomUUID(),
          display_name: displayName.trim(),
          email: email.trim().toLowerCase(),
          password,
          plan: "free",
          time_zone: "UTC",
        };

        setMockUsers((users) => [...users, newUser]);
        setCurrentUser(newUser);

        return { success: true, user: newUser };
      },
      signOut() {
        setCurrentUser(null);
      },
    }),
    [currentUser, mockUsers],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
