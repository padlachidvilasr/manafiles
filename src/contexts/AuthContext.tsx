import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  
  // Mock users for demo
  const [users, setUsers] = useState<Array<{id: string; username: string; email: string; password: string}>>([
    { id: '1', username: 'demo', email: 'demo@example.com', password: 'password123' }
  ]);

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('manafiles_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('manafiles_user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate network request
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = users.find(
          (u) => u.username === username && u.password === password
        );
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          setIsAuthenticated(true);
          localStorage.setItem('manafiles_user', JSON.stringify(userWithoutPassword));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulate network request
    return new Promise((resolve) => {
      setTimeout(() => {
        const userExists = users.some(
          (u) => u.username === username || u.email === email
        );
        
        if (userExists) {
          resolve(false);
        } else {
          const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password
          };
          
          setUsers((prevUsers) => [...prevUsers, newUser]);
          
          const { password: _, ...userWithoutPassword } = newUser;
          setUser(userWithoutPassword);
          setIsAuthenticated(true);
          localStorage.setItem('manafiles_user', JSON.stringify(userWithoutPassword));
          resolve(true);
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('manafiles_user');
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userExists = users.some((u) => u.email === email);
        
        if (userExists) {
          setResetEmail(email);
          resolve(true);
          console.log('OTP sent to email:', email); // In a real app, this would send an actual email
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo, we'll accept "123456" as the valid OTP
        if (otp === '123456') {
          setOtpVerified(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const resetPassword = async (newPassword: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otpVerified && resetEmail) {
          const updatedUsers = users.map((user) => {
            if (user.email === resetEmail) {
              return { ...user, password: newPassword };
            }
            return user;
          });
          
          setUsers(updatedUsers);
          setOtpVerified(false);
          setResetEmail('');
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        requestPasswordReset,
        verifyOtp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};