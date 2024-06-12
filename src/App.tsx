import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import "../src/styles/main.css";
import Authorization from './pages/Authorization';

function App()
{
    return (
        <Routes>
            <Route path='*' element={<Navigate to="/login"/>}/>
            <Route path='/login' element={<Authorization/>}/>
        </Routes>
    )
}

export default App;
