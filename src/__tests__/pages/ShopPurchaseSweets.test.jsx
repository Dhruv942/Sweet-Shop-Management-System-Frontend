import { render, screen, waitFor } from "@testing-library/react";
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

describe("Shop - Purchase Sweet", () => {
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

  test("displays Buy button for each sweet", async () => {
    renderWithRouter(<Shop />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const buyButtons = screen.getAllByRole("button", { name: /buy/i });
    expect(buyButtons.length).toBeGreaterThan(0);
  });

  test("calls purchaseSweet API when Buy button is clicked", async () => {
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

  test("shows success message after successful purchase", async () => {
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
      expect(screen.getByText(/purchase successful/i)).toBeInTheDocument();
    });
  });

  test("shows error message when purchase fails", async () => {
    const user = userEvent.setup();
    sweetsService.purchaseSweet.mockRejectedValue(
      new Error("Insufficient stock")
    );

    renderWithRouter(<Shop />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const buyButtons = screen.getAllByRole("button", { name: /buy/i });
    await user.click(buyButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/insufficient stock/i)).toBeInTheDocument();
    });
  });

  test("updates sweet stock after successful purchase", async () => {
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
      expect(screen.getByText("100")).toBeInTheDocument(); // Initial stock
    });

    const buyButtons = screen.getAllByRole("button", { name: /buy/i });
    await user.click(buyButtons[0]);

    await waitFor(() => {
      expect(sweetsService.purchaseSweet).toHaveBeenCalled();
      // Stock should be updated to 99
      expect(screen.getByText("99")).toBeInTheDocument();
    });
  });
});
