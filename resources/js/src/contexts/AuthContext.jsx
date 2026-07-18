import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();
import * as authService from "../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
    const userData = JSON.parse(localStorage.getItem("pitbull_user"));
    const navigate = useNavigate();
    const [user, setUser] = useState(userData);
    const [isAuth, setIsAuth] = useState(  userData ? (userData.id ? true : false) : false);

    const login = async (data, resetForm) => {
        try {
            const result = await authService.login(data);

            if (result.success) {
                setIsAuth(true);
                setUser(result.user);
                // navigate("/profile");
                localStorage.setItem("pitbull_user", JSON.stringify(result.user));
                resetForm();
                return result;
            } else {
                return result;
            }
        } catch (error) {
            return { success: false, message: "Грешка при вход в системата." };
        }
    };
    const register = async (data, resetForm) => {
        try {
            const result = await authService.register(data);
            if (result.succsess) {
                resetForm();
                toast.success("Успешна регистрация.");
            } else {
                // return result;
                toast.error("Неуспешно влизане.");
            }

        } catch (error) {
            toast.error("Неуспешно влизане.");
        }
    }

    const logout = async () => {

        try {
            const result = await authService.logout();

            if (result.success) {
                setIsAuth(false);
                setUser([]);
                toast.success("Успешно излезнахте.");
                navigate("/");
                localStorage.clear("pitbull_user");
            } else {
                toast.error("Грешки при излизане.");
            }
        } catch (error) {
            toast.error("Грешки при излизане.");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                login,
                isAuth,
                user,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
