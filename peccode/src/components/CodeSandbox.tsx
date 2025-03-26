import  { useState, useEffect } from 'react';
import { Play, Copy, Trash, Save, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeSandboxProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
}

const CodeSandbox = ({ code, language, onCodeChange }: CodeSandboxProps) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  
  // Reset output when language changes
  useEffect(() => {
    setOutput(null);
    setError(null);
  }, [language]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleClearCode = () => {
    if (window.confirm('Are you sure you want to clear your code?')) {
      onCodeChange('');
    }
  };
  
  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('Please write some code before running');
      return;
    }
    
    setIsRunning(true);
    setOutput(null);
    setError(null);
    
    try {
      // This is a simulated execution; in a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock execution results based on language and code content
      let result = '';
      
      if (language === 'javascript') {
        if (code.includes('console.log')) {
          if (code.toLowerCase().includes('hello')) {
            result = 'Hello, World!';
          } else if (code.includes('for') && code.includes('i <')) {
            result = 'Looping...\n1\n2\n3\n4\n5';
          } else {
            result = 'Program executed successfully!';
          }
        } else {
          result = 'No output. Did you forget to use console.log()?';
        }
      } else if (language === 'python') {
        if (code.includes('print')) {
          if (code.toLowerCase().includes('hello')) {
            result = 'Hello, World!';
          } else if ('for' in code && 'range' in code) {
            result = 'Looping...\n1\n2\n3\n4\n5';
          } else {
            result = 'Program executed successfully!';
          }
        } else {
          result = 'No output. Did you forget to use print()?';
        }
      } else if (language === 'c' || language === 'cpp') {
        if (code.includes('printf') || code.includes('cout')) {
          if (code.toLowerCase().includes('hello')) {
            result = 'Hello, World!';
          } else if (code.includes('for') && code.includes('i <')) {
            result = 'Looping...\n1\n2\n3\n4\n5';
          } else {
            result = 'Program executed successfully!';
          }
        } else {
          result = `No output. Did you forget to use ${language === 'c' ? 'printf()' : 'cout'}?`;
        }
      } else {
        result = 'Program executed successfully!';
      }
      
      // If input was provided, show it in the result
      if (input.trim()) {
        result += `\n\nUser input received: ${input}`;
      }
      
      setOutput(result);
    } catch (err: any) {
      setError('Error executing code: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg overflow-hidden relative">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-900 text-gray-300 text-sm">
          <span className="capitalize">{language}</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleCopyCode}
              className="p-1 hover:text-white transition-colors"
              title="Copy Code"
            >
              <Copy size={16} />
            </button>
            <button 
              onClick={handleClearCode}
              className="p-1 hover:text-white transition-colors"
              title="Clear Code"
            >
              <Trash size={16} />
            </button>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="p-1 hover:text-white transition-colors"
              title="Language Info"
            >
              <Info size={16} />
            </button>
          </div>
        </div>
        <textarea
          className="w-full bg-gray-800 text-gray-100 font-mono text-sm p-4 focus:outline-none"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          rows={10}
          spellCheck={false}
        />
        
        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-2 top-12 bg-gray-900 text-white p-4 rounded-md shadow-lg z-10 text-sm max-w-xs"
            >
              <h4 className="font-semibold mb-2">About {language.charAt(0).toUpperCase() + language.slice(1)}</h4>
              <p className="mb-2">
                {language === 'javascript' && 'JavaScript is a high-level, interpreted language used for web development, desktop apps, and more.'}
                {language === 'python' && 'Python is a popular, easy-to-read language known for its simplicity and power in data science, AI, and general-purpose programming.'}
                {language === 'java' && 'Java is a class-based, object-oriented language designed for portability and security across platforms.'}
                {language === 'cpp' && 'C++ is a powerful language used for system programming, game development, and performance-critical applications.'}
                {language === 'c' && 'C is a procedural language that offers high control over hardware with low overhead, ideal for system programming.'}
              </p>
              <div className="text-xs opacity-75">Note: The executor here simulates code behavior.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
            Input
          </div>
          <textarea
            className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-primary-500 focus:border-primary-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter input for your code (if needed)..."
          />
        </div>
        
        <div>
          <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
            Output
          </div>
          {output ? (
            <pre className="min-h-[150px] p-3 bg-gray-900 text-white rounded-md font-mono text-sm overflow-y-auto">
              {output}
            </pre>
          ) : error ? (
            <div className="min-h-[150px] p-3 bg-red-50 text-red-700 rounded-md font-mono text-sm overflow-y-auto border border-red-200">
              {error}
            </div>
          ) : (
            <div className="min-h-[150px] p-3 bg-gray-100 text-gray-500 rounded-md font-mono text-sm flex items-center justify-center">
              {isRunning ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-primary-600 rounded-full mr-2"></div>
                  Executing code...
                </div>
              ) : (
                "Output will appear here after running your code"
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary flex items-center py-2 px-6"
          onClick={handleRunCode}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
              Executing...
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" />
              Run Code
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default CodeSandbox;
 