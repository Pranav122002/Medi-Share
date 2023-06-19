import React, { createContext, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Donate from "./components/Donate";
import Request from "./components/Request";
import Orders from "./components/Orders";
import Medicines from "./components/Medicines";
import Volunteer from "./components/Volunteer";
import Chats from "./components/Chats";
import PersonalChat from "./components/PersonalChat";
import CommunityChat from "./components/CommunityChat";
import Profile from "./components/Profile";
import Hospitals from "./components/Hospitals";
import Search from "./components/Search";
import Appointments from "./components/Appointments";
import Annoucement from "./components/Annoucement";
import DiseasePredictions from "./components/DiseasePredictions";
import Braintumor from "./components/brainTumor";
import HeartDisease from "./components/heartDisease";
import Navbar from "./components/Navbar";
import Hnavbar from "./components/Hnavbar";
import Pneumonia from "./components/Pneumonia";
import {LandingPage} from "./components/LandingPage";
import Tasks from "./components/Tasks";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Users from "./components/Users";
import Analytics from "./components/Analytics";
import Subscribe from "./components/Subscribe";
import UserProfile from "./components/UserProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AboutUs } from "./components/AboutUs";
import { UserProvider } from './components/UserContext';

function App() {
  return (
    <UserProvider>

    <BrowserRouter>
      <div className="App">
      <Navbar />
      <Hnavbar />
        <Routes>
          <Route path="/" element={<LandingPage/>}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/analytics" element={<Analytics />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/donate-medicines" element={<Donate />}></Route>
          <Route path="/request-medicines" element={<Request />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
          <Route path="/medicines" element={<Medicines />}></Route>
          <Route path="/tasks" element={<Tasks />}></Route>
          <Route path="/disease-predictions" element={<DiseasePredictions />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          {/* <Route path="/user/:id" element={<UserProfile />}></Route> */}
          <Route path="/user" element={<UserProfile  />} />
          <Route path="/users" element={<Users />}></Route>

          <Route path="/volunteer" element={<Volunteer />}></Route>
          <Route path="/chats" element={<Chats />}></Route>
          <Route path="/appointments" element={<Appointments />}></Route>
          <Route path="/personal-chat" element={<PersonalChat />}></Route>
          <Route path="/community-chat" element={<CommunityChat />}></Route>
          <Route path="/aboutus" element={<AboutUs/>}></Route>
          <Route path="/search-medicines" element={<Search />}></Route>
          <Route path="/annoucements" element={<Annoucement />}></Route>
          <Route path="/nearby-hospitals" element={<Hospitals/>}></Route>
          <Route path="/brainTumor" element={<Braintumor/>}></Route>
          <Route path="/Pneumonia" element={<Pneumonia/>}></Route>
          <Route path="/heartDisease" element={<HeartDisease/>}></Route>
          <Route path="/subscribe" element={<Subscribe/>}></Route>
        </Routes>
        <ToastContainer theme="light" />
      </div>
    </BrowserRouter>
    </UserProvider>

  );
}

export default App;
