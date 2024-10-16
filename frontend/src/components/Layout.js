import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import LogoCangaroo from './Logo';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar className="bg-black text-white">
        <NavbarBrand>
          <LogoCangaroo />
          <Link to="/" className="text-white">Calendariooo</Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button 
              as={Link} 
              to="/login" 
              variant="flat" 
              className="text-white bg-transparent hover:bg-gray-700"
            >
              Login
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button 
              as={Link} 
              to="/signup" 
              variant="flat" 
              className="text-white bg-transparent hover:bg-gray-700"
            >
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <main>{children}</main>
    </div>
  );
};

export default Layout;