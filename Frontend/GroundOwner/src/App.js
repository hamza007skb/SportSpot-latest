import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AuthPageOwnerSignUp from "./Components/AuthPageOwnerSignUp";
import AuthPageOwnerLogIn from "./Components/AuthPageOwnerLogIn";
import Reservations from "./Components/Reservations";
import RevenueGroundDetails from "./Components/RevenueGroundDetails";
import ViewProfile from "./Components/ViewProfile";
import GroundSelection from "./Components/GroundSelection";
import Ground from "./Components/Ground";
import Help from "./Components/Help";
import Map from "./Components/Map";

function App() {
  return (
    <>
      <Router>
        <div className="app-container">
          <header>
            <Navbar title="Sport Spot" />
            <AuthPageOwnerLogIn />
          </header>

          <main className="content">
            <Routes>
              <Route 
                path="/groundselection" 
                element={<GroundSelection />} 
              />
              <Route
               path="/reservations"
               element={<Reservations />}
              />
              <Route
                path="/authpageownersignup"
                element={<AuthPageOwnerSignUp />}
              />
              <Route
                path="/authpageownerlogin"
                element={<AuthPageOwnerLogIn />}
              />
              <Route
                path="/revenuegrounddetails"
                element={<RevenueGroundDetails />}
              />
              <Route
                path="/ground"
                element={<Ground />}
              />
              <Route path="/help" element={<Help />} />
              <Route path="/viewprofile" element={<ViewProfile />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
