import { useState } from "react";
import { useForm } from "react-hook-form";
import api from '../api';
import { TextField, Button, Alert, Box, Container, Grid, Typography, InputAdornment, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AccountCircle, Lock } from '@mui/icons-material';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setError(false);
        setMessage('');

        try {
            const response = await api.post('/login', data);
            const token = response.data.access_token;
            localStorage.setItem("token", token);
            setMessage("Login Successful!");
            setError(false);
            navigate('/ProductList');
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error occurred during login.');
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
                borderRadius: 3,
                boxShadow: 6,
                backgroundColor: '#fff',
                width: '100%',
                maxWidth: 400, 
            }}>
                <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 600, color: '#1976d2' }}>
                    Welcome Back
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        autoComplete="username"
                        autoFocus
                        variant="outlined"
                        {...register('username', { required: 'Username is required' })}
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
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        variant="outlined"
                        {...register('password', { required: 'Password is required' })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ marginBottom: 3 }}
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
                            padding: '12px',
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log In'}
                    </Button>
                </form>

                {message && (
                    <Box sx={{ width: '100%', marginTop: 2 }}>
                        <Alert severity={error ? 'error' : 'success'}>{message}</Alert>
                    </Box>
                )}

                <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
                    <Button
                        component={Link}
                        to="/"
                        variant="text"
                        sx={{
                            color: '#1976d2',
                            '&:hover': { color: '#1565c0' },
                            fontWeight: 500,
                        }}
                    >
                        Don’t have an account? Sign Up
                    </Button>
                </Grid>
            </Box>
        </Container>
    );
};

export default Login;
