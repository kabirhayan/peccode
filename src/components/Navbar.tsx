import  { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code, Home, Settings, LayoutDashboard, ChevronDown, User, LogOut, Menu, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfilePicture from './ProfilePicture';
import collegeLogoSrc from '../assets/college-logo.svg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/coding', label: 'Challenges', icon: <Code size={18} /> },
    { to: '/practice', label: 'Practice', icon: <Terminal size={18} /> },
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm ${
        isScrolled 
          ? 'bg-white/90 shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <motion.img 
              src={collegeLogoSrc} 
              alt="Panimalar Engineering College" 
              className="h-9 w-9"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            />
            <motion.span 
              className="text-xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              PEC<span className="text-primary-600">Code</span>
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-md transition ${
                      isActive(link.to)
                        ? 'text-primary-600 font-semibold'
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    
                    {isActive(link.to) && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-primary-600 w-full"
                        layoutId="activeNavIndicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {user ? (
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ProfilePicture 
                    src={user.profilePic}
                    alt={user.name}
                    size="md"
                  />
                  <span className="text-gray-700">{user.name}</span>
                  <motion.div
                    animate={{ rotate: showDropdown ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b">
                        <div className="flex items-center space-x-3">
                          <ProfilePicture 
                            src={user.profilePic}
                            alt={user.name}
                            size="lg"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-600">
                              {user.role === 'staff' ? 'Staff' : 'Student'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User size={14} className="mr-2" />
                        Profile
                      </Link>
                      <motion.button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <LogOut size={14} className="mr-2" />
                        Sign out
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                className="flex space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Link to="/login" className="btn-primary">
                  Sign in
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button 
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="h-6 w-6 text-gray-800" /> : <Menu className="h-6 w-6 text-gray-800" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-3 space-y-3">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center space-x-3 px-2 py-2 rounded-md transition ${
                      isActive(link.to)
                        ? 'text-primary-600 font-semibold bg-primary-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={closeMenu}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              ))}
              
              {user ? (
                <>
                  <motion.div 
                    className="border-t border-gray-200 pt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center px-2 py-2">
                      <ProfilePicture 
                        src={user.profilePic}
                        alt={user.name}
                        size="lg"
                        className="mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center space-x-3 px-2 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                      onClick={closeMenu}
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </Link>
                    <motion.button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="w-full flex items-center space-x-3 px-2 py-2 text-red-600 hover:bg-gray-50 rounded-md"
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogOut size={18} />
                      <span>Sign out</span>
                    </motion.button>
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  className="border-t border-gray-200 pt-3 flex flex-col space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    to="/login"
                    className="btn-primary w-full text-center"
                    onClick={closeMenu}
                  >
                    Sign in
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
 