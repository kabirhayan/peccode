import  { useState, useEffect, useCallback } from 'react';
import { submissionService } from '../services/api';
import { Submission } from '../types';

interface UseSubmissionsOptions {
  filters?: {
    questionId?: string;
    status?: string;
  };
}

export const useSubmissions = (options: UseSubmissionsOptions = {}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(options.filters || {});
  
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await submissionService.getSubmissions(filters);
      setSubmissions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);
  
  const updateFilters = (newFilters: typeof filters) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  return {
    submissions,
    loading,
    error,
    filters,
    updateFilters,
    refreshSubmissions: fetchSubmissions
  };
};

interface UseSubmitCodeOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

export const useSubmitCode = (options: UseSubmitCodeOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  
  const submitCode = async (submissionData: {
    questionId: string;
    language: string;
    code: string;
  }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await submissionService.submitCode(submissionData);
      setResult(data);
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to submit code';
      setError(errorMessage);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    submitCode,
    loading,
    error,
    result
  };
};
 