import { HashRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Alumnos from "./components/Alumnos/Alumnos";
import Carrera from "./components/Carrera/Carrera"
import Docentes from "./components/Docentes/Docentes"
import Materias from "./components/Materias/Materias"
import ParcialUno from "./components/ParcialUno/ParcialUno"
import ParcialDos from "./components/ParcialDos/ParcialDos"
import ParcialTres from "./components/ParcialTres/ParcialTres"
import ParcialCuatro from "./components/ParcialCuatro/ParcialCuatro";

function App() {
  return (
    <>
        <HashRouter>
          <Routes>
          <Route path="/" element={<Dashboard><Alumnos /></Dashboard>}></Route>
          <Route path="/carrera" element={<Dashboard><Carrera /></Dashboard>}></Route>
          <Route path="/docentes" element={<Dashboard><Docentes /></Dashboard>}></Route>
          <Route path="/materias" element={<Dashboard><Materias /></Dashboard>}></Route>
          <Route path="/parcialUno" element={<Dashboard><ParcialUno /></Dashboard>}></Route>
          <Route path="/parcialDos" element={<Dashboard><ParcialDos /></Dashboard>}></Route>
          <Route path="/parcialTres" element={<Dashboard><ParcialTres /></Dashboard>}></Route>
          <Route path="/parcialCuatro" element={<Dashboard><ParcialCuatro /></Dashboard>}></Route>
          </Routes>    
        </HashRouter>
      
    </>
  );
}

export default App;
