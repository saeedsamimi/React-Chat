import React, {createContext} from "react";
import {User} from "@classes/User.tsx";

export interface AuthContextValueInterface {
    isLoggedIn: boolean;
    loading: boolean;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>,
    logout: () => void;
    login: (formData: FormData, mode: string) => void;
}

export const AuthContext = createContext<AuthContextValueInterface>({
    isLoggedIn: false,
    loading: true,
    user: new User(),
    setUser: () => undefined,
    logout: () => undefined,
    login: () => undefined
});