import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Products from './pages/Products'
import ProductDetails from './pages/productDetails'
import AddProduct from './pages/addProduct'
import Cart from './pages/Cart'

function App() {
  const [cart, setCart] = useState([])

  const addToCart = (product) => setCart([...cart, product])

  return (
    <>
      <header className="border-b px-6 py-4 text-center">
        <h1 className="text-3xl font-bold tracking-wide">PoseyGlow</h1>
      </header>
      <Routes>
        <Route path="/" element={<Products addToCart={addToCart} />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
        <Route path="/products/:id" element={<ProductDetails addToCart={addToCart} />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/cart" element={<Cart cart={cart} />} />
      </Routes>
    </>
  )
}

export default App