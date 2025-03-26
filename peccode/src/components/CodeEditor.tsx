import  { useState, useEffect } from 'react';
import { Play, Save, TerminalSquare } from 'lucide-react';
import { submissionService } from '../services/api';

interface CodeEditorProps {
  initialCode?: string;
  language: string;
  questionId?: string;
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  onSubmit?: (result: any) => void;
}

const CodeEditor = ({ 
  initialCode = '', 
  language, 
  questionId,
  onCodeChange,
  onLanguageChange,
  onSubmit
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    if (onCodeChange) {
      onCodeChange(e.target.value);
    }
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onLanguageChange) {
      onLanguageChange(e.target.value);
    }
  };
  
  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('Please write some code before running');
      return;
    }
    
    setIsExecuting(true);
    setOutput(null);
    setError(null);
    
    try {
      const result = await submissionService.executeCode({
        language,
        code,
        input: customInput
      });
      
      setOutput(result.output);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to execute code');
      setOutput(null);
    } finally {
      setIsExecuting(false);
    }
  };
  
  const handleSubmitCode = async () => {
    if (!code.trim()) {
      setError('Please write some code before submitting');
      return;
    }
    
    if (!questionId) {
      setError('No question ID provided for submission');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await submissionService.submitCode({
        questionId,
        language,
        code
      });
      
      if (onSubmit) {
        onSubmit(result);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit code');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <select
          className="input max-w-xs"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>
        
        <div className="flex space-x-3">
          <button
            onClick={handleRunCode}
            disabled={isExecuting}
            className="btn-outline flex items-center"
          >
            {isExecuting ? (
              <>
                <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-primary-600 rounded-full mr-2"></div>
                Running...
              </>
            ) : (
              <>
                <Play size={16} className="mr-2" />
                Run Code
              </>
            )}
          </button>
          
          {questionId && (
            <button
              onClick={handleSubmitCode}
              disabled={isSubmitting}
              className="btn-primary flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Submit
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <textarea
          className="code-editor w-full"
          value={code}
          onChange={handleCodeChange}
          placeholder={`Write your ${language} code here...`}
          rows={12}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <TerminalSquare size={16} className="mr-1" />
            Input
          </div>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm h-36 focus:ring-primary-500 focus:border-primary-500"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter input for your code..."
          />
        </div>
        
        <div>
          <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <TerminalSquare size={16} className="mr-1" />
            Output
          </div>
          {output ? (
            <div className="p-3 bg-gray-900 text-white rounded-md font-mono text-sm h-36 overflow-auto whitespace-pre-wrap">
              {output}
            </div>
          ) : (
            <div className="p-3 bg-gray-100 text-gray-500 rounded-md font-mono text-sm h-36 flex items-center justify-center">
              {isExecuting ? "Executing code..." : "Output will appear here"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
 