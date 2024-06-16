import React, { createContext, useState, useContext, ReactNode } from "react";

interface NameContextType {
    isName: string;
    setIsName: React.Dispatch<React.SetStateAction<string>>;
}

interface NameProviderProps {
    children: ReactNode;
}

const NameContext = createContext<NameContextType | undefined>(undefined);

export const NameProvider = ({children}: NameProviderProps) => {
    const [isName, setIsName] = useState('')

    return (
        <NameContext.Provider value={
            {
                isName, setIsName
            }
        }>
            {children}
        </NameContext.Provider>
    )

}

export const useName = (): NameContextType => {
    const context = useContext(NameContext);
    if (context === undefined) {
        throw new Error("useName must be used within a NameProvider");
    }
    return context;
};