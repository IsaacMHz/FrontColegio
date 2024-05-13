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

const API_BASE_URL = 'http://localhost:5155/Colegio/api/Materias/';

const Materias = () => {
  const { storedValue: token } = useLocalStorage('token');
  const { storedValue: idRol } = useLocalStorage('idRol');
  const { data, isLoading, error } = useFetch(`${API_BASE_URL}ObtenerMateriasDocentes`, token);
  const [createModalNuevaMateria, setCreateModalNuevaMateria] = useState(false);
  const [createModalActualizarMateria, setCreateModalActualizarMateria] = useState(false);
  const [createModalEliminarMateria, setCreateModalEliminarMateria] = useState(false);
  const [materiaActual, setMateriaActual] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const nuevoMateria = usePostFetch(`${API_BASE_URL}AgregarMaterias`, token);
  const actualizarMateria = usePutFetch(`${API_BASE_URL}ActualizarMateria`, token);
  const eliminarMateria = useDeleteFetch(`${API_BASE_URL}EliminarMateria?idMateria=`, token);

  const { data: docente, isLoading: isLoadingDocente} = useFetch(`${API_BASE_URL}../Docentes/ObtenerDocentes`, token);

  const handleCreateShowActualizarMateria = (materiaId) => {
    const materia = data.model.find((materia) => materia.idMateria === materiaId);
    setMateriaActual(materia);
    setCreateModalActualizarMateria(true);
  };

  const handleCreateShowNuevaMateria = () => setCreateModalNuevaMateria(true);

  const handleCreateShowEliminarMateria = (materiaId) => {
    const materia = data.model.find((materia) => materia.idMateria === materiaId);
    console.log('Materia actual:', materia);
    setMateriaActual(materia);
    setCreateModalEliminarMateria(true);
  };

  const handleCreateHide = () => {
    setCreateModalActualizarMateria(false);
    setMateriaActual(null);
    setCreateModalNuevaMateria(false);
    setCreateModalEliminarMateria(false);
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

  const handleSubmitNuevaMateria = (event) => {
    event.preventDefault();
    const payload = {
      nombre: event.target.createNombre.value,
      idDocente: event.target.createDocente.value
    };

    nuevoMateria.executePost(payload);
    handleCreateHide();
    showSwal('Materia guardada exitosamente');
  };

  const handleSubmitActualizarMateria = (event) => {
    event.preventDefault();
    const payload = {
      idMateria: event.target.updateId.value,
      nombre: event.target.updateNombre.value,
      idDocente: event.target.updateDocente.value
    };

    actualizarMateria.executePut(payload);
    handleCreateHide();
    showSwal('Materia actualizada exitosamente');
  };

  const handleEliminarMateria = (event) => {
    event.preventDefault();
    if (materiaActual && materiaActual.idMateria) {
      console.log('ID del materia a eliminar:', materiaActual.idMateria);
      eliminarMateria.executeDelete(materiaActual.idMateria);
      showSwal('Materia eliminada exitosamente');
      handleCreateHide();
    } else {
      console.error('No se puede eliminar el materia porque materiaActual es null.');
    }
  };

  return (
    <div className="container text-center">
      {error && <h2 className="text-center">Error: {error}</h2>}
      {isLoading && <h2 className="text-center">Loading...</h2>}

      <h1 className="m-3">Materias</h1>
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
            <button className="btn btn-primary btn-block" onClick={handleCreateShowNuevaMateria}>
              Agregar 
            </button>
          </>
        )}

      </div>

      {/* -------------------Tabla para visualizar la lista de materias------------------------ */}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Materia</th>
            <th>Docente</th>

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
              .filter((materia) => {
                return (
                  materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  materia.docente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  materia.docente.apellido.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((materia) => (
                <tr key={materia.idMateria}>
                  <td>{materia.idMateria}</td>
                  <td>{materia.nombre}</td>
                  <td>{materia.docente.nombre} {materia.docente.apellido}</td>
                  
                  {(idRol === '1') && (
                    <>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-dark"
                          onClick={() => handleCreateShowActualizarMateria(materia.idMateria)}
                        >
                          <FaEdit className="button-design" />
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleCreateShowEliminarMateria(materia.idMateria)}
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

      {/* --------------------------------Modal para agregar una nueva materia------------------------------------ */}
      <Modal show={createModalNuevaMateria} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Materia</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='createStudent' onSubmit={handleSubmitNuevaMateria}>
            <div className="row mb-3">
              <div className="col-sm-12 col-md-6">
                <label>Materia</label>
                <input id='createNombre' type="text" className="form-control" name="nombre" required />
              </div>
              <div className="col-sm-12 col-md-6">
                <label>Docente</label>
                <select id='createDocente' className="form-control" name="docente">
                  {docente && !isLoadingDocente && docente.model.map((docentes) => (
                    <option key={docentes.idDocentes} value={docentes.idDocentes}>{docentes.nombre} {docentes.apellido}</option>
                  ))}
                </select>
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

      {/* ---------------------------- Modal para editar una materia ---------------------------------- */}
      <Modal show={createModalActualizarMateria} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Materia</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='actualizarMateria' onSubmit={handleSubmitActualizarMateria}>
            {materiaActual && (
              <div className="row mb-3">
                <div className="col-sm-12 col-md-6">
                  <label>Id</label>
                  <input id='updateId' type="text" className="form-control" name="id" defaultValue={materiaActual.idMateria} readOnly disabled/>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Materia</label>
                  <input id='updateNombre' type="text" className="form-control" name="nombre" defaultValue={materiaActual.nombre} required />
                </div>
                <div className="col-sm-12 col-md-6">
                <label>Docente</label>
                <select id='updateDocente' className="form-control" name="carrera" defaultValue={materiaActual.idDocente}>
                  {docente && !isLoadingDocente && docente.model.map((docentes) => (
                    <option key={docentes.idDocentes} value={docentes.idDocentes}>{docentes.nombre} {docentes.apellido}</option>
                  ))}
                </select>
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

      {/* ---------------------------- Modal para eliminar a una materia -------------------------- */}
      <Modal show={createModalEliminarMateria} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar materia</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {materiaActual && (
            <div className='p-4'>
              <span className='text-center text-danger'>¿Estás seguro que lo deseas eliminar?</span>
            </div>
          )}
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-danger mx-2" onClick={handleCreateHide}>
              Cancelar
            </button>
            <button id='DeleteId' type="submit" className="btn btn-primary" onClick={handleEliminarMateria}>
              Aceptar
            </button>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}

export default Materias