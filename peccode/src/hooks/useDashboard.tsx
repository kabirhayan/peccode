import  { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const fetchStats = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let data;
      if (user.role === 'student') {
        data = await dashboardService.getStudentStats();
      } else if (user.role === 'staff') {
        data = await dashboardService.getStaffStats();
      }
      
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
};
 