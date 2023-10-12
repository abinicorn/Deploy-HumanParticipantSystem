import { useContext } from "react";
import { CurrentUserContext } from "../providers/CurrentUserProvider";

export const useCurrentUser = () => {

    // Set current user data
    const { user, getCurrentUser } = useContext(CurrentUserContext);

    // Can add other user type, eg: Administor
    return {
        user,
        getCurrentUser
    }
}