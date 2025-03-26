import  bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Database } from 'sqlite';

const JWT_SECRET = 'panimalar_coding_platform_secret';

// Register a new user
export const register = async (req, res, db) => {
  try {
    const { name, email, password, role, department, rollNumber } = req.body;
    
    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use' });
    }
    
    // Validate role
    if (role !== 'student' && role !== 'staff') {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Additional validation for students
    if (role === 'student' && !rollNumber) {
      return res.status(400).json({ message: 'Roll number is required for students' });
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
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login an existing user
export const login = async (req, res, db) => {
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
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
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
 