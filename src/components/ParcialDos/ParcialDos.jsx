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

const API_BASE_URL = 'http://localhost:5155/Colegio/api/ParcialDos/';

const ParcialDos = () => {
  const { storedValue: token } = useLocalStorage('token');
  const { storedValue: idRol } = useLocalStorage('idRol');
  const { data, isLoading, error } = useFetch(`${API_BASE_URL}ObtenerParcialDosExtend`, token);
  const [createModalNuevoParcialDos, setCreateModalNuevoParcialDos] = useState(false);
  const [createModalActualizarParcialDos, setCreateModalActualizarParcialDos] = useState(false);
  const [createModalEliminarParcialDos, setCreateModalEliminarParcialDos] = useState(false);
  const [parcialDosActual, setParcialDosActual] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const nuevoParcialDos = usePostFetch(`${API_BASE_URL}InsertarParcialDos`, token);
  const actualizarParcialDos = usePutFetch(`${API_BASE_URL}ActualizarParcialDos`, token);
  const eliminarParcialDos = useDeleteFetch(`${API_BASE_URL}EliminarParcialDos?idParcial=`, token);

  const { data: alumno, isLoading: isLoadingAlumno} = useFetch(`${API_BASE_URL}../Alumnos/ObtenerAlumnosFiltro`, token);
  const { data: materia, isLoading: isLoadingMateria} = useFetch(`${API_BASE_URL}../Materias/ObtenerMaterias`, token);

  const handleCreateShowActualizarParcialDos = (parcialDosId) => {
    const parcialDos = data.model.find((parcialDos) => parcialDos.idParcial === parcialDosId);
    setParcialDosActual(parcialDos);
    setCreateModalActualizarParcialDos(true);
  };

  const handleCreateShowNuevoParcialDos = () => setCreateModalNuevoParcialDos(true);

  const handleCreateShowEliminarParcialDos = (parcialDosId) => {
    const parcialDos = data.model.find((parcialDos) => parcialDos.idParcial === parcialDosId);
    console.log('ParcialDos actual:', parcialDos);
    setParcialDosActual(parcialDos);
    setCreateModalEliminarParcialDos(true);
  };

  const handleCreateHide = () => {
    setCreateModalActualizarParcialDos(false);
    setParcialDosActual(null);
    setCreateModalNuevoParcialDos(false);
    setCreateModalEliminarParcialDos(false);
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

  const handleSubmitNuevoParcialDos = (event) => {
    event.preventDefault();
    const payload = {
      idAlumno: event.target.createAlumno.value,
      idMateria: event.target.createMateria.value,
      calificacion: event.target.createCalificacion.value
    };

    nuevoParcialDos.executePost(payload);
    handleCreateHide();
    showSwal('Parcial guardado exitosamente');
  };

  const handleSubmitActualizarParcialDos = (event) => {
    event.preventDefault();
    const payload = {
      idParcial: event.target.updateParcial.value,
      idAlumno: event.target.updateAlumno.value,
      idMateria: event.target.updateMateria.value,
      calificacion: event.target.updateCalificacion.value
    };

    actualizarParcialDos.executePut(payload);
    handleCreateHide();
    showSwal('Parcial actualizado exitosamente');
  };

  const handleEliminarParcialDos = (event) => {
    event.preventDefault();
    if (parcialDosActual && parcialDosActual.idParcial) {
      console.log('ID del parcialDos a eliminar:', parcialDosActual.idParcial);
      eliminarParcialDos.executeDelete(parcialDosActual.idParcial);
      showSwal('Parcial eliminado exitosamente');
      handleCreateHide();
    } else {
      console.error('No se puede eliminar el parcialDos porque parcialDosActual es null.');
    }
  };

  return (
    <div className="container text-center">
      {error && <h2 className="text-center">Error: {error}</h2>}
      {isLoading && <h2 className="text-center">Loading...</h2>}

      <h1 className="m-3">Parcial Dos</h1>
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
            <button className="btn btn-primary btn-block" onClick={handleCreateShowNuevoParcialDos}>
              Agregar 
            </button>
          </>
        )}

      </div>

      {/* -------------------Tabla para visualizar la lista de parcialDos------------------------ */}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Alumno</th>
            <th>Materia</th>
            <th>Calificacion</th>

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
              .filter((parcialDos) => {
                return (
                  parcialDos.alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  parcialDos.alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  parcialDos.materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((parcialDos) => (
                <tr key={parcialDos.idParcial}>
                  <td>{parcialDos.idParcial}</td>
                  <td>{parcialDos.alumno.nombre} {parcialDos.alumno.apellido}</td>
                  <td>{parcialDos.materia.nombre}</td>
                  <td>{parcialDos.calificacion}</td>
                  
                  {(idRol === '1') && (
                    <>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-dark"
                          onClick={() => handleCreateShowActualizarParcialDos(parcialDos.idParcial)}
                        >
                          <FaEdit className="button-design" />
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleCreateShowEliminarParcialDos(parcialDos.idParcial)}
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

      {/* --------------------------------Modal para agregar un nuevo parcial------------------------------------ */}
      <Modal show={createModalNuevoParcialDos} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Parcial</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='createStudent' onSubmit={handleSubmitNuevoParcialDos}>
            <div className="row mb-3">
              <div className="col-sm-12 col-md-6">
                <label>Alumno</label>
                <select id='createAlumno' className="form-control" name="alumno">
                  {alumno && !isLoadingAlumno && alumno.model.map((alumnos) => (
                    <option key={alumnos.idAlumno} value={alumnos.idAlumno}>{alumnos.nombre} {alumnos.apellido}</option>
                  ))}
                </select>
              </div>
              <div className="col-sm-12 col-md-6">
                <label>Materia</label>
                <select id='createMateria' className="form-control" name="materia">
                  {materia && !isLoadingMateria && materia.model.map((materias) => (
                    <option key={materias.idMateria} value={materias.idMateria}>{materias.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-sm-12 col-md-6">
                <label>Calificación</label>
                <input id='createCalificacion' type="text" className="form-control" name="calificacion" required />
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

      {/* ---------------------------- Modal para editar un parcial ---------------------------------- */}
      <Modal show={createModalActualizarParcialDos} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Parcial</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='actualizarAlumno' onSubmit={handleSubmitActualizarParcialDos}>
            {parcialDosActual && (
              <div className="row mb-3">
                <div className="col-sm-12 col-md-6">
                  <label>Id</label>
                  <input id='updateParcial' type="text" className="form-control" name="id" defaultValue={parcialDosActual.idParcial} readOnly disabled/>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Alumno</label>
                  <select id='updateAlumno' className="form-control" name="alumno" defaultValue={parcialDosActual.idAlumno}>
                    {alumno && !isLoadingAlumno && alumno.model.map((alumnos) => (
                      <option key={alumnos.idAlumno} value={alumnos.idAlumno}>{alumnos.nombre} {alumnos.apellido}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Materia</label>
                  <select id='updateMateria' className="form-control" name="materia" defaultValue={parcialDosActual.idMateria}>
                    {materia && !isLoadingMateria && materia.model.map((materias) => (
                      <option key={materias.idMateria} value={materias.idMateria}>{materias.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Calificación</label>
                  <input id='updateCalificacion' type="text" className="form-control" name="calificacion" defaultValue={parcialDosActual.calificacion} required />
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

      {/* ---------------------------- Modal para eliminar a un alumno -------------------------- */}
      <Modal show={createModalEliminarParcialDos} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Parcial</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {parcialDosActual && (
            <div className='p-4'>
              <span className='text-center text-danger'>¿Estás seguro que lo deseas eliminar?</span>
            </div>
          )}
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-danger mx-2" onClick={handleCreateHide}>
              Cancelar
            </button>
            <button id='DeleteId' type="submit" className="btn btn-primary" onClick={handleEliminarParcialDos}>
              Aceptar
            </button>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}

export default ParcialDos