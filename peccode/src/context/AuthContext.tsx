import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService, userService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: 'student' | 'staff') => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfilePicture: (imageUrl: string) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  rollNumber?: string;
  department?: string;
  role: 'student' | 'staff';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from local storage
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          // Validate token by getting profile
          const updatedProfile = await userService.getProfile();
          setUser(updatedProfile);
        } catch (error) {
          // Token might be invalid, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'staff') => {
    setIsLoading(true);
    
    try {
      const { user, token } = await authService.login(email, password, role);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    
    try {
      const { user, token } = await authService.register(data);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfilePicture = async (imageUrl: string) => {
    if (user) {
      try {
        await userService.updateProfile({ profilePic: imageUrl });
        
        const updatedUser = { ...user, profilePic: imageUrl };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Failed to update profile picture:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login,
      register,
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
 