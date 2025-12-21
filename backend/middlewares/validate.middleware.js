const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const validatedData = await schema.validateAsync(req.body, {
                abortEarly: false, 
                stripUnknown: true 
            });

           
            req.body = validatedData;
            
            next();
        } catch (error) {
            if (error.isJoi) {
                const errors = error.details.map(detail => ({
                    field: detail.path[0],
                    message: detail.message
                }));

                return res.status(400).json({
                    success: false,
                    message: 'Validation faild',
                    errors: errors
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Unexpected error during validation',
            });
        }
    };
};

export default validate;