import { Router } from "express";

import registerRoute from "./api/router/auth/register.router"
import loginRoute from "./api/router/auth/login.router"

import getUsers from "./api/router/general/get-users.router"

import sendMessage from "./api/router/message/send.router"
import editMessage from "./api/router/message/edit.router"
import deleteMessage from "./api/router/message/delete.router"
import getMessages from "./api/router/message/get.router"

import getLogs from "./api/router/log/get.router"

const router = Router();

const rootRoute = '/';

//Auth routes
router.use(rootRoute, registerRoute);
router.use(rootRoute, loginRoute);

//General routes
router.use(rootRoute, getUsers);

//Message routes
router.use(rootRoute, getMessages);
router.use(rootRoute, sendMessage);
router.use(rootRoute, editMessage);
router.use(rootRoute, deleteMessage);

//Log routes
router.use(rootRoute, getLogs);


export default router;