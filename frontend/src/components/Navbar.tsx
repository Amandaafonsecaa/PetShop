import React from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/icons/logo-pet.png";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="logo">
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <img
            src={logo}
            alt="VetCare Logo"
            style={{ height: "30px", marginRight: "10px" }}
          />
          <p style={{ margin: 0 }}>VetCare</p>
        </Link>
      </div>
      <div className="navbar-text">
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/consultas"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Consultas
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/animais"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Animais
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/funcionarios"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Funcionários
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tutores"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Tutores
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
