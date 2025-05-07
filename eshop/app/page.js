"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
import ThemeToggle from "./components/ThemeToggle";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated]);




  return (
    <div className="landing-container">
      <h1> HOME PAGE</h1>
            {/* <div className="card">
      <h1  className="title">Welcome to Eshop</h1>
      <p className="subtitle">Wear Confidence. Own Your Style.</p>
      </div>
      <Link href="/signup">
        <button className={styles.signupButton}>Sign Up Now</button>
      </Link>
      <Link href="/login">
        <button className={styles.loginButton}>Log In</button>
      </Link>
      <button onClick={toggleTheme} className="theme-toggle">Toggle Theme</button>

      <Hero />
      <ProductShowcase />
      <ThemeToggle />






      <footer className={styles.footer}>
        <p>&copy; 2023 Eshop. All rights reserved.</p>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms-of-service">Terms of Service</Link>
        <Link href="/contact">Contact Us</Link>
      </footer> */}
    </div>
    
  );

}