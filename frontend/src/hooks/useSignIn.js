import { useCallback, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {authService} from "../services/authService";

export const useSignIn = () => {
    // Sign in
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    const onSignIn = useCallback(
        async (username, password) => {
            if (!username) {
                setError("Username is required.");
                return;
            }

            if (!password) {
                setError("Password is required.");
                return;
            }

            setIsLoading(true);

            try {
                await authService.singIn(username, password);

                navigate('/homepage');
            } catch (e) {
                setError(
                    "The login details you entered did not match our records. Please double-check and try again"
                );
                setIsLoading(false);
            }

        },
        []
    );

    return {
        onSignIn,
        isLoading,
        error,
    };

}