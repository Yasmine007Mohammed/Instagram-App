const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return sendErrorForDev(err,res)
    }else{
        return errorForProduction(err,res)
    }   
};

const sendErrorForDev = (err,res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err ,
        message: err.message,
        stack: err.stack
    });
};

const errorForProduction = (err,res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        });
}
export default globalError;
