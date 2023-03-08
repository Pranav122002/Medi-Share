import React, { createContext, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Donate from "./components/Donate";
import Request from "./components/Request";
import Medicines from "./components/Medicines";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
// import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/donate" element={<Donate />}></Route>
          <Route path="/request" element={<Request />}></Route>
          <Route path="/medicines" element={<Medicines />}></Route>
        </Routes>
        <ToastContainer theme="light" />
      </div>
    </BrowserRouter>
  );
}

export default App;
