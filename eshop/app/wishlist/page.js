"use client"
import { useState, useEffect } from "react";

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/wishlist", { credentials: "include" })
            .then(response => response.json())
            .then(data => setWishlistItems(data))
            .catch(() => setWishlistItems([]));
    }, []);

    const handleRemove = async (productId) => {
        await fetch(`http://localhost:5000/api/wishlist/remove/${productId}`, {
            method: "DELETE",
            credentials: "include",
        });

        setWishlistItems(wishlistItems.filter(item => item.id !== productId));
    };

    const handleSubscribeForNotifications = async (productId) => {
        await fetch(`http://localhost:5000/api/wishlist/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
            credentials: "include",
        });

        alert("You'll be notified when this item goes on sale!");
    };

    const handleMoveToCart = async (productId) => {
        await fetch(`http://localhost:5000/api/cart/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
            credentials: "include",
        });

        await fetch(`http://localhost:5000/api/wishlist/remove/${productId}`, {
            method: "DELETE",
            credentials: "include",
        });

        setWishlistItems(wishlistItems.filter(item => item.id !== productId));
    };

    const handleShareWishlist = async () => {
        const response = await fetch("http://localhost:5000/api/wishlist/share", { credentials: "include" });
        const data = await response.json();

        alert(`Share your wishlist: ${data.link}`);
    };

    return (
        <div className="wishlist-page">
            <h1 className="header" >My Wishlist</h1>
            {wishlistItems.length === 0 ? (
                <p>No items in your wishlist.</p>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map(product => (
                        <div key={product.id} className="wishlist-item">
                            <img src={product.image} alt={product.name} />
                            <p>{product.name}</p>
                            <p>{product.description}</p>
                            <p>{product.price}</p>
                            <p>{product.discounted ? "On Sale!" : "Regular Price"}</p>

                            <button onClick={handleShareWishlist}>Share Wishlist</button>
                            <button onClick={() => handleSubscribeForNotifications(product.id)}>Notify Me on Sale</button>
                            <button onClick={() => handleMoveToCart(product.id)}>Move to Cart</button>
                            <button onClick={() => handleRemove(product.id)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;