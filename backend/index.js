import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middlewares/error.middleware.js';

dotenv.config({ quiet: true });

const app = express();

app.get('/', (req,res) => {
    res.send("Hello !");
})

if(process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

app.use(errorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    connectDB();
    console.log(`The server is running on port ${port}`);
});
