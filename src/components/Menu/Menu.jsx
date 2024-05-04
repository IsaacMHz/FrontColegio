import React from 'react'
import './Menu.css'
import { NavLink } from 'react-router-dom'

const Menu = () => {
  return (
    <nav className='main-navbar'>
        <ul className='d-flex p-0'>
            <li className='nav-item'>
                <NavLink 
                className={({isActive})=>(`link ${isActive ? 'active': ''}`)} 
                to='/'>
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
            </li>
        </ul>
    </nav>
    
  )
}

export default Menu