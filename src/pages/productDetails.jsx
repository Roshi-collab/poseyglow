import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);

  useEffect(() => {
    if (location.state?.product) {
      setProduct(location.state.product);
      return;
    }

    async function fetchProduct() {
      try {
        if (id.startsWith("makeup-")) {
          const response = await fetch(
            `https://makeup-api.herokuapp.com/api/v1/products/${id.replace(
              "makeup-",
              ""
            )}.json`
          );
          if (!response.ok) throw new Error("Could not load skincare product");
          const data = await response.json();
          const text = `${data.product_type || ""} ${data.category || ""} ${data.name || ""}`.toLowerCase();
             if (excluded.some((term) => text.includes(term))) {
            throw new Error("This is not a skincare product");
          }

          setProduct({
            id,
            title: data.name,
            description: data.description || "",
            price: Number(data.price) || 0,
            thumbnail: data.image_link || data.api_featured_image || "",
            source: "Makeup API",
          });
          return;
        }

        throw new Error("Invalid skincare product link");
      } catch (error) {
        console.error(error);
      }
    }

    fetchProduct();
  }, [id, location.state]);

  if (!product) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <img src={product.thumbnail} alt={product.title} className="h-60" />
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p>{product.description}</p>
      <p className="font-semibold">${product.price}</p>
      {product.source && (
        <p className="mt-2 text-sm text-gray-500">
          Source: {product.source}
        </p>
      )}
      <button
        onClick={() => addToCart(product)}
        className="mt-4 rounded bg-pink-800 px-4 py-2 text-white transition-colors hover:bg-pink-900"
      >
        Add to cart
      </button>
    </div>
  );
}

export default ProductDetails;