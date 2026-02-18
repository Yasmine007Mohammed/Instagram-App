import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import connectDB from './config/db.js';
import ApiError from './utils/apiError.js';
import globalError from './middlewares/error.middleware.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';

// import session from 'express-session';
// import passport from 'passport';
// import './config/passport.js';

const app = express();

connectDB();

app.use(helmet());
app.use(cors({
    origin: "http://localhost:8001",
    methods: ['GET','POST'],
    credentials: true

}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if(process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


// app.get('/', (req, res) => {
//   res.send('<a href="/api/auth/google">Login with Google</a>')
// });
// app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
// app.get('/api/auth/google/callback', passport.authenticate('google', {
//   successRedirect: '/success',
//     failureRedirect: '/failure',
// }));
// app.get('/success', (req, res) => {
//   res.send('Login Successful');
// })
// app.get('/failure', (req, res) => {
//   res.send('Login Failed');
// })

app.all('/{*any}', (req,res,next) =>{
  next(new ApiError(`can not find this route: ${req.originalUrl}`,404))
})
app.use(globalError);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});

// hundel errors outside exress
process.on('unhandledRejection',(err) =>{
  console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`)
  server.close(() =>{
    console.error("Server closed");
    process.exit(1)
  })
})
