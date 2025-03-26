import  express from 'express';
import { register, login, authenticateToken } from '../controllers/auth.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  await register(req, res, req.app.locals.db);
});

// Login a user
router.post('/login', async (req, res) => {
  await login(req, res, req.app.locals.db);
});

export default router;
 