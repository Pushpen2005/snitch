import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../state/auth.slice.js";
import { register, login, getMe, logout } from "../service/auth.api.js";

export const useAuth = () => {
    const dispatch = useDispatch(); // ✅ FIX

    async function handleRegister({ email, contact, password, fullname, isSeller = false }) {
        try {
            dispatch(setLoading(true));

            const data = await register({ email, contact, password, fullname, isSeller });

            dispatch(setUser(data.user)); // ✅ FIXED
            
            return data.user;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));

            const data = await login({ email, password });

            dispatch(setUser(data.user)); // ✅ FIXED
            
            return data.user;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }
 async function handleGetMe() {
        try {
            dispatch(setLoading(true));

            const data = await getMe();

            dispatch(setUser(data.user)); // ✅ FIXED
            
            return data;

        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }            
    async function handleLogout() {
        try {
            dispatch(setLoading(true));
            await logout();
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Logout API error"));
        } finally {
            dispatch(setUser(null));
            dispatch(setLoading(false));
        }
    }       
    
    return { handleRegister, handleLogin, handleGetMe, handleLogout };
};

