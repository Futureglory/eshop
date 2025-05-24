"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from 'next-themes';
import Hero from './components/Hero';
import { FiSun, FiMoon } from "react-icons/fi";
import NavBar from './components/NavBar';
import ProductShowcase from './components/ProductShowcase';
import { CartProvider } from './context/CartContext';
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Fetch user session
  const fetchUserSession = useCallback(async () => {
    try {
      setSessionLoading(true);
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user || data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session fetch error:", error);
      setUser(null);
    } finally {
      setSessionLoading(false);
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    fetchUserSession();
  }, [fetchUserSession]);

  // Handle authentication redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  // Handle theme mounting
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) return null;

  return (
    <CartProvider>
      <div className="landing-container">
        <header className="hero-banner">
          <div className="hero-content">
            <h1 className="brand-title">Eshop</h1>
            <p className="brand-subtitle">Wear Confidence. Own Your Style.</p>

            <div className="hero-actions">
              {!sessionLoading && !user && (
                <div className="auth-buttons">
                  <Link href="/signup">
                    <button className="signup-button">Sign Up</button>
                  </Link>
                  <Link href="/login">
                    <button className="login-button">Log In</button>
                  </Link>
                </div>
              )}

              {!sessionLoading && user && (
                <div className="user-welcome">
                  <span>Welcome back, {user.username}!</span>
                  <Link href="/dashboard">
                    <button className="dashboard-button">Go to Dashboard</button>
                  </Link>
                </div>
              )}

              {sessionLoading && (
                <div className="session-loading">
                  <div className="spinner"></div>
                  <span>Checking session...</span>
                </div>
              )}

              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
              </button>
            </div>
          </div>
        </header>

        <NavBar />

        <main className="main-content">
          <Hero />
          <ProductShowcase />
        </main>

        <footer className="site-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Quick Links</h3>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/faq">FAQ</Link>
            </div>

            <div className="footer-section">
              <h3>Legal</h3>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
              <Link href="/returns">Returns Policy</Link>
            </div>

            <div className="footer-section">
              <h3>Support</h3>
              <Link href="/help">Help Center</Link>
              <Link href="/shipping">Shipping Info</Link>
              <Link href="/size-guide">Size Guide</Link>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 Eshop. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
};