import { useEffect } from "react";
import { setAuthToken } from "../utils/authTokenStore";
import { useAuth } from "./AuthContext";

const UseAuth = () => {
    const { token } = useAuth();
    useEffect(() => {
        setAuthToken(token);//update token for axios (outside react)
    }, [token]);

    return null;
}

export default UseAuth;