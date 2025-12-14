import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import DashboardContent from "../../pages/DashboardContent";
import { authService } from "../../services/authService";

// Mock the authService
jest.mock("../../services/authService", () => ({
  authService: {
    logout: jest.fn(),
    isAuthenticated: jest.fn(() => true),
    getCurrentUser: jest.fn(() => ({ role: "admin" })),
  },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("DashboardContent - Add Sweet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  test("renders dashboard with Add New Sweet button", () => {
    renderWithRouter(<DashboardContent />);

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add new sweet/i })).toBeInTheDocument();
  });

  test("opens add sweet modal when Add New Sweet button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    expect(screen.getByText("Add New Sweet")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Price (₹)")).toBeInTheDocument();
    expect(screen.getByLabelText("Stock")).toBeInTheDocument();
    expect(screen.getByLabelText("Image URL")).toBeInTheDocument();
  });

  test("handles form input changes in add sweet modal", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    // Open modal
    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    // Fill form fields
    const nameInput = screen.getByLabelText("Name");
    const categoryInput = screen.getByLabelText("Category");
    const priceInput = screen.getByLabelText("Price (₹)");
    const stockInput = screen.getByLabelText("Stock");
    const imageInput = screen.getByLabelText("Image URL");

    await user.type(nameInput, "Jalebi");
    await user.type(categoryInput, "Traditional");
    await user.type(priceInput, "60");
    await user.type(stockInput, "50");
    await user.type(imageInput, "https://example.com/jalebi.jpg");

    expect(nameInput).toHaveValue("Jalebi");
    expect(categoryInput).toHaveValue("Traditional");
    expect(priceInput).toHaveValue(60);
    expect(stockInput).toHaveValue(50);
    expect(imageInput).toHaveValue("https://example.com/jalebi.jpg");
  });

  test("closes add sweet modal when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    // Open modal
    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    expect(screen.getByText("Add New Sweet")).toBeInTheDocument();

    // Click cancel
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Add New Sweet")).not.toBeInTheDocument();
    });
  });

  test("adds new sweet to the list when form is submitted", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    // Count initial sweets
    const initialSweets = screen.getAllByRole("row").length - 1; // -1 for header row

    // Open modal
    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    // Fill form
    await user.type(screen.getByLabelText("Name"), "Jalebi");
    await user.type(screen.getByLabelText("Category"), "Traditional");
    await user.type(screen.getByLabelText("Price (₹)"), "60");
    await user.type(screen.getByLabelText("Stock"), "50");
    await user.type(screen.getByLabelText("Image URL"), "https://example.com/jalebi.jpg");

    // Submit form
    const submitButton = screen.getByRole("button", { name: /add sweet/i });
    await user.click(submitButton);

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByText("Add New Sweet")).not.toBeInTheDocument();
    });

    // Check that new sweet is in the list
    expect(screen.getByText("Jalebi")).toBeInTheDocument();
    expect(screen.getByText("Traditional")).toBeInTheDocument();

    // Count sweets after adding
    const newSweets = screen.getAllByRole("row").length - 1;
    expect(newSweets).toBe(initialSweets + 1);
  });

  test("resets form after successful submission", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    // Open modal
    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    // Fill and submit form
    await user.type(screen.getByLabelText("Name"), "Jalebi");
    await user.type(screen.getByLabelText("Category"), "Traditional");
    await user.type(screen.getByLabelText("Price (₹)"), "60");
    await user.type(screen.getByLabelText("Stock"), "50");

    const submitButton = screen.getByRole("button", { name: /add sweet/i });
    await user.click(submitButton);

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByText("Add New Sweet")).not.toBeInTheDocument();
    });

    // Open modal again and verify form is reset
    await user.click(addButton);

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Category")).toHaveValue("");
    expect(screen.getByLabelText("Price (₹)")).toHaveValue(null);
    expect(screen.getByLabelText("Stock")).toHaveValue(null);
  });

  test("converts price and stock to numbers when adding sweet", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    // Open modal
    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    // Fill form with numeric values as strings
    await user.type(screen.getByLabelText("Name"), "Barfi");
    await user.type(screen.getByLabelText("Category"), "Milk");
    await user.type(screen.getByLabelText("Price (₹)"), "70");
    await user.type(screen.getByLabelText("Stock"), "30");

    // Submit form
    const submitButton = screen.getByRole("button", { name: /add sweet/i });
    await user.click(submitButton);

    // Wait for modal to close and sweet to appear
    await waitFor(() => {
      expect(screen.getByText("Barfi")).toBeInTheDocument();
    });

    // Verify the values are displayed correctly (converted to numbers)
    expect(screen.getByText("₹70")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  test("shows required field validation when submitting empty form", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    // Open modal
    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    // Try to submit without filling form
    const submitButton = screen.getByRole("button", { name: /add sweet/i });
    await user.click(submitButton);

    // Form should not submit (HTML5 validation prevents submission)
    // Modal should still be visible
    expect(screen.getByText("Add New Sweet")).toBeInTheDocument();

    // Name field should be required
    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toBeRequired();
  });

  test("multiple sweets can be added sequentially", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    // Add first sweet
    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    await user.type(screen.getByLabelText("Name"), "Jalebi");
    await user.type(screen.getByLabelText("Category"), "Traditional");
    await user.type(screen.getByLabelText("Price (₹)"), "60");
    await user.type(screen.getByLabelText("Stock"), "50");

    await user.click(screen.getByRole("button", { name: /add sweet/i }));

    await waitFor(() => {
      expect(screen.queryByText("Add New Sweet")).not.toBeInTheDocument();
    });

    // Add second sweet
    await user.click(addButton);

    await user.type(screen.getByLabelText("Name"), "Barfi");
    await user.type(screen.getByLabelText("Category"), "Milk");
    await user.type(screen.getByLabelText("Price (₹)"), "70");
    await user.type(screen.getByLabelText("Stock"), "30");

    await user.click(screen.getByRole("button", { name: /add sweet/i }));

    await waitFor(() => {
      expect(screen.queryByText("Add New Sweet")).not.toBeInTheDocument();
    });

    // Verify both sweets are in the list
    expect(screen.getByText("Jalebi")).toBeInTheDocument();
    expect(screen.getByText("Barfi")).toBeInTheDocument();
  });
});

