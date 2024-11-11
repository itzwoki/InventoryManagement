import { useState } from "react";
import axios from 'axios';
import { TextField, Button, Alert, Box,Grid, Container, Typography, InputAdornment } from '@mui/material'; 
import { Link } from 'react-router-dom';
import { AccountCircle, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { username, password };

        try {
            const response = await axios.post('http://127.0.0.1:8000/login', userData);
            const token = response.data.access_token;
            localStorage.setItem("token", token);
            setMessage("Login Successfull")
            setError(false);
            navigate('/ProductList');
        } catch (error) {
            console.log(error.response);
            setMessage(error.response?.data?.detail || 'Error Occurred During Login');
            setError(true);
        }
    };

    return (
        <Container component="main" maxWidth="xs" className="login-container">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3, borderRadius: 2, boxShadow: 5, backgroundColor: '#fff', border: '1px solid #ddd' }}>
                <Typography variant="h5" className="login-title" sx={{ marginBottom: 2, fontWeight: 600 }}>
                    Welcome Back
                </Typography>
                <form onSubmit={handleSubmit} className="login-form" noValidate>
                    <TextField
                        className="login-input"
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
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        className="login-input"
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
                        sx={{ marginBottom: 3 }}
                    />
                    <Button
                        type="submit"
                        className="login-button"
                        variant="contained"
                        fullWidth
                        sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' }, padding: '10px' }}
                    >
                        Log In
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
                        sx={{ color: '#1976d2', '&:hover': { color: '#1565c0' } }}
                    >
                        Click here to Signup!
                    </Button>
                </Grid>
            </Box>
        </Container>
    );
};

export default Login;
