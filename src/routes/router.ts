import { Router } from 'express';
import { register,login,verifyEmail,forgotPassword,resetPassword,getAllUsers,deleteUserById,getUserById,updateUserById,} from '../controllers/User'; 
import { createSession, getSessionWords } from '../controllers/TypingSession';
const userRoutes = Router();

userRoutes.post('/sessions', createSession);
userRoutes.get('/sessions/:sessionId/words', getSessionWords);


userRoutes.post('/register', register); 
userRoutes.post('/login', login); 
userRoutes.get('/verify-email', verifyEmail); 
userRoutes.post('/forgot-password', forgotPassword); 
userRoutes.post('/reset-password', resetPassword); 
userRoutes.get('/users', getAllUsers); 
userRoutes.delete('/users/:id', deleteUserById); 
userRoutes.get('/users/:id', getUserById); 
userRoutes.put('/users/:id', updateUserById); 

export default userRoutes;