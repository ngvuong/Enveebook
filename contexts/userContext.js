import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const userContext = createContext();

export function UserProvider({ children }) {
  const { data: session } = useSession();
  const [user, setUser] = useState();

  useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, [session]);

  const value = [user, setUser];
  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

export function useUser() {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
