import  { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Question, Submission } from '../types';
import { MOCK_QUESTIONS, MOCK_SUBMISSIONS, getSubmissionsByUser } from '../data/mockData';
import DifficultyBadge from '../components/DifficultyBadge';

const DashboardPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submissions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    title: '',
    description: '',
    difficulty: 'medium' as const,
    tags: [],
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (user) {
      // For staff, show all questions they created
      if (user.role === 'staff') {
        setQuestions(MOCK_QUESTIONS.filter(q => q.createdBy === user.id));
      }
      
      // For both staff and students, show their submissions
      setSubmissions(getSubmissionsByUser(user.id));
    }
  }, [user]);

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

  // Only staff can access certain tabs
  if (user?.role !== 'staff' && (activeTab === 'questions' || activeTab === 'addQuestion')) {
    setActiveTab('submissions');
  }

  const handleAddTag = () => {
    if (newTag && !newQuestion.tags?.includes(newTag)) {
      setNewQuestion({
        ...newQuestion,
        tags: [...(newQuestion.tags || []), newTag],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewQuestion({
      ...newQuestion,
      tags: newQuestion.tags?.filter(tag => tag !== tagToRemove) || [],
    });
  };

  const handleAddQuestion = () => {
    // In a real app, this would be an API call
    const newQuestionObj: Question = {
      id: `q${Math.floor(Math.random() * 1000)}`,
      ...newQuestion as any,
      createdBy: user?.id || '',
      createdAt: new Date().toISOString(),
    };
    
    setQuestions([...questions, newQuestionObj]);
    setIsAddingQuestion(false);
    setNewQuestion({
      title: '',
      description: '',
      difficulty: 'medium' as const,
      tags: [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="border-b">
              <div className="flex overflow-x-auto">
                <button
                  className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                    activeTab === 'submissions'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('submissions')}
                >
                  My Submissions
                </button>
                
                {user?.role === 'staff' && (
                  <button
                    className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                      activeTab === 'questions'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('questions')}
                  >
                    My Questions
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {activeTab === 'submissions' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">My Submissions</h2>
                  </div>
                  
                  {submissions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Problem
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Language
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Submitted
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {submissions.map((submission) => {
                            const question = MOCK_QUESTIONS.find(q => q.id === submission.questionId);
                            return (
                              <tr key={submission.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{question?.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500 capitalize">{submission.language}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    submission.status === 'accepted'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {submission.status === 'accepted' ? (
                                      <CheckCircle size={12} className="mr-1" />
                                    ) : (
                                      <AlertCircle size={12} className="mr-1" />
                                    )}
                                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {new Date(submission.timestamp).toLocaleString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button 
                                    className="text-primary-600 hover:text-primary-900 mr-3"
                                    onClick={() => navigate(`/coding/${question?.id}`)}
                                  >
                                    View Problem
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You haven't submitted any solutions yet.</p>
                      <button 
                        className="btn-primary"
                        onClick={() => navigate('/coding')}
                      >
                        Start Solving
                      </button>
                    </div>
                  )}
                </>
              )}
              
              {activeTab === 'questions' && user?.role === 'staff' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">My Questions</h2>
                    <button
                      className="btn-primary flex items-center"
                      onClick={() => setIsAddingQuestion(true)}
                    >
                      <Plus size={16} className="mr-1" />
                      Add New
                    </button>
                  </div>
                  
                  {questions.length > 0 ? (
                    <div className="space-y-4">
                      {questions.map((question) => (
                        <div 
                          key={question.id}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{question.title}</h3>
                              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{question.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {question.tags.map((tag) => (
                                  <span key={tag} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <DifficultyBadge difficulty={question.difficulty} />
                              <div className="mt-3 flex space-x-2">
                                <button className="p-1.5 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200">
                                  <Edit size={16} />
                                </button>
                                <button className="p-1.5 bg-gray-100 rounded-md text-red-600 hover:bg-red-100">
                                  <Trash size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You haven't created any questions yet.</p>
                      <button 
                        className="btn-primary"
                        onClick={() => setIsAddingQuestion(true)}
                      >
                        Create Your First Question
                      </button>
                    </div>
                  )}
                </>
              )}

              {isAddingQuestion && user?.role === 'staff' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                >
                  <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-bold text-gray-900">Add New Question</h2>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={newQuestion.title}
                          onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                          placeholder="Enter question title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          className="input min-h-[100px]"
                          value={newQuestion.description}
                          onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                          placeholder="Enter question description"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Difficulty
                        </label>
                        <select
                          className="input"
                          value={newQuestion.difficulty}
                          onChange={(e) => setNewQuestion({ 
                            ...newQuestion, 
                            difficulty: e.target.value as 'easy' | 'medium' | 'hard' 
                          })}
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tags
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            className="input rounded-r-none"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Enter a tag"
                          />
                          <button
                            className="btn-primary rounded-l-none"
                            onClick={handleAddTag}
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newQuestion.tags?.map((tag) => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-800 text-sm"
                            >
                              {tag}
                              <button
                                className="ml-1 text-gray-500 hover:text-gray-700"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sample Input (Optional)
                        </label>
                        <textarea
                          className="input font-mono"
                          value={newQuestion.sampleInput || ''}
                          onChange={(e) => setNewQuestion({ ...newQuestion, sampleInput: e.target.value })}
                          placeholder="Enter sample input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sample Output (Optional)
                        </label>
                        <textarea
                          className="input font-mono"
                          value={newQuestion.sampleOutput || ''}
                          onChange={(e) => setNewQuestion({ ...newQuestion, sampleOutput: e.target.value })}
                          placeholder="Enter sample output"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Constraints (Optional)
                        </label>
                        <textarea
                          className="input"
                          value={newQuestion.constraints || ''}
                          onChange={(e) => setNewQuestion({ ...newQuestion, constraints: e.target.value })}
                          placeholder="Enter constraints"
                        />
                      </div>
                    </div>
                    
                    <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                      <button
                        className="btn-outline"
                        onClick={() => setIsAddingQuestion(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-primary"
                        onClick={handleAddQuestion}
                        disabled={!newQuestion.title || !newQuestion.description}
                      >
                        Add Question
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
 