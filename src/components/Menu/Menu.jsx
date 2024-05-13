import React from 'react'
import './Menu.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../../hooks/useLocalStorage';

const Menu = () => {
    const navigate = useNavigate();
    const { clearValue: clearToken } = useLocalStorage('token');
    const { storedValue: idRol, clearValue: clearIdRol } = useLocalStorage('idRol');

    const cerrarSesion = () => {
        clearToken(); 
        clearIdRol(); 
        navigate('/');
    };
    
    return (
        <nav className='main-nav d-flex'>
            <ul className='lista d-flex p-0'>
                <li className='nav-item'>
                    {(idRol === '1' || idRol === '3') && (
                        <>
                            <NavLink 
                                className={({isActive})=>(`link ${isActive ? 'active': ''}`)} 
                                to='/alumnos'>
                                Alumnos
                            </NavLink>
                            <NavLink 
                                className={({isActive})=>(`link ${isActive ? 'active': ''}`)} 
                                to='/carrera'>
                                Carrera
                            </NavLink>
                            <NavLink 
                                className={({isActive})=>(`link ${isActive ? 'active': ''}`)} 
                                to='/docentes'>
                                Docentes
                            </NavLink>
                            <NavLink 
                                className={({isActive})=>(`link ${isActive ? 'active': ''}`)} 
                                to='/materias'>
                                Materias
                            </NavLink>
                        </>
                    )}
                    {(idRol === '1' || idRol === '2') && (
                        <>
                            <NavLink 
                                className={({isActive})=>(`link ${isActive ? 'active': ''}`)} 
                                to='/parcialUno'>
                                Parcial Uno
                            </NavLink>
                            <NavLink 
                                className={({isActive})=>(`link ${isActive ? 'active': ''}`)} 
                                to='/parcialDos'>
                                Parcial Dos
                            </NavLink>
                            <NavLink 
                                className={({isActive})=>(`link ${isActive ? 'active': ''}`)} 
                                to='/parcialTres'>
                                Parcial Tres
                            </NavLink>
                            <NavLink 
                                className={({isActive})=>(`link ${isActive ? 'active': ''}`)} 
                                to='/parcialCuatro'>
                                Parcial Cuatro
                            </NavLink>
                        </>
                    )}
                </li>
            </ul>
            <button  type="button" className="boton-salir btn btn-danger" onClick={cerrarSesion}>
                Salir
            </button>
        </nav>
    )
}

export default Menu
