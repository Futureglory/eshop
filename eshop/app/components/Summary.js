
"use client";
import { useEffect, useState } from "react";

const OrderSummary = () => {
  const [orderDetails, setOrderDetails] = useState(null);
 const [paymentStatus, setPaymentStatus] = useState("Checking...");
  const transactionId = 1;

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orderDetails"));
    setOrderDetails(data);
  }, []);

    useEffect(() => {
    fetch("http://localhost:5000/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    })
      .then((res) => res.json())
      .then((data) => setPaymentStatus(data.transaction.verificationStatus))
      .catch((err) => setPaymentStatus("Error verifying payment"));
  }, []);

  return (
    <div className="order-summary">
      <h1 className="title">Order Confirmation</h1>
      {orderDetails ? (
        <p>Thank you, {orderDetails.name}! Your order will be shipped to {orderDetails.address}.</p>
            //  <p className="subtitle">Payment Status: {paymentStatus}</p
      ) : (
        <p>Order details not found.</p>

      )}
      
    </div>
  );
};

export default OrderSummary;