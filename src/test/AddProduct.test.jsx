import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AddProduct from "../pages/addProduct";

describe("AddProduct", () => {
  it("submits product data and displays a success status", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    render(<AddProduct />);

    await user.type(screen.getByLabelText("Name"), "Glow Serum");
    await user.type(screen.getByLabelText("Description"), "A hydrating serum");
    await user.type(screen.getByLabelText("Price"), "22");
    await user.click(screen.getByRole("button", { name: "Add product" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Product added and saved");
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/products",
      expect.objectContaining({ method: "POST" })
    );
  });
});
