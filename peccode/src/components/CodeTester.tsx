import  { useState } from 'react';
import { Play, TerminalSquare, CheckCircle, X, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodeTesterProps {
  code: string;
  language: string;
  expectedOutput?: string;
}

const CodeTester = ({ code, language, expectedOutput }: CodeTesterProps) => {
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);

  const runCode = () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setOutput(null);
    setIsCorrect(null);
    
    // Simulate code execution with the custom input
    setTimeout(() => {
      // This is a mock execution - in a real system, this would be an API call
      // to a backend service that executes the code with the input
      let simulatedOutput = '';
      
      if (language === 'javascript') {
        if (code.includes('console.log')) {
          if (customInput) {
            // Simple simulation for demonstration purposes
            if (code.includes('twoSum') && customInput.includes('[2,7,11,15]')) {
              simulatedOutput = '[0,1]';
            } else if (code.includes('isValid') && customInput.includes('()[]{}')) {
              simulatedOutput = 'true';
            } else {
              simulatedOutput = 'Output depends on the actual code execution';
            }
          } else {
            simulatedOutput = 'Please provide input to test the code';
          }
        } else {
          simulatedOutput = 'No console.log found in code to display output';
        }
      } else if (language === 'python') {
        if (code.includes('print')) {
          if (customInput) {
            // Simple simulation
            if (code.includes('two_sum') && customInput.includes('[2,7,11,15]')) {
              simulatedOutput = '[0, 1]';
            } else if (code.includes('is_valid') && customInput.includes('()[]{}')) {
              simulatedOutput = 'True';
            } else {
              simulatedOutput = 'Output depends on the actual code execution';
            }
          } else {
            simulatedOutput = 'Please provide input to test the code';
          }
        } else {
          simulatedOutput = 'No print statement found in code to display output';
        }
      } else {
        simulatedOutput = `Execution for ${language} code is simulated`;
      }
      
      setOutput(simulatedOutput);
      
      // Check if output matches expected output (if provided)
      if (isTestMode && expectedOutput) {
        // Very simple string comparison - a real system would need more sophistication
        const normalizedOutput = simulatedOutput.trim().toLowerCase();
        const normalizedExpected = expectedOutput.trim().toLowerCase();
        setIsCorrect(normalizedOutput === normalizedExpected);
      }
      
      setIsRunning(false);
    }, 1500);
  };

  const toggleTestMode = () => {
    setIsTestMode(!isTestMode);
    setOutput(null);
    setIsCorrect(null);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center space-x-4 mb-2">
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            !isTestMode
              ? 'bg-primary-100 text-primary-700 border border-primary-200'
              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
          }`}
          onClick={() => toggleTestMode()}
        >
          <Play size={14} className="inline mr-1" />
          Run Mode
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            isTestMode
              ? 'bg-primary-100 text-primary-700 border border-primary-200'
              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
          }`}
          onClick={() => toggleTestMode()}
        >
          <TerminalSquare size={14} className="inline mr-1" />
          Test Mode
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input
        </label>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder={`Enter test input for your ${language} code...`}
          className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm h-24 focus:ring-primary-500 focus:border-primary-500"
        />
        
        {isTestMode && expectedOutput && (
          <div className="mt-3">
            <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <TerminalSquare size={14} className="mr-1" />
              Expected Output
            </div>
            <div className="p-3 bg-gray-100 rounded-md font-mono text-sm">
              {expectedOutput}
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <button
            className="btn-primary w-full justify-center"
            onClick={runCode}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play size={16} className="mr-2" />
                {isTestMode ? 'Test Code' : 'Run Code'}
              </>
            )}
          </button>
        </div>
        
        {output && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <TerminalSquare size={14} className="mr-1" />
              Output
            </div>
            <div className="p-3 bg-gray-900 text-white rounded-md font-mono text-sm">
              {output}
            </div>
            
            {isTestMode && isCorrect !== null && (
              <div className={`mt-3 p-3 rounded-md flex items-center ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Correct! Your output matches the expected output.
                  </>
                ) : (
                  <>
                    <X size={16} className="mr-2" />
                    Incorrect. Your output doesn't match the expected output.
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CodeTester;
 