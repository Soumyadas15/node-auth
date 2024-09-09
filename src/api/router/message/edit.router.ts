import express from 'express';
import { editMessage } from '../../controller/message/edit.controller';
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
 * /messages/{messageId}:
 *   put:
 *     summary: Edit a message
 *     description: Edits an existing message. Only the sender of the message can edit it.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated message content
 *                 example: "Updated message content"
 *     responses:
 *       200:
 *         description: Message edited successfully
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
 *                 receiverId:
 *                   type: string
 *                   example: "789e4567-e89b-12d3-a456-426614174000"
 *                 content:
 *                   type: string
 *                   example: "Updated message content"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-07T12:34:56Z"
 *       400:
 *         description: Message editing failed due to validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid message content"
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
 *         description: Message not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Message not found"
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
router.put('/messages/:messageId', authenticateJWT, editMessage);

export default router;