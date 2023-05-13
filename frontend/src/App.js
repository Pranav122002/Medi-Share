import React, { createContext, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Donate from "./components/Donate";
import Request from "./components/Request";
import Orders from "./components/Orders";
import Medicines from "./components/Medicines";
import Volunteer from "./components/Volunteer";
import Chat from "./components/Chat";
import Profile from "./components/Profile";
import Hospitals from "./components/Hospitals";
import Search from "./components/Search";
import Annoucement from "./components/Annoucement";
import DiseasePrediction from "./components/DiseasePrediction";

import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AboutUs } from "./components/AboutUs";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/donate-medicines" element={<Donate />}></Route>
          <Route path="/request-medicines" element={<Request />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
          <Route path="/medicines" element={<Medicines />}></Route>
          <Route path="/disease-predict" element={<DiseasePrediction />}></Route>
          
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/volunteer" element={<Volunteer />}></Route>
          <Route path="/chat" element={<Chat />}></Route>
          <Route path="/AboutUs" element={<AboutUs/>}></Route>
          <Route path="/search-medicines" element={<Search />}></Route>
          <Route path="/annoucements" element={<Annoucement />}></Route>
          
          <Route path="/nearby-hospitals" element={<Hospitals/>}></Route>
        </Routes>
        <ToastContainer theme="light" />
      </div>
    </BrowserRouter>
  );
}

export default App;
