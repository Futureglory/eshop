"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from 'next-themes';
import Hero from './components/Hero';
import { FiSun, FiMoon } from "react-icons/fi";

import NavBar from './components/NavBar'
import ThemeToggle from './components/ThemeToggle';
import ProductShowcase from './components/ProductShowcase';
import { CartProvider } from './context/CartContext';
import Link from "next/link";
// import { ThemeContext } from './context/Themecontext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };


  return (

    <CartProvider>
      <div className="landing-container">
        <span className="banner">
          <h1 className="title">Eshop</h1>
          <p className="subtitle">Wear Confidence. Own Your Style.</p>
          <div className="buttons">
           <Link href="/signup">
             <button className="signupButton">Sign Up</button>
           </Link>
           <Link href="/login">
             <button className="loginButton">Log In</button>
           </Link>
           <button onClick={toggleTheme} className="themeToggle">
             {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
           </button>
         </div>
       </span>
      
       {/* <NavBar />
        <Hero />
        <ProductShowcase /> */}







       {/* <footer className="footer">
          <p>&copy; 2023 Eshop. All rights reserved.</p>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/contact">Contact Us</Link>
        </footer> */}
      </div >
    </CartProvider >
  );

}