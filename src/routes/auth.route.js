import express from 'express';
import trimRequest from 'trim-request'
import { login, logout, refreshToken, register } from '../controllers/auth.controller.js'
const router = express.Router()

router.use(trimRequest.all)

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/refreshToken').post(refreshToken)

export default router