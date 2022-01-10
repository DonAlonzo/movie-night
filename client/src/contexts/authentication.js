import { createContext, useContext, useReducer } from "react";

const initialState = {
  isLoggedIn: localStorage.getItem("token") !== null
};

const AuthenticationContext = createContext();

const authenticationReducer = (_, action) => {
  switch (action.type) {
    case 'login': {
      localStorage.setItem("token", action.token);
      return { isLoggedIn: true, token: action.token };
    }
    case 'logout': {
      localStorage.removeItem("token");
      return { isLoggedIn: false };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
};

export const AuthenticationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authenticationReducer, initialState);
  const login = token => dispatch({ type: "login", token });
  const logout = () => dispatch({ type: "logout" });
  return (
    <AuthenticationContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthenticationContext = () => useContext(AuthenticationContext);