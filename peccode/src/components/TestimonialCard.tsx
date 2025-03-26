import  { motion } from 'framer-motion';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  index: number;
  image?: string;
}

const TestimonialCard = ({ quote, name, role, index, image }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-md p-6 relative"
    >
      {/* Quote marks */}
      <div className="absolute top-4 left-6 opacity-10 text-7xl leading-none text-primary-600">"</div>
      
      <div className="relative">
        <p className="text-gray-700 text-lg mb-6">{quote}</p>
        
        <div className="flex items-center">
          {image && (
            <img 
              src={image} 
              alt={name} 
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
          )}
          <div>
            <h4 className="font-medium text-gray-900">{name}</h4>
            <p className="text-gray-500 text-sm">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
 