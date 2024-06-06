import express from 'express'
const router = express.Router()
import authRoutes from './auth.route.js'
import ConversationRoutes from './conversation.route.js'
import MessageRoutes from './message.route.js'


router.use('/auth', authRoutes)
router.use('/conversation', ConversationRoutes)
router.use('/message', MessageRoutes)

export default router