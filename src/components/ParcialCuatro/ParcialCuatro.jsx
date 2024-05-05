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

const API_BASE_URL = 'http://localhost:5155/Colegio/api/ParcialCuatro/';

const ParcialCuatro = () => {

  const { data, isLoading, error } = useFetch(`${API_BASE_URL}ObtenerParcialCuatroExtend`);
  const [createModalNuevoParcialCuatro, setCreateModalNuevoParcialCuatro] = useState(false);
  const [createModalActualizarParcialCuatro, setCreateModalActualizarParcialCuatro] = useState(false);
  const [createModalEliminarParcialCuatro, setCreateModalEliminarParcialCuatro] = useState(false);
  const [parcialCuatroActual, setParcialCuatroActual] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const nuevoParcialCuatro = usePostFetch(`${API_BASE_URL}InsertarParcialCuatro`);
  const actualizarParcialCuatro = usePutFetch(`${API_BASE_URL}ActualizarParcialCuatro`);
  const eliminarParcialCuatro = useDeleteFetch(`${API_BASE_URL}EliminarParcialCuatro?idParcial=`);

  const { data: alumno, isLoading: isLoadingAlumno} = useFetch(`${API_BASE_URL}../Alumnos/ObtenerAlumnosFiltro`);
  const { data: materia, isLoading: isLoadingMateria} = useFetch(`${API_BASE_URL}../Materias/ObtenerMaterias`);

  const handleCreateShowActualizarParcialCuatro = (parcialCuatroId) => {
    const parcialCuatro = data.model.find((parcialCuatro) => parcialCuatro.idParcial === parcialCuatroId);
    setParcialCuatroActual(parcialCuatro);
    setCreateModalActualizarParcialCuatro(true);
  };

  const handleCreateShowNuevoParcialCuatro = () => setCreateModalNuevoParcialCuatro(true);

  const handleCreateShowEliminarParcialCuatro = (parcialCuatroId) => {
    const parcialCuatro = data.model.find((parcialCuatro) => parcialCuatro.idParcial === parcialCuatroId);
    console.log('ParcialCuatro actual:', parcialCuatro);
    setParcialCuatroActual(parcialCuatro);
    setCreateModalEliminarParcialCuatro(true);
  };

  const handleCreateHide = () => {
    setCreateModalActualizarParcialCuatro(false);
    setParcialCuatroActual(null);
    setCreateModalNuevoParcialCuatro(false);
    setCreateModalEliminarParcialCuatro(false);
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

  const handleSubmitNuevoParcialCuatro = (event) => {
    event.preventDefault();
    const payload = {
      idAlumno: event.target.createAlumno.value,
      idMateria: event.target.createMateria.value,
      calificacion: event.target.createCalificacion.value
    };

    nuevoParcialCuatro.executePost(payload);
    handleCreateHide();
    showSwal('Parcial guardado exitosamente');
  };

  const handleSubmitActualizarParcialCuatro = (event) => {
    event.preventDefault();
    const payload = {
      idParcial: event.target.updateParcial.value,
      idAlumno: event.target.updateAlumno.value,
      idMateria: event.target.updateMateria.value,
      calificacion: event.target.updateCalificacion.value
    };

    actualizarParcialCuatro.executePut(payload);
    handleCreateHide();
    showSwal('Parcial actualizado exitosamente');
  };

  const handleEliminarParcialCuatro = (event) => {
    event.preventDefault();
    if (parcialCuatroActual && parcialCuatroActual.idParcial) {
      console.log('ID del parcialCuatro a eliminar:', parcialCuatroActual.idParcial);
      eliminarParcialCuatro.executeDelete(parcialCuatroActual.idParcial);
      showSwal('Parcial eliminado exitosamente');
      handleCreateHide();
    } else {
      console.error('No se puede eliminar el parcialCuatro porque parcialCuatroActual es null.');
    }
  };

  return (
    <div className="container text-center">
      {error && <h2 className="text-center">Error: {error}</h2>}
      {isLoading && <h2 className="text-center">Loading...</h2>}

      <h1 className="m-3">Parcial Cuatro</h1>
      <hr />

      <div className="d-flex justify-content-evenly my-3 mx-5">
        <input
          type="text"
          placeholder="Buscador"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control form-control-sm me-4"
        />

        <button className="btn btn-primary btn-block" onClick={handleCreateShowNuevoParcialCuatro}>
          Agregar 
        </button>
      </div>

      {/* -------------------Tabla para visualizar la lista de parcialCuatro------------------------ */}
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
              .filter((parcialCuatro) => {
                return (
                  parcialCuatro.alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  parcialCuatro.alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  parcialCuatro.materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((parcialCuatro) => (
                <tr key={parcialCuatro.idParcial}>
                  <td>{parcialCuatro.idParcial}</td>
                  <td>{parcialCuatro.alumno.nombre} {parcialCuatro.alumno.apellido}</td>
                  <td>{parcialCuatro.materia.nombre}</td>
                  <td>{parcialCuatro.calificacion}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => handleCreateShowActualizarParcialCuatro(parcialCuatro.idParcial)}
                    >
                      <FaEdit className="button-design" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleCreateShowEliminarParcialCuatro(parcialCuatro.idParcial)}
                    >
                      <MdDeleteForever className="button-design" />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {/* ---------------------------Modal para agregar un nuevo parcial------------------------------------ */}
      <Modal show={createModalNuevoParcialCuatro} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Parcial</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='createStudent' onSubmit={handleSubmitNuevoParcialCuatro}>
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
      <Modal show={createModalActualizarParcialCuatro} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Parcial</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='actualizarAlumno' onSubmit={handleSubmitActualizarParcialCuatro}>
            {parcialCuatroActual && (
              <div className="row mb-3">
                <div className="col-sm-12 col-md-6">
                  <label>Id</label>
                  <input id='updateParcial' type="text" className="form-control" name="id" defaultValue={parcialCuatroActual.idParcial} readOnly disabled/>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Alumno</label>
                  <select id='updateAlumno' className="form-control" name="alumno" defaultValue={parcialCuatroActual.idAlumno}>
                    {alumno && !isLoadingAlumno && alumno.model.map((alumnos) => (
                      <option key={alumnos.idAlumno} value={alumnos.idAlumno}>{alumnos.nombre} {alumnos.apellido}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Materia</label>
                  <select id='updateMateria' className="form-control" name="materia" defaultValue={parcialCuatroActual.idMateria}>
                    {materia && !isLoadingMateria && materia.model.map((materias) => (
                      <option key={materias.idMateria} value={materias.idMateria}>{materias.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Calificación</label>
                  <input id='updateCalificacion' type="text" className="form-control" name="calificacion" defaultValue={parcialCuatroActual.calificacion} required />
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
      <Modal show={createModalEliminarParcialCuatro} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Parcial</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {parcialCuatroActual && (
            <div className='p-4'>
              <span className='text-center text-danger'>¿Estás seguro que lo deseas eliminar?</span>
            </div>
          )}
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-danger mx-2" onClick={handleCreateHide}>
              Cancelar
            </button>
            <button id='DeleteId' type="submit" className="btn btn-primary" onClick={handleEliminarParcialCuatro}>
              Aceptar
            </button>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}

export default ParcialCuatro