import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import "../src/styles/main.css";
import Authorization from './pages/LoginPage/Authorization';
import { useLogin } from './context/LoginContext';
import { useName } from './context/NameContext';
import Registration from './pages/RegistrationPage/Registration';
import Profile from './pages/ProfilePage/Profile';
import Patients from './pages/PatientsPage/Patients';
import OnePatient from './pages/PatientPage/OnePatient';
import Consultations from './pages/ConsultationsPage/Consultations';
import Reports from './pages/ReportsPage/Reports';
import CreationOfInspections from './pages/InspectionCreatePage/CreationOfInspection';
import Inspection from './pages/InspectionDetailsPage/Inspection';

function App()
{
    const {isLogin, setIsLogin} = useLogin();
    const {isName, setIsName} = useName();

    useEffect(() => {
        if (localStorage.getItem("token") !== null)
        {
            setIsLogin(true)
        }

        const name = localStorage.getItem("name");

        if (name !== '' && name !== null)
        {
            setIsName(name);
        }
    }, [isLogin])

    return (
        <Routes>
            <Route path='*' element={<Navigate to="/login"/>}/>
            <Route path='/login' element={<Authorization/>}/>
            <Route path='/registration' element={<Registration/>}/>
            
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/patients' element={<Patients/>}/>
            <Route path='/patient/:id' element={<OnePatient/>}/>
            <Route path='/inspection/create' element={<CreationOfInspections/>}/>
            <Route path='/consultations' element={<Consultations/>}/>
            <Route path='/inspection/:id' element={<Inspection/>}/>
            <Route path='/reports' element={<Reports/>}/>
        </Routes>
    )
}

export default App;
