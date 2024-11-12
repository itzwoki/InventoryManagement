import { useState } from "react";
import api from '../api';
import { TextField, Button, Alert, Box, Container, Grid, Typography, InputAdornment, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { AccountCircle, Email, Lock } from '@mui/icons-material';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateInputs = () => {
        if (!username || username.length < 3) {
            setMessage("Username must be at least 3 characters.");
            return false;
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setMessage("Please enter a valid email address.");
            return false;
        }
        if (!password || password.length < 6) {
            setMessage("Password must be at least 6 characters.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            setError(true);
            return;
        }

        setLoading(true);
        setError(false);
        setMessage('');

        const userData = { username, email, password };

        try {
            const response = await api.post('/signup', userData);
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

                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ marginBottom: 2 }}
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
