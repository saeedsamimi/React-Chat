import {ReactNode, useEffect, useRef, useState} from "react";
import axios from "axios";
import {AuthContext} from "./AuthContext.tsx";
import {User} from "@classes/User.tsx";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState(new User());
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const initialRef = useRef<boolean>(true)

    useEffect(() => {
        if (initialRef.current) {
            axios.post('/api/auth', undefined, {withCredentials: true})
                .then((res) => {
                    setIsLoggedIn(true);
                    setUser(res.data);
                })
                .catch((err) => {
                    console.error("Error checking login status:", err);
                    setIsLoggedIn(false);
                })
                .finally(() => {
                    setLoading(false);
                })
            initialRef.current = false;
        }
    }, []);

    const logout = () => {
        axios.delete('/api/auth', {withCredentials: true})
            .then(() => {
                setIsLoggedIn(false);
                setUser(new User());
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const login = (formData: FormData, mode: string) => {
        axios.post(`/api/${mode}`, formData, {withCredentials: true})
            .then((res) => {
                setUser(res.data)
                setIsLoggedIn(true)
            })
            .catch((err) => console.error(err));
    }

    return (
        <AuthContext.Provider value={{isLoggedIn, loading, user, setUser, logout, login}}>
            {children}
        </AuthContext.Provider>
    );
};