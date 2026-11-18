import { Link } from "react-router-dom";
import { useCart } from "../CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="rounded-lg border p-4 text-center">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="mx-auto h-40 object-contain"
      />
      <h2 className="mt-2 font-semibold">{product.title}</h2>
      <p className="text-gray-600">${Number(product.price).toFixed(2)}</p>
      <Link
        to={`/products/${product.id}`}
        state={{ product }}
        className="text-blue-600 underline"
      >
        View details
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 block w-full rounded bg-pink-800 py-2 text-white transition-colors hover:bg-pink-900"
      >
        Add to cart
      </button>
    </div>
  );
}

export default ProductCard;