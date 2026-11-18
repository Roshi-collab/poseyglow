import { useState } from "react";

function AddProduct() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const product = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
    };

    try {
      const response = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Could not add product");
      setMessage("Product added.");
      form.reset();
    } catch {
      setMessage("Could not add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Add a product</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block">Name</span>
          <input className="w-full rounded border p-2" name="title" required />
        </label>
        <label className="block">
          <span className="mb-1 block">Description</span>
          <textarea
            className="w-full rounded border p-2"
            name="description"
            rows="4"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block">Price</span>
          <input
            className="w-full rounded border p-2"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            required
          />
        </label>
        <button
          className="rounded bg-pink-800 px-4 py-2 text-white transition-colors hover:bg-pink-900 disabled:opacity-50"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Adding..." : "Add product"}
        </button>
        {message && <p role="status">{message}</p>}
      </form>
    </main>
  );
}

export default AddProduct;