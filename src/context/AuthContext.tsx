import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: 'student' | 'staff') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfilePicture: (imageUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USERS = {
  'student@panimalar.edu': {
    id: 'student1',
    name: 'Arun Kumar',
    email: 'student@panimalar.edu',
    role: 'student' as const,
    rollNumber: '19CSE101',
    department: 'Computer Science',
    joinedAt: '2023-01-01',
    profilePic: null
  },
  'staff@panimalar.edu': {
    id: 'staff1',
    name: 'Dr. Priya Rajan',
    email: 'staff@panimalar.edu',
    role: 'staff' as const,
    department: 'Computer Science',
    joinedAt: '2020-06-15',
    profilePic: null
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'staff') => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (MOCK_USERS[email as keyof typeof MOCK_USERS] && MOCK_USERS[email as keyof typeof MOCK_USERS].role === role) {
          const userData = MOCK_USERS[email as keyof typeof MOCK_USERS];
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid credentials or role'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfilePicture = (imageUrl: string) => {
    if (user) {
      const updatedUser = { ...user, profilePic: imageUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      isAuthenticated: !!user,
      updateProfilePicture 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
 