import express from 'express';
import { sendMessage } from '../../controller/message/send.controller';
import { authenticateJWT } from '../../middleware/auth/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /messages:
 *   post:
 *     summary: Send a message
 *     description: Sends a message to a specified user.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: ID of the receiver user
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               content:
 *                 type: string
 *                 description: Message content
 *                 example: "Hello, how are you?"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messageId:
 *                   type: string
 *                   example: "456e7890-e89b-12d3-a456-426614174000"
 *                 senderId:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 recipientId:
 *                   type: string
 *                   example: "789e4567-e89b-12d3-a456-426614174000"
 *                 content:
 *                   type: string
 *                   example: "Hello, how are you?"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-07T12:34:56Z"
 *       400:
 *         description: Message sending failed due to validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Receiver not found"
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized access"
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
router.post('/messages', authenticateJWT, sendMessage);

export default router;