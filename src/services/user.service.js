import createHttpError from "http-errors"
import UserModel from "../models/userModel.js";

export const findUser = async (userId) => {

    const user = await UserModel.findById(userId)
    
    if (!user) throw createHttpError.BadRequest('User does not exist')
    
    return user
    
}
