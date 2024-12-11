import React from "react";
import SearchBar from "./Searchbar";
import { Link } from "react-router-dom";
import logo_icon from "../Assets/logo.png";
import prof_icon from "../Assets/profilee.png";

export default function Navbar(props) {
  const ChangeAuthSign = () => {
    props.toggleAuthMode("SignUp");
  };

  const ChangeAuthLog = () => {
    props.toggleAuthMode("LogIn");
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img src={logo_icon} alt="Logo" />
          <h1>{props.title}</h1>
        </div>

        {window.location.pathname !== "/reservations" &&
        window.location.pathname !== "/revenue_ground_details" &&
        window.location.pathname !== "/help" &&
        window.location.pathname !== "/authpage" &&
        window.location.pathname !== "/authpage_owner" ? (
          <>
            <SearchBar />
          </>
        ) : null}

        {window.location.pathname === "/authpage" ||
        window.location.pathname === "/authpage_owner" ? (
          <>
            <div className="pages">
              <a href="/">Home</a>
              <a href="#contact">Contact</a>
            </div>
          </>
        ) : null}

        {window.location.pathname === "/reservations" ||
        window.location.pathname === "/revenue_ground_details" ||
        window.location.pathname === "/help" ? (
          <>
            <div className="pages">
              <a href="/reservations">Reservations</a>
              <a href="/revenue_ground_details">Ground Management</a>
              <a href="/help">Help</a>
            </div>
          </>
        ) : null}

        <div className="button-owner-auth">
          <div className="button-owner">
            <Link to="./reservations" className="btn-owner custom-css">
              Ground Owner
            </Link>
          </div>

          <div className="dropdown">
            <button
              className="dropdown btn-back"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img src={prof_icon} alt="" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end mt-2">
              <li>
                <div className="signup">
                  <Link
                    to="./authpage"
                    className="btn-sign"
                    onClick={ChangeAuthSign}
                  >
                    SignUp
                  </Link>
                </div>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <div className="logIn">
                  <Link
                    to="./authpage"
                    className="btn-log"
                    onClick={ChangeAuthLog}
                  >
                    Login
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
