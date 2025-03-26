import  { useState } from 'react';
import { motion } from 'framer-motion';
import { getCodeTemplate2 } from '../services/codeTemplates';

interface CodeTemplateSelectorProps {
  language: string;
  onSelectTemplate: (code: string) => void;
}

const CodeTemplateSelector = ({ language, onSelectTemplate }: CodeTemplateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const templates = [
    { id: 'basic', name: 'Basic Template', description: 'Simple starter code' },
    { id: 'fizzbuzz', name: 'FizzBuzz', description: 'Classic programming problem' },
    { id: 'strings', name: 'String Manipulation', description: 'String operations and palindrome checking' },
    { id: 'sorting', name: 'Bubble Sort', description: 'Simple sorting algorithm implementation' }
  ];
  
  const handleSelectTemplate = (templateId: string) => {
    const templateCode = getCodeTemplate2(language, templateId);
    onSelectTemplate(templateCode);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Template Library
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute left-0 mt-2 w-72 bg-white rounded-md shadow-lg z-20"
          >
            <div className="py-2 px-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Select a Template</h3>
            </div>
            
            <div className="py-2 max-h-60 overflow-y-auto">
              {templates.map((template) => (
                <button
                  key={template.id}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <div className="font-medium text-gray-800">{template.name}</div>
                  <div className="text-xs text-gray-500">{template.description}</div>
                </button>
              ))}
            </div>
            
            <div className="py-2 px-3 border-t border-gray-200 text-xs text-gray-500">
              Selecting a template will replace your current code
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default CodeTemplateSelector;
 