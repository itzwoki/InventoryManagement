import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, TextField, Grid, Typography, CircularProgress, Box, Alert } from '@mui/material';
import api from '../api';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount] = useState(1000); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [cardType, setCardType] = useState('');


  const handleCardTypeChange = (e) => {
    setCardType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await api.post('/create-payment-intent', { amount });
      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message || 'An error occurred during the payment process.');
        setPaymentStatus('failed');
      } else if (result.paymentIntent.status === 'succeeded') {
        setPaymentStatus('succeeded');
        alert('Payment successful!');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'Something went wrong. Please try again later.');
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
            <Typography variant="body1" style={styles.label}>Select Card Type</Typography>
            <TextField
              select
              fullWidth
              variant="outlined"
              SelectProps={{ native: true }}
              value={cardType}
              onChange={handleCardTypeChange}
              style={styles.select}
            >
              <option value="">Select Card</option>
              <option value="Visa">Visa</option>
              <option value="MasterCard">MasterCard</option>
              <option value="AmericanExpress">American Express</option>
              <option value="Discover">Discover</option>
            </TextField>
          </Grid>

         
          <Grid item xs={12}>
            <Typography variant="body1" style={styles.label}>Card Number</Typography>
            <CardElement options={cardElementOptions} style={styles.cardElement} />
          </Grid>

        
        </Grid>

        
        {errorMessage && <Alert severity="error" style={styles.alert}>{errorMessage}</Alert>}
        {paymentStatus === 'succeeded' && <Alert severity="success" style={styles.alert}>Payment Successful! Thank you for your purchase.</Alert>}
        {paymentStatus === 'failed' && <Alert severity="error" style={styles.alert}>Payment Failed! Please try again or check your card details.</Alert>}

        
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
    boxSizing: 'border-box',
  },
  form: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    minWidth: '300px',
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
  select: {
    marginBottom: '20px',
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
  cardElement: {
    height: '40px',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    width: '100%',
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