import express from 'express';
import { getMessages } from '../../controller/message/get.controller';
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
 *   get:
 *     summary: Retrieve conversation history
 *     description: Retrieves conversation history between the authenticated user and the specified recipient.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: recipientId
 *         in: query
 *         description: ID of the user to retrieve the conversation with
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *       - name: before
 *         in: query
 *         description: Timestamp to retrieve messages before this timestamp
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2024-09-07T12:34:56Z"
 *       - name: count
 *         in: query
 *         description: Number of messages to retrieve
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *           example: 20
 *       - name: sort
 *         in: query
 *         description: Sorting mechanism based on timestamp ("asc" or "desc")
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *           example: "desc"
 *     responses:
 *       200:
 *         description: Conversation history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "456e7890-e89b-12d3-a456-426614174000"
 *                       senderId:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       receiverId:
 *                         type: string
 *                         example: "789e4567-e89b-12d3-a456-426614174000"
 *                       content:
 *                         type: string
 *                         example: "Hello, how are you?"
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-07T12:34:56Z"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Recipient ID is required and must be a string"
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
 *       404:
 *         description: User or conversation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Recipient not found"
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
router.get('/messages', authenticateJWT, getMessages);

export default router;