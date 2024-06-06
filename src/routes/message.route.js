import express from 'express';
import trimRequest from 'trim-request'
import authMiddleware from '../middlewares/authMiddleware.js';

import { getMessage, sendMessage } from '../controllers/message.controller.js';
const router = express.Router()

router.route('/').post(trimRequest.all, authMiddleware, sendMessage)
router.route('/:convo_id').get(trimRequest.all, authMiddleware, getMessage)



export default router