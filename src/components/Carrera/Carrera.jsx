import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { MdDeleteForever } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { usePostFetch } from '../../hooks/usePostFetch';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { usePutFetch } from '../../hooks/usePutFetch';
import { useDeleteFetch } from '../../hooks/useDeleteFetch';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const API_BASE_URL = 'http://localhost:5155/Colegio/api/Carrera/';

const Carrera = () => {
  const { storedValue: token } = useLocalStorage('token');
  const { storedValue:idRol } = useLocalStorage('idRol');
  const { data, isLoading, error } = useFetch(`${API_BASE_URL}ObtenerCarrera`, token);
  const [createModalNuevaCarrera, setCreateModalNuevaCarrera] = useState(false);
  const [createModalActualizarCarrera, setCreateModalActualizarCarrera] = useState(false);
  const [createModalEliminarCarrera, setCreateModalEliminarCarrera] = useState(false);
  const [carreraActual, setCarreraActual] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const nuevoCarrera = usePostFetch(`${API_BASE_URL}AgregarCarrera`, token);
  const actualizarCarrera = usePutFetch(`${API_BASE_URL}ActualizarCarrera`, token);
  const eliminarCarrera = useDeleteFetch(`${API_BASE_URL}EliminarCarrera?idCarrera=`, token);

  const handleCreateShowActualizarCarrera = (carreraId) => {
    const carrera = data.model.find((carrera) => carrera.idCarrera === carreraId);
    setCarreraActual(carrera);
    setCreateModalActualizarCarrera(true);
  };
  
  const handleCreateShowNuevoCarrera = () => setCreateModalNuevaCarrera(true);

  const handleCreateShowEliminarCarrera = (carreraId) => {
    const carrera = data.model.find((carrera) => carrera.idCarrera === carreraId);
    console.log('Carrera actual:', carrera);
    setCarreraActual(carrera);
    setCreateModalEliminarCarrera(true);
  };

  const handleCreateHide = () => {
    setCreateModalActualizarCarrera(false);
    setCarreraActual(null);
    setCreateModalNuevaCarrera(false);
    setCreateModalEliminarCarrera(false);
  };

  const showSwal = (message) => {
    withReactContent(Swal)
      .fire({
        position: 'top-right',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2500
      })
      .then(() => {
        window.location.reload();
      });
  };

  const handleSubmitNuevoCarrera = (event) => {
    event.preventDefault();
    const payload = {
      nombre: event.target.createNombre.value
    };

    nuevoCarrera.executePost(payload);
    handleCreateHide();
    showSwal('Carrera guardada exitosamente');
  };

  const handleSubmitActualizarCarrera = (event) => {
    event.preventDefault();
    const payload = {
      idCarrera: event.target.updateId.value,
      nombre: event.target.updateNombre.value,
    };

    actualizarCarrera.executePut(payload);
    handleCreateHide();
    showSwal('Carrera actualizada exitosamente');
  };

  const handleEliminarCarrera = (event) => {
    event.preventDefault();
    if (carreraActual && carreraActual.idCarrera) {
      console.log('ID del carrera a eliminar:', carreraActual.idCarrera);
      eliminarCarrera.executeDelete(carreraActual.idCarrera);
      showSwal('Carrera eliminada exitosamente');
      handleCreateHide();
    } else {
      console.error('No se puede eliminar el carrera porque carreraActual es null.');
    }
  };

  return (
    <div className='container text-center'>
      
    {error && <h2 className='text-center'>Error: {error}</h2>}
    {isLoading && <h2 className='text-center'>Loading...</h2>}
    
    <h1 className="m-3">Carreras</h1>
    <hr />

    <div className="d-flex justify-content-evenly my-3 mx-5">
        <input
          type="text"
          placeholder="Buscador"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control form-control-sm me-4"
        />

        {(idRol === '1') && (
          <>
            <button className="btn btn-primary btn-block" onClick={handleCreateShowNuevoCarrera}>
              Agregar 
            </button>
          </>
        )}
      </div>

      <table className="table table-bordered table-hover">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>

          {(idRol === '1') && (
              <>
                <th></th>
              </>
          )}
          
        </tr>   
      </thead>

      <tbody>
      {data && data.model &&
            data.model
              .filter((carrera) => {
                return (
                  carrera.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((carrera) => (
                <tr key={carrera.idCarrera}>
                  <td>{carrera.idCarrera}</td>
                  <td>{carrera.nombre}</td>
                  
                  {(idRol === '1') && (
                    <>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-dark"
                          onClick={() => handleCreateShowActualizarCarrera(carrera.idCarrera)}
                        >
                          <FaEdit className="button-design" />
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleCreateShowEliminarCarrera(carrera.idCarrera)}
                        >
                          <MdDeleteForever className="button-design" />
                        </button>
                      </td>
                    </>
                  )}
                  
                </tr>
              ))}
        </tbody>
    </table>
    
    {/* --------------------------------Modal para agregar un nueva carrera------------------------------------ */}
    <Modal show={createModalNuevaCarrera} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Carrera</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='createStudent' onSubmit={handleSubmitNuevoCarrera}>
            <div className="row mb-3">
              <div className="col-sm-12 col-md-6">
                <label>Nombre</label>
                <input id='createNombre' type="text" className="form-control" name="nombre" required />
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-danger mx-2" onClick={handleCreateHide}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      
      {/* ---------------------------- Modal para editar a una carrera ---------------------------------- */}
      <Modal show={createModalActualizarCarrera} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Carrera</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='actualizarCarrera' onSubmit={handleSubmitActualizarCarrera}>
            {carreraActual && (
              <div className="row mb-3">
                <div className="col-sm-12 col-md-6">
                  <label>Id</label>
                  <input id='updateId' type="text" className="form-control" name="id" defaultValue={carreraActual.idCarrera} readOnly disabled/>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Nombre</label>
                  <input id='updateNombre' type="text" className="form-control" name="nombre" defaultValue={carreraActual.nombre} required />
                </div>
              </div>
            )}
            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-danger mx-2" onClick={handleCreateHide}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* ---------------------------- Modal para eliminar a una carrera -------------------------- */}
      <Modal show={createModalEliminarCarrera} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Carrera</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {carreraActual && (
            <div className='p-4'>
              <span className='text-center text-danger'>¿Estás seguro que lo deseas eliminar?</span>
            </div>
          )}
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-danger mx-2" onClick={handleCreateHide}>
              Cancelar
            </button>
            <button id='DeleteId' type="submit" className="btn btn-primary" onClick={handleEliminarCarrera}>
              Aceptar
            </button>
          </div>
        </Modal.Body>
      </Modal>

  </div>
  );
};

export default Carrera