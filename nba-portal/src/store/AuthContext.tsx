import { createContext, useContext, useState, type ReactNode } from 'react';
import { PERSONAS, type User } from '../types/user.types';

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  personas: User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(PERSONAS[0]); // Default: Susan Mitchell (agent)

  return (
    <AuthContext.Provider value={{ user, setUser, personas: PERSONAS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
