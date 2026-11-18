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
    const audienceValue = formData.get("audience");
    const audience =
      audienceValue === "women,men" ? ["women", "men"] : [audienceValue];
    const product = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      category: formData.get("category"),
      skinTypes: [formData.get("skinType")],
      audience,
      thumbnail: formData.get("thumbnail") || "",
      source: "PoseyGlow Collection",
    };

    try {
      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Could not add product");
      setMessage("Product added and saved.");
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
        <label className="block">
          <span className="mb-1 block">Image URL</span>
          <input
            className="w-full rounded border p-2"
            name="thumbnail"
            type="url"
          />
        </label>
        <label className="block">
          <span className="mb-1 block">Category</span>
          <select
            className="w-full rounded border p-2"
            name="category"
            defaultValue="serums"
          >
            <option value="serums">Serums</option>
            <option value="toners">Toners</option>
            <option value="skin-care">Skin care</option>
            <option value="sunscreen">Sun care</option>
            <option value="anti-aging">Anti-aging</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block">Skin type</span>
          <select
            className="w-full rounded border p-2"
            name="skinType"
            defaultValue="normal"
          >
            <option value="all">All</option>
            <option value="dry">Dry</option>
            <option value="normal">Normal</option>
            <option value="oily">Oily</option>
            <option value="combination">Combination</option>
            <option value="sensitive">Sensitive</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block">Audience</span>
          <select
            className="w-full rounded border p-2"
            name="audience"
            defaultValue="women"
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="women,men">Women &amp; Men</option>
          </select>
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