import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import LogoCangaroo from './Logo';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar className="bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <NavbarBrand>
            <Link to="/" className="flex items-center text-white">
              <LogoCangaroo className="mr-2" />
              <span className="font-bold text-lg">Calendarooo</span>
            </Link>
          </NavbarBrand>
          <NavbarContent justify="end">
            <NavbarItem>
              {isLoggedIn ? (
                <Button 
                  onClick={handleLogout}
                  variant="flat" 
                  className="text-white bg-transparent hover:bg-gray-700"
                >
                  Logout
                </Button>
              ) : (
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="flat" 
                  className="text-white bg-transparent hover:bg-gray-700"
                >
                  Login
                </Button>
              )}
            </NavbarItem>
          </NavbarContent>
        </div>
      </Navbar>
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          © 2023 Calendarooo. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;