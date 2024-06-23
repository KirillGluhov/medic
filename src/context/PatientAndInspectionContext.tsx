import React, { createContext, useState, useContext, ReactNode } from "react";


interface PatientAndInspectionContextType {
    Patient: string;
    setPatient: React.Dispatch<React.SetStateAction<string>>;
    Inspection: string;
    setInspection: React.Dispatch<React.SetStateAction<string>>;
}

interface PatientAndInspectionProviderProps {
    children: ReactNode;
}

const PatientAndInspectionContext = createContext<PatientAndInspectionContextType | undefined>(undefined);

export const PatientAndInspectionProvider = ({children}: PatientAndInspectionProviderProps) => {
    
    const [Patient, setPatient] = useState('')
    const [Inspection, setInspection] = useState('')

    return (
        <PatientAndInspectionContext.Provider value={
            {
                Patient, setPatient,
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