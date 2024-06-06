import createHttpError from "http-errors";
import logger from "../config/loggrer.config.js";
import { createConversation, doesConversationExist, getUserConversations, populateConversation } from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";

export const create_open_conversation = async (req, res, next) => {
    try {

        const senderId = req.user.userId;
        const { receiverId } = req.body;

        if (!receiverId) {
            logger.error('please provide the user id you wanna start a conversation with')
            console.log(receiverId)
            throw createHttpError.BadRequest('Some thing went wrong')
        }

        //check if char wxists
        const existed_conversation = await doesConversationExist(
            senderId,
            receiverId
        );

        if (existed_conversation) {
            res.json(existed_conversation)
        } else {
            // res.send("We need to create new conversation")
            let receiver_user = await findUser(receiverId)
            let convoData = {
                name: receiver_user.name,
                isGroup: false,
                users: [senderId, receiverId]
            }
            const newConvo = await createConversation(convoData)
            const populatedConvo = await populateConversation(newConvo._id,"users","-password")
            res.status(200).json(populatedConvo)
        }


    } catch (error) {
        next(error)
    }
};


export const getConversations = async (req, res, next) => {
    try {

        const user_id = req.user.userId;
        const conversations = await getUserConversations(user_id)
        
        res.status(200).json(conversations)
        
    } catch (error) {
        next(error)
    }
}



