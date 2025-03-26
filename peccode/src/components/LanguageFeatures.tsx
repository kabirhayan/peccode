import  { motion } from 'framer-motion';
import { Code, Terminal, Zap } from 'lucide-react';

const LanguageFeatures = () => {
  const languages = [
    {
      name: 'JavaScript',
      description: 'A versatile language for web development with wide browser support.',
      features: ['Dynamic typing', 'Functional programming', 'Asynchronous capabilities'],
      icon: <Code className="text-yellow-500" />
    },
    {
      name: 'Python',
      description: 'Known for its readability and extensive libraries for data science and AI.',
      features: ['Clean syntax', 'Vast ecosystem', 'Great for beginners'],
      icon: <Terminal className="text-blue-500" />
    },
    {
      name: 'Java',
      description: 'Object-oriented and platform-independent with strong enterprise adoption.',
      features: ['Strong typing', 'OOP paradigm', 'Cross-platform via JVM'],
      icon: <Zap className="text-orange-500" />
    },
    {
      name: 'C++',
      description: 'High-performance language used in systems programming and game development.',
      features: ['Memory management', 'Performance optimization', 'Template metaprogramming'],
      icon: <Terminal className="text-purple-500" />
    },
    {
      name: 'C',
      description: 'Foundational language for system development with direct hardware access.',
      features: ['Procedural paradigm', 'Low-level memory access', 'Highly efficient'],
      icon: <Code className="text-blue-600" />
    }
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Supported Languages</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform supports multiple programming languages to help you practice and improve your coding skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((language, index) => (
            <motion.div
              key={language.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full mr-3">
                    {language.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{language.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{language.description}</p>
                <ul className="space-y-2">
                  {language.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageFeatures;
 