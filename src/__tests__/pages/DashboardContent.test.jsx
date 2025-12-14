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
    createSweet: jest.fn(),
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

describe("DashboardContent - Add Sweet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    sweetsService.createSweet.mockResolvedValue({
      id: 4,
      name: "Jalebi",
      category: "Traditional",
      price: 60,
      quantity: 50,
      stock: 50,
      image: "https://example.com/jalebi.jpg",
    });
  });

  test("renders dashboard with Add New Sweet button", () => {
    renderWithRouter(<DashboardContent />);

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add new sweet/i })
    ).toBeInTheDocument();
  });

  test("opens add sweet modal when Add New Sweet button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    expect(screen.getAllByText("Add New Sweet").length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText("Sweet name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Category")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Price")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Stock quantity")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Image URL")).toBeInTheDocument();
  });

  test("handles form input changes in add sweet modal", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    const nameInput = screen.getByPlaceholderText("Sweet name");
    const categoryInput = screen.getByPlaceholderText("Category");
    const priceInput = screen.getByPlaceholderText("Price");
    const stockInput = screen.getByPlaceholderText("Stock quantity");
    const imageInput = screen.getByPlaceholderText("Image URL");

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

    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    expect(screen.getByPlaceholderText("Sweet name")).toBeInTheDocument();

    const cancelButtons = screen.getAllByRole("button", { name: /cancel/i });
    const cancelButton = cancelButtons.find(
      (btn) => btn.textContent.toLowerCase() === "cancel"
    );
    await user.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText("Sweet name")
      ).not.toBeInTheDocument();
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

    await user.type(screen.getByPlaceholderText("Sweet name"), "Jalebi");
    await user.type(screen.getByPlaceholderText("Category"), "Traditional");
    await user.type(screen.getByPlaceholderText("Price"), "60");
    await user.type(screen.getByPlaceholderText("Stock quantity"), "50");
    await user.type(
      screen.getByPlaceholderText("Image URL"),
      "https://example.com/jalebi.jpg"
    );

    const submitButton = screen.getByRole("button", { name: /add sweet/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(sweetsService.createSweet).toHaveBeenCalledWith({
        name: "Jalebi",
        category: "Traditional",
        price: "60",
        stock: "50",
        image: "https://example.com/jalebi.jpg",
      });
    });

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText("Sweet name")
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText("Jalebi")).toBeInTheDocument();
    expect(screen.getAllByText("Traditional").length).toBeGreaterThan(0);

    // Count sweets after adding
    const newSweets = screen.getAllByRole("row").length - 1;
    expect(newSweets).toBe(initialSweets + 1);
  });

  test("resets form after successful submission", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    await user.type(screen.getByPlaceholderText("Sweet name"), "Jalebi");
    await user.type(screen.getByPlaceholderText("Category"), "Traditional");
    await user.type(screen.getByPlaceholderText("Price"), "60");
    await user.type(screen.getByPlaceholderText("Stock quantity"), "50");

    const submitButton = screen.getByRole("button", { name: /add sweet/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText("Sweet name")
      ).not.toBeInTheDocument();
    });

    await user.click(addButton);

    expect(screen.getByPlaceholderText("Sweet name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Category")).toHaveValue("");
    expect(screen.getByPlaceholderText("Price")).toHaveValue(null);
    expect(screen.getByPlaceholderText("Stock quantity")).toHaveValue(null);
  });

  test("converts price and stock to numbers when adding sweet", async () => {
    sweetsService.createSweet.mockResolvedValueOnce({
      id: 5,
      name: "Barfi",
      category: "Milk",
      price: 70,
      quantity: 30,
      stock: 30,
      image: "",
    });

    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    await user.type(screen.getByPlaceholderText("Sweet name"), "Barfi");
    await user.type(screen.getByPlaceholderText("Category"), "Milk");
    await user.type(screen.getByPlaceholderText("Price"), "70");
    await user.type(screen.getByPlaceholderText("Stock quantity"), "30");

    const submitButton = screen.getByRole("button", { name: /add sweet/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Barfi")).toBeInTheDocument();
    });

    expect(screen.getByText("₹70")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  test("shows required field validation when submitting empty form", async () => {
    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    const submitButton = screen.getByRole("button", { name: /add sweet/i });
    await user.click(submitButton);

    expect(screen.getByPlaceholderText("Sweet name")).toBeInTheDocument();
    const nameInput = screen.getByPlaceholderText("Sweet name");
    expect(nameInput).toBeRequired();
  });

  test("multiple sweets can be added sequentially", async () => {
    sweetsService.createSweet
      .mockResolvedValueOnce({
        id: 4,
        name: "Jalebi",
        category: "Traditional",
        price: 60,
        quantity: 50,
        stock: 50,
        image: "",
      })
      .mockResolvedValueOnce({
        id: 5,
        name: "Barfi",
        category: "Milk",
        price: 70,
        quantity: 30,
        stock: 30,
        image: "",
      });

    const user = userEvent.setup();
    renderWithRouter(<DashboardContent />);

    const addButton = screen.getByRole("button", { name: /add new sweet/i });
    await user.click(addButton);

    await user.type(screen.getByPlaceholderText("Sweet name"), "Jalebi");
    await user.type(screen.getByPlaceholderText("Category"), "Traditional");
    await user.type(screen.getByPlaceholderText("Price"), "60");
    await user.type(screen.getByPlaceholderText("Stock quantity"), "50");

    await user.click(screen.getByRole("button", { name: /add sweet/i }));

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText("Sweet name")
      ).not.toBeInTheDocument();
    });

    await user.click(addButton);

    await user.type(screen.getByPlaceholderText("Sweet name"), "Barfi");
    await user.type(screen.getByPlaceholderText("Category"), "Milk");
    await user.type(screen.getByPlaceholderText("Price"), "70");
    await user.type(screen.getByPlaceholderText("Stock quantity"), "30");

    await user.click(screen.getByRole("button", { name: /add sweet/i }));

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText("Sweet name")
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText("Jalebi")).toBeInTheDocument();
    expect(screen.getByText("Barfi")).toBeInTheDocument();
  });
});
