import { Request, Response, NextFunction } from 'express';

import { JwtService } from '../../service/auth/jwt/jwt.service';
import IRequestWithUser from "../../service/auth/user/IRequestWithUser"


const jwtTokenService = new JwtService();


export const authenticateJWT = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.sendStatus(403);
    }

    try {
        const verificationResponse = await jwtTokenService.verifyToken(token);
        const id = verificationResponse.id;
        res.locals.userId = id;
        next();
    } catch (err) {
        return res.sendStatus(403);
    }
};