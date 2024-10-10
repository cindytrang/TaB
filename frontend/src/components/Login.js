import React, { useState } from 'react';
import axios from 'axios';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('api/login/', {
        username,
        email,
        password
      });
      console.log('User signed up:',  response.data);
      localStorage.setItem('authToken', response.data);
      window.location.href = '/';
    } catch (error) {
      console.error('There was an error signing up!', error);
    }
  };
  return (
    <form onSubmit={handleLogin}>
        <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
    </form>
    );
};

export default Login;