import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import DashboardContent from "../../pages/DashboardContent";
import { authService } from "../../services/authService";
import { sweetsService } from "../../services/sweetsService";

jest.mock("../../services/authService", () => ({
  authService: {
    logout: jest.fn(),
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => ({
      email: "admin@example.com",
      role: "admin",
    })),
  },
}));

jest.mock("../../services/sweetsService", () => ({
  sweetsService: {
    getAllSweets: jest.fn(),
    restockSweet: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("DashboardContent - Restock Sweet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
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

  test("opens restock modal when Restock button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const restockButtons = screen.getAllByRole("button", { name: /restock/i });
    await user.click(restockButtons[0]);

    expect(screen.getByText(/restock gulab jamun/i)).toBeInTheDocument();
    expect(screen.getByText(/current stock: 100/i)).toBeInTheDocument();
  });

  test("displays current stock in restock modal", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Rasgulla")).toBeInTheDocument();
    });

    const restockButtons = screen.getAllByRole("button", { name: /restock/i });
    await user.click(restockButtons[1]); // Click Rasgulla restock button

    expect(screen.getByText(/restock rasgulla/i)).toBeInTheDocument();
    expect(screen.getByText(/current stock: 80/i)).toBeInTheDocument();
  });

  test("handles quantity input changes in restock modal", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const restockButtons = screen.getAllByRole("button", { name: /restock/i });
    await user.click(restockButtons[0]);

    const quantityInput = screen.getByPlaceholderText("Quantity to add");
    await user.type(quantityInput, "50");

    expect(quantityInput).toHaveValue(50);
  });

  test("calls restockSweet API when form is submitted", async () => {
    const user = userEvent.setup();
    const restockedSweet = {
      id: 1,
      name: "Gulab Jamun",
      category: "Traditional",
      price: 50,
      stock: 150,
      quantity: 150,
      image: "https://example.com/gulab-jamun.jpg",
    };

    sweetsService.restockSweet.mockResolvedValue(restockedSweet);

    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const restockButtons = screen.getAllByRole("button", { name: /restock/i });
    await user.click(restockButtons[0]);

    const quantityInput = screen.getByPlaceholderText("Quantity to add");
    await user.type(quantityInput, "50");

    const submitButton = screen.getByRole("button", { name: /restock/i, type: "submit" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(sweetsService.restockSweet).toHaveBeenCalledWith(1, 50);
    });
  });

  test("updates sweet stock after successful restock", async () => {
    const user = userEvent.setup();
    const restockedSweet = {
      id: 1,
      name: "Gulab Jamun",
      category: "Traditional",
      price: 50,
      stock: 150,
      quantity: 150,
      image: "https://example.com/gulab-jamun.jpg",
    };

    sweetsService.restockSweet.mockResolvedValue(restockedSweet);

    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument(); // Initial stock
    });

    const restockButtons = screen.getAllByRole("button", { name: /restock/i });
    await user.click(restockButtons[0]);

    const quantityInput = screen.getByPlaceholderText("Quantity to add");
    await user.type(quantityInput, "50");

    const submitButton = screen.getByRole("button", { name: /restock/i, type: "submit" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(sweetsService.restockSweet).toHaveBeenCalledWith(1, 50);
      // Modal should close
      expect(screen.queryByText(/restock gulab jamun/i)).not.toBeInTheDocument();
    });

    // Stock should be updated (assuming API integration updates the state)
    // This test will need to be updated once API integration is complete
  });

  test("closes restock modal when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const restockButtons = screen.getAllByRole("button", { name: /restock/i });
    await user.click(restockButtons[0]);

    expect(screen.getByText(/restock gulab jamun/i)).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText(/restock gulab jamun/i)).not.toBeInTheDocument();
    });
  });
});

