import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Alumnos from "./components/Alumnos/Alumnos";
import Carrera from "./components/Carrera/Carrera"
import Docentes from "./components/Docentes/Docentes"
import Materias from "./components/Materias/Materias"
import ParcialUno from "./components/ParcialUno/ParcialUno"
import ParcialDos from "./components/ParcialDos/ParcialDos"
import ParcialTres from "./components/ParcialTres/ParcialTres"
import ParcialCuatro from "./components/ParcialCuatro/ParcialCuatro";
import Login from "./components/Login/Login";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route element={<PrivateRoute redirectPath="/"/>}>
            <Route path="/alumnos" element={<Dashboard><Alumnos /></Dashboard>}/>
          </Route>

          <Route element={<PrivateRoute redirectPath="/"/>}>
            <Route path="/carrera" element={<Dashboard><Carrera /></Dashboard>}/>
          </Route>

          <Route element={<PrivateRoute redirectPath="/"/>}>
            <Route path="/docentes" element={<Dashboard><Docentes /></Dashboard>}/>
          </Route >

          <Route element={<PrivateRoute redirectPath="/"/>}>
            <Route path="/materias" element={<Dashboard><Materias /></Dashboard>}/>
          </Route >

          <Route element={<PrivateRoute redirectPath="/"/>}>
            <Route path="/parcialUno" element={<Dashboard><ParcialUno /></Dashboard>}/>
          </Route >

          <Route element={<PrivateRoute redirectPath="/"/>}>
            <Route path="/parcialDos" element={<Dashboard><ParcialDos /></Dashboard>}/>
          </Route >

          <Route element={<PrivateRoute redirectPath="/"/>}>
            <Route path="/parcialTres" element={<Dashboard><ParcialTres /></Dashboard>}/>
          </Route >

          <Route element={<PrivateRoute redirectPath="/"/>}>
            <Route path="/parcialCuatro" element={<Dashboard><ParcialCuatro /></Dashboard>}/>
          </Route>

        </Routes>    
      </BrowserRouter>
      
    </>
  );
}

export default App;
