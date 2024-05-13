import React, { useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { usePostFetch } from '../../hooks/usePostFetch';
import './Login.css';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { data: roles, isLoading: isLoadingRoles } = useFetch('http://localhost:5155/Colegio/api/Roles/ObtenerRoles');
    const { data, executePost } = usePostFetch('http://localhost:5155/Colegio/api/Usuarios/IniciarSesion');
    const { storedValue: token, setValue: setToken } = useLocalStorage('token');
    const { storedValue:idRol ,setValue: setIdRol } = useLocalStorage('idRol');
    const navigate = useNavigate();

    const handleSubmitLogin = (event) => {
        event.preventDefault();
        const payload = {
          usuario: event.target.createUsuario.value,
          contraseña: event.target.createContrasena.value,
          idRol: event.target.createIdRol.value
        };
        executePost(payload);
        setIdRol(event.target.createIdRol.value);
    };

    useEffect(() => {
        if (token && (idRol === '1' || idRol === '3')) {
            navigate('/alumnos');
        }
        if (token && ( idRol === '2')) {
            navigate('/parcialUno');
        }
    }, [token, navigate, idRol]);
    
    useEffect(() => {
        if (data && data.model) {
            setToken(data.model);
        }
    }, [data, setToken, navigate]);
 
    return (
        <div className="contenedor-login">
            <div className='formulario'>
                <h1>Inicio de sesión</h1>
                <form id='createStudent' onSubmit={handleSubmitLogin}>
                    <div className="row mb-3">
                        <div className="col-sm-12 col-md-12">
                            <label>Usuario</label>
                            <input id='createUsuario' type="text" className="form-control" required />
                        </div>
                        <div className="input col-sm-12 col-md-12">
                            <label>Contraseña</label>
                            <input id='createContrasena' type="password" className="form-control" required />
                        </div>
                        <div className="col-sm-12 col-md-12">
                            <label>Rol</label>
                            <select id='createIdRol' className="form-control">
                                {roles && !isLoadingRoles && roles.model.map((rol) => (
                                    <option key={rol.idRol} value={rol.idRol}>{rol.rol}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary">
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
