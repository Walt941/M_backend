import { Router } from 'express';
import { register,login,verifyEmail,forgotPassword,resetPassword,getUserById,} from '../controllers/User'; 
import { createTypingSession} from '../controllers/TypingSession';
import { saveLettersBatch } from '../controllers/Letter';
import { getAndLinkSessionWords } from '../controllers/TypingSession';
import { calculateSessionStats } from '../controllers/Metrics';
import { getUserTypingProgress } from '../controllers/Progress';

const userRoutes = Router();

userRoutes.post('/sessions/:sessionId/calculate-stats', calculateSessionStats);
userRoutes.post('/letters/batch', saveLettersBatch);
userRoutes.get('/sessions/:sessionId/words',getAndLinkSessionWords);
userRoutes.post('/sessions', createTypingSession);
userRoutes.get('/users/:userId/progress', getUserTypingProgress);
userRoutes.post('/register', register); 
userRoutes.post('/login', login); 
userRoutes.get('/verify-email', verifyEmail); 
userRoutes.post('/forgot-password', forgotPassword); 
userRoutes.post('/reset-password', resetPassword); 
userRoutes.get('/users/:id', getUserById); 


export default userRoutes;