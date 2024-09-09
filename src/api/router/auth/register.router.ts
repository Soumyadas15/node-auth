import { registerUser } from '../../controller/auth/register.controller';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user by providing their email, name, and password.
 *     tags: [Credentials Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 description: User's email address (unique)
 *               password:
 *                 type: string
 *                 description: User's password
 *             required:
 *               - name
 *               - email
 *               - password
 *             example:
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               password: "securePassword123"
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: User's unique identifier
 *                 name:
 *                   type: string
 *                   description: User's full name
 *                 email:
 *                   type: string
 *                   description: User's email address
 *               example:
 *                 userId: "c9d0c72f-abc2-41d3-983f-02d4b3c7d31c"
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 error: "Validation error"
 *       409:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 error: "Email already in use"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 error: "An unexpected error occurred"
 */
router.post('/register', registerUser);

export default router;