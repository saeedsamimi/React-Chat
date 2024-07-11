import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from "@hooks/useAuth.tsx";

interface PrivateRouterProps {
    component: React.ComponentType;
}

const PrivateRoute = ({component: Component}: PrivateRouterProps) => {
    const {isLoggedIn, loading} = useAuth();

    if (loading)
        return <div>Loading...</div>;

    return isLoggedIn ? <Component/> : <Navigate to="/login" replace/>
};

export default PrivateRoute;
