import { Route, Routes } from "react-router-dom";
import "./App.css";
import Map from "./components/map/Map";
// import Header from './components/header/Header';
import Navbar from "./components/navbar/Navbar";
import Login from "./components/Login/Login";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
