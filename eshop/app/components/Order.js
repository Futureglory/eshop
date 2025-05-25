import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock, Calendar, Filter, ShoppingCart, Eye, RotateCcw } from 'lucide-react';

const OrderManagementSystem = () => {
  // Mock database - in real app, this would be in your backend
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2024-001',
      date: '2024-05-20',
      status: 'delivered',
      total: 159.99,
      items: [
        { id: 1, name: 'Wireless Headphones', price: 89.99, quantity: 1, image: '/api/placeholder/60/60' },
        { id: 2, name: 'Phone Case', price: 29.99, quantity: 2, image: '/api/placeholder/60/60' }
      ],
      shippingAddress: '123 Main St, City, State 12345',
      estimatedDelivery: '2024-05-22',
      actualDelivery: '2024-05-21',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-05-23',
      status: 'processing',
      total: 249.50,
      items: [
        { id: 3, name: 'Laptop Stand', price: 79.99, quantity: 1, image: '/api/placeholder/60/60' },
        { id: 4, name: 'USB Hub', price: 49.99, quantity: 2, image: '/api/placeholder/60/60' },
        { id: 5, name: 'Wireless Mouse', price: 69.53, quantity: 1, image: '/api/placeholder/60/60' }
      ],
      shippingAddress: '456 Oak Ave, Town, State 67890',
      estimatedDelivery: '2024-05-28',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-05-24',
      status: 'shipped',
      total: 89.99,
      items: [
        { id: 6, name: 'Bluetooth Speaker', price: 89.99, quantity: 1, image: '/api/placeholder/60/60' }
      ],
      shippingAddress: '789 Pine St, Village, State 13579',
      estimatedDelivery: '2024-05-26',
      trackingNumber: 'TRK456789123'
    },
    {
      id: 'ORD-2024-004',
      date: '2024-05-15',
      status: 'canceled',
      total: 199.99,
      items: [
        { id: 7, name: 'Smart Watch', price: 199.99, quantity: 1, image: '/api/placeholder/60/60' }
      ],
      shippingAddress: '321 Elm St, Borough, State 24680',
      estimatedDelivery: null,
      cancelReason: 'Customer requested cancellation'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter orders based on status
  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  // Status configuration
  const statusConfig = {
    processing: { 
      color: 'status-processing', 
      icon: Clock, 
      label: 'Processing' 
    },
    shipped: { 
      color: 'status-shipped', 
      icon: Truck, 
      label: 'Shipped' 
    },
    delivered: { 
      color: 'status-delivered', 
      icon: CheckCircle, 
      label: 'Delivered' 
    },
    canceled: { 
      color: 'status-canceled', 
      icon: XCircle, 
      label: 'Canceled' 
    }
  };

  // API functions
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/orders');
      // const data = await response.json();
      // setOrders(data);
      
      // Mock delay
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const reorderItems = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/orders/reorder', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ orderId })
        // });
        
        alert(`Added ${order.items.length} items to cart for reorder!`);
      } catch (error) {
        console.error('Error reordering:', error);
        alert('Failed to reorder items. Please try again.');
      }
    }
  };

  const trackOrder = async (trackingNumber) => {
    try {
      // Replace with actual tracking API call
      // const response = await fetch(`/api/tracking/${trackingNumber}`);
      // const trackingData = await response.json();
      
      alert(`Tracking order with number: ${trackingNumber}`);
    } catch (error) {
      console.error('Error tracking order:', error);
      alert('Unable to track order at this time.');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Replace with actual API call
      // const response = await fetch(`/api/orders/${orderId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const OrderCard = ({ order }) => {
    const StatusIcon = statusConfig[order.status]?.icon || Package;
    
    return (
      <div className="order-card">
        <div className="order-card-header">
          <div className="order-info">
            <h3 className="order-id">{order.id}</h3>
            <p className="order-date">
              <Calendar size={16} />
              {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
          <div className="order-summary">
            <div className={`status-badge ${statusConfig[order.status]?.color}`}>
              <StatusIcon size={16} />
              {statusConfig[order.status]?.label}
            </div>
            <p className="order-total">${order.total}</p>
          </div>
        </div>

        <div className="order-items-preview">
          <h4 className="items-label">Items ({order.items.length})</h4>
          <div className="items-avatars">
            {order.items.slice(0, 3).map((item, index) => (
              <div key={item.id} className="item-avatar">
                {item.name.charAt(0)}
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="item-avatar item-avatar-more">
                +{order.items.length - 3}
              </div>
            )}
          </div>
        </div>

        {order.estimatedDelivery && (
          <div className="delivery-info">
            <p className="delivery-date">
              {order.status === 'delivered' ? 'Delivered on' : 'Estimated delivery'}: 
              <span className="delivery-date-value">
                {new Date(order.actualDelivery || order.estimatedDelivery).toLocaleDateString()}
              </span>
            </p>
            {order.trackingNumber && (
              <button 
                onClick={() => trackOrder(order.trackingNumber)}
                className="tracking-link"
              >
                Track: {order.trackingNumber}
              </button>
            )}
          </div>
        )}

        <div className="order-actions">
          <button
            onClick={() => {
              setSelectedOrder(order);
              setShowOrderDetails(true);
            }}
            className="btn btn-secondary"
          >
            <Eye size={16} />
            View Details
          </button>
          {order.status !== 'canceled' && (
            <button
              onClick={() => reorderItems(order.id)}
              className="btn btn-primary"
            >
              <RotateCcw size={16} />
              Reorder
            </button>
          )}
        </div>
      </div>
    );
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Order Details</h2>
            <button onClick={onClose} className="modal-close">×</button>
          </div>

          <div className="modal-body">
            <div className="order-details-grid">
              <div className="detail-item">
                <h3 className="detail-label">Order ID</h3>
                <p className="detail-value">{order.id}</p>
              </div>
              <div className="detail-item">
                <h3 className="detail-label">Status</h3>
                <div className={`status-badge ${statusConfig[order.status]?.color}`}>
                  {statusConfig[order.status]?.label}
                </div>
              </div>
              <div className="detail-item">
                <h3 className="detail-label">Order Date</h3>
                <p className="detail-value">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <h3 className="detail-label">Total</h3>
                <p className="detail-value total-value">${order.total}</p>
              </div>
            </div>

            <div className="shipping-section">
              <h3 className="section-title">Shipping Address</h3>
              <p className="shipping-address">{order.shippingAddress}</p>
            </div>

            {order.trackingNumber && (
              <div className="tracking-section">
                <h3 className="section-title">Tracking</h3>
                <button
                  onClick={() => trackOrder(order.trackingNumber)}
                  className="tracking-number"
                >
                  {order.trackingNumber}
                </button>
              </div>
            )}

            <div className="items-section">
              <h3 className="section-title">Items</h3>
              <div className="order-items-list">
                {order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <Package size={32} />
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">${item.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {order.cancelReason && (
              <div className="cancellation-section">
                <h3 className="cancellation-title">Cancellation Reason</h3>
                <p className="cancellation-reason">{order.cancelReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="order-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">Track and manage your orders</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        {/* Filters */}
        <div className="filters-section">
          <div className="filters-header">
            <Filter size={20} />
            <span className="filters-label">Filter by status:</span>
          </div>
          <div className="filters-buttons">
            {['all', 'processing', 'shipped', 'delivered', 'canceled'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              >
                {status === 'all' ? 'All Orders' : statusConfig[status]?.label || status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <div className="orders-grid">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Package size={64} />
            <h3 className="empty-title">No orders found</h3>
            <p className="empty-message">
              {filterStatus === 'all' 
                ? "You haven't placed any orders yet." 
                : `No orders with status: ${statusConfig[filterStatus]?.label || filterStatus}`
              }
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderManagementSystem;