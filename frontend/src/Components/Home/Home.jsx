import axios from "axios";
import { useEffect, useState } from "react";
import './Home/Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/users');
                if (response.data && Array.isArray(response.data.users)) {
                    setUsers(response.data.users);
                } else {
                    setError('Invalid response format');
                }
            } catch (err) {
                console.error(err);  
                setError('Failed to fetch Users');
            }
        };

        fetchUsers();
    }, []);

    
    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/users/${userId}`);
            setUsers(users.filter((user)=>user.id !== userId))
            alert('User Deleted')
        }

        catch(err){
            console.log(err);
            alert('Failed to Delete!')
        }
    }

    return (
        <div className="home-container">
            <h1 className="title">Current Users</h1>
            {error && <p className="error-message">{error}</p>}
            <ul className="user-list">
                {users.map((user) => (
                    <li key={user.id} className="user-item">
                        <span className="username">{user.username}</span> - <span className="email">{user.email}</span>
                        <button
                        className="delete-button"
                        onClick={() => handleDelete(user.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <h3> Api's | Signup - Singin - Logout - JwtTokens - Get Users - Delete</h3>
            <h3>Db Connection - basic queries</h3>
            <h3>Axios - Hooks - Material Ui</h3>
            
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <div>
            <button 
            className="test-button" 
            onClick={() => { 
            const url = 'https://mininyc.appexcenter.com'; 
            window.open(url, '_blank');
            }}>
            Route Test
            </button>
                </div>
        </div>
    );
}

export default Home;


