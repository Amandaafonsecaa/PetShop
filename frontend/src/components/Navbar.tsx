import React from "react";
import { NavLink } from "react-router-dom";
import logo from '../assets/icons/logo-pet.png'
import './Navbar.css'

export default function Navbar(){
    return (
        <div className="navbar">
            <div className="logo">
            <img src={logo} alt="" />
            <p>VetCare</p>
            </div>
            <div className="navbar-text">
                <ul>
                <li><a href="">Dashboard</a></li>
                    <li><a href="">Consultas</a></li>
                    <li><a href="">Animais</a></li>
                    <li><a href="">Funcionários</a></li>
                    <li><a href="">Tutores</a></li>
                </ul>
            </div>
        </div>
    );
}