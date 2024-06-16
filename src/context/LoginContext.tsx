import React, { createContext, useState, useContext, ReactNode } from "react";


interface LoginContextType {
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LoginProviderProps {
    children: ReactNode;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({children}: LoginProviderProps) => {
    const [isLogin, setIsLogin] = useState(false)

    return (
        <LoginContext.Provider value={
            {
                isLogin, setIsLogin
            }
        }>
            {children}
        </LoginContext.Provider>
    )

}

export const useLogin = (): LoginContextType => {
    const context = useContext(LoginContext);
    if (context === undefined) {
        throw new Error("useLogin must be used within a LoginProvider");
    }
    return context;
};