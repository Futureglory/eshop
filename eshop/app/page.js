"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from 'next-themes';
import Hero from './components/Hero';
import NavBar from './components/NavBar'
import ThemeToggle from './components/ThemeToggle';
import ProductShowcase from './components/ProductShowcase';
import { CartProvider } from './context/CartContext'; // adjust the path if needed
import Link from "next/link";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated]);


  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };


  return (
    <CartProvider>
      <div className="landing-container">
        <div className="card">
          <h1 className="title">Welcome to Eshop</h1>
          <p className="subtitle">Wear Confidence. Own Your Style.</p>
        </div>
        <Link href="/signup">
          <button className="signupButton">Sign Up Now</button>
        </Link>
        <Link href="/login">
          <button className="loginButton">Log In</button>
        </Link>
        <button onClick={toggleTheme} className="theme-toggle"> Theme Mode</button>
        <ThemeToggle />
        <NavBar />
        <Hero />
        <ProductShowcase />
        






        <footer className="footer">
          <p>&copy; 2023 Eshop. All rights reserved.</p>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/contact">Contact Us</Link>
        </footer>
      </div>
    </CartProvider>
  );

}