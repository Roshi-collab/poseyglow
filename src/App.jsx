import { Link, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/productDetails'
import AddProduct from './pages/addProduct'
import Cart from './pages/Cart'
import { useCart } from './CartContext'

function App() {
  const { cart } = useCart()

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand-wordmark" aria-label="Olvera home">
          <img src="/olvera-logo.svg" alt="Olvera" />
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link to="/products">Shop</Link>
          <Link to="/#about">Our story</Link>
          <Link to="/add-product">Add product</Link>
          <Link to="/cart" className="nav-cart">Bag ({cart.length})</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  )
}

export default App