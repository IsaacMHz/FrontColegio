import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import Modal from 'react-bootstrap/Modal';
import { usePostFetch } from '../../hooks/usePostFetch';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const API_BASE_URL = 'http://localhost:5155/Colegio/api/Usuarios/';

const Usuarios = () => {

    const { storedValue: token } = useLocalStorage('token');
    const { data, isLoading, error } = useFetch(`${API_BASE_URL}ObtenerUsuarios`, token);
    const [searchTerm, setSearchTerm] = useState('');
    const nuevoUsuario = usePostFetch(`${API_BASE_URL}AgregarUsuario`, token);
    const [createModalNuevoUsuario, setCreateModalNuevoUsuario] = useState(false);
    const { data: rol, isLoading: isLoadingRol} = useFetch(`${API_BASE_URL}../Roles/ObtenerRoles`);

    const handleCreateShowNuevoUsuario = () => setCreateModalNuevoUsuario(true);

    const handleCreateHide = () => {
        setCreateModalNuevoUsuario(false);
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
    
    const handleSubmitNuevoUsuario = (event) => {
        event.preventDefault();
        const payload = {
          usuario: event.target.createUsuario.value,
          contraseña: event.target.createContrasena.value,
          idRol: event.target.createRol.value
        };
        
        console.log("Datos a enviar:", payload);
        nuevoUsuario.executePost(payload);
        handleCreateHide();
        showSwal('Usuario guardado exitosamente');
    };

  return (
    <div className="container text-center">
        
        {error && <h2 className="text-center">Error: {error}</h2>}
        {isLoading && <h2 className="text-center">Loading...</h2>}

        
        <h1 className="m-3">Usuarios</h1>
        <hr />

        <div className="d-flex justify-content-evenly my-3 mx-5">
        <input
          type="text"
          placeholder="Buscador"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control form-control-sm me-4"
        />
            <button className="btn btn-primary btn-block" onClick={handleCreateShowNuevoUsuario}>
                Agregar 
            </button>
        </div>


        <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Usuario</th>
            <th>Rol</th>
          </tr>
        </thead>

        <tbody>
          {data && data.model &&
            data.model
              .filter((usuario) => {
                return (
                  usuario.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  usuario.roles.rol.toLowerCase().includes(searchTerm.toLowerCase()) 
                );
              })
              .map((usuario) => (
                <tr key={usuario.idUsuario}>
                  <td>{usuario.idUsuario}</td>
                  <td>{usuario.usuario}</td>
                  <td>{usuario.roles.rol}</td>
                </tr>
              ))}
        </tbody>
      </table>

       {/* --------------------------------Modal para agregar un nuevo usuario------------------------------------ */}
       <Modal show={createModalNuevoUsuario} onHide={handleCreateHide}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Usuario</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form id='createStudent' onSubmit={handleSubmitNuevoUsuario}>
            <div className="row mb-3">
              <div className="col-sm-12 col-md-6">
                <label>Usuario</label>
                <input id='createUsuario' type="text" className="form-control" name="usuario" required />
              </div>
              <div className="col-sm-12 col-md-6">
                <label>Contraseña</label>
                <input id='createContrasena' type="password" className="form-control" name="contrasena" required />
              </div>
              <div className="col-sm-12 col-md-6">
                <label>Rol</label>
                <select id='createRol' className="form-control" name="idRol">
                  {rol && !isLoadingRol && rol.model.map((roles) => (
                    <option key={roles.idRol} value={roles.idRol}>{roles.rol}</option>
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

    </div>
  )
}

export default Usuarios