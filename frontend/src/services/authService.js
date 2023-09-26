import axios from "axios";

import { tokenService, TokenType } from "./tokenService";
import {request} from "../utils/request";

export const authService = {
    singIn: async (username, password) => {
            const rawData = await fetchLogin(username, password);

        if (!rawData || rawData.status !== 200) {
                throw new Error(rawData.data.message);
            }

        const accessToken = rawData.data.result.token;
        const userId = rawData.data.result._id;

        tokenService.setToken(TokenType.CURRENT_USERID, userId);
        tokenService.setToken(TokenType.ACCESS_TOKEN, accessToken);
        tokenService.setToken(TokenType.REFRESH_TOKEN, accessToken);

    },
    signOut: async () => {
        const refreshToken = tokenService.getToken(TokenType.REFRESH_TOKEN);
        const accessToken = tokenService.getToken(TokenType.ACCESS_TOKEN);

        if (!refreshToken || !accessToken) {
            tokenService.clearAllTokens();
            return;
        }

        try{
            await fetchLogOut();
        } catch (_){
            throw new Error(_);
        }

        tokenService.clearAllTokens();

    }
}

const fetchLogin = async (username, password) => {
        return  await axios.post('http://test-2-backend-env.eba-p2c8ucse.ap-southeast-2.elasticbeanstalk.com/researcher/login', {
            username,
            password,
        },
            {
                withCredentials: true
            }
            );
};

const fetchLogOut = async () => {

    try {
        const response = await request.get('http://test-2-backend-env.eba-p2c8ucse.ap-southeast-2.elasticbeanstalk.com/researcher/logout');
        return response;
    } catch (error) {
        throw new Error(error);
    }
};
