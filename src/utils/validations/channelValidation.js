//Dependecias de node (express-validator)

import { body, param } from "express-validator"

//Crear nuevo canal
export const newChannel = () => [
    body('name').notEmpty().withMessage('name is required').isString().withMessage('name must be a string').escape().trim(),
    body('type').notEmpty().withMessage('type is required').isString().withMessage('type must be a string')
        .isIn(['private', 'public']).withMessage('Please enter a private or public').escape().trim(),
    body('category').notEmpty().withMessage('category is required').isString().withMessage('category must be a string')
        .isIn(['technology', 'science', 'education', 'sports', 'music'])
        .withMessage('Sure, please choose: technology, science, education, sports, or music.').escape().trim(),
]

export const bodyAddMember = () => [
    body('userId').optional().isString().withMessage('userId must be a string')
        .isLength({ min: 24 }).withMessage('channel not exist').escape().trim(),
    body('channelId').notEmpty().withMessage('id is required (channel)').isString()
        .isLength({ min: 24 }).withMessage('channel not exist').escape().trim(),
]
export const bodyUpdate = () => [
    body('name').optional().isString().withMessage('name must be a string').escape().trim(),
    body('type').optional().isString().withMessage('type must be a string')
        .isIn(['private', 'public']).withMessage('Please enter a private or public').escape().trim(),
    body('category').optional().isString().withMessage('category must be a string')
        .isIn(['technology', 'science', 'education', 'sports', 'music'])
        .withMessage('Sure, please choose: technology, science, education, sports, or music.').escape().trim(),
]
export const paramId = () => [
    param('channelId')
        .notEmpty().withMessage('id is required')
        .isString().withMessage('id must be a string')
        .isLength({ min: 24 }).withMessage('channel not exist')
        .escape().trim(),
];