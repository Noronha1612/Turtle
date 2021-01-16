import jwt from 'jsonwebtoken';

export default function generateToken(payload: object) {
    const tokenKey = process.env.TOKEN_KEY;

    if ( !tokenKey ) throw "Token key not found";

    const token = jwt.sign(payload, tokenKey);

    return token;
}