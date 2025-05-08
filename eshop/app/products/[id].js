import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";


const ProductPage = () => {
    const router = useRouter();
    const { id } = router.query;

    // Fetch product details from the backend based on ID
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);


    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5000/api/products/${id}`)
                .then(response => response.json())
                .then(data => setProduct(data));

            fetch(`http://localhost:5000/api/products/related?category=${data.category}`)
                .then(response => response.json())
                .then(products => setRelatedProducts(products));

                fetch(`http://localhost:5000/api/products/recommended?userId=1`)
                .then(response => response.json())
                .then(products => setRecommendedProducts(products));
    
        }
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <div>
            <h1>{product.name}</h1>
            <img src={product.image} alt={product.name} />
            <p>{product.price}</p>
            <p>{product.description}</p>
            <button>Add to Cart</button>

            <h2>Related Products</h2>
      <div className="related-products">
        {relatedProducts.map(related => (
          <Link key={related.id} href={`/products/${related.id}`}>
            <div className="related-product">
              <img src={related.image} alt={related.name} />
              <p>{related.name} - {related.price}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2>Recommended for You</h2>
      <div className="recommended-products">
        {recommendedProducts.map(recommended => (
          <Link key={recommended.id} href={`/products/${recommended.id}`}>
            <div className="recommended-product">
              <img src={recommended.image} alt={recommended.name} />
              <p>{recommended.name} - {recommended.price}</p>
            </div>
          </Link>
        ))}
      </div>

        </div>
    );
};

export default ProductPage;