import { useState, useEffect } from "react";
import ProductCard from "./productCard";

const MAKEUP_API = "https://makeup-api.herokuapp.com/api/v1/products.json";
const PRODUCTS_API = "http://localhost:3001/products";

const SKINCARE_FALLBACK = [
  { id: "care-cleansing-gel", title: "Gentle Hydrating Cleansing Gel", description: "A gentle daily face cleanser for removing impurities without stripping moisture.", price: 18, category: "skin-care", skinTypes: ["dry", "normal", "sensitive"], thumbnail: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-moisturizer", title: "Barrier Repair Face Moisturizer", description: "Daily face moisturizer that helps hydrate and support the skin barrier.", price: 24, category: "skin-care", skinTypes: ["dry", "normal", "sensitive"], thumbnail: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-niacinamide", title: "Niacinamide 10% Serum", description: "Lightweight serum that helps visibly balance excess oil and refine pores.", price: 12, category: "serums", skinTypes: ["oily", "combination", "normal"], thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-hyaluronic", title: "Hyaluronic Acid Hydrating Serum", description: "Hydrating serum formulated to help skin look smooth and plump.", price: 15, category: "serums", skinTypes: ["dry", "normal", "sensitive"], thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-sunscreen", title: "Daily Mineral Sunscreen SPF 50", description: "Broad-spectrum sunscreen for everyday protection against UVA and UVB rays.", price: 28, category: "sunscreen", skinTypes: ["all"], thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-toner", title: "Alcohol-Free Calming Toner", description: "Gentle toner that refreshes and hydrates sensitive or dry skin.", price: 14, category: "toners", skinTypes: ["dry", "sensitive", "normal"], thumbnail: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-bha", title: "2% BHA Pore Clarifying Toner", description: "Leave-on exfoliating toner that helps unclog pores and smooth texture.", price: 20, category: "toners", skinTypes: ["oily", "combination"], thumbnail: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-vitamin-c", title: "Vitamin C Brightening Serum", description: "Antioxidant serum that helps improve dullness and uneven-looking tone.", price: 22, category: "serums", skinTypes: ["normal", "dry", "combination"], thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-cleansing-balm", title: "Nourishing Cleansing Balm", description: "Melting balm cleanser that removes makeup and daily buildup while nourishing skin.", price: 26, category: "skin-care", skinTypes: ["dry", "normal", "sensitive"], thumbnail: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-retinol", title: "Gentle Retinol Night Serum", description: "Nighttime treatment designed to improve the appearance of fine lines and texture.", price: 25, category: "anti-aging", audience: ["women", "men"], skinTypes: ["normal", "oily", "combination"], thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "aging-peptide", title: "Advanced Peptide Firming Serum", description: "A lightweight peptide serum that supports firmer-looking skin and helps soften fine lines.", price: 38, category: "anti-aging", audience: ["women", "men"], skinTypes: ["all"], thumbnail: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "aging-wrinkle-cream", title: "Wrinkle Defense Face Cream", description: "Rich daily cream formulated with hydrating and smoothing ingredients for mature skin.", price: 42, category: "anti-aging", audience: ["women"], skinTypes: ["dry", "normal", "sensitive"], thumbnail: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "aging-men-cream", title: "Men's Firming Moisturizer", description: "Fast-absorbing anti-aging moisturizer that hydrates and helps improve the look of rough texture.", price: 34, category: "anti-aging", audience: ["men"], skinTypes: ["normal", "oily", "combination"], thumbnail: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "aging-eye", title: "Renewing Caffeine Eye Treatment", description: "Cooling eye treatment that helps reduce the appearance of puffiness and crow's feet.", price: 29, category: "anti-aging", audience: ["women", "men"], skinTypes: ["all"], thumbnail: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "aging-neck", title: "Lift & Firm Neck Cream", description: "Nourishing cream for the neck and décolletage to help visibly smooth and firm the skin.", price: 36, category: "anti-aging", audience: ["women", "men"], skinTypes: ["dry", "normal", "sensitive"], thumbnail: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-eye-cream", title: "Hydrating Firming Eye Cream", description: "A gentle eye cream that hydrates, smooths, and helps reduce the look of fine lines.", price: 32, category: "eye-cream", audience: ["women", "men"], skinTypes: ["dry", "normal", "sensitive"], thumbnail: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-exfoliator", title: "Gentle Renewal Exfoliator", description: "A smoothing face exfoliator that helps remove dull surface cells and refine texture.", price: 24, category: "exfoliator", audience: ["women", "men"], skinTypes: ["normal", "oily", "combination"], thumbnail: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-aging-cream", title: "Daily Anti-Aging Face Cream", description: "A nourishing anti-aging cream that helps improve firmness and the appearance of wrinkles.", price: 40, category: "anti-aging-cream", audience: ["women", "men"], skinTypes: ["dry", "normal", "sensitive"], thumbnail: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
  { id: "care-lip-care", title: "Restoring Overnight Lip Care", description: "A conditioning lip treatment that softens dry lips and supports a smoother, healthy-looking finish.", price: 16, category: "lip-care", audience: ["women", "men"], skinTypes: ["all"], thumbnail: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80", source: "PoseyGlow Collection" },
];

function normalizeTitle(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function inferCategory(product) {
  const text = `${product.product_type || ""} ${product.category || ""} ${product.name || ""}`.toLowerCase();
  if (text.includes("eye") && text.includes("cream")) return "eye-cream";
  if (text.includes("exfoliat") || text.includes("scrub")) return "exfoliator";
  if ((text.includes("anti-aging") || text.includes("anti aging") || text.includes("wrinkle") || text.includes("firming")) && text.includes("cream")) return "anti-aging-cream";
  if (text.includes("lip") && (text.includes("balm") || text.includes("care") || text.includes("treatment") || text.includes("mask"))) return "lip-care";
  if (text.includes("toner") || text.includes("exfoliant")) return "toners";
  if (text.includes("serum") || text.includes("serums")) return "serums";
  if (text.includes("sun") || text.includes("spf")) return "sunscreen";
  return "skin-care";
}

function isSkinCareProduct(product) {
  const text = `${product.product_type || ""} ${product.category || ""} ${product.name || ""}`.toLowerCase();
  const allowed = [
    "moisturizer", "cleanser", "serum", "toner", "sunscreen",
    "sun screen", "spf", "cream", "balm",
    "treatment", "hydrator", "essence", "mask", "oil",
  ];
  const excluded = [
    "lipstick", "lip liner", "lip gloss", "mascara", "eyeliner",
    "eyeshadow", "foundation", "concealer", "blush", "bronzer",
    "primer", "highlighter", "powder", "nail", "brow",
  ];

  return allowed.some((term) => text.includes(term))
    && !excluded.some((term) => text.includes(term));
}

function inferSkinTypes(product) {
  const text = `${product.name || ""} ${product.description || ""} ${product.tag_list?.join(" ") || ""}`.toLowerCase();
  const types = [];
  if (text.includes("dry") || text.includes("hydr") || text.includes("moistur")) types.push("dry");
  if (text.includes("oily") || text.includes("acne") || text.includes("pore")) types.push("oily");
  if (text.includes("sensitive") || text.includes("gentle") || text.includes("irrit")) types.push("sensitive");
  if (text.includes("combination")) types.push("combination");
  if (text.includes("normal") || types.length === 0) types.push("normal");
  return [...new Set(types)];
}

function inferAudience(product) {
  const text = `${product.name || ""} ${product.description || ""}`.toLowerCase();
  if (text.includes("men")) return ["men"];
  if (text.includes("women")) return ["women"];
  return ["women", "men"];
}

function normalizeMakeupProduct(product) {
  return {
    id: `makeup-${product.id}`,
    title: product.name,
    description: product.description || `${product.brand || ""} ${product.name || ""}`.trim(),
    price: Number(product.price) || 0,
    category: inferCategory(product),
    audience: inferAudience(product),
    skinTypes: inferSkinTypes(product),
    thumbnail: product.image_link || product.api_featured_image || "",
    source: "Makeup API",
  };
}

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [skinType, setSkinType] = useState("all");
  const [audience, setAudience] = useState("all");

  useEffect(() => {
    async function loadProducts() {
      try {
        const [makeupResponses, localResponse] = await Promise.all([
          Promise.allSettled(
            ["moisturizer", "cleanser", "serum", "toner", "sunscreen"].map((type) =>
              fetch(`${MAKEUP_API}?product_type=${type}`).then((response) => {
                if (!response.ok) throw new Error(`Could not load ${type}`);
                return response.json();
              })
            )
          ),
          fetch(PRODUCTS_API).then((response) =>
            response.ok ? response.json() : []
          ),
        ]);

        const makeupProducts = makeupResponses
          .filter((response) => response.status === "fulfilled")
          .flatMap((response) => response.value)
          .filter((product) => product?.name && isSkinCareProduct(product));

        const normalized = makeupProducts
          .map(normalizeMakeupProduct)
          .filter((product) => product.title && (product.thumbnail || product.description));

        const uniqueProducts = [];
        const seenTitles = new Set();
        normalized.forEach((product) => {
          const normalizedTitle = normalizeTitle(product.title);
          if (normalizedTitle && !seenTitles.has(normalizedTitle)) {
            seenTitles.add(normalizedTitle);
            uniqueProducts.push(product);
          }
        });

        const catalog = uniqueProducts.length
          ? [...SKINCARE_FALLBACK.filter((fallback) =>
              !uniqueProducts.some((live) => normalizeTitle(live.title) === normalizeTitle(fallback.title))
            ), ...uniqueProducts]
          : SKINCARE_FALLBACK;

        setProducts([...localResponse, ...catalog]);
      } catch {
        try {
          const localResponse = await fetch(PRODUCTS_API).then((response) => response.json());
          setProducts([...localResponse, ...SKINCARE_FALLBACK]);
        } catch {
          setProducts(SKINCARE_FALLBACK);
        }
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) return <p className="p-6">Loading skincare products...</p>;

  const visibleProducts = products.filter((product) => {
    const searchText = `${product.title || ""} ${product.description || ""}`.toLowerCase();
    return searchText.includes(search.toLowerCase().trim())
      && (category === "all" || product.category === category)
      && (!product.skinTypes || skinType === "all" || product.skinTypes.includes("all") || product.skinTypes.includes(skinType))
      && (audience === "all" || !product.audience || product.audience.includes(audience));
  });

  const categories = [
    { value: "all", label: "All products" },
    { value: "anti-aging", label: "Anti-aging" },
    { value: "eye-cream", label: "Eye cream" },
    { value: "exfoliator", label: "Exfoliator" },
    { value: "anti-aging-cream", label: "Anti-aging cream" },
    { value: "lip-care", label: "Lip care" },
    { value: "toners", label: "Toners" },
    { value: "serums", label: "Serums" },
    { value: "sunscreen", label: "Sun care" },
  ];

  const skinTypes = [
    { value: "all", label: "All skin types" },
    { value: "oily", label: "Oily" },
    { value: "dry", label: "Dry" },
    { value: "normal", label: "Normal" },
    { value: "combination", label: "Combination" },
    { value: "sensitive", label: "Sensitive" },
  ];

  const audiences = [
    { value: "all", label: "Women & Men" },
    { value: "women", label: "For Women" },
    { value: "men", label: "For Men" },
  ];

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row md:items-start">
      <aside className="w-full shrink-0 rounded-xl border border-[#e5d8c3] bg-white/80 p-5 shadow-sm md:sticky md:top-6 md:w-64">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-[#7b5c50]">Categories</h2>
        <nav className="mb-6 space-y-1" aria-label="Product categories">
          {categories.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCategory(option.value)}
              aria-pressed={category === option.value}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                category === option.value
                  ? "bg-pink-800 font-semibold text-white"
                  : "text-[#4c4039] hover:bg-pink-50 hover:text-pink-900"
              }`}
            >
              {option.label}
            </button>
          ))}
        </nav>

        <h2 className="mb-3 border-t border-[#eadfd0] pt-5 text-sm font-bold uppercase tracking-widest text-[#7b5c50]">
          Skin Type
        </h2>
        <nav className="space-y-1" aria-label="Skin types">
          {skinTypes.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSkinType(option.value)}
              aria-pressed={skinType === option.value}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                skinType === option.value
                  ? "bg-[#d8ad91] font-semibold text-[#30241f]"
                  : "text-[#4c4039] hover:bg-[#f4e8da]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </nav>

        <h2 className="mb-3 border-t border-[#eadfd0] pt-5 text-sm font-bold uppercase tracking-widest text-[#7b5c50]">
          Audience
        </h2>
        <nav className="space-y-1" aria-label="Target audience">
          {audiences.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAudience(option.value)}
              aria-pressed={audience === option.value}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                audience === option.value
                  ? "bg-[#d8ad91] font-semibold text-[#30241f]"
                  : "text-[#4c4039] hover:bg-[#f4e8da]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-bold">Our Products</h1>
          <label className="w-full sm:w-72">
            <span className="mb-1 block text-sm font-semibold">Search products</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or description"
              className="w-full rounded-lg border border-[#d9cbb8] bg-white px-3 py-2"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.length === 0 && <p>No products match these filters.</p>}
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Products;