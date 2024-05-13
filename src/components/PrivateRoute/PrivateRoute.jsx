import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';


const PrivateRoute = ({
  redirectPath = '/'
}) => {
  const { storedValue: token } = useLocalStorage('token');

  if(!token){
    return <Navigate to={redirectPath} replace/>
  }
  return <Outlet/>
}

export default PrivateRoute;