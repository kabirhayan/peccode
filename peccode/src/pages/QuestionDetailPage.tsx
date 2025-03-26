import  { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuestion } from '../hooks/useQuestions';
import { useSubmitCode } from '../hooks/useSubmissions';
import DifficultyBadge from '../components/DifficultyBadge';
import CodeEditor from '../components/CodeEditor';
import { getCodeTemplate } from '../services/codeTemplates';

const QuestionDetailPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [showDescription, setShowDescription] = useState(true);
  const [showSamples, setShowSamples] = useState(true);
  
  const { question, loading: questionLoading } = useQuestion(questionId);
  const { submitCode, loading: submissionLoading, result, error: submissionError } = useSubmitCode({
    onSuccess: (data) => {
      // Display success message
      console.log('Submission successful:', data);
    }
  });

  // Set initial code template when language changes
  useEffect(() => {
    setCode(getCodeTemplate(language));
  }, [language]);

  if (authLoading || questionLoading) {
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

  const handleCodeSubmit = (result: any) => {
    // Handle submission result
    console.log('Submission result:', result);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
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
            <CodeEditor 
              initialCode={code}
              language={language}
              questionId={questionId}
              onCodeChange={setCode}
              onLanguageChange={handleLanguageChange}
              onSubmit={handleCodeSubmit}
            />
            
            {submissionError && (
              <div className="mt-4 p-4 rounded-md bg-red-50 border border-red-200 text-red-700">
                {submissionError}
              </div>
            )}
            
            {result && (
              <div className={`mt-4 p-4 rounded-md ${
                result.status === 'accepted' 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-yellow-50 border-yellow-200 text-yellow-700'
              }`}>
                <p className="font-medium">Submission Status: {result.status}</p>
                <p>{result.status === 'accepted' 
                  ? 'Your solution has been accepted!' 
                  : 'Your solution did not pass all test cases. Try again.'}
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
 