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

const API_BASE_URL = 'https://apitraineecolegio1.azurewebsites.net/Colegio/api/Docentes/';

const Docentes = () => {
  
  const { data, isLoading, error } = useFetch(`${API_BASE_URL}ObtenerDocentes`);
  const [createModalNuevoDocente, setCreateModalNuevoDocente] = useState(false);
  const [createModalActualizarDocente, setCreateModalActualizarDocente] = useState(false);
  const [createModalEliminarDocente, setCreateModalEliminarDocente] = useState(false);
  const [docenteActual, setDocenteActual] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const nuevoDocente = usePostFetch(`${API_BASE_URL}InsertarDocentes`);
  const actualizarDocente = usePutFetch(`${API_BASE_URL}ActualizarDocentes`);
  const eliminarDocente = useDeleteFetch(`${API_BASE_URL}EliminarDocentes?idDocentes=`);

  const handleCreateShowActualizarDocente = (docenteId) => {
    const docente = data.model.find((docente) => docente.idDocentes === docenteId);
    setDocenteActual(docente);
    setCreateModalActualizarDocente(true);
  };

  const handleCreateShowNuevoDocente = () => setCreateModalNuevoDocente(true);

  const handleCreateShowEliminarDocente = (docenteId) => {
    const docente = data.model.find((docente) => docente.idDocentes === docenteId);
    console.log('Docente actual:', docente);
    setDocenteActual(docente);
    setCreateModalEliminarDocente(true);
  };

  const handleCreateHide = () => {
    setCreateModalActualizarDocente(false);
    setDocenteActual(null);
    setCreateModalNuevoDocente(false);
    setCreateModalEliminarDocente(false);
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

  const handleSubmitNuevoDocente = (event) => {
    event.preventDefault();
    const payload = {
      nombre: event.target.createNombre.value,
      apellido: event.target.createApellido.value
    };

    nuevoDocente.executePost(payload);
    handleCreateHide();
    showSwal('Docente guardado exitosamente');
  };

  const handleSubmitActualizarDocente = (event) => {
    event.preventDefault();
    const payload = {
      idDocentes: event.target.updateId.value,
      nombre: event.target.updateNombre.value,
      apellido: event.target.updateApellido.value
    };

    actualizarDocente.executePut(payload);
    handleCreateHide();
    showSwal('Docente actualizado exitosamente');
  };

  const handleEliminarDocente = (event) => {
    event.preventDefault();
    if (docenteActual && docenteActual.idDocentes) {
      console.log('ID del docente a eliminar:', docenteActual.idDocentes);
      eliminarDocente.executeDelete(docenteActual.idDocentes);
      showSwal('Docente eliminado exitosamente');
      handleCreateHide();
    } else {
      console.error('No se puede eliminar el docente porque docenteActual es null.');
    }
  };

  return (
    <div className="container text-center">
      {error && <h2 className="text-center">Error: {error}</h2>}
      {isLoading && <h2 className="text-center">Loading...</h2>}

      <h1 className="m-3">Docentes</h1>
      <hr />

      <div className="d-flex justify-content-evenly my-3 mx-5">
        <input
          type="text"
          placeholder="Buscador"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control form-control-sm me-4"
        />

        <button className="btn btn-primary btn-block" onClick={handleCreateShowNuevoDocente}>
          Agregar 
        </button>
      </div>

      {/* -------------------Tabla para visualizar la lista de docentes------------------------ */}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data && data.model &&
            data.model
              .filter((docente) => {
                return (
                  docente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  docente.apellido.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((docente) => (
                <tr key={docente.idDocentes}>
                  <td>{docente.idDocentes}</td>
                  <td>{docente.nombre}</td>
                  <td>{docente.apellido}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => handleCreateShowActualizarDocente(docente.idDocentes)}
                    >
                      <FaEdit className="button-design" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleCreateShowEliminarDocente(docente.idDocentes)}
                    >
                      <MdDeleteForever className="button-design" />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {/* --------------------------------Modal para agregar un nuevo docente------------------------------------ */}
      <Modal show={createModalNuevoDocente} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Docente</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='createStudent' onSubmit={handleSubmitNuevoDocente}>
            <div className="row mb-3">
              <div className="col-sm-12 col-md-6">
                <label>Nombre</label>
                <input id='createNombre' type="text" className="form-control" name="nombre" required />
              </div>
              <div className="col-sm-12 col-md-6">
                <label>Apellido</label>
                <input id='createApellido' type="text" className="form-control" name="apellido" required />
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

      {/* ---------------------------- Modal para editar a un docente ---------------------------------- */}
      <Modal show={createModalActualizarDocente} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Docente</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='actualizarDocente' onSubmit={handleSubmitActualizarDocente}>
            {docenteActual && (
              <div className="row mb-3">
                <div className="col-sm-12 col-md-6">
                  <label>Id</label>
                  <input id='updateId' type="text" className="form-control" name="id" defaultValue={docenteActual.idDocentes} readOnly disabled/>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Nombre</label>
                  <input id='updateNombre' type="text" className="form-control" name="nombre" defaultValue={docenteActual.nombre} required />
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Apellido</label>
                  <input id='updateApellido' type="text" className="form-control" name="apellido" defaultValue={docenteActual.apellido} required />
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

      {/* ---------------------------- Modal para eliminar a un docente -------------------------- */}
      <Modal show={createModalEliminarDocente} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Docente</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {docenteActual && (
            <div className='p-4'>
              <span className='text-center text-danger'>¿Estás seguro que lo deseas eliminar?</span>
            </div>
          )}
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-danger mx-2" onClick={handleCreateHide}>
              Cancelar
            </button>
            <button id='DeleteId' type="submit" className="btn btn-primary" onClick={handleEliminarDocente}>
              Aceptar
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Docentes