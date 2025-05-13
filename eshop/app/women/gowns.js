import { useEffect, useState } from "react";

const Gowns = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products?category=gowns")
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <h1>Gowns</h1>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <img src={product.image} alt={product.name} />
            <p>{product.name} - {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gowns;