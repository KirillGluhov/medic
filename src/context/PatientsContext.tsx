import React, { createContext, useState, useContext, ReactNode } from "react";

interface Patient
{
    id: string,
    birthday: string | null,
    createTime: string,
    name: string,
    gender: string
}

interface PatientsContextType {
    Patients: Patient[];
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

interface PatientsProviderProps {
    children: ReactNode;
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export const PatientsProvider = ({children}: PatientsProviderProps) => {
    const [Patients, setPatients] = useState<Patient[]>([])

    return (
        <PatientsContext.Provider value={
            {
                Patients, setPatients
            }
        }>
            {children}
        </PatientsContext.Provider>
    )

}

export const usePatients = (): PatientsContextType => {
    const context = useContext(PatientsContext);
    if (context === undefined) {
        throw new Error("usePatients must be used within a PatientsProvider");
    }
    return context;
};