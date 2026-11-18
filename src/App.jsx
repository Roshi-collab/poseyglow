import { Link, Route, Routes } from 'react-router-dom'

import Products from './pages/Products'
import ProductDetails from './pages/productDetails'
import AddProduct from './pages/addProduct'
import Cart from './pages/Cart'
import { useCart } from './CartContext'

function App() {
  const { cart } = useCart()

  return (
    <>
      <header className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
        <Link to="/" className="text-2xl font-bold tracking-wide sm:text-3xl">
          PoseyGlow
        </Link>
        <nav className="flex gap-3 text-sm sm:gap-5" aria-label="Main navigation">
          <Link to="/products">Products</Link>
          <Link to="/add-product">Add product</Link>
          <Link to="/cart">Cart ({cart.length})</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  )
}

export default App