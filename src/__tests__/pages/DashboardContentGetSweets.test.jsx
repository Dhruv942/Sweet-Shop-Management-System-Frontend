import { render, screen, waitFor } from "@testing-library/react";
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

describe("DashboardContent - Get Sweets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  test("calls getAllSweets API when component mounts", async () => {
    const mockSweets = [
      {
        id: 1,
        name: "Gulab Jamun",
        category: "Traditional",
        price: 50,
        stock: 100,
        quantity: 100,
        image: "https://example.com/gulab-jamun.jpg",
      },
    ];

    sweetsService.getAllSweets.mockResolvedValue(mockSweets);

    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(sweetsService.getAllSweets).toHaveBeenCalled();
    });
  });

  test("displays sweets from API response in the table", async () => {
    const mockSweets = [
      {
        id: 1,
        name: "Jalebi",
        category: "Traditional",
        price: 60,
        stock: 50,
        quantity: 50,
        image: "https://example.com/jalebi.jpg",
      },
      {
        id: 2,
        name: "Barfi",
        category: "Milk",
        price: 70,
        stock: 30,
        quantity: 30,
        image: "https://example.com/barfi.jpg",
      },
    ];

    sweetsService.getAllSweets.mockResolvedValue(mockSweets);

    renderWithRouter(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Jalebi")).toBeInTheDocument();
      expect(screen.getByText("Barfi")).toBeInTheDocument();
      expect(screen.getByText("₹60")).toBeInTheDocument();
      expect(screen.getByText("₹70")).toBeInTheDocument();
    });
  });
});

