import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCodeBlockProps {
  code: string;
  language?: string;
  typingSpeed?: number;
  className?: string;
  highlight?: boolean;
}

const AnimatedCodeBlock = ({
  code,
  language = 'javascript',
  typingSpeed = 50,
  className = '',
  highlight = true
}: AnimatedCodeBlockProps) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < code.length && isTyping) {
      const timeout = setTimeout(() => {
        setDisplayedCode(prevCode => prevCode + code[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, typingSpeed);
      
      return () => clearTimeout(timeout);
    } else if (currentIndex >= code.length) {
      setIsTyping(false);
    }
  }, [code, currentIndex, typingSpeed, isTyping]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gray-900 rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-gray-400">{language}</span>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className={`text-gray-100 font-mono text-sm whitespace-pre-wrap ${isTyping ? 'typing-code' : ''}`}>
          {displayedCode}
        </code>
      </pre>
    </motion.div>
  );
};

export default AnimatedCodeBlock;
 