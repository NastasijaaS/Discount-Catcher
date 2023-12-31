// import logo from './logo.svg';
// import './App.css';
import Home from "./Models/Home/Home.jsx";
import Navbar from "./Models/Navbar/Navbar.jsx";
import Login from "./Models/Login/Login.jsx";

// Za prelazak sa jedne strane na drugu:
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Register from "./Models/Register/Register.jsx";
import Product_list from "./Models/Product_list/Product_list.jsx";
import Stores from "./Models/Prodavnice/Stores.jsx";
import User_items from "./Models/User items/User_items.jsx";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' exact element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/proizvodi' element={<Product_list/> } />
          <Route path='/prodavnice' element={<Stores />} />
          <Route path='/my_products' element={<User_items />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
