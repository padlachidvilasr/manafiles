import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useAuth } from '../contexts/AuthContext';
import { Database, User, Mail, Lock, ArrowRight } from 'lucide-react';

type AuthMode = 'initial' | 'login' | 'signup' | 'forgotPassword' | 'verifyOtp' | 'resetPassword';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, requestPasswordReset, verifyOtp, resetPassword } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('initial');
  
  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const resetFields = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setOtp('');
    setNewPassword('');
    setError('');
    setSuccess('');
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login(username, password);
      if (result) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signup(username, email, password);
      if (result) {
        navigate('/dashboard');
      } else {
        setError('Username or email already exists');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await requestPasswordReset(email);
      if (result) {
        setSuccess('OTP sent to your email');
        setMode('verifyOtp');
      } else {
        setError('Email not found');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await verifyOtp(otp);
      if (result) {
        setSuccess('OTP verified successfully');
        setMode('resetPassword');
      } else {
        setError('Incorrect OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await resetPassword(newPassword);
      if (result) {
        setSuccess('Password reset successfully');
        setTimeout(() => {
          setMode('login');
          resetFields();
        }, 1500);
      } else {
        setError('Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderInitialButtons = () => (
    <div className="space-y-4 mt-8 animate-fade-in">
      <Button
        variant="primary"
        fullWidth
        onClick={() => {
          resetFields();
          setMode('signup');
        }}
        className="py-3 text-lg"
      >
        Sign Up
      </Button>
      <Button
        variant="outline"
        fullWidth
        onClick={() => {
          resetFields();
          setMode('login');
        }}
        className="py-3 text-lg"
      >
        Login
      </Button>
    </div>
  );
  
  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4 animate-slide-up">
      <InputField
        id="username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <InputField
        id="password"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      {error && <div className="text-red-600 text-sm">{error}</div>}
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        className="mt-6"
      >
        Login
      </Button>
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => {
            resetFields();
            setMode('forgotPassword');
          }}
          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
        >
          Forgot Password?
        </button>
      </div>
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => {
            resetFields();
            setMode('initial');
          }}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          Back to Home
        </button>
      </div>
    </form>
  );
  
  const renderSignupForm = () => (
    <form onSubmit={handleSignup} className="space-y-4 animate-slide-up">
      <InputField
        id="username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <InputField
        id="email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <InputField
        id="password"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      {error && <div className="text-red-600 text-sm">{error}</div>}
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        className="mt-6"
      >
        Sign Up
      </Button>
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => {
            resetFields();
            setMode('initial');
          }}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          Back to Home
        </button>
      </div>
    </form>
  );
  
  const renderForgotPasswordForm = () => (
    <form onSubmit={handleRequestPasswordReset} className="space-y-4 animate-slide-up">
      <InputField
        id="email"
        type="email"
        label="Email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        className="mt-6"
      >
        Get OTP
      </Button>
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => {
            resetFields();
            setMode('login');
          }}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          Back to Login
        </button>
      </div>
    </form>
  );
  
  const renderVerifyOtpForm = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-4 animate-slide-up">
      <InputField
        id="otp"
        label="OTP"
        placeholder="Enter the OTP sent to your email"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        className="mt-6"
      >
        Verify OTP
      </Button>
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => {
            resetFields();
            setMode('forgotPassword');
          }}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          Resend OTP
        </button>
      </div>
    </form>
  );
  
  const renderResetPasswordForm = () => (
    <form onSubmit={handleResetPassword} className="space-y-4 animate-slide-up">
      <InputField
        id="newPassword"
        type="password"
        label="New Password"
        placeholder="Enter your new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        className="mt-6"
      >
        Reset Password
      </Button>
    </form>
  );
  
  const renderForm = () => {
    switch (mode) {
      case 'initial':
        return renderInitialButtons();
      case 'login':
        return renderLoginForm();
      case 'signup':
        return renderSignupForm();
      case 'forgotPassword':
        return renderForgotPasswordForm();
      case 'verifyOtp':
        return renderVerifyOtpForm();
      case 'resetPassword':
        return renderResetPasswordForm();
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Database className="w-16 h-16 text-primary-600 mb-4" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MANAFILES</h1>
          <p className="text-gray-600">Secure file management made simple</p>
        </div>
        
        {mode !== 'initial' && (
          <h2 className="text-xl font-semibold mb-6">
            {mode === 'login' && (
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-primary-600" />
                Login to your account
              </div>
            )}
            {mode === 'signup' && (
              <div className="flex items-center">
                <ArrowRight className="w-5 h-5 mr-2 text-primary-600" />
                Create an account
              </div>
            )}
            {mode === 'forgotPassword' && (
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary-600" />
                Reset your password
              </div>
            )}
            {mode === 'verifyOtp' && (
              <div className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-primary-600" />
                Verify OTP
              </div>
            )}
            {mode === 'resetPassword' && (
              <div className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-primary-600" />
                Set new password
              </div>
            )}
          </h2>
        )}
        
        {renderForm()}
      </div>
    </div>
  );
};

export default AuthPage;