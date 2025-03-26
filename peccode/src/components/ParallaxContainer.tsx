import  { useRef, useEffect, ReactNode } from 'react';

interface ParallaxContainerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const ParallaxContainer = ({
  children,
  speed = 0.1,
  className = '',
  direction = 'up'
}: ParallaxContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollTop = window.scrollY;
      const elementTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
      const elementHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate the distance from the element to the viewport center
      const distanceToCenter = elementTop - scrollTop - windowHeight / 2 + elementHeight / 2;
      const translateValue = distanceToCenter * speed;
      
      if (direction === 'up') {
        containerRef.current.style.transform = `translateY(${-translateValue}px)`;
      } else if (direction === 'down') {
        containerRef.current.style.transform = `translateY(${translateValue}px)`;
      } else if (direction === 'left') {
        containerRef.current.style.transform = `translateX(${-translateValue}px)`;
      } else if (direction === 'right') {
        containerRef.current.style.transform = `translateX(${translateValue}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, direction]);
  
  return (
    <div
      ref={containerRef}
      className={`parallax ${className}`}
    >
      {children}
    </div>
  );
};

export default ParallaxContainer;
 