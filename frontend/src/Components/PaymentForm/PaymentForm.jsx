import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, TextField, Grid, Typography, CircularProgress, Box, Alert } from '@mui/material';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(1000); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return; 
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      
      const response = await fetch('http://localhost:8000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret } = await response.json();

      
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
        setPaymentStatus('failed');
      } else if (result.paymentIntent.status === 'succeeded') {
        setPaymentStatus('succeeded');
        alert('Payment successful!');
      }

    } catch (error) {
      setErrorMessage(error.message);
      setPaymentStatus('failed');
    }

    setIsProcessing(false);
  };

  return (
    <Box sx={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <Typography variant="h5" style={styles.heading}>Payment Details</Typography>

        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" style={styles.label}>Card Number</Typography>
            <CardElement options={cardElementOptions} style={styles.cardElement} />
          </Grid>

          
          <Grid item xs={6}>
            <TextField 
              label="MM/YY" 
              placeholder="MM/YY" 
              fullWidth 
              variant="outlined" 
              style={styles.input} 
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              label="CVC" 
              placeholder="CVC" 
              fullWidth 
              variant="outlined" 
              style={styles.input} 
            />
          </Grid>
        </Grid>

        
        {errorMessage && <Alert severity="error" style={styles.alert}>{errorMessage}</Alert>}

        
        {paymentStatus === 'succeeded' && <Alert severity="success" style={styles.alert}>Payment Successful! Thank you for your purchase.</Alert>}
        {paymentStatus === 'failed' && <Alert severity="error" style={styles.alert}>Payment Failed! Please try again.</Alert>}

        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          disabled={!stripe || isProcessing}
          sx={styles.button}
        >
          {isProcessing ? <CircularProgress size={24} /> : `Pay $${(amount / 100).toFixed(2)}`}
        </Button>
      </form>
    </Box>
  );
};


const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  form: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
  },
  heading: {
    fontSize: '28px',
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  cardElement: {
    height: '40px',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    width: '100%',
  },
  input: {
    '& .MuiInputBase-root': {
      fontSize: '16px',
      padding: '12px',
      borderRadius: '5px',
    },
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '5px',
    marginTop: '20px',
  },
  alert: {
    marginBottom: '20px',
  },
};

const cardElementOptions = {
  style: {
    base: {
      color: '#333',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '24px',
      padding: '10px',
      backgroundColor: '#fafafa',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    invalid: {
      color: '#e74c3c',
    },
  },
};

export default PaymentForm;
