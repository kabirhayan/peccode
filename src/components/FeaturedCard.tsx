import  { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeaturedCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
  color?: string;
}

const FeaturedCard = ({ icon, title, description, index, color = 'bg-primary-100' }: FeaturedCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 50
      }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className={`w-14 h-14 ${color} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default FeaturedCard;
 