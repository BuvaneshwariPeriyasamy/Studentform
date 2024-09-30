import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Form from './Components/Form';
import Home from './Components/Home';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/registration-form' element={<Form />}></Route>
            </Routes>
        </BrowserRouter>
    </div>
);

