"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Checkout = () => {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        paymentMethod: "Card",
        shippingAddress: ""
    });
    const router = useRouter();
    const [error, setError] = useState("");

    // ✅ Fetch user's name from backend (e.g., /api/users/profile)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/users/profile", {
                    credentials: "include", // if using cookies
                });
                const data = await res.json();
                if (res.ok) {
                    setFormData(prev => ({ ...prev, name: data.username || "" }));
                } else {
                    setError("Unable to fetch user data.");
                }
            } catch (err) {
                console.error(err);
                setError("Server error while fetching user.");
            }
        };
        fetchUser();
    }, []);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError("");
        const { shippingAddress, paymentMethod, phoneNumber } = formData;

        if (!shippingAddress || !paymentMethod || !phoneNumber) {
            return setError("Please fill in all fields.");
        }

        const phoneRegex = /^\d{11}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return setError("Phone number must be exactly 11 digits.");
        }

        try {
            const response = await fetch("http://localhost:5000/api/payments/pay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: 1, // Replace with real user ID
                    orderId: 123, // Replace with real order ID
                    paymentMethod,
                    amount: 100, // Replace with actual amount
                    phoneNumber,
                    shippingAddress,
                    amount:100,
                }),
            });

            const data = await response.json();
   window.location.href = data.data.redirect_url;
            if (!response.ok) {
                return setError(data.message || "Payment failed.");
            }

            console.log("Payment response:", data);
            router.push("/orderSummary");
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="checkout-container">
            <h1 className="title">Checkout</h1>
            <form onSubmit={handleCheckout}>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Shipping Address"
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    required
                />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                />

                <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    required
                >
                    <option value=""> Select mode of payment</option>
                    <option value="Card">Pay with ATM Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <button type="submit">Place your Order</button>
            </form>
        </div>
    );
};

export default Checkout;