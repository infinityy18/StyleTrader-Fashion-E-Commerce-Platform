
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    isAdmin: true,
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'user@example.com',
    isAdmin: false,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
      }
    }
    setLoading(false);
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API call with timeout
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Simple mock authentication - find user by email
          // In a real app, this would validate the password as well
          const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (foundUser && password === '123456') {  // Simple password check for demo
            setUser(foundUser);
            toast({
              title: "Login successful",
              description: `Welcome back, ${foundUser.name}!`,
              variant: "default",
            });
            resolve();
            navigate('/');
          } else {
            // Show error message
            toast({
              title: "Login failed",
              description: "Invalid email or password",
              variant: "destructive",
            });
            reject(new Error('Invalid email or password'));
          }
        } catch (error) {
          toast({
            title: "Login error",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
          reject(error);
        } finally {
          setLoading(false);
        }
      }, 1000); // Simulate network delay
    });
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Check if email already exists
          if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            toast({
              title: "Signup failed",
              description: "Email already in use",
              variant: "destructive",
            });
            reject(new Error('Email already in use'));
            return;
          }
          
          // Create new user (in a real app, this would be sent to a backend API)
          const newUser: User = {
            id: `${Date.now()}`,
            name,
            email,
            isAdmin: false,
          };
          
          // Add to mock users (in a real app, this would be handled by the backend)
          mockUsers.push(newUser);
          
          // Log in the new user
          setUser(newUser);
          toast({
            title: "Signup successful",
            description: `Welcome, ${name}!`,
            variant: "default",
          });
          resolve();
          navigate('/');
        } catch (error) {
          toast({
            title: "Signup error",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
          reject(error);
        } finally {
          setLoading(false);
        }
      }, 1000); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
      variant: "default",
    });
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
