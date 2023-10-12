import axios from "axios";
import {tokenService, TokenType} from "../services/tokenService";

const baseUrl = process.env.REACT_APP_API_BASE_URL

// Package request with token
export const request = axios.create({
    baseURL: baseUrl,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

request.interceptors.request.use(
    (config) => {
        const accessToken = tokenService.getToken(TokenType.ACCESS_TOKEN);

        if (config.headers) {
            config.headers["Authorization"] = accessToken;
        } else {
            config = {
                ...config,
                headers: {
                    Authorization: accessToken,
                },
            };
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // if (error.response === undefined){
        //     alert('Sever error');
        //     return Promise.reject(error);
        // }
        if (error.message && (error.message.includes("Network Error") || error.message.includes("Connection Refused"))) {
            alert("Network error: Unable to connect to the server. Please check your internet connection and try again.");
            window.location.href = "/";
            return Promise.reject(error);
        }


        if (error.response.status === 402) {
            alert("Token has expired, please log in again.");
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);


