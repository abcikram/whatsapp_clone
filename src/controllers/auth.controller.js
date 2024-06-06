import createHttpError from "http-errors";
import { createUser, signUser } from "../services/auth.service.js"
import { generateToken } from "../services/token.service.js";
import jwt from 'jsonwebtoken'
import { findUser } from "../services/user.service.js";

export const register = async (req, res, next) => {
    try {

        const { name, email, picture, status, password } = req.body;

        const newUser = await createUser({ name, email, picture, status, password })

        console.log(process.env.ACCESS_TOKEN_SECRET)

        const access_token = await generateToken(
            { userId: newUser._id },
            "1d",
            process.env.ACCESS_TOKEN_SECRET
        );
        console.log(access_token)
        const refresh_token = await generateToken(
            { userId: newUser._id },
            "30d",
            process.env.REFRESH_TOKEN_SECRET
        );

        res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/api/v1/auth/refreshtoken",
            maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
        });

        // This code sets an HTTP - only cookie named "refreshtoken" with a value of refresh_token.The cookie is valid for requests to the path / api / v1 / auth / refreshtoken and will expire after 30 days.The HTTP - only flag helps to enhance security by preventing client - side scripts from accessing the cookie.

        res.json({
            message: "register success.",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                picture: newUser.picture,
                status: newUser.status,
                token: access_token,
            },
        });

    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await signUser(email, password);
        const access_token = await generateToken(
            { userId: user._id },
            "1d",
            process.env.ACCESS_TOKEN_SECRET
        );
        const refresh_token = await generateToken(
            { userId: user._id },
            "30d",
            process.env.REFRESH_TOKEN_SECRET
        );

        res.cookie("refreshtoken", refresh_token, {
            httpOnly: true,
            path: "/api/v1/auth/refreshtoken",
            maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
        });

        res.json({
            message: "register success.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                status: user.status,
                token: access_token,
            },
        });

    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    try {

        //remove the refresh token from cookie
        res.clearCookie("refreshtoken", { path: "/api/v1/auth/refreshtoken" })
        res.json({
            mesage: "logged out !"
        })
    } catch (error) {
        next(error)
    }
}


// when hit refreshToken api then , create new refreshToken :-  
export const refreshToken = async (req, res, next) => {
    try {

        const refresh_token = req.cookies.refreshtoken;
        if (!refresh_token) {
            throw createHttpError.Unauthorized('Please login!')
        }

        const check = await jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)

        const user = await findUser(check.userId);
        const access_token = await generateToken(
            { userId: user._id },
            "1d",
            process.env.ACCESS_TOKEN_SECRET
        );
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                status: user.status,
                token: access_token,
            },
        });

        res.json(check)
    } catch (error) {
        next(error)
    }
}