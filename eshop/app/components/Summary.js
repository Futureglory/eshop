
"use client";
import { useEffect, useState } from "react";

const OrderSummary = () => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orderDetails"));
    setOrderDetails(data);
  }, []);

  return (
    <div className="order-summary">
      <h1>Order Confirmation</h1>
      {orderDetails ? (
        <p>Thank you, {orderDetails.name}! Your order will be shipped to {orderDetails.address}.</p>
      ) : (
        <p>Order details not found.</p>
      )}
    </div>
  );
};

export default OrderSummary;