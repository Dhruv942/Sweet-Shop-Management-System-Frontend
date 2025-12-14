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
    deleteSweet: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock window.confirm
const mockConfirm = jest.fn();
window.confirm = mockConfirm;

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("DashboardContent - Delete Sweet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockConfirm.mockReturnValue(true); // Default to confirming deletion
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

  test("calls deleteSweet API when Delete button is clicked and user confirms", async () => {
    const user = userEvent.setup();
    sweetsService.deleteSweet.mockResolvedValue({});

    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this sweet?"
    );

    await waitFor(() => {
      expect(sweetsService.deleteSweet).toHaveBeenCalledWith(1);
    });
  });

  test("removes sweet from the list after successful deletion", async () => {
    const user = userEvent.setup();
    sweetsService.deleteSweet.mockResolvedValue({});

    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
      expect(screen.getByText("Rasgulla")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(sweetsService.deleteSweet).toHaveBeenCalledWith(1);
      expect(screen.queryByText("Gulab Jamun")).not.toBeInTheDocument();
      expect(screen.getByText("Rasgulla")).toBeInTheDocument();
    });
  });

  test("does not delete sweet if user cancels confirmation", async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(false); // User cancels

    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalled();
    expect(sweetsService.deleteSweet).not.toHaveBeenCalled();
    expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
  });

  test("only admin can delete sweets - checks admin email", async () => {
    const user = userEvent.setup();
    // Set admin email
    authService.getCurrentUser.mockReturnValue({
      email: "admin@example.com",
      role: "admin",
    });

    sweetsService.deleteSweet.mockResolvedValue({});

    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons.length).toBeGreaterThan(0); // Delete button should be visible for admin

    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(sweetsService.deleteSweet).toHaveBeenCalled();
    });
  });
});
