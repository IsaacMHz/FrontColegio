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

const API_BASE_URL = 'http://localhost:5155/Colegio/api/ParcialUno/';

const ParcialUno = () => {

  const { data, isLoading, error } = useFetch(`${API_BASE_URL}ObtenerParcialUnoExtend`);
  const [createModalNuevoParcialUno, setCreateModalNuevoParcialUno] = useState(false);
  const [createModalActualizarParcialUno, setCreateModalActualizarParcialUno] = useState(false);
  const [createModalEliminarParcialUno, setCreateModalEliminarParcialUno] = useState(false);
  const [parcialUnoActual, setParcialUnoActual] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const nuevoParcialUno = usePostFetch(`${API_BASE_URL}InsertarParcialUno`);
  const actualizarParcialUno = usePutFetch(`${API_BASE_URL}ActualizarParcialUno`);
  const eliminarParcialUno = useDeleteFetch(`${API_BASE_URL}EliminarParcialUno?idParcial=`);

  const { data: alumno, isLoading: isLoadingAlumno} = useFetch(`${API_BASE_URL}../Alumnos/ObtenerAlumnosFiltro`);
  const { data: materia, isLoading: isLoadingMateria} = useFetch(`${API_BASE_URL}../Materias/ObtenerMaterias`);

  const handleCreateShowActualizarParcialUno = (parcialUnoId) => {
    const parcialUno = data.model.find((parcialUno) => parcialUno.idParcial === parcialUnoId);
    setParcialUnoActual(parcialUno);
    setCreateModalActualizarParcialUno(true);
  };

  const handleCreateShowNuevoParcialUno = () => setCreateModalNuevoParcialUno(true);

  const handleCreateShowEliminarParcialUno = (parcialUnoId) => {
    const parcialUno = data.model.find((parcialUno) => parcialUno.idParcial === parcialUnoId);
    console.log('ParcialUno actual:', parcialUno);
    setParcialUnoActual(parcialUno);
    setCreateModalEliminarParcialUno(true);
  };

  const handleCreateHide = () => {
    setCreateModalActualizarParcialUno(false);
    setParcialUnoActual(null);
    setCreateModalNuevoParcialUno(false);
    setCreateModalEliminarParcialUno(false);
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

  const handleSubmitNuevoParcialUno = (event) => {
    event.preventDefault();
    const payload = {
      idAlumno: event.target.createAlumno.value,
      idMateria: event.target.createMateria.value,
      calificacion: event.target.createCalificacion.value
    };

    nuevoParcialUno.executePost(payload);
    handleCreateHide();
    showSwal('Parcial guardado exitosamente');
  };

  const handleSubmitActualizarParcialUno = (event) => {
    event.preventDefault();
    const payload = {
      idParcial: event.target.updateParcial.value,
      idAlumno: event.target.updateAlumno.value,
      idMateria: event.target.updateMateria.value,
      calificacion: event.target.updateCalificacion.value
    };

    actualizarParcialUno.executePut(payload);
    handleCreateHide();
    showSwal('Parcial actualizado exitosamente');
  };

  const handleEliminarParcialUno = (event) => {
    event.preventDefault();
    if (parcialUnoActual && parcialUnoActual.idParcial) {
      console.log('ID del parcialUno a eliminar:', parcialUnoActual.idParcial);
      eliminarParcialUno.executeDelete(parcialUnoActual.idParcial);
      showSwal('Parcial eliminado exitosamente');
      handleCreateHide();
    } else {
      console.error('No se puede eliminar el parcialUno porque parcialUnoActual es null.');
    }
  };

  return (
    <div className="container text-center">
      {error && <h2 className="text-center">Error: {error}</h2>}
      {isLoading && <h2 className="text-center">Loading...</h2>}

      <h1 className="m-3">Parcial Uno</h1>
      <hr />

      <div className="d-flex justify-content-evenly my-3 mx-5">
        <input
          type="text"
          placeholder="Buscador"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control form-control-sm me-4"
        />

        <button className="btn btn-primary btn-block" onClick={handleCreateShowNuevoParcialUno}>
          Agregar 
        </button>
      </div>

      {/* -------------------Tabla para visualizar la lista de parcialUno------------------------ */}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Alumno</th>
            <th>Materia</th>
            <th>Calificacion</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data && data.model &&
            data.model
              .filter((parcialUno) => {
                return (
                  parcialUno.alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  parcialUno.alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  parcialUno.materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((parcialUno) => (
                <tr key={parcialUno.idParcial}>
                  <td>{parcialUno.idParcial}</td>
                  <td>{parcialUno.alumno.nombre} {parcialUno.alumno.apellido}</td>
                  <td>{parcialUno.materia.nombre}</td>
                  <td>{parcialUno.calificacion}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => handleCreateShowActualizarParcialUno(parcialUno.idParcial)}
                    >
                      <FaEdit className="button-design" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleCreateShowEliminarParcialUno(parcialUno.idParcial)}
                    >
                      <MdDeleteForever className="button-design" />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {/* --------------------------------Modal para agregar un nuevo parcial------------------------------------ */}
      <Modal show={createModalNuevoParcialUno} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Parcial</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='createStudent' onSubmit={handleSubmitNuevoParcialUno}>
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
      <Modal show={createModalActualizarParcialUno} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Parcial</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='actualizarAlumno' onSubmit={handleSubmitActualizarParcialUno}>
            {parcialUnoActual && (
              <div className="row mb-3">
                <div className="col-sm-12 col-md-6">
                  <label>Id</label>
                  <input id='updateParcial' type="text" className="form-control" name="id" defaultValue={parcialUnoActual.idParcial} readOnly disabled/>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Alumno</label>
                  <select id='updateAlumno' className="form-control" name="alumno" defaultValue={parcialUnoActual.idAlumno}>
                    {alumno && !isLoadingAlumno && alumno.model.map((alumnos) => (
                      <option key={alumnos.idAlumno} value={alumnos.idAlumno}>{alumnos.nombre} {alumnos.apellido}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Materia</label>
                  <select id='updateMateria' className="form-control" name="materia" defaultValue={parcialUnoActual.idMateria}>
                    {materia && !isLoadingMateria && materia.model.map((materias) => (
                      <option key={materias.idMateria} value={materias.idMateria}>{materias.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Calificación</label>
                  <input id='updateCalificacion' type="text" className="form-control" name="calificacion" defaultValue={parcialUnoActual.calificacion} required />
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
      <Modal show={createModalEliminarParcialUno} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Parcial</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {parcialUnoActual && (
            <div className='p-4'>
              <span className='text-center text-danger'>¿Estás seguro que lo deseas eliminar?</span>
            </div>
          )}
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-danger mx-2" onClick={handleCreateHide}>
              Cancelar
            </button>
            <button id='DeleteId' type="submit" className="btn btn-primary" onClick={handleEliminarParcialUno}>
              Aceptar
            </button>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}

export default ParcialUno