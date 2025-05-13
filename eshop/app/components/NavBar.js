"use client";
import { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { FiUser, FiShoppingCart, FiSearch, FiSettings } from "react-icons/fi"; // Import icons
import { CartContext, ThemeContext } from "../context/CartContext";
import * as Icons from "react-icons/fi"; // Import all icons dynamically

const NavBar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const { cartItems } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWomenOpen, setIsWomenOpen] = useState(false);
  const [isMenOpen, setIsMenOpen] = useState(false);

  // const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Safe to access browser-specific objects
    }
  }, []);

  const womenRef = useRef(null);
  const menRef = useRef(null);
  const accountRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (womenRef.current && !womenRef.current.contains(event.target)) {
        setIsWomenOpen(false);
      }
      if (menRef.current && !menRef.current.contains(event.target)) {
        setIsMenOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }


    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      {/* <div className="logo">Eshop</div> */}

      {/* Hamburger toggle */}
      <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ☰
      </button>

      {/* Responsive Nav Links */}
      <ul className={`navLinks ${isMenuOpen ? "open" : ""}`} ref={womenRef}>
        <li className="navLink"><Link href="/">Home</Link></li>

        {/* Women */}
        <li className={`dropdown ${isWomenOpen ? "open" : ""}`}>
          <span onClick={() => setIsWomenOpen(prev => !prev)}>Women</span>
          {isWomenOpen && (
            <div className="dropdown-menu">
              <Link href="/women/gowns">Gowns</Link>
              <Link href="/women/handbags">Handbags</Link>
              <Link href="/women/skirts">Skirts</Link>
              <Link href="/women/shoes">Shoes</Link>
              <Link href="/women/tops">Tops</Link>

            </div>
          )}
        </li>

        {/* Men */}
        <li className={`dropdown ${isMenOpen ? "open" : ""}`} ref={menRef}>
          <span onClick={() => setIsMenOpen(prev => !prev)}>Men</span>
          {isMenOpen && (
            <div className="dropdown-menu">
              <Link href="/men/suits">Suits</Link>
              <Link href="/men/shirts">Shirts</Link>
              <Link href="/men/trousers">Trousers</Link>
              <Link href="/men/shorts">Shorts</Link>
              <Link href="/men/shoes">Shoes</Link>
              <Link href="/men/tops">Tops</Link>
            </div>
          )}
        </li>

        <li className="navLink"><Link href="/contact">Contact Us</Link></li>
        <li className="navLink"><Link href="/about">About Us</Link></li>
      </ul>



      <div className="navIcons">
        {/* Account Dropdown */}
        <div className="accountContainer">
          <FiUser className="icon" onClick={() => setAccountOpen(!accountOpen)} ref={accountRef} />
          {accountOpen && (
            <div className="accountDropdown">
              {user && (
                <div className="userInfo">
                  <img src={user.avatar} alt="Profile Avatar" className="avatar" />
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
              {user && <button className="logout"><FiUser /> Logout</button>}
              {!user && <Link href="/login"><FiUser /> Login</Link>}
            </div>
          )}
        </div>

        <div className="searchContainer">
          <FiSearch className="icon" onClick={() => setSearchOpen(!searchOpen)} ref={searchRef} />
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
    </nav>
  );
};

export default NavBar;