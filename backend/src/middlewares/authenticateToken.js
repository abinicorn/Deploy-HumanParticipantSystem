import jwt from "jsonwebtoken";
// Require variables from .env file
dotenv.config();
import * as dotenv from "dotenv";

import {HTTP_TOKEN_NOT_FOUND} from '../enum.js';

const secret = "secret123";


// Protect routes by verifying user token and checking db
const verifyUserAuth = async (req, res, next) => {

    if (req.path === '/researcher/login' ) {
        next();
        return
    }

    const token = req.cookies.token;
    if (!token) {
        return res.status(HTTP_TOKEN_NOT_FOUND).json({ message: 'Logout status, no access' });
    }

    try {
        // Verify jwt token
        const decoded = await jwt.verify(token, secret);

        if (decoded != null) {

              next();
        }else {
            res.status(HTTP_TOKEN_NOT_FOUND).json({ message: 'Token error' });
        }

    } catch (err) {
        res.status(HTTP_TOKEN_NOT_FOUND).json({ message: 'Token error' });
    }
};

export default verifyUserAuth;