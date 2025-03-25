import  { motion } from 'framer-motion';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  animationType?: 'float' | 'rotate' | 'pulse' | 'zoom' | 'slide' | 'reveal';
  delay?: number;
  duration?: number;
}

const AnimatedImage = ({
  src,
  alt,
  className = '',
  style = {},
  animationType = 'float',
  delay = 0,
  duration = 0.5
}: AnimatedImageProps) => {
  // Define animation variants based on animationType
  const getAnimationVariants = () => {
    switch (animationType) {
      case 'float':
        return {
          initial: { y: 20, opacity: 0 },
          animate: { 
            y: 0, 
            opacity: 1,
            transition: {
              delay,
              duration,
              yoyo: Infinity,
              repeatType: 'reverse',
              repeat: Infinity,
              repeatDelay: 1.5
            }
          }
        };
      
      case 'rotate':
        return {
          initial: { rotate: -10, opacity: 0 },
          animate: { 
            rotate: 10, 
            opacity: 1,
            transition: {
              delay,
              duration: duration * 2,
              yoyo: Infinity,
              repeatType: 'reverse',
              repeat: Infinity,
              repeatDelay: 0.2
            }
          }
        };
        
      case 'pulse':
        return {
          initial: { scale: 0.9, opacity: 0.8 },
          animate: { 
            scale: 1, 
            opacity: 1,
            transition: {
              delay,
              duration,
              yoyo: Infinity,
              repeatType: 'reverse',
              repeat: Infinity
            }
          }
        };
      
      case 'zoom':
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { 
            scale: 1, 
            opacity: 1,
            transition: {
              delay,
              duration,
              type: 'spring',
              stiffness: 200,
              damping: 10
            }
          }
        };
        
      case 'slide':
        return {
          initial: { x: -100, opacity: 0 },
          animate: { 
            x: 0, 
            opacity: 1,
            transition: {
              delay,
              duration,
              type: 'spring',
              stiffness: 50,
              damping: 10
            }
          }
        };
        
      case 'reveal':
      default:
        return {
          initial: { opacity: 0 },
          animate: { 
            opacity: 1,
            transition: {
              delay,
              duration
            }
          }
        };
    }
  };
  
  const variants = getAnimationVariants();
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      className={className}
      style={style}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-auto object-cover"
      />
    </motion.div>
  );
};

export default AnimatedImage;
 