import React from 'react'
import './Dashboard.css'
import Menu from "../Menu/Menu"
import { useState } from 'react'
import { RiArrowRightDoubleLine, RiCloseLargeFill } from "react-icons/ri";

export const Dashboard = (props) => {

    const [sidebarVisible, setSidebarVisible] = useState(true);
  
    const toggleSidebar = () => {
      setSidebarVisible(!sidebarVisible);
    };

  return (

    <div className='contenedor'>


      <div className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
        <h2 className='title'>Menú</h2>
        <hr className='border'/>
        <Menu />
      </div>

      <div className={'contenido'}>
        <button className={`toggle ${sidebarVisible && 'visible'}`} onClick={toggleSidebar}>
          {sidebarVisible ? <RiCloseLargeFill /> : <RiArrowRightDoubleLine />}
        </button>
        {props.children}
      </div>

    </div>
    
  )
}

export default Dashboard