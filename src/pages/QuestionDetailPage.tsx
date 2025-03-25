import  { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Play, Save, TerminalSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getQuestionById } from '../data/mockData';
import DifficultyBadge from '../components/DifficultyBadge';
import CodeTester from '../components/CodeTester';

const QuestionDetailPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [showDescription, setShowDescription] = useState(true);
  const [showSamples, setShowSamples] = useState(true);
  const [showTester, setShowTester] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<null | { status: string; message: string }>(null);

  // In a real app, this would be fetched from an API
  const question = questionId ? getQuestionById(questionId) : undefined;

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

  if (!question) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h2>
          <p className="text-gray-600 mb-6">The question you're looking for doesn't exist or has been removed.</p>
          <a href="/coding" className="btn-primary">Back to Challenges</a>
        </div>
      </div>
    );
  }

  const handleSubmitCode = () => {
    setIsSubmitting(true);
    setResult(null);
    
    // Simulate code submission
    setTimeout(() => {
      setIsSubmitting(false);
      setResult({
        status: Math.random() > 0.3 ? 'success' : 'error',
        message: Math.random() > 0.3 
          ? 'All test cases passed! Your solution has been submitted.'
          : 'Some test cases failed. Please check your code and try again.'
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
              <DifficultyBadge difficulty={question.difficulty} />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="mb-4">
              <button
                className="flex items-center text-gray-700 font-medium"
                onClick={() => setShowDescription(!showDescription)}
              >
                {showDescription ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                <span className="ml-2">Description</span>
              </button>
              
              {showDescription && (
                <div className="mt-3 text-gray-600">
                  <p className="mb-4">{question.description}</p>
                  {question.constraints && (
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-3">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Constraints:</h3>
                      <p className="text-sm">{question.constraints}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <button
                className="flex items-center text-gray-700 font-medium"
                onClick={() => setShowSamples(!showSamples)}
              >
                {showSamples ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                <span className="ml-2">Examples</span>
              </button>
              
              {showSamples && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.sampleInput && (
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Input:</h3>
                      <pre className="text-sm font-mono bg-gray-100 p-2 rounded">{question.sampleInput}</pre>
                    </div>
                  )}
                  
                  {question.sampleOutput && (
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Output:</h3>
                      <pre className="text-sm font-mono bg-gray-100 p-2 rounded">{question.sampleOutput}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <select
                  className="input max-w-xs"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  className="btn-outline flex items-center"
                  onClick={() => setShowTester(!showTester)}
                >
                  <TerminalSquare size={16} className="mr-1" />
                  {showTester ? 'Hide Tester' : 'Test Code'}
                </button>
                <button
                  className="btn-primary flex items-center"
                  onClick={handleSubmitCode}
                  disabled={isSubmitting || !code.trim()}
                >
                  <Save size={16} className="mr-1" />
                  Submit
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <textarea
                className="code-editor w-full"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Write your ${language} code here...`}
                rows={12}
              />
            </div>
            
            {showTester && (
              <CodeTester 
                code={code} 
                language={language} 
                expectedOutput={question.sampleOutput} 
              />
            )}
            
            {isSubmitting && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-600 mr-3"></div>
                  <p className="text-gray-600">
                    {result ? "Processing your submission..." : "Running your code..."}
                  </p>
                </div>
              </div>
            )}
            
            {result && (
              <div className={`p-4 rounded-md border mt-4 ${
                result.status === 'success' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={result.status === 'success' ? 'text-green-700' : 'text-red-700'}>
                  {result.message}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
 