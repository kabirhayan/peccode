import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, ArrowRight } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuestions } from '../hooks/useQuestions';
import QuestionCard from '../components/QuestionCard';

const CodingPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  
  const { 
    questions, 
    loading: questionsLoading, 
    updateFilters 
  } = useQuestions({
    initialFilters: {
      difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
      tag: tagFilter !== 'all' ? tagFilter : undefined,
      search: searchTerm || undefined
    }
  });
  
  // Extract unique tags
  const availableTags = Array.from(
    new Set(questions.flatMap(q => q.tags))
  );

  if (authLoading || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"
        ></motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      search: searchTerm,
      difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
      tag: tagFilter !== 'all' ? tagFilter : undefined
    });
  };
  
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const difficulty = e.target.value;
    setDifficultyFilter(difficulty);
    updateFilters({
      difficulty: difficulty !== 'all' ? difficulty : undefined,
      tag: tagFilter !== 'all' ? tagFilter : undefined,
      search: searchTerm || undefined
    });
  };
  
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tag = e.target.value;
    setTagFilter(tag);
    updateFilters({
      difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
      tag: tag !== 'all' ? tag : undefined,
      search: searchTerm || undefined
    });
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setDifficultyFilter('all');
    setTagFilter('all');
    updateFilters({});
  };

  const filteredQuestions = questions;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <span className="text-gradient">Coding Challenges</span>
            <motion.div
              className="ml-3"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <Code size={28} className="text-primary-600" />
            </motion.div>
          </h1>
          <p className="text-gray-600 mb-8">
            Improve your coding skills by solving these challenges. Filter by difficulty or search for specific topics.
          </p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-md p-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search challenges..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              
              <div className="flex md:items-center space-x-4">
                <motion.button
                  type="button"
                  className="md:hidden bg-gray-100 p-2 rounded-md text-gray-700"
                  onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter size={20} />
                </motion.button>
                
                <div className="hidden md:flex space-x-4">
                  <div className="relative">
                    <select
                      className="input appearance-none pl-10"
                      value={difficultyFilter}
                      onChange={handleDifficultyChange}
                    >
                      <option value="all">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  
                  <div className="relative">
                    <select
                      className="input appearance-none pl-10"
                      value={tagFilter}
                      onChange={handleTagChange}
                    >
                      <option value="all">All Topics</option>
                      {availableTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  
                  <button type="submit" className="btn-primary">
                    Search
                  </button>
                </div>
              </div>
            </div>
            
            <AnimatePresence>
              {isFiltersVisible && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden mt-4 space-y-3 pt-3 border-t"
                >
                  <div className="relative">
                    <select
                      className="input appearance-none pl-10 w-full"
                      value={difficultyFilter}
                      onChange={handleDifficultyChange}
                    >
                      <option value="all">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  
                  <div className="relative">
                    <select
                      className="input appearance-none pl-10 w-full"
                      value={tagFilter}
                      onChange={handleTagChange}
                    >
                      <option value="all">All Topics</option>
                      {availableTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  
                  <button type="submit" className="btn-primary w-full">
                    Search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {filteredQuestions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((question, index) => (
              <QuestionCard key={question.id} question={question} index={index} />
            ))}
          </div>
        ) : (
          <motion.div 
            className="bg-white rounded-xl shadow-md p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-600 mb-4">No challenges found matching your filters.</p>
            <motion.button
              onClick={clearFilters}
              className="btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Custom Code component with animation
const Code = ({ size, className }: { size: number; className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
};

export default CodingPage;
 