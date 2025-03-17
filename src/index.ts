import Express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/router'; 
import dotenv from 'dotenv';
import { verifyToken } from './middleware/authJwt';

dotenv.config();

const app = Express();

const PORT = process.env.PORT || 4000;
app.set('port', PORT);


app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true,
  })
);


app.use(morgan('dev')); 
app.use(Express.json()); 
app.use(Express.urlencoded({ extended: true })); 
app.use(verifyToken);


app.use('/api', userRoutes); 


app.listen(app.get('port'), () => {
  console.log(`🚀 Server is running on port ${app.get('port')}`);
});