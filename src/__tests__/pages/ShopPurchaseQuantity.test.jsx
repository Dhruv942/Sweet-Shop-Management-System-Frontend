import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Shop from "../../pages/Shop";
import { sweetsService } from "../../services/sweetsService";
import { authService } from "../../services/authService";

jest.mock("../../services/sweetsService", () => ({
  sweetsService: {
    getAllSweets: jest.fn(),
    purchaseSweet: jest.fn(),
  },
}));

jest.mock("../../services/authService", () => ({
  authService: {
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => ({
      email: "user@example.com",
      role: "user",
    })),
  },
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Shop - Purchase Sweet with Quantity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sweetsService.getAllSweets.mockResolvedValue([
      {
        id: 1,
        name: "Gulab Jamun",
        category: "Traditional",
        price: 50,
        stock: 100,
        quantity: 100,
        image: "https://example.com/gulab-jamun.jpg",
      },
      {
        id: 2,
        name: "Rasgulla",
        category: "Traditional",
        price: 45,
        stock: 80,
        quantity: 80,
        image: "https://example.com/rasgulla.jpg",
      },
    ]);
  });

  test("displays quantity input field for each sweet", async () => {
    renderWithRouter(<Shop />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const quantityInputs = screen.getAllByRole("spinbutton");
    expect(quantityInputs.length).toBeGreaterThan(0);
    expect(quantityInputs[0]).toHaveValue(1);
  });

  test("allows user to change quantity", async () => {
    renderWithRouter(<Shop />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const quantityInputs = screen.getAllByRole("spinbutton");
    const firstInput = quantityInputs[0];

    fireEvent.change(firstInput, { target: { value: "5" } });

    expect(firstInput).toHaveValue(5);
  });

  test("calls purchaseSweet API with correct quantity when Buy button is clicked", async () => {
    const user = userEvent.setup();
    const purchasedSweet = {
      id: 1,
      name: "Gulab Jamun",
      category: "Traditional",
      price: 50,
      stock: 95,
      quantity: 95,
      image: "https://example.com/gulab-jamun.jpg",
    };

    sweetsService.purchaseSweet.mockResolvedValue(purchasedSweet);

    renderWithRouter(<Shop />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const quantityInputs = screen.getAllByRole("spinbutton");
    const firstInput = quantityInputs[0];

    fireEvent.change(firstInput, { target: { value: "5" } });

    const buyButtons = screen.getAllByRole("button", { name: /buy/i });
    await user.click(buyButtons[0]);

    await waitFor(() => {
      expect(sweetsService.purchaseSweet).toHaveBeenCalledWith(1, 5);
    });
  });

  test("calls purchaseSweet API with default quantity 1 when quantity is not changed", async () => {
    const user = userEvent.setup();
    const purchasedSweet = {
      id: 1,
      name: "Gulab Jamun",
      category: "Traditional",
      price: 50,
      stock: 99,
      quantity: 99,
      image: "https://example.com/gulab-jamun.jpg",
    };

    sweetsService.purchaseSweet.mockResolvedValue(purchasedSweet);

    renderWithRouter(<Shop />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const buyButtons = screen.getAllByRole("button", { name: /buy/i });
    await user.click(buyButtons[0]);

    await waitFor(() => {
      expect(sweetsService.purchaseSweet).toHaveBeenCalledWith(1, 1);
    });
  });

  test("disables Buy button when quantity exceeds stock", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Shop />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const quantityInputs = screen.getAllByRole("spinbutton");
    const firstInput = quantityInputs[0];

    await user.clear(firstInput);
    await user.type(firstInput, "101");

    const buyButtons = screen.getAllByRole("button", { name: /buy/i });
    expect(buyButtons[0]).toBeDisabled();
  });

  test("disables Buy button when quantity is less than 1", async () => {
    renderWithRouter(<Shop />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const quantityInputs = screen.getAllByRole("spinbutton");
    const firstInput = quantityInputs[0];

    fireEvent.change(firstInput, { target: { value: "0" } });

    await waitFor(() => {
      const buyButtons = screen.getAllByRole("button", { name: /buy/i });
      expect(buyButtons[0]).toBeDisabled();
    });
  });

  test("updates sweet stock correctly after purchase with quantity", async () => {
    const user = userEvent.setup();
    const purchasedSweet = {
      id: 1,
      name: "Gulab Jamun",
      category: "Traditional",
      price: 50,
      stock: 95,
      quantity: 95,
      image: "https://example.com/gulab-jamun.jpg",
    };

    sweetsService.purchaseSweet.mockResolvedValue(purchasedSweet);

    renderWithRouter(<Shop />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });

    const quantityInputs = screen.getAllByRole("spinbutton");
    const firstInput = quantityInputs[0];

    fireEvent.change(firstInput, { target: { value: "5" } });

    const buyButtons = screen.getAllByRole("button", { name: /buy/i });
    await user.click(buyButtons[0]);

    await waitFor(() => {
      expect(sweetsService.purchaseSweet).toHaveBeenCalled();
      expect(screen.getByText("95")).toBeInTheDocument();
    });
  });

  test("shows success message after successful purchase with quantity", async () => {
    const user = userEvent.setup();
    const purchasedSweet = {
      id: 1,
      name: "Gulab Jamun",
      category: "Traditional",
      price: 50,
      stock: 95,
      quantity: 95,
      image: "https://example.com/gulab-jamun.jpg",
    };

    sweetsService.purchaseSweet.mockResolvedValue(purchasedSweet);

    renderWithRouter(<Shop />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const quantityInputs = screen.getAllByRole("spinbutton");
    const firstInput = quantityInputs[0];

    fireEvent.change(firstInput, { target: { value: "5" } });

    const buyButtons = screen.getAllByRole("button", { name: /buy/i });
    await user.click(buyButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/purchase successful/i)).toBeInTheDocument();
    });
  });

  test("shows error message when purchase fails with quantity", async () => {
    const user = userEvent.setup();
    sweetsService.purchaseSweet.mockRejectedValue(
      new Error("Insufficient stock")
    );

    renderWithRouter(<Shop />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const quantityInputs = screen.getAllByRole("spinbutton");
    const firstInput = quantityInputs[0];

    fireEvent.change(firstInput, { target: { value: "10" } });

    const buyButtons = screen.getAllByRole("button", { name: /buy/i });
    await user.click(buyButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/insufficient stock/i)).toBeInTheDocument();
    });
  });
});

