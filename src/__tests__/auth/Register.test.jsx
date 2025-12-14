import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Register from "../../auth/Register";
import { authService } from "../../services/authService";

// Mock the authService
jest.mock("../../services/authService", () => ({
  authService: {
    register: jest.fn(),
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

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    localStorage.clear();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders register form with all elements", () => {
    renderWithRouter(<Register />);

    expect(screen.getAllByText("Create Account")[0]).toBeInTheDocument();
    expect(
      screen.getByText("Join us and start your journey")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  test("handles email and password input changes", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Register />);

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("submits form with valid data and navigates to login", async () => {
    const user = userEvent.setup();
    authService.register.mockImplementation(
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

    renderWithRouter(<Register />);

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText("Registering...")).toBeInTheDocument();
    });

    // Wait for form submission to complete
    await waitFor(
      () => {
        expect(authService.register).toHaveBeenCalledWith(
          "user@example.com",
          "password123"
        );
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      },
      { timeout: 2000 }
    );
  });

  test("shows error message on API failure", async () => {
    const user = userEvent.setup();
    authService.register.mockRejectedValue(new Error("Email already exists"));

    renderWithRouter(<Register />);

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
  });

  test("disables inputs and button during submission", async () => {
    const user = userEvent.setup();
    authService.register.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ token: "token", user: {} }), 100)
        )
    );

    renderWithRouter(<Register />);

    const emailInput = screen.getByLabelText("Email Address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Inputs should be disabled during loading
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
