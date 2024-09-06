import { Router } from "express";

import registerRoute from "./api/router/auth/register.router"


const router = Router();

const rootRoute = '/';
const adminRoute = '/admin';


//Auth routes
router.use(rootRoute, registerRoute);

export default router;