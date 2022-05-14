import { createContext, useReducer, useContext } from 'react';

const userContext = createContext();

function userReducer(state, action) {
  switch (action.type) {
    case 'FETCH_USER':
      return {
        ...state,
        user: action.user,
        isLoading: false,
      };
    case 'LOADING':
      return {
        ...state,
        isLoading: true,
      };
    case 'STOP_LOADING':
      return {
        ...state,
        isLoading: false,
      };
    case 'RESET_USER':
      return {
        ...state,
        user: [],
        isLoading: false,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, {
    user: '',
    isLoading: false,
  });

  const value = [state, dispatch];
  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

function useUser() {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export { UserProvider, useUser };
