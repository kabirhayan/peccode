import  { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Question } from '../types';
import DifficultyBadge from './DifficultyBadge';
import { ArrowRight } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  index: number;
}

const QuestionCard = ({ question, index }: QuestionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
      }}
      className="card hover:border-primary-300 border border-transparent"
    >
      <div className="relative overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-100 to-transparent -mr-8 -mt-8 rounded-full"
          style={{ opacity: 0.8 }}
        ></div>
        
        <Link to={`/coding/${question.id}`} className="block p-5 relative">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition">{question.title}</h3>
            <DifficultyBadge difficulty={question.difficulty} />
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{question.description}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {question.tags.map((tag) => (
              <motion.span 
                key={tag} 
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                whileHover={{ scale: 1.05, backgroundColor: "#e0f2fe", color: "#0284c7" }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Created: {new Date(question.createdAt).toLocaleDateString()}</span>
            <motion.div
              className="text-primary-600 flex items-center"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <span className="mr-1 font-medium">Solve</span>
              <ArrowRight size={12} />
            </motion.div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
 