import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash, Copy, FileText, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getCodeTemplate } from '../services/codeTemplates';
import CodeSandbox from '../components/CodeSandbox';

const CodingPractice = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [savedSnippets, setSavedSnippets] = useState<Array<{
    id: string;
    name: string;
    language: string;
    code: string;
    createdAt: string;
  }>>([]);
  const [currentSnippetName, setCurrentSnippetName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Initialize with a code template when language changes
  useEffect(() => {
    setCode(getCodeTemplate(language));
  }, [language]);

  // Load saved snippets from localStorage
  useEffect(() => {
    const storedSnippets = localStorage.getItem('codeSnippets');
    if (storedSnippets) {
      setSavedSnippets(JSON.parse(storedSnippets));
    }
  }, []);

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

  const handleLanguageChange = (newLanguage: string) => {
    if (code !== getCodeTemplate(language) && 
        !window.confirm('Changing language will reset your current code. Continue?')) {
      return;
    }
    setLanguage(newLanguage);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleSaveSnippet = () => {
    if (!currentSnippetName) return;
    
    const snippetId = Date.now().toString();
    const newSnippet = {
      id: snippetId,
      name: currentSnippetName,
      language,
      code,
      createdAt: new Date().toISOString()
    };
    
    const updatedSnippets = [...savedSnippets, newSnippet];
    setSavedSnippets(updatedSnippets);
    localStorage.setItem('codeSnippets', JSON.stringify(updatedSnippets));
    
    setShowSaveDialog(false);
    setCurrentSnippetName('');
    showNotification('Snippet saved successfully!');
  };

  const handleDeleteSnippet = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this snippet?')) return;
    
    const updatedSnippets = savedSnippets.filter(snippet => snippet.id !== id);
    setSavedSnippets(updatedSnippets);
    localStorage.setItem('codeSnippets', JSON.stringify(updatedSnippets));
    showNotification('Snippet deleted successfully!');
  };

  const handleLoadSnippet = (snippet: typeof savedSnippets[0]) => {
    if (code !== getCodeTemplate(language) && 
        !window.confirm('Loading this snippet will replace your current code. Continue?')) {
      return;
    }
    
    setLanguage(snippet.language);
    setCode(snippet.code);
    showNotification('Snippet loaded successfully!');
  };

  const handleDownloadCode = () => {
    const extension = getFileExtension(language);
    const fileName = `code_snippet${extension}`;
    const blob = new Blob([code], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (lang: string) => {
    switch (lang) {
      case 'javascript': return '.js';
      case 'python': return '.py';
      case 'java': return '.java';
      case 'cpp': return '.cpp';
      case 'c': return '.c';
      default: return '.txt';
    }
  };

  const showNotification = (message: string) => {
    setNotificationMessage(message);
    setTimeout(() => setNotificationMessage(''), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <h1 className="text-3xl font-bold text-gray-900">Coding Sandbox</h1>
              <p className="text-gray-600 mt-1">
                Practice any programming language with a flexible editor and custom input/output.
              </p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcmFjdGljZSUyMHByb2dyYW1taW5nJTIwd29ya3NwYWNlJTIwY29tcHV0ZXJ8ZW58MHx8fHwxNzQyOTc3MTAwfDA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200" 
              alt="Coding workspace with MacBook and plant"
              className="hidden lg:block w-32 h-32 object-cover rounded-lg shadow-md"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Saved Snippets Sidebar */}
            <div className="md:col-span-1 bg-white rounded-xl shadow-md p-4 h-fit">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText size={18} className="mr-2 text-primary-600" />
                  Saved Snippets
                </h2>
                <button 
                  onClick={() => setShowSaveDialog(true)}
                  className="btn-primary rounded-full p-1"
                  title="Save Current Code"
                >
                  <Save size={16} />
                </button>
              </div>
              
              {savedSnippets.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  <p>No saved snippets yet.</p>
                  <p>Save your code for future use!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {savedSnippets.map((snippet) => (
                    <div 
                      key={snippet.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div 
                          className="cursor-pointer flex-grow"
                          onClick={() => handleLoadSnippet(snippet)}
                        >
                          <h3 className="font-medium text-gray-800">{snippet.name}</h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span className="bg-gray-200 rounded px-1.5 py-0.5 text-gray-700 mr-2">
                              {snippet.language}
                            </span>
                            <span>{formatDate(snippet.createdAt)}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteSnippet(snippet.id)}
                          className="text-gray-500 hover:text-red-500 p-1"
                          title="Delete Snippet"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Code Editor */}
            <div className="md:col-span-3 space-y-4">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b flex flex-wrap gap-3 justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <select
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="c">C</option>
                    </select>
                    
                    <div className="hidden sm:flex space-x-2">
                      <button 
                        className="btn-outline py-1.5 px-3 text-sm flex items-center"
                        onClick={() => setShowSaveDialog(true)}
                      >
                        <Save size={14} className="mr-1" />
                        Save
                      </button>
                      <button 
                        className="btn-outline py-1.5 px-3 text-sm flex items-center"
                        onClick={handleDownloadCode}
                      >
                        <Download size={14} className="mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm italic text-gray-500">
                    Write and execute code in any supported language
                  </div>
                </div>
                
                <div className="p-4">
                  <CodeSandbox 
                    code={code}
                    language={language}
                    onCodeChange={handleCodeChange}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Extra Resources */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxjb2RpbmclMjBwcmFjdGljZSUyMHByb2dyYW1taW5nJTIwd29ya3NwYWNlJTIwY29tcHV0ZXJ8ZW58MHx8fHwxNzQyOTc3MTAwfDA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200"
                  alt="Coding workspace"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-3 left-4 text-white font-semibold text-lg">Learning Resources</h3>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-3">Access our curated collection of programming resources to enhance your skills.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-primary-600 hover:text-primary-700">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">
                      JavaScript Documentation
                    </a>
                  </li>
                  <li className="flex items-center text-primary-600 hover:text-primary-700">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    <a href="https://docs.python.org/3/" target="_blank" rel="noopener noreferrer">
                      Python Documentation
                    </a>
                  </li>
                  <li className="flex items-center text-primary-600 hover:text-primary-700">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    <a href="https://cplusplus.com/reference/" target="_blank" rel="noopener noreferrer">
                      C/C++ Documentation
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxjb2RpbmclMjBwcmFjdGljZSUyMHByb2dyYW1taW5nJTIwd29ya3NwYWNlJTIwY29tcHV0ZXJ8ZW58MHx8fHwxNzQyOTc3MTAwfDA&ixlib=rb-4.0.3&fit=fillmax&h=800&w=1200"
                  alt="Coding workspace"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-3 left-4 text-white font-semibold text-lg">Coding Challenges</h3>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-3">Ready to test your skills? Try these common programming challenges.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-primary-600 hover:text-primary-700">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    <a href="#" className="cursor-pointer" onClick={() => handleLanguageChange('javascript')}>
                      FizzBuzz Implementation
                    </a>
                  </li>
                  <li className="flex items-center text-primary-600 hover:text-primary-700">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    <a href="#" className="cursor-pointer" onClick={() => handleLanguageChange('python')}>
                      String Manipulation Exercises
                    </a>
                  </li>
                  <li className="flex items-center text-primary-600 hover:text-primary-700">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    <a href="#" className="cursor-pointer" onClick={() => handleLanguageChange('java')}>
                      Sorting Algorithm Practice
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-md overflow-hidden text-white">
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-3">Practice Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <p>Start with simple problems and gradually increase difficulty.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <p>Try implementing the same solution in different languages to understand their syntax differences.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <p>Focus on code readability and efficiency rather than just making it work.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">4.</span>
                    <p>Review and refactor your code after you've solved a problem.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">5.</span>
                    <p>Regularly practice to build muscle memory for syntax and problem-solving approaches.</p>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Save Snippet Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-md w-full"
          >
            <div className="p-5 border-b">
              <h3 className="text-lg font-semibold">Save Code Snippet</h3>
            </div>
            <div className="p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Snippet Name</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter a name for your snippet"
                value={currentSnippetName}
                onChange={(e) => setCurrentSnippetName(e.target.value)}
              />
              <div className="text-xs text-gray-500 mt-2">
                Your code will be saved locally and will be available the next time you visit.
              </div>
            </div>
            <div className="px-5 py-3 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                className="btn-outline"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSaveSnippet}
                disabled={!currentSnippetName}
              >
                Save Snippet
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Notification Toast */}
      {notificationMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          {notificationMessage}
        </motion.div>
      )}
    </div>
  );
};

export default CodingPractice;
 