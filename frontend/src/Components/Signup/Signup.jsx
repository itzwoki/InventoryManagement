import { useState } from "react";
import { useForm } from "react-hook-form";
import api from '../api';
import { TextField, Button, Alert, Box, Container, Grid, Typography, InputAdornment, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { AccountCircle, Email, Lock } from '@mui/icons-material';

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        setError(false);
        setMessage('');

        try {
            const response = await api.post('/signup', data);
            setMessage(response.data.message);
            setError(false);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error occurred during signup');
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 4,
                borderRadius: 2,
                boxShadow: 6,
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                width: '100%',
                maxWidth: 400,
            }}>
                <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 600, color: '#1976d2' }}>
                    Create Your Account
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        {...register('username', { required: 'Username is required', minLength: { value: 4, message: 'Username must be at least 4 characters.' } })}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ marginBottom: 2 }}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        {...register('email', { 
                            required: 'Email is required', 
                            pattern: { value: /\S+@\S+\.\S+/, message: 'Please enter a valid email address.' } 
                        })}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ marginBottom: 2 }}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        {...register('password', { 
                            required: 'Password is required', 
                            minLength: { value: 6, message: 'Password must be at least 6 characters.' } 
                        })}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ marginBottom: 2 }}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            marginTop: 2,
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#1565c0' },
                            padding: '10px',
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
                    </Button>
                </form>

                {message && (
                    <Box sx={{ width: '100%', marginTop: 2 }}>
                        <Alert severity={error ? 'error' : 'success'}>{message}</Alert>
                    </Box>
                )}

                <Grid container justifyContent="flex-end" sx={{ marginTop: 3 }}>
                    <Button
                        component={Link}
                        to="/login"
                        variant="text"
                        sx={{
                            color: '#1976d2',
                            '&:hover': { color: '#1565c0' },
                        }}
                    >
                        Already have an account? Login
                    </Button>
                </Grid>
            </Box>
        </Container>
    );
};

export default Signup;
