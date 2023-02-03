import logo from "./logo.svg";
import React, { createContext, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import { Adminpage } from "./screens/Adminpage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "./context/LoginContext";
import Modal from "./components/Modal";
import Vol_Modal from "./components/Vol_Modal";
import { AdminRequest } from "./screens/AdminRequest";
import { AdminDonorList } from "./screens/AdminDonorList";


import Chat from "./pages/Chat";

import { Donatepage } from "./screens/Donatepage";
import  Request  from "./screens/Request";

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [volmodalOpen, setVolModalOpen] = useState(false);
  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider value={{ setUserLogin, setModalOpen }}>
          <Navbar login={userLogin} />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/request" element={<Request />}></Route>
            <Route path="/adminpage" element={<Adminpage/>}></Route>
            <Route path="/donatepage" element={<Donatepage/>}></Route>
            <Route path="/adminRequest" element={<AdminRequest/>}></Route>
            <Route path="/adminDonorList" element={<AdminDonorList/>}></Route>
          </Routes>
          <ToastContainer theme="dark" />

          {modalOpen && <Modal setModalOpen={setModalOpen}></Modal>}
          {volmodalOpen && <Vol_Modal setVolModalOpen={setVolModalOpen}></Vol_Modal>}
        </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
