import  { ArrowRight, Code, Server, Users, Terminal, Book, Globe, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import collegeLogoSrc from '../assets/college-logo.svg';
import RevealOnScroll from '../components/RevealOnScroll';
import AnimatedCounter from '../components/AnimatedCounter';
import FeaturedCard from '../components/FeaturedCard';
import ParallaxContainer from '../components/ParallaxContainer';
import AnimatedImage from '../components/AnimatedImage';
import AnimatedCodeBlock from '../components/AnimatedCodeBlock';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  
  const statsRef = { current: null };
  const statsInView = false;

  const sampleCode = `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return null;
}`;

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1536982679170-1b2277759c92?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzJTIwbW9kZXJuJTIwYnVpbGRpbmd8ZW58MHx8fHwxNzQyNzk0MjI3fDA&ixlib=rb-4.0.3&fit=fillmax")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/60 to-secondary-900/60"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-white"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center space-x-4 mb-6"
              >
                <img src={collegeLogoSrc} alt="Panimalar Engineering College Logo" className="h-16 w-16" />
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Panimalar Engineering College <span className="text-primary-400">Coding Platform</span>
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-xl text-gray-200 mb-8"
              >
                Enhance your programming skills with interactive coding challenges and real-time feedback. 
                Practice, learn, and excel in the world of coding.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {isAuthenticated ? (
                  <Link to="/coding" className="btn-primary px-6 py-3 text-center inline-flex items-center justify-center shiny-button">
                    Start Coding <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <Link to="/login" className="btn-primary px-6 py-3 text-center inline-flex items-center justify-center shiny-button">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
                <Link to="/practice" className="btn border border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 text-center">
                  Try Practice Area
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden md:block"
            >
              <AnimatedCodeBlock 
                code={sampleCode}
                typingSpeed={30}
                className="shadow-2xl"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={24} className="transform rotate-90" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="py-16 bg-gray-100"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
              Empowering Future <span className="text-gradient">Programmers</span>
            </h2>
          </RevealOnScroll>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter 
              end={5000}
              suffix="+"
              title="Students"
              description="Actively coding on our platform"
            />
            
            <AnimatedCounter 
              end={250}
              suffix="+"
              title="Coding Challenges"
              description="From beginner to advanced levels"
            />
            
            <AnimatedCounter 
              end={15}
              suffix="+"
              title="Languages"
              description="Supported programming languages"
            />
            
            <AnimatedCounter 
              end={98}
              suffix="%"
              title="Success Rate"
              description="Students improving their skills"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A modern coding platform designed specifically for Panimalar Engineering College students and staff.
              </p>
            </div>
          </RevealOnScroll>
          
          <div className="grid md:grid-cols-4 gap-8">
            <FeaturedCard
              icon={<Code className="h-7 w-7 text-primary-600" />}
              title="Interactive Coding"
              description="Practice coding with interactive challenges designed to improve your problem-solving skills and algorithmic thinking."
              index={0}
              color="bg-primary-100"
            />
            
            <FeaturedCard
              icon={<Terminal className="h-7 w-7 text-green-600" />}
              title="Custom Test Cases"
              description="Run your code with custom inputs and verify outputs against expected results to ensure correctness."
              index={1}
              color="bg-green-100"
            />
            
            <FeaturedCard
              icon={<Server className="h-7 w-7 text-purple-600" />}
              title="Staff-Curated Content"
              description="Problems and challenges curated by experienced faculty members to align with curriculum and industry standards."
              index={2}
              color="bg-purple-100"
            />
            
            <FeaturedCard
              icon={<Users className="h-7 w-7 text-amber-600" />}
              title="Personalized Learning"
              description="Track your progress, get insights into your performance, and focus on areas that need improvement."
              index={3}
              color="bg-amber-100"
            />
          </div>
        </div>
      </section>
      
      {/* Learning Path Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Coding Journey</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Follow a structured path to mastering programming skills.
              </p>
            </div>
          </RevealOnScroll>
          
          <div className="grid md:grid-cols-3 gap-8">
            <RevealOnScroll delay={0.2}>
              <div className="card-3d p-6 bg-white rounded-xl shadow-md text-center relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-100 rounded-full"></div>
                <div className="relative">
                  <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
                    <Book size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Learn</h3>
                  <p className="text-gray-600">
                    Start with fundamentals and build a strong foundation in algorithms and data structures.
                  </p>
                  <div className="mt-6 text-primary-600 font-medium flex justify-center">
                    <span className="inline-flex items-center">
                      Step 1
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </motion.div>
                    </span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.4}>
              <div className="card-3d p-6 bg-white rounded-xl shadow-md text-center relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-100 rounded-full"></div>
                <div className="relative">
                  <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
                    <Code size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Practice</h3>
                  <p className="text-gray-600">
                    Apply your knowledge to solve diverse coding challenges from easy to advanced levels.
                  </p>
                  <div className="mt-6 text-green-600 font-medium flex justify-center">
                    <span className="inline-flex items-center">
                      Step 2
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </motion.div>
                    </span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.6}>
              <div className="card-3d p-6 bg-white rounded-xl shadow-md text-center relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-100 rounded-full"></div>
                <div className="relative">
                  <div className="mb-4 mx-auto w-16 h-16 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full">
                    <Award size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Master</h3>
                  <p className="text-gray-600">
                    Become proficient in solving complex programming problems and real-world applications.
                  </p>
                  <div className="mt-6 text-purple-600 font-medium flex justify-center">
                    <span className="inline-flex items-center">
                      Step 3
                      <Globe className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        className="py-20 relative overflow-hidden"
        style={{
          background: `linear-gradient(to right, rgba(2, 132, 199, 0.9), rgba(124, 58, 237, 0.9))`,
          backgroundSize: 'cover',
        }}
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.div 
            animate={{ y: [0, -50, 0], opacity: [0.2, 0.3, 0.2] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white opacity-20 blur-3xl"
          />
          <motion.div 
            animate={{ y: [0, 50, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:max-w-lg text-center md:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Ready to Improve Your Coding Skills?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-white/80"
            >
              {isAuthenticated 
                ? `Welcome back, ${user?.name}! Continue your coding journey.`
                : "Join our platform today and take your programming skills to the next level."}
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {isAuthenticated ? (
              <>
                <Link to="/coding" className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-lg font-medium shiny-button">
                  Start Challenges
                </Link>
                <Link to="/practice" className="btn border border-white text-white hover:bg-white hover:text-primary-700 px-8 py-3 text-lg font-medium">
                  Practice Area
                </Link>
              </>
            ) : (
              <Link to="/login" className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-lg font-medium shiny-button">
                Get Started
              </Link>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* College Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <RevealOnScroll direction="right">
              <div>
                <div className="flex items-center mb-5">
                  <img src={collegeLogoSrc} alt="Panimalar Engineering College Logo" className="h-12 w-12 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">About Panimalar Engineering College</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Panimalar Engineering College is a premier educational institution committed to providing quality 
                  engineering education and producing industry-ready graduates.
                </p>
                <p className="text-gray-600 mb-6">
                  Our coding platform is designed to complement classroom learning with practical programming 
                  experience, helping students to excel in their academic and professional careers.
                </p>
                <Link to="/about" className="text-primary-600 font-medium flex items-center hover:text-primary-700 transition">
                  Learn more about PEC 
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </motion.span>
                </Link>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll direction="left">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <div className="relative overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1714520965312-048ce42660b8?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxjb2xsZWdlJTIwY2FtcHVzJTIwbW9kZXJuJTIwYnVpbGRpbmd8ZW58MHx8fHwxNzQyNzk0MjI3fDA&ixlib=rb-4.0.3&fit=fillmax"
                    alt="Panimalar Engineering College" 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-white text-xl font-bold">Campus</h3>
                      <p className="text-white/80">Modern facilities for quality education</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
      
      {/* Education Images Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Learning Resources</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive resources to support your coding journey.
              </p>
            </div>
          </RevealOnScroll>
          
          <div className="grid md:grid-cols-3 gap-8">
            <RevealOnScroll delay={0.1}>
              <div className="rounded-xl overflow-hidden shadow-lg hover-card">
                <AnimatedImage 
                  src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBlZHVjYXRpb24lMjBjb2xsZWdlJTIwY2FtcHVzJTIwc3R1ZGVudHMlMjBwcm9ncmFtbWluZ3xlbnwwfHx8fDE3NDI4MDQzODB8MA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200"
                  alt="Collection of programming books"
                  animationType="reveal"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Digital Library</h3>
                  <p className="text-gray-600">
                    Access our extensive collection of programming books, tutorials, and reference materials.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.2}>
              <div className="rounded-xl overflow-hidden shadow-lg hover-card">
                <AnimatedImage 
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxjb2RpbmclMjBlZHVjYXRpb24lMjBjb2xsZWdlJTIwY2FtcHVzJTIwc3R1ZGVudHMlMjBwcm9ncmFtbWluZ3xlbnwwfHx8fDE3NDI4MDQzODB8MA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200"
                  alt="Love to Learn sign"
                  animationType="reveal"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Interactive Workshops</h3>
                  <p className="text-gray-600">
                    Participate in hands-on workshops led by industry professionals and faculty members.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.3}>
              <div className="rounded-xl overflow-hidden shadow-lg hover-card">
                <AnimatedImage 
                  src="https://images.unsplash.com/photo-1453733190371-0a9bedd82893?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxjb2RpbmclMjBlZHVjYXRpb24lMjBjb2xsZWdlJTIwY2FtcHVzJTIwc3R1ZGVudHMlMjBwcm9ncmFtbWluZ3xlbnwwfHx8fDE3NDI4MDQzODB8MA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200"
                  alt="Math formulas on blackboard"
                  animationType="reveal"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Algorithm Fundamentals</h3>
                  <p className="text-gray-600">
                    Master the mathematical foundations and algorithmic thinking required for efficient coding.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
 