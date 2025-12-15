import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import UserLogin from "../../components/UserLogin";
import { authService } from "../../services/authService";

// Mock the authService
jest.mock("../../services/authService", () => ({
  authService: {
    login: jest.fn(),
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

describe("UserLogin Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    localStorage.clear();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders login form with all elements", () => {
    renderWithRouter(<UserLogin />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(
      screen.getByText("Sign in to continue your journey")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("handles email and password input changes", async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserLogin />);

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("submits form with valid data and navigates to shop", async () => {
    const user = userEvent.setup();
    authService.login.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                token: "mock-token",
                user: { id: "1", email: "user@example.com" },
              }),
            100
          )
        )
    );

    renderWithRouter(<UserLogin />);

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText("Signing in...")).toBeInTheDocument();
    });

    // Wait for form submission to complete
    await waitFor(
      () => {
        expect(authService.login).toHaveBeenCalledWith(
          "user@example.com",
          "password123"
        );
        expect(mockNavigate).toHaveBeenCalledWith("/shop");
      },
      { timeout: 2000 }
    );
  });

  test("shows error message on API failure", async () => {
    const user = userEvent.setup();
    authService.login.mockRejectedValue(new Error("Invalid credentials"));

    renderWithRouter(<UserLogin />);

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  test("disables inputs and button during submission", async () => {
    const user = userEvent.setup();
    authService.login.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ token: "token", user: {} }), 100)
        )
    );

    renderWithRouter(<UserLogin />);

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Inputs should be disabled during loading
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
