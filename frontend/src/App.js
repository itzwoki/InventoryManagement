import React from 'react';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import ProductList from './Components/ProductList/ProductList';
import PaymentForm from './Components/PaymentForm/PaymentForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_test_51QJrHZP1C72ef29Y7hPEA4isOmKZle1UkR6yvA8vLsWcUIWU6R1q2ITJq0LOL06GnTJkfXMCh54Ydfn4qovSUXsN009KZrEDdR');

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ProductList" element={<ProductList />} />
          <Route path="/payment" element={<PaymentForm />} /> 
        </Routes>
      </Router>
    </Elements>
  );
}

export default App;
