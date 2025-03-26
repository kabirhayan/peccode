export  interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'staff';
  department?: string;
  rollNumber?: string;
  joinedAt: string;
  profilePic?: string | null;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdBy: string;
  createdAt: string;
  sampleInput?: string;
  sampleOutput?: string;
  constraints?: string;
}

export interface Submission {
  id: string;
  userId: string;
  questionId: string;
  language: string;
  code: string;
  status: 'accepted' | 'wrong' | 'error' | 'timeout';
  timestamp: string;
}
 