import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Pages/App.tsx'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import '@styles/index.scss'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.min.css'

import {AuthProvider} from '@contexts/AuthProvider.tsx';
import SignInLogIn from '@pages/SigninLogin.tsx';
import PrivateRoute from '@routers/PrivateRouter.tsx';
import Dashboard from "@pages/Dashboard.tsx";

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<App/>}>
                            <Route path="" element={<h1>home</h1>}></Route>
                            <Route path="login" element={<SignInLogIn mode={"login"}/>}></Route>
                            <Route path="signup" element={<SignInLogIn mode={"signup"}/>}></Route>
                            <Route
                                path="products"
                                element={<PrivateRoute component={Dashboard}/>}
                            />
                        </Route>
                        <Route path="*" element={<h1>Error</h1>}/>
                    </Routes>
                </Router>
            </AuthProvider>
        </React.StrictMode>,
    )
} else {
    console.error("Root element not found!");
}
