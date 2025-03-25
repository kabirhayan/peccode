import  { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  children?: ReactNode;
}

const DifficultyBadge = ({ difficulty, children }: DifficultyBadgeProps) => {
  const badgeClasses = {
    easy: 'bg-green-100 text-green-800 border border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    hard: 'bg-red-100 text-red-800 border border-red-200',
  };

  const glowColors = {
    easy: '0 0 8px rgba(34, 197, 94, 0.5)',
    medium: '0 0 8px rgba(234, 179, 8, 0.5)',
    hard: '0 0 8px rgba(239, 68, 68, 0.5)',
  };

  return (
    <motion.span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[difficulty]}`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: glowColors[difficulty]
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 17 }}
    >
      {difficulty === 'hard' && (
        <motion.span
          animate={{ 
            opacity: [1, 0.7, 1],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1.5"
        />
      )}
      {children || difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </motion.span>
  );
};

export default DifficultyBadge;
 