function Cart({ cart, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="flex items-center gap-4 border-b py-2">
              <img src={item.thumbnail} alt={item.title} className="h-16" />
              <span className="flex-1">{item.title}</span>
              <span>${item.price}</span>
              <button
                onClick={() => removeFromCart(index)}
                className="rounded bg-pink-800 px-3 py-1 text-white transition-colors hover:bg-pink-900"
              >
                Remove
              </button>
            </div>
          ))}
          <p className="font-bold mt-4">Total: ${total.toFixed(2)}</p>
        </>
      )}
    </div>
  );
}

export default Cart;