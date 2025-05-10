"use client";
import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { FiUser, FiShoppingCart, FiSearch} from "react-icons/fi"; // Import icons
import { CartContext,  ThemeContext } from "../context/CartContext";
import * as Icons from "react-icons/fi"; // Import all icons dynamically

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const { cartItems } = useContext(CartContext);
  // const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    fetch("http://localhost:5000/api/users/account", { credentials: "include" })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));

      fetch("http://localhost:5000/api/account/options")
      .then(response => response.json())
      .then(options => setAccountOptions(options));
  }, []);

 


  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const response = await fetch(`http://localhost:5000/api/products/search?q=${query}`);
    const data = await response.json();
    setSearchResults(data);
  };

  return (
  
    <nav className="nav">
      <div className="logo">Eshop</div>

      <div className={`$"navLinks" ${menuOpen ? styles.open : ""}`}>
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>

        {/* Theme Toggle Button */}
        {/* <button onClick={toggleTheme} className={styles.themeToggle}>
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button> */}


      <div className="navIcons">
        {/* Account Dropdown */}
        <div className="accountContainer">
          <FiUser className="icon" onClick={() => setAccountOpen(!accountOpen)} />
          {accountOpen && (
            <div className={styles.accountDropdown}>
              {user && (
                <div className={styles.userInfo}>
                  <img src={user.avatar} alt="Profile Avatar" className={styles.avatar} />
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </div>
              )}

              {accountOptions.map(option => {
                const IconComponent = Icons[option.icon];
                return (
                  <Link key={option.id} href={option.route}>
                    {IconComponent && <IconComponent />} {option.name}
                  </Link>
                  
                );
              })}
              {user && <Link href="/settings"><FiSettings /> Settings</Link>}
              {user && <button className={styles.logout}><FiUser /> Logout</button>}
              {!user && <Link href="/login"><FiUser /> Login</Link>}
            </div>
          )}
        </div>


        <div className="searchContainer">
          <FiSearch className="icon" onClick={() => setSearchOpen(!searchOpen)} />
          {searchOpen && (
            <div className="searchBox">
              <input
                type="text"
                className="searchInput"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
              />
              {searchResults.length > 0 && (
                <ul className="searchResults">
                  {searchResults.map(product => (
                    <li key={product.id} className="searchItem">
                      <Link href={`/products/${product.id}`}>
                        <img src={product.image} alt={product.name} className="searchImage" />
                        <div className="searchInfo">
                          <p>{product.name}</p>
                          <p>{product.price}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="cartContainer">
          <FiShoppingCart className="icon" />
          {cartItems.length > 0 && <span className="cartBadge">{cartItems.length}</span>}
        </div>
      </div>

      <button className="menuIcon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
    </nav>
  );
};

export default NavBar;