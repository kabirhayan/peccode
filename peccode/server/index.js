import  express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Set __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Constants
const PORT = 3001;
const JWT_SECRET = 'panimalar_coding_platform_secret';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize Database
let db;

async function initializeDatabase() {
  try {
    db = await Database.open({
      filename: join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    });
    
    console.log('Connected to the SQLite database.');
    
    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        department TEXT,
        rollNumber TEXT,
        joinedAt TEXT,
        profilePic TEXT
      );
      
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        createdBy TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        sampleInput TEXT,
        sampleOutput TEXT,
        constraints TEXT,
        FOREIGN KEY (createdBy) REFERENCES users (id)
      );
      
      CREATE TABLE IF NOT EXISTS question_tags (
        questionId TEXT NOT NULL,
        tag TEXT NOT NULL,
        PRIMARY KEY (questionId, tag),
        FOREIGN KEY (questionId) REFERENCES questions (id)
      );
      
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        questionId TEXT NOT NULL,
        language TEXT NOT NULL,
        code TEXT NOT NULL,
        status TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (questionId) REFERENCES questions (id)
      );
    `);
    
    // Seed data if needed
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    
    if (userCount.count === 0) {
      await seedDatabase();
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

async function seedDatabase() {
  try {
    // Seed users
    const hashedPassword = await bcrypt.hash('password', 10);
    
    await db.run(
      'INSERT INTO users (id, name, email, password, role, department, rollNumber, joinedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['student1', 'Arun Kumar', 'student@panimalar.edu', hashedPassword, 'student', 'Computer Science', '19CSE101', new Date().toISOString()]
    );
    
    await db.run(
      'INSERT INTO users (id, name, email, password, role, department, joinedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['staff1', 'Dr. Priya Rajan', 'staff@panimalar.edu', hashedPassword, 'staff', 'Computer Science', new Date().toISOString()]
    );
    
    // Seed questions
    const questions = [
      {
        id: 'q1',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'easy',
        tags: ['arrays', 'hash-table'],
        createdBy: 'staff1',
        createdAt: '2023-04-15',
        sampleInput: '[2,7,11,15], target = 9',
        sampleOutput: '[0,1]',
        constraints: 'You may assume that each input would have exactly one solution, and you may not use the same element twice.'
      },
      {
        id: 'q2',
        title: 'Binary Tree Level Order Traversal',
        description: 'Given the root of a binary tree, return the level order traversal of its nodes values.',
        difficulty: 'medium',
        tags: ['binary-tree', 'bfs'],
        createdBy: 'staff1',
        createdAt: '2023-05-10',
        sampleInput: 'root = [3,9,20,null,null,15,7]',
        sampleOutput: '[[3],[9,20],[15,7]]',
        constraints: 'The number of nodes in the tree is in the range [0, 2000].'
      },
      {
        id: 'q3',
        title: 'Merge K Sorted Lists',
        description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
        difficulty: 'hard',
        tags: ['linked-list', 'heap'],
        createdBy: 'staff1',
        createdAt: '2023-06-01',
        sampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        sampleOutput: '[1,1,2,3,4,4,5,6]',
        constraints: 'k == lists.length, 0 <= k <= 10^4'
      }
    ];
    
    for (const question of questions) {
      await db.run(
        'INSERT INTO questions (id, title, description, difficulty, createdBy, createdAt, sampleInput, sampleOutput, constraints) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [question.id, question.title, question.description, question.difficulty, question.createdBy, question.createdAt, question.sampleInput, question.sampleOutput, question.constraints]
      );
      
      for (const tag of question.tags) {
        await db.run(
          'INSERT INTO question_tags (questionId, tag) VALUES (?, ?)',
          [question.id, tag]
        );
      }
    }
    
    // Seed submissions
    const submissions = [
      {
        id: 's1',
        userId: 'student1',
        questionId: 'q1',
        language: 'python',
        code: 'def twoSum(nums, target):\n    map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in map:\n            return [map[complement], i]\n        map[num] = i',
        status: 'accepted',
        timestamp: '2023-09-15T10:30:00Z'
      },
      {
        id: 's2',
        userId: 'student1',
        questionId: 'q2',
        language: 'java',
        code: 'class Solution {\n  public List<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> result = new ArrayList<>();\n    if (root == null) return result;\n    \n    Queue<TreeNode> queue = new LinkedList<>();\n    queue.offer(root);\n    \n    while (!queue.isEmpty()) {\n      int size = queue.size();\n      List<Integer> currentLevel = new ArrayList<>();\n      \n      for (int i = 0; i < size; i++) {\n        TreeNode node = queue.poll();\n        currentLevel.add(node.val);\n        \n        if (node.left != null) queue.offer(node.left);\n        if (node.right != null) queue.offer(node.right);\n      }\n      \n      result.add(currentLevel);\n    }\n    \n    return result;\n  }\n}',
        status: 'wrong',
        timestamp: '2023-09-20T09:15:00Z'
      },
      {
        id: 's3',
        userId: 'student1',
        questionId: 'q1',
        language: 'c',
        code: '#include <stdio.h>\n#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* result = (int*)malloc(2 * sizeof(int));\n    \n    for(int i = 0; i < numsSize; i++) {\n        for(int j = i + 1; j < numsSize; j++) {\n            if(nums[i] + nums[j] == target) {\n                result[0] = i;\n                result[1] = j;\n                return result;\n            }\n        }\n    }\n    \n    return result;\n}',
        status: 'accepted',
        timestamp: '2023-09-25T14:20:00Z'
      }
    ];
    
    for (const submission of submissions) {
      await db.run(
        'INSERT INTO submissions (id, userId, questionId, language, code, status, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [submission.id, submission.userId, submission.questionId, submission.language, submission.code, submission.status, submission.timestamp]
      );
    }
    
    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// ------- Routes -------

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Get user from database
    const user = await db.get('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '12h' }
    );
    
    // Return user data without password
    const { password: _, ...userData } = user;
    
    res.json({
      user: userData,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, department, rollNumber } = req.body;
    
    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use' });
    }
    
    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate college email domain for students
    if (role === 'student' && !email.endsWith('panimalar.edu')) {
      return res.status(400).json({ message: 'Please use your college email address' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate ID
    const userId = `user_${Date.now()}`;
    
    // Insert user into database
    await db.run(
      'INSERT INTO users (id, name, email, password, role, department, rollNumber, joinedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, role, department, rollNumber, new Date().toISOString()]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email, role },
      JWT_SECRET,
      { expiresIn: '12h' }
    );
    
    res.status(201).json({
      user: {
        id: userId,
        name,
        email,
        role,
        department,
        rollNumber,
        joinedAt: new Date().toISOString()
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// User routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.get('SELECT id, name, email, role, department, rollNumber, joinedAt, profilePic FROM users WHERE id = ?', [req.user.id]);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { name, department, bio, profilePic } = req.body;
    
    await db.run(
      'UPDATE users SET name = ?, department = ?, profilePic = ? WHERE id = ?',
      [name, department, profilePic, req.user.id]
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get current user password
    const user = await db.get('SELECT password FROM users WHERE id = ?', [req.user.id]);
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await db.run(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Questions routes
app.get('/api/questions', async (req, res) => {
  try {
    const { difficulty, tag, search } = req.query;
    
    let query = `
      SELECT q.*, GROUP_CONCAT(qt.tag) as tags
      FROM questions q
      LEFT JOIN question_tags qt ON q.id = qt.questionId
    `;
    
    const queryParams = [];
    const conditions = [];
    
    if (difficulty && difficulty !== 'all') {
      conditions.push('q.difficulty = ?');
      queryParams.push(difficulty);
    }
    
    if (tag && tag !== 'all') {
      conditions.push('qt.tag = ?');
      queryParams.push(tag);
    }
    
    if (search) {
      conditions.push('(q.title LIKE ? OR q.description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' GROUP BY q.id';
    
    const questions = await db.all(query, queryParams);
    
    // Convert tags from comma-separated string to array
    const formattedQuestions = questions.map(q => ({
      ...q,
      tags: q.tags ? q.tags.split(',') : []
    }));
    
    res.json(formattedQuestions);
  } catch (err) {
    console.error('Questions fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const question = await db.get(
      `SELECT q.*, GROUP_CONCAT(qt.tag) as tags
       FROM questions q
       LEFT JOIN question_tags qt ON q.id = qt.questionId
       WHERE q.id = ?
       GROUP BY q.id`,
      [id]
    );
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Convert tags from comma-separated string to array
    const formattedQuestion = {
      ...question,
      tags: question.tags ? question.tags.split(',') : []
    };
    
    res.json(formattedQuestion);
  } catch (err) {
    console.error('Question fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/questions', authenticateToken, async (req, res) => {
  try {
    // Check if user is staff
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Only staff can create questions' });
    }
    
    const { title, description, difficulty, tags, sampleInput, sampleOutput, constraints } = req.body;
    
    const questionId = `q${Date.now()}`;
    
    await db.run(
      'INSERT INTO questions (id, title, description, difficulty, createdBy, createdAt, sampleInput, sampleOutput, constraints) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [questionId, title, description, difficulty, req.user.id, new Date().toISOString(), sampleInput, sampleOutput, constraints]
    );
    
    // Insert tags
    for (const tag of tags) {
      await db.run(
        'INSERT INTO question_tags (questionId, tag) VALUES (?, ?)',
        [questionId, tag]
      );
    }
    
    res.status(201).json({
      id: questionId,
      title,
      description,
      difficulty,
      tags,
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
      sampleInput,
      sampleOutput,
      constraints
    });
  } catch (err) {
    console.error('Question creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/questions/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is staff
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Only staff can update questions' });
    }
    
    const { id } = req.params;
    const { title, description, difficulty, tags, sampleInput, sampleOutput, constraints } = req.body;
    
    // Check if question exists and belongs to the staff
    const question = await db.get(
      'SELECT * FROM questions WHERE id = ? AND createdBy = ?',
      [id, req.user.id]
    );
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found or unauthorized' });
    }
    
    await db.run(
      'UPDATE questions SET title = ?, description = ?, difficulty = ?, sampleInput = ?, sampleOutput = ?, constraints = ? WHERE id = ?',
      [title, description, difficulty, sampleInput, sampleOutput, constraints, id]
    );
    
    // Update tags
    await db.run('DELETE FROM question_tags WHERE questionId = ?', [id]);
    
    for (const tag of tags) {
      await db.run(
        'INSERT INTO question_tags (questionId, tag) VALUES (?, ?)',
        [id, tag]
      );
    }
    
    res.json({
      id,
      title,
      description,
      difficulty,
      tags,
      createdBy: req.user.id,
      createdAt: question.createdAt,
      sampleInput,
      sampleOutput,
      constraints
    });
  } catch (err) {
    console.error('Question update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/questions/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is staff
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Only staff can delete questions' });
    }
    
    const { id } = req.params;
    
    // Check if question exists and belongs to the staff
    const question = await db.get(
      'SELECT * FROM questions WHERE id = ? AND createdBy = ?',
      [id, req.user.id]
    );
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found or unauthorized' });
    }
    
    // Delete question and related tags
    await db.run('DELETE FROM question_tags WHERE questionId = ?', [id]);
    await db.run('DELETE FROM questions WHERE id = ?', [id]);
    
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('Question deletion error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submissions routes
app.get('/api/submissions', authenticateToken, async (req, res) => {
  try {
    let query = `
      SELECT s.*, q.title as questionTitle
      FROM submissions s
      JOIN questions q ON s.questionId = q.id
      WHERE s.userId = ?
    `;
    
    const queryParams = [req.user.id];
    
    // Add filters if provided
    const { questionId, status } = req.query;
    
    if (questionId) {
      query += ' AND s.questionId = ?';
      queryParams.push(questionId);
    }
    
    if (status) {
      query += ' AND s.status = ?';
      queryParams.push(status);
    }
    
    query += ' ORDER BY s.timestamp DESC';
    
    const submissions = await db.all(query, queryParams);
    
    res.json(submissions);
  } catch (err) {
    console.error('Submissions fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/submissions', authenticateToken, async (req, res) => {
  try {
    const { questionId, language, code } = req.body;
    
    // Check if question exists
    const question = await db.get('SELECT * FROM questions WHERE id = ?', [questionId]);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // In a real system, this would execute the code against test cases
    // For this demo, we'll randomly determine if the submission is accepted
    const status = Math.random() > 0.3 ? 'accepted' : 'wrong';
    
    const submissionId = `s${Date.now()}`;
    
    await db.run(
      'INSERT INTO submissions (id, userId, questionId, language, code, status, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [submissionId, req.user.id, questionId, language, code, status, new Date().toISOString()]
    );
    
    res.status(201).json({
      id: submissionId,
      userId: req.user.id,
      questionId,
      language,
      code,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Submission creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Code execution route - for testing code without submitting
app.post('/api/execute', authenticateToken, async (req, res) => {
  try {
    const { language, code, input } = req.body;
    
    // In a real system, this would use a sandboxed environment to execute the code
    // For this demo, we'll return a mocked output
    
    let output;
    
    if (language === 'c') {
      if (code.includes('printf') && input.includes('45 22 87')) {
        output = 'Max: 91\nMin: 3\nSum: 376\nAverage: 41.78';
      } else if (code.includes('scanf') && input.includes('3')) {
        output = '10\n20\n30';
      } else {
        output = 'Program executed successfully. Output depends on actual C code execution.';
      }
    } else if (code.includes('twoSum') && input.includes('[2,7,11,15]')) {
      output = '[0,1]';
    } else if (code.includes('isValid') && input.includes('()[]{}')) {
      output = 'true';
    } else {
      output = 'Program executed successfully. Output depends on actual code execution.';
    }
    
    // Adding a delay to simulate code execution
    setTimeout(() => {
      res.json({ output });
    }, 1000);
  } catch (err) {
    console.error('Code execution error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard stats for students
app.get('/api/dashboard/student-stats', authenticateToken, async (req, res) => {
  try {
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can access these stats' });
    }
    
    // Total submissions
    const totalSubmissions = await db.get(
      'SELECT COUNT(*) as count FROM submissions WHERE userId = ?',
      [req.user.id]
    );
    
    // Successful submissions
    const successfulSubmissions = await db.get(
      'SELECT COUNT(*) as count FROM submissions WHERE userId = ? AND status = ?',
      [req.user.id, 'accepted']
    );
    
    // Questions attempted
    const questionsAttempted = await db.get(
      'SELECT COUNT(DISTINCT questionId) as count FROM submissions WHERE userId = ?',
      [req.user.id]
    );
    
    // Questions by difficulty
    const questionsByDifficulty = await db.all(`
      SELECT q.difficulty, COUNT(DISTINCT s.questionId) as count
      FROM submissions s
      JOIN questions q ON s.questionId = q.id
      WHERE s.userId = ?
      GROUP BY q.difficulty
    `, [req.user.id]);
    
    // Recent submissions
    const recentSubmissions = await db.all(`
      SELECT s.*, q.title as questionTitle
      FROM submissions s
      JOIN questions q ON s.questionId = q.id
      WHERE s.userId = ?
      ORDER BY s.timestamp DESC
      LIMIT 5
    `, [req.user.id]);
    
    res.json({
      totalSubmissions: totalSubmissions.count,
      successfulSubmissions: successfulSubmissions.count,
      questionsAttempted: questionsAttempted.count,
      questionsByDifficulty,
      recentSubmissions
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard stats for staff
app.get('/api/dashboard/staff-stats', authenticateToken, async (req, res) => {
  try {
    // Check if user is staff
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Only staff can access these stats' });
    }
    
    // Total questions created by staff
    const totalQuestions = await db.get(
      'SELECT COUNT(*) as count FROM questions WHERE createdBy = ?',
      [req.user.id]
    );
    
    // Questions by difficulty
    const questionsByDifficulty = await db.all(`
      SELECT difficulty, COUNT(*) as count
      FROM questions
      WHERE createdBy = ?
      GROUP BY difficulty
    `, [req.user.id]);
    
    // Total submissions to staff's questions
    const totalSubmissions = await db.get(`
      SELECT COUNT(*) as count
      FROM submissions s
      JOIN questions q ON s.questionId = q.id
      WHERE q.createdBy = ?
    `, [req.user.id]);
    
    // Submissions by status
    const submissionsByStatus = await db.all(`
      SELECT s.status, COUNT(*) as count
      FROM submissions s
      JOIN questions q ON s.questionId = q.id
      WHERE q.createdBy = ?
      GROUP BY s.status
    `, [req.user.id]);
    
    // Recent questions
    const recentQuestions = await db.all(`
      SELECT q.*, GROUP_CONCAT(qt.tag) as tags
      FROM questions q
      LEFT JOIN question_tags qt ON q.id = qt.questionId
      WHERE q.createdBy = ?
      GROUP BY q.id
      ORDER BY q.createdAt DESC
      LIMIT 5
    `, [req.user.id]);
    
    // Format tags
    const formattedQuestions = recentQuestions.map(q => ({
      ...q,
      tags: q.tags ? q.tags.split(',') : []
    }));
    
    res.json({
      totalQuestions: totalQuestions.count,
      questionsByDifficulty,
      totalSubmissions: totalSubmissions.count,
      submissionsByStatus,
      recentQuestions: formattedQuestions
    });
  } catch (err) {
    console.error('Staff dashboard stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});

export default app;
 