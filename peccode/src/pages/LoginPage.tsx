import  { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, LogIn, Lock, User, Mail, School, Code, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import collegeLogoSrc from '../assets/college-logo.svg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'staff'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('login');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const backgroundImages = [
    "https://images.unsplash.com/photo-1741636371327-175a62b1a6e2?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb2xsZWdlJTIwY2FtcHVzJTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmUlMjBlZHVjYXRpb258ZW58MHx8fHwxNzQyOTc3NDk0fDA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBjb2xsZWdlJTIwY2FtcHVzJTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmUlMjBlZHVjYXRpb258ZW58MHx8fHwxNzQyOTc3NDk0fDA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200",
    "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBjb2xsZWdlJTIwY2FtcHVzJTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmUlMjBlZHVjYXRpb258ZW58MHx8fHwxNzQyOTc3NDk0fDA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200"
  ];

  // Change background image every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password, role);
      navigate(role === 'staff' ? '/dashboard' : '/coding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // For demo credentials
  const fillDemoCredentials = (userType: 'student' | 'staff') => {
    if (userType === 'student') {
      setEmail('student@panimalar.edu');
      setPassword('password');
      setRole('student');
    } else {
      setEmail('staff@panimalar.edu');
      setPassword('password');
      setRole('staff');
    }
  };

  const features = [
    { icon: <Code size={20} />, text: "Practice coding challenges" },
    { icon: <School size={20} />, text: "Learn programming skills" },
    { icon: <Lock size={20} />, text: "Secure login system" }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Image Section - Hidden on mobile */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="hidden lg:block lg:w-1/2 relative overflow-hidden"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center mb-6">
                <img src={collegeLogoSrc} alt="Panimalar Logo" className="h-14 w-14 mr-4" />
                <h1 className="text-4xl font-bold text-white">
                  Panimalar <span className="text-primary-400">Coding Platform</span>
                </h1>
              </div>
              <p className="text-gray-300 text-xl max-w-md mb-12">
                Enhance your programming skills with interactive coding challenges designed by experts.
              </p>
              
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.2 }}
                    className="flex items-center text-white"
                  >
                    <div className="bg-primary-500 p-2 rounded-full mr-4">
                      {feature.icon}
                    </div>
                    <span className="text-lg">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Image pagination dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <img src={collegeLogoSrc} alt="Panimalar Logo" className="h-16 w-16" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="flex mb-6 border-b">
                <button
                  className={`pb-3 px-4 font-medium text-sm focus:outline-none transition-colors ${
                    activeTab === 'login'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('login')}
                >
                  Sign In
                </button>
                <button
                  className={`pb-3 px-4 font-medium text-sm focus:outline-none transition-colors ${
                    activeTab === 'about'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('about')}
                >
                  About Platform
                </button>
              </div>

              {activeTab === 'login' ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
                  <p className="text-gray-600 mb-6">Enter your credentials to access your account</p>
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center"
                    >
                      <div className="mr-2 flex-shrink-0">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {error}
                    </motion.div>
                  )}
                  
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
                        I am a
                      </label>
                      <div className="flex space-x-4">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={`flex-1 py-2.5 px-3 border rounded-lg text-center transition flex items-center justify-center ${
                            role === 'student'
                              ? 'bg-primary-50 border-primary-600 text-primary-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setRole('student')}
                        >
                          <School size={16} className="mr-2" />
                          Student
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={`flex-1 py-2.5 px-3 border rounded-lg text-center transition flex items-center justify-center ${
                            role === 'staff'
                              ? 'bg-primary-50 border-primary-600 text-primary-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setRole('staff')}
                        >
                          <User size={16} className="mr-2" />
                          Staff
                        </motion.button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={16} className="text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          required
                          className="input pl-10"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={16} className="text-gray-400" />
                        </div>
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="input pl-10 pr-10"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>
                      <div className="text-sm">
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    
                    <motion.button
                      type="submit"
                      className={`w-full flex justify-center items-center btn-primary py-2.5 px-4 ${
                        isLoading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                      disabled={isLoading}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <LogIn size={16} className="mr-2" />
                          Sign in
                        </span>
                      )}
                    </motion.button>

                    <div className="pt-3 text-center text-sm">
                      <span className="text-gray-600">Don't have an account?{' '}</span>
                      <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                        Sign up now
                      </Link>
                    </div>

                    <div className="relative py-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-sm text-gray-500">Demo accounts</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.button 
                        type="button"
                        onClick={() => fillDemoCredentials('student')}
                        className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex items-center justify-center">
                          <School size={16} className="mr-2 text-primary-600" />
                          Student Login
                        </span>
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => fillDemoCredentials('staff')}
                        className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex items-center justify-center">
                          <User size={16} className="mr-2 text-primary-600" />
                          Staff Login
                        </span>
                      </motion.button>
                    </div>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-600 space-y-4"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">About Our Platform</h2>
                  
                  <p>
                    The Panimalar Engineering College Coding Platform is designed to help students enhance their programming skills through interactive challenges and practice sessions.
                  </p>
                  
                  <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                    <h3 className="font-semibold text-primary-700 mb-2">Key Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <ArrowRight size={16} className="mt-1 mr-2 text-primary-500" />
                        <span>Curated coding challenges created by faculty</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight size={16} className="mt-1 mr-2 text-primary-500" />
                        <span>Real-time code execution and feedback</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight size={16} className="mt-1 mr-2 text-primary-500" />
                        <span>Multiple programming language support</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight size={16} className="mt-1 mr-2 text-primary-500" />
                        <span>Performance tracking and progress analytics</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p>
                    Staff members can create custom challenges, track student progress, and provide feedback on submissions.
                  </p>
                  
                  <div className="pt-3">
                    <button
                      onClick={() => setActiveTab('login')}
                      className="btn-primary w-full py-2.5"
                    >
                      <span className="flex items-center justify-center">
                        <LogIn size={16} className="mr-2" />
                        Go to Login
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t">
              <div className="text-center text-sm text-gray-600">
                <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
 