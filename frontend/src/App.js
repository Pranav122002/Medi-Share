import logo from "./logo.svg";
import React, { createContext, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Homepage from "./components/Homepage";
import Profie from "./screens/Profie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Createpost from "./screens/Createpost";
import Request from "./screens/Request";
import Donate from "./screens/Donate";
import { LoginContext } from "./context/LoginContext";
import Modal from "./components/Modal";
import UserProfie from "./components/UserProfile";
import MyFolliwngPost from "./screens/MyFollowingPost";
import Chat from "./pages/Chat";
import  Addmedicine from "./screens/Addmedicine";

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider value={{ setUserLogin, setModalOpen }}>
          <Navbar login={userLogin} />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/homepage" element={<Homepage />}></Route>
            <Route path="/messenger" element={<Chat />} />
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/request" element={<Request />}></Route>
            <Route path="/donate" element={<Donate />}></Route>
            <Route exact path="/profile" element={<Profie />}></Route>
            <Route path="/createPost" element={<Createpost />}></Route>
            <Route path="/profile/:userid" element={<UserProfie />}></Route>
            <Route path="/followingpost" element={<MyFolliwngPost />}></Route>
            <Route path="/Addmedicine" element={<Addmedicine/>}></Route>
          </Routes>
          <ToastContainer theme="dark" />

          {modalOpen && <Modal setModalOpen={setModalOpen}></Modal>}
        </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
