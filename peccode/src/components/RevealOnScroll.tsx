import  { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  once?: boolean;
}

const RevealOnScroll = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.6,
  once = true
}: RevealOnScrollProps) => {
  // Define animation variants based on direction
  const getVariants = () => {
    switch (direction) {
      case 'up':
        return {
          hidden: { y: 50, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { duration, delay } }
        };
      case 'down':
        return {
          hidden: { y: -50, opacity: 0 },
          visible: { y: 0, opacity: 1, transition: { duration, delay } }
        };
      case 'left':
        return {
          hidden: { x: 50, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration, delay } }
        };
      case 'right':
        return {
          hidden: { x: -50, opacity: 0 },
          visible: { x: 0, opacity: 1, transition: { duration, delay } }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration, delay } }
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
 