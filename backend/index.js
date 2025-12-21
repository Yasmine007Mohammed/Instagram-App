import express from 'express';
import ApiError from './utils/apiError.js';

import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import errorHandler from './middlewares/error.middleware.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config({ quiet: true });

connectDB();

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:8001",
    methods: ['GET','POST'],
    credentials: true

}));


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// app.get('/', (req,res) => {
//     res.send("Hello !");
// })

if(process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

import authRouter from './routes/auth.route.js';
app.use('/api/auth', authRouter);


app.all('/{*any}', (req,res,next) =>{
  next(new ApiError(`can not find this route: ${req.originalUrl}`,404))
})
app.use(errorHandler);

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
