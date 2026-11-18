import { Link } from "react-router-dom";

function ProductCard({ product, addToCart }) {
  return (
    <div className="border rounded-lg p-4 text-center">
      <img src={product.thumbnail} alt={product.title} className="mx-auto h-40" />
      <h2 className="font-semibold mt-2">{product.title}</h2>
      <p className="text-gray-600">${product.price}</p>
      <Link
        to={`/products/${product.id}`}
        state={{ product }}
        className="text-blue-600 underline"
      >
        View details
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="block w-full mt-2 rounded bg-pink-800 py-2 text-white transition-colors hover:bg-pink-900"
      >
        Add to cart
      </button>
    </div>
  );
}

export default ProductCard;