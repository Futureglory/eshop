import Link from "next/link";

const Men = () => {
  return (
    <div>
      <h1>Men's Fashion</h1>
      <div className="category-links">
        <Link href="/men/suits">Suits</Link>
        <Link href="/men/shirts">Shirts</Link>
        <Link href="/men/trousers">Trousers</Link>
        <Link href="/men/shorts">Shorts</Link>
        <Link href="/men/shoes">Shoes</Link>
        <Link href="/men/tops">Tops</Link>
      </div>
    </div>
  );
};

export default Men;