import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    // curl http://127.0.0.1:8000/hello/ 'Authorization: Token 16281aad10dd5d13111c97f28f49ec87f0d60e1a'

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                window.location.href = '/login';
                return;
            }

            console.log('token: ' + token[0]);
            try {

                const response = await axios.get('api/profile/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setProfile(response.data);
            } catch (err) {
                setError('Failed to fetch profile');
                console.error('Error:', err);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = 'api/login';
    };

    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>Loading...</div>;

    return (
        <div>
            <h1>Welcome, {profile.user.username}!</h1>
            <div>
                <h2>Your Profile</h2>
                <p>Email: {profile.user.email}</p>
                {profile.age && <p>Age: {profile.age}</p>}
            </div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;