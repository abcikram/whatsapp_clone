import createHttpError from "http-errors"
import { ConversationModel, UserModel } from "../models/index.js"


export const doesConversationExist = async (senderId, receiverId) => {
    let convo = await ConversationModel.find({
        isGroup: false,
        $and: [
            { users: { $elemMatch: { $eq: senderId } } },
            { users: { $elemMatch: { $eq: receiverId } } }
        ]
    })
        .populate("users", "-password")
        .populate("latestMessage")

    if (!convo) throw createHttpError.BadRequest('Opps something went wrong')

    // populate message model

    convo = await UserModel.populate(convo, {
        path: "latestMessage.sender",
        select: "name email picture status"
    })

    return convo[0]

}

export const createConversation = async (data) => {

    const newConvo = await ConversationModel.create(data)
    if (!newConvo) {
        throw createHttpError.BadRequest("Oops something went wrong!")
    }

    return newConvo
}

export const populateConversation = async (
    id,
    fieldToPopulate,
    fieldsToRemove
) => {
    const populatedConvo = await ConversationModel.findOne({ _id: id }).populate(
        fieldToPopulate,
        fieldsToRemove
    );
    if (!populatedConvo) throw createHttpError.BadRequest("Oops...Something went wrong !");

    return populatedConvo;
};

export const getUserConversations = async (userId) => {
    let conversations;

    conversations = await ConversationModel.find({
        users: { $elemMatch: { $eq: userId } }
    })
        .populate('users', '-password')
        .populate('admin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })

    let results = await UserModel.populate(conversations, {
        path: "latestMessage.sender",
        select: "name email picture status"
    })

    return results;
}

export const updateLatestMessage = async (convo_id, msg) => {

    // it is conversation id
    const updatedConvo = await ConversationModel.findByIdAndUpdate(convo_id, {
        latestMessage:msg
    })

    if (!updatedConvo) throw createHttpError.BadRequest("Opps something went wrong")
      
    return updatedConvo

}