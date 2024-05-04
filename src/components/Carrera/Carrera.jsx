import React from 'react'
import { useFetch } from '../../hooks/useFetch';
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const Carrera = () => {
  const {data, isLoading, error} = useFetch('http://localhost:5155/Colegio/api/Carrera/ObtenerCarrera');
  return (
    <div className='container text-center'>
      
    {error && <h2 className='text-center'>Error: {error}</h2>}
    {isLoading && <h2 className='text-center'>Loading...</h2>}
    
    <h1>Carreras</h1>
    <hr />

    <div className='d-flex justify-content-evenly my-3'>
     
      <button className='btn btn-primary'>Agregar carrera</button>
    </div>

    <table className='table table-striped'>
      <thead className='thead-dark'>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th></th>
        </tr>   
      </thead>

      <tbody>
        {data && data.model.map((carrera) => (
         <tr key={carrera.idCarrera}>
            <td>{carrera.idCarrera}</td>
            <td>{carrera.nombre}</td>
            <td>
              
              <button type="button" className='btn btn-outline-dark'>
                <FaEdit className='button-design' />
              </button>
              <button type="button" className='btn btn-outline-danger'>
                <MdDeleteForever className='button-design'/>
              </button>
              
            </td>
          </tr>
          ))
        }
            
      </tbody>
    </table>
  </div>
  )
}

export default Carrera