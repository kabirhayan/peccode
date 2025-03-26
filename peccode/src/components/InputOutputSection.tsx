import  { useState } from 'react';
import { motion } from 'framer-motion';

interface InputOutputSectionProps {
  inputTitle?: string;
  outputTitle?: string;
  defaultInput?: string;
  placeholderInput?: string;
  isReadOnly?: boolean;
  onRunCode?: (input: string) => void;
  isLoading?: boolean;
  output?: string | null;
}

const InputOutputSection = ({
  inputTitle = 'Input',
  outputTitle = 'Output',
  defaultInput = '',
  placeholderInput = 'Enter your input here...',
  isReadOnly = false,
  onRunCode,
  isLoading = false,
  output = null
}: InputOutputSectionProps) => {
  const [input, setInput] = useState(defaultInput);

  const handleRunCode = () => {
    if (onRunCode) {
      onRunCode(input);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">{inputTitle}</h3>
        </div>
        <textarea
          className="w-full p-3 bg-white border border-gray-300 rounded-md font-mono text-sm h-36 focus:ring-primary-500 focus:border-primary-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholderInput}
          readOnly={isReadOnly}
        />
        {onRunCode && (
          <div className="mt-3">
            <button 
              className="btn-primary w-full justify-center"
              onClick={handleRunCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Run Code'
              )}
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">{outputTitle}</h3>
        {output ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-gray-900 text-white rounded-md font-mono text-sm h-36 overflow-auto"
          >
            <pre className="whitespace-pre-wrap">{output}</pre>
          </motion.div>
        ) : (
          <div className="p-3 bg-gray-200 text-gray-500 rounded-md font-mono text-sm h-36 flex items-center justify-center">
            {isLoading 
              ? "Running your code..." 
              : "Output will appear here after running the code"}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputOutputSection;
 