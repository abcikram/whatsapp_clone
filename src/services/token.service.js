import jwt from 'jsonwebtoken';

export const generateToken = (payload, expiresIn, secretKey) => {
    return jwt.sign(payload, secretKey, { expiresIn });
};
