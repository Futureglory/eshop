"use client";
import { useState, useContext, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { FiUser, FiPackage,FiShoppingCart, FiSearch, FiChevronDown, FiHeart, FiFileText, FiLock } from "react-icons/fi";
import { CartContext, ThemeContext } from "../context/CartContext";

const NavBar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWomenOpen, setIsWomenOpen] = useState(false);
  const [isMenOpen, setIsMenOpen] = useState(false);
  
  const { cartItems } = useContext(CartContext);
  
  // Refs for click outside detection
  const womenRef = useRef(null);
  const menRef = useRef(null);
  const accountRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Handle click outside to close dropdowns
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/profile", { 
          credentials: "include" 
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(async (query) => {
    if (query.trim() === "") {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/products/search?q=${encodeURIComponent(query)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search with debouncing
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      debouncedSearch(query);
    }, 300);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        setUser(null);
        setAccountOpen(false);
        // Optional: redirect to home or login page
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="nav">
      <button 
        className="hamburger" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>

      {/* Navigation Links */}
      <ul className={`navLinks ${isMenuOpen ? "open" : ""}`}>
        <li className="navLink">
          <Link href="/">Home</Link>
        </li>

        {/* Women Dropdown */}
        <li className={`dropdown ${isWomenOpen ? "open" : ""}`} ref={womenRef}>
          <li 
            onClick={() => setIsWomenOpen(!isWomenOpen)}
            className="navLink"
            aria-expanded={isWomenOpen}
          >
            Women <FiChevronDown className="dropdown-icon" />
          </li>
          {isWomenOpen && (
            <div className="dropdown-menu">
              <Link href="/women/gowns">Gowns</Link>
              <Link href="/women/handbags">Handbags</Link>
              <Link href="/women/shoes">Shoes</Link>
              <Link href="/women/skirts">Skirts</Link>
              <Link href="/women/suits">Suits</Link>
              <Link href="/women/tops">Tops</Link>
            </div>
          )}
        </li>

        {/* Men Dropdown */}
        <li className={`dropdown ${isMenOpen ? "open" : ""}`} ref={menRef}>
          <li 
            onClick={() => setIsMenOpen(!isMenOpen)}
            className="navLink"
            aria-expanded={isMenOpen}
          >
            Men <FiChevronDown className="dropdown-icon" />
          </li>
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

        <li className="navLink">
          <Link href="/contact">Contact Us</Link>
        </li>
        <li className="navLink">
          <Link href="/about">About Us</Link>
        </li>
      </ul>

      <div className="navIcons">
        {/* Account Dropdown */}
        <div className="accountContainer" ref={accountRef}>
          <li 
            className="icon-button"
            onClick={() => setAccountOpen(!accountOpen)}
            aria-label="Account menu"
          >
            <FiUser className="icon" />
          </li>

          {accountOpen && (
            <div className="accountDropdown">
             
             
                  <Link href="/profile">
                    <FiUser /> Profile
                  </Link>
                  <Link href="/wishlist">
                    <FiHeart /> Wishlist
                  </Link>
                  <Link href="/orders">
<FiPackage /> Orders
                  </Link>
              <Link href="/terms">
                <FiFileText /> Terms & Conditions
              </Link>
              <Link href="/privacy">
                <FiLock /> Privacy Policy
              </Link>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="searchContainer" ref={searchRef}>
          <li 
            className="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <FiSearch className={`icon ${searchOpen ? "active" : ""}`} />
          </li>
          
          {searchOpen && (
            <div className="searchBox">
              <input
                type="text"
                className="searchInput"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                autoFocus
              />
              
              {isLoading && (
                <div className="searchLoading">Searching...</div>
              )}
              
              {searchResults.length > 0 && (
                <ul className="searchResults">
                  {searchResults.slice(0, 5).map(product => (
                    <li key={product.id} className="searchItem">
                      <Link href={`/products/${product.id}`} onClick={() => setSearchOpen(false)}>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="searchImage"
                          loading="lazy"
                        />
                        <div className="searchInfo">
                          <p className="searchName">{product.name}</p>
                          <p className="searchPrice">${product.price}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                  {searchResults.length > 5 && (
                    <li className="searchMore">
                      <Link href={`/search?q=${encodeURIComponent(searchQuery)}`}>
                        View all {searchResults.length} results
                      </Link>
                    </li>
                  )}
                </ul>
              )}
              
              {searchQuery && !isLoading && searchResults.length === 0 && (
                <div className="noResults">No products found</div>
              )}
            </div>
          )}
        </div>

        {/* Cart */}
        <Link href="/cart" className="cartContainer">
          <FiShoppingCart className="icon" />
          {cartItems?.length > 0 && (
            <span className="cartBadge">{cartItems.length}</span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;