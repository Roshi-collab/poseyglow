import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { CartProvider } from "../CartContext";
import { expect, it } from "vitest";

it("shows an empty cart on the cart route", () => {
  render(
    <MemoryRouter initialEntries={["/cart"]}>
      <CartProvider><App /></CartProvider>
    </MemoryRouter>
  );

  expect(screen.getByText("Your Shopping Cart")).toBeInTheDocument();
  expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
});
