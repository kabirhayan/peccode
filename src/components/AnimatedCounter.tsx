import  { useState, useEffect } from 'react';
import CountUp from 'react-countup';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  title?: string;
  description?: string;
}

const AnimatedCounter = ({
  end,
  duration = 2.5,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
  title,
  description
}: AnimatedCounterProps) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    setHasAnimated(true);
  }, []);

  return (
    <div className={`text-center ${className}`}>
      <div className="text-3xl md:text-4xl font-bold text-primary-700">
        {hasAnimated ? (
          <CountUp
            start={0}
            end={end}
            duration={duration}
            suffix={suffix}
            prefix={prefix}
            decimals={decimals}
            separator=","
          />
        ) : (
          <span>{prefix}0{suffix}</span>
        )}
      </div>
      {title && <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>}
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  );
};

export default AnimatedCounter;
 