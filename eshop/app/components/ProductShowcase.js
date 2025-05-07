import React from 'react';
const products = [
  { id: 1, name: "Trendy T-Shirt", price: "$29.99", image: "/tshirt.jpg" },
  { id: 2, name: "Stylish Sneakers", price: "$79.99", image: "/sneakers.jpg" },
  { id: 3, name: "Designer Bag", price: "$149.99", image: "/bag.jpg" },
];

const ProductShowcase = () => {
  return (
    <div className={styles.showcase}>
      <h2>Trending Styles</h2>
      <div className={styles.products}>
        {products.map(product => (
          <div key={product.id} className={styles.product}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className='price'>{product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductShowcase;