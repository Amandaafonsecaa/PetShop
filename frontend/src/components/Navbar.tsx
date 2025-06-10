import React from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/icons/logo-pet.png";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="VetCare Logo" />
          <p>VetCare</p>
        </Link>
      </div>
      <div className="navbar-text">
        <ul>
          <li>
            <NavLink to="/" end>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/consultas">
              Consultas
            </NavLink>
          </li>
          <li>
            <NavLink to="/animais">
              Animais
            </NavLink>
          </li>
          <li>
            <NavLink to="/tutores">
              Tutores
            </NavLink>
          </li>
          <li>
            <NavLink to="/funcionarios">
              Funcionários
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
