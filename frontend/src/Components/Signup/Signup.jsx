import { useState } from "react";
import axios from 'axios';
import { TextField, Button, Alert, Box, Container, Grid, Typography, InputAdornment} from '@mui/material';
import { Link } from 'react-router-dom';
import { AccountCircle, Email, Lock } from '@mui/icons-material';
import './Signup.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { username, email, password };

        try {
            const response = await axios.post('http://127.0.0.1:8000/signup', userData);
            setMessage(response.data.message);
            setError(false);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Error Occurred During Signup');
            setError(true);
        }
    };

    return (
        <Container component="main" maxWidth="xs" className="signup-container">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
                <Typography variant="h4" className="signup-title" sx={{ marginBottom: 3, fontWeight: 600 }}>
                    Create Account
                </Typography>
                <form onSubmit={handleSubmit} className="signup-form" noValidate>
                    <TextField
                        className="signup-input"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        autoFocus
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        className="signup-input"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        className="signup-input"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        className="signup-button"
                        variant="contained"
                        fullWidth
                        sx={{ marginTop: 2, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
                    >
                        Sign Up
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
                        to="/login"
                        variant="text"
                        sx={{ color: '#1976d2', '&:hover': { color: '#1565c0' } }}
                    >
                        Already have an account? Login
                    </Button>
                </Grid>
            </Box>
        </Container>
    );
};

export default Signup;
