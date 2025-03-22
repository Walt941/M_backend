import { Router } from 'express';
import { register,login,verifyEmail,forgotPassword,resetPassword,getAllUsers,deleteUserById,getUserById,updateUserById,} from '../controllers/User'; 
import { createTypingSession} from '../controllers/TypingSession';
import { saveLetter } from '../controllers/Letter';
import { getAndLinkSessionWords } from '../controllers/TypingSession';


const userRoutes = Router();


userRoutes.post('/letters', saveLetter);
userRoutes.get('/sessions/:sessionId/words',getAndLinkSessionWords);
userRoutes.post('/sessions', createTypingSession);



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