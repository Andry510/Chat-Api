//Dependecia de node (express-validator)
import { body } from "express-validator";

//Registro de usuario
export const validateSingUp = () => [
    body('name').notEmpty().withMessage('Please enter a name').isString().withMessage('Name must be a string').escape().trim(),
    body('lastName').notEmpty().withMessage('Please enter a last name').isString()
        .withMessage('Last name must be a string').escape().trim(),
    body('email').notEmpty().withMessage('Please enter a valid email').isEmail().withMessage('Email must be valid')
        .escape().trim(),
    body('password').notEmpty().withMessage('Please enter a valid password').isString().withMessage('Password must be a string')
        .isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    body('phoneNumber').notEmpty().withMessage('Please enter a valid phone number').isString().withMessage('Phone number must be a string')
        .isLength({ max: 10 }).withMessage('Phone number must have at most 10 digits')
];

//Inicio de sesión
export const validateSingIn = () => [
    body('email').isEmail().escape().trim().notEmpty().withMessage('Please enter a valid email or password'),
    body('password').isLength({ min: 4 }).isString().notEmpty().withMessage('Please enter a valid email or password'),
];


//Editar perfil
export const validateEdit = () => [
    body('name').optional().isString().withMessage('Name must be a string'),
    body('lastName').optional().isString().withMessage('Last name must be a string').escape().trim().withMessage('Please enter a last name'),
    body('email').optional().isEmail().withMessage('Please enter a valid email').escape().trim(),
    body('phoneNumber').optional().isLength({ max: 10 }).withMessage('Please enter a valid 10-digit phone number').isString()
        .withMessage('Phone number must be a string')
]

//Editar contraseña del perfil
export const validateEditPrivate = () => [
    body('newPassword')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
        .notEmpty().withMessage('Please enter a password'),
    body('phoneNumber').optional().isLength({ max: 10 }).withMessage('Please enter a valid 10-digit phone number').isString()
        .withMessage('Phone number must be a string')
]

