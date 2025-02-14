import express from 'express';
import Morgan from 'morgan';
import userRouter from './routes/userRoutes.js'; // Import default export
import * as dotenv from 'dotenv';
import globalErrorHandler from './controller/errorController.js';
import AppError from './utils/appError.js';


const app = express();
dotenv.config(); 

// Middleware
app.use(express.json()); // Parse JSON request bodies
//Env set to dev 
if(process.env.NODE_ENV === 'development'){
    app.use(Morgan('dev'));  // Logging middleware
}

// Attach a timestamp to every request
app.use((req, _, next) => {
    const date = new Date();
    req.CreatedAT = date.toDateString(); // Corrected function call
    next();
});

// Routes
app.use('/api/v1/Users', userRouter);  // Attach userRouter to the route

// Error handeler for invalid routes
app.all('*', (req, _, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
app.use(globalErrorHandler);

export default app;