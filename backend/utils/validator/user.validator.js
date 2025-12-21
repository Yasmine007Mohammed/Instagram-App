import Joi from 'joi';
import User from '../../models/user.model.js';
import validate from '../../middlewares/validate.middleware.js'; 

export const signUpSchema = Joi.object({
    name: Joi.string().min(3).max(30).required()
        .messages({
            'string.min':'Too short name must be at least 3 characters',
            'string.max': 'Too long name must be at most 30 characters',
            'any.required': 'Name is required'
            
        }),
    username: Joi.string().alphanum().min(3).max(30).required()
        .messages({
            'string.alphanum': ' Username must only contain alpha-numeric characters',
            'string.min':'Too short username must be at least 3 characters',
            'string.max': 'Too long username must be at most 30 characters',
            'any.required': 'Username is required',
            'string.empty': 'Username must not be empty'
        }),
    email: Joi.string().email().lowercase().required()
             .messages({
            'string.email': 'Invalid email format',
            'any.required': 'Email is required',
            'string.empty': 'Email must not be empty'
        }),

    password: Joi.string().min(8).required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'any.required': 'Password is required',
            'string.empty': 'Password must not be empty'
        }),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required()
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Password confirmation is required',
            'string.empty': 'Password confirmation must not be empty'

        })
});

export const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required()
        .messages({
            'string.alphanum': ' Username must only contain alpha-numeric characters',
            'string.min':'Too short username must be at least 3 characters',
            'string.max': 'Too long username must be at most 30 characters',
            'any.required': 'Username is required',
            'string.empty': 'Username must not be empty'
        }),

    password: Joi.string().min(8).required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'any.required': 'Password is required',
            'string.empty': 'Password must not be empty'
        })
    
});