import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import "../src/styles/main.css";
import Authorization from './pages/Authorization';
import { useLogin } from './context/LoginContext';
import { useName } from './context/NameContext';
import Registration from './pages/Registration';
import Profile from './pages/Profile';
import Patients from './pages/Patients';
import OnePatient from './pages/OnePatient';

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
            <Route path='/patients/:id' element={<OnePatient/>}/>
        </Routes>
    )
}

export default App;
