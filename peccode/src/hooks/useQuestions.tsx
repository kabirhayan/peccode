import  { useState, useEffect, useCallback } from 'react';
import { questionService } from '../services/api';
import { Question } from '../types';

interface UseQuestionsOptions {
  initialFilters?: {
    difficulty?: string;
    tag?: string;
    search?: string;
  };
}

export const useQuestions = (options: UseQuestionsOptions = {}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(options.initialFilters || {});
  
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await questionService.getQuestions(filters);
      setQuestions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);
  
  const updateFilters = (newFilters: typeof filters) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  return {
    questions,
    loading,
    error,
    filters,
    updateFilters,
    refreshQuestions: fetchQuestions
  };
};

export const useQuestion = (id: string | undefined) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchQuestion = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await questionService.getQuestionById(id);
      setQuestion(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch question');
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);
  
  return {
    question,
    loading,
    error,
    refreshQuestion: fetchQuestion
  };
};
 