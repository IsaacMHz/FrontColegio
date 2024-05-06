import React, { useState } from 'react';
import './Alumnos.css';
import { useFetch } from '../../hooks/useFetch';
import { MdDeleteForever } from 'react-icons/md';
import { FechaCorrecta } from '../../functions/FechaCorrecta';
import { FaEdit } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { usePostFetch } from '../../hooks/usePostFetch';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { usePutFetch } from '../../hooks/usePutFetch';
import { useDeleteFetch } from '../../hooks/useDeleteFetch';

const API_BASE_URL = 'https://apitraineecolegio1.azurewebsites.net/Colegio/api/Alumnos/';

const Alumnos = () => {
  const { data, isLoading, error } = useFetch(`${API_BASE_URL}ObtenerAlumnosFiltro`);
  const [createModalNuevoAlumno, setCreateModalNuevoAlumno] = useState(false);
  const [createModalActualizarAlumno, setCreateModalActualizarAlumno] = useState(false);
  const [createModalEliminarAlumno, setCreateModalEliminarAlumno] = useState(false);
  const [alumnoActual, setAlumnoActual] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const nuevoAlumno = usePostFetch(`${API_BASE_URL}AgregarAlumnos`);
  const actualizarAlumno = usePutFetch(`${API_BASE_URL}ActualizarAlumnos`);
  const eliminarAlumno = useDeleteFetch(`${API_BASE_URL}EliminarAlumnos?idAlumno=`);

  const { data: carrera, isLoading: isLoadingCarrera} = useFetch(`${API_BASE_URL}../Carrera/ObtenerCarrera`);

  const handleCreateShowActualizarAlumno = (alumnoId) => {
    const alumno = data.model.find((alumno) => alumno.idAlumno === alumnoId);
    setAlumnoActual(alumno);
    setCreateModalActualizarAlumno(true);
  };

  const handleCreateShowNuevoAlumno = () => setCreateModalNuevoAlumno(true);

  const handleCreateShowEliminarAlumno = (alumnoId) => {
    const alumno = data.model.find((alumno) => alumno.idAlumno === alumnoId);
    console.log('Alumno actual:', alumno);
    setAlumnoActual(alumno);
    setCreateModalEliminarAlumno(true);
  };

  const handleCreateHide = () => {
    setCreateModalActualizarAlumno(false);
    setAlumnoActual(null);
    setCreateModalNuevoAlumno(false);
    setCreateModalEliminarAlumno(false);
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

  const handleSubmitNuevoAlumno = (event) => {
    event.preventDefault();
    const payload = {
      nombre: event.target.createNombre.value,
      apellido: event.target.createApellido.value,
      f_Nacimiento: event.target.createFNacimiento.value,
      idCarrera: event.target.createCarrera.value,
      telefono: event.target.createTelefono.value
    };

    nuevoAlumno.executePost(payload);
    handleCreateHide();
    showSwal('Alumno guardado exitosamente');
  };

  const handleSubmitActualizarAlumno = (event) => {
    event.preventDefault();
    const payload = {
      idAlumno: event.target.updateId.value,
      nombre: event.target.updateNombre.value,
      apellido: event.target.updateApellido.value,
      f_Nacimiento: event.target.updateFNacimiento.value,
      idCarrera: event.target.updateCarrera.value,
      telefono: event.target.updateTelefono.value
    };

    actualizarAlumno.executePut(payload);
    handleCreateHide();
    showSwal('Alumno actualizado exitosamente');
  };

  const handleEliminarAlumno = (event) => {
    event.preventDefault();
    if (alumnoActual && alumnoActual.idAlumno) {
      console.log('ID del alumno a eliminar:', alumnoActual.idAlumno);
      eliminarAlumno.executeDelete(alumnoActual.idAlumno);
      showSwal('Alumno eliminado exitosamente');
      handleCreateHide();
    } else {
      console.error('No se puede eliminar el alumno porque alumnoActual es null.');
    }
  };

  return (
    <div className="container text-center">
      {error && <h2 className="text-center">Error: {error}</h2>}
      {isLoading && <h2 className="text-center">Loading...</h2>}

      <h1 className="m-3">Alumnos</h1>
      <hr />

      <div className="d-flex justify-content-evenly my-3 mx-5">
        <input
          type="text"
          placeholder="Buscador"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control form-control-sm me-4"
        />

        <button className="btn btn-primary btn-block" onClick={handleCreateShowNuevoAlumno}>
          Agregar 
        </button>
      </div>

      {/* -------------------Tabla para visualizar la lista de alumnos------------------------ */}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Fecha de Nacimiento</th>
            <th>Carrera</th>
            <th>Telefono</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data && data.model &&
            data.model
              .filter((alumno) => {
                return (
                  alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  alumno.f_Nacimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  alumno.carrera.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  alumno.telefono.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((alumno) => (
                <tr key={alumno.idAlumno}>
                  <td>{alumno.idAlumno}</td>
                  <td>{alumno.nombre}</td>
                  <td>{alumno.apellido}</td>
                  <td>{FechaCorrecta(alumno.f_Nacimiento)}</td>
                  <td>{alumno.carrera.nombre}</td>
                  <td>{alumno.telefono}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => handleCreateShowActualizarAlumno(alumno.idAlumno)}
                    >
                      <FaEdit className="button-design" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleCreateShowEliminarAlumno(alumno.idAlumno)}
                    >
                      <MdDeleteForever className="button-design" />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {/* --------------------------------Modal para agregar un nuevo alumno------------------------------------ */}
      <Modal show={createModalNuevoAlumno} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Alumno</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='createStudent' onSubmit={handleSubmitNuevoAlumno}>
            <div className="row mb-3">
              <div className="col-sm-12 col-md-6">
                <label>Nombre</label>
                <input id='createNombre' type="text" className="form-control" name="nombre" required />
              </div>
              <div className="col-sm-12 col-md-6">
                <label>Apellido</label>
                <input id='createApellido' type="text" className="form-control" name="apellido" required />
              </div>
              <div className="col-sm-12 col-md-6">
                <label>Fecha de Nacimiento</label>
                <input id='createFNacimiento' type="date" className="form-control" name="f_Nacimiento" required />
              </div>
              <div className="col-sm-12 col-md-6">
                <label>Carrera</label>
                <select id='createCarrera' className="form-control" name="carrera">
                  {carrera && !isLoadingCarrera && carrera.model.map((carreras) => (
                    <option key={carreras.idCarrera} value={carreras.idCarrera}>{carreras.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-sm-12 col-md-6">
                <label>Teléfono</label>
                <input id='createTelefono' type="text" className="form-control" name="telefono" required />
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

      {/* ---------------------------- Modal para editar a un alumno ---------------------------------- */}
      <Modal show={createModalActualizarAlumno} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Alumno</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='actualizarAlumno' onSubmit={handleSubmitActualizarAlumno}>
            {alumnoActual && (
              <div className="row mb-3">
                <div className="col-sm-12 col-md-6">
                  <label>Id</label>
                  <input id='updateId' type="text" className="form-control" name="id" defaultValue={alumnoActual.idAlumno} readOnly disabled/>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Nombre</label>
                  <input id='updateNombre' type="text" className="form-control" name="nombre" defaultValue={alumnoActual.nombre} required />
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Apellido</label>
                  <input id='updateApellido' type="text" className="form-control" name="apellido" defaultValue={alumnoActual.apellido} required />
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Fecha de Nacimiento</label>
                  <input id='updateFNacimiento' type="date" className="form-control" name="f_Nacimiento" defaultValue={FechaCorrecta(alumnoActual.f_Nacimiento)} required />
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Carrera</label>
                  <select id='updateCarrera' className="form-control" name="carrera" defaultValue={alumnoActual.carrera.nombre}>
                    {carrera && !isLoadingCarrera && carrera.model.map((carreras) => (
                      <option key={carreras.idCarrera} value={carreras.idCarrera}>{carreras.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-12 col-md-6">
                  <label>Teléfono</label>
                  <input id='updateTelefono' type="tel" className="form-control" name="telefono" defaultValue={alumnoActual.telefono} required />
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
      <Modal show={createModalEliminarAlumno} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar alumno</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {alumnoActual && (
            <div className='p-4'>
              <span className='text-center text-danger'>¿Estás seguro que lo deseas eliminar?</span>
            </div>
          )}
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-danger mx-2" onClick={handleCreateHide}>
              Cancelar
            </button>
            <button id='DeleteId' type="submit" className="btn btn-primary" onClick={handleEliminarAlumno}>
              Aceptar
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Alumnos;