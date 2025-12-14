import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "../../auth/Register";

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders register form", () => {
    render(<Register />);

    expect(screen.getByText("User Register")).toBeInTheDocument();
    expect(screen.getByText("Create your account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  test("renders email and password input fields with correct placeholders", () => {
    render(<Register />);

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
  });

  test("handles email input changes", async () => {
    const user = userEvent.setup();
    render(<Register />);

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "user@example.com");

    expect(emailInput).toHaveValue("user@example.com");
  });

  test("handles password input changes", async () => {
    const user = userEvent.setup();
    render(<Register />);

    const passwordInput = screen.getByLabelText("Password");
    await user.type(passwordInput, "password123");

    expect(passwordInput).toHaveValue("password123");
  });

  test("shows error message when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<Register />);

    const submitButton = screen.getByRole("button", { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
    });
  });

  test("shows error message when email is empty", async () => {
    const user = userEvent.setup();
    render(<Register />);

    const passwordInput = screen.getByLabelText("Password");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
    });
  });

  test("shows error message when password is empty", async () => {
    const user = userEvent.setup();
    render(<Register />);

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "user@example.com");

    const submitButton = screen.getByRole("button", { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
    });
  });

  test("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(<Register />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /register/i });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Button should show loading state
    expect(screen.getByText("Registering...")).toBeInTheDocument();

    // Wait for form submission to complete
    await waitFor(
      () => {
        expect(window.alert).toHaveBeenCalledWith("Registration successful!");
      },
      { timeout: 2000 }
    );
  });

  test("disables inputs during submission", async () => {
    const user = userEvent.setup();
    render(<Register />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /register/i });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Inputs should be disabled during loading
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  test("clears form after successful submission", async () => {
    const user = userEvent.setup();
    render(<Register />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /register/i });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Wait for submission to complete and form to reset
    await waitFor(
      () => {
        expect(emailInput).toHaveValue("");
        expect(passwordInput).toHaveValue("");
      },
      { timeout: 2000 }
    );
  });

  test("renders login link", () => {
    render(<Register />);

    const loginLink = screen.getByText("Login here");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "#");
  });

  test("renders 'Already have an account?' text", () => {
    render(<Register />);

    expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument();
  });
});
