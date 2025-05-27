"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Checkout = () => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phoneNumber: "",
        paymentMethod: "Card",
        shippingAddress: ""
    });
    const router = useRouter();
    const [error, setError] = useState("");

    const handleCheckout = async (e) => {
        e.preventDefault();

        router.push("/orderSummary");

        const response = await fetch("http://localhost:5000/api/payments/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: 1, // Replace with actual user ID
                orderId: 123, // Replace with actual order ID
                paymentMethod: formData.paymentMethod,
                amount: 100, // Replace with actual amount
            }),
        });

        const data = await response.json();
        console.log("Payment response:", data);
    };

    return (
        <div className="checkout-container">
            <h1 className="title">Checkout</h1>
            <form onSubmit={handleCheckout}>
                <input type="text" placeholder="Full Name" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input type="text" placeholder="Shipping Address" required onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })} />
                <select onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
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