import React from 'react';
import Signup from './Signup';
import Login from './Login';
// import Home from './Home';
//import CreateProductForm from './CreateProductForm';
import ProductList from './ProductList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
      <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/ProductList" element={<ProductList/>} />
      </Routes>
    
  </Router>
    );
}

export default App;
