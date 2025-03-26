import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Lock, User, Mail, School, Code, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import collegeLogoSrc from '../assets/college-logo.svg';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    department: 'Computer Science'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.email.endsWith('panimalar.edu')) {
      setError('Please use your Panimalar college email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.rollNumber.trim()) {
      setError('Roll number is required');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        rollNumber: formData.rollNumber,
        department: formData.department,
        role: 'student'
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image section (hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwc3R1ZGVudCUyMHJlZ2lzdHJhdGlvbiUyMHNpZ251cHxlbnwwfHx8fDE3NDI5NzkzMzd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800" 
          alt="Student registration" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-transparent flex flex-col justify-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <img src={collegeLogoSrc} alt="Panimalar Logo" className="h-14 w-14 mr-4" />
              <h1 className="text-4xl font-bold text-white">
                Student <span className="text-primary-400">Registration</span>
              </h1>
            </div>
            <p className="text-gray-300 text-xl max-w-md mb-12">
              Join Panimalar's coding platform to enhance your programming skills and compete with your peers.
            </p>
            
            {/* Benefits list */}
            <div className="max-w-md bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-white text-xl font-semibold mb-4">Why join our platform?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary-500 p-2 rounded-full text-white mr-3 flex-shrink-0">
                    <Code size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Practice Real Problems</h4>
                    <p className="text-gray-300 text-sm">Access a library of coding challenges curated by our faculty members.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary-500 p-2 rounded-full text-white mr-3 flex-shrink-0">
                    <School size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Improve Skills</h4>
                    <p className="text-gray-300 text-sm">Track your progress and get better at programming through practice.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary-500 p-2 rounded-full text-white mr-3 flex-shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Personalized Learning</h4>
                    <p className="text-gray-300 text-sm">Get recommendations based on your performance and interests.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right side - Signup Form */}
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                <div className="text-sm text-gray-500">
                  Step {step}/2
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
                <motion.div 
                  initial={{ width: "50%" }}
                  animate={{ width: step === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.3 }}
                  className="bg-primary-600 h-full"
                />
              </div>
              
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
              
              <form>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={16} className="text-gray-400" />
                          </div>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="input pl-10"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                          College Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={16} className="text-gray-400" />
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="input pl-10"
                            placeholder="yourid@panimalar.edu"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500 flex items-center">
                          <Info size={12} className="mr-1" />
                          Use your official Panimalar college email
                        </p>
                      </div>
                      
                      <div className="pt-2">
                        <motion.button
                          type="button"
                          className="w-full btn-primary py-2.5 px-4"
                          onClick={handleNextStep}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Continue
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                  
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={16} className="text-gray-400" />
                          </div>
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="input pl-10 pr-10"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Must be at least 8 characters
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={16} className="text-gray-400" />
                          </div>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            className="input pl-10 pr-10"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="rollNumber">
                          Roll Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <School size={16} className="text-gray-400" />
                          </div>
                          <input
                            id="rollNumber"
                            name="rollNumber"
                            type="text"
                            required
                            className="input pl-10"
                            placeholder="e.g., 21CSE101"
                            value={formData.rollNumber}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="department">
                          Department
                        </label>
                        <select
                          id="department"
                          name="department"
                          className="input"
                          value={formData.department}
                          onChange={handleChange}
                        >
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex space-x-3 pt-2">
                        <motion.button
                          type="button"
                          className="flex-1 btn-outline py-2.5 px-4"
                          onClick={handlePrevStep}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Back
                        </motion.button>
                        <motion.button
                          type="button"
                          className={`flex-1 flex justify-center items-center btn-primary py-2.5 px-4 ${
                            isLoading ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                          disabled={isLoading}
                          onClick={handleSubmit}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating account...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <UserPlus size={16} className="mr-2" />
                              Sign up
                            </span>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
            
            <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t">
              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                  Sign in
                </Link>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>By signing up, you agree to our <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
 