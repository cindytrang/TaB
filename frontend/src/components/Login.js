import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, Card, CardBody, CardHeader, Spacer, Tabs, Tab } from "@nextui-org/react";

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('api/signup/', { username, email, password });
      console.log('User signed up:', response.data);
      showToast("Signup Successful! Please log in.", "success");
      setIsSignUp(false);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('There was an error signing up!', error);
      if (error.response && error.response.data) {
        Object.entries(error.response.data).forEach(([key, value]) => {
          showToast(`${key}: ${Array.isArray(value) ? value.join(" ") : value}`, "error");
        });
      } else {
        showToast("An unexpected error occurred during signup. Please try again.", "error");
      }
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('api/login/', { username_or_email: username, password });
      console.log('User logged in:', response.data);
      localStorage.setItem('authToken', response.data.token);
      showToast("Login Successful", "success");
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('There was an error logging in!', error);
      if (error.response && error.response.data) {
        Object.entries(error.response.data).forEach(([key, value]) => {
          showToast(`${key}: ${Array.isArray(value) ? value.join(" ") : value}`, "error");
        });
      } else {
        showToast("An unexpected error occurred during login. Please try again.", "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      await handleSignup();
    } else {
      await handleLogin();
    }
  };

  return (
    <>
      <Card className="max-w-sm mx-auto mt-10">
        <CardHeader>
          <Tabs 
            fullWidth 
            size="lg" 
            aria-label="Login options"
            selectedKey={isSignUp ? "signup" : "login"}
            onSelectionChange={(key) => setIsSignUp(key === "signup")}
          >
            <Tab key="login" title="Login" />
            <Tab key="signup" title="Sign Up" />
          </Tabs>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Input
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Spacer y={2} />
            {isSignUp && (
              <>
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Spacer y={2} />
              </>
            )}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Spacer y={2} />
            <Button type="submit" color="primary" fullWidth>
              {isSignUp ? 'Sign Up' : 'Login'}
            </Button>
          </form>
        </CardBody>
      </Card>
      {toast.visible && (
        <div 
          className={`fixed bottom-4 right-4 p-4 rounded-md ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
};

export default Login;