import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./productCard";
import { SKINCARE_FALLBACK } from "../productsData";

const MAKEUP_API = "https://makeup-api.herokuapp.com/api/v1/products.json";
const PRODUCTS_API = "http://localhost:3001/products";

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

const concernAliases = {
  acne: ["acne", "pore", "clarifying", "exfoliat"],
  melasma: ["melasma", "dark spot", "brighten", "uneven", "vitamin c"],
  aging: ["aging", "fine line", "wrinkle", "firm", "retinol", "peptide"],
  "under-eyes": ["eye", "caffeine", "puffiness", "dark"],
  texture: ["texture", "exfoliat", "dull", "smooth"],
  sensitive: ["sensitive", "gentle", "calming", "irrit"],
  "chapped lips": ["lip", "balm", "dry", "conditioning"],
  "cold sores": ["lip", "cold sore", "irritation"],
};

function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [skinType, setSkinType] = useState("all");
  const [audience, setAudience] = useState("all");

  useEffect(() => {
    const initialCategory = searchParams.get("category") || "all";
    const initialSkinType = searchParams.get("skinType") || "all";
    const initialAudience = searchParams.get("audience") || "all";
    const initialSearch = searchParams.get("search") || "";

    setCategory(initialCategory);
    setSkinType(initialSkinType);
    setAudience(initialAudience);
    setSearch(initialSearch);
  }, [searchParams]);

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
    const normalizedSearch = search.toLowerCase().trim();
    const aliases = concernAliases[normalizedSearch];
    const matchesSearch = !normalizedSearch
      || searchText.includes(normalizedSearch)
      || (aliases && aliases.some((alias) => searchText.includes(alias)));

    return matchesSearch
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Products;