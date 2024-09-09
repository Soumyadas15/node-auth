import express from 'express';
import { getLogs } from '../../controller/log/get.controller';
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
 * /logs:
 *   get:
 *     summary: Retrieve logs
 *     description: Retrieves logs between the specified start and end times for the authenticated user.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: StartTime
 *         in: query
 *         description: Timestamp to retrieve logs after this timestamp
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2024-09-07T12:34:56Z"
 *       - name: EndTime
 *         in: query
 *         description: Timestamp to retrieve logs before this timestamp
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2024-09-08T12:34:56Z"
 *     responses:
 *       200:
 *         description: Log list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "456e7890-e89b-12d3-a456-426614174000"
 *                       ip:
 *                         type: string
 *                         example: "192.168.1.1"
 *                       body:
 *                         type: string
 *                         example: "{\"key\":\"value\"}"
 *                       timeOfCall:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-07T12:34:56Z"
 *                       username:
 *                         type: string
 *                         example: "john_doe"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid timestamp format"
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
 *         description: No logs found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No logs found"
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
//@ts-ignore
router.get('/logs', authenticateJWT, getLogs);

export default router;