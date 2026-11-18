import { useCart } from "../CartContext";

function Cart() {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-4 border-b py-2">
              <img src={item.thumbnail} alt={item.title} className="h-16 w-16 object-contain" />
              <span className="flex-1">{item.title}</span>
              <span>${Number(item.price).toFixed(2)}</span>
              <button
                onClick={() => removeFromCart(index)}
                className="rounded bg-pink-800 px-3 py-1 text-white transition-colors hover:bg-pink-900"
              >
                Remove
              </button>
            </div>
          ))}
          <p className="mt-4 font-bold">Total: ${total.toFixed(2)}</p>
        </>
      )}
    </div>
  );
}

export default Cart;