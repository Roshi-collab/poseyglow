import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useCart } from "../CartContext";

function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(location.state?.product || null);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");

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

        const response = await fetch(`http://localhost:3001/products/${id}`);
        if (!response.ok) throw new Error("Could not load product");
        setProduct(await response.json());
      } catch (error) {
        setStatus(error.message);
      }
    }

    fetchProduct();
  }, [id, location.state]);

  async function saveChanges(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updates = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
    };

    try {
      const response = await fetch(`http://localhost:3001/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Could not update product");
      setProduct(await response.json());
      setEditing(false);
      setStatus("Product updated.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  if (!product) return <p className="p-6">{status || "Loading..."}</p>;

  return (
    <div className="p-6">
      {product.thumbnail && (
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-60 object-contain"
        />
      )}
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p>{product.description}</p>
      <p className="font-semibold">${Number(product.price).toFixed(2)}</p>
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

      {!id.startsWith("makeup-") && !id.startsWith("care-") && !id.startsWith("aging-") && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            className="rounded border px-3 py-2"
          >
            {editing ? "Cancel" : "Edit product"}
          </button>
          {editing && (
            <form
              onSubmit={saveChanges}
              className="mt-4 max-w-xl space-y-3"
            >
              <label className="block">
                <span>Name</span>
                <input
                  name="title"
                  defaultValue={product.title}
                  className="mt-1 w-full rounded border p-2"
                  required
                />
              </label>
              <label className="block">
                <span>Description</span>
                <textarea
                  name="description"
                  defaultValue={product.description}
                  className="mt-1 w-full rounded border p-2"
                  rows="4"
                  required
                />
              </label>
              <label className="block">
                <span>Price</span>
                <input
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  defaultValue={product.price}
                  className="mt-1 w-full rounded border p-2"
                  required
                />
              </label>
              <button
                type="submit"
                className="rounded bg-pink-800 px-4 py-2 text-white"
              >
                Save changes
              </button>
            </form>
          )}
        </div>
      )}
      {status && <p role="status" className="mt-3">{status}</p>}
    </div>
  );
}

export default ProductDetails;