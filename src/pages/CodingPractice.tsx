import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Play, Terminal, Save, Book } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import InputOutputSection from '../components/InputOutputSection';

const programmingExamples = [
  {
    id: 'ex1',
    title: 'Basic I/O Example',
    description: 'This example shows how to read input and produce output in different languages.',
    javaScript: 
`// JavaScript Example
function processData(input) {
  // Split the input string by newline
  const lines = input.trim().split('\\n');
  
  // First line is the number of test cases
  const numTestCases = parseInt(lines[0], 10);
  
  // Process each test case
  let results = [];
  for (let i = 1; i <= numTestCases; i++) {
    const value = parseInt(lines[i], 10);
    results.push(value * 2);
  }
  
  // Return the results
  return results.join('\\n');
}

// Test with the provided input
console.log(processData(input));`,
    python: 
`# Python Example
def process_data(input_str):
    # Split the input string by newline
    lines = input_str.strip().split('\\n')
    
    # First line is the number of test cases
    num_test_cases = int(lines[0])
    
    # Process each test case
    results = []
    for i in range(1, num_test_cases + 1):
        value = int(lines[i])
        results.append(str(value * 2))
    
    # Return the results
    return '\\n'.join(results)

# Test with the provided input
print(process_data(input))`,
    sampleInput: `3\n5\n10\n15`,
    sampleOutput: `10\n20\n30`
  },
  {
    id: 'ex2',
    title: 'Array Manipulation',
    description: 'Example of manipulating arrays and processing numeric data.',
    javaScript: 
`// JavaScript Example
function findMaxAndMin(input) {
  // Parse the input array
  const numbers = input.trim().split(/\\s+/).map(Number);
  
  // Find maximum and minimum
  const max = Math.max(...numbers);
  const min = Math.min(...numbers);
  
  // Calculate sum and average
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  const avg = sum / numbers.length;
  
  return \`Max: \${max}
Min: \${min}
Sum: \${sum}
Average: \${avg.toFixed(2)}\`;
}

console.log(findMaxAndMin(input));`,
    python: 
`# Python Example
def find_max_and_min(input_str):
    # Parse the input array
    numbers = list(map(int, input_str.strip().split()))
    
    # Find maximum and minimum
    max_val = max(numbers)
    min_val = min(numbers)
    
    # Calculate sum and average
    sum_val = sum(numbers)
    avg_val = sum_val / len(numbers)
    
    return f"Max: {max_val}\\nMin: {min_val}\\nSum: {sum_val}\\nAverage: {avg_val:.2f}"

print(find_max_and_min(input))`,
    sampleInput: `45 22 87 34 56 91 10 3 28`,
    sampleOutput: `Max: 91\nMin: 3\nSum: 376\nAverage: 41.78`
  }
];

const CodingPractice = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedExample, setSelectedExample] = useState(programmingExamples[0]);
  const [language, setLanguage] = useState('javaScript');
  const [code, setCode] = useState(programmingExamples[0].javaScript);
  const [input, setInput] = useState(programmingExamples[0].sampleInput);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Update code when language or example changes
    if (selectedExample && language) {
      setCode(selectedExample[language as keyof typeof selectedExample] as string || '');
      setInput(selectedExample.sampleInput);
      setOutput(null);
    }
  }, [selectedExample, language]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput(null);
    
    // Simulate code execution
    setTimeout(() => {
      // Basic simulation logic to produce expected outputs for the examples
      if (selectedExample.id === 'ex1') {
        try {
          // Simulate output based on input
          const lines = input.trim().split('\n');
          const numCases = parseInt(lines[0], 10);
          const results = [];
          
          for (let i = 1; i <= numCases && i < lines.length; i++) {
            const value = parseInt(lines[i], 10);
            if (!isNaN(value)) {
              results.push((value * 2).toString());
            } else {
              results.push("Invalid input");
            }
          }
          
          setOutput(results.join('\n'));
        } catch (e) {
          setOutput("Error: " + (e as Error).message);
        }
      } else if (selectedExample.id === 'ex2') {
        try {
          // Simulate array processing
          const numbers = input.trim().split(/\s+/).map(Number);
          if (numbers.some(isNaN)) {
            setOutput("Error: Input contains non-numeric values");
          } else {
            const max = Math.max(...numbers);
            const min = Math.min(...numbers);
            const sum = numbers.reduce((acc, val) => acc + val, 0);
            const avg = sum / numbers.length;
            
            setOutput(`Max: ${max}\nMin: ${min}\nSum: ${sum}\nAverage: ${avg.toFixed(2)}`);
          }
        } catch (e) {
          setOutput("Error: " + (e as Error).message);
        }
      } else {
        setOutput("Execution completed. Output not available in simulation.");
      }
      
      setIsRunning(false);
    }, 1500);
  };

  const selectExample = (example: typeof programmingExamples[0]) => {
    setSelectedExample(example);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Coding Practice</h1>
              <p className="text-gray-600 mt-1">
                Test your code with custom inputs and check the results.
              </p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1482745637430-91c0bbcea3e1?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGUlMjBjb21wdXRlciUyMGtleWJvYXJkfGVufDB8fHx8MTc0MjgwMjMyMXww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800" 
              alt="Programming code on computer keyboard"
              className="hidden md:block w-32 h-32 object-cover rounded-lg shadow-md"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Examples Sidebar */}
            <div className="md:col-span-1 bg-white rounded-xl shadow-md p-4 h-fit">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Book size={18} className="mr-2" />
                Example Programs
              </h2>
              <div className="space-y-2">
                {programmingExamples.map((example) => (
                  <button
                    key={example.id}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedExample.id === example.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-100'
                        : 'hover:bg-gray-50 text-gray-800'
                    }`}
                    onClick={() => selectExample(example)}
                  >
                    <div className="font-medium">{example.title}</div>
                    <div className="text-xs mt-1 text-gray-500 line-clamp-2">
                      {example.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedExample.title}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <select
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="javaScript">JavaScript</option>
                      <option value="python">Python</option>
                    </select>
                    <button 
                      className="btn-primary flex items-center py-1.5 px-3 text-sm"
                      onClick={handleRunCode}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Running...
                        </span>
                      ) : (
                        <>
                          <Play size={14} className="mr-1" />
                          Run
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-gray-600 mb-3 text-sm">
                      {selectedExample.description}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Code size={16} className="inline mr-1" />
                      Code
                    </label>
                    <textarea
                      className="code-editor w-full"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      rows={10}
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Terminal size={16} className="mr-1" />
                      Test your code
                    </div>
                    <InputOutputSection
                      defaultInput={input}
                      onRunCode={handleRunCode}
                      isLoading={isRunning}
                      output={output}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CodingPractice;
 