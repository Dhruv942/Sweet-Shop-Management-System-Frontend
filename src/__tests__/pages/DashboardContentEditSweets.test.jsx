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
    getCurrentUser: jest.fn(() => ({ role: "admin" })),
  },
}));

jest.mock("../../services/sweetsService", () => ({
  sweetsService: {
    getAllSweets: jest.fn(),
    updateSweet: jest.fn(),
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

describe("DashboardContent - Edit Sweet", () => {
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
    ]);
  });

  test("opens edit modal when Edit button is clicked with sweet data pre-filled", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    const editButton = editButtons[0];
    await user.click(editButton);

    expect(screen.getByText("Edit Sweet")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Gulab Jamun")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Traditional")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
  });

  test("calls updateSweet API and updates the sweet when form is submitted", async () => {
    const user = userEvent.setup();
    const updatedSweet = {
      id: 1,
      name: "Gulab Jamun Updated",
      category: "Premium",
      price: 60,
      stock: 120,
      quantity: 120,
      image: "https://example.com/gulab-jamun.jpg",
    };

    sweetsService.updateSweet.mockResolvedValue(updatedSweet);

    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Edit Sweet")).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue("Gulab Jamun");
    await user.clear(nameInput);
    await user.type(nameInput, "Gulab Jamun Updated");

    const categoryInput = screen.getByDisplayValue("Traditional");
    await user.clear(categoryInput);
    await user.type(categoryInput, "Premium");

    const priceInput = screen.getByDisplayValue("50");
    await user.clear(priceInput);
    await user.type(priceInput, "60");

    const stockInput = screen.getByDisplayValue("100");
    await user.clear(stockInput);
    await user.type(stockInput, "120");

    const updateButton = screen.getByRole("button", { name: /update sweet/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(sweetsService.updateSweet).toHaveBeenCalledWith(1, {
        name: "Gulab Jamun Updated",
        category: "Premium",
        price: "60",
        stock: "120",
        image: "https://example.com/gulab-jamun.jpg",
      });
    });

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByText("Edit Sweet")).not.toBeInTheDocument();
    });

    // Verify the sweet is updated in the table
    expect(screen.getByText("Gulab Jamun Updated")).toBeInTheDocument();
  });
});

