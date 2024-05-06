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

const API_BASE_URL = 'https://apitraineecolegio1.azurewebsites.net/Colegio/api/ParcialTres/';

const ParcialTres = () => {

  const { data, isLoading, error } = useFetch(`${API_BASE_URL}ObtenerParcialTresExtend`);
  const [createModalNuevoParcialTres, setCreateModalNuevoParcialTres] = useState(false);
  const [createModalActualizarParcialTres, setCreateModalActualizarParcialTres] = useState(false);
  const [createModalEliminarParcialTres, setCreateModalEliminarParcialTres] = useState(false);
  const [parcialTresActual, setParcialTresActual] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const nuevoParcialTres = usePostFetch(`${API_BASE_URL}InsertarParcialTres`);
  const actualizarParcialTres = usePutFetch(`${API_BASE_URL}ActualizarParcialTres`);
  const eliminarParcialTres = useDeleteFetch(`${API_BASE_URL}EliminarParcialTres?idParcial=`);

  const { data: alumno, isLoading: isLoadingAlumno} = useFetch(`${API_BASE_URL}../Alumnos/ObtenerAlumnosFiltro`);
  const { data: materia, isLoading: isLoadingMateria} = useFetch(`${API_BASE_URL}../Materias/ObtenerMaterias`);

  const handleCreateShowActualizarParcialTres = (parcialTresId) => {
    const parcialTres = data.model.find((parcialTres) => parcialTres.idParcial === parcialTresId);
    setParcialTresActual(parcialTres);
    setCreateModalActualizarParcialTres(true);
  };

  const handleCreateShowNuevoParcialTres = () => setCreateModalNuevoParcialTres(true);

  const handleCreateShowEliminarParcialTres = (parcialTresId) => {
    const parcialTres = data.model.find((parcialTres) => parcialTres.idParcial === parcialTresId);
    console.log('ParcialTres actual:', parcialTres);
    setParcialTresActual(parcialTres);
    setCreateModalEliminarParcialTres(true);
  };

  const handleCreateHide = () => {
    setCreateModalActualizarParcialTres(false);
    setParcialTresActual(null);
    setCreateModalNuevoParcialTres(false);
    setCreateModalEliminarParcialTres(false);
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

  const handleSubmitNuevoParcialTres = (event) => {
    event.preventDefault();
    const payload = {
      idAlumno: event.target.createAlumno.value,
      idMateria: event.target.createMateria.value,
      calificacion: event.target.createCalificacion.value
    };

    nuevoParcialTres.executePost(payload);
    handleCreateHide();
    showSwal('Parcial guardado exitosamente');
  };

  const handleSubmitActualizarParcialTres = (event) => {
    event.preventDefault();
    const payload = {
      idParcial: event.target.updateParcial.value,
      idAlumno: event.target.updateAlumno.value,
      idMateria: event.target.updateMateria.value,
      calificacion: event.target.updateCalificacion.value
    };

    actualizarParcialTres.executePut(payload);
    handleCreateHide();
    showSwal('Parcial actualizado exitosamente');
  };

  const handleEliminarParcialTres = (event) => {
    event.preventDefault();
    if (parcialTresActual && parcialTresActual.idParcial) {
      console.log('ID del parcialTres a eliminar:', parcialTresActual.idParcial);
      eliminarParcialTres.executeDelete(parcialTresActual.idParcial);
      showSwal('Parcial eliminado exitosamente');
      handleCreateHide();
    } else {
      console.error('No se puede eliminar el parcialTres porque parcialTresActual es null.');
    }
  };

  return (
    <div className="container text-center">
      {error && <h2 className="text-center">Error: {error}</h2>}
      {isLoading && <h2 className="text-center">Loading...</h2>}

      <h1 className="m-3">Parcial Tres</h1>
      <hr />

      <div className="d-flex justify-content-evenly my-3 mx-5">
        <input
          type="text"
          placeholder="Buscador"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control form-control-sm me-4"
        />

        <button className="btn btn-primary btn-block" onClick={handleCreateShowNuevoParcialTres}>
          Agregar 
        </button>
      </div>

      {/* -------------------Tabla para visualizar la lista de parcialTres------------------------ */}
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
              .filter((parcialTres) => {
                return (
                  parcialTres.alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  parcialTres.alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  parcialTres.materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((parcialTres) => (
                <tr key={parcialTres.idParcial}>
                  <td>{parcialTres.idParcial}</td>
                  <td>{parcialTres.alumno.nombre} {parcialTres.alumno.apellido}</td>
                  <td>{parcialTres.materia.nombre}</td>
                  <td>{parcialTres.calificacion}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => handleCreateShowActualizarParcialTres(parcialTres.idParcial)}
                    >
                      <FaEdit className="button-design" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleCreateShowEliminarParcialTres(parcialTres.idParcial)}
                    >
                      <MdDeleteForever className="button-design" />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {/* --------------------------------Modal para agregar un nuevo parcial------------------------------------ */}
      <Modal show={createModalNuevoParcialTres} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Parcial</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='createStudent' onSubmit={handleSubmitNuevoParcialTres}>
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
      <Modal show={createModalActualizarParcialTres} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Parcial</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='actualizarAlumno' onSubmit={handleSubmitActualizarParcialTres}>
            {parcialTresActual && (
              <div className="row mb-3">
                <div className="col-sm-12 col-md-6">
                  <label>Id</label>
                  <input id='updateParcial' type="text" className="form-control" name="id" defaultValue={parcialTresActual.idParcial} readOnly disabled/>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Alumno</label>
                  <select id='updateAlumno' className="form-control" name="alumno" defaultValue={parcialTresActual.idAlumno}>
                    {alumno && !isLoadingAlumno && alumno.model.map((alumnos) => (
                      <option key={alumnos.idAlumno} value={alumnos.idAlumno}>{alumnos.nombre} {alumnos.apellido}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Materia</label>
                  <select id='updateMateria' className="form-control" name="materia" defaultValue={parcialTresActual.idMateria}>
                    {materia && !isLoadingMateria && materia.model.map((materias) => (
                      <option key={materias.idMateria} value={materias.idMateria}>{materias.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Calificación</label>
                  <input id='updateCalificacion' type="text" className="form-control" name="calificacion" defaultValue={parcialTresActual.calificacion} required />
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
      <Modal show={createModalEliminarParcialTres} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Parcial</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {parcialTresActual && (
            <div className='p-4'>
              <span className='text-center text-danger'>¿Estás seguro que lo deseas eliminar?</span>
            </div>
          )}
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-danger mx-2" onClick={handleCreateHide}>
              Cancelar
            </button>
            <button id='DeleteId' type="submit" className="btn btn-primary" onClick={handleEliminarParcialTres}>
              Aceptar
            </button>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}

export default ParcialTres