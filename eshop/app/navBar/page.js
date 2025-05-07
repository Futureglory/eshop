import { useState } from "react";
import Link from "next/link";
import { FiUser, FiShoppingCart, FiSearch } from "react-icons/fi"; // Import icons
import styles from "../styles/modernNavbar.module.css";

const ModernNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>Eshop</div>
      
      <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>

      <div className={styles.navIcons}>
      <FiUser className={styles.icon} />
        <FiSearch className={styles.icon} />
        <FiShoppingCart className={styles.icon} />
      </div>

      <button className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
    </nav>
  );
};

export default ModernNavBar;