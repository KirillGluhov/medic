import React, { createContext, useState, useContext, ReactNode } from "react";


interface PatientAndInspectionContextType {
    Inspection: string;
    setInspection: React.Dispatch<React.SetStateAction<string>>;
}

interface PatientAndInspectionProviderProps {
    children: ReactNode;
}

const PatientAndInspectionContext = createContext<PatientAndInspectionContextType | undefined>(undefined);

export const PatientAndInspectionProvider = ({children}: PatientAndInspectionProviderProps) => {
    
    const [Inspection, setInspection] = useState('')

    return (
        <PatientAndInspectionContext.Provider value={
            {
                Inspection, setInspection
            }
        }>
            {children}
        </PatientAndInspectionContext.Provider>
    )

}

export const usePatientAndInspection = (): PatientAndInspectionContextType => {
    const context = useContext(PatientAndInspectionContext);
    if (context === undefined) {
        throw new Error("usePatientAndInspection must be used within a PatientAndInspectionProvider");
    }
    return context;
};