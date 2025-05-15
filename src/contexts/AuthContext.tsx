import { createContext, useContext, useState } from 'react';
import { User } from '../types/recipe';

// Mock user for development without database
const MOCK_USER: User = {
  id: 'user1',
  email: 'user@example.com'
};

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Auto-login with mock user - no login/signup required
  const [user] = useState<User | null>(MOCK_USER);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}