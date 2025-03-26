import  axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string, role: 'student' | 'staff') => {
    const response = await api.post('/auth/login', { email, password, role });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// User services
export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (profileData: any) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  updatePassword: async (passwordData: any) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  }
};

// Question services
export const questionService = {
  getQuestions: async (filters: any = {}) => {
    const response = await api.get('/questions', { params: filters });
    return response.data;
  },
  getQuestionById: async (id: string) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },
  createQuestion: async (questionData: any) => {
    const response = await api.post('/questions', questionData);
    return response.data;
  },
  updateQuestion: async (id: string, questionData: any) => {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
  },
  deleteQuestion: async (id: string) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  }
};

// Submission services
export const submissionService = {
  getSubmissions: async (filters: any = {}) => {
    const response = await api.get('/submissions', { params: filters });
    return response.data;
  },
  submitCode: async (submissionData: any) => {
    const response = await api.post('/submissions', submissionData);
    return response.data;
  },
  executeCode: async (executionData: any) => {
    const response = await api.post('/execute', executionData);
    return response.data;
  }
};

// Dashboard services
export const dashboardService = {
  getStudentStats: async () => {
    const response = await api.get('/dashboard/student-stats');
    return response.data;
  },
  getStaffStats: async () => {
    const response = await api.get('/dashboard/staff-stats');
    return response.data;
  }
};

export default api;
 