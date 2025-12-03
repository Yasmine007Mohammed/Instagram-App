class apiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCodev = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
    }
}
export default apiError;