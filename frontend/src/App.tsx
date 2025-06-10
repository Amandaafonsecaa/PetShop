import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Consultas from "./pages/Consultas";
import Funcionarios from "./pages/Funcionarios";
import Tutores from "./pages/Tutores";
import Animais from "./pages/Animais";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/animais" element={<Animais />} />
      <Route path="/consultas" element={<Consultas />} />
      <Route path="/tutores" element={<Tutores />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
    </Routes>
  );
}

export default App;
